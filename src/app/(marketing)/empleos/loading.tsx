import { Skeleton } from "@/components/ui/skeleton";

export default function EmpleosLoading() {
  return (
    <div className="flex h-[calc(100dvh-127px)] flex-col md:h-[calc(100dvh-83px)] md:flex-row lg:h-[calc(100dvh-135px)]">
      <div className="flex min-h-0 flex-col gap-4 border-border p-4 sm:p-6 md:w-[45%] md:border-r lg:w-[42%]">
        <Skeleton className="h-6 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="hidden flex-1 md:block">
        <Skeleton className="size-full rounded-none" />
      </div>
    </div>
  );
}
