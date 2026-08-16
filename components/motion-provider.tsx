"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Global motion policy.
 *
 * The `@media (prefers-reduced-motion: reduce)` block in globals.css
 * only reaches CSS transitions and keyframes. Every entrance on this
 * site is driven by motion/react in JavaScript, which that media query
 * cannot touch — so without this the reduced-motion setting was being
 * honoured by the curtain, the smooth scroll and the shader, and
 * quietly ignored by all 31 scroll reveals and the entire load
 * sequence.
 *
 * `reducedMotion="user"` makes motion/react read the same preference:
 * transform and layout animations are dropped, opacity is kept, so
 * content still resolves rather than appearing pre-placed with no
 * indication anything happened.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
