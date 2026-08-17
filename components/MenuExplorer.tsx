"use client";

import { useState, useRef, useEffect } from "react";
import { foodMenu, drinkMenu, type MenuCategory } from "@/lib/site-data";

/* ── Background image mapping ── */
const categoryBg: Record<string, string> = {
  // Food
  Soups: "/images/menu/menu_bg_sides.jpg",
  Appetizers: "/images/menu/menu_bg_appetizers.jpg",
  Salads: "/images/menu/menu_bg_vegan.jpg",
  Seafood: "/images/menu/menu_bg_seafood.jpg",
  Meats: "/images/menu/menu_bg_meats.jpg",
  Pasta: "/images/menu/menu_bg_pasta.jpg",
  Pizza: "/images/menu/menu_bg_pasta.jpg",
  "Burgers & Panini": "/images/menu/menu_bg_appetizers.jpg",
  "Side Orders": "/images/menu/menu_bg_sides.jpg",
  "Vegan Cuisine": "/images/menu/menu_bg_vegan.jpg",
  "Kids Menu": "/images/menu/menu_bg_appetizers.jpg",
  Desserts: "/images/menu/menu_bg_desserts.jpg",
  // Drinks
  Cocktails: "/images/menu/menu_bg_cocktails.jpg",
  "Frozen Drinks": "/images/menu/menu_bg_cocktails.jpg",
  Martinis: "/images/menu/menu_bg_cocktails.jpg",
  Shots: "/images/menu/menu_bg_spirits.jpg",
  Brandys: "/images/menu/menu_bg_spirits.jpg",
  Gins: "/images/menu/menu_bg_spirits.jpg",
  Rums: "/images/menu/menu_bg_spirits.jpg",
  "Whiskeys (Shot)": "/images/menu/menu_bg_spirits.jpg",
  "Tequilas (Shot)": "/images/menu/menu_bg_spirits.jpg",
  Cognacs: "/images/menu/menu_bg_spirits.jpg",
  Vodkas: "/images/menu/menu_bg_spirits.jpg",
  Beers: "/images/menu/menu_bg_beer.jpg",
  "Wines (Glass)": "/images/menu/menu_bg_beer.jpg",
  Elixers: "/images/menu/menu_bg_beer.jpg",
  Juices: "/images/menu/menu_bg_refreshments.jpg",
  Sodas: "/images/menu/menu_bg_refreshments.jpg",
  "Energy Boosters": "/images/menu/menu_bg_refreshments.jpg",
  Waters: "/images/menu/menu_bg_refreshments.jpg",
};

const foodTabs = [
  { key: "popular", label: "🔥 Popular" },
  { key: "seafood", label: "🐟 Seafood" },
  { key: "meats", label: "🍗 Meats" },
  { key: "pasta-pizza", label: "🍝 Pasta & Pizza" },
  { key: "sides-soups", label: "🥘 Sides & Soups" },
  { key: "vegan", label: "🌱 Vegan" },
  { key: "kids-burgers", label: "🍔 Kids & Burgers" },
  { key: "desserts", label: "🍰 Desserts" },
];

const drinkTabs = [
  { key: "cocktails-frozen", label: "🍹 Cocktails & Frozen" },
  { key: "spirits", label: "🥃 Spirits" },
  { key: "beer-wine", label: "🍺 Beer & Wine" },
  { key: "non-alcoholic", label: "🧃 Non-Alcoholic" },
];

function getFoodCategories(subTab: string): MenuCategory[] {
  switch (subTab) {
    case "popular":
      return foodMenu.filter((c) =>
        ["Appetizers", "Seafood", "Meats"].includes(c.category)
      );
    case "seafood":
      return foodMenu.filter((c) => c.category === "Seafood");
    case "meats":
      return foodMenu.filter((c) => c.category === "Meats");
    case "pasta-pizza":
      return foodMenu.filter((c) =>
        ["Pasta", "Pizza"].includes(c.category)
      );
    case "sides-soups":
      return foodMenu.filter((c) =>
        ["Soups", "Salads", "Side Orders"].includes(c.category)
      );
    case "vegan":
      return foodMenu.filter((c) => c.category === "Vegan Cuisine");
    case "kids-burgers":
      return foodMenu.filter((c) =>
        ["Kids Menu", "Burgers & Panini"].includes(c.category)
      );
    case "desserts":
      return foodMenu.filter((c) => c.category === "Desserts");
    default:
      return foodMenu;
  }
}

function getDrinkCategories(subTab: string): MenuCategory[] {
  switch (subTab) {
    case "cocktails-frozen":
      return drinkMenu.filter((c) =>
        ["Cocktails", "Frozen Drinks", "Martinis", "Shots"].includes(c.category)
      );
    case "spirits":
      return drinkMenu.filter((c) =>
        ["Rums", "Whiskeys (Shot)", "Tequilas (Shot)", "Brandys", "Gins", "Vodkas", "Cognacs"].includes(c.category)
      );
    case "beer-wine":
      return drinkMenu.filter((c) =>
        ["Beers", "Wines (Glass)", "Elixers"].includes(c.category)
      );
    case "non-alcoholic":
      return drinkMenu.filter((c) =>
        ["Juices", "Sodas", "Energy Boosters", "Waters"].includes(c.category)
      );
    default:
      return drinkMenu;
  }
}

