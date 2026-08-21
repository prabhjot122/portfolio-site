"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

import { SideNav } from "@/components/side-nav";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactDialogProvider } from "@/components/contact-dialog";
import { sectionIds } from "@/lib/content";
import { scrollToSection } from "@/lib/scroll";
import { darkSheet, DARK_REGIONS } from "@/lib/dark-sheet";
import { EASE, DUR, s } from "@/lib/motion";

/** Gap between the rail and the top-left corner once it is pinned, in px. */
const RAIL_GUTTER = 16;

/** The section the rail belongs to. It docks here before it pins. */
const RAIL_ANCHOR = "work";

/** An empty `inset()` rect — the dark rail, clipped out of existence. */
const CLIP_NONE = "inset(100% 0 0 0)";

/** Whether any dark region runs off the end of the document. If none
    does, the read pass never has to touch `scrollHeight`. */
const anyToBottom = DARK_REGIONS.some((r) => r.toBottom);

/**
 * Resolve one of the page's landmark elements.
 *
 * SCOPED TO `<main>`, NEVER `document.getElementById`, AND THAT IS A BUG
 * FIX RATHER THAN A STYLE PREFERENCE. Next streams late content into a
 * `<div hidden>` parked at the very top of `<body>`, and in dev that
 * holder can still be sitting there — holding a complete second copy of
 * the page, ids and all — long after hydration. `getElementById` walks
 * document order, so every lookup here returned the HIDDEN twin: a
 * `display: none` element whose `getBoundingClientRect()` is all zeros.
 *
 * The symptoms were quiet and looked like two unrelated faults. The rail
 * never travelled, because its anchor's top was permanently 0 and the
 * dock offset with it. The scroll-spy permanently lassoed the LAST nav
 * row, because every section reported a top of 0 and the loop below
 * takes the last one that has passed the line. Both come from here.
 *
 * There is exactly one `<main>` in the document and it is the live tree,
 * so scoping the query to it cannot pick up the twin.
 */
function findSection(id: string) {
  const main = document.querySelector("main");
  return (main ?? document).querySelector<HTMLElement>(`#${CSS.escape(id)}`);
}

/**
 * Put the dark stock away.
 *
 * The bands and the rail's dark twin are positioned by direct style
 * writes, so they hold their last value forever unless something clears
 * them. On a route without a dark frame — or after the home page
 * unmounts — that last value is a charcoal band frozen wherever the
 * final scroll left it. Collapsing every band to zero height and
 * clipping the twin to an empty rect is the whole teardown.
 */
function resetDarkSheet(darkRail: HTMLElement | null) {
  for (const { band } of darkSheet.bands) {
    if (band) band.style.height = "0px";
  }
  if (darkRail) darkRail.style.clipPath = CLIP_NONE;
}

