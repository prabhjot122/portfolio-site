import Link from "next/link";
import type { ReactNode } from "react";

/**
 * THE ACCENT RULE
 *
 * Colour appears in exactly one place on this site: a value that was
 * measured. Mono face, tabular figures, accent ink. Everything else —
 * headings, links, the email address — is ink.
 *
 * This replaces the previous sand→periwinkle gradient, which was applied
 * to six unrelated things and diluted itself into decoration.
 *
 * If you are reaching for this and the thing you are marking is not a
 * number that came from somewhere, it is the wrong component.
 */
export function Measured({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={`measured ${className}`}>{children}</span>;
}

/**
 * Link whose underline wipes in from the left on hover.
 * The rule is a child span rather than a border so it can transform
 * independently of the text.
 */
export function UnderlineLink({
  href,
  children,
  className = "",
  external = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const inner = (
    <>
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-current transition-transform duration-[var(--duration-quick)] ease-[var(--ease-exit)] group-hover:scale-x-100"
      />
    </>
  );

  const cls = `group relative inline-block py-1 text-ink-2 transition-colors duration-[var(--duration-instant)] hover:text-ink ${className}`;

  if (external) {
    return (
      <a href={href} className={cls} data-cursor="link">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} data-cursor="link">
      {inner}
    </Link>
  );
}

/**
 * Primary call to action: inked fill on the light ground.
 *
 * Rises on hover rather than fading — opacity fade was the audit's
 * laziest hover and it reads as the button switching off. Lift + a
 * deeper shadow reads as the button coming toward you, which is what
 * the light model says should happen.
 */
export function PillButton({
  href,
  children,
  size = "sm",
  className = "",
}: {
  href: string;
  children: ReactNode;
  size?: "sm" | "md";
  className?: string;
}) {
  const h = size === "md" ? "h-12 px-6 text-body-l" : "h-9 px-4 text-[15px]";
  return (
    <Link
      href={href}
      data-cursor="button"
      className={`on-ink lift-interactive group inline-flex ${h} items-center gap-2 rounded-full bg-ink leading-none text-surface-2 transition-transform duration-[var(--duration-base)] ease-[var(--ease-exit)] hover:-translate-y-0.5 active:translate-y-0 ${className}`}
    >
      {children}
    </Link>
  );
}

/** Outlined pill — secondary. */
export function PillGhost({
  children,
  onClick,
  label,
}: {
  children: ReactNode;
  onClick?: () => void;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      data-cursor="button"
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-hair-strong bg-surface px-3 text-micro tracking-[var(--tracking-micro)] text-ink-2 uppercase transition-colors duration-[var(--duration-instant)] hover:border-ink-3 hover:text-ink"
    >
      {children}
    </button>
  );
}

/** Section heading — the display size used across every page. */
export function Heading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h2 className={`display-l ${className}`}>{children}</h2>;
}

/** Small tracked uppercase label. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="micro">{children}</p>;
}
