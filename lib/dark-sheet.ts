/**
 * WHICH FRAMES ARE PRINTED ON DARK STOCK, and the handle between the
 * layer that paints them and the code that measures them.
 *
 * `components/dark-sheet.tsx` renders one band per region; the per-frame
 * scroll read in `components/app-shell.tsx` decides where each band
 * sits. Those two live on opposite sides of the tree — the bands are
 * layers inside `<Atmosphere>`, mounted from app/layout.tsx behind
 * everything, and the shell is the client component that owns the page's
 * one scroll read — so they cannot pass refs to each other, and a
 * context between them would put a per-frame value through React.
 *
 * They share DOM nodes instead. The shell writes transforms and a clip
 * straight onto them, which is the same thing it already does for the
 * rail's sticky travel and for the same reason: these values change
 * every frame and React must not see any of them.
 */

/**
 * The dark frames, in document order.
 *
 * `id` is the section's DOM id and it is also the hook the ink hangs on:
 * the element itself carries `data-surface="dark"`, which swaps the
 * theme tokens for everything inside it (see app/globals.css). This list
 * is only about the GROUND — the charcoal band behind the section — and
 * the two are separate on purpose. Ink is a cascade problem and it is
 * solved in CSS; ground is a geometry problem, because the page's ruling
 * is fixed to the viewport and cannot be painted on a scrolling element.
 *
 * `toBottom` marks a region that runs off the end of the document rather
 * than stopping at its own bottom edge. The closing frame does: the
 * call-to-action, the footer under it and the slack past the last pixel
 * are one continuous piece of dark stock, and a band that stopped at the
 * `<section>` would put a cream stripe under the footer.
 *
 * TWO REGIONS MAY NOT OVERLAP THE RAIL AT THE SAME TIME. The rail is at
 * most `100vh - 2rem` tall and the regions here are separated by two
 * full sections, so the rail's dark twin only ever has to be clipped to
 * one band. If a third region is ever added close to another, the union
 * in app-shell.tsx has to become a `polygon()` rather than an `inset()`.
 */
export const DARK_REGIONS = [
  { id: "how-we-work", toBottom: false },
  { id: "closing", toBottom: true },
] as const;

/** One band's two nodes: the charcoal ground, and the ruling inside it. */
export type DarkBand = { band: HTMLElement | null; rule: HTMLElement | null };

/**
 * The live nodes. Everything is nullable and every writer null-checks —
 * on a route with no dark frame the bands are simply never placed.
 */
export const darkSheet: {
  /** One entry per `DARK_REGIONS`, same order. Claimed on mount. */
  bands: DarkBand[];
} = {
  bands: DARK_REGIONS.map(() => ({ band: null, rule: null })),
};
