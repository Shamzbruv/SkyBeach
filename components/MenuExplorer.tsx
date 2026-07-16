"use client";

import { useState } from "react";
import { drinkSelections, foodSelections } from "@/lib/site-data";

export function MenuExplorer() {
  const [tab, setTab] = useState<"food" | "drinks">("food");
  const selections = tab === "food" ? foodSelections : drinkSelections;

  return (
    <div className="menu-explorer">
      <div className="menu-tabs" role="tablist" aria-label="Menu selections">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "food"}
          className={tab === "food" ? "is-active" : ""}
          onClick={() => setTab("food")}
        >
          Food
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "drinks"}
          className={tab === "drinks" ? "is-active" : ""}
          onClick={() => setTab("drinks")}
        >
          Drinks
        </button>
      </div>
      <div className="menu-grid">
        {selections.map((group) => (
          <article key={group.category} className="menu-card">
            <p className="eyebrow">{group.category}</p>
            <ul>
              {group.items.map((item) => (
                <li key={item}>
                  <span>{item}</span>
                  <span className="menu-dot" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
