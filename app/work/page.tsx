import { Section, Reveal } from "@/components/section";
import { WorkCard } from "@/components/work-card";
import { Heading } from "@/components/ui";
import { projects } from "@/lib/content";

export const metadata = { title: "Work" };

export default function WorkPage() {
  const left = projects.filter((_, i) => i % 2 === 0);
  const right = projects.filter((_, i) => i % 2 === 1);

  return (
    <>
      <section className="px-5 pt-32 pb-8 md:px-10 md:pt-[8.75rem] md:pb-12">
        <div className="mx-auto max-w-[89.5rem]">
          <Reveal>
            <h1 className="max-w-[18ch] display-l">
              Work
            </h1>
          </Reveal>
        </div>
      </section>

      <Section className="!pt-0">
        <div className="grid gap-x-8 md:grid-cols-2">
          <div className="flex flex-col gap-14 md:gap-[16rem]">
            {left.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.04}>
                <WorkCard project={p} />
              </Reveal>
            ))}
          </div>
          <div className="mt-14 flex flex-col gap-14 md:mt-[15rem] md:gap-[16rem]">
            {right.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.04}>
                <WorkCard project={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
