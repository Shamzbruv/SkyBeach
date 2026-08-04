import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "See the seaside tables, named Hanover huts, gardens, food, event spaces and evening atmosphere at Sky Beach Jamaica.",
};

const chapters = [
  {
    title: "The place & the sunset",
    text: "Follow the shoreline from bright afternoons through golden hour and into the glow of evening.",
    batch: 1,
    start: 1,
    count: 30,
  },
  {
    title: "Gather around the table",
    text: "Sunday brunches, intimate dinners, weddings and full-room celebrations, each shaped for the people arriving.",
    batch: 2,
    start: 0,
    count: 40,
  },
  {
    title: "From the kitchen & bar",
    text: "Island plates, seafood favourites and tropical drinks bring the Sky Beach story to the table.",
    batch: 3,
    start: 0,
    count: 12,
  },
  {
    title: "A space transformed",
    text: "Colour, flowers, ceremony arches and tablescapes show how the venue changes with every occasion.",
    batch: 4,
    start: 0,
    count: 37,
  },
  {
    title: "The latest chapter",
    text: "New dishes, new celebrations and another sunset over the original Sky Beach in Hopewell.",
    batch: 5,
    start: 0,
    count: 7,
  },
];

const specialCaptions: Record<string, string> = {
  "1-24": "Orchard Hut — named for a Hanover community",
  "1-25": "Lookout Hut — named for a Hanover community",
  "1-26": "Green Island Hut — named for a Hanover community",
};

function captionFor(batch: number, index: number, title: string) {
  return specialCaptions[`${batch}-${index}`] ?? `${title} at Sky Beach`;
}

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="One seaside story, from daylight to celebration."
        text="The complete Sky Beach collection: Hanover huts, sea views, island plates, gatherings and glowing nights."
        image="/images/hero-escape-v2.png"
      />

      <section className="section gallery-intro">
        <div className="container split-heading section-heading">
          <div>
            <p className="eyebrow">The full collection</p>
            <h2>Come walk through the experience.</h2>
          </div>
          <p>
            These photographs move in the same rhythm as a day at Sky Beach:
            arrive by the water, find your place, share a meal, celebrate and
            stay to watch the horizon change.
          </p>
        </div>
      </section>

      <div className="gallery-collection">
        {chapters.map((chapter, chapterIndex) => (
          <details
            className={`gallery-chapter gallery-chapter-${chapterIndex + 1}`}
            key={chapter.title}
            open={chapterIndex === 0}
          >
            <summary className="container gallery-chapter-heading">
              <span className="gallery-chapter-number">0{chapterIndex + 1}</span>
              <div className="gallery-chapter-copy">
                <h2>{chapter.title}</h2>
                <p>{chapter.text}</p>
              </div>
              <span className="gallery-photo-count">{chapter.count} photos</span>
              <span className="gallery-toggle" aria-hidden="true" />
            </summary>
            <div className="container gallery-chapter-content">
              <div className="gallery-grid">
                {Array.from({ length: chapter.count }, (_, offset) => {
                  const index = chapter.start + offset;
                  const src = `/images/client-gallery/b${chapter.batch}-${String(index).padStart(2, "0")}.jpg`;
                  const caption = captionFor(chapter.batch, index, chapter.title);
                  return (
                    <figure className={`gallery-item gallery-item-${(offset % 6) + 1}`} key={src}>
                      <img src={src} alt={caption} loading={chapterIndex === 0 && offset < 4 ? "eager" : "lazy"} />
                      <figcaption>{caption}</figcaption>
                    </figure>
                  );
                })}
              </div>
            </div>
          </details>
        ))}
      </div>

      <section className="section centered-cta coral-cta">
        <div className="container narrow">
          <p className="eyebrow light">See it for yourself</p>
          <h2>Find your favourite corner in person.</h2>
          <p>Reserve a table or ask us which space best fits your event.</p>
          <Link href="/reservations" className="button button-sun">Plan a visit</Link>
        </div>
      </section>
    </>
  );
}
