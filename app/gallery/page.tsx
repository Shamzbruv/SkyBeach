import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "See the seaside tables, private huts, gardens, event spaces and evening atmosphere at Sky Beach Jamaica.",
};

const gallery = [
  ["/images/hut-table.webp", "A table set beneath a seaside hut"],
  ["/images/sunset.webp", "Sunset over the Sky Beach coastline"],
  ["/images/celebration-hall.webp", "A decorated celebration at Sky Beach"],
  ["/images/garden-dining.webp", "Garden tables arranged for dining"],
  ["/images/night-deck.webp", "The seaside deck lit at night"],
  ["/images/banquet-table.webp", "A long banquet table in the garden"],
  ["/images/beach-deck.webp", "A relaxed deck overlooking the water"],
  ["/images/indoor-banquet.webp", "An indoor table arranged for an event"],
  ["/images/beach-sign.webp", "Sky Beach frame overlooking the sea"],
  ["/images/entrance-sign.webp", "Sky Beach entrance sign"],
  ["/images/night-terrace.webp", "A glowing terrace beside the sea"],
  ["/images/private-hut.webp", "A private thatched hut in the garden"],
];

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="A little closer to the Sky Beach feeling."
        text="Sea views, green spaces, glowing nights and celebrations full of colour."
        image="/images/sunset.webp"
      />

      <section className="section gallery-section">
        <div className="container gallery-grid">
          {gallery.map(([src, alt], index) => (
            <figure className={`gallery-item gallery-item-${(index % 6) + 1}`} key={src}>
              <img src={src} alt={alt} loading={index > 3 ? "lazy" : "eager"} />
              <figcaption>{alt}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section centered-cta coral-cta">
        <div className="container narrow">
          <p className="eyebrow light">See it for yourself</p>
          <h2>Find your favourite corner in person.</h2>
          <p>Reserve a table or ask us which space best fits your event.</p>
          <Link href="/reservations" className="button button-sun">
            Plan a visit
          </Link>
        </div>
      </section>
    </>
  );
}

