"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Typewriter, for the hero headline only.
 *
 * Three things make this different from the usual implementation, and
 * all three are the reason it is a component rather than four lines:
 *
 * 1. ZERO LAYOUT SHIFT. Every glyph is in the DOM from the first paint
 *    and untyped characters are hidden with `opacity`, not by being
 *    absent. The headline therefore occupies its final box immediately.
 *    Appending characters to a string — the obvious version — reflows
 *    the tallest element on the page on every tick, which is both a CLS
 *    failure and a guaranteed frame drop at this type size.
 *
 * 2. WORDS DO NOT BREAK. Characters are grouped into inline-block words,
 *    so wrapping still happens at spaces. Bare per-character spans let
 *    the browser break mid-word, which at 168px is unmissable.
 *
 * 3. IT IS ANNOUNCED ONCE. The visible glyphs are `aria-hidden` and the
 *    full sentence sits in a single label, so a screen reader reads the
 *    headline as a sentence instead of spelling it out.
 *
 * Under reduced motion the text is simply present, with no caret.
 */

/** Milliseconds per character. */
const SPEED = 46;
/** Extra beat at the end of a line, so the break reads as a pause. */
const LINE_PAUSE = 260;
/** Wait for the curtain to clear before the first keystroke. */
const START_DELAY = 340;

/**
 * A word wrapped in `*asterisks*` types normally but renders in the
 * accent colour — used to pull out the one or two terms in the
 * hero statement that carry the claim. The asterisks are stripped before
 * typing so they never appear as characters or affect the letter count.
 */
function parseWords(line: string) {
  return line.split(" ").map((raw) => {
    const highlight =
      raw.length > 2 && raw.startsWith("*") && raw.endsWith("*");
    return { word: highlight ? raw.slice(1, -1) : raw, highlight };
  });
}

export function Typewriter({
  lines,
  className = "",
}: {
  lines: string[];
  className?: string;
}) {
  const reduced = useReducedMotion();
  const parsedLines = useMemo(() => lines.map(parseWords), [lines]);
  const strippedLines = useMemo(
    () => parsedLines.map((words) => words.map((w) => w.word).join(" ")),
    [parsedLines],
  );
  const full = strippedLines.join(" ");

  // Flatten to a single index space so one counter drives every line.
  const total = useMemo(
    () => strippedLines.reduce((n, l) => n + l.length, 0),
    [strippedLines],
  );
  const [typed, setTyped] = useState(0);
  const [done, setDone] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (reduced) {
      setTyped(total);
      setDone(true);
      return;
    }

    let i = 0;
    let cancelled = false;

    // Index of the last character of each line, for the end-of-line beat.
    const breaks = new Set<number>();
    let acc = 0;
    for (const l of strippedLines) {
      acc += l.length;
      breaks.add(acc);
    }

    const step = () => {
      if (cancelled) return;
      i += 1;
      setTyped(i);
      if (i >= total) {
        setDone(true);
        return;
      }
      timer.current = window.setTimeout(
        step,
        breaks.has(i) ? LINE_PAUSE : SPEED,
      );
    };

    timer.current = window.setTimeout(step, START_DELAY);
    return () => {
      cancelled = true;
      window.clearTimeout(timer.current);
    };
  }, [strippedLines, total, reduced]);

  let cursor = 0;

  return (
    <span className={className}>
      {/* The sentence, announced once. */}
      <span className="sr-only">{full}</span>

      <span aria-hidden>
        {parsedLines.map((words, li) => {
          const lineActive = caretOnLine(strippedLines, typed, li);
          // Set once the caret has been dropped inline, mid-word or in a
          // gap between words, so the trailing check below doesn't double
          // it up at the end of the line.
          let caretPlaced = false;

          return (
            <span key={li} className="block">
              {/* `relative inline-block`: sized to exactly the words it
                  wraps, not the full line box — `block` above stretches
                  to the h1's whole measure, and a `right-0` caret
                  anchored to THAT would land at the h1's right edge
                  rather than at the end of a short last line. This inner
                  wrapper is what the trailing, end-of-line caret below
                  actually sits against. Its width is already the full
                  reserved text width from frame one (hidden characters
                  still occupy their glyph width), so `right-0` lands at
                  the true end of the line regardless of how much has
                  been typed. */}
              <span className="relative inline-block">
                {words.map(({ word, highlight }, wi) => {
                  const chars = [...word];
                  const node = (
                    <span
                      key={wi}
                      className={`inline-block whitespace-nowrap ${
                        highlight ? "italic-safe text-accent" : ""
                      }`}
                    >
                      {chars.map((ch, ci) => {
                        const idx = cursor + ci;
                        const shown = idx < typed;
                        // The caret rides the character it is about to
                        // type, not the far edge of the (pre-sized) line —
                        // the line's full width is already reserved by the
                        // hidden characters, so anchoring it to the line's
                        // end would leave it parked there from frame one.
                        const showCaretHere = lineActive && idx === typed;
                        if (showCaretHere) caretPlaced = true;
                        return (
                          // `relative`: gives the caret below a box to sit
                          // just outside of via `absolute`. It MUST be
                          // absolute — mounting it as a normal inline
                          // sibling adds real width to the line for the
                          // one frame it is there, which can tip a word
                          // over the wrap point and reflow everything under
                          // the headline for that frame.
                          <span key={ci} className="relative inline-block">
                            {showCaretHere && (
                              <Caret done={done} className="right-full" />
                            )}
                            <span
                              style={{
                                opacity: shown ? 1 : 0,
                                // No transition: a fade per glyph turns the
                                // whole line into a shimmer. Keys land.
                              }}
                            >
                              {ch}
                            </span>
                          </span>
                        );
                      })}
                    </span>
                  );
                  cursor += chars.length;
                  // Spaces are not typed characters here — they belong to
                  // the gap between words and would otherwise show as a
                  // stalled beat.
                  const spaceIdx = cursor;
                  const spaceCaret =
                    lineActive && spaceIdx === typed && !caretPlaced;
                  if (spaceCaret) caretPlaced = true;
                  const space =
                    wi < words.length - 1 ? (
                      <span key={`s${wi}`} className="relative">
                        {spaceCaret && (
                          <Caret done={done} className="right-full" />
                        )}{" "}
                      </span>
                    ) : null;
                  return [node, space];
                })}

                {/* Falls back to the end of the line once every character
                  has been typed — covers the resting caret on the final
                  line after typing finishes. */}
                {lineActive && !caretPlaced && (
                  <Caret done={done} className="right-0" />
                )}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

/** True when the flat `typed` index currently sits inside line `li`. */
function caretOnLine(lines: string[], typed: number, li: number) {
  let start = 0;
  for (let i = 0; i < li; i++) start += lines[i].length;
  const end = start + lines[li].length;
  const last = li === lines.length - 1;
  return last ? typed >= start : typed >= start && typed < end;
}

/**
 * Always `absolute`. It is positioned by `className` (`right-full` to sit
 * just before a character, `right-0` to rest at a line's own end) against
 * whichever `relative` box it was dropped into — never a normal-flow
 * sibling, so mounting or unmounting it never changes anyone's width and
 * never triggers a wrap.
 */
function Caret({
  done,
  className = "",
}: {
  done: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`absolute mr-[0.06em] font-normal not-italic text-accent ${className} ${
        done ? "animate-caret-rest" : "animate-caret"
      }`}
    >
      |
    </span>
  );
}
