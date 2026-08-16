import Link from "next/link";
import { Section, Reveal } from "@/components/section";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { personalCategories } from "@/lib/content";

export const metadata = { title: "Personal" };

export default function PersonalPage() {
  return (
    <>
      <section className="px-5 pt-32 pb-8 md:px-10 md:pt-[8.75rem] md:pb-12">
        <div className="mx-auto max-w-[89.5rem]">
          <Reveal>
            <h1 className="max-w-[18ch] display-l">
              Personal
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-[46ch] text-lg leading-[1.5] text-ink-2">
              The three tracks everything else clusters into - and the reason a
              posture device and a research engine end up sharing an
              architecture.
            </p>
          </Reveal>
        </div>
      </section>

      <Section className="!pt-0">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-3">
          {personalCategories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.05}>
              <Link href={`/personal/${c.slug}`} className="group block">
                <PlaceholderMedia
                  ratio="3/4"
                  label={c.title}
                  className="transition-opacity duration-500 group-hover:opacity-80"
                />
                <h2 className="mt-5 font-serif text-2xl font-light md:text-3xl">
                  {c.title}
                </h2>
                <p className="mt-2 text-ink-3">{c.blurb}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
