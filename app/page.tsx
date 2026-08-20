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
import { PlaceholderMedia } from "@/components/placeholder-media";
import { HeroVisual } from "@/components/hero-visual";
import {
  DeviceMount,
  SheetMount,
  WindowMount,
} from "@/components/screen-mount";
import { Spine } from "@/components/spine";
import { ScrollLink } from "@/components/scroll-link";
import { Eyebrow, Measured } from "@/components/ui";
import { ContactTriggerButton } from "@/components/contact-dialog";
import { LOAD } from "@/lib/motion";
import {
  articles,
  hero,
  process,
  research,
  selectedWork,
  selectedWorkArc,
  site,
  validation,
  whatWeBuild,
} from "@/lib/content";

/**
 * The home page is one argument, told in order:
 *
 *   who we are        custom learning-technology builders
 *   selected work     we have built real systems
 *   what we build     we can shape one around your model
 *   how we work       and it will not become chaotic
 *   validation        the work has been tested
 *   worth sharing     there is technical depth underneath it
 *   tell us           so bring us the problem, not the spec
 *
 * None of those questions is printed anywhere. They are the reason the
 * sections are in this order, and the reason each frame is allowed
 * exactly one job.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <WhatWeBuild />
      <HowWeWork />
      <WhatTheWorkShowed />
      <WorthSharing />
      <ContactCta />
    </>
  );
}

/**
 * Full-bleed opening: no rail, no gutter, no gap at the top.
 *
 * TWO COLUMNS, ONE FOLD. Eyebrow, statement, lede, the two calls and the
 * meta row run down the left; the product plate with the founders tucked
 * under it sits on the right. Both columns are inside a block one fold
 * tall — nothing in the hero depends on scrolling to be seen.
 *
 * The negative left margin breaks the section out of the gutter the
 * layout reserves for the side rail. That gutter is reserved permanently
 * rather than toggled, so the rail can slide in later without reflowing
 * the page.
 *
 * Motion is a load sequence, not a scroll reveal: category, then the
 * statement under its own mask, then the lede, the calls and the facts.
 */
