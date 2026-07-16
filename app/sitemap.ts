import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://skybeachjamaica.com";
  const routes = [
    "",
    "/about",
    "/venue",
    "/services",
    "/menu",
    "/reservations",
    "/gallery",
    "/careers",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.75,
  }));
}

