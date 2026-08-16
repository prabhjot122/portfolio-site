import { Section, SectionLabel, Reveal } from "@/components/section";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { services, site } from "@/lib/content";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <section className="px-5 pt-32 pb-8 md:px-10 md:pt-[8.75rem] md:pb-12">
        <div className="mx-auto max-w-[89.5rem]">
          <Reveal>
            <h1 className="max-w-[18ch] display-l">
              About
            </h1>
          </Reveal>
        </div>
      </section>

      <Section className="!pt-0">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Reveal>
              <PlaceholderMedia ratio="3/4" label="Portrait" />
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <Reveal delay={0.08}>
              <p className="max-w-[50ch] font-serif text-2xl leading-[1.4] font-light md:text-3xl">
                I build AI systems that have to work when nobody is watching -
                agents, retrieval pipelines, edge models and the data
                plumbing underneath them.
              </p>
              <p className="mt-8 max-w-[60ch] text-lg leading-[1.55] text-ink-2">
                Three end-to-end products so far, across three unrelated
                verticals: a research engine that fact-checks its own output, a
                webcam posture device that predicts chronic risk on a Raspberry
                Pi, and a voice-first teaching assistant running in five pilot
                schools. Alongside them, two conference papers - one on making
                small language models cheap enough to deploy anywhere, one on
                fine-tuned LLM and RAG pipelines for unstructured survey text.
              </p>
              <p className="mt-6 max-w-[60ch] text-lg leading-[1.55] text-ink-2">
                The research is not decorative. The small-model work is what
                makes the edge device viable; the retrieval work is what makes
                the research engine verifiable. If I am recommending an
                approach, it is usually because I have already paid for the
                version that did not work.
              </p>
              <p className="mt-6 max-w-[60ch] text-lg leading-[1.55] text-ink-2">
                Based in {site.location}, and open to freelance work.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section className="!pt-0">
        <SectionLabel>Services</SectionLabel>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.05}>
              <div className="border-t border-hair pt-6">
                <span className="font-mono text-[13px] text-ink-3">
                  {s.n}
                </span>
                <h3 className="mt-4 font-serif text-2xl font-light">{s.title}</h3>
                <p className="mt-3 max-w-[42ch] leading-[1.55] text-ink-2">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
