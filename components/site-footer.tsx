import Link from "next/link";
import { site } from "@/lib/content";

/**
 * The quiet end of the page.
 *
 * It used to sign off "Designed and built by Sahil Saurav" — a personal
 * portfolio credit under a business site, and the last piece of the
 * previous brand still standing. The company signs off now.
 *
 * "Backed by Lawvriksh" sits on its own line beneath the wordmark rather
 * than beside it, for the same reason it does in the rail: joined up on
 * one line the two names read as a single product, which is not what the
 * relationship is.
 *
 * Nothing is claimed here that is not true. No registered entity, no
 * incorporation year, no rights reserved on a two-person studio's
 * marketing site.
 */
export function SiteFooter() {
  return (
    // The footer is the bottom half of the closing frame, so it is on
    // the same dark stock. It is not inside that <section> — it is a
    // sibling in the shell — so it carries the attribute itself; the
    // band behind it is one continuous piece running to the end of the
    // document. See DARK_REGIONS in lib/dark-sheet.ts.
    <footer data-surface="dark" className="px-5 pb-10 md:px-10">
      <div className="mx-auto flex max-w-[89.5rem] flex-col gap-8 border-t border-hair pt-10 text-caption text-ink-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-hand text-[1.5rem] leading-[1.05] font-semibold text-ink">
            {site.name}
          </span>
          <span className="micro mt-2 text-[0.625rem]">{site.backedBy}</span>
          <span className="mt-2">
            {site.location} &mdash; {new Date().getFullYear()}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {site.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              data-cursor="link"
              className="transition-colors duration-[var(--duration-instant)] hover:text-ink"
            >
              {s.label}
            </a>
          ))}
          <a
            href={`mailto:${site.email}`}
            data-cursor="copy"
            className="transition-colors duration-[var(--duration-instant)] hover:text-ink"
          >
            {site.email}
          </a>
          <Link
            href="/privacy"
            data-cursor="link"
            className="transition-colors duration-[var(--duration-instant)] hover:text-ink"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
