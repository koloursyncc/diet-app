export function LoadingSkeleton() {
  return (
    <div
      className="flex h-full w-full flex-col justify-center rounded-3xl border border-border bg-card px-8 py-14 shadow-card"
      aria-label="Loading today's meals"
      aria-busy="true"
      role="status"
    >
      <div className="skeleton-shimmer mb-5 h-3 w-24 animate-shimmer rounded-full" />
      <div className="skeleton-shimmer h-11 w-4/5 animate-shimmer rounded-xl" />
      <div className="skeleton-shimmer mt-3 h-11 w-2/3 animate-shimmer rounded-xl" />
      <div className="skeleton-shimmer mt-5 h-4 w-1/3 animate-shimmer rounded-full" />
      <div className="skeleton-shimmer mt-8 h-3 w-full max-w-xs animate-shimmer rounded-full" />
      <div className="skeleton-shimmer mt-2 h-3 w-4/5 max-w-xs animate-shimmer rounded-full" />
      <span className="sr-only">Loading today's meals…</span>
    </div>
  );
}
