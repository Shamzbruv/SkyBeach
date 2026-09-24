"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  CONSENT_PREFERENCES_EVENT,
  type ConsentChoice,
  getStoredConsent,
  openConsentPreferences,
  setConsent,
} from "@/lib/analytics";

function isEuropeanTimeZone() {
  try {
    return (Intl.DateTimeFormat().resolvedOptions().timeZone ?? "").startsWith("Europe/");
  } catch {
    return false; // unknown timezone — treat as non-European
  }
}

// The stored choice and the timezone can't change underneath us while the
// banner is mounted, so there is nothing to subscribe to.
const subscribeToNothing = () => () => {};
const readNeedsChoice = () => getStoredConsent() === null && isEuropeanTimeZone();
const serverNeedsChoice = () => false;

/**
 * Analytics consent notice. Analytics is on by default except in the EEA/UK/CH
 * (enforced by Google Consent Mode regional defaults in the head bootstrap), so
 * the notice appears automatically only for visitors whose timezone is
 * European and who haven't chosen yet. Anyone can reopen it from the footer.
 */
export function ConsentBanner() {
  const needsChoice = useSyncExternalStore(subscribeToNothing, readNeedsChoice, serverNeedsChoice);
  const [reopened, setReopened] = useState(false);
  const [decided, setDecided] = useState(false);

  useEffect(() => {
    const show = () => {
      setDecided(false);
      setReopened(true);
    };
    window.addEventListener(CONSENT_PREFERENCES_EVENT, show);
    return () => window.removeEventListener(CONSENT_PREFERENCES_EVENT, show);
  }, []);

  if (decided || !(reopened || needsChoice)) return null;

  function choose(choice: ConsentChoice) {
    setConsent(choice);
    setReopened(false);
    setDecided(true);
  }

  return (
    <div className="consent-banner" role="dialog" aria-label="Cookie preferences">
      <p>
        We use analytics cookies to understand how visitors use this site and to
        improve it. We don&apos;t use advertising cookies.
      </p>
      <div className="consent-actions">
        <button type="button" className="consent-accept" onClick={() => choose("granted")}>
          Accept
        </button>
        <button type="button" className="consent-decline" onClick={() => choose("denied")}>
          Decline
        </button>
      </div>
    </div>
  );
}

export function CookiePreferencesButton() {
  return (
    <button type="button" className="footer-link-button" onClick={openConsentPreferences}>
      Cookie preferences
    </button>
  );
}
