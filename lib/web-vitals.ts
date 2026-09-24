/**
 * Lightweight Core Web Vitals collection using the browser's own
 * PerformanceObserver API (no dependency). Follows the same definitions as
 * Google's web-vitals library: LCP (last candidate), CLS (largest session
 * window), INP (worst interaction, 98th percentile once there are 50+).
 * LCP / CLS / INP are finalised when the page is hidden; FCP and TTFB are
 * reported as soon as they're known.
 */

export type VitalName = "LCP" | "CLS" | "INP" | "FCP" | "TTFB";
export type VitalRating = "good" | "needs-improvement" | "poor";

export type Vital = {
  name: VitalName;
  value: number;
  rating: VitalRating;
  navigationType: string;
};

// [good ≤, needs-improvement ≤] — anything above is "poor" (web.dev thresholds).
const THRESHOLDS: Record<VitalName, [number, number]> = {
  LCP: [2500, 4000],
  CLS: [0.1, 0.25],
  INP: [200, 500],
  FCP: [1800, 3000],
  TTFB: [800, 1800],
};

function rate(name: VitalName, value: number): VitalRating {
  const [good, needsImprovement] = THRESHOLDS[name];
  return value <= good ? "good" : value <= needsImprovement ? "needs-improvement" : "poor";
}

type LayoutShiftEntry = PerformanceEntry & { value: number; hadRecentInput: boolean };
type LcpEntry = PerformanceEntry & { renderTime?: number; loadTime?: number };
type EventTimingEntry = PerformanceEntry & { interactionId?: number };

export function observeWebVitals(report: (vital: Vital) => void) {
  if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") {
    return () => {};
  }

  const cleanups: Array<() => void> = [];
  const navigation = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  const navigationType = navigation?.type ?? "navigate";
  const lastReported = new Map<VitalName, number>();

  const emit = (name: VitalName, value: number) => {
    if (lastReported.get(name) === value) return;
    lastReported.set(name, value);
    report({ name, value, rating: rate(name, value), navigationType });
  };

  const observe = (
    type: string,
    callback: (entries: PerformanceEntryList) => void,
    options: Record<string, unknown> = {},
  ) => {
    try {
      const observer = new PerformanceObserver((list) => callback(list.getEntries()));
      observer.observe({ type, buffered: true, ...options } as PerformanceObserverInit);
      cleanups.push(() => observer.disconnect());
    } catch {
      /* this entry type isn't supported by the browser */
    }
  };

  // TTFB
  if (navigation && navigation.responseStart > 0) emit("TTFB", navigation.responseStart);

  // FCP
  observe("paint", (entries) => {
    for (const entry of entries) {
      if (entry.name === "first-contentful-paint") emit("FCP", entry.startTime);
    }
  });

  // LCP — the latest candidate wins
  let lcp = 0;
  observe("largest-contentful-paint", (entries) => {
    const last = entries[entries.length - 1] as LcpEntry | undefined;
    if (last) lcp = last.renderTime || last.loadTime || last.startTime;
  });

  // CLS — largest "session window" of shifts (gaps < 1s, window ≤ 5s)
  let cls = 0;
  let sessionValue = 0;
  let sessionEntries: LayoutShiftEntry[] = [];
  observe("layout-shift", (entries) => {
    for (const entry of entries as LayoutShiftEntry[]) {
      if (entry.hadRecentInput) continue;
      const first = sessionEntries[0];
      const last = sessionEntries[sessionEntries.length - 1];
      if (
        sessionEntries.length &&
        entry.startTime - last.startTime < 1000 &&
        entry.startTime - first.startTime < 5000
      ) {
        sessionValue += entry.value;
        sessionEntries.push(entry);
      } else {
        sessionValue = entry.value;
        sessionEntries = [entry];
      }
      if (sessionValue > cls) cls = sessionValue;
    }
  });

  // INP — longest duration per interaction, then the worst (or 98th percentile)
  const interactions = new Map<number, number>();
  observe(
    "event",
    (entries) => {
      for (const entry of entries as EventTimingEntry[]) {
        if (!entry.interactionId) continue;
        const previous = interactions.get(entry.interactionId) ?? 0;
        if (entry.duration > previous) interactions.set(entry.interactionId, entry.duration);
      }
    },
    { durationThreshold: 40 },
  );

  const flush = () => {
    if (lcp > 0) emit("LCP", Math.round(lcp));
    emit("CLS", Math.round(cls * 1000) / 1000);
    if (interactions.size) {
      const durations = [...interactions.values()].sort((a, b) => b - a);
      emit("INP", Math.round(durations[Math.min(durations.length - 1, Math.floor(durations.length / 50))]));
    }
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") flush();
  };
  document.addEventListener("visibilitychange", onVisibilityChange, true);
  window.addEventListener("pagehide", flush);
  cleanups.push(() => {
    document.removeEventListener("visibilitychange", onVisibilityChange, true);
    window.removeEventListener("pagehide", flush);
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}
