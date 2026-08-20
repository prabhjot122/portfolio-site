/**
 * The roughening kit.
 *
 * Every drawn edge on this site is a straight CSS border pushed off its
 * line by a displacement map. One `<svg>` holds the filters; the CSS in
 * globals.css references them by id.
 *
 * WHY THIS RATHER THAN ASSETS
 * A hand-drawn frame as an image is one frame at one size. This is every
 * frame at every size, it costs no requests, and because the turbulence
 * is seeded per-filter the same box never wobbles identically twice on
 * the page.
 *
 * THE THREE RULES FOR USING THESE
 *
 * 1. Only ever put `filter:` on a pseudo-element that draws *nothing but
 *    a border*. A filter on a content box displaces the text too, which
 *    is illegible, and it creates a containing block that breaks the
 *    `position: fixed` side rail.
 *
 * 2. The SVG must stay in the render tree. `display: none` makes the
 *    filter unresolvable from CSS, and the border silently renders
 *    straight. Zero-sized and clipped is the supported way to hide it.
 *
 * 3. MATCH THE FILTER TO THE ELEMENT'S SHAPE, not just its role. The
 *    filter region is a percentage of the element's own box, so a
 *    filter that works on a card does nothing at all on a hairline —
 *    see THE HAIRLINE TRAP below.
 *
 * ===================================================================
 * WHAT MAKES A LINE READ AS DRAWN
 *
 * Two things, and they are independent dials.
 *
 * AMPLITUDE (`scale`) is how far off true the line goes. On its own it
 * produces a bowed line: still obviously mechanical, just bent. This is
 * what the site had, and it read as a *warped* rectangle rather than a
 * drawn one.
 *
 * TREMOR (`baseFrequency` and `numOctaves`) is how often the line
 * changes direction. This is the part that reads as a hand. Measured on
 * a 560px rule as mean |second difference| along its length:
 *
 *   bf 0.011, scale 4.6   peak 1.5px   tremor 0.047   <- the old setting
 *   bf 0.011, scale 10    peak 2.5px   tremor 0.106
 *   bf 0.035, scale 10    peak 3.0px   tremor 0.247
 *
 * Base frequency is by far the stronger lever, and it is free — the
 * same number of octaves either way. Amplitude alone barely moves
 * tremor at all.
 *
 * OCTAVES ONLY COUNT IF THEY CLEAR A PIXEL. Each octave halves the
 * wavelength and halves the amplitude, so at a small `scale` the high
 * octaves land below half a pixel and quantise away — real arithmetic
 * producing nothing. At the old `bf 0.011, scale 4.6`, octaves 3 and 4
 * were worth 0.4px and 0.2px and were genuinely invisible, which is why
 * cutting them to 2 looked free. The fix is not to add octaves back on
 * their own; it is to raise the base frequency so the octaves that
 * remain are doing visible work.
 *
 * THE SECOND PASS IS WHAT SELLS IT. A single displaced stroke, however
 * hard it wobbles, still reads as one machine-drawn line that has been
 * bent. What a person actually does is go round twice, and the two
 * passes never quite agree. Each border filter below therefore runs the
 * source through two turbulence fields at different seeds and merges
 * them. `components/cursor.tsx` already does this the manual way, with
 * two stacked rings — its comment calls the second loop "the detail
 * that sells the whole cursor", and it is the same detail here.
 *
 * ===================================================================
 * THE HAIRLINE TRAP
 *
 * An SVG filter's default region is `-10% -10% 120% 120%` of the
 * element's bounding box. On a card that is tens of pixels of margin.
 * On a 1px-tall registration guide it is a 1.2px-tall region, so the
 * displaced line is clipped back to almost exactly where it started —
 * the filter runs in full and produces a straight line.
 *
 * 54 of the thin rules on the home page were in exactly that state:
 * paying for turbulence and rendering straight.
 *
 * A percentage region cannot serve both a 340px card and a 1px rule, so
 * hairlines get their own filters with a region inflated on the thin
 * axis only. That is why there is an `-h` and a `-v`: a 444x1 rule and
 * a 1x333 rule need the inflation on opposite axes, and inflating both
 * would blow the region up to thousands of pixels on the long side.
 *
 * ===================================================================
 * COST
 *
 * A filtered element rasterises when it PAINTS, not when it scrolls.
 * Once a border has been rendered into its layer, moving that layer is
 * free — the turbulence does not re-run. The two-pass filters are ~1.9x
 * a single pass, measured, and that is a one-time cost per element.
 *
 * That was NOT true while `components/atmosphere.tsx` was a WebGL
 * canvas. A surface repainting continuously at the bottom of the stack
 * dirties everything composited above it, which turned every one of
 * these one-time costs into a per-frame cost, and made it worse the
 * more drawn panels were on screen. That is what made scrolling heavy.
 * The canvas is gone and the background is static, so the bill is
 * one-time again and the second pass is affordable.
 *
 * The consequence for future changes: anything that reintroduces a
 * continuously-repainting full-viewport surface under the content — a
 * canvas, a video, a CSS animation on a fixed backdrop, a
 * `mix-blend-mode` layer over the whole page — brings the per-frame
 * cost back with it, and no amount of tuning these filters will fix
 * that.
 *
 * `sk-rough-4` is deliberately left at a single pass. It is the
 * hatching, which is already irregular and gains nothing from being
 * drawn twice, and it carries by far the most filtered area on the page
 * (23 elements at a median 12,000px², against 10 at 7,000 for
 * `sk-rough-2`). Doubling it would cost more than doubling every border
 * on the site put together.
 */