function Hero() {
  return (
    <section
      id="top"
      // `overflow-x: clip` is the guarantee, not the layout. The pile of
      // portraits fans OUTSIDE its own footprint by design and sits
      // against the right edge of the content column — at some window
      // widths it would otherwise push the document wider and produce a
      // horizontal scrollbar. `clip` rather than `hidden`: hidden would
      // make this a scroll container and force `overflow-y` to match,
      // which breaks the sticky rail and the drawn borders both.
      className="px-5 pt-24 pb-10 [overflow-x:clip] md:-ml-[16.5rem] md:px-10 md:pt-28 md:pb-20"
    >
      <div className="mx-auto w-full max-w-[89.5rem]">
        <div className="grid items-center gap-10 md:min-h-[calc(100svh-12rem)] md:grid-cols-[minmax(0,1fr)_auto] md:gap-14 lg:gap-20">
          <div className="flex flex-col">
            <StageOnLoad className="mb-5 md:mb-7" delay={LOAD.ground}>
              <Rise>
                <p className="flex items-center gap-3">
                  {/* The rule is the same drawn hairline the section
                      dividers use, cut to a stub. It gives the category
                      somewhere to start from rather than floating it. */}
                  <span
                    aria-hidden
                    className="hidden h-px w-6 shrink-0 bg-hair-strong [filter:url(#sk-rule-h)] sm:block"
                  />
                  <span className="micro">{hero.eyebrow}</span>
                </p>
              </Rise>
            </StageOnLoad>

            {/* The headline types itself. Every glyph is in the DOM from
                the first paint and hidden with opacity, so the tallest
                element on the page never reflows — see
                components/typewriter.tsx. */}
            {/* ONE ROW FOR THE FIRST LINE. The measure used to be
                `max-w-[18ch]`, which is narrower than "Custom learning
                systems," sets at any size in this face — so the opening
                clause broke across two rows and the statement read as
                four ragged lines instead of two clauses. The cap is now
                a length rather than a character count, and it is sized
                to that clause: it holds line one whole at every width
                and lets the longer second line wrap where it wants. */}
            <h1 className="display-l max-w-[min(100%,46rem)] text-[clamp(2.125rem,4.6vw,4.75rem)]">
              <Typewriter lines={hero.statement} />
            </h1>

            <StageOnLoad
              className="mt-7 md:mt-10"
              stagger={0.07}
              delay={LOAD.lede}
            >
              <Rise>
                <p className="max-w-[52ch] text-body-l leading-[1.5] text-ink-2">
                  {hero.lede}
                </p>
              </Rise>

              <Rise className="mt-7 md:mt-9">
                <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
                  <ContactTriggerButton size="md">
                    Book a call
                  </ContactTriggerButton>
                  {/*
                    Understated on purpose. There is one call on this page
                    and it is the button; this is a way down, not a second
                    decision. Ink, no fill, and the same pencil underline
                    every other link on the site wipes in.
                  */}
                  <ScrollLink
                    id="work"
                    className="group relative inline-flex items-center gap-2 text-[15px] text-ink-2 transition-colors duration-[var(--duration-instant)] hover:text-ink"
                  >
                    <span className="relative">
                      See our work
                      <span aria-hidden className="swipe" />
                    </span>
                    <span
                      aria-hidden
                      className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-exit)] group-hover:translate-y-0.5"
                    >
                      &darr;
                    </span>
                  </ScrollLink>
                </div>
              </Rise>

              {/*
                The facts, as a spec strip.

                ONE MARKUP, TWO SHAPES. Up to `lg` each pair is a single
                row — label left, value right, hairline under — which is
                three short lines instead of a grid whose longest value
                wraps to four and drags the whole hero another fold down.
                From `lg` the rules go away and it becomes the
                three-column strip under a single rule that the desktop
                composition wants.

                THE SWITCH IS AT `lg`, NOT `md`, AND THAT IS MEASURED. At
                the md breakpoint the hero is already two columns, so the
                text side is about 375px wide — three columns out of that
                is 98px each, and "Educators & education businesses"
                wraps to four lines inside one. The strip only earns its
                place once the column can actually hold it.
              */}
              {/* Hidden below `md`. On a phone this strip is three
                  stacked rows sitting between the scroll cue and the
                  fold — pure vertical cost with the hero's actual
                  argument (the statement and the lede above it) already
                  spent. The desktop strip is unaffected; it earns its
                  place there in a single row under a rule, per the note
                  above on why the switch sits at `lg`. */}
              <Rise className="mt-8 hidden md:mt-11 md:block">
                <dl className="grid gap-x-10 lg:max-w-[40rem] lg:grid-cols-3 lg:border-t lg:border-hair lg:pt-5">
                  {hero.meta.map((m) => (
                    <div
                      key={m.label}
                      className="flex items-baseline justify-between gap-4 border-b border-hair py-2.5 lg:block lg:border-b-0 lg:py-0"
                    >
                      <dt className="micro shrink-0">{m.label}</dt>
                      <dd className="text-right text-[0.9375rem] leading-snug text-ink lg:mt-1.5 lg:text-left">
                        {m.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Rise>
            </StageOnLoad>
          </div>

          {/* The product leads; the founders sit under its corner. The
              pile spills outside this column, so opening the deck never
              disturbs the text. */}
          <StageOnLoad
            className="mx-auto w-full max-w-[30rem] md:mx-0 md:mr-[2vw] md:w-[min(30rem,34vw)]"
            delay={LOAD.media}
          >
            <Frame>
              <HeroVisual />
            </Frame>
          </StageOnLoad>
        </div>
      </div>
    </section>
  );
}

/**
 * SELECTED WORK
 *
 * The one section on the home page that is allowed to be three
 * different layouts, and the reason is structural rather than
 * decorative: these are three unlike systems — a classroom app, a
 * device, a research pipeline — and running them through one card
 * template flattens exactly the difference the section exists to show.
 *
 * The arrangements open out as you go. `split` is a compact mount
 * beside a narrow text column; `wide` gives the media the full measure
 * with its text as a header row above; `wide-rail` does the same and
 * hangs a margin rail alongside. Which project takes which is declared
 * in lib/content.ts, next to the copy, so a fourth project has to
 * choose rather than inherit whatever was written last.
 *
 * ORDER IS NOT `projects` ORDER, deliberately — see `selectedWork` in
 * lib/content.ts. The section is an argument with an arc, and the arc
 * is printed at the bottom of it.
 *
 * THE SCREENS ARE PLACEHOLDERS holding the exact box a real capture
 * will take. See components/screen-mount.tsx for why they are not
 * drawn.
 */
function SelectedWork() {
  return (
    <Section id="work" density="loose">
      <Stage className="mb-16 md:mb-24">
        <Rise>
          <Eyebrow>Selected work</Eyebrow>
        </Rise>
        <Rise>
          <h2 className="display-l mt-5 max-w-[16ch]">
            Learning systems we&rsquo;ve built
          </h2>
        </Rise>
        <Rise>
          {/* The stub rule is a mark closing the statement, not a
              divider — it stops well short of the measure on purpose.
              See `.rule-stub` in globals.css. */}
          <span aria-hidden className="rule-stub my-6 md:my-7" />
        </Rise>
        <Rise>
          <p className="lede max-w-[46ch]">
            Three different problems, and three different shapes of
            system.
          </p>
        </Rise>
      </Stage>

      <div className="flex flex-col gap-28 md:gap-[8.75rem]">
        {selectedWork.map((project, i) => (
          <ShowcaseEntry key={project.slug} project={project} index={i} />
        ))}
      </div>

      <SelectedWorkArc />
    </Section>
  );
}

/** Dispatch on the arrangement declared in the content layer. */
function ShowcaseEntry({
  project,
  index,
}: {
  project: (typeof selectedWork)[number];
  index: number;
}) {
  switch (project.showcase.arrangement) {
    case "split":
      return <SplitShowcase project={project} index={index} />;
    case "wide-rail":
      return <WideShowcase project={project} index={index} withRail />;
    default:
      return <WideShowcase project={project} index={index} />;
  }
}

/**
 * ARRANGEMENT: SPLIT — a text column, media beside it.
 *
 * THE COLUMNS ARE THE OTHER WAY ROUND FROM HOW THEY STARTED, and that
 * is the fix rather than a preference. The text used to be capped at
 * 340px with the media taking the whole remainder as `1fr`, on the
 * reasoning that spare window is worth more to a screenshot than to a
 * paragraph. For a phone pair that reasoning inverts: two 390×844
 * plates given 900px of row come out roughly 800px TALL, which turns
 * one project into a full screen of empty placeholder while the copy
 * beside it is squeezed into a 340px gutter.
 *
 * So the media column is the capped one now — 33rem, big enough that a
 * phone-pair mount reads as two actual phones rather than two stamps,
 * and a desktop capture holds a legible width — and the text takes the
 * remainder, itself capped at a ~70 character measure. Everything past
 * that cap becomes the air between the two, which is the breathing
 * room the row was missing.
 */
function SplitShowcase({
  project,
  index,
}: {
  project: (typeof selectedWork)[number];
  index: number;
}) {
  const { showcase } = project;

  return (
    <Stage
      className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,33rem)] md:gap-14"
      stagger={0.09}
    >
      <Rise className="flex max-w-[38rem] flex-col gap-6 md:pt-3">
        <div>
          <ShowcaseIndex index={index} discipline={showcase.discipline} />
          <h3 className="display-m mt-4 text-[clamp(1.75rem,2.4vw,2.375rem)]">
            {project.title}
          </h3>
          <p className="mt-3.5 text-body-l leading-[1.65] text-ink-2 text-pretty">
            {project.summary}
          </p>
        </div>

        {showcase.note && (
          /* A quoted aside, marked the way a margin bar marks a
             paragraph in a printed book — the rule says "this belongs
             to the paragraph above" without spending a heading on it. */
          <p className="border-l border-hair-strong pl-4 text-note leading-[1.7] text-ink-3 text-pretty">
            {showcase.note}
          </p>
        )}

        <ShowcaseMeta project={project} />
      </Rise>

      <Frame className="relative">
        <ShowcaseScreens
          showcase={showcase}
          index={index}
          slug={project.slug}
          title={project.title}
        />
        <MarginNote side="right">{showcase.annotation}</MarginNote>
      </Frame>
    </Stage>
  );
}

