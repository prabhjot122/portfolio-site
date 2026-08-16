import Link from "next/link";
import { Measured, PillButton } from "@/components/ui";
import { projects, articles } from "@/lib/content";

export const metadata = { title: "Not found" };

/**
 * 404.
 *
 * Designed rather than defaulted, and actually useful: a dead link on a
 * portfolio almost always means someone was aiming at a specific piece
 * of work, so the page hands them the whole index rather than an
 * apology and a home button.
 *
 * The status code is a measured value, so it takes the accent — the
 * same rule the case-study metrics follow.
 */
export default function NotFound() {
  return (
    <section className="px-5 pt-32 pb-24 md:px-10 md:pt-[8.75rem]">
      <div className="mx-auto max-w-[89.5rem]">
        <Measured className="text-[clamp(3rem,9vw,8rem)] leading-none">
          404
        </Measured>

        <h1 className="display-l mt-8 max-w-[16ch]">
          That page isn&rsquo;t here.
        </h1>
        <p className="mt-6 max-w-[48ch] text-body-l leading-[1.5] text-ink-2">
          The link may be out of date, or the work may have moved. Everything
          that does exist is below.
        </p>

        <div className="mt-14 grid gap-12 border-t border-hair pt-10 md:grid-cols-2">
          <div>
            <p className="micro mb-5">Work</p>
            <ul className="flex flex-col gap-3">
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/work/${p.slug}`}
                    data-cursor="view"
                    className="group flex items-baseline justify-between gap-4 text-title text-ink"
                  >
                    <span className="relative">
                      {p.title}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-ink transition-transform duration-[var(--duration-base)] ease-[var(--ease-exit)] group-hover:scale-x-100"
                      />
                    </span>
                    <Measured className="shrink-0 text-caption">
                      {p.year}
                    </Measured>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="micro mb-5">Writing</p>
            <ul className="flex flex-col gap-3">
              {articles.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/articles/${a.slug}`}
                    data-cursor="view"
                    className="group flex items-baseline justify-between gap-4 text-title text-ink"
                  >
                    <span className="relative">
                      {a.title}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-ink transition-transform duration-[var(--duration-base)] ease-[var(--ease-exit)] group-hover:scale-x-100"
                      />
                    </span>
                    <Measured className="shrink-0 text-caption">
                      {a.date}
                    </Measured>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14">
          <PillButton href="/" size="md">
            Back to the start
          </PillButton>
        </div>
      </div>
    </section>
  );
}
