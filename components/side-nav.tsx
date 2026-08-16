"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { NAV_ICONS, CopyIcon, CheckIcon } from "@/components/icons";
import { Measured } from "@/components/ui";
import { blurb, sideNav, site, stats } from "@/lib/content";

/**
 * Shared panel treatment for every card in the rail.
 *
 * Panels are *lighter* than the ground and separated by shadow and
 * hairline — never by a darker fill.
 *
 * `lift-sm`, not `lift`. The rail cards are ~248px wide, and the
 * general-purpose shadow was built around an 18-34px blur sized for
 * media frames. At this width that blur spreads past the card on every
 * side and composites to a flat grey, so the rail read as sitting on a
 * grey panel rather than casting a shadow. The small tier keeps the
 * blur well under the card's short side so the shadow stays underneath
 * it.
 *
 * Radius is 5px from the token, not 16px. Large radii on panels this
 * size read as soft; the system wants drawn edges.
 */
const PANEL = "lift-sm p-4";

/** Width of the rail plus its outer gutters - pages reserve this on the left. */
export const RAIL_WIDTH = "16.5rem";

/**
 * Persistent left rail: identity, stats, navigation, contact.
 *
 * Pinned to the top-left and sized to its own content, so the cards sit in a
 * tight stack rather than being stretched down the full viewport. A max
 * height keeps it inside the screen on short displays; the menu is the one
 * card allowed to shrink and scroll if that ever bites.
 *
 * It is withheld over the hero so the headline can run the full width, then
 * slides in from the left edge once the page has scrolled past it.
 */
export function SideNav({
  visible,
  activeId,
  onNavigate,
}: {
  visible: boolean;
  activeId: string | null;
  onNavigate?: (id: string) => void;
}) {
  return (
    <aside
      aria-label="Sidebar"
      aria-hidden={!visible}
      // `visibility` (not display) keeps the slide transition running; it also
      // takes the whole rail out of the tab order while it is parked offscreen.
      className={`fixed top-4 left-4 z-50 hidden max-h-[calc(100vh-2rem)] w-[15.5rem] flex-col gap-2.5 overflow-hidden transition-[transform,opacity,visibility] duration-[var(--duration-slow)] ease-[var(--ease-exit)] md:flex ${
        visible
          ? "visible translate-x-0 opacity-100"
          : "invisible -translate-x-[calc(100%+1.5rem)] opacity-0"
      }`}
    >
      <Identity />
      <Stats />
      <Menu activeId={activeId} onNavigate={onNavigate} />
      <EmailCopy />
      <Link
        href="/contact"
        data-cursor="button"
        className="on-ink lift-interactive shrink-0 rounded-full bg-ink py-3 text-center text-[15px] font-medium text-surface-2 transition-transform duration-[var(--duration-base)] ease-[var(--ease-exit)] hover:-translate-y-0.5 active:translate-y-0"
      >
        Book a Call
      </Link>
    </aside>
  );
}

function Identity() {
  return (
    <div className={`${PANEL} shrink-0`}>
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-full bg-ink px-2 py-1 text-[13px] leading-none font-medium tracking-tight text-surface-2">
          {site.name}
        </span>
        <div className="flex gap-1.5">
          {site.socials.slice(0, 2).map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              data-cursor="link"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-hair text-[10px] text-ink-3 transition-colors duration-[var(--duration-instant)] hover:border-hair-strong hover:bg-surface-2 hover:text-ink"
            >
              {s.label.slice(0, 2)}
            </a>
          ))}
        </div>
      </div>
      <p className="mt-4 text-[12px] leading-[1.5] text-ink-2">{blurb}</p>
    </div>
  );
}

function Stats() {
  return (
    <div className={`${PANEL} flex shrink-0 items-stretch`}>
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`flex flex-1 flex-col items-center text-center ${
            i > 0 ? "border-l border-hair pl-3" : "pr-3"
          }`}
        >
          {/* Measured: these are counts, so they take the accent. */}
          <Measured className="text-[1.75rem] leading-none">{s.value}</Measured>
          <span className="mt-2 text-[11px] leading-[1.3] font-medium whitespace-pre-line text-ink-2">
            {s.label}
          </span>
        </div>
      ))}
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
    // The one card allowed to shrink: on a short viewport it scrolls
    // internally (bar hidden) rather than pushing the call to action off
    // screen. At any normal height it is simply as tall as its rows.
    <nav className={`${PANEL} no-scrollbar min-h-0 overflow-y-auto`}>
      <ul className="flex flex-col gap-0.5">
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
                className={`flex items-center gap-2 rounded-full px-2.5 py-1.5 text-[11px] font-medium tracking-[0.07em] whitespace-nowrap uppercase transition-colors duration-[var(--duration-instant)] ${
                  active
                    ? "on-ink bg-ink text-surface-2"
                    : "text-ink-2 hover:bg-surface-2 hover:text-ink"
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
