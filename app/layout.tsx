import type { Metadata } from "next";
import { Instrument_Sans, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Preloader } from "@/components/preloader";
import { Atmosphere } from "@/components/atmosphere";
import { Cursor } from "@/components/cursor";
import { MotionProvider } from "@/components/motion-provider";
import { site } from "@/lib/content";

/** Body and UI. */
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

/** Display. Kept from the previous system by direction. */
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

/**
 * The data face. Every measured value on the site is set in this and
 * inked in the accent — see `.measured` in globals.css. Weights are
 * limited to what that rule actually needs.
 */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} - ${site.role}`,
  description:
    "AI engineer in Bhopal building agents, retrieval pipelines and the data plumbing underneath them.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <MotionProvider>
          {/* One canvas, behind everything. Publishes the sun vector the
              rest of the page shades from. */}
          <Atmosphere />
          <Preloader />
          <SmoothScroll />
          <AppShell>{children}</AppShell>
          {/* Dither + paper. Above content, below the cursor. */}
          <div className="grain" aria-hidden />
          <Cursor />
        </MotionProvider>
      </body>
    </html>
  );
}
