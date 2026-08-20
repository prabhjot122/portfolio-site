import Image from "next/image";
import { Parallax } from "@/components/motion";

/**
 * Stand-in for project imagery.
 *
 * This component is roughly 40% of the page area, so until real assets
 * land it *is* half the site's visual identity and gets designed as
 * such rather than tolerated.
 *
 * Under the graphite theme it is a plate that has been roughed in but
 * not yet worked up: drawn frame, pencil corner ticks, compositional
 * thirds pencilled across it, and a patch of value hatching in the
 * shaded corner. That is a real stage of a real drawing, which is why
 * it reads as prepared rather than as a failed image load — the failure
 * mode every placeholder pattern falls into.
 *
 * THE OVERFLOW TRAP
 * The drawn border is a pseudo-element pushed off its path by a
 * displacement filter, which means it paints *outside* the element's
 * box. Any `overflow: hidden` on the same element clips it straight
 * again — silently, and it looks like the filter simply is not working.
 * So the frame and the clip are two different elements here: `.lift`
 * carries the border and never clips, and a nested absolute layer does
 * the clipping the parallax needs.
 *
 * NOTHING FILTERED GOES INSIDE THE PARALLAX. The ticks and the guides
 * are drawn with `filter: url(#sk-rough-*)`, and an SVG displacement
 * filter is re-rasterised on the CPU every time the element it sits on
 * repaints. They used to live inside the drifting subtree, so scrolling
 * re-ran feTurbulence + feDisplacementMap for all eight of them, per
 * frame, per plate — 96 filter runs a frame across the twelve drifting
 * plates on the home page, to move a set of construction lines.
 *
 * They are frame furniture and they now sit on the plate instead, which
 * is also the more correct drawing: registration ticks mark the plate,
 * not the picture, and thirds are ruled on the frame you are composing
 * into. As a side effect the top pair is no longer clipped — sitting in
 * the overscan box put it 5% above the visible edge, so it slid in and
 * out of view as the plate drifted.
 */
export function PlaceholderMedia({
  ratio = "4/5",
  ratioSm,
  label,
  className = "",
  drift = false,
}: {
  ratio?: string;
  /**
   * Proportion below `md`. Optional; without it the plate keeps `ratio`
   * at every width, which is what every existing call site expects. See
   * `.plate` in globals.css.
   */
  ratioSm?: string;
  label?: string;
  className?: string;
  /**
   * Drift the plate's contents as the frame passes through the
   * viewport. Until real imagery lands the contents are just the
   * readout — see `Portrait` for the version with a picture in it.
   */
  drift?: boolean;
}) {
  const readout = (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
      <span className="micro text-ink-3">{label ?? "Image"}</span>
      <span className="measured text-[0.625rem] opacity-55">
        {ratio.replace("/", " : ")}
      </span>
    </div>
  );

  return (
    <div className={className}>
      <div
        style={
          {
            "--plate-ratio": ratio,
            ...(ratioSm ? { "--plate-ratio-sm": ratioSm } : {}),
          } as React.CSSProperties
        }
        className="plate lift relative w-full rounded-[var(--radius)]"
      >
        <div className="absolute inset-0 overflow-hidden rounded-[var(--radius)]">
          {/* Frame furniture — static. Compositional thirds pencilled
              in, and registration ticks at the corners. The lightest
              marks on the page: they are construction lines, and
              construction lines are meant to be almost invisible. */}
          <Guide axis="h" className="top-1/3 right-0 left-0 h-px" />
          <Guide axis="h" className="top-2/3 right-0 left-0 h-px" />
          <Guide axis="v" className="top-0 bottom-0 left-1/3 w-px" />
          <Guide axis="v" className="top-0 right-1/3 bottom-0 w-px" />

          <Tick className="top-3 left-3" />
          <Tick className="top-3 right-3 rotate-90" />
          <Tick className="bottom-3 left-3 -rotate-90" />
          <Tick className="right-3 bottom-3 rotate-180" />

          {drift ? (
            <Parallax speed={0.12} className="absolute inset-0">
              {readout}
            </Parallax>
          ) : (
            readout
          )}
        </div>

        {/* Value study — the corner the light does not reach. Masked so
            it fades out rather than ending on an edge, which no hand
            would draw. */}
        <span
          aria-hidden
          className="hatch pointer-events-none absolute right-0 bottom-0 h-[38%] w-[46%] rounded-[var(--radius)]"
          style={{
            maskImage:
              "linear-gradient(305deg, black 0%, transparent 78%)",
            WebkitMaskImage:
              "linear-gradient(305deg, black 0%, transparent 78%)",
          }}
        />
      </div>
    </div>
  );
}

/**
 * A real photo, framed the same way `PlaceholderMedia` reserves its
 * space, and rendered as graphite — see `.graphite-image` in
 * globals.css. The blend mode is the important half: the image
 * subtracts light from the paper rather than sitting on it, so a
 * photograph can never be brighter than the sheet it is drawn on.
 */
export function Portrait({
  src,
  alt,
  ratio = "4/5",
  className = "",
  drift = false,
  priority = false,
}: {
  src: string;
  alt: string;
  ratio?: string;
  className?: string;
  drift?: boolean;
  priority?: boolean;
}) {
  // Positioned with `inset`, not `height: 110%` — inset resolves against
  // the nearest positioned ancestor's real box regardless of any static
  // (unsized) wrappers in between.
  const inner = (
    <div className="absolute -inset-y-[5%] inset-x-0">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 768px) 40vw, 100vw"
        className="graphite-image object-cover object-top"
      />
    </div>
  );

  return (
    <div className={className}>
      <div
        style={{ aspectRatio: ratio }}
        className="lift relative w-full rounded-[var(--radius)]"
      >
        <div className="absolute inset-0 overflow-hidden rounded-[var(--radius)]">
          {drift ? (
            <Parallax speed={0.12} className="h-full">
              {inner}
            </Parallax>
          ) : (
            inner
          )}
        </div>
      </div>
    </div>
  );
}

/** Pencil corner tick. Heavier than the old registration mark — a
 *  printed crop mark is hairline, a drawn one has weight. */
function Tick({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute block h-3.5 w-3.5 border-t-[1.3px] border-l-[1.3px] border-hair-strong [filter:url(#sk-rough-1)] ${className}`}
    />
  );
}

/**
 * Construction line.
 *
 * `axis` picks the filter, and it is not cosmetic. A filter's region is
 * a percentage of the element's own box, so on a 1px-tall rule the
 * default region is 1.2px tall and clips the displaced line back to
 * straight — the turbulence runs in full and produces nothing. These
 * guides were in exactly that state. `sk-rule-h` / `sk-rule-v` inflate
 * the region on the thin axis only; see components/sketch-defs.tsx.
 */
function Guide({
  className = "",
  axis,
}: {
  className?: string;
  axis: "h" | "v";
}) {
  return (
    <span
      aria-hidden
      /* INLINE, not a Tailwind arbitrary value. Tailwind extracts
         arbitrary values by scanning source files for literal strings,
         so a class built by interpolation — `[filter:url(#sk-rule-${axis})]` —
         is never generated and silently resolves to `filter: none`.
         It fails quietly: the guide still renders, just perfectly
         straight, which is the exact bug this component was fixed for. */
      style={{ filter: `url(#sk-rule-${axis})` }}
      className={`pointer-events-none absolute bg-hair opacity-60 ${className}`}
    />
  );
}
