import type { Metadata } from "next";
import Link from "next/link";
import { MenuExplorer } from "@/components/MenuExplorer";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Explore Jamaican seafood, island favourites, tropical cocktails and catered menu options at Sky Beach Restaurant & Bar.",
};

export default function MenuPage() {
  return (
    <>
      <PageHero
        eyebrow="Food & drinks"
        title="Jamaican flavour, served with a sea breeze."
        text="Fresh seafood, familiar island favourites and drinks made for slow afternoons."
        image="/images/hero-dine-v2.png"
      />

      <section className="section menu-section">
        <div className="container">
          <div className="section-heading centered-heading">
            <p className="eyebrow">A taste of Sky Beach</p>
            <h2>Start with what you love. Ask what is fresh today.</h2>
            <p>
              Our offering includes Jamaican and international cuisine,
              beverages and customised menus for catered events. Selections and
              availability may change; contact us for the current menu and prices.
            </p>
          </div>
          <MenuExplorer />
        </div>
      </section>

      <section className="menu-feature">
        <div className="menu-feature-copy">
          <p className="eyebrow light">Signature sips</p>
          <h2>Cool, colourful and unmistakably tropical.</h2>
          <p>
            From a Sky Beach Temptation or Rum Punch to frozen favourites,
            shakes and martinis, there is something for every kind of island day.
          </p>
          <Link href="/reservations" className="button button-sun">
            Reserve a table
          </Link>
        </div>
        <div className="menu-feature-image">
          <img src="/images/client-gallery/b3-10.jpg" alt="Colourful Sky Beach cocktails" />
        </div>
      </section>

      <section className="section centered-cta">
        <div className="container narrow">
          <p className="eyebrow">Planning an event?</p>
          <h2>Let us build a menu around your guests.</h2>
          <p>
            Share your occasion, guest count and preferences, and ask about our
            customised catering options.
          </p>
          <Link href="/reservations" className="button button-sea">
            Request a catering menu
          </Link>
        </div>
      </section>
    </>
  );
}
