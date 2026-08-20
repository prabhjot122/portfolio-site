import type { ReactNode } from "react";

export {
  Reveal,
  Stage,
  StageOnLoad,
  Rise,
  Slide,
  Frame,
  MaskLine,
  Parallax,
  RevealWords,
} from "@/components/motion";

/**
 * Section density.
 *
 * The audit's finding was that the voids were unmanaged — a flat `py-28`
 * everywhere plus 256px card gaps, producing distance rather than
 * tension. Density is now a rhythm the page moves through: compression
 * at "What we build", air either side of it.
 *
 * Viewport-relative on desktop so the rhythm survives at any height;
 * everything inside a section stays on the fixed 4px scale.
 *
 * THE PHONE VALUES ARE NOT THE DESKTOP ONES SCALED DOWN, and that is the
 * fix rather than an inconsistency. On a wide screen the air either side
 * of a section is read against the content beside it — it is composition.
 * On a 390px column there is nothing beside anything: every void becomes
 * pure travel, and the same rhythm that reads as considered on a desktop
 * reads as a page that will not end on a phone. These are roughly a
 * quarter tighter than they were, which is the difference between one
 * flick between sections and two.
 */
const DENSITY = {
  tight: "py-8 md:py-[9vh]",
  medium: "py-10 md:py-[12vh]",
  loose: "py-12 md:py-[16vh]",
  open: "py-14 md:py-[20vh]",
} as const;

export type Density = keyof typeof DENSITY;

/**
 * Which stock the frame is printed on.
 *
 * `paper` is the sheet the whole site is drawn on and it is the default
 * for every section. `dark` re-stocks one frame in charcoal — it swaps
 * the theme tokens underneath the section, so nothing inside the section
 * has to know: `text-ink-2` stays `text-ink-2` and simply resolves to
 * warm grey. The full palette, the contrast table and the rules about
 * what stays paper (every `.mount`) are in app/globals.css under
 * `[data-surface="dark"]`.
 *
 * THE GROUND ITSELF IS NOT PAINTED HERE. The charcoal band is a fixed
 * layer that tracks this section's viewport rect, because the page's
 * ruling is fixed to the viewport and a scrolling background would drag
 * its own grid out of register at the seam. See
 * components/dark-sheet.tsx. All this attribute does is ink.
 */
export type Surface = "paper" | "dark";

/** Shared page rhythm: outer padding + centred max-width container. */
export function Section({
  children,
  className = "",
  id,
  density = "loose",
  surface = "paper",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  density?: Density;
  surface?: Surface;
}) {
  return (
    <section
      id={id}
      data-surface={surface === "dark" ? "dark" : undefined}
      // `scroll-mt-24` on small screens is not spacing, it is clearance.
      // The mobile header is fixed and about 76px tall, so an anchor jump
      // that lands a section's top edge at scroll position zero puts its
      // heading underneath the bar. Every link in the mobile menu goes
      // through one of these ids.
      className={`scroll-mt-24 px-5 md:scroll-mt-8 md:px-10 ${DENSITY[density]} ${className}`}
    >
      <div className="mx-auto max-w-[89.5rem]">{children}</div>
    </section>
  );
}

/** Small caps label that sits above each section heading. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="micro mb-10 md:mb-12">{children}</p>;
}
