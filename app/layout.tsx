import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { ConsentBanner } from "@/components/ConsentBanner";
import { SiteChrome } from "@/components/SiteChrome";
import { StructuredData } from "@/components/StructuredData";
import { GA_MEASUREMENT_ID, analyticsBootstrapScript } from "@/lib/analytics";
import {
  defaultSocialImage,
  restaurantJsonLd,
  siteLocale,
  siteName,
  siteOrigin,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

// Optional Search Console / Bing Webmaster ownership tokens (set in the host's
// environment). Omitted from the page entirely when not configured.
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "Sky Beach Restaurant & Bar | Hopewell, Hanover",
    template: "%s | Sky Beach Jamaica",
  },
  description:
    "Authentic Jamaican seafood, tropical dining, private huts, catering and event spaces in Hopewell, Hanover, Jamaica.",
  applicationName: siteName,
  category: "restaurant",
  creator: siteName,
  publisher: siteName,
  manifest: "/manifest.webmanifest",
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  keywords: [
    "seafood restaurant Jamaica",
    "seafood restaurant Hopewell Hanover",
    "venue rental Jamaica",
    "event space Hanover",
    "catering services Jamaica",
    "Sky Beach Jamaica",
  ],
  openGraph: {
    type: "website",
    locale: siteLocale,
    siteName,
    url: "/",
    title: "Sky Beach Restaurant & Bar",
    description:
      "Come for the food. Stay for the feeling. Discover coastal dining, private events and island hospitality in Hopewell, Hanover.",
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sky Beach Restaurant & Bar",
    description:
      "Authentic Jamaican seafood and unforgettable celebrations by the sea.",
    images: [{ url: defaultSocialImage.url, alt: defaultSocialImage.alt }],
  },
  verification: {
    ...(googleVerification ? { google: googleVerification } : {}),
    ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
  },
  other: {
    "codex-preview": "development",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffdf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a2827" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-JM">
      <head>
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png?v=2" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />
        <StructuredData data={[websiteJsonLd, restaurantJsonLd]} />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {/* Google tag (GA4) — consent defaults are set before gtag.js loads. */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
        <script dangerouslySetInnerHTML={{ __html: analyticsBootstrapScript() }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
        <ConsentBanner />
      </body>
    </html>
  );
}
