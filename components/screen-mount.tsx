import Image from "next/image";

/**
 * A captured interface, pinned to the sheet.
 *
 * The Selected Work section is mostly this component, so it is worth
 * being clear about what it is FOR. It is not a card. A card is a
 * container that groups things; a mount is a piece of card stock with
 * one screen fixed to it and its size written along the top, the way a
 * contact sheet or a spec board carries an image. That distinction is
 * what stops three projects in a column from reading as a product grid.
 *
 * THE SCREENS ARE NOT DRAWN. Every screen here is a placeholder holding
 * the exact box a real capture will occupy — see `Shot` below. The
 * prototype these came from drew each interface out in full, which is
 * the right thing for a prototype and the wrong thing to ship: a
 * hand-built approximation of a product's UI is a claim about what the
 * product looks like, and it will be wrong the first time the product
 * changes. Reserving the space honestly is the version that survives
 * contact with a real screenshot.
 *
 * ------------------------------------------------------------------
 * THREE VARIANTS, AND WHY EACH EXISTS
 *
 *   sheet    a padded mount with a caption row across the top, holding
 *            one or more phone-shaped screens. The caption names the
 *            screens on the left and the device size on the right.
 *
 *   window   a tight mount whose screen carries desktop chrome — three
 *            dots and a path. The path is the caption.
 *
 *   device   a small padded mount holding one photograph of hardware.
 *            No chrome, because there is no software in the picture.
 *
 * The variant follows the DEVICE, not the layout. A phone shown in
 * window chrome is a lie about the platform, and a desktop capture
 * floated on a padded sheet loses the one cue that tells a reader they
 * are looking at software rather than an illustration.
 *
 * `device` is small, and that is a judgement rather than a constraint.
 * A photograph of a board on a desk has nothing in it that rewards the
 * full measure — enlarging it only claims an importance the picture
 * cannot pay back. It is shown at object scale, and the space beside it
 * is left for the note.
 *
 * ------------------------------------------------------------------
 * THE CORNERS
 *
 * `.mount` in globals.css takes its four corner radii from custom
 * properties, and this component deals them out per instance from
 * `CORNERS`. A run of mounts down a page is therefore never the same
 * shape twice, which is the entire hand-drawn effect and costs nothing
 * — no filter, no repaint, and it holds at any size.
 *
 * The rotation is by index rather than random. A random shape would
 * change between the server render and the client one and hydration
 * would mismatch; more practically, a run of mounts wants to be
 * DIFFERENT from one another rather than individually arbitrary, and
 * rotating a fixed set guarantees that. There are four sets and four
 * projects, so the section currently uses each exactly once.
 */

/** Four hand-cut corner sets, rotated by index. See the note above. */
const CORNERS = [
  ["14px", "9px", "15px", "8px"],
  ["9px", "15px", "8px", "14px"],
  ["15px", "8px", "14px", "9px"],
  ["8px", "14px", "9px", "15px"],
] as const;

function corners(index: number) {
  const [r1, r2, r3, r4] = CORNERS[index % CORNERS.length];
  return {
    "--mount-r1": r1,
    "--mount-r2": r2,
    "--mount-r3": r3,
    "--mount-r4": r4,
  } as React.CSSProperties;
}

/**
 * Device proportions.
 *
 * These are facts about the hardware, not style choices, which is why
 * they live as named constants rather than as a number in a class
 * string. `PHONE` is the size the prototype states on its own caption
 * row; `WINDOW` is the ratio a desktop capture actually comes out at.
 */
const PHONE = "390 / 844";
const WINDOW = "16 / 9";
/** A photograph of an object, not a capture of a screen. */
const DEVICE = "4 / 3";

type Screen = {
  /** Real alt text for the capture that will land here. */
  alt: string;
  /** Set once a real capture exists; until then the shot is reserved. */
  src?: string | null;
};

/**
 * A phone pair on a padded mount, captioned along the top.
 *
 * The two screens are equal columns with a fixed gutter, and both take
 * the full device ratio rather than sizing to their contents — two
 * phones of different heights side by side reads as a layout bug, and
 * real captures of the same device are the same height anyway.
 */
