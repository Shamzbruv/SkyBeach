import type { MenuCategory } from "./site-data";

/** "$2,600/lb" → { price: "2600", unit: "lb" }; anything unparseable → null. */
function parsePrice(raw: string | undefined) {
  const match = raw?.trim().match(/^\$?\s*([\d,]+(?:\.\d+)?)\s*(?:\/\s*([A-Za-z]+))?$/);
  if (!match) return null;
  return { price: match[1].replace(/,/g, ""), unit: match[2] };
}

function menuItemJsonLd(item: { name: string; note?: string; price?: string }, includePrices: boolean) {
  const parsed = parsePrice(item.price);

  return {
    "@type": "MenuItem",
    name: item.name,
    ...(item.note ? { description: item.note } : {}),
    ...(includePrices && parsed
      ? {
          offers: parsed.unit
            ? {
                "@type": "Offer",
                priceCurrency: "JMD",
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: parsed.price,
                  priceCurrency: "JMD",
                  unitText: parsed.unit,
                },
              }
            : { "@type": "Offer", price: parsed.price, priceCurrency: "JMD" },
        }
      : {}),
  };
}

export function menuSectionsJsonLd(categories: MenuCategory[], includePrices: boolean) {
  return categories.map((category) => ({
    "@type": "MenuSection",
    name: category.category,
    ...(category.note && (includePrices || !category.note.includes("$"))
      ? { description: category.note }
      : {}),
    hasMenuItem: category.items.map((item) => menuItemJsonLd(item, includePrices)),
  }));
}

