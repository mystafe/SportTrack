'use client';

export function ActivityListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 skeleton"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 rounded skeleton" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded skeleton" />
                <div className="h-3 w-24 rounded skeleton" />
              </div>
            </div>
            <div className="h-6 w-16 rounded skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 skeleton">
      <div className="space-y-3">
        <div className="h-4 w-24 rounded skeleton" />
        <div className="h-8 w-32 rounded skeleton" />
        <div className="h-3 w-20 rounded skeleton" />
      </div>
    </div>
  );
}

export function StatsHighlightsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
}

