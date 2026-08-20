/**
 * A sequence drawn as a line with nodes on it.
 *
 * The site's one diagram, and it earns being a component because it now
 * says the same thing in four places: the pipeline beside Syrus, and
 * the learning loop inside each of the three model cards. Those are the
 * same claim — *this happens, then this, and this is the step that
 * matters* — so they should be the same drawing rather than four
 * hand-tuned approximations of it.
 *
 * ------------------------------------------------------------------
 * HOW IT IS BUILT, AND WHY NOT THE OBVIOUS WAY
 *
 * The obvious build is one absolutely-positioned rule behind a list of
 * rows. It breaks the moment a row wraps to two lines, because the rule
 * is a fixed height and the rows are not — and it makes ending the line
 * early a special case you have to measure.
 *
 * Here the line is each row's OWN left edge, stretched to that row's
 * height. Three things follow for free:
 *
 *   - a row can be any height and the line still reaches it;
 *   - the last step ends the line simply by not drawing one, which is
 *     the correct drawing rather than a trick. An output is not a
 *     stage: the line should stop AT it, not run past it into nothing;
 *   - nothing needs measuring, so it is a server component.
 *
 * ------------------------------------------------------------------
 * THE THREE MARKS
 *
 *   plain   a step. Solid ink.
 *   key     THE step — the one the sequence exists for. Accent, and
 *           there should be exactly one per spine. This is the site's
 *           colour rule doing real work: reading down the accent nodes
 *           of the three model cards gives you the three arguments
 *           without reading a word of the copy.
 *   open    the end. A hollow node, and the line stops here.
 *
 * A spine with no `key` is not an error, but it is usually a sign the
 * sequence has not decided what it is about.
 */
export type SpineStep = {
  text: string;
  /** A second line under the step, in the data face. Optional. */
  note?: string;
  mark?: "plain" | "key" | "open";
};

export function Spine({
  steps,
  className = "",
}: {
  steps: readonly SpineStep[];
  className?: string;
}) {
  return (
    <ol className={`flex flex-col ${className}`}>
      {steps.map((step) => {
        const open = step.mark === "open";
        return (
          <li key={step.text} className="flex gap-3">
            <span
              aria-hidden
              className={`relative w-px shrink-0 ${
                open ? "min-h-[1.375rem]" : "min-h-10 bg-hair"
              }`}
            >
              {/* Pulled half a pixel left of the rule so the node is
                  centred ON the line rather than hung off it. */}
              <span
                className={`absolute top-0.5 -left-[2.5px] block size-1.5 rounded-full ${
                  open
                    ? "border border-hair-strong bg-surface"
                    : step.mark === "key"
                      ? "bg-accent"
                      : "bg-ink"
                }`}
              />
            </span>
            <span
              className={`pb-3.5 text-caption leading-[1.45] ${
                open ? "text-ink-3" : "text-ink"
              }`}
            >
              {step.text}
              {step.note && (
                <span className="stamp mt-1 block text-faint">{step.note}</span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
