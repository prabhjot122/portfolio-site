import { Section, SectionLabel, Reveal } from "@/components/section";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { site, whatWeBuild } from "@/lib/content";

export const metadata = { title: "Who we are" };

export default function AboutPage() {
  return (
    <>
      <section className="px-5 pt-32 pb-8 md:px-10 md:pt-[8.75rem] md:pb-12">
        <div className="mx-auto max-w-[89.5rem]">
          <Reveal>
            <h1 className="max-w-[18ch] display-l">
              Who we are
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
              <p className="lede max-w-[50ch] text-[clamp(1.3125rem,2.1vw,1.625rem)] leading-[1.45] text-ink">
                Learning businesses are not identical. Their software
                shouldn&rsquo;t be either.
              </p>
              <p className="mt-8 max-w-[60ch] text-lg leading-[1.55] text-ink-2">
                {site.name} is a two-person learning-technology studio. We
                design and build custom learning systems for educators and
                education businesses &mdash; LMS platforms, AI learning tools
                and education software that has to fit a specific way of
                teaching rather than the other way round.
              </p>
              <p className="mt-6 max-w-[60ch] text-lg leading-[1.55] text-ink-2">
                An LMS is usually where the work starts, because that is where
                most of the friction is. It is not where it stops. A programme
                built on cohorts behaves nothing like one built on
                self-paced modules; an assessment model that turns on
                practical demonstration needs software a quiz engine cannot
                describe. So we begin by understanding the teaching model, and
                decide what the system should be after that.
              </p>
              <p className="mt-6 max-w-[60ch] text-lg leading-[1.55] text-ink-2">
                Behind the product work there are two conference papers &mdash;
                one on making small language models cheap enough to deploy
                anywhere, one on fine-tuned LLM and retrieval pipelines for
                unstructured survey text. The research is not decorative. It is
                the reason we can say what an AI feature will actually cost to
                run, and when it is not worth building at all.
              </p>
              <p className="mt-6 max-w-[60ch] text-lg leading-[1.55] text-ink-2">
                Based in {site.location}. {site.backedBy}.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* The same modules the home page assembles from, listed plainly.
          One source (`whatWeBuild.modules`) so the two pages cannot
          drift into describing different businesses. */}
      <Section className="!pt-0">
        <SectionLabel>What we build</SectionLabel>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
          {whatWeBuild.modules.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.05}>
              <div className="border-t border-hair pt-6">
                <span className="font-mono text-[13px] text-ink-3">
                  {s.n}
                </span>
                <h3 className="display-m mt-4 text-[clamp(1.375rem,1.9vw,1.625rem)]">
                  {s.title}
                </h3>
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