export function SheetMount({
  caption,
  size,
  screens,
  index = 0,
  className = "",
}: {
  caption: string;
  size?: string;
  screens: Screen[];
  index?: number;
  className?: string;
}) {
  return (
    <div
      style={corners(index)}
      className={`mount px-6 pt-5 pb-6 md:px-[1.875rem] md:pt-[1.625rem] md:pb-[1.875rem] ${className}`}
    >
      {/* The caption row. `items-baseline` rather than `center`: these
          are two pieces of the same written line, and centring them
          against each other lets the shorter one drift. */}
      <div className="flex items-baseline justify-between gap-4 pb-[1.125rem]">
        <span className="stamp text-ink-3">{caption}</span>
        {size && (
          // Repetition of what the ratio already shows, so it is
          // allowed the sub-AA grey. See --color-faint in globals.css.
          <span className="stamp shrink-0 text-faint">{size}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-[1.625rem]">
        {screens.map((screen) => (
          <div key={screen.alt} className="mount-screen rounded-[1.375rem]">
            <Shot ratio={PHONE} screen={screen} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * A desktop capture in window chrome.
 *
 * The chrome is part of the mount rather than part of the screenshot —
 * three inert dots and the path. It is doing one job: telling a reader
 * at a glance that this is software and roughly where in it they are.
 * The dots are not buttons and are not labelled, because they do not do
 * anything; the path is the caption.
 */
export function WindowMount({
  caption,
  screen,
  index = 0,
  className = "",
}: {
  caption: string;
  screen: Screen;
  index?: number;
  className?: string;
}) {
  return (
    <div style={corners(index)} className={`mount p-3 ${className}`}>
      <div className="mount-screen rounded-[var(--radius-sm)]">
        <div className="flex items-center gap-2.5 border-b border-hair bg-surface px-4 py-[0.6875rem]">
          <span aria-hidden className="flex gap-1.5">
            <Dot />
            <Dot />
            <Dot />
          </span>
          <span className="ml-2 truncate font-mono text-[0.65rem] tracking-[0.04em] text-ink-3">
            {caption}
          </span>
        </div>
        <Shot ratio={WINDOW} screen={screen} />
      </div>
    </div>
  );
}

function Dot() {
  return <span className="block size-2 rounded-full bg-hair-strong" />;
}

/**
 * One photograph of hardware, on a small padded mount.
 *
 * Structurally a `SheetMount` with a single 4:3 plate, and it is a
 * separate component rather than a prop because the two are captioned
 * differently: a sheet names its screens and states a pixel size, while
 * this names an object and states what is inside it. `Pi 5 · IMX500`
 * is not a dimension and putting it through the size slot would read as
 * one.
 *
 * WIDTH IS CAPPED HERE, not at the call site. The cap is a fact about
 * what this variant is for — see the note at the top of the file — and
 * a call site that could opt out of it would eventually opt out of it.
 */
export function DeviceMount({
  caption,
  detail,
  screen,
  index = 0,
  className = "",
}: {
  caption: string;
  /** What it is made of. Sits right, in the faint grey. */
  detail?: string;
  screen: Screen;
  index?: number;
  className?: string;
}) {
  return (
    <div
      style={corners(index)}
      className={`mount w-full max-w-[24rem] px-5 pt-4 pb-5 ${className}`}
    >
      <div className="flex items-baseline justify-between gap-4 pb-3.5">
        <span className="stamp text-ink-3">{caption}</span>
        {detail && <span className="stamp shrink-0 text-faint">{detail}</span>}
      </div>
      <div className="mount-screen rounded-[var(--radius-sm)]">
        <Shot ratio={DEVICE} screen={screen} />
      </div>
    </div>
  );
}

/**
 * The screen itself — a real capture, or the space one will occupy.
 *
 * THE RATIO IS SET EITHER WAY. That is the whole contract: the page
 * lays out identically before and after the screenshot lands, so
 * dropping a file in cannot reflow the section it sits in.
 *
 * The reserved state is ruled with the same fine pitch as the sheet
 * (`.mount-shot` in globals.css) and marked at the corners the way the
 * larger plates are — see components/placeholder-media.tsx, which is
 * the same idea at the size a full-width plate needs. The size readout
 * is set in the faint grey because the shape of the box already says
 * it; it is a repetition, not information.
 */
function Shot({ ratio, screen }: { ratio: string; screen: Screen }) {
  if (screen.src) {
    return (
      <div style={{ aspectRatio: ratio }} className="relative w-full">
        <Image
          src={screen.src}
          alt={screen.alt}
          fill
          sizes="(min-width: 768px) 60vw, 100vw"
          className="object-cover object-top"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`${screen.alt} — capture pending`}
      style={{ "--shot-ratio": ratio } as React.CSSProperties}
      className="mount-shot relative w-full"
    >
      <Tick className="top-2.5 left-2.5" />
      <Tick className="top-2.5 right-2.5 rotate-90" />
      <Tick className="bottom-2.5 left-2.5 -rotate-90" />
      <Tick className="right-2.5 bottom-2.5 rotate-180" />
      <span className="stamp absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-faint">
        {ratio.replace(" / ", " × ")}
      </span>
    </div>
  );
}

/** Corner registration mark — the smaller sibling of the one on the
 *  full-size plates in components/placeholder-media.tsx. */
function Tick({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute block size-2.5 border-t border-l border-hair-strong [filter:url(#sk-rough-1)] ${className}`}
    />
  );
}
