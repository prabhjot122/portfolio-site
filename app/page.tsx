import Link from "next/link";
import {
  Section,
  Stage,
  StageOnLoad,
  Rise,
  Frame,
  RevealWords,
} from "@/components/section";
import { Typewriter } from "@/components/typewriter";
import { PlaceholderMedia, Portrait } from "@/components/placeholder-media";
import { WorkCard } from "@/components/work-card";
import { Eyebrow, Measured, PillButton } from "@/components/ui";
import { LOAD } from "@/lib/motion";
import {
  articles,
  hero,
  projects,
  services,
  site,
  testimonials,
} from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <WhatIDo />
      <KindWords />
      <WorthSharing />
      <ContactCta />
    </>
  );
}

/**
 * Full-bleed opening: no rail, no gutter, no gap at the top.
 *
 * The headline and the meta pairs are held inside the first screen - the
 * flex block below is exactly one fold tall, so the pairs land on its lower
 * edge. The portrait deliberately breaks that contract: it is pulled up into
 * the fold by a viewport-relative margin so a slice of it reads immediately,
 * then runs on past the bottom and finishes as you scroll. Because it stays
 * in normal flow it also sets the section's true height, so "Things I have built"
 * can only ever begin underneath it.
 *
 * The negative left margin breaks the section out of the gutter the layout
 * reserves for the side rail. That gutter is reserved permanently rather than
 * toggled, so the rail can slide in later without reflowing the page.
 *
 * Motion is a load sequence, not a scroll reveal: structure, then the two
 * statement lines under their own masks, then the lede, then the meta pairs.
 */
