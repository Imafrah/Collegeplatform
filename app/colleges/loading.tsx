export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 h-12 animate-pulse rounded-xl bg-slate-200" />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="h-72 animate-pulse rounded-xl bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-56 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      </div>
    </div>
  );
}

