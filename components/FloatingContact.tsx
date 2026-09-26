"use client";

import { type CSSProperties, useEffect, useRef } from "react";
import { SocialIcon } from "@/components/SocialLinks";
import { contact, socials } from "@/lib/site-data";

/** How long scrolling must pause before the dock comes back. */
const SCROLL_IDLE_MS = 250;

const whatsappHref = `${contact.whatsapp}?text=${encodeURIComponent(
  "Hi Sky Beach, I would like to make an enquiry."
)}`;

/** Speech bubble with a handset — the WhatsApp mark, drawn to match the other stroke icons. */
function WhatsAppIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <g transform="translate(7.2 6.7) scale(0.4)" strokeWidth="2.6">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </g>
    </svg>
  );
}

/**
 * Icon-only floating contact dock, fixed to the right edge of every page:
 * the client's social accounts stacked above a WhatsApp button. Each button
 * bobs gently, out of phase with its neighbours (disabled automatically for
 * visitors who prefer reduced motion). The dock slides away while the page is
 * scrolling and returns as soon as scrolling pauses.
 */
export function FloatingContact() {
  const dockSocials = socials.filter((social) => social.inDock);
  const dockRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;
    let idleTimer: number | undefined;

    // Never hide a button while someone is keyboard-focused on it.
    const keyboardFocusInside = () => {
      try {
        return dock.querySelector(":focus-visible") !== null;
      } catch {
        return dock.contains(document.activeElement); // browsers without :focus-visible
      }
    };

    // Toggles an attribute directly so scrolling never triggers a React render.
    const onScroll = () => {
      if (keyboardFocusInside()) return;
      dock.setAttribute("data-scrolling", "true");
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => dock.removeAttribute("data-scrolling"), SCROLL_IDLE_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idleTimer);
    };
  }, []);

  return (
    <nav ref={dockRef} className="floating-dock" aria-label="Chat and social media">
      <ul>
        {dockSocials.map((social, index) => (
          <li key={social.id} style={{ "--float-delay": `${index * -0.7}s` } as CSSProperties}>
            <a
              className={`dock-button dock-button--${social.network}`}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label={`Sky Beach on ${social.name}: ${social.handle} (opens in a new tab)`}
              title={social.name}
            >
              <SocialIcon network={social.network} />
            </a>
          </li>
        ))}
        <li style={{ "--float-delay": `${dockSocials.length * -0.7}s` } as CSSProperties}>
          <a
            className="dock-button dock-button--whatsapp"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Sky Beach on WhatsApp (opens in a new tab)"
            title="WhatsApp"
          >
            <WhatsAppIcon />
          </a>
        </li>
      </ul>
    </nav>
  );
}
