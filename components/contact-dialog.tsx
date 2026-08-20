"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/lib/content";

/**
 * Single dialog, mounted once at the app root. `Book a Call` / `Get in
 * touch` triggers all over the chrome (side rail, header, CTAs) call
 * `open()` from context rather than routing to a page - there is no
 * standalone /contact route any more.
 */
type ContactDialogContextValue = { open: () => void };

const ContactDialogContext = createContext<ContactDialogContextValue | null>(
  null,
);

export function useContactDialog() {
  const ctx = useContext(ContactDialogContext);
  if (!ctx) {
    throw new Error("useContactDialog must be used within ContactDialogProvider");
  }
  return ctx;
}

export function ContactDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <ContactDialogContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {isOpen && <ContactDialog onClose={close} />}
      </AnimatePresence>
    </ContactDialogContext.Provider>
  );
}

/** Same pill treatment used by the rail's "Book a Call" and header CTAs. */
export function ContactTriggerButton({
  children,
  size = "sm",
  className = "",
}: {
  children: ReactNode;
  size?: "sm" | "md";
  className?: string;
}) {
  const { open } = useContactDialog();
  const h = size === "md" ? "h-12 px-6 text-body-l" : "h-9 px-4 text-[15px]";
  return (
    <button
      onClick={open}
      data-cursor="button"
      className={`ink-blob on-ink lift-interactive group inline-flex ${h} items-center gap-2 rounded-full leading-none text-surface-2 transition-transform duration-[var(--duration-base)] ease-[var(--ease-exit)] hover:-translate-y-0.5 active:translate-y-0 ${className}`}
    >
      {children}
    </button>
  );
}

function ContactDialog({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [request, setRequest] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileNames(Array.from(e.target.files ?? []).map((f) => f.name));
  };

  // No backend behind this form - submitting hands the message to the
  // visitor's own mail client rather than pretending to send it somewhere.
  // Browsers cannot attach local files to a mailto: link, so selected
  // files are named in the body as a reminder to attach them by hand.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Project enquiry from ${name || "your site"}`,
    );
    const lines = [
      request,
      fileNames.length ? `\nAttachments to add: ${fileNames.join(", ")}` : "",
    ].filter(Boolean);
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center px-5"
      initial="hidden"
      animate="shown"
      exit="hidden"
    >
      {/* Hatch, not blur. The page behind is a drawing, and the way to
          push a drawing back is to shade over it. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-ground/70"
        variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        <span className="hatch absolute inset-0 !opacity-40" />
      </motion.div>

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Get in touch"
        // The scroll lives on the inner element: `overflow-y-auto` here
        // would clip this panel's own drawn border straight.
        className="lift-lg relative z-10 w-full max-w-[28rem] rounded"
        variants={{
          hidden: { opacity: 0, y: 16, scale: 0.98 },
          shown: { opacity: 1, y: 0, scale: 1 },
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-h-[calc(100vh-3rem)] overflow-y-auto p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="display-m">Get in touch</h2>
            <p className="mt-2 text-[13px] leading-[1.5] text-ink-2">
              Tell us what you need and attach anything useful - we&rsquo;ll
              get back to you.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            data-cursor="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-3 transition-colors duration-[var(--duration-instant)] hover:bg-surface hover:text-ink"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M2 2l12 12M14 2 2 14" />
            </svg>
          </button>
        </div>

        {sent ? (
          <div className="ink-outline mt-8 rounded-sm bg-surface p-4 text-[14px] leading-[1.5] text-ink-2">
            Your email client should be opening now, addressed to us. If
            nothing happened, reach us directly at{" "}
            <a
              href={`mailto:${site.email}`}
              data-cursor="copy"
              className="text-ink underline decoration-hair-strong underline-offset-2 hover:text-accent"
            >
              {site.email}
            </a>
            .
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-ink-2">
              Name
              {/*
                The drawn border lives on a wrapper, never on the field.
                Pseudo-elements do not render on replaced elements like
                <input>, and putting the filter on the field itself
                would displace whatever the visitor typed.
              */}
              <span className="ink-outline block rounded-sm bg-surface">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-transparent px-3 py-2.5 text-[14px] text-ink outline-none placeholder:text-ink-3"
                />
              </span>
            </label>

            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-ink-2">
              What do you need?
              <span className="ink-outline block rounded-sm bg-surface">
                <textarea
                  required
                  rows={4}
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  placeholder="Tell us about the project, timeline, or question"
                  className="block w-full resize-none bg-transparent px-3 py-2.5 text-[14px] text-ink outline-none placeholder:text-ink-3"
                />
              </span>
            </label>

            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-ink-2">
              Attachments (cover letter, brief, etc.)
              <span className="ink-outline block rounded-sm bg-surface">
                <input
                  type="file"
                  multiple
                  onChange={handleFiles}
                  className="w-full bg-transparent px-3 py-2.5 text-[13px] text-ink-2 outline-none file:mr-3 file:rounded-full file:border file:border-hair-strong file:bg-surface-2 file:px-3 file:py-1 file:text-[12px] file:font-medium file:text-ink"
                />
              </span>
              {fileNames.length > 0 && (
                <span className="text-[12px] text-ink-3">
                  {fileNames.join(", ")}
                </span>
              )}
            </label>

            <button
              type="submit"
              data-cursor="button"
              className="ink-blob on-ink lift-interactive mt-2 rounded-full py-3 text-center text-[15px] font-medium text-surface-2 transition-transform duration-[var(--duration-base)] ease-[var(--ease-exit)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Send
            </button>

            <p className="text-center text-[12px] text-ink-3">
              Prefer email? Reach us directly at{" "}
              <a
                href={`mailto:${site.email}`}
                data-cursor="copy"
                className="text-ink-2 underline decoration-hair-strong underline-offset-2 hover:text-ink"
              >
                {site.email}
              </a>
            </p>
          </form>
        )}
        </div>
      </motion.div>
    </motion.div>
  );
}
