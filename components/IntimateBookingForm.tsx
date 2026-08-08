"use client";

import { FormEvent, useState } from "react";
import { contact } from "@/lib/site-data";

function getValue(data: FormData, name: string, fallback = "Not specified") {
  const value = data.get(name);
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function IntimateBookingForm() {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const reference = `SB-INT-${Date.now().toString().slice(-8)}`;

    const lines = [
      "*SKY BEACH — INTIMATE SEASIDE DECK REQUEST*",
      `Reference: ${reference}`,
      "",
      "*CUSTOMER DETAILS*",
      `Name: ${getValue(data, "name")}`,
      `WhatsApp / phone: ${getValue(data, "phone")}`,
      `Email: ${getValue(data, "email")}`,
      "",
      "*DATE & TIME*",
      `Preferred date: ${getValue(data, "date", "Flexible")}`,
      `Alternate date: ${getValue(data, "alternateDate", "None provided")}`,
      `Arrival time: ${getValue(data, "startTime")}`,
      "",
      "*OCCASION*",
      `Occasion: ${getValue(data, "occasion")}`,
      `Meal period: ${getValue(data, "mealPeriod")}`,
      `Dietary needs or allergies: ${getValue(data, "dietary", "None shared")}`,
      "",
      "*SPECIAL TOUCHES*",
      `Flowers or décor: ${getValue(data, "flowers", "None requested")}`,
      `Drink on arrival: ${getValue(data, "welcomeDrink", "No preference")}`,
      `Cake or dessert: ${getValue(data, "cake", "None requested")}`,
      `Photography: ${getValue(data, "photography", "Not needed")}`,
      "",
      "*ADDITIONAL NOTES*",
      getValue(data, "details", "None added"),
      "",
      "Venue: Intimate Seaside Deck",
      "Guests: 2",
      "",
      "Please confirm availability, pricing and any setup details. Thank you.",
    ];

    setStatus(
      `Request ${reference} is ready. WhatsApp is opening in a new tab.`
    );
    window.open(
      `${contact.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <form
      id="intimate-booking-form"
      className="enquiry-form"
      onSubmit={handleSubmit}
    >
      <fieldset className="form-section">
        <legend>1. Your details</legend>
        <div className="field-grid">
          <label>
            Full name
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            WhatsApp / phone number
            <input name="phone" type="tel" autoComplete="tel" required />
          </label>
          <label>
            Email address
            <input name="email" type="email" autoComplete="email" />
          </label>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>2. When are you coming?</legend>
        <div className="field-grid">
          <label>
            Preferred date
            <input name="date" type="date" required />
          </label>
          <label>
            Alternate date
            <input name="alternateDate" type="date" />
          </label>
          <label>
            Arrival time
            <input name="startTime" type="time" required />
          </label>
          <label>
            Meal period
            <select name="mealPeriod" defaultValue="Dinner">
              <option>Lunch</option>
              <option>Sunset dinner</option>
              <option>Dinner</option>
              <option>Drinks &amp; light bites</option>
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>3. The occasion</legend>
        <div className="field-grid">
          <label>
            What&apos;s the occasion?
            <select name="occasion" defaultValue="Romantic dinner">
              <option>Romantic dinner</option>
              <option>Proposal</option>
              <option>Anniversary</option>
              <option>Honeymoon celebration</option>
              <option>Birthday for two</option>
              <option>Just because</option>
            </select>
          </label>
          <label className="field-wide">
            Dietary needs or allergies
            <textarea
              name="dietary"
              rows={2}
              placeholder="List any requirements for either guest."
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>4. Special touches</legend>
        <div className="field-grid">
          <label>
            Flowers or décor
            <select name="flowers" defaultValue="No preference">
              <option>No preference</option>
              <option>Rose petals on the table</option>
              <option>Fresh flower arrangement</option>
              <option>Candles &amp; lanterns</option>
              <option>Surprise me</option>
            </select>
          </label>
          <label>
            Welcome drink
            <select name="welcomeDrink" defaultValue="No preference">
              <option>No preference</option>
              <option>Champagne</option>
              <option>Sky Beach cocktail</option>
              <option>Non-alcoholic option</option>
            </select>
          </label>
          <label>
            Cake or dessert
            <select name="cake" defaultValue="None requested">
              <option>None requested</option>
              <option>Small cake (please contact me about design)</option>
              <option>Dessert platter for two</option>
              <option>Surprise me</option>
            </select>
          </label>
          <label>
            Photography
            <select name="photography" defaultValue="Not needed">
              <option>Not needed</option>
              <option>Interested — please share options</option>
              <option>I will bring my own photographer</option>
            </select>
          </label>
          <label className="field-wide">
            Anything else the team should know?
            <textarea
              name="details"
              rows={3}
              placeholder="Hidden ring box, a particular song, timing for a surprise reveal…"
            />
          </label>
        </div>
      </fieldset>

      <div className="form-finish">
        <button className="button button-coral" type="submit">
          Send request via WhatsApp
        </button>
        <p className="form-note">
          Your answers are formatted into a WhatsApp request. You can review and
          edit it before sending—no payment is taken here.
        </p>
      </div>
      <p className="form-status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