/** Two passes of the same field at different seeds, merged — see
    "THE SECOND PASS IS WHAT SELLS IT" above. */
function DoubleStroke({
  baseFrequency,
  numOctaves,
  scale,
  seeds,
}: {
  baseFrequency: number;
  numOctaves: number;
  scale: number;
  seeds: [number, number];
}) {
  return (
    <>
      <feTurbulence
        type="fractalNoise"
        baseFrequency={baseFrequency}
        numOctaves={numOctaves}
        seed={seeds[0]}
        result="n1"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="n1"
        scale={scale}
        xChannelSelector="R"
        yChannelSelector="G"
        result="d1"
      />
      <feTurbulence
        type="fractalNoise"
        baseFrequency={baseFrequency}
        numOctaves={numOctaves}
        seed={seeds[1]}
        result="n2"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="n2"
        scale={scale * 0.82}
        xChannelSelector="R"
        yChannelSelector="G"
        result="d2"
      />
      <feMerge>
        <feMergeNode in="d1" />
        <feMergeNode in="d2" />
      </feMerge>
    </>
  );
}

export function SketchDefs() {
  return (
    <svg
      aria-hidden
      focusable="false"
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        overflow: "hidden",
      }}
    >
      <defs>
        {/*
          Chips, pills, small controls — 14px to 44px boxes.

          The highest base frequency of the set, because the wobble has
          to complete inside a 14px chip. At the panel filters'
          wavelengths a chip this small sits under a single slope and
          would simply be shifted bodily off its position rather than
          drawn — which is the same failure as the hairlines below,
          arrived at from the other direction.

          Region is 150%: a small box needs proportionally more margin,
          and 150% of 14px is only 3.5px of it.
        */}
        <filter
          id="sk-rough-1"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
        >
          <DoubleStroke
            baseFrequency={0.055}
            numOctaves={3}
            scale={1.9}
            seeds={[3, 71]}
          />
        </filter>

        {/* Rail cards, inputs, name chips. The mid tier. */}
        <filter
          id="sk-rough-2"
          x="-18%"
          y="-18%"
          width="136%"
          height="136%"
        >
          <DoubleStroke
            baseFrequency={0.028}
            numOctaves={4}
            scale={5.4}
            seeds={[17, 89]}
          />
        </filter>

        {/*
          Media plates and panels — the long runs, up to ~460px.

          Lower base frequency than the tier above, but not by as much
          as it used to be. A long edge does want a longer fundamental
          or it reads as vibration rather than as a hand; the octaves
          are what supply the tremor on top of it, and at this scale
          they are large enough to survive.
        */}
        <filter
          id="sk-rough-3"
          x="-15%"
          y="-15%"
          width="130%"
          height="130%"
        >
          <DoubleStroke
            baseFrequency={0.025}
            numOctaves={4}
            scale={6}
            seeds={[41, 113]}
          />
        </filter>

        {/*
          Hatching and anything already irregular.

          SINGLE PASS ON PURPOSE — see the cost note at the top. Two
          overlapping stroke fields also moire against each other, which
          is the same reason `.lift-interactive` cross-fades its hatch
          band rather than stacking two.
        */}
        <filter id="sk-rough-4">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.024"
            numOctaves="4"
            seed="59"
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="3.4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/*
          HAIRLINES — see THE HAIRLINE TRAP above.

          Region is inflated on the thin axis only. At 1100% of a 1px
          rule that is an 11px band with 5px of travel either side,
          which comfortably clears the ~2px throw; on the long axis it
          stays at 102% so the region does not become enormous.

          These stay single-pass. A hairline drawn twice reads as two
          lines rather than as one drawn line, and these are guides.
        */}
        <filter id="sk-rule-h" x="-1%" y="-500%" width="102%" height="1100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.022"
            numOctaves="4"
            seed="41"
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="2.6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter id="sk-rule-v" x="-500%" y="-1%" width="1100%" height="102%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.022"
            numOctaves="4"
            seed="97"
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="2.6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/*
          `sk-graphite` used to live here — desaturate plus a gamma push,
          for rendering photographs as pencil. It is gone because it was
          the one filter applied to a full-size bitmap rather than to a
          hairline border, and it re-rasterised the whole image every
          frame the portrait moved. `.graphite-image` in globals.css now
          does the same tone curve with native CSS filter functions,
          which run on the GPU.
        */}
      </defs>
    </svg>
  );
}
