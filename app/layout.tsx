import type { Metadata } from "next";
import { Caveat, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Preloader } from "@/components/preloader";
import { Atmosphere } from "@/components/atmosphere";
import { Cursor } from "@/components/cursor";
import { SketchDefs } from "@/components/sketch-defs";
import { MotionProvider } from "@/components/motion-provider";
import { site } from "@/lib/content";

/**
 * THE THREE FACES, AND THE RULE THAT KEEPS THEM APART
 *
 * The whole typographic system is one decision repeated: each face owns
 * a register, and no face is ever asked to do another one's job.
 *
 *   Caveat            the voice.      One statement per screen, plus
 *                                     the notes written in the margin.
 *   Instrument Sans   the document.   Everything structural — project
 *                                     titles, body copy, navigation.
 *   IBM Plex Mono     the data.       Indices, stamps, measured values,
 *                                     anything that is a reading rather
 *                                     than a sentence.
 *
 * The failure mode this replaces is the one every "handwritten" theme
 * falls into: setting headings, sub-headings and pull quotes all in the
 * hand face until the hand stops meaning anything. Here a reader can
 * point at a Caveat line and say what it is for, because there are only
 * two kinds and both are asides to the document rather than part of it.
 *
 * See `.display-l`, `.display-m` and `.hand` in globals.css — that is
 * where the rule is actually enforced.
 */

/**
 * The voice.
 *
 * Variable across 400..700 so the statement weight (600) and the margin
 * notes (500) come from one file rather than two.
 *
 * CAVEAT SETS SMALL FOR ITS SIZE. Its x-height is roughly two-thirds of
 * a grotesque at the same em, which is why the display scale in
 * globals.css runs so much larger than the numbers a sans would want —
 * the section heading is 112px and reads as about 72px would. Those are
 * not arbitrary; they are the prototype's measured sizes.
 */
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

/**
 * The document.
 *
 * Body copy, project titles, navigation, buttons — everything the page
 * is actually made of. A slightly condensed grotesque with a tall
 * x-height, which is what lets it sit at 15px in a margin note and at
 * 44px as a project title without either size looking borrowed.
 *
 * There is no 300 in this family. Call sites that used to reach for
 * `font-light` under the old body face now use weight and size rather
 * than lightness to step down — see `.lede` in globals.css.
 */
const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

/**
 * The data face. Every index, stamp, size label and measured value on
 * the site is set in this — see `.micro` and `.measured` in globals.css.
 * Two weights, which is all those two rules need.
 */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} - ${site.role}`,
    // Sub-pages set a bare `title`; this keeps the brand on the tab
    // without every page repeating it by hand.
    template: `%s - ${site.name}`,
  },
  description:
    "Buildvriksh designs and builds custom learning systems for educators and education businesses - LMS platforms, AI learning tools and custom education software shaped around how you teach.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${caveat.variable} ${plexMono.variable}`}
    >
      <body>
        <MotionProvider>
          {/* The filters every drawn edge on the page resolves against.
              First in the tree so no border can paint straight while it
              waits for its filter to exist. */}
          <SketchDefs />
          {/* The sheet, behind everything. Static CSS, no client JS —
              a background that repaints is a background that forces
              every drawn edge above it to re-run its filter. */}
          <Atmosphere />
          <Preloader />
          <SmoothScroll />
          <AppShell>{children}</AppShell>
          {/* Paper tooth. Above content, below the cursor. */}
          <div className="grain" aria-hidden />
          <Cursor />
        </MotionProvider>
      </body>
    </html>
  );
}
