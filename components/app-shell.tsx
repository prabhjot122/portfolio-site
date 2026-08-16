"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";

import { SideNav } from "@/components/side-nav";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { sectionIds } from "@/lib/content";
import { EASE, DUR, s } from "@/lib/motion";

/** How far above the fold the rail is allowed to arrive, in viewport heights. */
const RAIL_LEAD = 0.3;

/**
 * Owns the two pieces of chrome that trade places on the home page.
 *
 * Over the hero the rail is parked offscreen and the top-right cluster is
 * showing; past the hero they swap. Every other route skips the dance and
 * gets the rail immediately, since those pages have no full-bleed opening.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const [pastHero, setPastHero] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!isHome) {
      setPastHero(true);
      setAtTop(false);
      setActiveId(null);
      return;
    }

    const read = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const hero = document.getElementById("top");
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : vh;

      setAtTop(y < 24);
      setPastHero(y > heroBottom - vh * RAIL_LEAD);

      // Scroll-spy: the last section whose top has passed a third of the
      // viewport wins, so a heading feels "current" as it settles into view.
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= vh * 0.34) current = id;
      }
      setActiveId(current);
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [isHome]);

  // Anchor jumps are handled here rather than natively so they glide with the
  // rest of the page instead of teleporting.
  const goToSection = useCallback(
    (id: string) => {
      if (!isHome) {
        router.push(`/#${id}`);
        return;
      }
      const el = document.getElementById(id);
      if (!el) return;
      // Hand the jump to Lenis when it is running, so the two scrollers do
      // not animate the same page against each other.
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -8 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [isHome, router],
  );

  const railVisible = !isHome || pastHero;

  return (
    <div className="relative z-10">
      <SiteHeader
        topBar={isHome && atTop}
        onNavigate={isHome ? goToSection : undefined}
      />
      <SideNav
        visible={railVisible}
        activeId={activeId}
        onNavigate={isHome ? goToSection : undefined}
      />
      {/* The rail's gutter is reserved at all times, even while the rail is
          parked offscreen: sections that want the full width (the home hero)
          break out of it with a negative margin instead, which keeps the
          rail's arrival from reflowing anything. */}
      <div className="md:pl-[16.5rem]">
        {/*
          Page transition.

          Entrance only, keyed on the route. An exit animation would need
          the outgoing tree to survive the navigation, which the App Router
          does not guarantee for server components — the result is a flash
          of unstyled exit or a stuck overlay. Animating in is the honest
          version of the same gesture and it cannot strand the page.
        */}
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: s(DUR.slow), ease: EASE.exit }}
        >
          {children}
        </motion.main>
        <SiteFooter />
      </div>
    </div>
  );
}
