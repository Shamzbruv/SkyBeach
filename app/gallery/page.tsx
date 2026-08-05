import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "See the seaside tables, named Hanover huts, gardens, food, event spaces and evening atmosphere at Sky Beach Jamaica.",
};

type PhotoShape = "wide" | "portrait" | "standard";

const widePhotos = new Set([
  "b1-08", "b1-20", "b1-23", "b1-24", "b1-25", "b2-04", "b2-36",
  "b3-05", "b4-00", "b4-21", "b5-04", "b5-05", "b5-06",
]);

const portraitPhotos = new Set([
  "b1-01", "b1-17", "b1-18", "b1-26", "b2-06", "b2-07", "b2-13",
  "b2-15", "b2-28", "b2-32", "b2-35", "b2-37", "b2-38", "b3-08",
  "b3-09", "b3-10", "b3-11", "b4-02", "b4-05", "b4-11", "b4-16",
  "b4-17", "b4-20", "b4-24", "b4-25", "b4-26", "b4-27", "b4-28",
  "b4-29", "b4-30", "b4-32", "b4-34", "b4-35", "b5-01",
]);

const photoCaptions: Record<string, string> = {
  "b1-24": "Orchard Hut, one of the named Hanover spaces",
  "b1-25": "Lookout Hut beside the shoreline",
  "b1-26": "Green Island Hut, named for Hanover's west-coast town",
};

function photo(id: string, chapterTitle: string) {
  const shape: PhotoShape = widePhotos.has(id)
    ? "wide"
    : portraitPhotos.has(id)
      ? "portrait"
      : "standard";

  return {
    src: `/images/client-gallery/${id}.jpg`,
    alt: photoCaptions[id] ?? `${chapterTitle} at Sky Beach Jamaica`,
    shape,
  };
}

const chapterData = [
  {
    title: "The place & the sunset",
    text: "Follow the shoreline from bright afternoons through golden hour and into the glow of evening.",
    ids: [
      "b1-01", "b1-04", "b1-08", "b1-09", "b1-11", "b1-12", "b1-13",
      "b1-14", "b1-17", "b1-18", "b1-19", "b1-20", "b1-23", "b1-24",
      "b1-25", "b1-28",
    ],
  },
  {
    title: "Gather around the table",
    text: "Sunday brunches, intimate dinners, weddings and full-room celebrations, each shaped for the people arriving.",
    ids: [
      "b2-04", "b2-05", "b2-06", "b2-07", "b2-09", "b2-10", "b2-11",
      "b2-12", "b2-13", "b2-14", "b2-15", "b2-16", "b2-17", "b2-20",
      "b2-21", "b2-22", "b2-23", "b2-24", "b2-25", "b2-28", "b2-32",
      "b2-33", "b2-35", "b2-36", "b2-37", "b2-38",
    ],
  },
  {
    title: "From the kitchen & bar",
    text: "Island plates and tropical drinks bring the Sky Beach story to the table.",
    ids: ["b3-05", "b3-07", "b3-08", "b3-09", "b3-10", "b3-11"],
  },
  {
    title: "A space transformed",
    text: "Colour, flowers, ceremony arches and tablescapes show how the venue changes with every occasion.",
    ids: [
      "b4-00", "b4-02", "b4-03", "b4-05", "b4-06", "b4-07", "b4-11",
      "b4-16", "b4-17", "b4-20", "b4-21", "b4-24", "b4-25", "b4-26",
      "b4-27", "b4-28", "b4-29", "b4-30", "b4-32", "b4-34", "b4-35",
    ],
  },
  {
    title: "The latest chapter",
    text: "New celebrations and another sunset over the original Sky Beach in Hopewell.",
    ids: ["b5-01", "b5-04", "b5-05", "b5-06"],
  },
].map((chapter) => ({
  ...chapter,
  photos: chapter.ids.map((id) => photo(id, chapter.title)),
}));

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="One seaside story, from daylight to celebration."
        text="A carefully selected Sky Beach collection: Hanover huts, sea views, island plates, gatherings and glowing nights."
        image="/images/hero-escape-v2.png"
      />

      <section className="section gallery-intro">
        <div className="container split-heading section-heading">
          <div>
            <p className="eyebrow">The edited collection</p>
            <h2>Come walk through the experience.</h2>
          </div>
          <p>
            Every photograph here has been selected for clarity, relevance and
            composition, then arranged to respect its natural orientation.
          </p>
        </div>
      </section>

      <div className="gallery-collection" id="gallery-collection">
        {chapterData.map((chapter, chapterIndex) => (
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
              <span className="gallery-photo-count">{chapter.photos.length} photos</span>
              <span className="gallery-toggle" aria-hidden="true" />
            </summary>
            <div className="container gallery-chapter-content">
              <div className="gallery-grid">
                {chapter.photos.map((item, photoIndex) => (
                  <figure className={`gallery-item gallery-item--${item.shape}`} key={item.src}>
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading={chapterIndex === 0 && photoIndex < 4 ? "eager" : "lazy"}
                    />
                    <figcaption>{item.alt}</figcaption>
                  </figure>
                ))}
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
