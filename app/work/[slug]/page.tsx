import Link from "next/link";
import { notFound } from "next/navigation";
import { Section, Reveal } from "@/components/section";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { Measured } from "@/components/ui";
import { projects } from "@/lib/content";

/** Heading in the left column, prose in the right - the page's one rhythm. */
function Chapter({ title, body }: { title: string; body: string }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-12">
      <div className="md:col-span-4">
        <h2 className="font-serif text-2xl font-light md:text-3xl">{title}</h2>
      </div>
      <div className="md:col-span-8">
        <p className="max-w-[62ch] text-lg leading-[1.6] text-ink-2">
          {body}
        </p>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const next = projects[(projects.indexOf(project) + 1) % projects.length];

  return (
    <>
      {/* Title block */}
      <section className="px-5 pt-32 pb-10 md:px-10 md:pt-[8.75rem] md:pb-16">
        <div className="mx-auto max-w-[89.5rem]">
          <Reveal>
            <h1 className="max-w-[18ch] display-l">
              {project.title}
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-[42ch] text-lg leading-[1.5] text-ink-2">
              {project.summary}
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-hair pt-8 text-[15px] md:grid-cols-4">
              <div>
                <dt className="text-ink-3">Year</dt>
                <dd className="mt-2">{project.year}</dd>
              </div>
              <div>
                <dt className="text-ink-3">Role</dt>
                <dd className="mt-2">{project.role.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-ink-3">Context</dt>
                <dd className="mt-2">{project.context}</dd>
              </div>
              <div>
                <dt className="text-ink-3">Status</dt>
                <dd className="mt-2">{project.status}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Hero media */}
      <Section className="!py-0">
        <Reveal>
          <PlaceholderMedia ratio="16/9" label={`${project.title} - hero`} />
        </Reveal>
      </Section>

      {/* Body: alternating prose + media, the usual case-study rhythm */}
      <Section>
        <Chapter title="The challenge" body={project.challenge} />

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <PlaceholderMedia ratio="4/3" label="Process" />
          <PlaceholderMedia ratio="4/3" label="Detail" />
        </div>

        <div className="mt-24">
          <Chapter title="The approach" body={project.approach} />
        </div>

        <div className="mt-24">
          <Chapter title="The outcome" body={project.outcome} />
        </div>

        {/* Numbers stated in the source material, nothing inferred. */}
        <dl className="mt-16 grid grid-cols-2 border-t border-hair md:grid-cols-4">
          {project.metrics.map((m) => (
            <div
              key={m.label}
              className="border-b border-hair py-6 md:border-r md:px-8 md:last:border-r-0"
            >
              <dt className="text-[11px] tracking-[0.08em] text-ink-3 uppercase">
                {m.label}
              </dt>
              {/* The accent rule's home ground: every one of these came
                  from the source decks, so every one of them is inked. */}
              <dd className="mt-3 leading-none">
                <Measured className="text-[clamp(24px,2.6vw,38px)]">
                  {m.value}
                </Measured>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 flex flex-wrap gap-2">
          {project.stack.map((t) => (
            <span
              key={t}
              className="rounded-full border border-hair px-4 py-2 text-[13px] text-ink-2"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-16">
          <PlaceholderMedia ratio="16/9" label="Final screens" />
        </div>
      </Section>

      {/* Next project */}
      <Section className="!pt-0">
        <Link
          href={`/work/${next.slug}`}
          data-cursor="view"
          className="group block border-t border-hair pt-8"
        >
          <span className="micro">Next project</span>
          <h2 className="display-l mt-3 transition-transform duration-[var(--duration-slow)] ease-[var(--ease-exit)] group-hover:translate-x-2">
            {next.title}
          </h2>
        </Link>
      </Section>
    </>
  );
}