/**
 * ARRANGEMENT: WIDE — a header row, then the media across the measure.
 *
 * `items-end` on the header, not `items-start`. The stamp and the case
 * study link sit on the right as a short column, and aligning their
 * BOTTOM to the bottom of the paragraph block puts the link on roughly
 * the same line as the last line of copy. Aligned at the top instead,
 * they float in the middle of nothing next to a three-line paragraph.
 *
 * `withRail` adds the margin rail alongside the media. It is the same
 * arrangement otherwise, which is the point — the rail is an annotation
 * on the media, not a different layout.
 */
function WideShowcase({
  project,
  index,
  withRail = false,
}: {
  project: (typeof selectedWork)[number];
  index: number;
  withRail?: boolean;
}) {
  const { showcase } = project;
  // Hardware is shown at object scale, so the row it sits in is a row
  // rather than a block: the mount takes the width it deserves and the
  // margin note moves into the space beside it instead of hanging off
  // the bottom edge of a full-width plate that is not there.
  const isObject = showcase.screens.kind === "device";

  return (
    <Stage className="flex flex-col gap-8 md:gap-[2.125rem]" stagger={0.09}>
      <Rise className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end md:gap-12">
        <div className="max-w-[41.25rem]">
          <ShowcaseIndex index={index} discipline={showcase.discipline} />
          <h3 className="display-m mt-4">{project.title}</h3>
          <p className="mt-3.5 max-w-[36ch] text-body-l leading-[1.65] text-ink-2 text-pretty">
            {project.summary}
          </p>
        </div>
        <div className="md:pb-1.5">
          <ShowcaseMeta project={project} />
        </div>
      </Rise>

      {withRail && showcase.rail ? (
        // The grid is a plain element on purpose. Variants propagate
        // through it either way — Framer carries them on context, which
        // an ordinary div does not interrupt — and this way the media
        // and the rail arrive as two separate beats instead of the
        // whole row scaling in as one slab.
        <div className="grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_16.25rem] md:gap-10">
          <Frame className="relative">
            <ShowcaseScreens
              showcase={showcase}
              index={index}
              slug={project.slug}
              title={project.title}
            />
            <MarginNote side="left">{showcase.annotation}</MarginNote>
          </Frame>
          <Rise>
            <Rail rail={showcase.rail} />
          </Rise>
        </div>
      ) : isObject ? (
        <Frame className="flex flex-col items-start gap-6 md:flex-row md:items-end md:gap-10">
          <ShowcaseScreens
            showcase={showcase}
            index={index}
            slug={project.slug}
            title={project.title}
          />
          <MarginNote side="beside">{showcase.annotation}</MarginNote>
        </Frame>
      ) : (
        // CAPPED, NOT FULL-MEASURE. A 16:9 capture run across the whole
        // 1432px container is 806px tall — taller than most of the
        // viewports it is read on, and every one of those pixels is
        // currently a reserved placeholder rather than a screenshot. The
        // ratio is right; the size was not. 50rem holds it at about the
        // width a browser window is actually looked at — and at the same
        // width as the Syrus capture two rows down, so the two desktop
        // screens in this section are shown at one scale rather than
        // two. The space left beside it is what makes the row breathe.
        <Frame className="relative w-full md:max-w-[50rem]">
          <ShowcaseScreens
            showcase={showcase}
            index={index}
            slug={project.slug}
            title={project.title}
          />
          <MarginNote side="left">{showcase.annotation}</MarginNote>
        </Frame>
      )}
    </Stage>
  );
}

/**
 * The row above every project title: index, a short rule, discipline.
 *
 * The index is the only number here and it takes the accent, which is
 * the site's one colour rule doing its job — see `.measured` in
 * globals.css. The discipline beside it is a label, so it stays in ink.
 */
function ShowcaseIndex({
  index,
  discipline,
}: {
  index: number;
  discipline: string;
}) {
  return (
    <p className="flex items-center gap-3.5">
      <Measured className="stamp">
        {String(index + 1).padStart(2, "0")}
      </Measured>
      <span aria-hidden className="h-px w-[1.375rem] bg-hair-strong" />
      <span className="stamp text-ink-3">{discipline}</span>
    </p>
  );
}

/** The stamp and the way in: year and state, then the case study. */
function ShowcaseMeta({
  project,
}: {
  project: (typeof selectedWork)[number];
}) {
  return (
    <div className="flex flex-col items-start gap-2.5">
      {/* Optional: three of the four projects carry no stamp any more.
          Rendered conditionally rather than as an empty `<span>` so
          those cards do not keep the stamp's line-height as a gap
          above "View case study". */}
      {project.showcase.stamp && (
        <span className="stamp text-ink-3">{project.showcase.stamp}</span>
      )}
      <Link
        href={`/work/${project.slug}`}
        data-cursor="view"
        className="tab-link"
      >
        View case study
      </Link>
    </div>
  );
}

/** Whichever mount the project's device calls for. */
/**
 * The mount, as a way in to the case study.
 *
 * WRAPPED HERE RATHER THAN AT EACH CALL SITE, so every arrangement
 * gets the same behaviour for free: the four projects on this page all
 * happen to be `split` today, but `wide` and `wide-rail` still exist
 * for whatever the fifth one turns out to need, and a click target
 * added per-arrangement would drift the first time someone forgot one.
 *
 * The MOUNT is the link, not the row it sits in — `MarginNote` and the
 * "View case study" text stay outside it, so hovering the annotation
 * does not light up a picture that is not what is being pointed at.
 *
 * `data-cursor="view"` is the same cursor the explicit case-study link
 * already uses (`ShowcaseMeta` below); the mount is a second, larger
 * way to the same place, so it wears the same affordance rather than
 * inventing a new one. The lift on hover is the drawn panel's own
 * hover trick from `.lift-interactive`, applied by hand here since a
 * mount is not a `lift` panel.
 */
function ShowcaseScreens({
  showcase,
  index,
  slug,
  title,
}: {
  showcase: (typeof selectedWork)[number]["showcase"];
  index: number;
  slug: string;
  title: string;
}) {
  const { screens } = showcase;
  const liftClass =
    "transition-transform duration-[var(--duration-base)] ease-[var(--ease-exit)] group-hover:-translate-y-1";

  const mount =
    screens.kind === "phone-pair" ? (
      <SheetMount
        caption={screens.caption}
        size={screens.size}
        screens={screens.alt.map((alt) => ({ alt }))}
        index={index}
        className={liftClass}
      />
    ) : screens.kind === "device" ? (
      <DeviceMount
        caption={screens.caption}
        detail={screens.size}
        screen={{ alt: screens.alt[0] }}
        index={index}
        className={liftClass}
      />
    ) : (
      <WindowMount
        caption={screens.caption}
        screen={{ alt: screens.alt[0] }}
        index={index}
        className={liftClass}
      />
    );

  return (
    <Link
      href={`/work/${slug}`}
      aria-label={`View case study: ${title}`}
      data-cursor="view"
      className="group block"
    >
      {mount}
    </Link>
  );
}

