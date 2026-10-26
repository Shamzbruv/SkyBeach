import type { MenuCategory } from "./site-data";

// Approved menu images supplied on 24 October 2026. Jamaica is UTC-05:00.
// Keep the existing catalogue intact until the exact activation instant.
export const MENU_PRICE_CHANGE_AT = "2026-10-25T00:00:00-05:00";
export const MENU_PRICE_CHANGE_AT_MS = Date.parse(MENU_PRICE_CHANGE_AT);

export const APPROVED_FOOD_PRICES: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  Soups: {
    "Fish Tea": "$600",
    "Conch Soup": "$700",
  },
  Appetizers: {
    "Salt Fish Fritters": "$700",
    "Conch Fritters": "$800",
    "Fish Balls": "$1,400",
    Patties: "$750",
    "Mozzarella Sticks": "$700",
    "Fried Calamari": "$1,900",
    "Wings (5 pcs)": "$1,700",
    "Wings (10 pcs)": "$3,200",
    "Shrimp Cocktails": "$1,900",
    "Ackee & Saltfish": "$800",
  },
  Salads: {
    "Garden Salad": "$1,700",
    "Garden Salad with Shrimp": "$1,900",
    "Garden Salad with Conch": "$1,900",
  },
  Seafood: {
    "Fish (Whole)": "$3,000/lb",
    "Fish Fillet": "$3,200",
    Salmon: "$3,500",
    Shrimp: "$3,500",
    "Lobster Tail / Meat": "$4,500/lb",
    Crab: "$2,600/lb",
    Conch: "$3,200",
    "Sea Cat (Octopus)": "$3,500",
    "Seafood Boil": "$8,000",
  },
  Meats: {
    "Chicken Breast": "$2,300",
    "Jerked Chicken": "$2,300",
    "Curried Chicken": "$2,300",
    "Fried Chicken": "$2,300",
    "Stew Peas": "$2,500",
    "Curried Goat": "$2,400",
    Oxtail: "$3,500",
  },
  Pasta: {
    "Rasta Pasta — Chicken": "$2,200",
    // The unadorned Rasta Pasta row is the base/veggie option, followed by Chicken.
    "Rasta Pasta — Veggie": "$2,000",
    "Rasta Pasta — Fish": "$3,000",
    "Rasta Pasta — Shrimp": "$3,500",
    "Rasta Pasta — Lobster": "$4,500/lb",
  },
  Pizza: {
    "Cheese (Only)": "$2,000",
    Vegetarian: "$2,500",
    Mixed: "$2,800",
    Seafood: "$3,500",
    "Extra Topping (Whole)": "$350",
  },
  "Burgers & Panini": {
    "Fish Burger": "$1,500",
    "Beef Burger": "$1,500",
    "Chicken Burger": "$1,500",
    Panini: "$1,500",
  },
  "Side Orders": {
    Bammy: "$700",
    Festival: "$300",
    Rice: "$500",
    "Fried Plantain": "$400",
    "Sweet Potato": "$600",
    "Irish Potato": "$600",
    "Potato Wedges": "$650",
    "French Fries": "$600",
    "Seasoned / Jerk Fries": "$600",
    "Sweet Potato Fries": "$650",
    Vegetable: "$900",
    Callaloo: "$800",
    "Roast Breadfruit": "$400",
    "Boiled Corn": "$400",
    "Boiled Food": "$400",
    "Fried Dumplin": "$300",
  },
  "Vegan Cuisine": {
    Tofu: "$1,950",
    "Veggie Mince": "$1,950",
    "Veggie Chunks": "$1,950",
    Ackee: "$1,950",
    "Veggie Fried Rice": "$1,950",
  },
  "Kids Menu": {
    "Chicken Nuggets": "$1,800",
    "Chicken Fingers": "$1,800",
    "Chicken Drumsticks": "$1,800",
  },
  Desserts: {
    "Fruit Cup": "$600",
    "Jamaican Fruit Cake": "$1,000",
    "Rum Cake": "$800",
    "Carrot Cake": "$800",
    "Sky Beach Potato Pudding": "$800",
    "Ice Cream Sundae": "$900",
    "Ice Cream Cake": "$850",
    "Ice Cream Cone": "$700",
    "Cheese Cake": "$1,000",
  },
};

export function areUpdatedMenuPricesActive(nowMs = Date.now()): boolean {
  return nowMs >= MENU_PRICE_CHANGE_AT_MS;
}

/** Shared by server HTML, the interactive menu, and search-engine menu offers. */
export function foodMenuAt(menu: MenuCategory[], nowMs = Date.now()): MenuCategory[] {
  if (!areUpdatedMenuPricesActive(nowMs)) return menu;
  return menu.map((group) => ({
    ...group,
    ...(group.category === "Vegan Cuisine" ? { note: "All Vegetarian Meals — $1,950" } : {}),
    items: group.items.map((item) => ({
      ...item,
      price: APPROVED_FOOD_PRICES[group.category]?.[item.name] ?? item.price,
    })),
  }));
}
