"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE, DUR, s } from "@/lib/motion";

const SLATS = 4;
/** Hard ceiling: past this the curtain is torn down no matter what. */
const FAILSAFE_MS = 3000;

/**
 * Intro curtain: a full-bleed panel split into vertical slats that
 * retract upward in sequence.
 *
 * The counter is gone. It ticked to 100 on a 40ms interval while
 * measuring nothing — a progress bar for a process it had no handle
 * on. What replaces it is the one thing actually worth waiting for on
 * this page: the display face. Until Newsreader is resolved the hero
 * is set in a fallback with different metrics, and letting that swap
 * happen in front of the reader is the flicker the curtain exists to
 * hide. So the curtain now waits on `document.fonts.ready` and lifts
 * the moment it resolves.
 *
 * The curtain covers the whole page, so every path out of it must be
 * guaranteed. It is skipped entirely when the document starts hidden
 * (opened in a background tab) because requestAnimationFrame — which
 * drives the exit animation — is suspended there, and a failsafe timer
 * tears it down if anything else stalls.
 */
export function Preloader() {
  // Start hidden and enable on mount, so SSR markup never ships a curtain
  // that a JS-less or hydration-failed client could get stuck behind.
  const [active, setActive] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // document.hidden: opened in a background tab - rAF is suspended, so the
    // exit animation would never run and the curtain would stick.
    if (reduceMotion || document.hidden) return;

    setActive(true);
    let done = false;
    const lift = () => {
      if (done) return;
      done = true;
      setActive(false);
    };

    // The real signal. Guarded because `document.fonts` is absent in a
    // few older engines, where we simply fall through to the failsafe.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        // One frame of settle so the swapped metrics are painted before
        // the slats move, rather than during.
        requestAnimationFrame(() => requestAnimationFrame(lift));
      });
    }

    const failsafe = window.setTimeout(lift, FAILSAFE_MS);

    // If the tab is backgrounded mid-run, drop the curtain immediately
    // rather than leaving a frozen animation for the user to return to.
    const onVisibility = () => {
      if (document.hidden) lift();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      done = true;
      window.clearTimeout(failsafe);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[9000]"
          exit={{}}
        >
          <div className="absolute inset-0 flex">
            {Array.from({ length: SLATS }).map((_, i) => (
              <motion.div
                key={i}
                className="h-full flex-1 bg-ground"
                initial={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{
                  duration: s(DUR.curtain),
                  ease: EASE.transition,
                  // Left to right, so the lift reads as light crossing
                  // the page rather than four panels leaving at once.
                  delay: i * 0.07,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
