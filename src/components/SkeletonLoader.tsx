'use client';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-foreground/10 rounded-2xl ${className}`}
    />
  );
}

export function BirthdayCardSkeleton() {
  return (
    <div className="rounded-3xl p-8 border border-border/60 bg-card/40 backdrop-blur-sm flex flex-col justify-between h-[280px] space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-3/4 rounded-xl" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
        </div>
        <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-8 w-28 rounded-full" />
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
    </div>
  );
}

export function GridSkeletonLoader({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BirthdayCardSkeleton key={i} />
      ))}
    </div>
  );
}

