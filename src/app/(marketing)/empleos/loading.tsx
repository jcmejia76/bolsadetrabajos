import { Skeleton } from "@/components/ui/skeleton";

export default function EmpleosLoading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <Skeleton className="hidden h-96 rounded-2xl lg:block" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
