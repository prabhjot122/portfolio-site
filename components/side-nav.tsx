"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  NAV_ICONS,
  CopyIcon,
  CheckIcon,
  GitHubIcon,
  LinkedInIcon,
} from "@/components/icons";
import { useContactDialog } from "@/components/contact-dialog";
import { blurb, sideNav, site, team } from "@/lib/content";

/**
 * Shared panel treatment for every card in the rail.
 *
 * `lift-sm` is the drawn-panel utility from globals.css: surface fill,
 * a border pushed off its path by a displacement filter, and a band of
 * hatching offset down-right where the shadow used to be.
 *
 * Radius is 8px from the token, not 16px. The filter supplies the
 * irregularity; a large radius on top of it reads as a rounded
 * rectangle that happens to be shaky rather than as a drawn box.
 */
const PANEL = "lift-sm p-4";

/** Width of the rail plus its outer gutters - pages reserve this on the left. */
export const RAIL_WIDTH = "16.5rem";

/**
 * Persistent left rail: identity, navigation, contact.
 *
 * Pinned to the top-left and sized to its own content, so the cards sit in a
 * tight stack rather than being stretched down the full viewport. A max
 * height keeps it inside the screen on short displays; the menu is the one
 * card allowed to shrink and scroll if that ever bites.
 *
 * It is withheld over the hero so the headline can run the full width, then
 * slides in from the left edge once the page has scrolled past it.
 *
 * NOTE ON OVERFLOW: this element used to clip. It cannot any more — every
 * panel's drawn border paints a few pixels outside its own box, and an
 * `overflow: hidden` anywhere up the tree straightens all of them back
 * out. `visibility` already takes the parked rail out of the tab order,
 * which was the only job the clip was really doing.
 */
/**
 * THE RAIL IS DRAWN TWICE, AND THAT IS THE ONLY HONEST WAY TO DO IT.
 *
 * One frame on the site — "How we work" — is printed on dark stock, and
 * the rail is `position: fixed`. So for most of a scroll it sits over
 * paper, for a stretch it sits over charcoal, and in between it sits
 * over BOTH: the seam runs through the middle of the identity card while
 * the menu below it is still on paper. A theme swapped at a threshold —
 * an IntersectionObserver, a class toggle, a `useState` — cannot say
 * that. It can only be wrong on one half of the rail or the other, and
 * it flips at whatever arbitrary line the observer was given.
 *
 * So both versions exist at once, stacked, and the DARK COPY IS CLIPPED
 * TO EXACTLY THE BAND OF DARK STOCK BEHIND IT. `clip-path: inset()` in
 * viewport-derived pixels, rewritten from the same per-frame measurement
 * that positions the band itself (components/app-shell.tsx). Halfway
 * through the section, the rail is genuinely half-and-half, and the seam
 * on the rail is the same pixel row as the seam on the page.
 *
 * The dark copy is `aria-hidden` and `inert`, so the duplication is
 * purely optical: one rail in the accessibility tree, one tab order, one
 * set of controls. It is also `pointer-events: none`, so the clicks land
 * on the real one underneath at every scroll position.
 *
 * THE HORIZONTAL INFLATION (`-left-3` / `w-[calc(100%+1.5rem)]` / `px-3`)
 * IS CLEARANCE, NOT SPACING. `clip-path: inset()` clips on all four
 * sides and refuses negative offsets, so a clip that stops at the rail's
 * own box would shave the few pixels of drawn border that every panel
 * paints outside itself — the dark copy would come out with straight
 * sides against the light copy's wobbly ones. The padding hands the clip
 * 12px of slack to land in on either side while the content inside stays
 * in exactly the same place as the light copy's.
 */
