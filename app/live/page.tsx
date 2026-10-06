import type { Metadata } from "next";
import Link from "next/link";
import { LiveVideoCard } from "@/components/LiveVideoCard";
import { LiveVideoProvider } from "@/components/LiveVideoProvider";
import { PageHero } from "@/components/PageHero";
import { StructuredData } from "@/components/StructuredData";
import { formatTotalDuration, liveSections, liveVideoById, liveVideos } from "@/lib/live-data";
import { definePage, liveVideosJsonLd, socialImages } from "@/lib/seo";

const page = definePage({
  title: "Live Music & Performances at Sky Beach",
  description:
    "Watch live reggae from the Sky Beach stage in Hopewell, Jamaica: Hezron’s Valentine’s and Mother’s Day concerts, birthday tributes and unplugged sets.",
  path: "/live",
  keywords: [
    "live music Hanover Jamaica",
    "live reggae Hopewell",
    "Sky Beach live performances",
    "Hezron live at Sky Beach",
    "live entertainment Jamaica restaurant",
    "stage shows Hanover",
  ],
  image: socialImages.live,
  schemaType: "CollectionPage",
});

export const metadata: Metadata = page.metadata;

const totalSeconds = liveVideos.reduce((sum, video) => sum + video.durationSeconds, 0);

// Oldest and newest publish dates among the YouTube films (the only dated ones).
const years = liveVideos
  .flatMap((video) => (video.publishedAt ? [Number(video.publishedAt.slice(0, 4))] : []))
  .sort((a, b) => a - b);

const stats = [
  { value: String(liveVideos.length), label: "performances on film" },
  { value: formatTotalDuration(totalSeconds), label: "of live music to watch" },
  { value: `${years[0]}–${years[years.length - 1]}`, label: "oldest to newest film" },
];

export default function LivePage() {
  return (
    <LiveVideoProvider>
      <StructuredData data={[...page.jsonLd, ...liveVideosJsonLd()]} />

      <PageHero
        eyebrow="Live at Sky Beach"
        title="Where the music meets the sea."
        text="Concert nights, birthday tributes and acoustic sets, filmed on the Sky Beach stage in Hopewell, Hanover."
        image="/images/live/hero-live.webp"
      />

      <section className="section live-intro">
        <div className="container">
          <div className="split-heading section-heading">
            <div>
              <p className="eyebrow">The Sky Beach stage</p>
              <h2>Some nights are meant to be heard.</h2>
            </div>
            <p>
              Sky Beach is a place for dinner by the sea, but it has been a stage too. These are
              the nights that were filmed: a Valentine’s concert in 2017, a Mother’s Day
              celebration in 2024, songs sung for a birthday and a tribute, and acoustic sets
              after dark. Press play and picture yourself in the crowd.
            </p>
          </div>

          <dl className="live-stats">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>

          <p className="live-hint">
            <span className="live-hint-hover">Hover over a video for a silent preview. </span>
            <span>Click or tap one to watch it full screen, with sound.</span>
          </p>
        </div>
      </section>

      {liveSections.map((section, index) => {
        const videos = section.videoIds.flatMap((id) => liveVideoById(id) ?? []);
        const tone = section.layout === "stage" ? "dark" : index % 2 === 0 ? "cream" : "paper";

        return (
          <section
            key={section.id}
            id={section.id}
            className={`section live-section live-section--${tone}`}
            aria-labelledby={`${section.id}-title`}
          >
            <div className="container">
              <div className="split-heading section-heading">
                <div>
                  <p className={`eyebrow${tone === "dark" ? " light" : ""}`}>{section.eyebrow}</p>
                  <h2 id={`${section.id}-title`}>{section.title}</h2>
                </div>
                <p>{section.text}</p>
              </div>

              <div className={`live-grid live-grid--${section.layout}`}>
                {videos.map((video, position) => (
                  <LiveVideoCard
                    key={video.id}
                    video={video}
                    variant={section.layout === "features" ? "feature" : "card"}
                    flipped={section.layout === "features" && position % 2 === 1}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="occasion-strip">
        <div className="container">
          <p className="eyebrow light">Stage shows &amp; live music</p>
          <h2>Imagine your own night here.</h2>
          <p>
            Planning a concert, a tribute or a celebration with a band? Tell the Sky Beach team
            about the night and they will help you shape it.
          </p>
          <div className="live-cta-actions">
            <Link href="/reservations?request=Venue%20booking#booking-form" className="button button-sun">
              Plan your event
            </Link>
            <Link href="/venue" className="button button-ghost">
              Explore the venue
            </Link>
          </div>
        </div>
      </section>
    </LiveVideoProvider>
  );
}
