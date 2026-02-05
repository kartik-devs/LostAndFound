export function ItemCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 animate-pulse">
      <div className="aspect-video rounded-xl bg-slate-800/60 mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-slate-800/60 rounded w-3/4" />
        <div className="h-3 bg-slate-800/60 rounded w-1/2" />
        <div className="flex justify-between items-center">
          <div className="h-6 bg-slate-800/60 rounded-full w-20" />
          <div className="h-3 bg-slate-800/60 rounded w-16" />
        </div>
      </div>
    </div>
  )
}

export function ItemGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <ItemCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-slate-800/60 rounded-lg" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-800/60 rounded w-16" />
          <div className="h-6 bg-slate-800/60 rounded w-12" />
          <div className="h-3 bg-slate-800/60 rounded w-20" />
        </div>
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 bg-slate-800/60 rounded w-20" />
        <div className="h-10 bg-slate-800/60 rounded-xl" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-800/60 rounded w-24" />
        <div className="h-10 bg-slate-800/60 rounded-xl" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-800/60 rounded w-28" />
        <div className="h-32 bg-slate-800/60 rounded-xl" />
      </div>
      <div className="h-10 bg-slate-800/60 rounded-xl w-32" />
    </div>
  )
}