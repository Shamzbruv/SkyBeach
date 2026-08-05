import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sky Beach Restaurant & Bar",
    short_name: "Sky Beach",
    description:
      "Jamaican seafood, tropical dining, private huts and event spaces in Hopewell, Hanover.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffdf7",
    theme_color: "#0a2827",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
