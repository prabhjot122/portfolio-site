"use client";

import { darkSheet, DARK_REGIONS } from "@/lib/dark-sheet";

/**
 * Dark sheet — the charcoal band behind "How we work".
 *
 * One frame on this site is printed on dark stock. This is the stock.
 *
 * ------------------------------------------------------------------
 * WHY IT IS NOT A BACKGROUND ON THE SECTION
 *
 * The obvious version is `background: #262420` plus the inverted ruling
 * on the `<section>` itself, and it is wrong for the same reason the
 * paper sheet is `position: fixed` in the first place (see the header of
 * components/atmosphere.tsx): PAPER DOES NOT SCROLL. The light ruling is
 * pinned to the viewport. A dark ruling painted on a scrolling element
 * travels with the document, so the two grids slide past each other and
 * the seam where the section starts shows a step in the ruling on every
 * frame of a scroll. That reads as a rendering fault, and no amount of
 * `background-attachment: fixed` fixes it once the element is also
 * inside a transformed ancestor — a transform makes `fixed` resolve
 * against the ancestor rather than the viewport, and the page's motion
 * wrappers are full of transforms.
 *
 * So the band is a second FIXED layer, sitting directly on top of the
 * paper sheet inside the same `z-0` container, and the section's extent
 * is applied to it as geometry rather than as flow.
 *
 * ------------------------------------------------------------------
 * WHY THE RULING IS ON A COUNTER-TRANSLATED CHILD
 *
 * The band has to move — it tracks the section's top edge as the page
 * scrolls — and it may not repaint while doing it. That rules out
 * animating a clip, a height, an inset or a background-position: all of
 * them are paint. It leaves `transform`, which is composited.
 *
 * But translating the band translates its ruling too, and a ruling that
 * travels is exactly the fault described above. Hence the pair:
 *
 *   band   translate3d(0,  top, 0)   ->  covers [top, top + height]
 *   rule   translate3d(0, -top, 0)   ->  lands back at viewport 0
 *
 * The rule child is 100vh tall and starts at the band's own origin, so
 * after the counter-translate it occupies exactly the viewport, in
 * register with the fixed paper grid to the pixel — and the band's
 * `overflow: hidden` crops it to the band. Two transform writes per
 * frame, zero paint.
 *
 * `overflow: hidden` is safe HERE and nowhere near a drawn panel: this
 * layer contains one solid-colour div and no `filter: url(#sk-rough-*)`
 * border to straighten out. See the overflow note in
 * components/side-nav.tsx for the case where it is not safe.
 *
 * ------------------------------------------------------------------
 * The band's height and position are written by components/app-shell.tsx,
 * from the one `getBoundingClientRect` pass it already runs per frame.
 * Nothing is measured here. Until that first pass lands the band is 0px
 * tall, which is the correct initial state — no flash of charcoal.
 */

/**
 * The ruling, inverted: white instead of graphite.
 *
 * Same four gradients and the SAME TWO PITCHES as the paper sheet, read
 * from the same custom properties. The pitches are not a style choice
 * here, they are a registration requirement — the dark band interrupts
 * the light grid mid-page and the lines have to continue through the
 * seam. Only the pigment and the two alphas differ, and both alphas are
 * measured in the contrast table in app/globals.css.
 *
 * The alphas are literals rather than `var(--rule-alpha-*)` on purpose:
 * this element sits OUTSIDE the `[data-surface="dark"]` scope — it is a
 * layer behind the page, not part of the section — so it would read the
 * paper theme's values if it asked for them by name.
 */
const DARK_RULING = [
  "repeating-linear-gradient(0deg, rgb(255 255 255 / 0.045) 0 1px, transparent 1px var(--rule-pitch-fine))",
  "repeating-linear-gradient(90deg, rgb(255 255 255 / 0.045) 0 1px, transparent 1px var(--rule-pitch-fine))",
  "repeating-linear-gradient(0deg, rgb(255 255 255 / 0.06) 0 1px, transparent 1px var(--rule-pitch-major))",
  "repeating-linear-gradient(90deg, rgb(255 255 255 / 0.06) 0 1px, transparent 1px var(--rule-pitch-major))",
].join(",");

export function DarkSheet() {
  return (
    // The outer clip stops a 4000px-tall band from being able to affect
    // document scroll height on any engine that still counts fixed
    // descendants. It never moves, so it never paints.
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {DARK_REGIONS.map((region, i) => (
        <div
          key={region.id}
          ref={(n) => {
            darkSheet.bands[i].band = n;
          }}
          className="absolute top-0 left-0 w-full overflow-hidden will-change-transform"
          style={{
            height: 0,
            // Flat. The paper sheet carries a 2%-of-luminance bloom off
            // the upper left to stop 100vh of one hex reading as an
            // unpainted div; a band always has the ruling and a lit edge
            // of paper against it, so it does not need the help — and a
            // gradient on dark stock is the exact move that turns a
            // notebook into a dark-mode SaaS page.
            backgroundColor: "#262420",
          }}
        >
          <div
            ref={(n) => {
              darkSheet.bands[i].rule = n;
            }}
            className="absolute top-0 left-0 h-screen w-full will-change-transform"
            style={{ backgroundImage: DARK_RULING }}
          />
        </div>
      ))}
    </div>
  );
}
