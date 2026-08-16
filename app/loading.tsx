/**
 * Route-level loading state.
 *
 * Not a spinner. The page's own frame is drawn immediately — the title
 * block's proportions, the rule, the meta row — and only the parts that
 * depend on data are left blank. The result is that the layout does not
 * move when content arrives, which is the actual job: this file exists
 * to hold CLS at zero, not to entertain.
 *
 * Skeletons breathe on opacity only, so this costs one compositor
 * layer and nothing on the main thread. Under reduced motion the
 * global rule in globals.css flattens the pulse and it simply reads as
 * a quiet placeholder.
 */
export default function Loading() {
  return (
    <section
      className="px-5 pt-32 pb-24 md:px-10 md:pt-[8.75rem]"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading</span>
      <div className="mx-auto max-w-[89.5rem]">
        <div className="flex flex-col gap-5">
          <Bar className="h-[clamp(2.25rem,4.6vw,4.5rem)] w-[min(20ch,70%)]" />
          <Bar className="h-[clamp(2.25rem,4.6vw,4.5rem)] w-[min(13ch,48%)]" />
        </div>

        <div className="mt-10 flex flex-col gap-3">
          <Bar className="h-4 w-[min(44ch,90%)]" />
          <Bar className="h-4 w-[min(36ch,74%)]" />
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 border-t border-hair pt-8 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2.5">
              <Bar className="h-2.5 w-14" />
              <Bar className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Bar({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`block animate-pulse rounded-sm bg-hair/70 ${className}`}
    />
  );
}
