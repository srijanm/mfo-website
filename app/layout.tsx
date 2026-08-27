import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

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

export const metadata: Metadata = {
  title: "MyFinanceOfficer",
  description: "A modern CA firm for modern professions.",
};

export const viewport: Viewport = {
  themeColor: "#F6F7F2",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
