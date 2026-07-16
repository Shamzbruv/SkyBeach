"use client";

import { FormEvent, useState } from "react";
import { contact } from "@/lib/site-data";

export function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = [
      "Hello Sky Beach, I would like to make an enquiry.",
      `Name: ${data.get("name") || "Not provided"}`,
      `Request: ${data.get("request") || "General enquiry"}`,
      `Preferred date: ${data.get("date") || "Flexible"}`,
      `Guests: ${data.get("guests") || "Not confirmed"}`,
      `Phone / email: ${data.get("contact") || "Not provided"}`,
      `Details: ${data.get("details") || "None added"}`,
    ];
    setStatus("Your enquiry is ready. WhatsApp will open in a new tab.");
    window.open(
      `${contact.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <form className={`enquiry-form ${compact ? "compact" : ""}`} onSubmit={handleSubmit}>
      <div className="field-grid">
        <label>
          Your name
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label>
          Phone or email
          <input name="contact" type="text" required />
        </label>
        <label>
          What can we help with?
          <select name="request" defaultValue="Table reservation">
            <option>Table reservation</option>
            <option>Venue booking</option>
            <option>Wedding or celebration</option>
            <option>Catering request</option>
            <option>Meeting or expo</option>
            <option>General enquiry</option>
          </select>
        </label>
        <label>
          Preferred date
          <input name="date" type="date" />
        </label>
        <label>
          Estimated guests
          <input name="guests" type="number" min="1" inputMode="numeric" />
        </label>
        <label className="field-wide">
          Tell us what you are planning
          <textarea name="details" rows={compact ? 3 : 5} />
        </label>
      </div>
      <div className="form-finish">
        <button className="button button-coral" type="submit">
          Send via WhatsApp
        </button>
        <p className="form-note">
          This opens WhatsApp with your request ready to send. No online payment
          is required.
        </p>
      </div>
      <p className="form-status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}

