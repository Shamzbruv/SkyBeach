import type { Metadata } from "next";
import Link from "next/link";
import { HutExplorer } from "@/components/HutExplorer";
import { PageHero } from "@/components/PageHero";
import { venueSpaces } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Venue & Event Spaces",
  description:
    "Discover private huts, gardens, terraces, banquet areas and flexible event spaces at Sky Beach Jamaica.",
};

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
        image="/images/hero-celebrate-v2.png"
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
                <img src={space.image} alt={space.title} />
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
