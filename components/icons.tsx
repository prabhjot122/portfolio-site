/**
 * Small solid glyphs for the side rail. All 16x16, drawn in currentColor
 * so they inherit the active/inactive text colour of their row.
 */

type IconProps = { className?: string };

const base = "h-3.5 w-3.5 shrink-0";

export function HomeIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={`${base} ${className}`}>
      <path d="M7.4 1.3a1 1 0 0 1 1.2 0l5.6 4.2a1 1 0 0 1 .4.8v7.2a1 1 0 0 1-1 1h-3.4v-4H6v4H2.4a1 1 0 0 1-1-1V6.3a1 1 0 0 1 .4-.8l5.6-4.2Z" />
    </svg>
  );
}

export function UserIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={`${base} ${className}`}>
      <circle cx="8" cy="4.6" r="3.2" />
      <path d="M8 9.4c-3.2 0-5.6 1.9-5.6 3.6v.8a1 1 0 0 0 1 1h9.2a1 1 0 0 0 1-1V13c0-1.7-2.4-3.6-5.6-3.6Z" />
    </svg>
  );
}

export function FolderIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={`${base} ${className}`}>
      <path d="M1.4 7.2c0-1 .8-1.8 1.8-1.8h9.6c1 0 1.8.8 1.8 1.8v5a1.8 1.8 0 0 1-1.8 1.8H3.2a1.8 1.8 0 0 1-1.8-1.8v-5Z" />
      <rect x="2.7" y="3.2" width="10.6" height="1.3" rx=".65" />
      <rect x="4" y="1.3" width="8" height="1.3" rx=".65" />
    </svg>
  );
}

export function LayersIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={`${base} ${className}`}>
      <path d="M7.5.9a1.3 1.3 0 0 1 1.1 0l6 2.6c.4.2.4.9 0 1.1l-6 2.6a1.3 1.3 0 0 1-1.1 0l-6-2.6c-.4-.2-.4-.9 0-1.1l6-2.6Z" />
      <path d="M2.9 6.8a1.3 1.3 0 0 0-1 0l-1 .5c-.4.1-.4.7 0 .8l6.6 2.8c.3.1.6.1.9 0l6.6-2.8c.3-.1.3-.7 0-.8l-1.1-.5a1.3 1.3 0 0 0-1 0L8.5 8.6a1.9 1.9 0 0 1-1.2 0L2.9 6.8Z" />
      <path d="M2.9 10.5a1.3 1.3 0 0 0-1 0l-1 .5c-.4.1-.4.7 0 .8l6.6 2.8c.3.1.6.1.9 0l6.6-2.8c.3-.1.3-.7 0-.8l-1.1-.5a1.3 1.3 0 0 0-1 0l-4.4 1.9a1.9 1.9 0 0 1-1.2 0l-4.4-1.9Z" />
    </svg>
  );
}

export function BoltIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 10 16" fill="currentColor" className={`${base} ${className}`}>
      <path d="M3.5 9.4c-.8 0-1.5 0-2.2 0-1 0-1.4-.5-1.3-1.4C.4 5.7.8 3.4 1.1 1a1.1 1.1 0 0 1 1.3-1h3.6c1 0 1.4.6 1.1 1.6-.4 1.3-.9 2.6-1.4 4h3c1.5 0 1.9.8 1.2 2-1.5 2.5-3 5-4.6 7.4-.4.6-.8 1.2-1.6 1-.8-.3-.8-.9-.7-1.6l.5-5Z" />
    </svg>
  );
}

export function PersonIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={`${base} ${className}`}>
      <circle cx="5.6" cy="5" r="2.9" />
      <path d="M5.6 9c-2.9 0-5 1.7-5 3.3v.6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-.6C10.6 10.7 8.5 9 5.6 9Z" />
      <path d="M11.6 3.1a2.4 2.4 0 1 1 0 4.8 3.9 3.9 0 0 0 0-4.8ZM11.8 9.2c2.1.3 3.6 1.7 3.6 3v.5a1 1 0 0 1-1 1h-2.2c.1-.3.2-.6.2-1v-.6c0-1.1-.3-2.1-.6-2.9Z" />
    </svg>
  );
}

export function QuestionIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={`${base} ${className}`}>
      <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm-.66 9.1c0-.88.4-1.5 1.2-1.88a1.5 1.5 0 0 0 .8-1.3 1.35 1.35 0 0 0-2.68.15c-.03.35-.32.6-.68.59a.66.66 0 0 1-.62-.66 2.68 2.68 0 1 1 3.96 2.4c-.35.17-.51.4-.5.74v.09a.66.66 0 0 1-1.32-.06l-.16-.07Zm.66 2.24a.66.66 0 1 1 0 1.32.66.66 0 0 1 0-1.32Z" />
    </svg>
  );
}

export function CopyIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 13 13" fill="currentColor" className={`h-3 w-3 shrink-0 ${className}`}>
      <path d="M0 8.26c0-1.15 0-2.3 0-3.46a1.25 1.25 0 0 1 1.26-1.25h6.93A1.25 1.25 0 0 1 9.45 4.8v6.95A1.25 1.25 0 0 1 8.2 13H1.26A1.25 1.25 0 0 1 0 11.74V8.26Z" />
      <path d="M8.28 0h3.49A1.24 1.24 0 0 1 13 1.27v6.92a1.26 1.26 0 0 1-1.26 1.26h-.47c-.4 0-.64-.24-.64-.65V4.47a2.1 2.1 0 0 0-1.12-1.88 2 2 0 0 0-1-.22H4.26c-.49 0-.71-.22-.71-.72 0-.24 0-.48.03-.71A1.24 1.24 0 0 1 4.79 0h3.49Z" />
    </svg>
  );
}

export function CheckIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 14 14" fill="currentColor" className={`h-3 w-3 shrink-0 ${className}`}>
      <path d="M5.94 10.43 10.28 6.1a.9.9 0 0 0-1.28-1.27L6.33 7.5a.15.15 0 0 1-.22 0L5.12 6.5a.9.9 0 1 0-1.27 1.28l1.65 1.65a.75.75 0 0 0 1.07 0Z" />
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
  question: QuestionIcon,
} as const;

export type NavIconKey = keyof typeof NAV_ICONS;
