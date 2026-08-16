import { Section, Reveal } from "@/components/section";
import { site } from "@/lib/content";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <section className="px-5 pt-32 pb-8 md:px-10 md:pt-[8.75rem] md:pb-12">
        <div className="mx-auto max-w-[89.5rem]">
          <Reveal>
            <h1 className="max-w-[18ch] display-l">
              Let&rsquo;s work together
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-[46ch] text-lg leading-[1.5] text-ink-2">
              Currently open to freelance work - AI agents and automation, data
              pipelines and analytics, or a feasibility read before you commit a
              budget. Tell me what the system has to do and what it cannot get
              wrong.
            </p>
          </Reveal>
        </div>
      </section>

      <Section className="!pt-0">
        <div className="grid grid-cols-1 gap-12 border-t border-hair pt-10 md:grid-cols-3">
          <Reveal>
            <h2 className="text-[15px] text-ink-3">Email</h2>
            <a
              href={`mailto:${site.email}`}
              data-cursor="copy"
              className="mt-3 block font-serif text-2xl font-light text-ink transition-colors duration-[var(--duration-instant)] hover:text-accent"
            >
              {site.email}
            </a>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="text-[15px] text-ink-3">
              Based in
            </h2>
            <p className="mt-3 font-serif text-2xl font-light">
              {site.location}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-[15px] text-ink-3">
              Elsewhere
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    data-cursor="link"
                    className="font-serif text-2xl font-light text-ink transition-colors duration-[var(--duration-instant)] hover:text-accent"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
