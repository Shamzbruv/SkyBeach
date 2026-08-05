import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<{
    path: string;
    changeFrequency: "weekly" | "monthly";
    priority: number;
  }> = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/menu", changeFrequency: "weekly", priority: 0.9 },
    { path: "/reservations", changeFrequency: "monthly", priority: 0.9 },
    { path: "/venue", changeFrequency: "monthly", priority: 0.85 },
    { path: "/gallery", changeFrequency: "monthly", priority: 0.8 },
    { path: "/services", changeFrequency: "monthly", priority: 0.75 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/careers", changeFrequency: "monthly", priority: 0.5 },
  ];

  return routes.map((route) => ({
    url: `${siteOrigin}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
