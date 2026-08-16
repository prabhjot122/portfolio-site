"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { sideNav, site, topNav } from "@/lib/content";
import { EASE, DUR } from "@/lib/motion";

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

  // lock body scroll while the overlay menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Desktop: floating shortcut cluster, top-right. */}
      <div
        aria-hidden={!topBar}
        className={`lift fixed top-5 right-6 z-50 hidden items-center gap-1.5 rounded-full p-1.5 backdrop-blur-md transition-[opacity,transform] duration-[var(--duration-slow)] ease-[var(--ease-exit)] md:flex ${
          topBar
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
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
            className="rounded-full px-4 py-2 text-[12px] font-medium tracking-[0.08em] whitespace-nowrap text-ink-2 uppercase transition-colors duration-[var(--duration-instant)] hover:bg-surface-2 hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/contact"
          tabIndex={topBar ? undefined : -1}
          data-cursor="button"
          className="on-ink rounded-full bg-ink px-4 py-2 text-[12px] font-medium tracking-[0.08em] text-surface-2 uppercase transition-transform duration-[var(--duration-base)] ease-[var(--ease-exit)] hover:-translate-y-0.5"
        >
          Book a call
        </Link>
      </div>

      <header className="fixed top-0 right-0 left-0 z-50 px-5 py-5 md:hidden">
        <div className="relative flex items-center justify-between">
          <Link
            href="/"
            data-cursor="link"
            className="text-[15px] whitespace-nowrap text-ink transition-opacity hover:opacity-70"
          >
            {site.name}
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative z-[60] flex h-10 w-10 items-center justify-center text-ink"
          >
            <span className="relative block h-3.5 w-6">
              <motion.span
                className="absolute left-0 block h-px w-full bg-current"
                animate={open ? { top: 6, rotate: 45 } : { top: 0, rotate: 0 }}
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
        <nav className="flex flex-col gap-2">
          {sideNav.slice(1).map((item) => (
            <Link
              key={item.id}
              href={`/#${item.id}`}
              onClick={(e) => {
                onClose();
                if (!onNavigate) return;
                e.preventDefault();
                onNavigate(item.id);
              }}
              className="display-m"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" onClick={onClose} className="display-m">
            Get in touch
          </Link>
        </nav>

        <div className="mt-auto flex flex-col gap-2 text-[15px] text-ink-2">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <span>{site.location}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
