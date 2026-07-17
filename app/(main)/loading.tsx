import { Skeleton } from "@/components/ui/skeleton";

export default function MainLayoutLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ── Header Area ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-white/5 bg-warm-800/20"
          >
            <Skeleton className="h-4 w-20 mb-3" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* ── Main Content Area ── */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-8 w-48 mb-4" />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-white/5 bg-warm-800/20 flex gap-4"
            >
              <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="p-6 rounded-2xl border border-white/5 bg-warm-800/20 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-2/3 mb-1" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
