#!/usr/bin/env node
/**
 * Production entrypoint (`npm start`).
 *
 * Runs vinext's production server exactly as `vinext start` does, with one
 * addition: HTTP byte-range support for /videos/*.
 *
 * Why: vinext's static file handler always answers with the whole file (200)
 * and never honours `Range:` headers. Chrome copes, but Safari and every
 * browser on iOS refuse to play <video> from a server that can't answer range
 * requests with 206 Partial Content, and seeking is impossible without it.
 *
 * Everything that isn't /videos/* is handed to vinext untouched. If this file
 * fails to start for any reason, package.json's `start` script falls back to
 * plain `vinext start`.
 */
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "dist");
const videosDir = path.join(outDir, "client", "videos");
const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const host = "0.0.0.0";

const VIDEO_TYPES = {
  ".mp4": "video/mp4",
  ".m4v": "video/mp4",
  ".webm": "video/webm",
};

function sendStatus(res, status, headers = {}) {
  res.writeHead(status, { "Content-Length": "0", ...headers });
  res.end();
}

/** Resolves a request path to a file inside the videos directory, or null. */
function resolveVideo(pathname) {
  let relative;
  try {
    relative = decodeURIComponent(pathname.slice("/videos/".length));
  } catch {
    return null;
  }
  if (relative.includes("\0") || relative.includes("\\")) return null;
  const file = path.resolve(videosDir, relative);
  if (!file.startsWith(videosDir + path.sep)) return null;
  const type = VIDEO_TYPES[path.extname(file).toLowerCase()];
  return type ? { file, type } : null;
}

/**
 * Parses a single `bytes=` range against a file of `size` bytes.
 * Returns { start, end } | "unsatisfiable" | null (header absent/ignorable).
 */
function parseRange(header, size) {
  if (!header) return null;
  const match = /^bytes=(\d*)-(\d*)$/i.exec(header.trim());
  if (!match || (match[1] === "" && match[2] === "")) return null; // malformed or multi-range: ignore, send everything
  let start;
  let end;
  if (match[1] === "") {
    const suffix = Number(match[2]); // "last N bytes"
    if (suffix === 0) return "unsatisfiable";
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] === "" ? size - 1 : Math.min(Number(match[2]), size - 1);
  }
  return start >= size || start > end ? "unsatisfiable" : { start, end };
}

async function serveVideo(req, res, pathname) {
  const video = resolveVideo(pathname);
  let info;
  try {
    if (!video) throw new Error("not a video path");
    info = await stat(video.file);
    if (!info.isFile()) throw new Error("not a file");
  } catch {
    return sendStatus(res, 404);
  }

  const size = info.size;
  const etag = `"${size.toString(16)}-${Math.floor(info.mtimeMs).toString(16)}"`;
  const lastModified = info.mtime.toUTCString();
  const validators = {
    ETag: etag,
    "Last-Modified": lastModified,
    "Cache-Control": "public, max-age=86400",
    "Accept-Ranges": "bytes",
  };

  const ifNoneMatch = req.headers["if-none-match"];
  const notModified = ifNoneMatch
    ? ifNoneMatch.split(",").some((tag) => tag.trim() === etag || tag.trim() === "*")
    : req.headers["if-modified-since"] && Date.parse(req.headers["if-modified-since"]) >= Math.floor(info.mtimeMs / 1000) * 1000;
  if (notModified) return sendStatus(res, 304, validators);

  // A stale If-Range means "give me the whole new file", not a slice of it.
  const ifRange = req.headers["if-range"];
  const range = ifRange && ifRange !== etag && ifRange !== lastModified ? null : parseRange(req.headers.range, size);

  if (range === "unsatisfiable") return sendStatus(res, 416, { ...validators, "Content-Range": `bytes */${size}` });

  const start = range ? range.start : 0;
  const end = range ? range.end : size - 1;
  res.writeHead(range ? 206 : 200, {
    ...validators,
    "Content-Type": video.type,
    "Content-Length": String(end - start + 1),
    "X-Content-Type-Options": "nosniff",
    ...(range ? { "Content-Range": `bytes ${start}-${end}/${size}` } : {}),
  });
  if (req.method === "HEAD") return res.end();

  pipeline(createReadStream(video.file, { start, end }), res, () => {
    /* client disconnected mid-stream (normal when seeking); nothing to do */
  });
}

// The same two steps `vinext start` performs: read the .env files, then start the server.
const vinextDist = path.join(root, "node_modules", "vinext", "dist");
const { loadDotenv } = await import(pathToFileURL(path.join(vinextDist, "config", "dotenv.js")).href);
loadDotenv({ root: process.cwd(), mode: "production" });

const { startProdServer } = await import(pathToFileURL(path.join(vinextDist, "server", "prod-server.js")).href);
const { server } = await startProdServer({ port, host, outDir });

// Put the video handler in front of vinext's own request handler.
const vinextListeners = server.listeners("request");
server.removeAllListeners("request");
server.on("request", (req, res) => {
  const pathname = (req.url ?? "/").split("?")[0];
  if (pathname.startsWith("/videos/")) {
    if (req.method !== "GET" && req.method !== "HEAD") return sendStatus(res, 405, { Allow: "GET, HEAD" });
    serveVideo(req, res, pathname).catch(() => {
      if (!res.headersSent) sendStatus(res, 500);
      else res.destroy();
    });
    return;
  }
  for (const listener of vinextListeners) listener.call(server, req, res);
});
console.log("[serve] byte-range support enabled for /videos/*");

// Exit cleanly on redeploys so `npm start`'s fallback doesn't kick in.
for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 3000).unref();
  });
}
