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
| `lib/content.ts` | **All site copy.** Name, role, hero, contact, projects, services, testimonials, articles. Start here. |
| `app/globals.css` | **The token layer.** Colour, type scale, motion curves, depth utilities, focus, grain. Nothing hardcodes a value outside this file. |
| `lib/motion.ts` | Easing curves, durations, stagger, variant atoms, load choreography. |
| `components/motion.tsx` | Orchestration primitives — `Stage`, `Rise`, `Frame`, `MaskLine`. |
| `components/atmosphere.tsx` | The WebGL sky. One canvas, one loop, publishes the sun vector. |
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

## The sun

`components/atmosphere.tsx` renders the sky and publishes `--sun-angle`
on `:root`, quantised to whole degrees and written only on change (a
custom-property write on `:root` invalidates paint for every element
reading it).

Scroll drives it: 52° at the top of the page, 12° at the bottom.

Constraints that are load-bearing, not preferences:

- DPR clamped to 1.5
- loop paused on `visibilitychange`
- buffers, program and shaders deleted on unmount — but **never**
  `loseContext()`, which poisons every later mount
- the shader is held inside a measured luminance band; widening it
  breaks AA on `--color-ink-3`
- the gradient is **dithered**. Without it a near-white ramp this
  shallow bands into visible stripes.

## Fallbacks

Treated as design deliverables, not error states:

- **No WebGL** → the same sky as a static CSS gradient, sun parked.
- **Reduced motion** → `MotionConfig reducedMotion="user"` in
  `components/motion-provider.tsx` makes motion/react honour the
  preference; the CSS media query alone cannot, because every entrance
  is JS-driven. Curtain and smooth scroll are skipped, the sun parks.
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
