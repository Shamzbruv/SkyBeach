import type { MetadataRoute } from "next";
import { siteOrigin, socialImages } from "@/lib/seo";
import { hutStories } from "@/lib/site-data";

const absolute = (path: string) => `${siteOrigin}${path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<{
    path: string;
    changeFrequency: "weekly" | "monthly";
    priority: number;
    images?: string[];
  }> = [
    { path: "/", changeFrequency: "weekly", priority: 1, images: [absolute(socialImages.dine.url)] },
    { path: "/menu", changeFrequency: "weekly", priority: 0.9 },
    { path: "/reservations", changeFrequency: "monthly", priority: 0.9 },
    {
      path: "/venue",
      changeFrequency: "monthly",
      priority: 0.85,
      images: hutStories.flatMap((hut) => hut.images.map(absolute)),
    },
    { path: "/gallery", changeFrequency: "monthly", priority: 0.8 },
    { path: "/services", changeFrequency: "monthly", priority: 0.75 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/careers", changeFrequency: "monthly", priority: 0.5 },
  ];

  return routes.map((route) => ({
    url: absolute(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    ...(route.images ? { images: route.images } : {}),
  }));
}
