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
 * accent colour, italic — used to pull out the one or two terms in the
 * hero statement that carry the claim. The asterisks are stripped before
 * typing so they never appear as characters or affect the letter count.
 */
function parseWords(line: string) {
  return line.split(" ").map((raw) => {
    const highlight = raw.length > 2 && raw.startsWith("*") && raw.endsWith("*");
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
          return (
            <span key={li} className="block">
              {words.map(({ word, highlight }, wi) => {
                const chars = [...word];
                const node = (
                  <span
                    key={wi}
                    className={`inline-block whitespace-nowrap ${
                      highlight ? "italic-safe italic text-accent" : ""
                    }`}
                  >
                    {chars.map((ch, ci) => {
                      const idx = cursor + ci;
                      const shown = idx < typed;
                      return (
                        <span
                          key={ci}
                          style={{
                            opacity: shown ? 1 : 0,
                            // No transition: a fade per glyph turns the
                            // whole line into a shimmer. Keys land.
                          }}
                        >
                          {ch}
                        </span>
                      );
                    })}
                  </span>
                );
                cursor += chars.length;
                // Spaces are not typed characters here — they belong to
                // the gap between words and would otherwise show as a
                // stalled beat.
                const space = wi < words.length - 1 ? <span key={`s${wi}`}> </span> : null;
                return [node, space];
              })}

              {/* Caret rides the line currently being typed, and rests at
                  the end of the last line before fading. */}
              {caretOnLine(strippedLines, typed, li) && <Caret done={done} />}
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

function Caret({ done }: { done: boolean }) {
  return (
    <span
      className={`ml-[0.06em] inline-block h-[0.78em] w-[0.045em] translate-y-[0.04em] bg-accent align-baseline ${
        done ? "animate-caret-rest" : "animate-caret"
      }`}
    />
  );
}
