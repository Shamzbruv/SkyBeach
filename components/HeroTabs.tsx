"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    tab: "Dine",
    eyebrow: "Seafood · sunsets · island flavour",
    title: "Taste Jamaica by the sea.",
    text: "Fresh flavours, warm hospitality and a coastal table made for lingering a little longer.",
    image: "/images/client-gallery/b1-01.jpg",
    href: "/menu",
    cta: "Explore the menu",
  },
  {
    tab: "Celebrate",
    eyebrow: "Weddings · parties · private events",
    title: "Your occasion, with an ocean view.",
    text: "From intimate dinners to lively celebrations, create a gathering that feels unmistakably yours.",
    image: "/images/client-gallery/b2-11.jpg",
    href: "/venue",
    cta: "Discover the venue",
  },
  {
    tab: "Escape",
    eyebrow: "Hopewell · Hanover · Jamaica",
    title: "Come for the food. Stay for the feeling.",
    text: "Private huts, green gardens, glowing terraces and that easy island rhythm—welcome to Sky Beach.",
    image: "/images/client-gallery/b1-14.jpg",
    href: "/reservations",
    cta: "Plan your visit",
  },
];

export function HeroTabs() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      7000
    );
    return () => window.clearInterval(timer);
  }, []);

  const slide = slides[active];

  return (
    <section className="home-hero" aria-label="Sky Beach experience">
      <div className="hero-media" aria-hidden="true">
        {slides.map((item, index) => (
          <div
            key={item.tab}
            className={`hero-image ${index === active ? "is-active" : ""}`}
            style={{ backgroundImage: `url(${item.image})` }}
          />
        ))}
        <div className="hero-scrim" />
      </div>

      <div className="container hero-content">
        <p className="eyebrow light">{slide.eyebrow}</p>
        <h1 key={slide.title}>{slide.title}</h1>
        <p className="hero-copy">{slide.text}</p>
        <div className="hero-actions">
          <Link href={slide.href} className="button button-sun">
            {slide.cta}
          </Link>
          <Link href="/reservations" className="button button-ghost">
            Reserve a table
          </Link>
        </div>
      </div>

      <div className="container hero-tab-wrap">
        <div className="hero-tabs" role="tablist" aria-label="Choose an experience">
          {slides.map((item, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={active === index}
              key={item.tab}
              className={active === index ? "is-active" : ""}
              onClick={() => setActive(index)}
            >
              <span>0{index + 1}</span>
              {item.tab}
            </button>
          ))}
        </div>
      </div>
      <div className="hero-wave wave-one" aria-hidden="true" />
      <div className="hero-wave wave-two" aria-hidden="true" />
    </section>
  );
}
