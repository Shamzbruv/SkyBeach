"use client";

import Image from "next/image";
import { type PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { useLiveVideo } from "@/components/LiveVideoProvider";
import {
  type LiveVideo,
  type YouTubeSource,
  formatDuration,
  formatMonthYear,
  isPortrait,
  youtubeEmbedUrl,
} from "@/lib/live-data";

/** Pause before a preview starts, so passing the mouse across the page doesn't load videos. */
const HOVER_DELAY_MS = 220;
const YOUTUBE_ORIGIN = "https://www.youtube-nocookie.com";
/** Seconds of real playback to wait for before fading a YouTube preview in, so no black frame shows. */
const YOUTUBE_REVEAL_AFTER_S = 0.5;

/** Previews are for visitors with a real mouse who haven't asked for less motion or less data. */
function canPreview() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !connection?.saveData
  );
}

function FilePreview({ src, ready, onReady }: { src: string; ready: boolean; onReady: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    ref.current?.play().catch(() => {
      /* The poster simply stays up if the browser refuses. */
    });
  }, []);

  return (
    <video
      ref={ref}
      className={`live-preview${ready ? " is-ready" : ""}`}
      src={src}
      muted
      loop
      autoPlay
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={onReady}
    />
  );
}

/**
 * Silent YouTube preview. The player reports its state over postMessage once it
 * is asked to ("listening"), the same channel YouTube's own IFrame API uses; the
 * preview is only faded in when it is really playing. If that signal never
 * comes (video removed, embedding blocked) the poster simply stays put.
 */
function YouTubePreview({ source, ready, onReady }: { source: YouTubeSource; ready: boolean; onReady: () => void }) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;

    let playing = false;

    const listen = () =>
      iframe.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "widget" }), YOUTUBE_ORIGIN);

    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;
      let message: unknown = event.data;
      if (typeof message === "string") {
        try {
          message = JSON.parse(message);
        } catch {
          return;
        }
      }
      if (!message || typeof message !== "object") return;

      const { event: name, info } = message as { event?: string; info?: unknown };
      if (name === "onStateChange") playing = info === 1; // 1 = playing
      if (name !== "infoDelivery" || !info || typeof info !== "object") return;

      const { playerState, currentTime } = info as { playerState?: number; currentTime?: number };
      if (typeof playerState === "number") playing = playerState === 1;
      if (playing && typeof currentTime === "number" && currentTime >= source.previewStart + YOUTUBE_REVEAL_AFTER_S) onReady();
    };

    iframe.addEventListener("load", listen);
    window.addEventListener("message", onMessage);
    return () => {
      iframe.removeEventListener("load", listen);
      window.removeEventListener("message", onMessage);
    };
  }, [onReady, source.previewStart]);

  return (
    <iframe
      ref={ref}
      className={`live-preview${ready ? " is-ready" : ""}`}
      src={youtubeEmbedUrl(source, "preview", window.location.origin)}
      title="Video preview"
      aria-hidden="true"
      tabIndex={-1}
      allow="autoplay; encrypted-media"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11.04-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}

type LiveVideoCardProps = {
  video: LiveVideo;
  /** "feature" is a large media + story row; "card" is a compact stacked card. */
  variant?: "card" | "feature";
  flipped?: boolean;
};

export function LiveVideoCard({ video, variant = "card", flipped = false }: LiveVideoCardProps) {
  const { open } = useLiveVideo();
  const [previewing, setPreviewing] = useState(false);
  const [ready, setReady] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const hitRef = useRef<HTMLButtonElement>(null);
  const markReady = useCallback(() => setReady(true), []);

  const stopPreview = useCallback(() => {
    window.clearTimeout(timer.current);
    setPreviewing(false);
    setReady(false);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function onPointerEnter(event: PointerEvent) {
    if (event.pointerType !== "mouse" || !canPreview()) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPreviewing(true), HOVER_DELAY_MS);
  }

  function onClick() {
    stopPreview();
    open(video, hitRef.current);
  }

  const { source } = video;
  const orientation = isPortrait(video) ? "portrait" : "landscape";

  return (
    <article
      className={`live-card live-card--${orientation} live-card--${variant}${flipped ? " is-flipped" : ""}`}
      data-provider={source.kind}
    >
      <div
        className={`live-media${ready ? " is-previewing" : previewing ? " is-loading" : ""}`}
        onPointerEnter={onPointerEnter}
        onPointerLeave={stopPreview}
        onPointerCancel={stopPreview}
      >
        <Image
          className="live-poster"
          src={video.poster}
          alt={video.posterAlt}
          fill
          sizes="(max-width: 680px) 94vw, 600px"
          unoptimized
        />
        {previewing &&
          (source.kind === "file" ? (
            <FilePreview src={source.preview} ready={ready} onReady={markReady} />
          ) : (
            <YouTubePreview source={source} ready={ready} onReady={markReady} />
          ))}
        <span className="live-scrim" aria-hidden="true" />
        <span className="live-chip" aria-hidden="true">
          Click to watch with sound
        </span>
        <span className="live-duration" aria-hidden="true">
          {formatDuration(video.durationSeconds)}
        </span>
        <span className="live-play" aria-hidden="true">
          <PlayIcon />
        </span>
        <button
          ref={hitRef}
          type="button"
          className="live-hit"
          aria-label={`Play video: ${video.title}, ${formatDuration(video.durationSeconds)}`}
          onClick={onClick}
        />
      </div>

      <div className="live-copy">
        <p className="live-kicker">{video.kicker}</p>
        <h3>{video.title}</h3>
        <p className="live-story">{video.story}</p>
        {video.quote && (
          <figure className="live-quote">
            <blockquote>{video.quote.text}</blockquote>
            <figcaption>{video.quote.source}</figcaption>
          </figure>
        )}
        <ul className="live-tags">
          {video.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        {source.kind === "youtube" ? (
          <p className="live-credit">
            {video.publishedAt && <>Published {formatMonthYear(video.publishedAt)} · </>}
            <a href={source.channelUrl} target="_blank" rel="noopener noreferrer">
              {source.channel}
            </a>{" "}
            on YouTube
          </p>
        ) : (
          video.link && (
            <p className="live-credit">
              <a href={video.link.href} target="_blank" rel="noopener noreferrer">
                {video.link.label} ↗
              </a>
            </p>
          )
        )}
      </div>
    </article>
  );
}
