"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import { observeWebVitals } from "@/lib/web-vitals";

const SCROLL_MARKS = [25, 50, 75, 100];
const MAX_ERRORS_PER_PAGE = 5;
/** A <details> toggle only counts if it follows a real user gesture this recently. */
const TOGGLE_GESTURE_WINDOW_MS = 1500;

const WHATSAPP_URL = /^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//i;
const SOCIAL_NETWORKS: Record<string, string> = {
  "facebook.com": "facebook",
  "instagram.com": "instagram",
  "tiktok.com": "tiktok",
};

const tidy = (text: string | null | undefined) => (text ?? "").replace(/\s+/g, " ").trim().slice(0, 80);

function linkLocation(element: Element) {
  if (element.closest(".whatsapp-float")) return "floating_button";
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  return "content";
}

function handleClick(event: MouseEvent) {
  const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!link) return;

  const href = link.getAttribute("href") ?? "";
  const linkText = tidy(link.textContent) || link.getAttribute("aria-label") || undefined;
  const location = linkLocation(link);
  const socialNetwork = SOCIAL_NETWORKS[link.hostname.replace(/^(www|web|m)\./, "")];

  if (href.startsWith("tel:")) {
    trackEvent("phone_click", { phone_number: href.slice(4), link_text: linkText, link_location: location });
  } else if (href.startsWith("mailto:")) {
    trackEvent("email_click", {
      email_address: href.slice(7).split("?")[0],
      link_text: linkText,
      link_location: location,
    });
  } else if (WHATSAPP_URL.test(href)) {
    trackEvent("whatsapp_click", {
      link_text: linkText,
      link_location: location,
      prefilled_message: href.includes("text="),
    });
  } else if (socialNetwork) {
    trackEvent("social_click", { social_network: socialNetwork, link_url: href, link_location: location });
  } else if (link.classList.contains("venue-row")) {
    trackEvent("venue_enquiry_click", { venue: tidy(link.querySelector("h3")?.textContent) });
  } else if (link.matches(".button, .nav-cta, .text-link")) {
    const sameOrigin = link.origin === window.location.origin;
    trackEvent("cta_click", {
      link_text: linkText,
      link_url: sameOrigin ? `${link.pathname}${link.search}` : href,
      link_location: location,
    });
  }
}

export function Analytics() {
  const pathname = usePathname();

  // One-time listeners: clicks, <details> toggles, JS errors, Core Web Vitals.
  useEffect(() => {
    let lastGesture = 0;
    const markGesture = () => {
      lastGesture = Date.now();
    };

    // <details> fires "toggle" (which doesn't bubble) — including once on load for
    // elements that render open — so only count opens that follow a user gesture.
    const handleToggle = (event: Event) => {
      const details = event.target;
      if (!(details instanceof HTMLDetailsElement) || !details.open) return;
      if (Date.now() - lastGesture > TOGGLE_GESTURE_WINDOW_MS) return;

      if (details.classList.contains("floor-plan-note")) {
        trackEvent("floor_plan_open");
      } else if (details.classList.contains("gallery-chapter")) {
        trackEvent("gallery_chapter_open", { chapter_title: tidy(details.querySelector("h2")?.textContent) });
      }
    };

    let errorCount = 0;
    const reportError = (description: string) => {
      if (errorCount >= MAX_ERRORS_PER_PAGE) return;
      errorCount += 1;
      trackEvent("exception", { description, fatal: false });
    };
    const handleError = (event: ErrorEvent) => {
      // Cross-origin "Script error." and benign browser noise carry no signal.
      if (!event.message || event.message === "Script error." || /ResizeObserver loop/i.test(event.message)) return;
      const file = event.filename?.split("/").pop();
      reportError(`${event.message}${file ? ` @ ${file}:${event.lineno}` : ""}`);
    };
    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason as { message?: string } | string | undefined;
      reportError(`Unhandled rejection: ${typeof reason === "string" ? reason : reason?.message ?? "unknown"}`);
    };

    const pageLoadId = Math.random().toString(36).slice(2, 10);
    const stopWebVitals = observeWebVitals((vital) => {
      trackEvent("web_vitals", {
        metric_name: vital.name,
        metric_value: vital.value,
        metric_rating: vital.rating,
        navigation_type: vital.navigationType,
        page_load_id: pageLoadId,
        // Vitals finalise as the page is hidden, so ask gtag to use sendBeacon.
        transport_type: "beacon",
      });
    });

    document.addEventListener("click", handleClick);
    document.addEventListener("toggle", handleToggle, true);
    document.addEventListener("pointerdown", markGesture, true);
    document.addEventListener("keydown", markGesture, true);
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      stopWebVitals();
      document.removeEventListener("click", handleClick);
      document.removeEventListener("toggle", handleToggle, true);
      document.removeEventListener("pointerdown", markGesture, true);
      document.removeEventListener("keydown", markGesture, true);
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  // Scroll depth — restarts on every client-side navigation.
  useEffect(() => {
    const fired = new Set<number>();
    let queued = false;

    const measure = () => {
      queued = false;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percent = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      for (const mark of SCROLL_MARKS) {
        if (percent >= mark && !fired.has(mark)) {
          fired.add(mark);
          trackEvent("scroll_depth", { percent_scrolled: mark });
        }
      }
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
