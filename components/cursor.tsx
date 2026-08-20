"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cursor.
 *
 * A state machine with two bodies and one loop — not a pile of hover
 * handlers.
 *
 *   ring   trails the pointer with inertia and is the part that carries
 *          state. It is what gets magnetised.
 *   dot    tracks the pointer exactly. It is the thing you actually aim
 *          with, so it never lags and never lies about where the click
 *          will land.
 *
 * State comes from one delegated `pointerover` listener reading
 * `[data-cursor]` off the nearest ancestor, so adding a new interactive
 * element is a markup change and never a listener.
 *
 * Form:
 * the ring is a circle drawn in pencil — the same roughened loop the
 * side rail throws around the current section. That is the whole idea:
 * the cursor is the pencil those marks came from, so circling something
 * to say "this one" is a gesture the page and the pointer share.
 *
 * Guarantees, all of them load-bearing:
 *   - never mounts on coarse/touch pointers, and tears itself down if
 *     the device switches
 *   - `pointer-events: none` on every layer, so it cannot eat a click
 *   - hides entirely over text inputs and while text is selected, so it
 *     never sits on top of a caret
 *   - hides when the pointer leaves the window
 *   - transform and opacity only; one rAF; disposed on unmount
 */

type CursorState = "default" | "link" | "button" | "view" | "copy" | "hidden";

/** Ring scale per state. The dot never scales. */
const RING: Record<CursorState, number> = {
  default: 1,
  link: 1.7,
  button: 2.1,
  view: 2.6,
  copy: 2.1,
  hidden: 0.4,
};

const LABEL: Partial<Record<CursorState, string>> = {
  view: "View",
  copy: "Copy",
};

/** How hard the ring is pulled toward a magnetic target's centre. */
const MAGNET = 0.32;
/** Ring follow rate. Lower is looser. */
const EASE_RING = 0.16;

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("default");

  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  // Everything the loop needs lives in refs — the loop must never be a
  // reason to re-render.
  const pointer = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const magnet = useRef<{ x: number; y: number } | null>(null);
  const visible = useRef(false);

  /* ---- mount only for fine pointers ---- */
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* ---- hide the native cursor only while ours is actually running ---- */
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  /* ---- the loop ---- */
  useEffect(() => {
    if (!enabled) return;

    let frame = 0;

    /*
      The loop parks itself.

      It used to hold a requestAnimationFrame open for the life of the
      page and write two transforms on every single frame, whether or
      not the pointer had moved — and a stationary pointer is the normal
      state of a page someone is reading. Each of those writes dirties a
      composited layer, so the cost was paid by the compositor at full
      refresh rate for no movement at all.

      Now the loop stops as soon as the ring has caught up with the
      pointer, and any input that can move either body starts it again.
      Nothing about the motion changes: the last frame before parking is
      still written, so both bodies are committed at their final
      position.
    */
    let parked = false;
    const kick = () => {
      if (!parked) return;
      parked = false;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      if (!visible.current) {
        visible.current = true;
        // Jump the ring on first sight so it does not fly in from 0,0.
        ringPos.current.x = e.clientX;
        ringPos.current.y = e.clientY;
      }
      kick();
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el || typeof el.closest !== "function") return;

      // Never sit over a caret.
      if (el.closest("input, textarea, select, [contenteditable='true']")) {
        setState("hidden");
        magnet.current = null;
        return;
      }

      const target = el.closest<HTMLElement>("[data-cursor]");
      if (!target) {
        setState("default");
        magnet.current = null;
        return;
      }

      const next = (target.dataset.cursor as CursorState) || "default";
      setState(next);

      // Only compact controls are magnetic. Pulling the ring toward the
      // centre of a large card would drag it somewhere the pointer is
      // demonstrably not, which reads as broken rather than tactile.
      const r = target.getBoundingClientRect();
      magnet.current =
        r.width <= 260 && r.height <= 120
          ? { x: r.left + r.width / 2, y: r.top + r.height / 2 }
          : null;

      // A new magnet moves the ring's target without the pointer having
      // moved, so the loop has to be running to carry it there.
      kick();
    };

    const onLeaveWindow = () => {
      visible.current = false;
      setState("hidden");
    };
    const onEnterWindow = () => {
      visible.current = true;
      setState("default");
    };

    // A live selection means the user is working with text; get out of
    // the way until it collapses.
    const onSelect = () => {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) setState("hidden");
    };

    const tick = () => {
      const p = pointer.current;

      // Target for the ring: the pointer, pulled toward a magnetic
      // centre when one is in play.
      let tx = p.x;
      let ty = p.y;
      const m = magnet.current;
      if (m) {
        tx += (m.x - p.x) * MAGNET;
        ty += (m.y - p.y) * MAGNET;
      }

      const dx = tx - ringPos.current.x;
      const dy = ty - ringPos.current.y;
      ringPos.current.x += dx * EASE_RING;
      ringPos.current.y += dy * EASE_RING;

      if (ring.current) {
        ring.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (dot.current) {
        dot.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
      }

      // Caught up. The remaining travel is a twentieth of a pixel, which
      // is not worth holding the compositor open for.
      if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
        parked = true;
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeaveWindow);
    document.addEventListener("pointerenter", onEnterWindow);
    document.addEventListener("selectionchange", onSelect);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeaveWindow);
      document.removeEventListener("pointerenter", onEnterWindow);
      document.removeEventListener("selectionchange", onSelect);
    };
  }, [enabled]);

  if (!enabled) return null;

  const hidden = state === "hidden";
  const label = LABEL[state];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      {/* ring / reticle */}
      <div
        ref={ring}
        className="pointer-events-none fixed top-0 left-0 will-change-transform"
      >
        <div
          className="relative flex h-6 w-6 items-center justify-center transition-[opacity,scale] duration-[var(--duration-quick)] ease-[var(--ease-settle)]"
          style={{
            scale: String(RING[state]),
            opacity: hidden ? 0 : 1,
          }}
        >
          {/* Two loops, not one. A single pass reads as a vector circle
              however hard it wobbles; a second, slightly offset pass is
              what someone does when they circle a thing on paper, and it
              is the detail that sells the whole cursor. */}
          <span className="absolute inset-0 rounded-full border-[1.5px] border-accent [filter:url(#sk-rough-2)]" />
          <span className="absolute inset-[2px] rounded-full border border-accent opacity-55 [filter:url(#sk-rough-1)]" />
        </div>

        {label && (
          <span
            className="measured absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-4 text-[0.5rem] tracking-[0.14em] whitespace-nowrap uppercase"
            style={{ opacity: hidden ? 0 : 1 }}
          >
            {label}
          </span>
        )}
      </div>

      {/* dot — the true pointer position, and the point of the pencil */}
      <div
        ref={dot}
        className="pointer-events-none fixed top-0 left-0 will-change-transform"
      >
        <div
          className="h-[5px] w-[5px] rounded-full bg-ink transition-opacity duration-[var(--duration-instant)]"
          style={{ opacity: hidden ? 0 : 1 }}
        />
      </div>
    </div>
  );
}
