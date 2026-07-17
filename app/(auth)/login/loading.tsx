import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <div className="min-h-screen flex" style={{ background: "#1c1917" }}>
      {/* ── Left Panel Skeleton ── */}
      <div
        className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden"
        style={{
          background: "linear-gradient(150deg, #1c1917 0%, #0c0a09 60%, #1a100a 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="relative z-10 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>

        <div className="relative z-10 max-w-md">
          <Skeleton className="h-14 w-3/4 mb-4" />
          <Skeleton className="h-14 w-1/2 mb-10" />

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                <div className="w-full">
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-3 w-5/6 mb-1" />
                  <Skeleton className="h-3 w-4/6" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Skeleton className="h-12 w-3/4" />
      </div>

      {/* ── Right Panel Skeleton ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12">
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <Skeleton className="h-12 w-full rounded-xl mb-6" />

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <Skeleton className="h-3 w-20" />
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="space-y-5">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl mt-6" />
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center">
            <Skeleton className="h-4 w-1/3 mb-4" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