function Hero() {
  return (
    <section
      id="top"
      className="px-5 pt-24 pb-12 md:-ml-[16.5rem] md:px-10 md:pt-24 md:pb-20"
    >
      <div className="mx-auto w-full max-w-[89.5rem]">
        <div className="flex flex-col md:min-h-[calc(100svh-10.5rem)]">
          {/* The headline types itself. Every glyph is in the DOM from
              the first paint and hidden with opacity, so the tallest
              element on the page never reflows — see components/typewriter.tsx. */}
          <h1 className="display-l max-w-[46ch]">
            <Typewriter lines={hero.statement} />
          </h1>

          <StageOnLoad
            className="mt-8 md:mt-auto md:pt-12"
            stagger={0.07}
            delay={LOAD.lede}
          >
            <Rise>
              <p className="max-w-[46ch] text-body-l leading-[1.5] text-ink-2">
                {hero.lede}
              </p>
            </Rise>

            <Rise className="mt-10">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-[1.375rem] text-[0.9375rem] md:max-w-[min(39.25rem,46vw)]">
                {hero.meta.map((m) => (
                  <div key={m.label}>
                    <dt className="micro">{m.label}</dt>
                    <dd className="mt-[0.375rem] text-ink">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </Rise>
          </StageOnLoad>
        </div>

        <StageOnLoad
          className="mt-10 w-full md:-mt-[50vh] md:ml-auto md:w-[min(30rem,30vw)]"
          delay={LOAD.media}
        >
          <Frame>
            <Portrait
              src="/images/person1.png"
              alt="Portrait of Sahil Saurav"
              ratio="583/640"
              drift
              priority
            />
          </Frame>
        </StageOnLoad>
      </div>
    </section>
  );
}

function SelectedWork() {
  // Right column starts lower so the two tracks interleave as you scroll.
  const left = projects.filter((_, i) => i % 2 === 0);
  const right = projects.filter((_, i) => i % 2 === 1);

  return (
    <Section id="work" density="loose">
      <Stage className="mb-12 md:mb-16">
        <RevealWords text="Things I have built" className="display-l" />
      </Stage>

      {/*
        Gaps pulled in from 16rem. The interleave is the point; the old
        256px gap put so much air between cards that the offset stopped
        reading as an interleave and started reading as empty page.
      */}
      <div className="grid gap-x-8 md:grid-cols-2">
        <Stage className="flex flex-col gap-14 md:gap-[9rem]" stagger={0.1}>
          {left.map((p) => (
            <Rise key={p.slug}>
              <WorkCard project={p} />
            </Rise>
          ))}
        </Stage>
        <Stage
          className="mt-14 flex flex-col gap-14 md:mt-[clamp(18rem,23vw,21rem)] md:gap-[9rem]"
          stagger={0.1}
        >
          {right.map((p) => (
            <Rise key={p.slug}>
              <WorkCard project={p} />
            </Rise>
          ))}
        </Stage>
      </div>
    </Section>
  );
}

/**
 * The compression beat.
 *
 * This is the densest section on the page by design — the drawn cell
 * rules already gave it more structure than anything else, so it is the
 * anchor the surrounding air is measured against.
 */
function WhatIDo() {
  return (
    <Section id="what-i-do" density="tight">
      <Stage className="mb-10 md:mb-16">
        <RevealWords text="What I do" className="display-l" />
      </Stage>

      {/* Cell borders: every item gets a bottom rule, and a right rule
          except on the last column of each row. */}
      <Stage stagger={0.05}>
        <ul className="grid border-t border-hair md:grid-cols-3">
          {services.map((s) => (
            <Rise key={s.n} className="contents">
              <li className="group border-b border-hair py-6 transition-colors duration-[var(--duration-base)] hover:bg-surface md:p-8 md:[&:not(:nth-child(3n))]:border-r">
                <Measured className="text-[11px]">{s.n}</Measured>
                <h3 className="display-m mt-5 md:mt-8">{s.title}</h3>
                <p className="mt-3 text-caption leading-[1.6] text-ink-2 md:mt-6 md:max-w-[34ch]">
                  {s.body}
                </p>
              </li>
            </Rise>
          ))}
        </ul>
      </Stage>

      <div className="flex flex-col items-start gap-6 border-b border-hair py-12 md:flex-row md:items-center md:justify-between">
        <p className="display-m md:max-w-[28ch]">
          Have a project in mind? Let&rsquo;s talk.
        </p>
        <PillButton href="/contact" size="md">
          Get in touch
        </PillButton>
      </div>
    </Section>
  );
}

function KindWords() {
  return (
    <Section id="kind-words" density="loose">
      <Stage className="mb-12 md:mb-16">
        <RevealWords text="Kind words" className="display-l" />
      </Stage>

      <Stage className="border-t border-hair" stagger={0.09}>
        {testimonials.map((t, i) => (
          <Rise key={i}>
            <article className="grid gap-8 border-b border-hair py-12 md:grid-cols-12 md:gap-10 md:py-20">
              <blockquote className="font-serif text-[clamp(18px,1.6vw,26px)] leading-[1.42] font-light tracking-[-0.015em] text-ink md:col-span-8">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex flex-col text-[14px] md:col-span-4 md:items-end md:text-right">
                <span className="text-ink">{t.author}</span>
                <span className="text-ink-3">{t.role}</span>
              </figcaption>
            </article>
          </Rise>
        ))}
      </Stage>
    </Section>
  );
}

function WorthSharing() {
  return (
    <Section id="worth-sharing" density="medium">
      <Stage className="mb-12 flex items-end justify-between gap-6 md:mb-16">
        <RevealWords text="Things worth sharing" className="display-l" />
      </Stage>

      <Stage className="grid items-start gap-8 md:grid-cols-3" stagger={0.08}>
        {articles.map((a) => (
          <Rise key={a.slug}>
            <Link
              href={`/articles/${a.slug}`}
              data-cursor="view"
              className="block rounded-sm"
            >
              <article className="group">
                <div className="transition-transform duration-[var(--duration-slow)] ease-[var(--ease-exit)] group-hover:-translate-y-1">
                  <PlaceholderMedia ratio="4/3" label={a.title} drift />
                </div>
                <div className="mt-6 flex items-baseline justify-between gap-4">
                  <span className="text-title">
                    <span className="relative">
                      {a.title}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-ink transition-transform duration-[var(--duration-base)] ease-[var(--ease-exit)] group-hover:scale-x-100"
                      />
                    </span>
                  </span>
                  <Measured className="shrink-0 text-caption">{a.date}</Measured>
                </div>
                <p className="mt-2 text-caption leading-[1.55] text-ink-2">
                  {a.excerpt}
                </p>
              </article>
            </Link>
          </Rise>
        ))}
      </Stage>
    </Section>
  );
}

function ContactCta() {
  return (
    <Section density="open">
      <Stage stagger={0.08}>
        <Rise className="mb-6 md:mb-8">
          <Eyebrow>Let&rsquo;s work together</Eyebrow>
        </Rise>
        <Rise>
          <a
            href={`mailto:${site.email}`}
            data-cursor="link"
            className="group relative inline-block max-w-full font-serif text-[clamp(28px,5.6vw,5rem)] leading-[1.05] font-light tracking-[-0.04em] text-ink"
          >
            <span className="relative inline-block max-w-full break-words">
              {site.email}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -bottom-[0.06em] h-[0.04em] origin-left scale-x-0 bg-accent transition-transform duration-[var(--duration-slow)] ease-[var(--ease-exit)] group-hover:scale-x-100"
              />
            </span>
          </a>
        </Rise>
      </Stage>
    </Section>
  );
}
