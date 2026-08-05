import type { Metadata } from "next";

const configuredOrigin =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : "https://skybeach-production.up.railway.app");

export const siteOrigin = configuredOrigin.replace(/\/$/, "");
export const siteName = "Sky Beach Restaurant & Bar";
export const defaultSocialImage = "/images/client-gallery/b2-04.webp";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  absoluteTitle?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  image = defaultSocialImage,
  keywords = [],
  absoluteTitle = false,
}: PageMetadataOptions): Metadata {
  const canonicalPath = path === "/" ? "/" : path.replace(/\/$/, "");

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      locale: "en_JM",
      siteName,
      url: canonicalPath,
      title,
      description,
      images: [
        {
          url: image,
          width: 1280,
          height: 718,
          alt: "Sky Beach Restaurant & Bar in Hopewell, Hanover, Jamaica",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteOrigin}/#website`,
  url: `${siteOrigin}/`,
  name: siteName,
  alternateName: "Sky Beach Jamaica",
  inLanguage: "en-JM",
};

export const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": `${siteOrigin}/#restaurant`,
  name: siteName,
  alternateName: "Sky Beach Jamaica",
  url: `${siteOrigin}/`,
  logo: `${siteOrigin}/images/logo.webp`,
  image: [
    `${siteOrigin}/images/hero-dine-v2.webp`,
    `${siteOrigin}/images/client-gallery/b2-04.webp`,
    `${siteOrigin}/images/client-gallery/b1-20.webp`,
  ],
  description:
    "Authentic Jamaican seafood, tropical dining, private huts, catering and event spaces in Hopewell, Hanover, Jamaica.",
  telephone: "+1-876-547-3971",
  email: "skybeach24@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hopewell",
    addressRegion: "Hanover",
    addressCountry: "JM",
  },
  servesCuisine: ["Jamaican", "Caribbean", "Seafood"],
  menu: `${siteOrigin}/menu`,
  acceptsReservations: true,
};
