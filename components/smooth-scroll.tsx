"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    /** Set only while inertial scrolling is active; absent under reduced motion. */
    __lenis?: Lenis;
  }
}

/** Inertial scrolling, disabled when the user prefers reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Published so anchor jumps can go through Lenis rather than racing it
    // with a native smooth scroll.
    window.__lenis = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
