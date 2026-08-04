import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover the Jamaican story, coastal setting and warm island hospitality behind Sky Beach Restaurant & Bar.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        title="Rooted in Jamaica. Made for connection."
        text="A restaurant, a landscape and a gathering place shaped by island culture."
        image="/images/hero-escape-v2.png"
      />

      <section className="section">
        <div className="container story-grid">
          <div>
            <p className="eyebrow">Where it began</p>
            <h2>The original Sky Beach, rooted in Hopewell.</h2>
          </div>
          <div className="prose-stack">
            <p className="lead">
              Sky Beach became known for authentic Jamaican seafood, private
              huts and a tropical landscape that felt naturally made for
              dining and celebrating.
            </p>
            <p>
              Our story is tied to Hopewell, Hanover—a place rich in culture,
              history and lush green beauty. The vision has stayed simple:
              create a welcoming destination where
              good food, beautiful spaces and genuine Jamaican hospitality live
              together.
            </p>
            <p>
              Today, guests experience the one original Sky Beach in Hopewell,
              whether they are stopping in for seafood, reserving a private
              table or planning a full celebration.
            </p>
          </div>
        </div>
      </section>

      <section className="culture-panel">
        <div className="culture-image">
          <img src="/images/client-gallery/b1-24.jpg" alt="Orchard Hut in the Sky Beach garden" />
        </div>
        <div className="culture-copy">
          <p className="eyebrow">The feeling behind the place</p>
          <h2>Easy, warm and unmistakably Jamaican.</h2>
          <div className="value-list">
            <div>
              <span>01</span>
              <h3>Authentic flavour</h3>
              <p>Seafood and island favourites served with pride.</p>
            </div>
            <div>
              <span>02</span>
              <h3>Natural beauty</h3>
              <p>Gardens, sea views and rustic spaces with real character.</p>
            </div>
            <div>
              <span>03</span>
              <h3>Room to gather</h3>
              <p>Places for quiet meals, big milestones and everything between.</p>
            </div>
          </div>
          <Link href="/venue" className="button button-coral">
            Explore the venue
          </Link>
        </div>
      </section>

      <section className="section centered-cta">
        <div className="container narrow">
          <p className="eyebrow">Come experience it</p>
          <h2>The best way to understand Sky Beach is to spend time here.</h2>
          <p>
            Plan a meal, walk the grounds and find the setting that feels right
            for your next moment.
          </p>
          <Link href="/reservations" className="button button-sea">
            Plan your visit
          </Link>
        </div>
      </section>
    </>
  );
}
