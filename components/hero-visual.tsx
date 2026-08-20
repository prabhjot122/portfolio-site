import { PortraitDeck } from "@/components/portrait-deck";
import { ProductShot } from "@/components/product-shot";
import { hero } from "@/lib/content";

/**
 * The hero's right-hand column: real builders, real product.
 *
 * THE HIERARCHY CHANGED HERE AND THAT IS THE WHOLE POINT. This used to
 * be two large portrait cards and nothing else, which said "meet these
 * two people" at a moment when the visitor is still working out what the
 * studio sells. The product plate is now the dominant object and the
 * founders are tucked under its lower-left corner — small, tilted,
 * overlapping, still unmistakably photographs of two humans.
 *
 * Neither element is centred on the other and the pile deliberately
 * hangs outside the plate. Two rectangles squared up inside a column is
 * a slide layout; a photograph left lying half over a printout is what
 * a desk looks like, and the second one is the register this site is
 * written in.
 *
 * NO z-index ANYWHERE IN HERE, on purpose. `.lift` paints its hatch
 * shadow at a negative z-index and depends on escaping to an ancestor so
 * the panel's own fill can hide the overlap — giving the portrait
 * wrapper a z-index would make it a stacking context, trap the hatch,
 * and smear it across the faces. The pile already paints above the plate
 * because it comes later in the DOM and both are positioned, which is
 * all the stacking this needs.
 */
export function HeroVisual({ className = "" }: { className?: string }) {
  const { product } = hero;

  return (
    <div className={className}>
      {/* Padding-bottom is a percentage, so it resolves against the
          column's WIDTH — the same axis the plate and the pile are both
          sized from. The overhang therefore stays proportional at every
          breakpoint instead of needing a fixed value per screen. */}
      <div className="relative pb-[10%]">
        <ProductShot
          src={product.src}
          alt={product.alt}
          label={product.label}
          ratio="16/10"
          priority
        />

        <div className="absolute bottom-0 left-0 w-[34%] max-w-[11rem] md:-left-[5%] md:max-w-[13rem]">
          <PortraitDeck variant="mini" />
        </div>

        {/* Caption sits opposite the pile, so the two never negotiate. */}
        <span className="micro absolute right-0 bottom-1 text-ink-3">
          {product.caption}
        </span>
      </div>
    </div>
  );
}
