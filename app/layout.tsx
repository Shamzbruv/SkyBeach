import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteChrome } from "@/components/SiteChrome";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://skybeachjamaica.com"),
  title: {
    default: "Sky Beach Restaurant & Bar | Hopewell, Hanover",
    template: "%s | Sky Beach Jamaica",
  },
  description:
    "Authentic Jamaican seafood, tropical dining, private huts, catering and event spaces in Hopewell, Hanover, Jamaica.",
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
    locale: "en_JM",
    siteName: "Sky Beach Restaurant & Bar",
    title: "Sky Beach Restaurant & Bar",
    description:
      "Come for the food. Stay for the feeling. Discover coastal dining, private events and island hospitality in Hopewell, Hanover.",
    images: [{ url: "/images/client-gallery/b1-01.jpg", width: 1600, height: 837 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sky Beach Restaurant & Bar",
    description:
      "Authentic Jamaican seafood and unforgettable celebrations by the sea.",
    images: ["/images/client-gallery/b1-01.jpg"],
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/images/logo.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
