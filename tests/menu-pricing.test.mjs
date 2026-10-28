import assert from "node:assert/strict";
import test from "node:test";
import { foodMenu, drinkMenu } from "../lib/site-data.ts";
import {
  APPROVED_FOOD_PRICES,
  MENU_PRICE_CHANGE_AT,
  MENU_PRICES_VISIBLE,
  MENU_PRICE_CHANGE_AT_MS,
  areUpdatedMenuPricesActive,
  foodMenuAt,
} from "../lib/menu-pricing.ts";
import { menuSectionsJsonLd } from "../lib/menu-schema.ts";

const after = foodMenuAt(foodMenu, MENU_PRICE_CHANGE_AT_MS);
const item = (menu, category, name) => menu.find((g) => g.category === category).items.find((i) => i.name === name);

test("switches exactly at Jamaica midnight, never before", () => {
  assert.equal(MENU_PRICE_CHANGE_AT, "2026-10-25T00:00:00-05:00");
  assert.equal(new Date(MENU_PRICE_CHANGE_AT_MS).toISOString(), "2026-10-25T05:00:00.000Z");
  assert.equal(areUpdatedMenuPricesActive(MENU_PRICE_CHANGE_AT_MS - 1), false);
  assert.equal(areUpdatedMenuPricesActive(MENU_PRICE_CHANGE_AT_MS), true);
  assert.equal(areUpdatedMenuPricesActive(MENU_PRICE_CHANGE_AT_MS + 1), true);
  assert.strictEqual(foodMenuAt(foodMenu, MENU_PRICE_CHANGE_AT_MS - 1), foodMenu);
  assert.deepEqual(foodMenuAt(foodMenu, MENU_PRICE_CHANGE_AT_MS + 86_400_000), after);
});

test("all 78 food prices are covered, while names, descriptions and original data stay intact", () => {
  let count = 0;
  let changed = 0;
  const original = JSON.stringify(foodMenu);
  const originalDrinks = JSON.stringify(drinkMenu);
  foodMenu.forEach((group, g) => {
    assert.equal(after[g].category, group.category);
    assert.equal(after[g].items.length, group.items.length);
    group.items.forEach((oldItem, i) => {
      const expected = APPROVED_FOOD_PRICES[group.category]?.[oldItem.name];
      assert.ok(expected, `${group.category} / ${oldItem.name} missing from approved prices`);
      assert.deepEqual(after[g].items[i], { ...oldItem, price: expected });
      if (oldItem.price !== expected) changed++;
      count++;
    });
  });
  assert.equal(count, 78);
  assert.equal(changed, 57);
  foodMenuAt(foodMenu, MENU_PRICE_CHANGE_AT_MS);
  assert.equal(JSON.stringify(foodMenu), original);
  assert.equal(JSON.stringify(drinkMenu), originalDrinks);
});

test("per-pound prices, pasta rows, lower prices and the vegan heading match the supplied sheets", () => {
  for (const [category, name, price] of [
    ["Seafood", "Fish (Whole)", "$3,000/lb"],
    ["Seafood", "Crab", "$2,600/lb"],
    ["Seafood", "Lobster Tail / Meat", "$4,500/lb"],
    ["Pasta", "Rasta Pasta — Lobster", "$4,500/lb"],
    ["Pasta", "Rasta Pasta — Shrimp", "$3,500"],
    ["Pasta", "Rasta Pasta — Chicken", "$2,200"],
    ["Pasta", "Rasta Pasta — Veggie", "$2,000"],
    ["Appetizers", "Ackee & Saltfish", "$800"],
    ["Appetizers", "Mozzarella Sticks", "$700"],
    ["Pizza", "Extra Topping (Whole)", "$350"],
    ["Desserts", "Ice Cream Cake", "$850"],
    ["Desserts", "Jamaican Fruit Cake", "$1,200"],
  ]) assert.equal(item(after, category, name).price, price, `${category}/${name}`);
  assert.equal(after.find((g) => g.category === "Vegan Cuisine").note, "All Vegetarian Meals — $1,950");
  assert.ok(after.find((g) => g.category === "Vegan Cuisine").items.every((i) => i.price === "$1,950"));
});

test("structured-data offers use active prices and keep per-pound units; hidden prices stay hidden", () => {
  const schema = menuSectionsJsonLd(after, true);
  const fish = schema.find((g) => g.name === "Seafood").hasMenuItem.find((i) => i.name === "Fish (Whole)");
  assert.equal(fish.offers.priceSpecification.price, "3000");
  assert.equal(fish.offers.priceSpecification.unitText, "lb");
  const ackee = schema.find((g) => g.name === "Appetizers").hasMenuItem.find((i) => i.name === "Ackee & Saltfish");
  assert.equal(ackee.offers.price, "800");
  const hidden = menuSectionsJsonLd(after, false);
  assert.ok(hidden.every((g) => g.hasMenuItem.every((i) => !Object.hasOwn(i, "offers"))));
  assert.ok(!JSON.stringify(hidden).includes("$1,950"));
});

test("public prices remain disabled until the restaurant approves re-enabling them", () => {
  assert.equal(MENU_PRICES_VISIBLE, false);
});
