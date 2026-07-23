import type { Metadata } from "next";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHero } from "@/components/PageHero";
import { contact } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Events & Reservations",
  description:
    "Request a table, venue booking, event, catering service or private dining experience at Sky Beach Jamaica.",
};

export default function ReservationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Events & reservations"
        title="Tell us what you are planning."
        text="A table, a private dinner or a full celebration—your Sky Beach moment starts here."
        image="/images/client-gallery/b4-36.jpg"
      />

      <section className="section reservation-section">
        <div className="container reservation-grid">
          <aside className="reservation-aside">
            <p className="eyebrow">Make an enquiry</p>
            <h2>Start with the essentials. We will help with the rest.</h2>
            <p>
              Submit your request through WhatsApp and a member of the Sky Beach
              team can follow up to confirm availability and details.
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