/**
 * A note written next to the drawing, with a short line pointing back
 * at it.
 *
 * IT ONLY HANGS OFF THE EDGE ON DESKTOP. Below `md` the mount is
 * already the full width of the column, so a note hung outside it would
 * either be clipped or widen the document; there it becomes a plain
 * line underneath. The lead rule goes with it — a pointer needs
 * somewhere to point from, and on a phone there is no margin to point
 * across.
 *
 * `side` says which edge the note hangs off, and it also flips the
 * order: the rule always sits between the note and the thing it is
 * about, so a note on the left reads text-then-rule and one on the
 * right reads rule-then-text.
 */
function MarginNote({
  side,
  children,
}: {
  side: "left" | "right" | "beside";
  children: React.ReactNode;
}) {
  // `beside` is the only one that stays in flow on desktop. The other
  // two hang off a full-width mount and have nowhere else to go; a
  // small mount leaves real space next to it, and filling that space
  // with the note is better than hanging the note under it and leaving
  // the gap empty.
  const place =
    side === "beside"
      ? "md:mt-0 md:pb-2"
      : side === "right"
        ? "md:absolute md:-right-3.5 md:-bottom-9 md:mt-0"
        : "md:absolute md:-left-5 md:-bottom-9 md:mt-0";

  return (
    <p className={`mt-7 flex items-center gap-2.5 ${place}`}>
      {side === "right" && (
        <span aria-hidden className="lead-line hidden md:block" />
      )}
      <span className="hand">{children}</span>
      {side !== "right" && (
        <span aria-hidden className="lead-line hidden md:block" />
      )}
    </p>
  );
}

/**
 * The margin rail — a pipeline, plus the sentence that says why it is
 * shaped that way.
 *
 * The drawing is `Spine`; see components/spine.tsx for how it is built
 * and what the three node marks mean. Everything here is the frame
 * around it: a label, the spine, a rule, and the closing note.
 */
function Rail({
  rail,
}: {
  rail: NonNullable<(typeof selectedWork)[number]["showcase"]["rail"]>;
}) {
  return (
    <div className="flex flex-col gap-3.5 md:pt-2">
      <p className="stamp text-ink-3">{rail.label}</p>

      <Spine steps={rail.steps} />

      <span aria-hidden className="my-1.5 block h-px bg-hair-strong" />
      <p className="text-note leading-[1.65] text-ink-3 text-pretty">
        {rail.close}
      </p>
    </div>
  );
}

/**
 * The line that closes the section.
 *
 * The arc in the data face because it is a structure; the note in the
 * hand because it is the one opinion in the section. Both of them are
 * the same sentence said twice — once as a diagram, once as a person
 * would say it — which is the whole gesture.
 */
function SelectedWorkArc() {
  return (
    <Stage
      className="mt-24 flex flex-col items-start justify-between gap-6 border-t border-hair-strong pt-12 md:mt-[8.75rem] md:flex-row md:items-baseline md:gap-8 md:pt-24"
      stagger={0.12}
    >
      <Rise>
        <p className="stamp flex flex-wrap items-center gap-2.5 text-ink-3">
          {selectedWorkArc.steps.map((step, i) => (
            <span key={step} className="flex items-center gap-2.5">
              {i > 0 && (
                <span aria-hidden className="text-hair-strong">
                  &rarr;
                </span>
              )}
              {step}
            </span>
          ))}
        </p>
      </Rise>
      <Rise>
        <p className="hand text-ink-2 md:text-2xl">{selectedWorkArc.note}</p>
      </Rise>
    </Stage>
  );
}

/**
 * WHAT WE BUILD
 *
 * THE FEAR THIS SECTION ANSWERS is "custom software means starting from
 * nothing." Everything in it is aimed at that one sentence, and the
 * argument is made structurally before it is made in words:
 *
 *     [ the core ] ——— [ the modules you choose ]
 *
 * A panel, four connectors, a grid. You can read the claim off the
 * layout without reading the copy — there is a foundation, it is the
 * same every time, and what varies is what gets attached to it. A list
 * of six services, which is what stood here before, cannot make that
 * claim at all: it says we can do six things, not that they are
 * assembled from something that already exists.
 *
 * Then the same foundation is shown shaped three ways, so a reader can
 * find the one that looks like their business, and the section closes
 * on the only opinion it holds.
 *
 * ONE CTA WAS REMOVED HERE. The old frame ended on "Have a project in
 * mind? Let's talk." with a Book a call button. The redesign ends on a
 * statement instead — see `whatWeBuild.closing` — and the page's real
 * call to action is the section at the foot of it. If a mid-page button
 * is wanted back, it goes under the closing statement, not before it:
 * the statement is the argument the button would be asking them to act
 * on.
 */
