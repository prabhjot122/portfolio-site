import Image from "next/image";
import { Parallax } from "@/components/motion";

/**
 * Stand-in for project imagery.
 *
 * The audit's finding was that the old diagonal hatch read as a failed
 * image load, and that it covers roughly 40% of the page area — so
 * until real assets land, this component *is* half the site's visual
 * identity and has to be designed as such rather than tolerated.
 *
 * It is now a reserved frame rather than a missing one: a raised
 * near-white surface that participates in the same light model as
 * everything else, with corner registration marks and the plate
 * dimensions set in the data face. It reads as prepared, not broken.
 *
 * The inner wrapper is deliberately 110% tall and pulled up 5%: real
 * photos sit in that same overscan so they can drift on scroll without
 * exposing an edge. Swapping in a real <Image> changes nothing about
 * the surrounding layout.
 */
export function PlaceholderMedia({
  ratio = "4/5",
  label,
  className = "",
  drift = false,
}: {
  ratio?: string;
  label?: string;
  className?: string;
  /**
   * Drift the contents within the overscan as the frame passes through
   * the viewport. The 10% overscan exists precisely so this can happen
   * without ever exposing an edge: 12% total travel inside 10% of
   * headroom on each side.
   */
  drift?: boolean;
}) {
  const inner = (
    <div className="-mt-[5%] h-[110%] w-full">
      <div className="relative h-full w-full">
        {/* Registration marks — a print-production device, and the
            cheapest honest way to say "this frame is measured". */}
        <Corner className="top-3 left-3" />
        <Corner className="top-3 right-3 rotate-90" />
        <Corner className="bottom-3 left-3 -rotate-90" />
        <Corner className="right-3 bottom-3 rotate-180" />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
          <span className="micro text-ink-3">{label ?? "Image"}</span>
          <span className="measured text-[0.625rem] opacity-55">
            {ratio.replace("/", " : ")}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`overflow-hidden rounded-[var(--radius)] ${className}`}>
      <div
        style={{ aspectRatio: ratio }}
        className="lift relative w-full overflow-hidden rounded-[var(--radius)]"
      >
        {drift ? <Parallax speed={0.12}>{inner}</Parallax> : inner}
      </div>
    </div>
  );
}

/**
 * A real photo, framed the same way `PlaceholderMedia` reserves its
 * space: same overscan wrapper so it can drift on scroll without ever
 * exposing an edge, same rounded/lift surface. Swaps in wherever a
 * placeholder previously stood.
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
  // (unsized) wrappers in between, so it doesn't depend on percentage
  // heights cascading cleanly through the Parallax wrapper.
  const inner = (
    <div className="absolute -inset-y-[5%] inset-x-0">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 768px) 40vw, 100vw"
        className="object-cover object-top"
      />
    </div>
  );

  return (
    <div className={`overflow-hidden rounded-[var(--radius)] ${className}`}>
      <div
        style={{ aspectRatio: ratio }}
        className="lift relative w-full overflow-hidden rounded-[var(--radius)]"
      >
        {drift ? (
          <Parallax speed={0.12} className="h-full">
            {inner}
          </Parallax>
        ) : (
          inner
        )}
      </div>
    </div>
  );
}

function Corner({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute block h-3 w-3 border-t border-l border-hair-strong ${className}`}
    />
  );
}
