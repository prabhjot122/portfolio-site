import { site } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="px-5 pb-10 md:px-10">
      <div className="mx-auto flex max-w-[89.5rem] flex-col-reverse gap-6 border-t border-hair pt-10 text-caption text-ink-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col-reverse gap-2 md:flex-row md:items-center md:gap-16">
          <span>
            Designed and built by {site.name} &mdash; {new Date().getFullYear()}
          </span>
          <span>{site.location}</span>
        </div>
        <div className="flex flex-wrap gap-6">
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
        </div>
      </div>
    </footer>
  );
}
