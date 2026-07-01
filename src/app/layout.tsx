import type { Metadata } from "next";
import { Instrument_Serif, Hanken_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

// Display: modern-yet-classic serif (legacy bones, contemporary cut).
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// Body: clean, friendly grotesque.
const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Mono: techy typewriter accent for labels, tags and prices.
const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nagibu Semwanga — Art, Animation & Commissions",
    template: "%s · Nagibu Semwanga",
  },
  description:
    "A cinematic gallery of drawings, digital paintings and short animations from Kampala. Browse, collect, and commission original work.",
  openGraph: {
    title: "Nagibu Semwanga — Art, Animation & Commissions",
    description:
      "A cinematic gallery of drawings, digital paintings and short animations from Kampala.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="grain min-h-screen">{children}</body>
    </html>
  );
}
