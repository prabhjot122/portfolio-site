import { notFound } from "next/navigation";
import { Section, Reveal } from "@/components/section";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { articles } from "@/lib/content";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <>
      <section className="px-5 pt-32 pb-8 md:px-10 md:pt-[8.75rem] md:pb-12">
        <div className="mx-auto max-w-[89.5rem]">
          <Reveal>
            <span className="text-[15px] text-ink-3">
              {article.date}
            </span>
            <h1 className="mt-4 max-w-[20ch] display-l">
              {article.title}
            </h1>
          </Reveal>
        </div>
      </section>

      <Section className="!py-0">
        <Reveal>
          <PlaceholderMedia ratio="16/9" label={article.title} />
        </Reveal>
      </Section>

      {/* Narrow measure for long-form reading */}
      <Section>
        <article className="mx-auto max-w-[68ch]">
          <p className="display-m">
            {article.lead}
          </p>

          {article.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="mt-14 font-serif text-3xl font-light">
                {s.heading}
              </h2>
              {s.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="mt-5 text-lg leading-[1.65] text-ink-2"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </article>
      </Section>
    </>
  );
}
