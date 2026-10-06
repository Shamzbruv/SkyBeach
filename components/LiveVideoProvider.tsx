"use client";

import { type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { VideoLightbox } from "@/components/VideoLightbox";
import { trackEvent } from "@/lib/analytics";
import type { LiveVideo } from "@/lib/live-data";

type LiveVideoContextValue = {
  /** Opens the blackout player. Call it directly from the click/tap handler. */
  open: (video: LiveVideo, trigger: HTMLElement | null) => void;
};

const LiveVideoContext = createContext<LiveVideoContextValue | null>(null);

export function useLiveVideo() {
  const context = useContext(LiveVideoContext);
  if (!context) throw new Error("useLiveVideo must be used inside <LiveVideoProvider>");
  return context;
}

/** Owns the single lightbox shared by every video card on the page. */
export function LiveVideoProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<LiveVideo | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((video: LiveVideo, trigger: HTMLElement | null) => {
    triggerRef.current = trigger;
    // Render the player synchronously, inside the tap. iOS Safari only allows
    // playback with sound if play() runs within the user gesture, and an async
    // React update would land after it.
    flushSync(() => setActive(video));
    trackEvent("live_video_open", {
      video_id: video.id,
      video_title: video.title,
      video_provider: video.source.kind === "youtube" ? "youtube" : "self",
      video_duration: video.durationSeconds,
    });
  }, []);

  const close = useCallback(() => setActive(null), []);

  // Hand focus back to the card that opened the player.
  useEffect(() => {
    if (active === null) triggerRef.current?.focus();
  }, [active]);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <LiveVideoContext.Provider value={value}>
      {children}
      {active && <VideoLightbox key={active.id} video={active} onClose={close} />}
    </LiveVideoContext.Provider>
  );
}
