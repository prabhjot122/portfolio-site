/**
 * One in-page jump, used by everything that performs one.
 *
 * WHY THE OFFSET IS NOT A CONSTANT. The site runs Lenis, and Lenis
 * computes its own target from the element's box — it does not read CSS
 * `scroll-margin`, so the `scroll-mt-24` that fixes native anchor jumps
 * on a phone does nothing here. The mobile header is fixed and roughly
 * 76px tall, so a jump written for the desktop rail lands every section
 * heading underneath the bar on a phone. Desktop has no fixed bar to
 * clear once the hero has retired, so it only wants the hairline of
 * breathing room it always had.
 *
 * Both numbers are read at call time rather than captured, so a rotation
 * or a resize between renders cannot leave a stale offset behind.
 */
/**
 * These two are the `scroll-mt-24` / `md:scroll-mt-8` on <Section> in
 * pixels, deliberately. The two routes into a section — a Lenis jump
 * from the menu, and a browser landing on a `#hash` URL — must come to
 * rest in the same place, or the same link appears to behave differently
 * depending on how you arrived at it. If either value changes here,
 * change the matching class in components/section.tsx.
 */
const MOBILE_HEADER_CLEARANCE = 96;
const DESKTOP_CLEARANCE = 8;

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;

  const offset =
    window.innerWidth < 768 ? -MOBILE_HEADER_CLEARANCE : -DESKTOP_CLEARANCE;

  // Hand the jump to Lenis when it is running, so the two scrollers do
  // not animate the same page against each other. Lenis is absent under
  // `prefers-reduced-motion`, where the browser's own behaviour — an
  // instant jump honouring `scroll-margin` — is the correct outcome.
  if (window.__lenis) window.__lenis.scrollTo(el, { offset });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });

  return true;
}
