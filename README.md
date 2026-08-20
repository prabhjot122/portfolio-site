# Portfolio Site

Next.js portfolio. Copy lives in `lib/content.ts`; imagery is still
placeholder.

## Run

```bash
npm run dev
```

> Do not run `next build` while `next dev` is running — they share
> `.next`, and the build will wedge the dev server into 500s until it is
> restarted.

## Where things live

| Path | What it is |
| --- | --- |
| `lib/content.ts` | **All site copy.** Brand, hero, contact, projects, services, process, validation, articles. Start here. |
| `app/globals.css` | **The token layer.** Colour, type scale, motion curves, depth utilities, focus, grain. Nothing hardcodes a value outside this file. |
| `lib/motion.ts` | Easing curves, durations, stagger, variant atoms, load choreography. |
| `components/motion.tsx` | Orchestration primitives — `Stage`, `Rise`, `Frame`, `MaskLine`. |
| `components/atmosphere.tsx` | The sheet behind everything. Three static CSS layers, no client JS. |
| `components/sketch-defs.tsx` | The roughening filters every drawn edge resolves against. |
| `components/cursor.tsx` | Cursor state machine — inertia, magnetism, reticle. |
| `components/side-nav.tsx` | Desktop left rail — identity, stats, menu, contact. |
| `components/ui.tsx` | Primitives: `Measured`, underline link, pills, heading, eyebrow. |
| `components/work-card.tsx` | Portrait card + caption used by the work grids. |
| `components/placeholder-media.tsx` | Reserved media frames with registration marks. |
| `components/preloader.tsx` | Intro curtain, gated on `document.fonts.ready`. |
| `components/section.tsx` | Page rhythm + section density. |

## Routes

```
/                     home
/work                 project index
/work/[slug]          case study
/personal             category index
/personal/[category]  gallery
/articles/[slug]      long-form article
/about
/contact
```

Project and article routes are generated from the arrays in
`lib/content.ts` — add an entry and the page exists.

## Design system — One Sun

A light system built from a single directional light and two
temperatures: **warm sun, cool shade.**

### The one depth rule

Surfaces only ever move **lighter** than the ground. Separation is done
by shadow and hairline, never by a darker panel. If you find yourself
reaching for a darker fill to make something recede, the answer is a
shadow instead.

Depth comes from a two-part shadow, because that is what one bright
light over a pale surface actually produces:

- a tight **warm** contact shadow (bounced light off the ground)
- a wide **cool** ambient shadow (open sky)

Use `.lift`, `.lift-lg`, or `.lift-interactive`. Do not hand-roll a
`box-shadow`.

### The one colour rule

**Anything measured is set in the data face and inked in the accent.**
That is `<Measured>` / `.measured` — JetBrains Mono, tabular figures,
`--color-accent`.

Counts, percentages, ratings, years, dates, response times. Nothing
else gets colour — not headings, not links, not the email address.
Applying `.measured` to something that is not a measurement is a bug.

### Palette

| Token | Value | Role |
| --- | --- | --- |
| `--color-ground` | `#FAF8F5` | Page base |
| `--color-surface` | `#FDFCFA` | Raised |
| `--color-surface-2` | `#FEFEFD` | Highest |
| `--color-ink` | `#17120E` | Primary text |
| `--color-ink-2` | `#4A423B` | Secondary |
| `--color-ink-3` | `#6E655C` | Labels, meta |
| `--color-hair` | `#E2DCD4` | Rules and borders |
| `--color-accent` | `#0B4A5C` | Measured values only |

Worst-case contrast, measured against the darkest pixel the shader can
produce: ink 16.49, ink-2 8.73, ink-3 5.06, accent 8.67. **`--color-ink-3`
is the binding constraint** at 0.56 above AA — re-measure if you change
the shader band, the dither amplitude, or the cool tint.

### Type

Newsreader (display) / Instrument Sans (text) / JetBrains Mono (data).
Scale runs `display-xl` → `micro`; `display-xl` to body is 10.5:1.
Use the `.display-*` and `.micro` helpers rather than re-deriving clamps.

### Motion

Four curves, all in `lib/motion.ts`: `exit`, `reveal`, `transition`,
`settle`. Durations `instant` → `curtain`. Compose with `<Stage>` +
`<Rise>` rather than hand-tuning delays per call site.

**Transform and opacity only.** `box-shadow` is a paint property — if
something needs to gain depth on hover, cross-fade
`.lift-interactive::after` rather than transitioning the shadow.

## The sheet

`components/atmosphere.tsx` is the background. It is a **server
component with no client JavaScript** — three static CSS layers, painted
once and thereafter only composited.

It used to be a WebGL canvas running a cross-hatching shader with a sun
that tracked scroll. That is gone, and the reason is worth keeping:

