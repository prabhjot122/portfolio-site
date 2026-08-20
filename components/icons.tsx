/**
 * Glyphs for the side rail.
 *
 * All 16x16 and all drawn in currentColor, so they inherit the
 * active/inactive text colour of their row.
 *
 * Every one is now a STROKE rather than a fill. A solid glyph is a
 * printed icon; a single continuous line at a constant weight is
 * something a hand made, and it is the same weight as the drawn borders
 * around them. The roughening filter goes on the whole svg here, which
 * is safe precisely because there is no text inside one — that is the
 * only place a filter may sit on a content box.
 */

type IconProps = { className?: string };

const base = "h-3.5 w-3.5 shrink-0 [filter:url(#sk-rough-1)]";

/** Shared stroke treatment: round joins, so lines end like a pencil. */
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function HomeIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={`${base} ${className}`} {...stroke}>
      <path d="M2.1 6.5 8 1.9l5.9 4.6v6.3a.9.9 0 0 1-.9.9H3a.9.9 0 0 1-.9-.9V6.5Z" />
      <path d="M6.3 13.7V9.5h3.4v4.2" />
    </svg>
  );
}

export function UserIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={`${base} ${className}`} {...stroke}>
      <circle cx="8" cy="5.2" r="2.9" />
      <path d="M2.4 13.8c0-2.6 2.5-4.2 5.6-4.2s5.6 1.6 5.6 4.2" />
    </svg>
  );
}

export function FolderIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={`${base} ${className}`} {...stroke}>
      <path d="M1.8 4.4a.9.9 0 0 1 .9-.9h3.2l1.4 1.7h6a.9.9 0 0 1 .9.9v6.4a.9.9 0 0 1-.9.9H2.7a.9.9 0 0 1-.9-.9V4.4Z" />
    </svg>
  );
}

export function LayersIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={`${base} ${className}`} {...stroke}>
      <path d="M8 1.7 14.5 5 8 8.3 1.5 5 8 1.7Z" />
      <path d="M1.5 8.2 8 11.5l6.5-3.3" />
      <path d="M1.5 11.2 8 14.5l6.5-3.3" />
    </svg>
  );
}

export function BoltIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={`${base} ${className}`} {...stroke}>
      <path d="M9.4 1.5 3.6 8.8h3.5l-.6 5.7 5.9-7.6H8.8l.6-5.4Z" />
    </svg>
  );
}

export function PersonIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={`${base} ${className}`} {...stroke}>
      <circle cx="6" cy="5.1" r="2.6" />
      <path d="M1.3 13.8c0-2.4 2.1-3.9 4.7-3.9s4.7 1.5 4.7 3.9" />
      <path d="M11.2 3.1a2.4 2.4 0 0 1 0 4.6" />
      <path d="M12.3 10.4c1.5.5 2.4 1.6 2.4 3.1" />
    </svg>
  );
}

/** A path with two stops on it — the engagement pipeline. */
export function RouteIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={`${base} ${className}`} {...stroke}>
      <circle cx="3.6" cy="3.6" r="1.9" />
      <circle cx="12.4" cy="12.4" r="1.9" />
      <path d="M5.5 3.6h4a2.6 2.6 0 0 1 0 5.2h-3a2.6 2.6 0 0 0 0 5.2h4" />
    </svg>
  );
}

export function QuestionIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={`${base} ${className}`} {...stroke}>
      <circle cx="8" cy="8" r="6.4" />
      <path d="M6.2 6.3a1.9 1.9 0 1 1 2.6 1.8c-.5.2-.8.6-.8 1.2v.3" />
      <path d="M8 12.1v.1" />
    </svg>
  );
}

/**
 * Brand marks. These stay as fills — a logo is a specific shape and
 * redrawing GitHub's octocat as an outline makes it unrecognisable,
 * which costs more than the consistency is worth. They still take the
 * roughening, so they read as traced rather than pasted.
 */
export function GitHubIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={`${base} ${className}`}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
      />
    </svg>
  );
}

export function LinkedInIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

export function CopyIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`h-3.5 w-3.5 shrink-0 [filter:url(#sk-rough-1)] ${className}`}
      {...stroke}
    >
      <rect x="1.8" y="5.4" width="8.8" height="8.8" rx="1.4" />
      <path d="M5.4 3.2V3a1.4 1.4 0 0 1 1.4-1.4h6.4A1.4 1.4 0 0 1 14.6 3v6.4a1.4 1.4 0 0 1-1.4 1.4H13" />
    </svg>
  );
}

export function CheckIcon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`h-3.5 w-3.5 shrink-0 [filter:url(#sk-rough-1)] ${className}`}
      {...stroke}
    >
      <path d="M2.6 8.4 6.2 12l7.2-8" />
    </svg>
  );
}

export const NAV_ICONS = {
  home: HomeIcon,
  user: UserIcon,
  folder: FolderIcon,
  layers: LayersIcon,
  bolt: BoltIcon,
  person: PersonIcon,
  route: RouteIcon,
  question: QuestionIcon,
} as const;

export type NavIconKey = keyof typeof NAV_ICONS;
