import { DarkSheet } from "@/components/dark-sheet";

/**
 * Atmosphere — the sheet the whole site is drawn on.
 *
 * It is squared note paper: a warm ground with two ruled pitches on it,
 * fine at 24px and major at 120px. Nothing else. No JavaScript, no
 * context, no loop, no listeners, no state, no hydration — a server
 * component that ships zero bytes of client bundle and is rasterised
 * once at its fixed viewport size, then only ever composited.
 *
 * ------------------------------------------------------------------
 * WHY IT MUST STAY STATIC
 *
 * This used to be a WebGL canvas running a cross-hatching fragment
 * shader — a domain-warped tone field, three procedural stroke layers,
 * a sun that tracked scroll and a pointer that displaced the field. It
 * was the most elaborate thing on the site and it was also the reason
 * the page was hard to scroll.
 *
 * Not because the shader was slow in isolation; it was tuned to ~0.55ms
 * a frame in the end. Because a surface that repaints AT ALL, ever, is
 * a moving thing underneath 200-odd elements carrying
 * `filter: url(#sk-rough-*)`. Every repaint down here re-composites the
 * stack above it, and re-compositing an SVG displacement filter means
 * re-running feTurbulence + feDisplacementMap on the CPU for that
 * element. The shader's own cost was never the problem; the cost it
 * imposed on everything above it was, and that cost scales with how
 * many drawn panels happen to be on screen — which is exactly the "it
 * gets worse further down the page" symptom.
 *
 * That constraint has not gone away. Whatever this layer becomes next,
 * it may not repaint.
 *
 * ------------------------------------------------------------------
 * WHY TWO PITCHES AND NOT ONE
 *
 * A single grid is a texture; you stop seeing it in about four seconds
 * and it may as well be a flat fill. Two pitches make a MEASURE — the
 * heavy line every fifth light one gives the eye something to count,
 * and that is what makes the sheet read as paper someone chose rather
 * than as a background pattern.
 *
 * 120 = 5 x 24 EXACTLY, and that is not a rounding. If the major pitch
 * is not an integer multiple of the fine one the two grids beat against
 * each other and drift in and out of phase down the page, which reads
 * as a rendering fault. The pair is defined together in globals.css
 * (`--rule-pitch-fine`, `--rule-pitch-major`) so they cannot be changed
 * apart.
 *
 * BACKGROUND-ATTACHMENT IS FIXED, on the element rather than the
 * viewport. The whole layer is `position: fixed`, so the ruling stays
 * put while the document scrolls past it. That is the right behaviour
 * here and it is worth being explicit about: paper does not scroll —
 * the writing on it does. A grid that travels with the content turns
 * every scroll into a moire against the pixel raster.
 *
 * ------------------------------------------------------------------
 * CONTRAST
 *
 * The table in globals.css is measured against this layer, and the
 * measurement it uses is the SHEET (#F6F2EA), not the darkest pixel —
 * a 1px ruling every 24px darkens a glyph's background by about 0.5%
 * averaged over its area. Worst realistic case is a glyph sitting along
 * a ruled line at #EDE9E1, which is the second column of that table.
 *
 * Where all four rulings cross the paper reaches #D1CDC5. That is one
 * pixel in every 14,400 and it is not a text background; it is recorded
 * in globals.css so nobody finds it and thinks it is a bug.
 *
 * Raising either alpha is a contrast change rather than a style change.
 * Both live in globals.css next to the numbers they affect.
 */

/**
 * The ruling, as four repeating gradients: fine horizontal, fine
 * vertical, major horizontal, major vertical.
 *
 * Order matters — later entries paint UNDER earlier ones in a CSS
 * background list, so the major rules are last and the fine ones sit on
 * top of them. That is the correct stacking for paper: the heavy line
 * was ruled first and the light grid was printed over it.
 *
 * Every value is read from a custom property rather than written here,
 * so the sheet cannot drift out of agreement with anything else that
 * lines up to it (see `.mount-shot` in globals.css, which rules its
 * empty screens with the same fine pitch).
 */
const RULING = [
  "repeating-linear-gradient(0deg, rgb(var(--rule-ink) / var(--rule-alpha-fine)) 0 1px, transparent 1px var(--rule-pitch-fine))",
  "repeating-linear-gradient(90deg, rgb(var(--rule-ink) / var(--rule-alpha-fine)) 0 1px, transparent 1px var(--rule-pitch-fine))",
  "repeating-linear-gradient(0deg, rgb(var(--rule-ink) / var(--rule-alpha-major)) 0 1px, transparent 1px var(--rule-pitch-major))",
  "repeating-linear-gradient(90deg, rgb(var(--rule-ink) / var(--rule-alpha-major)) 0 1px, transparent 1px var(--rule-pitch-major))",
].join(",");

/**
 * The sheet under the ruling.
 *
 * One flat colour plus one very wide, very shallow bloom off the upper
 * left, where the site's light comes from. The bloom spans about 2% of
 * luminance — far too little to read as lighting on its own, which is
 * the point. What it actually does is stop 100vh of a single flat hex
 * from looking like an unpainted div, and it gives the ruling somewhere
 * to be slightly fainter so the grid does not sit at one dead value
 * across the whole viewport.
 *
 * The gradient is on the SHEET and not on the ruling because a fading
 * grid reads as a rendering artefact, while a grid on paper that
 * catches the light does not.
 */
const SHEET = [
  "radial-gradient(120% 80% at 12% 0%, rgb(255 253 249 / 0.55) 0%, rgb(255 253 249 / 0) 62%)",
  "linear-gradient(0deg, var(--color-ground), var(--color-ground))",
].join(",");

/**
 * THE ONE EXCEPTION TO "STATIC", AND WHY IT DOES NOT BREAK THE RULE
 * ABOVE.
 *
 * `<DarkSheet />` is a client layer and it moves every frame. It does
 * not repaint: it is a solid band plus a ruling, and both are positioned
 * by `transform` alone — composited, never rasterised again after the
 * first frame. The rule the shader broke was "this layer may not
 * repaint", not "this layer may not move", and a transform is the one
 * way to move something without repainting it.
 *
 * If anything is ever added here that animates a colour, a size, an
 * opacity or a background-position, it re-opens the whole problem for
 * every drawn edge above it. See components/dark-sheet.tsx.
 */
export function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0" style={{ background: SHEET }} />
      <div className="absolute inset-0" style={{ backgroundImage: RULING }} />
      {/* The dark stock, over the paper and under everything else, sized
          and placed by components/app-shell.tsx. */}
      <DarkSheet />
    </div>
  );
}
