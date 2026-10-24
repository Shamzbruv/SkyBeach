import assert from "node:assert/strict";
import test from "node:test";
import { MENU_PRICE_CHANGE_AT_MS } from "../lib/menu-pricing.ts";

const { default: worker } = await import("../dist/server/index.js");
const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const fetchPath = (path) => worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), env, ctx);

function getMenuSchema(html) {
  const scripts = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  return scripts.flatMap((match) => JSON.parse(match[1])).find((entry) => entry["@type"] === "Menu");
}

function price(schema, category, name) {
  const entry = schema.hasMenuSection.find((s) => s.name === "Food").hasMenuSection
    .find((s) => s.name === category).hasMenuItem.find((i) => i.name === name);
  return entry.offers.price ?? entry.offers.priceSpecification.price;
}

test("production HTML and server-clock endpoint switch on the boundary without a deploy or public notice", async () => {
  const realNow = Date.now;
  try {
    for (const [now, active, fishPrice, appetizerPrice] of [
      [MENU_PRICE_CHANGE_AT_MS - 1, false, "2600", "1900"],
      [MENU_PRICE_CHANGE_AT_MS, true, "3000", "800"],
      [MENU_PRICE_CHANGE_AT_MS + 1000, true, "3000", "800"],
    ]) {
      Date.now = () => now;
      const clockResponse = await fetchPath("/api/menu-pricing");
      assert.equal(clockResponse.status, 200);
      assert.match(clockResponse.headers.get("cache-control"), /no-store/);
      const clock = await clockResponse.json();
      assert.equal(clock.serverNowMs, now);
      assert.equal(clock.active, active);
      assert.equal(clock.effectiveAtMs, MENU_PRICE_CHANGE_AT_MS);

      const response = await fetchPath("/menu");
      assert.equal(response.status, 200);
      const html = await response.text();
      const schema = getMenuSchema(html);
      assert.ok(schema, "server-rendered menu JSON-LD missing");
      assert.equal(price(schema, "Seafood", "Fish (Whole)"), fishPrice);
      assert.equal(price(schema, "Appetizers", "Ackee & Saltfish"), appetizerPrice);
      assert.ok(html.includes('id="sky-beach-menu-data"'));
      assert.ok(!html.includes('id="menu-price-timer"'), "private countdown leaked into public menu");
      assert.ok(!/new prices|countdown|price announcement/i.test(html));
    }
  } finally {
    Date.now = realNow;
  }
});