> A background that repaints, at any rate, is a moving surface
> underneath ~200 elements carrying `filter: url(#sk-rough-*)`. Every
> repaint re-composites the stack above it, and re-compositing an SVG
> displacement filter re-runs `feTurbulence` + `feDisplacementMap` on
> the CPU. The shader's own cost (~0.55ms/frame once tuned) was never
> the problem; the cost it imposed on everything above it was — and it
> scaled with how many drawn panels were on screen, which is why the
> page got heavier the further down you scrolled.

Constraints that are load-bearing, not preferences:

- **Nothing in this layer may animate.** Not a transition, not a
  keyframe, not a scroll-linked transform.
- The darkest pixel it can produce is `#DDD9CE` (hatching over the
  bottom-left corner). The contrast table in `app/globals.css` is
  measured against that. Raising the hatch opacity, darkening the
  gradient's end stop, or letting the grid mask overlap the hatch mask
  are all **contrast changes**, not style changes.
- The grid and hatch masks are complementary on purpose — if they
  stack, `--color-ink-3` falls to 5.67, below the documented 5.76.

The same rule applies elsewhere: **nothing carrying an SVG filter may
sit inside a scroll-driven subtree.** `PlaceholderMedia` used to drift
its corner ticks and thirds guides inside a `<Parallax>`, which cost 96
filter re-rasterisations per frame across the home page's twelve plates.
They are frame furniture and now sit on the plate instead.

## Drawn edges

Every border on the site is a straight CSS border pushed off its line by
a displacement filter in `components/sketch-defs.tsx`. Two dials, and
they are independent:

- **Amplitude** (`scale`) is how far off true the line goes. On its own
  it produces a *bowed* line — mechanical, just bent.
- **Tremor** (`baseFrequency`, `numOctaves`) is how often the line
  changes direction. This is the part that reads as a hand.

Base frequency is by far the stronger lever and it is free. Measured as
mean |second difference| along a 560px edge:

| setting | peak off true | tremor |
| --- | --- | --- |
| `bf 0.011, scale 4.6` | 1.50px | 0.046 |
| `bf 0.011, scale 10` | 2.50px | 0.106 |
| `bf 0.025, scale 6, ×2 passes` | 1.67px | 0.115 |
| `bf 0.035, scale 10` | 3.00px | 0.247 |

Border filters run **two passes at different seeds, merged** — the line
is drawn twice and the passes never quite agree, which is what separates
a scribble from a warp. `sk-rough-4` (hatching) is deliberately single
pass: it is already irregular, and it carries the most filtered area on
the page by a wide margin.

Three traps, all of which have bitten this file already:

1. **Octaves only count if they clear a pixel.** Each octave halves the
   amplitude, so at a small `scale` the high ones quantise away — real
   arithmetic producing nothing visible. Cutting them then looks free.
   The fix is to raise the base frequency, not to add octaves.
2. **The hairline trap.** A filter's region defaults to 120% of the
   element's box, so on a 1px rule it is 1.2px and clips the displaced
   line straight back to true. 54 rules on the home page were paying for
   turbulence and rendering perfectly straight. Thin rules use
   `sk-rule-h` / `sk-rule-v`, whose region is inflated on the thin axis
   only — a percentage region cannot serve both a 340px card and a 1px
   rule.
3. **Never build the filter class by interpolation.** Tailwind extracts
   arbitrary values by scanning source for *literal* strings, so
   `` `[filter:url(#sk-rule-${axis})]` `` is never generated and
   silently resolves to `filter: none`. Use an inline `style`.

Cost: a filtered element rasterises when it **paints**, not when it
scrolls. These are one-time costs per element — but only as long as
nothing repainting sits underneath them. See "The sheet" above.

## Fallbacks

Treated as design deliverables, not error states:

- **Reduced motion** → `MotionConfig reducedMotion="user"` in
  `components/motion-provider.tsx` makes motion/react honour the
  preference; the CSS media query alone cannot, because every entrance
  is JS-driven. Curtain and smooth scroll are skipped.
- **Touch / coarse pointer** → the cursor never mounts, and the native
  cursor is never hidden.

## Swapping in real images

Replace `<PlaceholderMedia />` with `next/image`, keeping the same
`aspectRatio` so the layout does not shift:

```tsx
<Image src="/images/project.jpg" alt="" width={1600} height={1000} className="rounded-sm" />
```

## Navigation

Desktop (`md` and up) uses a fixed left rail; the top bar is mobile-only.
Pages reserve the rail's gutter with `md:pl-[16.5rem]` in
`app/layout.tsx` — keep that in sync with the rail's width if you resize
it. The home hero breaks out of that gutter with a negative margin so
the rail's arrival never reflows the page.
