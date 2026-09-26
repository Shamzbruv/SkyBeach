import type { Metadata } from "next";
import { contact, drinkMenu, foodMenu, hutStories, socials } from "@/lib/site-data";

/**
 * Canonical origin for every absolute URL the site emits (canonicals, Open
 * Graph, sitemap, JSON-LD). It deliberately does NOT fall back to the
 * hosting platform's auto-generated domain: search engines must only ever be
 * shown the public domain. Override with NEXT_PUBLIC_SITE_URL if it changes.
 */
const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.skybeachja.com";

export const siteOrigin = configuredOrigin.replace(/\/$/, "");
export const siteName = "Sky Beach Restaurant & Bar";
export const siteLocale = "en_JM";

const absolute = (path: string) => `${siteOrigin}${path}`;
const restaurantId = `${siteOrigin}/#restaurant`;
const websiteId = `${siteOrigin}/#website`;

/* ── Social share images (1200×630 JPG — the most widely supported format) ── */

export type SocialImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

export const socialImages = {
  dine: {
    url: "/images/og/dine.jpg",
    width: 1200,
    height: 630,
    alt: "A tropical cocktail and fried fish on the waterfront at Sky Beach in Hopewell, Jamaica",
  },
  escape: {
    url: "/images/og/escape.jpg",
    width: 1200,
    height: 630,
    alt: "Sunset over the Caribbean Sea from the deck at Sky Beach in Hopewell, Jamaica",
  },
  celebrate: {
    url: "/images/og/celebrate.jpg",
    width: 1200,
    height: 630,
    alt: "A candlelit banquet table on the seaside deck at Sky Beach in Hopewell, Jamaica",
  },
} satisfies Record<string, SocialImage>;

export const defaultSocialImage: SocialImage = socialImages.dine;

/* ── Page metadata ── */

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: SocialImage;
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
      locale: siteLocale,
      siteName,
      url: canonicalPath,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
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

/* ── Structured data (JSON-LD) ── */

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": websiteId,
  url: `${siteOrigin}/`,
  name: siteName,
  alternateName: "Sky Beach Jamaica",
  inLanguage: "en-JM",
  publisher: { "@id": restaurantId },
};

export const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": restaurantId,
  name: siteName,
  alternateName: "Sky Beach Jamaica",
  url: `${siteOrigin}/`,
  logo: absolute("/images/logo.webp"),
  image: [
    absolute(socialImages.dine.url),
    absolute(socialImages.escape.url),
    absolute(socialImages.celebrate.url),
  ],
  description:
    "Authentic Jamaican seafood, tropical dining, private huts, catering and event spaces in Hopewell, Hanover, Jamaica.",
  telephone: contact.mobileHref,
  email: contact.email,
  sameAs: socials.filter((social) => social.isProfile !== false).map((social) => social.href),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hopewell",
    addressRegion: "Hanover",
    addressCountry: "JM",
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Hanover, Jamaica",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "reservations",
      telephone: contact.mobileHref,
      email: contact.email,
      availableLanguage: ["English"],
      areaServed: "JM",
    },
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: contact.landlineHref,
      availableLanguage: ["English"],
      areaServed: "JM",
    },
  ],
  servesCuisine: ["Jamaican", "Caribbean", "Seafood"],
  menu: absolute("/menu"),
  hasMenu: absolute("/menu"),
  acceptsReservations: absolute("/reservations"),
  potentialAction: {
    "@type": "ReserveAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: absolute("/reservations"),
      inLanguage: "en-JM",
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
    result: { "@type": "Reservation", name: "Table, venue or catering request" },
  },
};

type PageSchemaType = "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";

type PageJsonLdOptions = {
  title: string;
  description: string;
  path: string;
  schemaType?: PageSchemaType;
};

/** WebPage node (+ breadcrumb trail for inner pages) tied to the site-wide entities. */
export function pageJsonLd({ title, description, path, schemaType = "WebPage" }: PageJsonLdOptions) {
  const url = absolute(path === "/" ? "/" : path);
  const nodes: object[] = [
    {
      "@context": "https://schema.org",
      "@type": schemaType,
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: "en-JM",
      isPartOf: { "@id": websiteId },
      about: { "@id": restaurantId },
    },
  ];

  if (path !== "/") {
    nodes.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absolute("/") },
        { "@type": "ListItem", position: 2, name: title, item: url },
      ],
    });
  }

  return nodes;
}

/**
 * One call per page: the Next.js metadata object and its matching JSON-LD
 * nodes are built from the same title/description/path so they can't drift.
 */
export function definePage(options: PageMetadataOptions & { schemaType?: PageSchemaType }) {
  const { schemaType, ...metadataOptions } = options;

  return {
    metadata: pageMetadata(metadataOptions),
    jsonLd: pageJsonLd({
      title: options.title,
      description: options.description,
      path: options.path,
      schemaType,
    }),
  };
}

/* ── Menu ── */

/** "$2,600/lb" → { price: "2600", unit: "lb" }; anything unparseable → null. */
function parsePrice(raw: string | undefined) {
  const match = raw?.trim().match(/^\$?\s*([\d,]+(?:\.\d+)?)\s*(?:\/\s*([A-Za-z]+))?$/);
  if (!match) return null;
  return { price: match[1].replace(/,/g, ""), unit: match[2] };
}

function menuItemJsonLd(item: { name: string; note?: string; price?: string }) {
  const parsed = parsePrice(item.price);

  return {
    "@type": "MenuItem",
    name: item.name,
    ...(item.note ? { description: item.note } : {}),
    ...(parsed
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

function menuSectionsJsonLd(categories: typeof foodMenu) {
  return categories.map((category) => ({
    "@type": "MenuSection",
    name: category.category,
    ...(category.note ? { description: category.note } : {}),
    hasMenuItem: category.items.map(menuItemJsonLd),
  }));
}

/** Full food & drinks menu, generated from the same data that renders the menu tab. */
export function menuJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": absolute("/menu#menu"),
    name: `${siteName} menu`,
    url: absolute("/menu"),
    inLanguage: "en-JM",
    provider: { "@id": restaurantId },
    hasMenuSection: [
      { "@type": "MenuSection", name: "Food", hasMenuSection: menuSectionsJsonLd(foodMenu) },
      { "@type": "MenuSection", name: "Drinks", hasMenuSection: menuSectionsJsonLd(drinkMenu) },
    ],
  };
}

/* ── Venue ── */

export const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Every hut/space as an event venue contained in the restaurant's grounds. */
export function venueJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": absolute("/venue#spaces"),
    name: "Private huts and event spaces at Sky Beach",
    itemListElement: hutStories.map((hut, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "EventVenue",
        "@id": absolute(`/venue#${slugify(hut.name)}`),
        name: hut.name,
        description: `${hut.placeNote}. ${hut.story}`,
        image: hut.images.map(absolute),
        containedInPlace: { "@id": restaurantId },
      },
    })),
  };
}
