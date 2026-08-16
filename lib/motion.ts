/**
 * Motion system.
 *
 * The audit found one primitive — fade + 24px lift — applied 31 times
 * across 8 files with nothing varying but the delay, plus two dead
 * easing tokens while `cubic-bezier(0.16,1,0.3,1)` was hardcoded in
 * four separate files. This is the single source those all collapse
 * into.
 *
 * Four curves, and every one of them has a job:
 *
 *   exit        things leaving or settling into place. Fast start, long
 *               tail — the workhorse.
 *   reveal      scroll-triggered entrances. Slightly gentler attack so a
 *               run of them does not feel like popcorn.
 *   transition  page and curtain moves. Symmetric, so the exit and the
 *               entrance are the same gesture reversed.
 *   settle      the one curve with overshoot. Reserved for things that
 *               come to rest against something — a chip landing, the
 *               cursor arriving on a target.
 *
 * Durations are milliseconds here and divided by 1000 at the call site,
 * because CSS wants ms and motion/react wants seconds, and having one
 * number in one unit is worth the division.
 */

import type { Variants, Transition } from "motion/react";

export const EASE = {
  exit: [0.16, 1, 0.3, 1],
  reveal: [0.25, 1, 0.5, 1],
  transition: [0.87, 0, 0.13, 1],
  settle: [0.34, 1.28, 0.64, 1],
} as const;

export const DUR = {
  instant: 120,
  quick: 240,
  base: 420,
  slow: 700,
  curtain: 1100,
} as const;

/** Base gap between siblings in an orchestrated run. */
export const STAGGER = 0.06;

/** Seconds, for motion/react. */
export const s = (ms: number) => ms / 1000;

export const T = {
  quick: { duration: s(DUR.quick), ease: EASE.exit },
  base: { duration: s(DUR.base), ease: EASE.reveal },
  slow: { duration: s(DUR.slow), ease: EASE.exit },
  curtain: { duration: s(DUR.curtain), ease: EASE.transition },
} satisfies Record<string, Transition>;

/* ------------------------------------------------------------------
   Atoms
   ------------------------------------------------------------------ */

/**
 * The default entrance. Transform + opacity only.
 *
 * 18px rather than the old 24px: with a real stagger doing the work of
 * separating siblings, a shorter throw reads as more controlled and
 * costs less on a long page.
 */
export const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  shown: { opacity: 1, y: 0, transition: T.base },
};

/** For things entering from the side — rail cards, meta pairs. */
export const slide: Variants = {
  hidden: { opacity: 0, x: -14 },
  shown: { opacity: 1, x: 0, transition: T.base },
};

/**
 * A single line of display type sliding up from behind a mask.
 *
 * This is the one entrance that is not a fade: the line is fully opaque
 * the whole way and the mask does the reveal, which is what makes big
 * type feel like it was set rather than faded in. Requires the parent
 * to clip — see <MaskLine> in components/motion.tsx.
 */
export const maskLine: Variants = {
  hidden: { y: "115%" },
  shown: {
    y: "0%",
    transition: { duration: s(DUR.slow), ease: EASE.exit },
  },
};

/** Media frames: scale is done on a wrapper so the image never blurs. */
export const frame: Variants = {
  hidden: { opacity: 0, scale: 1.03 },
  shown: {
    opacity: 1,
    scale: 1,
    transition: { duration: s(DUR.slow), ease: EASE.exit },
  },
};

/* ------------------------------------------------------------------
   Orchestration
   ------------------------------------------------------------------ */

/**
 * Container that runs its children in sequence.
 *
 * `delayChildren` exists so a section can wait for its own heading to
 * land before its contents start, which is the difference between a
 * choreographed section and 12 things animating at once.
 */
export const stage = (stagger = STAGGER, delay = 0): Variants => ({
  hidden: {},
  shown: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

/**
 * Page-load choreography.
 *
 * Structure first, then the thesis, then everything that supports it.
 * These are the only hardcoded delays in the system; every other stagger
 * is relative.
 */
export const LOAD = {
  ground: 0,
  statement: 0.12,
  lede: 0.34,
  meta: 0.46,
  chrome: 0.58,
  media: 0.5,
} as const;
