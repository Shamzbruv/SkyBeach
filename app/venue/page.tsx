import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { venueSpaces } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Venue & Event Spaces",
  description:
    "Discover private huts, gardens, terraces, banquet areas and flexible event spaces at Sky Beach Jamaica.",
};

export default function VenuePage() {
  return (
    <>
      <PageHero
        eyebrow="The venue"
        title="A tropical setting for every kind of gathering."
        text="From a table for two to a full celebration, find your space by the sea."
        image="/images/night-deck.webp"
      />

      <section className="section">
        <div className="container split-heading section-heading">
          <div>
            <p className="eyebrow">Find your setting</p>
            <h2>Spaces with their own rhythm.</h2>
          </div>
          <p>
            Every corner of Sky Beach offers a different feeling—intimate,
            garden-soft, lively, formal or completely open to the coastline.
          </p>
        </div>

        <div className="venue-list">
          {venueSpaces.map((space, index) => (
            <article className="venue-row" key={space.title}>
              <div className="venue-number">0{index + 1}</div>
              <div className="venue-photo">
                <img src={space.image} alt={space.title} />
              </div>
              <div className="venue-copy">
                <h3>{space.title}</h3>
                <p>{space.description}</p>
                <Link href="/reservations" className="text-link">
                  Enquire about this space →
                </Link>
              </div>
            </article>
          ))}
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
          <Link href="/reservations" className="button button-sun">
            Reserve the venue
          </Link>
        </div>
      </section>
    </>
  );
}