function MenuCard({ group, index }: { group: MenuCategory; index: number }) {
  const hasAnyPrice = group.items.some((item) => item.price);
  const bgImage = categoryBg[group.category];

  return (
    <article
      className="mx-card"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {/* Faded background image */}
      {bgImage && (
        <div
          className="mx-card-bg"
          style={{ backgroundImage: `url(${bgImage})` }}
          aria-hidden="true"
        />
      )}

      {/* Decorative corner accents */}
      <div className="mx-card-corner mx-card-corner-tl" aria-hidden="true" />
      <div className="mx-card-corner mx-card-corner-tr" aria-hidden="true" />
      <div className="mx-card-corner mx-card-corner-bl" aria-hidden="true" />
      <div className="mx-card-corner mx-card-corner-br" aria-hidden="true" />

      <div className="mx-card-header">
        <div className="mx-card-header-line" aria-hidden="true" />
        <h3>{group.category}</h3>
        <div className="mx-card-header-line" aria-hidden="true" />
      </div>
      {group.note && <p className="mx-card-note">{group.note}</p>}

      <ul>
        {group.items.map((item) => (
          <li key={item.name}>
            <div className="mx-item-left">
              <span className="mx-item-name">{item.name}</span>
              {item.note && (
                <span className="mx-item-note">{item.note}</span>
              )}
            </div>
            {hasAnyPrice && (
              <>
                <span className="mx-item-dots" aria-hidden="true" />
                <span className="mx-item-price">{item.price || ""}</span>
              </>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function MenuExplorer() {
  const [mainTab, setMainTab] = useState<"food" | "drinks">("food");
  const [foodSubTab, setFoodSubTab] = useState("popular");
  const [drinkSubTab, setDrinkSubTab] = useState("cocktails-frozen");
  const [animKey, setAnimKey] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const subTabsRef = useRef<HTMLDivElement>(null);

  const subTabs = mainTab === "food" ? foodTabs : drinkTabs;
  const currentSubTab = mainTab === "food" ? foodSubTab : drinkSubTab;
  const setSubTab = mainTab === "food" ? setFoodSubTab : setDrinkSubTab;

  const categories =
    mainTab === "food"
      ? getFoodCategories(foodSubTab)
      : getDrinkCategories(drinkSubTab);

  function handleMainTab(tab: "food" | "drinks") {
    setMainTab(tab);
    setAnimKey((k) => k + 1);
  }

  function handleSubTab(key: string) {
    setSubTab(key);
    setAnimKey((k) => k + 1);
  }

  useEffect(() => {
    if (subTabsRef.current) {
      subTabsRef.current.scrollLeft = 0;
    }
  }, [mainTab]);

  /* Apply theme to the parent section */
  useEffect(() => {
    const section = document.querySelector(".menu-section");
    if (section) {
      section.classList.toggle("mx-light", theme === "light");
    }
  }, [theme]);

  return (
    <div className="mx-wrap">
      {/* Ambient background glow */}
      <div className="mx-ambient" aria-hidden="true" />

      {/* Theme toggle */}
      <div className="mx-theme-toggle">
        <button
          type="button"
          className={theme === "dark" ? "is-active" : ""}
          onClick={() => setTheme("dark")}
          aria-label="Dark theme"
          title="Dark theme"
        >
          🌙
        </button>
        <button
          type="button"
          className={theme === "light" ? "is-active" : ""}
          onClick={() => setTheme("light")}
          aria-label="Light theme"
          title="Light theme"
        >
          ☀️
        </button>
      </div>

      {/* Main Food / Drinks toggle */}
      <div className="mx-main-toggle" role="tablist" aria-label="Menu type">
        <button
          type="button"
          role="tab"
          aria-selected={mainTab === "food"}
          className={mainTab === "food" ? "is-active" : ""}
          onClick={() => handleMainTab("food")}
        >
          <span className="mx-toggle-icon">🍽️</span>
          <span>Food</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mainTab === "drinks"}
          className={mainTab === "drinks" ? "is-active" : ""}
          onClick={() => handleMainTab("drinks")}
        >
          <span className="mx-toggle-icon">🍹</span>
          <span>Drinks</span>
        </button>
        <div
          className="mx-toggle-slider"
          style={{ transform: mainTab === "drinks" ? "translateX(100%)" : "translateX(0)" }}
        />
      </div>

      {/* Sub-category pills */}
      <div className="mx-sub-tabs" ref={subTabsRef} role="tablist" aria-label="Menu categories">
        {subTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={currentSubTab === tab.key}
            className={currentSubTab === tab.key ? "is-active" : ""}
            onClick={() => handleSubTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Decorative divider */}
      <div className="mx-divider" aria-hidden="true">
        <span />
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 1L13.5 8.5H21L15 13.5L17 21L11 16.5L5 21L7 13.5L1 8.5H8.5L11 1Z" fill="currentColor" />
        </svg>
        <span />
      </div>

      {/* Currency note */}
      <p className="mx-note">
        {mainTab === "food"
          ? "All prices in JMD · GCT and service charge will be added"
          : "GCT and service charge will be added to your bill"}
      </p>

      {/* Menu cards grid */}
      <div className="mx-grid" key={animKey}>
        {categories.map((group, i) => (
          <MenuCard key={group.category} group={group} index={i} />
        ))}
      </div>
    </div>
  );
}