/**
 * Owns the page chrome: the top-right shortcut cluster and the side rail.
 *
 * The cluster is a hero-only affordance and retires on the first scroll.
 * The rail does NOT fade in to replace it — it is always mounted and
 * always opaque, and simply starts life parked further down the page.
 *
 * THE RAIL IS STICKY, NOT MERELY FIXED. It belongs to "Our Top Three
 * Projects": it rides in level with that section's top edge, travels up
 * with it, and only once the section has reached the top of the screen
 * does it pin there for the rest of the page. Scrolling back up runs the
 * same thing in reverse and re-docks it to the section. That is exactly
 * `position: sticky` semantics, done on a fixed element because the rail
 * lives outside the page flow.
 *
 * WHY THE SCROLL WORK LOOKS LIKE THIS. Everything measured here is read
 * once per animation frame, in one batch, and the results that change
 * every frame are written straight to the DOM rather than through state.
 * The previous version ran the whole read on every scroll EVENT — and
 * Lenis emits those every frame — and each pass did six `getElementById`
 * lookups plus five `getBoundingClientRect` calls interleaved with React
 * renders. That is a forced synchronous layout per section per frame,
 * which is the classic layout-thrash shape and a large part of why the
 * page felt heavy.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const [atTop, setAtTop] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  /** The rail's outer shell. Its transform is driven imperatively. */
  const railRef = useRef<HTMLDivElement>(null);
  /** The rail's dark twin. Its clip is driven imperatively, same frame. */
  const darkRailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHome) {
      setAtTop(false);
      setActiveId(null);
      if (railRef.current)
        railRef.current.style.transform = "translate3d(0,0,0)";
      // No dark frame off the home page: park the band and clip the dark
      // rail away, or both keep whatever the last home scroll left them.
      resetDarkSheet(darkRailRef.current);
      return;
    }

    // Resolved once per route rather than per frame.
    let sections = sectionIds.map(findSection);
    let anchor = findSection(RAIL_ANCHOR);
    let darkSections = DARK_REGIONS.map((r) => findSection(r.id));

    /* The rail's own height. Measured on resize rather than per frame:
       it is a `position: fixed` box whose contents do not change with
       scroll, and `offsetHeight` inside the read pass is one more forced
       layout for a number that changes about twice a session. */
    let railH = darkRailRef.current?.offsetHeight ?? 0;

    /* Last values written to the dark layers. Every one of these writes
       is skipped when the value has not moved — the band sits still for
       most of the page and the dark rail is fully clipped away for most
       of it, and re-writing an identical `clip-path` is a style
       invalidation on an element carrying a dozen displacement filters. */
    const lastBandH = DARK_REGIONS.map(() => -1);
    const lastBandY = DARK_REGIONS.map(() => Number.NaN);
    let lastClip = "";

    let queued = false;

    /* Last values actually handed to React. The rail's transform has to
       be rewritten every frame — it tracks the scroll continuously — but
       these two change a handful of times over the whole page, and
       dispatching an identical value 60 times a second just to have
       React discard it is work with no possible outcome. */
    let lastAtTop: boolean | null = null;
    let lastActive: string | null = null;

    const read = () => {
      queued = false;
      const vh = window.innerHeight;

      // --- all DOM reads first, no writes in between ---
      const y = window.scrollY;
      const anchorTop = anchor ? anchor.getBoundingClientRect().top : vh;
      const darkRects = darkSections.map((el) => el?.getBoundingClientRect());
      /* Only read for a region that runs off the end of the document.
         `scrollHeight` is a layout read like the rects above it and it
         belongs in this half of the pass, not down among the writes. */
      const docH = anyToBottom ? document.documentElement.scrollHeight : 0;

      // Scroll-spy: the last section whose top has passed a third of the
      // viewport wins, so a heading feels "current" as it settles in.
      let current = sectionIds[0];
      for (let i = 0; i < sections.length; i++) {
        const el = sections[i];
        if (el && el.getBoundingClientRect().top <= vh * 0.34) {
          current = sectionIds[i];
        }
      }

      // --- writes ---

      // The sticky travel. Zero once the anchor has reached the gutter,
      // which is the moment the rail stops moving and stays put.
      const dockY = Math.max(0, anchorTop - RAIL_GUTTER);
      if (railRef.current) {
        railRef.current.style.transform = `translate3d(0,${dockY}px,0)`;
      }

      /* --- the dark stock ---

         Each band is placed by transform and its ruling is counter-
         translated by the same amount, which is what keeps the dark grid
         in register with the fixed paper grid it interrupts. Both are
         rounded to whole pixels: a fractional translate resamples the
         1px rules and the grid goes soft on one frame and crisp on the
         next. See components/dark-sheet.tsx for why the ground is built
         this way rather than as a background on the section.

         The rail is then clipped to whatever slice of dark stock it
         happens to be over, in the rail's own coordinates. `top` and
         `bot` are the distances from the rail's edges to the band's, so
         both go negative when the band runs past the rail and both get
         clamped to zero — which is exactly "no clip, show all of it".
         Regions are far enough apart that at most one can reach the
         rail; the loop keeps the last one that does. */
      const railTop = RAIL_GUTTER + dockY;
      let clip = CLIP_NONE;

      for (let i = 0; i < darkSheet.bands.length; i++) {
        const { band, rule } = darkSheet.bands[i];
        const rect = darkRects[i];
        if (!band || !rule || !rect) continue;

        const bandY = Math.round(rect.top);

        /* A closing region does not end where its section does. The
           footer sits under it, and under that is however far the page
           can be dragged past its own last pixel — so the band runs to
           the bottom of the document plus a viewport of slack. It costs
           nothing: the whole layer is clipped to the viewport anyway. */
        const h = DARK_REGIONS[i].toBottom
          ? Math.round(docH - (rect.top + y)) + vh
          : Math.round(rect.height);

        if (h !== lastBandH[i]) {
          lastBandH[i] = h;
          band.style.height = `${h}px`;
        }

        if (bandY !== lastBandY[i]) {
          lastBandY[i] = bandY;
          band.style.transform = `translate3d(0,${bandY}px,0)`;
          rule.style.transform = `translate3d(0,${-bandY}px,0)`;
        }

        const top = bandY - railTop;
        const bot = railH - (bandY + h - railTop);
        if (top < railH && bot < railH) {
          clip = `inset(${Math.max(0, top)}px 0px ${Math.max(0, bot)}px 0px)`;
        }
      }

      /* Written once per change rather than once per frame. The twin is
         fully clipped away for most of the page, and re-writing an
         identical `clip-path` is a style invalidation on an element
         carrying a dozen displacement filters. */
      if (clip !== lastClip && darkRailRef.current) {
        lastClip = clip;
        darkRailRef.current.style.clipPath = clip;
      }

      const nextAtTop = y < 24;
      if (nextAtTop !== lastAtTop) {
        lastAtTop = nextAtTop;
        setAtTop(nextAtTop);
      }
      if (current !== lastActive) {
        lastActive = current;
        setActiveId(current);
      }
    };

    // One read per frame at most, regardless of how many events fire.
    const schedule = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(read);
    };

    const onResize = () => {
      sections = sectionIds.map(findSection);
      anchor = findSection(RAIL_ANCHOR);
      darkSections = DARK_REGIONS.map((r) => findSection(r.id));
      railH = darkRailRef.current?.offsetHeight ?? 0;
      // The rule child is `100vh` tall and gets its height from CSS, so
      // it re-registers on its own. The cached band geometry does not —
      // every section just changed height under it.
      lastBandH.fill(-1);
      lastBandY.fill(Number.NaN);
      lastClip = "";
      schedule();
    };

    /* The rail's height settles late — the web fonts land after first
       paint and the identity card grows a few pixels — and `resize` does
       not fire for that. An observer on the dark twin is the only thing
       that hears it. Without this the seam on the rail sits a few pixels
       off the seam on the page until the first window resize. */
    const railObserver = new ResizeObserver(([entry]) => {
      const h = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
      if (Math.round(h) === railH) return;
      railH = Math.round(h);
      lastClip = "";
      schedule();
    });
    if (darkRailRef.current) railObserver.observe(darkRailRef.current);

    /* The very first `read()` below runs the instant this effect mounts,
       against whatever the DOM looks like at that moment. On a warm cache
       that is already the final layout. On a cold one it is not: web
       fonts and images below the fold are still arriving, every section
       they touch is still growing, and neither event is a `resize` — so
       nothing here would otherwise ever re-measure them. The rail then
       docks and the dark bands sit exactly where that first, half-loaded
       pass put them, which can be off the visible rail entirely, and nothing
       after this scheduled a second look. `onResize` already does a full
       re-resolve of every section plus a fresh read, which is exactly the
       "the page changed shape, start over" operation this needs — so both
       signals below just call it once each. */
    let cancelled = false;
    document.fonts?.ready?.then(() => {
      if (!cancelled) onResize();
    });
    const onLoad = () => onResize();
    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      railObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onLoad);
      resetDarkSheet(darkRailRef.current);
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
      scrollToSection(id);
    },
    [isHome, router],
  );

  return (
    <ContactDialogProvider>
      <div className="relative z-10">
        <SiteHeader
          topBar={isHome && atTop}
          onNavigate={isHome ? goToSection : undefined}
        />
        <SideNav
          ref={railRef}
          darkRef={darkRailRef}
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
    </ContactDialogProvider>
  );
}
