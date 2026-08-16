import Link from "next/link";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { Measured } from "@/components/ui";
import type { Project } from "@/lib/content";

/**
 * Portrait media with the caption sitting underneath: title on the left,
 * year pinned right, description on its own line beneath.
 *
 * The year is a measured value, so it takes the accent. The status chip
 * ("Beta", "Pilot") is not — it is a label, not a measurement — so it
 * reads as a hairline chip in ink.
 */
export function WorkCard({ project }: { project: Project }) {
  return (
    <figure className="group">
      <Link
        href={`/work/${project.slug}`}
        data-cursor="view"
        className="block rounded-sm"
      >
        <div className="transition-transform duration-[var(--duration-slow)] ease-[var(--ease-exit)] group-hover:-translate-y-1">
          <PlaceholderMedia ratio="4/3" label={project.title} drift />
        </div>

        <figcaption className="mt-6">
          <div className="flex items-baseline justify-between gap-4">
            <span className="flex items-baseline gap-2.5 text-title">
              <span className="relative">
                {project.title}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-ink transition-transform duration-[var(--duration-base)] ease-[var(--ease-exit)] group-hover:scale-x-100"
                />
              </span>
              {project.badge && (
                <span className="micro rounded-full border border-hair-strong px-2 py-0.5 text-ink-3">
                  {project.badge}
                </span>
              )}
            </span>
            <Measured className="shrink-0 text-caption whitespace-nowrap">
              {project.year}
            </Measured>
          </div>
          <span className="mt-2 block text-caption leading-[1.55] text-ink-2 md:max-w-[42ch]">
            {project.summary}
          </span>
        </figcaption>
      </Link>
    </figure>
  );
}
