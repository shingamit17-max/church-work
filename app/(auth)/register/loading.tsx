import { Skeleton } from "@/components/ui/skeleton";

export default function RegisterLoading() {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-6"
      style={{ background: "#1c1917" }}
    >
      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>

        <div
          className="p-8 rounded-2xl"
          style={{
            background: "rgba(41,37,36,0.8)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="mb-7">
            <Skeleton className="h-8 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          <div className="space-y-5">
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>

            <Skeleton className="h-12 w-full rounded-xl mt-6" />
          </div>
        </div>
        
        <div className="flex justify-center mt-6">
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </div>
  );
}
