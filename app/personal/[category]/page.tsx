import { notFound } from "next/navigation";
import { Section, Reveal } from "@/components/section";
import { PlaceholderMedia } from "@/components/placeholder-media";
import { personalCategories } from "@/lib/content";

export function generateStaticParams() {
  return personalCategories.map((c) => ({ category: c.slug }));
}

export default async function PersonalCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = personalCategories.find((c) => c.slug === category);
  if (!cat) notFound();

  return (
    <>
      <section className="px-5 pt-32 pb-8 md:px-10 md:pt-[8.75rem] md:pb-12">
        <div className="mx-auto max-w-[89.5rem]">
          <Reveal>
            <h1 className="display-l">
              {cat.title}
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-[42ch] text-lg text-ink-2">
              {cat.blurb}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Masonry-ish gallery: mixed ratios in a two-column grid */}
      <Section className="!pt-0">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {["4/5", "3/2", "1/1", "4/5", "3/2", "1/1"].map((ratio, i) => (
            <Reveal key={i} delay={(i % 2) * 0.05}>
              <PlaceholderMedia ratio={ratio} label={`${cat.title} ${i + 1}`} />
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
