"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode } from "react";

import { EASE, DUR, STAGGER, s, rise, slide, frame, maskLine, stage } from "@/lib/motion";

/**
 * Orchestration primitives.
 *
 * The rule this file exists to enforce: a section animates as one
 * composed thing, not as N independent things that happen to share a
 * delay prop. Wrap a group in <Stage>, mark its members, and the
 * sequencing falls out of the tree rather than out of hand-tuned
 * numbers at every call site.
 */

type Common = {
  children: ReactNode;
  className?: string;
};

/**
 * Runs its children in sequence when it scrolls into view.
 *
 * `once` is deliberate — replaying a reveal every time a section
 * re-enters the viewport turns a page into a slot machine.
 */
export function Stage({
  children,
  className = "",
  stagger = STAGGER,
  delay = 0,
  amount = 0.15,
  as: _as,
}: Common & {
  stagger?: number;
  delay?: number;
  amount?: number;
  as?: never;
}) {
  return (
    <motion.div
      className={className}
      variants={stage(stagger, delay)}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

/** Same orchestration, but driven on mount rather than on scroll. */
export function StageOnLoad({
  children,
  className = "",
  stagger = STAGGER,
  delay = 0,
}: Common & { stagger?: number; delay?: number }) {
  return (
    <motion.div
      className={className}
      variants={stage(stagger, delay)}
      initial="hidden"
      animate="shown"
    >
      {children}
    </motion.div>
  );
}

/** A member of a Stage. The default entrance. */
export function Rise({ children, className = "" }: Common) {
  return (
    <motion.div className={className} variants={rise}>
      {children}
    </motion.div>
  );
}

/** A member of a Stage, entering from the left. */
export function Slide({ children, className = "" }: Common) {
  return (
    <motion.div className={className} variants={slide}>
      {children}
    </motion.div>
  );
}

/** A member of a Stage, for media frames. */
export function Frame({ children, className = "" }: Common) {
  return (
    <motion.div className={className} variants={frame}>
      {children}
    </motion.div>
  );
}

/**
 * One line of display type, sliding up from behind its own clip.
 *
 * The clip is a real element rather than overflow on the heading, so
 * descenders are not cut: the inner span is padded and the wrapper
 * clips to the padded box.
 */
export function MaskLine({ children, className = "" }: Common) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={`block ${className}`}>{children}</span>;
  }

  return (
    <span className="block overflow-hidden pb-[0.12em]">
      <motion.span className={`block ${className}`} variants={maskLine}>
        {children}
      </motion.span>
    </span>
  );
}

/* ------------------------------------------------------------------
   Scroll-linked
   ------------------------------------------------------------------ */

/**
 * Parallax drift, tied to the element's own progress through the
 * viewport rather than to raw page scroll — so it behaves the same
 * whether it sits near the top or the bottom of a long page.
 *
 * `speed` is the total travel as a fraction of the element's height,
 * split either side of centre. 0.1 means it drifts 5% up and 5% down
 * across its full pass. Keep it small: this is depth, not motion.
 *
 * DECORATIVE ELEMENTS ONLY. Parallax on running text causes motion
 * sickness and is the single most common way this technique gets
 * misused. Media and ornament, nothing that has to be read.
 *
 * Spring-smoothed so a trackpad flick does not translate directly into
 * a jolt, and disabled outright under reduced motion — `useTransform`
 * writes styles directly and is not covered by MotionConfig.
 */
export function Parallax({
  children,
  className = "",
  speed = 0.12,
}: Common & { speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  });
  const pct = speed * 50;
  const y = useTransform(smooth, [0, 1], [`${pct}%`, `${-pct}%`]);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

/**
 * A heading that arrives a word at a time.
 *
 * Each word rises from behind its own clip, so the line assembles
 * rather than fading in as a block. Words are inline-block, so wrapping
 * still happens at spaces.
 *
 * This is the one place per section where motion is allowed to be
 * conspicuous — it marks the start of a section, which is information.
 */
export function RevealWords({
  text,
  className = "",
  as: Tag = "h2",
  stagger = 0.055,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  stagger?: number;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag className={className}>
      <motion.span
        className="inline"
        variants={stage(stagger)}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.5 }}
        aria-label={text}
      >
        {words.map((w, i) => (
          <span
            key={i}
            aria-hidden
            className="inline-block overflow-hidden pb-[0.1em] align-bottom"
          >
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "110%" },
                shown: {
                  y: "0%",
                  transition: { duration: s(DUR.slow), ease: EASE.exit },
                },
              }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/**
 * Backwards-compatible single reveal.
 *
 * 31 call sites used the old `<Reveal delay={n}>`; they keep working and
 * inherit the new curve and throw. New work should reach for <Stage> +
 * <Rise> instead, which is why this is marked rather than removed —
 * a codemod across 8 files was not worth the churn for identical output.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: Common & { delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: s(DUR.base), ease: EASE.reveal, delay }}
    >
      {children}
    </motion.div>
  );
}