export function SideNav({
  ref,
  darkRef,
  activeId,
  onNavigate,
}: {
  /**
   * The sticky travel is written straight to this node's transform by
   * AppShell, once per frame. Nothing else may transition on this
   * element — a transition here would be re-triggered on every one of
   * those writes and the rail would lag the scroll it is tracking.
   */
  ref?: React.Ref<HTMLDivElement>;
  /** The dark twin. AppShell writes its `clip-path` on the same frame. */
  darkRef?: React.Ref<HTMLDivElement>;
  activeId: string | null;
  onNavigate?: (id: string) => void;
}) {
  const { open } = useContactDialog();

  return (
    <div
      ref={ref}
      className="fixed top-4 left-4 z-50 hidden w-[15.5rem] will-change-transform md:block"
    >
      <RailBody activeId={activeId} onNavigate={onNavigate} onBook={open} />

      {/*
        The same rail, on dark stock. Starts fully clipped away —
        `inset(100% 0 0 0)` is an empty rect — so it can never flash
        before AppShell's first measurement lands.
      */}
      <div
        ref={darkRef}
        aria-hidden
        inert
        data-surface="dark"
        className="pointer-events-none absolute top-0 -left-3 w-[calc(100%+1.5rem)] px-3"
        style={{ clipPath: "inset(100% 0 0 0)" }}
      >
        <RailBody activeId={activeId} />
      </div>
    </div>
  );
}

/**
 * The rail's contents, so the light copy and the dark copy cannot drift
 * apart. They have to lay out identically to the pixel — the clip is a
 * straight horizontal cut across both, and a single line of difference
 * in either would show up as a jog at the seam.
 *
 * The dark copy passes no handlers. Its controls are already unreachable
 * (`inert`, `pointer-events: none`) and wiring them up would mean two
 * live "copy email" buttons racing the same state.
 *
 * ALWAYS PRESENT, ALWAYS OPAQUE.
 *
 * This used to fade and slide in once the page had scrolled past the
 * hero, which meant the rail announced itself twice — once by arriving
 * and again by fading up — and read as flickering rather than as
 * furniture. It is now simply always here at full opacity; the only
 * thing that moves is where it sits, which the sticky travel in AppShell
 * handles. Riding into view on the section it belongs to is the
 * entrance. It does not need a second one.
 */
function RailBody({
  activeId,
  onNavigate,
  onBook,
}: {
  activeId: string | null;
  onNavigate?: (id: string) => void;
  onBook?: () => void;
}) {
  return (
    <aside
      aria-label="Sidebar"
      className="flex max-h-[calc(100vh-2rem)] flex-col gap-3"
    >
      <Identity onNavigate={onNavigate} />
      <Menu activeId={activeId} onNavigate={onNavigate} />
      <EmailCopy />
      <button
        onClick={onBook}
        data-cursor="button"
        className="ink-blob lift-interactive on-ink shrink-0 rounded-full py-3 text-center text-[15px] font-medium text-surface-2 transition-transform duration-[var(--duration-base)] ease-[var(--ease-exit)] hover:-translate-y-0.5 active:translate-y-0"
      >
        Book a Call
      </button>
    </aside>
  );
}

const SOCIAL_ICONS: Record<string, typeof GitHubIcon> = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
};

/**
 * The identity card, rebalanced.
 *
 * IT USED TO OPEN ON TWO NAMES. Sahil and Prabhjot were the first thing
 * in the rail, set as filled graphite chips, with nothing above them —
 * so the most prominent piece of persistent chrome on the site said the
 * product was two people rather than a studio. That is the wrong claim
 * for a business selling multi-month software builds.
 *
 * Three tiers now, and the gap between them is the message:
 *
 *   Buildvriksh          the hand face, largest thing in the card
 *   Learning technology studio
 *                        what kind of company that is
 *   Backed by Lawvriksh  micro, ink-3, under its own rule
 *
 * The backer line is deliberately the quietest text in the card and sits
 * below a divider, so it reads as a footnote about the company rather
 * than as the second half of its name. "Buildvriksh backed by Lawvriksh"
 * must never scan as one product.
 *
 * The founders keep their chips — the handmade treatment is the rail's
 * personality and a two-person studio hiding its two people reads as a
 * template — but they are now the third thing you look at instead of the
 * first, and the chips are a size smaller to say so.
 */
