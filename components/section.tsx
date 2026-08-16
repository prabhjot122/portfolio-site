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
 * The audit's finding was that the voids were unmanaged — a flat
 * `py-28` everywhere plus 256px card gaps, producing distance rather
 * than tension. Density is now a rhythm the page moves through:
 * compression at "What I do", air either side of it.
 *
 * Viewport-relative so the rhythm survives at any height; everything
 * inside a section stays on the fixed 4px scale.
 */
const DENSITY = {
  tight: "py-10 md:py-[9vh]",
  medium: "py-14 md:py-[12vh]",
  loose: "py-16 md:py-[16vh]",
  open: "py-20 md:py-[20vh]",
} as const;

export type Density = keyof typeof DENSITY;

/** Shared page rhythm: outer padding + centred max-width container. */
export function Section({
  children,
  className = "",
  id,
  density = "loose",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  density?: Density;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-8 px-5 md:px-10 ${DENSITY[density]} ${className}`}
    >
      <div className="mx-auto max-w-[89.5rem]">{children}</div>
    </section>
  );
}

/** Small caps label that sits above each section heading. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="micro mb-10 md:mb-12">{children}</p>;
}
