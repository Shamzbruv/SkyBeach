import type { Metadata } from "next";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHero } from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";
import { contact } from "@/lib/site-data";

export const metadata: Metadata = pageMetadata({
  title: "Reservations, Events & Catering",
  description:
    "Request a table, private hut, wedding venue, event space, catering service or private dining experience at Sky Beach Jamaica.",
  path: "/reservations",
  keywords: ["Sky Beach reservations", "book restaurant Hopewell", "Jamaica wedding venue booking", "Hanover catering enquiry"],
});

export default function ReservationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Events & reservations"
        title="Tell us what you are planning."
        text="A table, a private dinner or a full celebration—your Sky Beach moment starts here."
        image="/images/hero-celebrate-v2.webp"
      />

      <section className="section reservation-section">
        <div className="container reservation-grid">
          <aside className="reservation-aside">
            <p className="eyebrow">Make an enquiry</p>
            <h2>Give the team a clear picture from the very first message.</h2>
            <p>
              The form changes to match your reservation, venue, wedding,
              meeting or catering request. Your answers are organised into a
              detailed WhatsApp brief so the team can respond with fewer
              follow-up questions.
            </p>
            <div className="direct-contact">
              <span>Prefer to reach out directly?</span>
              <a href={`tel:${contact.mobileHref}`}>{contact.mobile}</a>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </div>
          </aside>
          <EnquiryForm />
        </div>
      </section>

      <section className="what-happens">
        <div className="container what-happens-grid">
          <div><span>01</span><h3>Send your request</h3><p>Share the date, number of guests and type of experience.</p></div>
          <div><span>02</span><h3>Confirm availability</h3><p>The team will follow up about your preferred space and time.</p></div>
          <div><span>03</span><h3>Finalise the details</h3><p>Discuss the menu, setup and any special requirements before the day.</p></div>
        </div>
      </section>
    </>
  );
}
