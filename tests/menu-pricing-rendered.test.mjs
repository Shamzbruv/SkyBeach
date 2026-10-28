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


test("production menu keeps all prices hidden before and after activation, even with an environment override", async () => {
  const realNow = Date.now;
  const oldVisibility = process.env.MENU_PRICES_VISIBLE;
  process.env.MENU_PRICES_VISIBLE = "true";
  try {
    for (const [now, active] of [
      [MENU_PRICE_CHANGE_AT_MS - 1, false],
      [MENU_PRICE_CHANGE_AT_MS, true],
      [MENU_PRICE_CHANGE_AT_MS + 1000, true],
      [Date.parse("2026-10-28T11:00:00-05:00"), true],
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
      const sections = schema.hasMenuSection.flatMap((section) => section.hasMenuSection);
      assert.ok(sections.length > 12, "both food and drink sections must be present");
      assert.ok(sections.every((section) => section.hasMenuItem.every((item) => !Object.hasOwn(item, "offers"))));
      assert.doesNotMatch(JSON.stringify(schema), /priceCurrency|priceSpecification|\$[\d,]/);
      // RSC uses "$2" and similar internal references; check visible markup separately.
      const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
      assert.doesNotMatch(markup, /class="mx-item-price"|\$[\d,]/);
      assert.match(html, /Please contact Sky Beach for current pricing/);
      assert.ok(html.includes('id="sky-beach-menu-data"'));
      assert.ok(!html.includes('id="menu-price-timer"'), "private countdown leaked into public menu");
      assert.ok(!/new prices|countdown|price announcement/i.test(html));
    }
  } finally {
    Date.now = realNow;
    if (oldVisibility === undefined) delete process.env.MENU_PRICES_VISIBLE;
    else process.env.MENU_PRICES_VISIBLE = oldVisibility;
  }
});
