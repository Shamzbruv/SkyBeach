import type { Metadata } from "next";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHero } from "@/components/PageHero";
import { contact } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Sky Beach Restaurant & Bar in Hopewell, Hanover for dining, venue, event and catering enquiries.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We would love to hear what you are planning."
        text="Reach out about dining, venue bookings, catering, events or a general question."
        image="/images/client-gallery/b1-01.jpg"
      />

      <section className="section contact-section">
        <div className="container contact-grid">
          <div className="contact-card">
            <p className="eyebrow">Visit & connect</p>
            <h2>Sky Beach Restaurant & Bar</h2>
            <dl className="contact-list">
              <div><dt>Location</dt><dd>{contact.address}</dd></div>
              <div><dt>Landline</dt><dd><a href={`tel:${contact.landline}`}>{contact.landline}</a></dd></div>
              <div><dt>Mobile / WhatsApp</dt><dd><a href={`tel:${contact.mobileHref}`}>{contact.mobile}</a></dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd></div>
              <div><dt>Website</dt><dd>{contact.website}</dd></div>
            </dl>
            <p className="contact-note">
              For the fastest response, send your request through WhatsApp with
              your preferred date and number of guests.
            </p>
          </div>
          <div className="contact-form-wrap">
            <p className="eyebrow">Quick enquiry</p>
            <h2>Send the details in one go.</h2>
            <EnquiryForm compact />
          </div>
        </div>
      </section>

      <section className="location-band">
        <img src="/images/client-gallery/b1-27.jpg" alt="Sky Beach sign framing the sea" />
        <div>
          <p className="eyebrow light">Hopewell, Hanover, Jamaica</p>
          <h2>Follow the sea breeze.</h2>
          <p>
            Contact the team for current directions, availability and visit details.
          </p>
          <a
            className="button button-sun"
            href={`${contact.whatsapp}?text=${encodeURIComponent(
              "Hi Sky Beach, may I have directions and current visit details?"
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            Ask for directions
          </a>
        </div>
      </section>
    </>
  );
}
