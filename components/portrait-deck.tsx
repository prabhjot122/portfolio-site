import Image from "next/image";

import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { team } from "@/lib/content";

/**
 * Two portraits, dealt.
 *
 * At rest this is a pile: two cards tilted against each other and
 * overlapping, the way a pair of photographs ends up on a desk. Hover
 * the pile and it fans — the cards slide apart, level out, and each one
 * brings up a caption with its own GitHub and LinkedIn links.
 *
 * WHY IT IS BUILT THIS WAY
 *
 * The cards are absolutely positioned siblings in a box that owns the
 * aspect ratio, so the pile occupies exactly one card's footprint at
 * rest and the fan spills outside it without moving anything on the
 * page. Nothing here changes layout — the whole gesture is transform
 * and opacity, which is the rule the rest of the site runs on.
 *
 * Each card is TWO nested elements, and that is not incidental. The
 * outer one carries the tilt; the inner one carries `.lift`, the drawn
 * panel. They cannot be merged: `.lift` paints its hatch shadow at a
 * negative z-index and depends on escaping to an ancestor so the card's
 * own fill can hide the overlap. A transform makes an element a
 * stacking context, which would trap the hatch and smear it across the
 * face of the photograph instead of banding it behind the edge.
 *
 * The geometry below is per-card and passed as custom properties;
 * `.deck-card` in globals.css owns the rest and open states, because
 * hover is not expressible in an inline style.
 *
 * The captions are always on. They were briefly hover-gated and that
 * was wrong twice over: it hid who these people are behind a gesture
 * nobody is told about, and on a touch screen there is no hover to
 * find. Names, roles and links are page content, not an easter egg.
 */

/**
 * Rest and open geometry, one entry per card, in deal order.
 *
 * BOTH FACES READ WITHOUT HOVERING. The cards are anchored to opposite
 * edges of the deck and sized so they overlap by roughly a quarter —
 * enough that they read as a pair that belongs together, never enough
 * to bury one behind the other. An earlier version stacked them almost
 * squarely and relied on hover to separate them, which meant the second
 * person did not exist until you found them.
 *
 * Hover is therefore a flourish, not a reveal: the pair opens a little
 * further and leans out. Nothing that matters is behind it.
 *
 * Travel is bought mostly with rotation. The deck sits against the
 * right edge of the content column, so degrees are cheaper than pixels.
 */
const LAYOUT = [
  {
    side: "left-0",
    vars: {
      "--rest-x": "-4%",
      "--rest-y": "-2%",
      "--rest-r": "-6deg",
      "--open-x": "-12%",
      "--open-y": "-5%",
      "--open-r": "-9deg",
    },
  },
  {
    side: "right-0",
    vars: {
      "--rest-x": "4%",
      "--rest-y": "2%",
      "--rest-r": "5deg",
      "--open-x": "12%",
      "--open-y": "3%",
      "--open-r": "8deg",
    },
  },
] as const;

const SOCIAL_ICONS: Record<string, typeof GitHubIcon> = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
};

/**
 * `mini` is the hero variant.
 *
 * The product is now the loudest thing in the hero, and two full-size
 * portrait cards with roles and social buttons under each one competed
 * with it directly. Mini keeps the whole gesture — the pile, the fan,
 * the drawn frames, the graphite treatment — and drops what the page
 * already says elsewhere: roles are in the rail, and the social links
 * are in the rail and the footer both. What is left is the part that
 * only a photograph can do, which is prove there are two actual people
 * behind the software.
 */
export function PortraitDeck({
  className = "",
  variant = "full",
}: {
  className?: string;
  variant?: "full" | "mini";
}) {
  const mini = variant === "mini";

  return (
    <div
      // The deck's footprint holds BOTH cards side by side, overlapping
      // in the middle. Each card is 62% of it and anchored to one edge,
      // so the pair covers 124% of the width across a 24% overlap.
      className={`deck relative aspect-[5/4] w-full ${className}`}
    >
      {team.map((person, i) => (
        <div
          key={person.name}
          className={`deck-card absolute top-0 bottom-0 w-[62%] ${LAYOUT[i].side}`}
          style={LAYOUT[i].vars as React.CSSProperties}
        >
          <div
            className={`lift flex h-full flex-col rounded-[var(--radius)] ${
              mini ? "p-1.5" : "p-2.5"
            }`}
          >
            {/* The clip is its own element. `.lift` must never carry
                `overflow: hidden` — its drawn border paints outside the
                box and a clip anywhere on the same element straightens
                it back out. */}
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[var(--radius-sm)]">
              <Image
                src={person.photo}
                alt={`Portrait of ${person.name}`}
                fill
                priority={i === 0}
                sizes={mini ? "(min-width: 768px) 10vw, 28vw" : "(min-width: 768px) 22vw, 60vw"}
                className="graphite-image object-cover object-top"
              />
            </div>

            {mini ? (
              // First name only. The card is ~110px wide in the hero and
              // a full name at 10px either truncates or forces the
              // caption strip taller than the photograph deserves.
              <span className="mt-1.5 block shrink-0 truncate px-0.5 text-center text-[10px] leading-none text-ink-2">
                {person.name.split(" ")[0]}
              </span>
            ) : (
              <div className="mt-2.5 flex shrink-0 items-center justify-between gap-2">
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate text-[13px] font-medium text-ink">
                    {person.name}
                  </span>
                  <span className="truncate text-[11px] text-ink-3">
                    {person.role}
                  </span>
                </span>

                <span className="flex shrink-0 gap-1.5">
                  {person.socials.map((social) => {
                    const Icon = SOCIAL_ICONS[social.label];
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        aria-label={`${person.name} on ${social.label}`}
                        data-cursor="link"
                        className="ink-outline flex h-7 w-7 items-center justify-center rounded-full text-ink-3 transition-colors duration-[var(--duration-instant)] hover:text-ink"
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </a>
                    );
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
