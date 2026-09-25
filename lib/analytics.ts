/**
 * Google Analytics 4 for Sky Beach.
 *
 * Page views — GA4 Enhanced Measurement already records a page_view on every
 * client-side navigation (browser history events), so none are sent manually
 * here; sending both would double-count.
 *
 * Custom events (all snake_case, params ≤ 100 chars) — register the params you
 * want to report on as custom dimensions in GA4 Admin → Custom definitions:
 *
 *   generate_lead        form_id, request_type, venue, occasion, contact_method, whatsapp_opened
 *   whatsapp_click       link_text, link_location, prefilled_message
 *   phone_click          phone_number, link_text, link_location
 *   email_click          email_address, link_text, link_location
 *   social_click         social_network (facebook | instagram | tiktok), link_url, link_location
 *   cta_click            link_text, link_url, link_location
 *   venue_enquiry_click  venue
 *   select_content       content_type (hut | menu_category), content_id
 *   menu_tab_select      menu_type, tab_key
 *   gallery_photo_open   photo_index, photo_caption
 *   gallery_chapter_open chapter_title
 *   floor_plan_open      —
 *   scroll_depth         percent_scrolled (25 | 50 | 75 | 100)
 *   web_vitals           metric_name, metric_value, metric_rating, navigation_type, page_load_id
 *   exception            description, fatal
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-6SQ86DFT9N";

export const CONSENT_STORAGE_KEY = "sb_consent";
export const OPT_OUT_STORAGE_KEY = "sb_ga_optout";
export const CONSENT_PREFERENCES_EVENT = "sb:open-consent-preferences";

/** Regions where analytics storage stays off until the visitor opts in (EEA, UK, Switzerland). */
const CONSENT_OPT_IN_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES",
  "SE", "IS", "LI", "NO", "GB", "CH",
];

/**
 * Inline bootstrap for <head>. Runs before gtag.js loads:
 *  - Consent Mode v2: advertising signals always denied (no ads are run);
 *    analytics storage granted by default, but denied in opt-in regions until
 *    the visitor accepts. A saved choice is re-applied before the first hit.
 *  - Never reports from localhost / *.local, so development doesn't pollute data.
 *  - ?ga_optout=1 excludes a browser (staff, developers) for good; ?ga_optout=0
 *    undoes it. ?ga_debug=1 turns on GA4 DebugView for the session.
 */
export function analyticsBootstrapScript() {
  return `(function(){
var ID=${JSON.stringify(GA_MEASUREMENT_ID)};
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
var params=new URLSearchParams(window.location.search);
try{
var optOut=params.get("ga_optout");
if(optOut==="1")localStorage.setItem(${JSON.stringify(OPT_OUT_STORAGE_KEY)},"1");
else if(optOut==="0")localStorage.removeItem(${JSON.stringify(OPT_OUT_STORAGE_KEY)});
if(localStorage.getItem(${JSON.stringify(OPT_OUT_STORAGE_KEY)})==="1")window["ga-disable-"+ID]=true;
}catch(e){}
gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"denied",region:${JSON.stringify(CONSENT_OPT_IN_REGIONS)}});
gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"granted"});
try{
var saved=localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)});
if(saved==="granted"||saved==="denied")gtag("consent","update",{analytics_storage:saved});
}catch(e){}
gtag("js",new Date());
var host=window.location.hostname;
if(host!=="localhost"&&host!=="127.0.0.1"&&host!=="[::1]"&&host!=="0.0.0.0"&&!/\\.local$/.test(host)){
var config={};
if(params.get("ga_debug")==="1")config.debug_mode=true;
gtag("config",ID,config);
}
})();`;
}

/* ── Client helpers ── */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

/** Safe no-op when GA is blocked, still loading, or running on localhost. */
export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  const clean: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    // GA4 truncates string parameter values at 100 characters.
    clean[key] = typeof value === "string" ? value.slice(0, 100) : value;
  }

  window.gtag("event", name, clean);
}

export type ConsentChoice = "granted" | "denied";

export function getStoredConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function setConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    /* storage unavailable — the choice still applies for this page view */
  }
  window.gtag?.("consent", "update", { analytics_storage: choice });
}

export function openConsentPreferences() {
  window.dispatchEvent(new Event(CONSENT_PREFERENCES_EVENT));
}
