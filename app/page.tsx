import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroTabs } from "@/components/HeroTabs";
import { pageMetadata } from "@/lib/seo";
import { venueSpaces } from "@/lib/site-data";

export const metadata: Metadata = pageMetadata({
  title: "Sky Beach Restaurant & Bar | Hopewell, Hanover",
  description:
    "Dine by the sea at Sky Beach in Hopewell, Hanover. Discover Jamaican seafood, tropical drinks, private huts, weddings, catering and event spaces.",
  path: "/",
  absoluteTitle: true,
  keywords: [
    "Sky Beach Jamaica",
    "restaurant in Hopewell Jamaica",
    "seafood restaurant Hanover Jamaica",
    "beach restaurant Jamaica",
    "event venue Hanover Jamaica",
  ],
});

export default function Home() {
  return (
    <>
      <HeroTabs />

      <section className="section intro-section">
        <div className="container intro-grid">
          <div className="section-copy reveal-copy">
            <p className="eyebrow">More than a restaurant</p>
            <h2>An island experience, shaped by the sea.</h2>
            <p className="lead">
              Sky Beach brings together authentic Jamaican seafood, relaxed
              coastal dining and tropical spaces made for the moments you will
              talk about long after the sun goes down.
            </p>
            <p>
              Born from the culture and landscape of Hopewell, Hanover, Sky
              Beach is one original seaside destination—with private huts,
              gardens, terraces and flexible event spaces all carrying that
              same warm Jamaican spirit.
            </p>
            <Link href="/about" className="text-link">
              Read our story <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="photo-composition" aria-label="Sky Beach scenes">
            <figure className="photo-main">
              <Image
                src="/images/client-gallery/b1-01.webp"
                alt="A table set beside the sea at Sky Beach"
                fill
                sizes="(max-width: 900px) 90vw, 50vw"
                unoptimized
              />
            </figure>
            <figure className="photo-float">
              <Image
                src="/images/client-gallery/b1-18.webp"
                alt="A golden sunset over the water"
                fill
                sizes="(max-width: 680px) 46vw, 28vw"
                unoptimized
              />
            </figure>
            <div className="sun-stamp" aria-hidden="true">
              <span>Feel</span>
              <strong>the island</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section experience-section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Choose your Sky Beach</p>
              <h2>One destination. So many ways to enjoy it.</h2>
            </div>
            <p>
              Drop in for seafood and a cold drink, settle into a private hut,
              or take over a space for a celebration designed around you.
            </p>
          </div>

          <div className="experience-grid">
            {venueSpaces.slice(0, 3).map((space, index) => (
              <Link href="/venue" className="experience-card" key={space.title}>
                <Image
                  src={space.image}
                  alt=""
                  fill
                  sizes="(max-width: 680px) calc(100vw - 32px), (max-width: 900px) 50vw, 33vw"
                  unoptimized
                />
                <div className="experience-overlay" />
                <div className="experience-content">
                  <span>0{index + 1}</span>
                  <h3>{space.title}</h3>
                  <p>{space.description}</p>
                  <strong>Explore the space →</strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="flavour-band">
        <div className="flavour-image">
          <Image
            src="/images/client-gallery/b5-06.webp"
            alt="A Jamaican meal prepared at Sky Beach"
            width={1536}
            height={1025}
            sizes="(max-width: 900px) 100vw, 50vw"
            unoptimized
          />
        </div>
        <div className="flavour-copy">
          <p className="eyebrow light">Fresh from Jamaica</p>
          <h2>Seafood with soul. Drinks with a little sunshine.</h2>
          <p>
            Explore Jamaican and international favourites, fresh seafood,
            tropical cocktails and customised menus for catered events.
          </p>
          <div className="flavour-actions">
            <Link href="/menu" className="button button-sun">
              View food & drinks
            </Link>
            <Link href="/reservations" className="button button-ghost">
              Book a table
            </Link>
          </div>
        </div>
      </section>

      <section className="section moment-section">
        <div className="container moment-grid">
          <div>
            <p className="eyebrow">Your day at Sky Beach</p>
            <h2>Arrive. Exhale. Let the island do the rest.</h2>
          </div>
          <ol className="moment-list">
            <li>
              <span>01</span>
              <div>
                <h3>Find your corner</h3>
                <p>Choose a breezy table, a private hut or a garden setting.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Taste something local</h3>
                <p>Ask about today&apos;s catch and pair it with an island drink.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Stay for sunset</h3>
                <p>Watch the coastline glow and let dinner turn into a memory.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="image-cta">
        <Image
          src="/images/client-gallery/b2-04.webp"
          alt="A seaside celebration glowing at night"
          fill
          sizes="100vw"
          unoptimized
        />
        <div className="image-cta-scrim" />
        <div className="container image-cta-content">
          <p className="eyebrow light">Bring your people</p>
          <h2>Make your next gathering feel like an escape.</h2>
          <p>
            Weddings, parties, meetings, expos, private dining and special
            functions—tell us what you are imagining.
          </p>
          <Link href="/reservations" className="button button-sun">
            Plan an event
          </Link>
        </div>
      </section>
    </>
  );
}
