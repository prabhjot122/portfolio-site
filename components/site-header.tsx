"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { sideNav, site, topNav } from "@/lib/content";
import { EASE, DUR } from "@/lib/motion";
import { useContactDialog } from "@/components/contact-dialog";
import { NAV_ICONS } from "@/components/icons";

/**
 * Two separate bars that never coexist:
 *
 * - mobile: the name plus a burger, at every scroll position;
 * - desktop: a small floating cluster in the top-right corner, shown only
 *   while the hero is at rest. It retires on the first scroll and hands over
 *   to the side rail, so the two chrome elements never compete.
 *
 * Both menus point at sections of the home page rather than separate routes,
 * so navigation is a scroll rather than a page load.
 */
export function SiteHeader({
  topBar = false,
  onNavigate,
}: {
  topBar?: boolean;
  onNavigate?: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const { open: openContact } = useContactDialog();

  // lock body scroll while the overlay menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/*
        Desktop: floating shortcut cluster, top-right.

        TWO ELEMENTS, DELIBERATELY. The outer one positions; the inner one
        is the drawn panel. They cannot be the same element for two
        separate reasons, and both of them bit:

        1. `.lift` sets `position: relative`. Merged onto the positioned
           element it fought `fixed` — and because this stylesheet's rules
           used to sit outside any cascade layer, `relative` won against
           the utility no matter the specificity. The cluster stopped
           being fixed, fell back into flow at full width, and `right-6`
           turned into a 24px shove that hung it off the LEFT edge of the
           screen. The layering fix in globals.css settles the cascade;
           this split keeps the two concerns from ever meeting again.

        2. `.lift`'s hatch shadow sits at `z-index: -1` and relies on
           escaping to an ancestor so the panel's own fill can hide the
           overlap. `position: fixed` plus `z-50` makes the element a
           stacking context, which traps the hatch and paints it across
           the panel's face instead of as a band behind its edge.
      */}
      <div
        aria-hidden={!topBar}
        className={`fixed top-5 right-6 z-50 hidden transition-[opacity,transform] duration-[var(--duration-slow)] ease-[var(--ease-exit)] md:block ${
          topBar
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
      {/* No backdrop blur. It was reading as frosted glass, which is a
          material this drawing does not have — the panel is opaque paper
          now and the drawn edge does the separating. */}
      <div className="lift flex items-center gap-1.5 rounded-full p-1.5">
        {/*
          THE WORDMARK, AT THE HEAD OF THE BAR.

          The cluster used to open straight onto "How we work" — three
          section links and a call, with nothing saying whose sections
          they were. On the desktop this bar is chrome that appears over
          the hero, before the rail has ridden in, so for that stretch
          the page carried no name at all.

          It is the SAME mark as the rail's identity card — hand face,
          semibold — a size down, because here it is a label on a
          toolbar rather than the top of a card. Its own rule separates
          it from the navigation so the name is not read as a fourth
          link.
        */}
        <Link
          href="/"
          tabIndex={topBar ? undefined : -1}
          data-cursor="link"
          className="font-hand ml-2.5 shrink-0 pr-3 text-[1.25rem] leading-none font-semibold whitespace-nowrap text-ink transition-opacity duration-[var(--duration-instant)] hover:opacity-70"
        >
          {site.name}
        </Link>
        <span
          aria-hidden
          className="mr-1 h-4 w-px shrink-0 bg-hair-strong [filter:url(#sk-rule-v)]"
        />
        {topNav.map((item) => (
          <Link
            key={item.id}
            href={`/#${item.id}`}
            tabIndex={topBar ? undefined : -1}
            data-cursor="link"
            onClick={(e) => {
              if (!onNavigate) return;
              e.preventDefault();
              onNavigate(item.id);
            }}
            className="rounded-full px-4 py-2 text-[12px] font-medium tracking-[0.08em] whitespace-nowrap text-ink-2 uppercase transition-colors duration-[var(--duration-instant)] hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
        <button
          onClick={openContact}
          tabIndex={topBar ? undefined : -1}
          data-cursor="button"
          className="ink-blob on-ink rounded-full px-4 py-2 text-[12px] font-medium tracking-[0.08em] text-surface-2 uppercase transition-transform duration-[var(--duration-base)] ease-[var(--ease-exit)] hover:-translate-y-0.5"
        >
          Book a call
        </button>
      </div>
      </div>

      {/*
        THE ONE PLACE ON THE SITE ALLOWED TO BE FROSTED GLASS.

        The desktop cluster explicitly refuses backdrop blur — see the
        note on it above — because it floats over a single, controlled
        background: the hero, at rest. This bar does not have that
        luxury. It is fixed for the entire scroll on a phone, so
        whatever is directly under it changes constantly — the ruled
        paper, a `.mount` screenshot, and now the charcoal band behind
        "How we work" and the closing frame. Sitting fully transparent
        over all of that is what actually reads as broken: the wordmark
        and the burger have no ground to sit on and their contrast swings
        with whatever scrolls underneath.

        A frosted panel is the honest fix for a BAR THAT IS ALWAYS ON,
        rather than the desktop cluster's problem of an occasional float
        over one known scene. `backdrop-blur` needs its own paint layer
        regardless of what is under it, so this is the one `blur-*`
        utility on the site and it stays scoped to `md:hidden`.
      */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-hair bg-surface/75 px-5 py-4 backdrop-blur-lg md:hidden">
        <div className="relative flex items-center justify-between">
          {/* The wordmark, set in the hand face — on a phone this is the
              only persistent piece of branding on the page, so it is the
              brand rather than a line of UI text. The backer line is not
              here: at this size the two would run together into one
              name, which is exactly the reading to avoid. */}
          <Link
            href="/"
            data-cursor="link"
            className="font-hand text-[1.5rem] leading-[1.05] font-semibold whitespace-nowrap text-ink transition-opacity hover:opacity-70"
          >
            {site.name}
          </Link>

          {/* Book a call, and the burger — grouped on the right so the
              call sits immediately to the burger's left rather than
              floating alone against the wordmark. Compact and uppercase,
              the same register as the desktop cluster's own button,
              because this bar is chrome doing the same job that
              cluster does, not a second hero CTA. */}
          <div className="flex items-center gap-3">
            <button
              onClick={openContact}
              data-cursor="button"
              className="ink-blob on-ink lift-interactive rounded-full px-3.5 py-2 text-[11px] font-medium tracking-[0.06em] whitespace-nowrap text-surface-2 uppercase transition-transform duration-[var(--duration-base)] ease-[var(--ease-exit)] active:translate-y-0"
            >
              Book a call
            </button>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="relative z-[60] flex h-10 w-10 shrink-0 items-center justify-center text-ink"
            >
              <span className="relative block h-3.5 w-6">
                <motion.span
                  className="absolute left-0 block h-px w-full bg-current"
                  animate={
                    open ? { top: 6, rotate: 45 } : { top: 0, rotate: 0 }
                  }
                  transition={{ duration: DUR.quick / 1000, ease: EASE.exit }}
                />
                <motion.span
                  className="absolute left-0 block h-px w-full bg-current"
                  animate={
                    open ? { top: 6, rotate: -45 } : { top: 12, rotate: 0 }
                  }
                  transition={{ duration: DUR.quick / 1000, ease: EASE.exit }}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <MobileMenu onClose={() => setOpen(false)} onNavigate={onNavigate} />
        )}
      </AnimatePresence>
    </>
  );
}

