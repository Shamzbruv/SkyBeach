"use client";

import { FormEvent, useState, useSyncExternalStore } from "react";
import { contact, hutStories, venueSpaces } from "@/lib/site-data";

const requestTypes = [
  "Table reservation",
  "Venue booking",
  "Wedding or celebration",
  "Catering request",
  "Meeting or expo",
  "General enquiry",
] as const;

type RequestType = (typeof requestTypes)[number];

const venueOptions = [
  ...venueSpaces.map((space) => space.title),
  ...hutStories.map((hut) => hut.name),
  "Not sure — please recommend a space",
];

function getValue(data: FormData, name: string, fallback = "Not specified") {
  const value = data.get(name);
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function subscribeToUrl() {
  return () => undefined;
}

export function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState("");
  const [requestOverride, setRequestOverride] = useState<RequestType | null>(null);
  const [venueOverride, setVenueOverride] = useState<string | null>(null);
  const urlSearch = useSyncExternalStore(
    subscribeToUrl,
    () => window.location.search,
    () => ""
  );
  const params = new URLSearchParams(urlSearch);
  const requestedType = params.get("request");
  const requestType = requestOverride ?? (
    requestTypes.includes(requestedType as RequestType)
      ? requestedType as RequestType
      : "Table reservation"
  );
  const selectedVenue = venueOverride ?? params.get("venue") ?? "";

  const isTable = requestType === "Table reservation";
  const isEvent = ["Venue booking", "Wedding or celebration", "Meeting or expo"].includes(requestType);
  const isCatering = requestType === "Catering request";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const reference = `SB-${Date.now().toString().slice(-8)}`;
    const preferredContact = getValue(data, "preferredContact", "WhatsApp");

    const lines = [
      "*SKY BEACH BOOKING REQUEST*",
      `Reference: ${reference}`,
      "",
      "*REQUEST*",
      `Type: ${getValue(data, "request", requestType)}`,
      ...(isEvent ? [`Preferred space: ${getValue(data, "venue")}`] : []),
      ...(isTable ? [`Seating preference: ${getValue(data, "seating")}`] : []),
      "",
      "*CUSTOMER DETAILS*",
      `Name: ${getValue(data, "name")}`,
      `WhatsApp / phone: ${getValue(data, "phone")}`,
      `Email: ${getValue(data, "email")}`,
      `Preferred reply method: ${preferredContact}`,
      "",
      "*DATE, TIME & PARTY*",
      `Preferred date: ${getValue(data, "date", "Flexible")}`,
      `Alternate date: ${getValue(data, "alternateDate", "None provided")}`,
      `Arrival / start time: ${getValue(data, "startTime")}`,
      `Finish time: ${getValue(data, "endTime")}`,
      `Adults: ${getValue(data, "adults", "Not confirmed")}`,
      `Children: ${getValue(data, "children", "0")}`,
      `Total guests: ${getValue(data, "guests", "Not confirmed")}`,
      ...(isTable
        ? [
            "",
            "*DINING DETAILS*",
            `Meal period: ${getValue(data, "mealPeriod")}`,
            `Occasion: ${getValue(data, "occasion", "Casual visit")}`,
            `Dietary needs / allergies: ${getValue(data, "dietary", "None shared")}`,
            `High chairs needed: ${getValue(data, "highChairs", "0")}`,
          ]
        : []),
      ...(isEvent
        ? [
            "",
            "*EVENT PLAN*",
            `Event purpose: ${getValue(data, "eventType")}`,
            `Access / setup time: ${getValue(data, "setupTime")}`,
            `Preferred layout: ${getValue(data, "layout")}`,
            `Catering: ${getValue(data, "catering")}`,
            `Bar / drinks: ${getValue(data, "barService")}`,
            `Décor / theme: ${getValue(data, "decor")}`,
            `Entertainment: ${getValue(data, "entertainment")}`,
            `Equipment / AV: ${getValue(data, "equipment")}`,
            `Estimated budget: ${getValue(data, "budget")}`,
          ]
        : []),
      ...(isCatering
        ? [
            "",
            "*CATERING PLAN*",
            `Service location: ${getValue(data, "serviceLocation")}`,
            `Full address: ${getValue(data, "serviceAddress")}`,
            `Service / setup time: ${getValue(data, "setupTime")}`,
            `Service style: ${getValue(data, "serviceStyle")}`,
            `Menu direction: ${getValue(data, "menuDirection")}`,
            `Dietary needs / allergies: ${getValue(data, "dietary", "None shared")}`,
            `Estimated budget: ${getValue(data, "budget")}`,
          ]
        : []),
      "",
      "*FINAL NOTES*",
      `Accessibility or mobility needs: ${getValue(data, "accessibility", "None shared")}`,
      `Special requests: ${getValue(data, "details", "None added")}`,
      "",
      "Please confirm availability, pricing, deposit requirements and the next steps. Thank you.",
    ];

    setStatus(`Request ${reference} is ready. WhatsApp is opening in a new tab.`);
    window.open(
      `${contact.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <form
      id="booking-form"
      className={`enquiry-form ${compact ? "compact" : ""}`}
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
          <label>
            Best way to reply
            <select name="preferredContact" defaultValue="WhatsApp">
              <option>WhatsApp</option>
              <option>Phone call</option>
              <option>Email</option>
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>2. What are you planning?</legend>
        <div className="field-grid">
          <label>
            Request type
            <select
              name="request"
              value={requestType}
              onChange={(event) => setRequestOverride(event.target.value as RequestType)}
            >
              {requestTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>

          {isEvent && (
            <label>
              Preferred venue or hut
              <select
                name="venue"
                value={selectedVenue}
                onChange={(event) => setVenueOverride(event.target.value)}
                required
              >
                <option value="" disabled>Select a space</option>
                {venueOptions.map((venue) => <option key={venue}>{venue}</option>)}
              </select>
            </label>
          )}

          {isTable && (
            <label>
              Seating preference
              <select name="seating" defaultValue="No preference">
                <option>No preference</option>
                <option>Private seaside hut</option>
                <option>Terrace by the water</option>
                <option>Garden or gazebo</option>
                <option>Indoor dining</option>
              </select>
            </label>
          )}

          <label>
            Preferred date
            <input name="date" type="date" required />
          </label>
          <label>
            Alternate date
            <input name="alternateDate" type="date" />
          </label>
          <label>
            Arrival / start time
            <input name="startTime" type="time" required />
          </label>
          <label>
            Finish time
            <input name="endTime" type="time" />
          </label>
          <label>
            Adults
            <input name="adults" type="number" min="1" inputMode="numeric" />
          </label>
          <label>
            Children
            <input name="children" type="number" min="0" inputMode="numeric" defaultValue="0" />
          </label>
          <label>
            Total estimated guests
            <input name="guests" type="number" min="1" inputMode="numeric" required />
          </label>
        </div>
      </fieldset>

      {!compact && isTable && (
        <fieldset className="form-section">
          <legend>3. Dining details</legend>
          <div className="field-grid">
            <label>
              Meal period
              <select name="mealPeriod" defaultValue="Dinner">
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Drinks only</option>
                <option>Sunday brunch</option>
              </select>
            </label>
            <label>
              Occasion
              <input name="occasion" type="text" placeholder="Birthday, anniversary, casual visit…" />
            </label>
            <label className="field-wide">
              Dietary needs or allergies
              <textarea name="dietary" rows={3} placeholder="List each guest's allergy or dietary requirement." />
            </label>
            <label>
              High chairs needed
              <input name="highChairs" type="number" min="0" defaultValue="0" />
            </label>
          </div>
        </fieldset>
      )}

      {!compact && isEvent && (
        <fieldset className="form-section">
          <legend>3. Event details</legend>
          <div className="field-grid">
            <label>
              Event purpose
              <input name="eventType" type="text" placeholder="Wedding, birthday, meeting, launch…" required />
            </label>
            <label>
              Access / setup time
              <input name="setupTime" type="time" />
            </label>
            <label>
              Preferred layout
              <select name="layout" defaultValue="Please recommend">
                <option>Please recommend</option>
                <option>Seated dining</option>
                <option>Banquet</option>
                <option>Cocktail / standing</option>
                <option>Ceremony and reception</option>
                <option>Classroom / meeting</option>
                <option>Expo / vendor layout</option>
              </select>
            </label>
            <label>
              Catering
              <select name="catering" defaultValue="Sky Beach catering requested">
                <option>Sky Beach catering requested</option>
                <option>Food and beverage package requested</option>
                <option>No catering needed</option>
                <option>Not sure yet</option>
              </select>
            </label>
            <label>
              Bar / drinks
              <select name="barService" defaultValue="Please share options">
                <option>Please share options</option>
                <option>Cash bar</option>
                <option>Hosted bar</option>
                <option>Welcome drinks only</option>
                <option>No bar service</option>
              </select>
            </label>
            <label>
              Estimated budget
              <input name="budget" type="text" placeholder="JMD or USD range" />
            </label>
            <label className="field-wide">
              Décor, colours or theme
              <textarea name="decor" rows={3} placeholder="Describe the look, ceremony setup, florals or tablescape." />
            </label>
            <label>
              Entertainment
              <input name="entertainment" type="text" placeholder="DJ, live music, host, stage show…" />
            </label>
            <label>
              Equipment / AV
              <input name="equipment" type="text" placeholder="Microphones, projector, stage, Wi-Fi…" />
            </label>
          </div>
        </fieldset>
      )}

      {!compact && isCatering && (
        <fieldset className="form-section">
          <legend>3. Catering details</legend>
          <div className="field-grid">
            <label>
              Service location
              <select name="serviceLocation" defaultValue="Off-site event">
                <option>Off-site event</option>
                <option>At Sky Beach</option>
                <option>Delivery only</option>
              </select>
            </label>
            <label>
              Service / setup time
              <input name="setupTime" type="time" />
            </label>
            <label className="field-wide">
              Full service address
              <input name="serviceAddress" type="text" autoComplete="street-address" />
            </label>
            <label>
              Service style
              <select name="serviceStyle" defaultValue="Buffet">
                <option>Buffet</option>
                <option>Plated meal</option>
                <option>Passed bites / cocktail</option>
                <option>Drop-off trays</option>
                <option>Please recommend</option>
              </select>
            </label>
            <label>
              Estimated budget
              <input name="budget" type="text" placeholder="JMD or USD range" />
            </label>
            <label className="field-wide">
              Menu direction
              <textarea name="menuDirection" rows={3} placeholder="Seafood, Jamaican favourites, vegetarian options, drinks…" />
            </label>
            <label className="field-wide">
              Dietary needs or allergies
              <textarea name="dietary" rows={3} />
            </label>
          </div>
        </fieldset>
      )}

      <fieldset className="form-section">
        <legend>{compact ? "3" : "4"}. Final requirements</legend>
        <div className="field-grid">
          <label className="field-wide">
            Accessibility or mobility needs
            <textarea name="accessibility" rows={2} placeholder="Wheelchair access, seating assistance or other needs." />
          </label>
          <label className="field-wide">
            Anything else the team should know?
            <textarea name="details" rows={compact ? 3 : 5} placeholder="Share the experience you want, priorities, questions or special requests." />
          </label>
        </div>
      </fieldset>

      <div className="form-finish">
        <button className="button button-coral" type="submit">
          Review in WhatsApp
        </button>
        <p className="form-note">
          Your answers are formatted into a detailed WhatsApp request. You can
          review and edit it before sending; no payment is taken here.
        </p>
      </div>
      <p className="form-status" aria-live="polite">{status}</p>
    </form>
  );
}
