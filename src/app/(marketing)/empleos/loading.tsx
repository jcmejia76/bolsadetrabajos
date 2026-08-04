import { Skeleton } from "@/components/ui/skeleton";

export default function EmpleosLoading() {
  return (
    <div className="flex h-[calc(100dvh-82px)] flex-col md:flex-row">
      <div className="flex min-h-0 flex-col gap-4 border-border p-4 sm:p-6 md:w-[45%] md:border-r lg:w-[42%]">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
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
