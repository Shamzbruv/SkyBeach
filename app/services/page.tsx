import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Dining, catering, weddings, private functions, meetings and event services at Sky Beach Jamaica.",
};

const services = [
  {
    number: "01",
    title: "Bar & Dining",
    text: "Authentic Jamaican seafood, international favourites and tropical drinks in a relaxed coastal setting.",
  },
  {
    number: "02",
    title: "Catering",
    text: "Customised food and beverage options designed around your occasion, guest list and preferred style of service.",
  },
  {
    number: "03",
    title: "Weddings & Celebrations",
    text: "Flexible spaces for ceremonies, receptions, birthdays, anniversaries, parties and milestone moments.",
  },
  {
    number: "04",
    title: "Private Dining",
    text: "Reserve a more intimate setting for family meals, special dinners or small-group celebrations.",
  },
  {
    number: "05",
    title: "Meetings & Expos",
    text: "Practical indoor and outdoor options for meetings, conferences, showcases, stage events and expos.",
  },
  {
    number: "06",
    title: "Venue Planning Support",
    text: "Tell us what you are planning and our team will help match the occasion with the right space and setup.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services & facilities"
        title="From a good meal to the whole occasion."
        text="Dining, catering and flexible event support—all with the warmth of Sky Beach."
        image="/images/hero-celebrate-v2.png"
      />

      <section className="section">
        <div className="container services-layout">
          <div className="services-intro">
            <p className="eyebrow">What we offer</p>
            <h2>Thoughtful service, whatever brings you together.</h2>
            <p>
              Our spaces include private huts, gazebos, meeting and conference
              areas, gardens, banquet settings and spacious terraces.
            </p>
            <Link href="/reservations" className="button button-coral">
              Tell us your plans
            </Link>
          </div>
          <div className="services-grid">
            {services.map((service) => (
              <article key={service.number}>
                <span>{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="process-band">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Simple from the start</p>
            <h2>Plan your experience in three easy steps.</h2>
          </div>
          <div className="process-grid">
            <div><span>1</span><h3>Share the idea</h3><p>Tell us the date, guest count and type of occasion.</p></div>
            <div><span>2</span><h3>Shape the details</h3><p>We will discuss the space, menu and setup that fit best.</p></div>
            <div><span>3</span><h3>Enjoy the moment</h3><p>Arrive ready to celebrate while the Sky Beach team welcomes your guests.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