const SLATS = 4;

function MobileMenu({
  onClose,
  onNavigate,
}: {
  onClose: () => void;
  onNavigate?: (id: string) => void;
}) {
  const { open: openContact } = useContactDialog();

  return (
    <motion.div
      className="fixed inset-0 z-40 md:hidden"
      initial="hidden"
      animate="shown"
      exit="hidden"
    >
      {/* slats sweep down to form the backdrop */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: SLATS }).map((_, i) => (
          <motion.div
            key={i}
            className="h-full flex-1 bg-surface-2"
            variants={{ hidden: { y: "-100%" }, shown: { y: 0 } }}
            transition={{
              duration: DUR.slow / 1000,
              ease: EASE.transition,
              delay: i * 0.05,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative flex h-full flex-col px-5 pt-28 pb-10"
        variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
        transition={{ duration: 0.3, delay: 0.35 }}
      >
        {/* Sized down from the full `display-m` clamp. Six sections plus
            the call is one more row than this menu used to carry, and at
            the display size the list ran past the fold on a small phone —
            a navigation menu you have to scroll is a navigation menu that
            has stopped working.

            EACH ROW IS NOW A ROW, not a line in a stanza. `gap-2.5` alone
            read as one poem broken across five lines rather than five
            separate destinations — nothing marked where one ended and
            the next began. A hairline under each row and the section's
            own glyph from the desktop rail (`NAV_ICONS`, so a jump from
            phone to desktop is the same list, not two different ones)
            gives every row a boundary and a mark of its own, the way the
            desktop menu already has both. */}
        <nav className="flex flex-col">
          <div className="flex flex-col divide-y divide-hair border-t border-hair">
          {sideNav.slice(1).map((item) => {
            const Icon = NAV_ICONS[item.icon];
            return (
              <Link
                key={item.id}
                href={`/#${item.id}`}
                onClick={(e) => {
                  onClose();
                  if (!onNavigate) return;
                  e.preventDefault();
                  onNavigate(item.id);
                }}
                data-cursor="link"
                className="group flex items-center gap-3.5 py-4 transition-opacity duration-[var(--duration-instant)] active:opacity-60"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center text-ink-3 transition-colors duration-[var(--duration-instant)] group-active:text-accent">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="display-m text-[1.375rem]">{item.label}</span>
                <span
                  aria-hidden
                  className="stamp ml-auto text-ink-3 transition-transform duration-[var(--duration-instant)] group-active:translate-x-0.5"
                >
                  &rarr;
                </span>
              </Link>
            );
          })}
          </div>
          {/* The call is the same filled-graphite pill it is everywhere
              else on the site, not a seventh line of display type. It
              needs to be the one thing in this menu that is obviously a
              button, and it gets there on shape — the accent is reserved
              for measured values and does not get spent on a CTA.

              Kept outside the divided list on purpose: it is the exit
              from the list, not a sixth row in it, and a `divide-y`
              border landing on top of its own `mt-5` gap would have
              drawn two separations back to back. */}
          <button
            onClick={() => {
              onClose();
              openContact();
            }}
            className="ink-blob on-ink mt-5 w-full rounded-full py-3 text-center text-[15px] font-medium text-surface-2"
          >
            Book a call
          </button>
        </nav>

        <div className="mt-auto flex flex-col gap-1.5 border-t border-hair pt-5 text-[14px] text-ink-2">
          <span className="micro">{site.backedBy}</span>
          <a href={`mailto:${site.email}`} className="mt-1.5">
            {site.email}
          </a>
          <span className="text-ink-3">{site.location}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
