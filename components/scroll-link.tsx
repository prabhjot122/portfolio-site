"use client";

import type { ReactNode } from "react";

import { scrollToSection } from "@/lib/scroll";

/**
 * An in-page anchor that glides instead of teleporting.
 *
 * The site runs Lenis, and Lenis sets `scroll-behavior: auto !important`
 * on the document while it is active — so a plain `href="#work"` jumps
 * hard, which on a page built around one continuous scroll reads as a
 * broken link rather than as navigation. Every other anchor on the site
 * already routes through `AppShell.goToSection` for exactly this reason;
 * this is the same move for a link inside page content, where that
 * callback is not in scope.
 *
 * Falls back to native smooth scrolling when Lenis is absent, which is
 * the case under `prefers-reduced-motion` — where the browser then
 * honours the user's setting and jumps. That is the correct outcome.
 */
export function ScrollLink({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={`#${id}`}
      data-cursor="link"
      className={className}
      onClick={(e) => {
        // Only swallow the click if the target is actually on this page;
        // otherwise let the browser follow the href as written.
        if (scrollToSection(id)) e.preventDefault();
      }}
    >
      {children}
    </a>
  );
}