function WhatWeBuild() {
  const { core, modules, closing } = whatWeBuild;

  return (
    <Section id="what-we-build" density="loose">
      <Stage className="mb-20 md:mb-[6.5rem]">
        <Rise>
          <Eyebrow>{whatWeBuild.eyebrow}</Eyebrow>
        </Rise>
        <Rise>
          <h2 className="display-l mt-5 max-w-[15ch]">
            {whatWeBuild.statement}
          </h2>
        </Rise>
        <Rise>
          <span aria-hidden className="rule-stub my-6 md:my-7" />
        </Rise>
        <Rise>
          <p className="lede max-w-[54ch]">{whatWeBuild.lede}</p>
        </Rise>
      </Stage>

      {/*
        THE ASSEMBLY.

        Three columns on desktop — panel, connector gutter, modules —
        and the gutter is a real column rather than a decoration bolted
        onto one of its neighbours. That is what lets the connectors
        stretch to whatever height the modules end up at instead of
        being drawn at a height somebody guessed.

        Below `md` the gutter is dropped entirely. Rotating it to
        horizontal would give three stacked blocks joined by a line,
        which reads as a flowchart — a sequence of steps — and the whole
        point is that these are simultaneous: one core, many modules,
        not one then the other.
      */}
      <Stage
        className="grid items-start gap-10 md:grid-cols-[21.75rem_4rem_minmax(0,1fr)] md:gap-0"
        stagger={0.08}
      >
        <Frame className="relative">
          <div className="mount mount-ruled px-6 pt-6 pb-5 md:px-[1.625rem]">
            <p className="stamp text-ink-3">{core.label}</p>
            <h3 className="mt-4 text-[1.625rem] leading-[1.2] font-medium tracking-[var(--tracking-title)]">
              {core.title}
            </h3>
            <p className="mt-2.5 text-note leading-[1.65] text-ink-2 text-pretty">
              {core.body}
            </p>

            <span
              aria-hidden
              className="my-5 block h-px bg-hair-strong [filter:url(#sk-rule-h)]"
            />

            {/*
              A plain list, no repeated "Core" tag in the row.

              The panel's own heading and its body sentence already say
              this is the part that stays reliable — the label used to
              print "Core" a second time on every line, which turned an
              argument the panel had already made into decoration.
            */}
            <dl className="flex flex-col gap-2">
              {core.parts.map((part) => (
                <div key={part}>
                  <dt className="stamp text-ink-3">{part}</dt>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-6 flex items-center gap-2.5 md:absolute md:-bottom-11 md:left-1 md:mt-0">
            <span className="hand">{core.annotation}</span>
          </p>
        </Frame>

        <Connectors count={4} />

        <Rise>
          {/*
            Only `border-t` and `border-l` on each cell, so the grid's
            right and bottom edges stay OPEN. A closed box would say
            "this is the complete set", which is the opposite of what
            the sixth cell is there to say.
          */}
          <div className="grid sm:grid-cols-2">
            {modules.map((m) =>
              m.open ? (
                // Drawn as a mount, not a cell — its own border, its own
                // paper, its own corner. A sixth identical cell reading
                // "Custom" would be a list item claiming to be an escape
                // hatch; drawing it differently is the escape hatch.
                // The negative margin pulls it over the ruling it
                // replaces so the two edges do not double up.
                <div
                  key={m.n}
                  className="mount -mt-px bg-surface-accent px-6 pt-5 pb-6 sm:-ml-px"
                  style={
                    {
                      "--mount-r1": "9px",
                      "--mount-r2": "14px",
                      "--mount-r3": "8px",
                      "--mount-r4": "13px",
                    } as React.CSSProperties
                  }
                >
                  <div className="flex items-baseline justify-between gap-4 pb-2.5">
                    <Measured className="stamp">{m.n}</Measured>
                    <Measured className="stamp">{m.tag}</Measured>
                  </div>
                  <h3 className="text-[1.0625rem] font-medium tracking-[-0.005em]">
                    {m.title}
                  </h3>
                  <p className="mt-1.5 text-caption leading-[1.5] text-ink-3 text-pretty">
                    {m.body}
                  </p>
                </div>
              ) : (
                <div
                  key={m.n}
                  className="border-t border-hair-strong px-6 pt-5 pb-6 sm:border-l sm:[&:nth-last-child(2)]:border-b"
                >
                  <p className="stamp text-faint">{m.n}</p>
                  <h3 className="mt-2.5 text-[1.0625rem] font-medium tracking-[-0.005em]">
                    {m.title}
                  </h3>
                  <p className="mt-1.5 text-caption leading-[1.5] text-ink-3 text-pretty">
                    {m.body}
                  </p>
                </div>
              ),
            )}

            <p className="stamp pt-5 text-ink-3 sm:col-span-2 sm:pl-6">
              {whatWeBuild.modulesNote}
            </p>
          </div>
        </Rise>
      </Stage>

      <Stage
        className="mt-24 flex flex-col items-start justify-between gap-8 border-t border-hair-strong pt-14 md:mt-[6.5rem] md:flex-row md:items-end md:gap-12 md:pt-24"
        stagger={0.12}
      >
        <Rise>
          <p className="hand max-w-[20ch] text-[clamp(1.875rem,3.4vw,2.875rem)] leading-[1.15] text-ink">
            {closing.statement}
          </p>
        </Rise>
        <Rise>
          <p className="stamp text-ink-3 md:pb-2">{closing.sign}</p>
        </Rise>
      </Stage>
    </Section>
  );
}

/**
 * The connector gutter between the core and the modules.
 *
 * Purely a drawing — it carries no text and is `aria-hidden`, because
 * what it says ("these attach to that") is already said by the two
 * things it sits between.
 *
 * The rules are distributed with `flex-1` rather than placed at fixed
 * offsets, so they spread over whatever height the modules column
 * settles at instead of being drawn at a height someone measured once
 * at one viewport width. The last one takes the accent: the sixth
 * module is the open-ended one, and the connector that reaches it is
 * the only one that does not lead somewhere already named.
 *
 * Desktop only. See the note in `WhatWeBuild` for why it is not
 * rotated on a phone.
 */
function Connectors({ count }: { count: number }) {
  return (
    <div aria-hidden className="relative hidden self-stretch md:block">
      <span className="absolute top-12 bottom-12 left-0 w-px bg-hair-strong" />
      <div className="flex h-full flex-col py-12">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="flex flex-1 items-center">
            <span
              className={`h-px w-full ${
                i === count - 1 ? "bg-accent" : "bg-hair-strong"
              }`}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * THE ENGAGEMENT, DRAWN AS A SHEET FROM THE NOTEBOOK.
 *
 * THE FEAR THIS FRAME ANSWERS is "custom software sounds slow,
 * complicated and risky", and it is answered by shape before it is
 * answered by words. This was a vertical timeline: five rows down a
 * thread, which reads as a queue you join at the top and leave at the
 * bottom. An engagement does not end at the bottom — what production
 * teaches you goes back into the next map — and a straight line cannot
 * say that.
 *
 * So it is a flow sheet now. Left to right across the top, a turn, right
 * to left along the bottom, and a dashed return from 05 back to 01. The
 * arrows are drawn strokes rather than rules, the cards are hand-cut
 * rectangles, and the two sentences that carry an opinion are in the
 * hand face. The layout — which card sits in which cell, and which way
 * each arrow points at each width — lives in `.flow-sheet` in
 * globals.css, because a card moving cell and its arrow rotating are one
 * decision and have to be written as one.
 *
 * TWO THINGS ARE PLACED, NOT DECORATIVE. The note beside the turn sits
 * at the fold on purpose: the turn is where the sheet stops planning and
 * starts building, and "nothing gets built before this is agreed" is the
 * whole argument of the section standing exactly at that point. And the
 * dashed loop is dashed rather than solid because it is not a scheduled
 * stage — it is what happens if the system is worth keeping.
 */
function HowWeWork() {
  return (
    <Section id="how-we-work" density="medium" surface="dark">
      {/* The sheet header: category, statement, rule, lede on the left;
          the hand note and the sheet stamp hung off the right, the way a
          drawing is marked up in its own margin. */}
      <Stage
        className="flex flex-wrap items-end justify-between gap-6 pb-12 md:gap-14 md:pb-[4.875rem]"
        stagger={0.08}
      >
        <Rise className="max-w-[45rem]">
          <p className="micro pb-5">{process.eyebrow}</p>
          <RevealWords text="How we work" className="display-l" />
          <span
            aria-hidden
            className="mt-6 block h-px w-[min(13.75rem,60%)] bg-hair-strong [filter:url(#sk-rule-h)]"
          />
          <p className="mt-6 max-w-[35rem] text-body-l leading-[1.65] text-ink-2 text-pretty">
            {process.lede}
          </p>
        </Rise>

        <Rise className="flex flex-col items-start gap-2.5 pb-1.5">
          <span className="hand text-[clamp(1.25rem,2vw,1.5rem)]">
            {process.aside}
          </span>
          <span className="stamp text-faint">{process.sheet}</span>
        </Rise>
      </Stage>

      {/* The sheet itself. Cells are named in `.flow-sheet`; each child
          claims one by `gridArea`. */}
      <Stage className="flow-sheet" stagger={0.07}>
        <FlowCard step={process.steps[0]} area="s1" index={0} />
        <FlowArrow area="a12" className="flow-arrow" />
        <FlowCard step={process.steps[1]} area="s2" index={1} />
        <FlowArrow area="a23" className="flow-arrow-b" variant="dip" />
        <FlowCard step={process.steps[2]} area="s3" index={2} />

        <FlowTurn />
        <FlowAnnotation>{process.annotation}</FlowAnnotation>

        <FlowCard step={process.steps[3]} area="s4" index={3} />
        <FlowArrow area="a45" className="flow-arrow-back" variant="back" />
        <FlowCard step={process.steps[4]} area="s5" index={4} last />

        <FlowLoop />
      </Stage>

      {/*
        The standing commitments. Deliberately NOT on the sheet — they
        hold for the whole engagement, so putting them in the flow would
        say something untrue about them.
      */}
      <Stage className="mt-10 md:mt-14">
        <Rise>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-hair pt-5">
            {process.markers.map((m, i) => (
              <li key={m} className="flex items-center gap-5">
                {i > 0 && (
                  <span aria-hidden className="text-hair-strong">
                    &middot;
                  </span>
                )}
                <span className="micro">{m}</span>
              </li>
            ))}
          </ul>
        </Rise>
      </Stage>

      {/* The one opinion in the section, in the hand, under a rule —
          with the studio mark set against it in the data face. */}
      <Stage className="mt-14 md:mt-[5.75rem]">
        <Rise>
          <div className="flex flex-wrap items-end justify-between gap-8 border-t border-hair pt-14 md:pt-[5.75rem]">
            <p className="font-hand max-w-[47.5rem] text-[clamp(1.875rem,3.4vw,2.625rem)] leading-[1.15] font-semibold text-ink text-pretty">
              {process.closing.statement}
            </p>
            <p className="micro pb-2">{process.closing.sign}</p>
          </div>
        </Rise>
      </Stage>
    </Section>
  );
}

/**
 * Hand-cut corner sets for the stage cards — the same trick the mounts
 * in Selected Work use, rotated by index so no two cards on the sheet
 * are the same shape. See components/screen-mount.tsx.
 */
const FLOW_CORNERS = [
  ["14px", "8px", "15px", "9px"],
  ["9px", "15px", "8px", "14px"],
  ["15px", "9px", "14px", "8px"],
  ["8px", "14px", "9px", "15px"],
  ["14px", "9px", "8px", "15px"],
] as const;

/**
 * One stage on the sheet.
 *
 * The number sits in a drawn blob rather than a circle — `border-radius`
 * with four different values on each axis, which is the cheapest
 * hand-drawn ring there is and costs no filter. The output label sits on
 * the same row, right, after an arrow: what you HAVE at the end of this
 * stage, which is the actual answer to "will this become chaotic".
 *
 * `last` marks stage 05, the only card in the accent — it is the one the
 * dashed loop returns from, and inking its number differently is what
 * makes the return read as coming from somewhere specific.
 */
function FlowCard({
  step,
  area,
  index,
  last = false,
}: {
  step: (typeof process.steps)[number];
  area: string;
  index: number;
  last?: boolean;
}) {
  const [r1, r2, r3, r4] = FLOW_CORNERS[index % FLOW_CORNERS.length];

  return (
    <Rise
      className="flex"
      style={
        {
          gridArea: area,
          "--mount-r1": r1,
          "--mount-r2": r2,
          "--mount-r3": r3,
          "--mount-r4": r4,
        } as React.CSSProperties
      }
    >
      <article
        className={`mount flex w-full flex-col gap-3 p-[1.125rem] md:p-6 ${
          last ? "bg-surface-accent" : ""
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span
            aria-hidden
            style={{ borderRadius: "60% 40% 55% 45% / 45% 55% 40% 60%" }}
            className={`flex size-[1.875rem] shrink-0 items-center justify-center border ${
              last ? "border-accent text-accent" : "border-ink text-ink"
            }`}
          >
            <span className="stamp text-[0.625rem] leading-none">{step.n}</span>
          </span>
          <span className="stamp text-[0.5625rem] text-accent">
            &rarr; {step.output}
          </span>
        </div>

        <h3 className="text-[clamp(1.125rem,1.6vw,1.3125rem)] leading-[1.25] font-medium tracking-[-0.01em] text-ink">
          {step.title}
        </h3>

        <p className="text-caption leading-[1.65] text-ink-2 text-pretty md:text-[0.875rem]">
          {step.body}
        </p>
      </article>
    </Rise>
  );
}

/**
 * A connector between two stages.
 *
 * Drawn, not ruled: a bezier that wanders off the straight line and back,
 * with a two-stroke arrowhead. `dip` is the mirror of the default so two
 * consecutive arrows never trace the same wobble; `back` points left, for
 * the bottom run of the boustrophedon.
 *
 * `aria-hidden` on all of them — the sequence is already carried by the
 * numbers and by reading order, and an arrow announced five times is five
 * pieces of noise.
 */
function FlowArrow({
  area,
  className,
  variant = "rise",
}: {
  area: string;
  className: string;
  variant?: "rise" | "dip" | "back";
}) {
  const paths = {
    rise: [
      "M6 27 C 24 13, 42 33, 60 20 C 66 16, 70 15, 76 15",
      "M69 10 L 77 15 L 68 20",
    ],
    dip: [
      "M6 19 C 26 32, 44 12, 62 24 C 68 28, 71 29, 76 29",
      "M69 24 L 77 29 L 68 34",
    ],
    back: [
      "M80 24 C 60 12, 42 32, 24 21 C 18 18, 15 17, 10 17",
      "M17 12 L 9 17 L 18 22",
    ],
  }[variant];

  return (
    <div
      aria-hidden
      style={{ gridArea: area }}
      className={`flex items-center justify-center ${className}`}
    >
      <svg
        width="86"
        height="46"
        viewBox="0 0 86 46"
        fill="none"
        stroke="var(--flow-stroke)"
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        {paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
    </div>
  );
}

/** The long descending curve after stage 03 — where the sheet turns. */
function FlowTurn() {
  return (
    <div
      aria-hidden
      style={{ gridArea: "turn" }}
      className="flow-turn flex items-center"
    >
      <svg
        width="120"
        height="104"
        viewBox="0 0 120 104"
        fill="none"
        stroke="var(--flow-stroke)"
        strokeWidth="1.4"
        strokeLinecap="round"
        className="max-w-full"
      >
        <path d="M96 6 C 98 26, 92 40, 74 50 C 56 60, 40 66, 30 80 C 27 84, 25 88, 24 94" />
        <path d="M31 88 L 24 96 L 17 88" />
      </svg>
    </div>
  );
}

/** The note at the fold, in the hand. See the header comment. */
function FlowAnnotation({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ gridArea: "ann" }} className="flow-note flex items-center">
      <span className="hand text-[clamp(1.25rem,2vw,1.375rem)]">
        {children}
      </span>
    </div>
  );
}

/**
 * The dashed return from 05 to 01, and what it means.
 *
 * Dashed and in the accent's pale tint rather than solid hair — a solid
 * stroke here would read as a sixth stage, which it is not. It is the
 * one mark that stops this section being a queue.
 */
function FlowLoop() {
  return (
    <div
      style={{ gridArea: "loop" }}
      className="flex flex-wrap items-center gap-4"
    >
      <svg
        aria-hidden
        width="150"
        height="70"
        viewBox="0 0 150 70"
        fill="none"
        stroke="var(--loop-stroke)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="5 6"
        className="flow-loop-arrow shrink-0"
      >
        <path d="M144 46 C 120 60, 80 58, 50 44 C 30 34, 22 22, 20 10" />
        <path d="M13 17 L 20 8 L 27 16" />
      </svg>
      <div className="flex flex-col gap-1.5">
        <span className="stamp text-faint">{process.loop.label}</span>
        <p className="max-w-[15rem] text-caption leading-[1.6] text-ink-3 text-pretty">
          {process.loop.body}
        </p>
      </div>
    </div>
  );
}

/**
 * TESTIMONIALS.
 *
 * The previous version set the score as a 76px "4.0 / 5" in the accent,
 * beside the finding. That is a scoreboard, not a review: the largest
 * thing in the row was a number nobody said out loud, and a number set
 * that big reads as a metric being sold rather than as a person being
 * quoted.
 *
 * So this is now shaped like what it is. The QUOTE leads, in the hand
 * face at pull-quote size, because a testimonial's substance is the
 * sentence someone said. Under it sits the drawn five-star row — halves
 * allowed — then the attribution: who said it, in what setting, on which
 * project. The supporting note that used to be the headline drops to the
 * bottom in small ink-3, where a methodology footnote belongs.
 *
 * ONE CARD EACH, not a bordered table row. Two `.mount` panels side by
 * side, opened by a drawn quote mark that hangs into the panel's own
 * margin — the mark is the single cue that says "this is quoted speech"
 * before any of the words are read.
 *
 * Stars are drawn here rather than pulled from an icon set: they are
 * struck in ink like every other mark on this sheet, and the half star
 * is a clip on a second copy of the same path rather than a different
 * glyph.
 */
function WhatTheWorkShowed() {
  return (
    <Section id="validation" density="loose">
      <Stage className="mb-4 md:mb-6">
        <RevealWords text="What they said" className="display-l" />
      </Stage>

      <Stage className="mb-10 md:mb-16" delay={0.1}>
        <Rise>
          <p className="max-w-[48ch] text-caption text-ink-3 md:text-[0.9375rem]">
            {validation.lede}
          </p>
        </Rise>
      </Stage>

      {/* Two up from `lg`, not from `md`. At 900px the rail has already
          taken 264px off the row, so a two-column split there gives each
          card 250px — a pull quote in the hand face at 250px is a
          nine-line ribbon. One column until there is room for two. */}
      <Stage className="grid gap-6 lg:grid-cols-2 lg:gap-10" stagger={0.09}>
        {validation.items.map((item, i) => (
          <Rise key={item.project}>
            <TestimonialCard item={item} index={i} />
          </Rise>
        ))}
      </Stage>
    </Section>
  );
}

/** Four hand-cut corner sets, matching the mounts in Selected Work. */
const QUOTE_CORNERS = [
  { "--mount-r1": "15px", "--mount-r2": "8px", "--mount-r3": "14px", "--mount-r4": "9px" },
  { "--mount-r1": "8px", "--mount-r2": "14px", "--mount-r3": "9px", "--mount-r4": "15px" },
] as unknown as React.CSSProperties[];

function TestimonialCard({
  item,
  index,
}: {
  item: (typeof validation.items)[number];
  index: number;
}) {
  return (
    <figure
      style={QUOTE_CORNERS[index % QUOTE_CORNERS.length]}
      className="mount flex h-full flex-col gap-6 px-6 pt-7 pb-6 md:px-9 md:pt-9 md:pb-8"
    >
      {/* The mark, hanging into the panel's own margin. It is the cue
          that this is speech, so it is drawn large and left quiet —
          hair-strong, not ink, so it never competes with the sentence
          it opens. */}
      <span
        aria-hidden
        className="font-hand -mb-6 -ml-1 text-[3.5rem] leading-none text-hair-strong select-none md:-mb-8 md:text-[4.5rem]"
      >
        &ldquo;
      </span>

      <blockquote className="font-hand text-[clamp(1.5rem,2.3vw,2rem)] leading-[1.25] font-semibold text-ink text-pretty">
        {item.quote}
      </blockquote>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <Stars value={item.rating} />
        <Measured className="stamp">
          {item.rating.toFixed(1)} / 5
        </Measured>
      </div>

      <figcaption className="mt-auto flex flex-col gap-1 border-t border-hair pt-5">
        <span className="text-[0.9375rem] leading-snug font-medium text-ink">
          {item.source}
        </span>
        <span className="text-caption text-ink-3">{item.role}</span>
        <span className="micro mt-1.5">{item.project}</span>
      </figcaption>

      <p className="text-note leading-[1.65] text-ink-3 text-pretty">
        {item.body}
      </p>
    </figure>
  );
}

/**
 * Five stars, `value` of them filled, halves allowed.
 *
 * Each star is the same path twice: an outline in accent ink, and a
 * filled copy clipped to however much of that star is earned — 100%,
 * 50% or 0%. One path, one shape, no separate half glyph to keep in
 * sync with the whole one.
 *
 * `role="img"` with the score in the label: a screen reader gets
 * "Rated 4.5 out of 5", not five unexplained shapes.
 */
function Stars({ value }: { value: number }) {
  return (
    <span
      role="img"
      aria-label={`Rated ${value} out of 5`}
      className="flex items-center gap-1"
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return <Star key={i} fill={fill} />;
      })}
    </span>
  );
}

function Star({ fill }: { fill: number }) {
  const PATH =
    "M8 1.2 9.94 5.5l4.66.52-3.47 3.15.96 4.6L8 11.44 3.91 13.77l.96-4.6L1.4 6.02l4.66-.52Z";
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="h-[1.05rem] w-[1.05rem] shrink-0 [filter:url(#sk-rough-1)]"
    >
      <path
        d={PATH}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      {fill > 0 && (
        <path
          d={PATH}
          fill="var(--color-accent)"
          style={{ clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }}
        />
      )}
    </svg>
  );
}

/**
 * THINGS WORTH SHARING — kept, deliberately.
 *
 * These are the founders' real papers and technical write-ups, and they
 * are here to answer one question: if the requirement turns out to be
 * genuinely hard, is there depth behind the application work. Converting
 * them into LMS marketing posts would delete the only thing they are good
 * for. One line of framing was added and nothing else.
 */
function WorthSharing() {
  return (
    <Section id="worth-sharing" density="medium">
      <Stage className="mb-4 md:mb-6">
        <RevealWords text="Things worth sharing" className="display-l" />
      </Stage>

      <Stage className="mb-10 md:mb-16" delay={0.1}>
        <Rise>
          <p className="max-w-[48ch] text-caption text-ink-3 md:text-[0.9375rem]">
            {research.lede}
          </p>
        </Rise>
      </Stage>

      <Stage
        className="grid items-start gap-10 md:grid-cols-3 md:gap-8"
        stagger={0.08}
      >
        {articles.map((a) => (
          <Rise key={a.slug}>
            <Link
              href={`/articles/${a.slug}`}
              data-cursor="view"
              className="block rounded-sm"
            >
              <article className="group">
                <div className="transition-transform duration-[var(--duration-slow)] ease-[var(--ease-exit)] group-hover:-translate-y-1">
                  {/* Banner on a phone, plate on a desktop — see
                      `ratioSm`. Three 4:3 plates stacked in a 345px
                      column is 780px of placeholder before a word of
                      the writing they are advertising. */}
                  <PlaceholderMedia
                    ratio="4/3"
                    ratioSm="16/9"
                    label={a.title}
                    drift
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <span className="text-title">
                    <span className="relative">
                      {a.title}
                      <span aria-hidden className="swipe" />
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

/**
 * The closing frame.
 *
 * It keeps the scale of the thing it replaces — the old page ended on the
 * email address set at 5rem, and that sense of finality was the one good
 * idea in it. What it does not keep is the email address as the message.
 * An address is a mechanism; it says nothing, and the brand it carried is
 * gone.
 *
 * What ends the page now is the whole argument compressed into five
 * words. The visitor does not have to know what software to ask for, and
 * this is the frame that tells them so: bring the teaching model, not a
 * feature list, and we will do the translating. That is the customisation
 * promise stated once, quietly, instead of asserted six times in
 * marketing copy.
 *
 * The address is still here — one line, small, under the call — reachable
 * without being the point.
 */
function ContactCta() {
  return (
    <Section id="closing" density="open" surface="dark">
      <Stage stagger={0.08}>
        <Rise className="mb-5 md:mb-8">
          <Eyebrow>Start with your model, not a spec</Eyebrow>
        </Rise>

        <Rise>
          <h2 className="display-l max-w-[13ch] text-[clamp(3rem,8vw,7.5rem)] leading-[1.0]">
            Tell us how you teach.
          </h2>
        </Rise>

        <Rise className="mt-7 md:mt-10">
          <p className="max-w-[46ch] text-body-l leading-[1.5] text-ink-2">
            Bring us your current workflow, a rough idea, or simply a problem
            you haven&rsquo;t translated into features yet.
          </p>
          <p className="mt-3 max-w-[46ch] text-body-l leading-[1.5] text-ink">
            We&rsquo;ll help shape the system around it.
          </p>
        </Rise>

        <Rise className="mt-9 md:mt-12">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-7">
            <ContactTriggerButton size="md">Book a call</ContactTriggerButton>
            {/* Secondary, and sized like it. */}
            <a
              href={`mailto:${site.email}`}
              data-cursor="copy"
              className="group relative text-caption text-ink-3 transition-colors duration-[var(--duration-instant)] hover:text-ink"
            >
              <span className="relative">
                or email us at {site.email}
                <span aria-hidden className="swipe" />
              </span>
            </a>
          </div>
        </Rise>
      </Stage>
    </Section>
  );
}
