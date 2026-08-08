import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HutExplorer } from "@/components/HutExplorer";
import { IntimateBookingForm } from "@/components/IntimateBookingForm";
import { PageHero } from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";
import { venueSpaces } from "@/lib/site-data";

export const metadata: Metadata = pageMetadata({
  title: "Seaside Venue, Private Huts & Event Spaces",
  description:
    "Discover private seaside huts, gardens, terraces, wedding spaces and flexible event venues at Sky Beach in Hopewell, Hanover.",
  path: "/venue",
  keywords: ["event venue Hanover Jamaica", "Jamaica wedding venue", "private huts Hopewell", "seaside event space Jamaica"],
});

function enquiryHref(venue: string) {
  return `/reservations?request=Venue%20booking&venue=${encodeURIComponent(venue)}#booking-form`;
}

export default function VenuePage() {
  return (
    <>
      <PageHero
        eyebrow="The venue"
        title="A tropical setting for every kind of gathering."
        text="From a table for two to a full celebration, find your space by the sea."
        image="/images/hero-celebrate-v2.webp"
      />

      <section className="section">
        <div className="container split-heading section-heading">
          <div>
            <p className="eyebrow">Find your setting</p>
            <h2>Spaces with their own rhythm.</h2>
          </div>
          <p>
            Select any space to open a detailed event form. The Sky Beach team
            will receive the purpose, timing, guest count, setup and service
            requirements in one organised WhatsApp message.
          </p>
        </div>

        <div className="venue-list">
          {venueSpaces.map((space, index) => (
            <Link className="venue-row" href={enquiryHref(space.title)} key={space.title}>
              <div className="venue-number">0{index + 1}</div>
              <div className="venue-photo">
                <Image
                  src={space.image}
                  alt={space.title}
                  width={1200}
                  height={1600}
                  sizes="(max-width: 680px) calc(100vw - 32px), (max-width: 900px) 34vw, 36vw"
                  unoptimized
                />
              </div>
              <div className="venue-copy">
                <h3>{space.title}</h3>
                <p>{space.description}</p>
                <span className="text-link">Build a detailed venue request →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section hut-story" id="hut-stories">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">A walk through Hanover</p>
              <h2>Every hut carries a local story.</h2>
            </div>
            <p>
              The names across the grounds draw from Hanover communities,
              districts and coastal places. Choose a hut to see its photographs,
              atmosphere and the kind of gathering it suits.
            </p>
          </div>
          <HutExplorer />
        </div>
      </section>

      {/* ── Intimate Seaside Deck spotlight ── */}
      <section className="intimate-section" id="intimate-deck">
        <div className="intimate-hero">
          <Image
            src="/images/intimate-deck.webp"
            alt="A private table for two on a wooden deck overlooking the turquoise Caribbean sea"
            width={1200}
            height={800}
            sizes="100vw"
            unoptimized
            priority
          />
          <div className="intimate-hero-scrim" />
          <div className="intimate-hero-content">
            <p className="eyebrow light">Private dining for two</p>
            <h2>An evening made only for the two of you.</h2>
            <p>
              A sun-warmed wooden deck at the water&apos;s edge, dressed for an intimate
              meal with the sound of the sea and the glow of the Jamaican coast.
              Perfect for proposals, anniversaries and moments that deserve their
              own quiet place in the world.
            </p>
            <a href="#intimate-booking-form" className="button button-sun">
              Reserve this space
            </a>
          </div>
        </div>

        <div className="intimate-details">
          <div className="container">
            <div className="intimate-features">
              <div className="intimate-feature">
                <span className="intimate-feature-icon">🌅</span>
                <h3>Sunset setting</h3>
                <p>Watch the sky change colour from your private deck, just steps from the sea.</p>
              </div>
              <div className="intimate-feature">
                <span className="intimate-feature-icon">🥂</span>
                <h3>Tailored service</h3>
                <p>A dedicated server, personalised menu and timing set entirely around you.</p>
              </div>
              <div className="intimate-feature">
                <span className="intimate-feature-icon">🌺</span>
                <h3>Special touches</h3>
                <p>Flowers, candles, a welcome drink or a hidden ring box—just let us know.</p>
              </div>
              <div className="intimate-feature">
                <span className="intimate-feature-icon">📸</span>
                <h3>Capture the moment</h3>
                <p>Ask about photography to preserve the evening forever.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container intimate-form-section">
          <aside className="intimate-form-aside">
            <p className="eyebrow">Request this experience</p>
            <h2>Let us set the scene for you.</h2>
            <p>
              Tell us about the occasion, the date and any special details.
              The team will follow up to confirm availability, menu options
              and pricing.
            </p>
          </aside>
          <IntimateBookingForm />
        </div>
      </section>

      <section className="occasion-strip">
        <div className="container">
          <p className="eyebrow light">Made to host</p>
          <h2>Weddings · Parties · Meetings · Private Dining · Stage Shows · Expos</h2>
          <p>
            Catering and customised menu options are available to help shape
            the event around your guests.
          </p>
          <Link
            href="/reservations?request=Venue%20booking#booking-form"
            className="button button-sun"
          >
            Reserve the venue
          </Link>
        </div>
      </section>
    </>
  );
}
