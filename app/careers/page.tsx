import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { contact } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Express your interest in joining the Sky Beach Restaurant & Bar team in Jamaica.",
};

export default function CareersPage() {
  const subject = encodeURIComponent("Career Interest — Sky Beach");
  const body = encodeURIComponent(
    "Hello Sky Beach,\n\nI would like to express my interest in joining the team.\n\nName:\nPhone:\nArea of interest:\nExperience:\n\nThank you."
  );

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Bring your energy to the Sky Beach team."
        text="Warm service, island pride and memorable guest experiences start with good people."
        image="/images/client-gallery/b1-09.jpg"
      />

      <section className="section careers-section">
        <div className="container careers-grid">
          <div>
            <p className="eyebrow">Expression of interest</p>
            <h2>Hospitality feels different when it comes from the heart.</h2>
            <p className="lead">
              We welcome expressions of interest from people who care about
              good service, teamwork and representing Jamaican hospitality well.
            </p>
            <p>
              Current openings may vary. Send your area of interest and a short
              introduction, and the team can contact you if a suitable
              opportunity becomes available.
            </p>
          </div>
          <div className="career-card">
            <p className="eyebrow">Areas of interest</p>
            <div className="career-tags">
              <span>Food service</span>
              <span>Bar service</span>
              <span>Kitchen</span>
              <span>Events</span>
              <span>Guest experience</span>
              <span>Maintenance</span>
            </div>
            <h3>How to reach us</h3>
            <p>
              Email a brief introduction and your résumé, if available. Please
              include your phone number and preferred area of work.
            </p>
            <a
              className="button button-coral"
              href={`mailto:${contact.email}?subject=${subject}&body=${body}`}
            >
              Email your interest
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