function Identity({
  onNavigate,
}: {
  /**
   * Passed only when the shell is already on the home page (see
   * AppShell — it hands this down as `undefined` on every other route).
   * That fact stands in for "are we home", so a click on the wordmark
   * takes the same branch the nav rows do: home already means scroll
   * to "top" rather than let `<Link>` reload the page it is already on.
   * Off the home page it is `undefined` and the click falls through to
   * the plain `href="/"` navigation.
   */
  onNavigate?: (id: string) => void;
}) {
  return (
    <div className={`${PANEL} shrink-0`}>
      <Link
        href="/"
        data-cursor="link"
        onClick={(e) => {
          if (!onNavigate) return;
          e.preventDefault();
          onNavigate("top");
        }}
        className="font-hand block text-[1.75rem] leading-[1.05] font-semibold text-ink transition-opacity duration-[var(--duration-instant)] hover:opacity-70"
      >
        {site.name}
      </Link>
      <p className="mt-2 text-[12px] leading-[1.4] text-ink-2">{site.role}</p>

      <p className="micro mt-3 border-t border-hair pt-3 text-[0.625rem]">
        {site.backedBy}
      </p>

      <div className="mt-4 flex flex-col gap-2 border-t border-hair pt-4">
        {team.map((person) => (
          <div
            key={person.name}
            className="flex items-center justify-between gap-2"
          >
            <span className="ink-blob on-ink rounded-full px-2.5 py-1 text-[12px] leading-none text-surface-2">
              {person.name}
            </span>
            <div className="flex gap-1.5">
              {person.socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.label];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={`${person.name} on ${s.label}`}
                    data-cursor="link"
                    className="ink-outline flex h-6 w-6 items-center justify-center rounded-full text-ink-3 transition-colors duration-[var(--duration-instant)] hover:text-ink"
                  >
                    <Icon className="h-3 w-3" />
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3.5 text-[12px] leading-[1.5] text-ink-2">{blurb}</p>
    </div>
  );
}

function Menu({
  activeId,
  onNavigate,
}: {
  activeId: string | null;
  onNavigate?: (id: string) => void;
}) {
  return (
    // The one card allowed to shrink. The scroll lives on the list rather
    // than on the panel: `overflow-y-auto` on the panel itself would clip
    // its own drawn border straight.
    //
    // `px-1.5 -mx-1.5` is not spacing, it is clearance. `overflow-y: auto`
    // forces `overflow-x` to `auto` as well, so the list clips at its
    // padding box — and the active row's lasso is drawn OUTSIDE its own
    // box, by a negative inset plus whatever the displacement filter
    // throws on top. Without this padding the loop was being sliced off
    // against the card's inner edge.
    <nav className={`${PANEL} flex min-h-0 flex-col`}>
      <ul className="no-scrollbar -mx-1.5 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-1.5">
        {sideNav.map((item) => {
          const Icon = NAV_ICONS[item.icon];
          const active = activeId === item.id;

          return (
            <li key={item.id}>
              <Link
                href={`/#${item.id}`}
                aria-current={active ? "true" : undefined}
                data-cursor="link"
                onClick={(e) => {
                  if (!onNavigate) return;
                  e.preventDefault();
                  onNavigate(item.id);
                }}
                // Active used to be circled with a drawn LASSO — a
                // hand-rough loop via `filter: url(#sk-rough-1)`, the
                // same treatment as every panel border on the site. It
                // read as scribble here specifically: a loop that size,
                // redrawn on every row change, was busier than the list
                // it was marking. The border stays; only the roughening
                // goes. `border-transparent` on the inactive state
                // reserves the same 1px this the active state spends, so
                // toggling never nudges the row's own width.
                className={`flex items-center gap-1.5 rounded-full border px-2 py-1.5 text-[11px] font-medium tracking-[0.045em] whitespace-nowrap uppercase transition-colors duration-[var(--duration-instant)] ${
                  active
                    ? "border-hair-strong text-ink"
                    : "border-transparent text-ink-2 hover:text-ink"
                }`}
              >
                <Icon />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function EmailCopy() {
  const [copied, setCopied] = useState(false);

  // Reset the confirmation without leaving a timer behind on unmount.
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
    } catch {
      // Clipboard can reject on insecure origins or denied permission -
      // leave the address visible so it can still be selected by hand.
    }
  };

  return (
    <button
      onClick={copy}
      data-cursor="copy"
      className="lift-sm group flex shrink-0 items-center justify-between gap-2 px-3 py-2.5 text-[12px] text-ink-2 transition-colors duration-[var(--duration-instant)] hover:text-ink"
    >
      <span className="truncate">{site.email}</span>
      <span className="text-ink-3 transition-colors duration-[var(--duration-instant)] group-hover:text-accent">
        {copied ? <CheckIcon /> : <CopyIcon />}
      </span>
      <span className="sr-only" role="status">
        {copied ? "Email copied to clipboard" : ""}
      </span>
    </button>
  );
}
