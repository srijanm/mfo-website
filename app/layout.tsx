import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

import { SiteFooter, SiteHeader, SkipLink } from "@/components/chrome";
import { site } from "@/lib/content/navigation";
import { absoluteUrl, siteUrl } from "@/lib/site-url";

import "./globals.css";

/* Geist is the only family on the site. Weights are limited to the three the
   spec permits — 400 dominant, 500 UI, 600 rare — so nothing above 600 can be
   reached even by accident. */
const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-geist",
});

const DESCRIPTION =
  "A modern CA firm for freelancers, creators, consultants and professionals paid by Indian or overseas businesses. We set up and run the India-side tax and compliance.";

export const metadata: Metadata = {
  /* Makes every relative canonical, OG and image URL resolve absolutely. */
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${site.name} — ${site.descriptor}`,
    template: `%s — ${site.name}`,
  },
  description: DESCRIPTION,
  applicationName: site.name,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.descriptor}`,
    description: DESCRIPTION,
    url: absoluteUrl("/"),
    locale: "en_IN",
    images: [
      {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.descriptor}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.descriptor}`,
    description: DESCRIPTION,
    images: [absoluteUrl("/opengraph-image")],
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F7F2",
};

/* Marks the document as scripted so components can offer a working fallback
   when JavaScript never runs. Set inline rather than on the server, because the
   whole point is to distinguish the two. */
const MARK_SCRIPTED = `document.documentElement.classList.add("js")`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={geist.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MARK_SCRIPTED }} />
      </head>
      <body>
        <SkipLink />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
