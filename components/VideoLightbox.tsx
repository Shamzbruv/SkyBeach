"use client";

import { type CSSProperties, type MouseEvent, type PointerEvent, type SyntheticEvent, useEffect, useLayoutEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { type LiveVideo, youtubeEmbedUrl, youtubeWatchUrl } from "@/lib/live-data";

const PROGRESS_MARKS = [25, 50, 75];
const FOCUSABLE = 'button, a[href], iframe, video[controls], [tabindex]:not([tabindex="-1"])';
/** Anything inside these is "the player"; everything else on the black screen dismisses it. */
const INTERACTIVE = ".video-lightbox-frame, .video-lightbox-caption, .lightbox-close";

const isBackdrop = (target: EventTarget) => !(target as HTMLElement).closest(INTERACTIVE);

/**
 * Full-screen, blacked-out player. Plays the video as soon as it opens: a
 * <video> for files hosted on the site, a privacy-friendly YouTube embed for
 * the rest.
 */
export function VideoLightbox({ video, onClose }: { video: LiveVideo; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const started = useRef(false);
  const marks = useRef(new Set<number>());
  const openedAt = useRef(0);
  const pressedBackdrop = useRef(false);

  const { source } = video;
  const provider = source.kind === "youtube" ? "youtube" : "self";
  const ratio = video.width / video.height;
  const maxWidth = source.kind === "file" ? Math.min(video.width * 2, 1280) : 1280;

  // Start playback inside the user's tap (see LiveVideoProvider).
  useLayoutEffect(() => {
    videoRef.current?.play().catch(() => {
      /* Autoplay was blocked: the controls are showing and the viewer can press play. */
    });
  }, []);

  useEffect(() => {
    openedAt.current = Date.now();
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const items = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      trackEvent("live_video_close", {
        video_id: video.id,
        video_title: video.title,
        seconds_open: Math.round((Date.now() - openedAt.current) / 1000),
      });
    };
  }, [onClose, video.id, video.title]);

  const engagement = () => ({
    video_title: video.title,
    video_url: source.kind === "file" ? source.src : youtubeWatchUrl(source.id),
    video_provider: provider,
    video_duration: video.durationSeconds,
  });

  // Engagement for self-hosted video (YouTube reports its own through GA4 enhanced measurement).
  function onPlaying() {
    if (started.current) return;
    started.current = true;
    trackEvent("video_start", engagement());
  }
  function onTimeUpdate(event: SyntheticEvent<HTMLVideoElement>) {
    const { currentTime, duration } = event.currentTarget;
    if (!duration) return;
    const percent = (currentTime / duration) * 100;
    for (const mark of PROGRESS_MARKS) {
      if (percent >= mark && !marks.current.has(mark)) {
        marks.current.add(mark);
        trackEvent("video_progress", { ...engagement(), video_percent: mark, video_current_time: Math.round(currentTime) });
      }
    }
  }
  function onEnded() {
    trackEvent("video_complete", { ...engagement(), video_percent: 100 });
  }

  const style = { "--ratio-num": ratio, "--max-w": `${maxWidth}px` } as CSSProperties;

  // A click dismisses only if it both started and ended on the black backdrop,
  // so letting go of the seek bar outside the picture doesn't close the player.
  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    pressedBackdrop.current = isBackdrop(event.target);
  }
  function onClick(event: MouseEvent<HTMLDivElement>) {
    if (pressedBackdrop.current && isBackdrop(event.target)) onClose();
  }

  return (
    <div
      className="video-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      ref={dialogRef}
      onPointerDown={onPointerDown}
      onClick={onClick}
    >
      <button type="button" ref={closeRef} className="lightbox-close" onClick={onClose} aria-label="Close video">
        ✕
      </button>

      <div className="video-lightbox-stage">
        <div className="video-lightbox-frame" style={style}>
          {source.kind === "file" ? (
            <video
              ref={videoRef}
              src={source.src}
              poster={video.poster}
              controls
              autoPlay
              playsInline
              preload="auto"
              controlsList="nodownload"
              aria-label={video.title}
              onPlaying={onPlaying}
              onTimeUpdate={onTimeUpdate}
              onEnded={onEnded}
            />
          ) : (
            <iframe
              src={youtubeEmbedUrl(source, "player")}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
        </div>

        <div className="video-lightbox-caption">
          <small>{video.kicker}</small>
          <strong>{video.title}</strong>
          {source.kind === "youtube" && (
            <a href={youtubeWatchUrl(source.id)} target="_blank" rel="noopener noreferrer">
              Watch on YouTube ↗
            </a>
          )}
          {video.link && (
            <a href={video.link.href} target="_blank" rel="noopener noreferrer">
              {video.link.label} ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
