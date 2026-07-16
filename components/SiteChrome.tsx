"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { contact, navigation } from "@/lib/site-data";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="nav-shell">
          <Link
            href="/"
            className="brand"
            aria-label="Sky Beach home"
            onClick={() => setMenuOpen(false)}
          >
            <img src="/images/logo.webp" alt="Sky Beach Restaurant and Bar" />
          </Link>

          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
            <span className="sr-only">Toggle navigation</span>
          </button>

          <nav
            id="primary-nav"
            className={`primary-nav ${menuOpen ? "is-open" : ""}`}
            aria-label="Primary navigation"
          >
            {navigation.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  href={item.href}
                  key={item.href}
                  className={active ? "active" : ""}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link href="/reservations" className="nav-cta">
            Book your moment
          </Link>
        </div>
      </header>

      <main id="main-content">{children}</main>

      <footer className="site-footer">
        <div className="footer-wave" aria-hidden="true" />
        <div className="container footer-grid">
          <div className="footer-brand">
            <img src="/images/logo.webp" alt="Sky Beach Restaurant and Bar" />
            <p>
              Authentic Jamaican seafood, tropical dining and unforgettable
              celebrations by the sea.
            </p>
          </div>
          <div>
            <p className="footer-title">Explore</p>
            <div className="footer-links">
              <Link href="/venue">The venue</Link>
              <Link href="/menu">Food & drinks</Link>
              <Link href="/gallery">Gallery</Link>
              <Link href="/careers">Careers</Link>
            </div>
          </div>
          <div>
            <p className="footer-title">Visit & connect</p>
            <address>
              {contact.address}
              <a href={`tel:${contact.mobileHref}`}>{contact.mobile}</a>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </address>
          </div>
          <div>
            <p className="footer-title">Ready to escape?</p>
            <p>Plan a table, event, catering request or private celebration.</p>
            <Link href="/reservations" className="text-link light-link">
              Start an enquiry <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Sky Beach Restaurant & Bar</span>
          <span>Made with island spirit in Jamaica.</span>
        </div>
      </footer>

      <a
        className="whatsapp-float"
        href={`${contact.whatsapp}?text=${encodeURIComponent(
          "Hi Sky Beach, I would like to make an enquiry."
        )}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Sky Beach on WhatsApp"
      >
        <span aria-hidden="true">✦</span>
        <span>WhatsApp</span>
      </a>
    </>
  );
}
