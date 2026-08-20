import Image from "next/image";

/**
 * A product screen, framed the way every other plate on this site is
 * framed.
 *
 * WHY THIS EXISTS AS ITS OWN COMPONENT. The site is a drawing — wobbled
 * borders, hatched shadows, a hand face for every heading — and the one
 * thing that is supposed to cut against all of it is real software. A
 * screenshot is the only rectangle on the page that is allowed to look
 * machine-made, and that contrast is doing the credibility work. So the
 * frame stays hand-drawn and the contents do not get stylised: no
 * graphite conversion, no multiply blend, no tilt. The plate is a hand;
 * what it is holding is a product.
 *
 * IT RENDERS A HELD PLACE, NOT A FAKE. When `src` is null it draws the
 * prepared plate — frame, registration ticks, compositional thirds, a
 * patch of value hatching in the shaded corner — and says what is going
 * to sit there. That is a real stage of a real drawing, which is why it
 * reads as prepared rather than as a failed image load. Inventing a
 * plausible dashboard would be the one dishonest thing on a page whose
 * whole argument is that the work is real.
 *
 * THE OVERFLOW TRAP (inherited from placeholder-media.tsx, same rules).
 * The drawn border is a pseudo-element pushed off its path by a
 * displacement filter, so it paints OUTSIDE the element's box. Any
 * `overflow: hidden` on the same element clips it straight again,
 * silently. The frame and the clip are therefore two different elements:
 * `.lift` carries the border and never clips; a nested absolute layer
 * does the clipping.
 */
export function ProductShot({
  src,
  alt,
  label,
  caption,
  ratio = "16/10",
  className = "",
  priority = false,
}: {
  src?: string | null;
  alt: string;
  /** Shown inside the plate while there is no image. */
  label: string;
  /** Figure caption under the plate. Always shown. */
  caption?: string;
  ratio?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure className={className}>
      <div
        style={{ aspectRatio: ratio }}
        className="lift relative w-full rounded-[var(--radius)]"
      >
        <div className="absolute inset-0 overflow-hidden rounded-[var(--radius)]">
          {src ? (
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              sizes="(min-width: 768px) 34vw, 100vw"
              className="object-cover object-top"
            />
          ) : (
            <>
              {/* Construction lines. The lightest marks on the page —
                  they are meant to be almost invisible. */}
              <Guide axis="h" className="top-1/3 right-0 left-0 h-px" />
              <Guide axis="h" className="top-2/3 right-0 left-0 h-px" />
              <Guide axis="v" className="top-0 bottom-0 left-1/3 w-px" />
              <Guide axis="v" className="top-0 right-1/3 bottom-0 w-px" />

              <Tick className="top-3 left-3" />
              <Tick className="top-3 right-3 rotate-90" />
              <Tick className="bottom-3 left-3 -rotate-90" />
              <Tick className="right-3 bottom-3 rotate-180" />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
                <span className="micro text-ink-3">{label}</span>
                <span className="text-[11px] text-ink-3 opacity-70">
                  Interface capture
                </span>
              </div>
            </>
          )}
        </div>

        {/* Value study — the corner the light does not reach. Masked so
            it fades out rather than ending on an edge, which no hand
            would draw. Only over the held plate: a real screenshot is
            not something you shade. */}
        {!src && (
          <span
            aria-hidden
            className="hatch pointer-events-none absolute right-0 bottom-0 h-[38%] w-[46%] rounded-[var(--radius)]"
            style={{
              maskImage: "linear-gradient(305deg, black 0%, transparent 78%)",
              WebkitMaskImage:
                "linear-gradient(305deg, black 0%, transparent 78%)",
            }}
          />
        )}
      </div>

      {caption && (
        <figcaption className="micro mt-3 text-ink-3">{caption}</figcaption>
      )}
    </figure>
  );
}

/** Pencil corner tick. A printed crop mark is hairline; a drawn one has weight. */
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
 * `axis` picks the filter and it is not cosmetic: a filter's region is a
 * percentage of the element's own box, so on a 1px-tall rule the default
 * region clips the displaced line straight back to true — the turbulence
 * runs in full and produces nothing. `sk-rule-h` / `sk-rule-v` inflate
 * the region on the thin axis only.
 *
 * INLINE STYLE, not a Tailwind arbitrary value: Tailwind extracts
 * arbitrary values by scanning for literal strings, so an interpolated
 * class never gets generated and resolves silently to `filter: none`.
 */
function Guide({ className = "", axis }: { className?: string; axis: "h" | "v" }) {
  return (
    <span
      aria-hidden
      style={{ filter: `url(#sk-rule-${axis})` }}
      className={`pointer-events-none absolute bg-hair opacity-60 ${className}`}
    />
  );
}
