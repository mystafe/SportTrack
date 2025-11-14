'use client';

export function ActivityListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 skeleton"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg skeleton" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 rounded skeleton" />
                <div className="h-4 w-24 rounded skeleton" />
              </div>
            </div>
            <div className="h-7 w-20 rounded-lg skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 skeleton">
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

export function ChallengeCardSkeleton() {
  return (
    <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 skeleton">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 rounded skeleton" />
          <div className="h-5 w-16 rounded skeleton" />
        </div>
        <div className="h-4 w-full rounded skeleton" />
        <div className="h-4 w-3/4 rounded skeleton" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-gray-300 dark:bg-gray-700 rounded-full skeleton" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 rounded skeleton" />
          <div className="h-8 w-20 rounded-lg skeleton" />
        </div>
      </div>
    </div>
  );
}

export function BadgeCardSkeleton() {
  return (
    <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-3 sm:p-4 skeleton">
      <div className="space-y-3">
        <div className="h-12 w-12 mx-auto rounded-lg skeleton" />
        <div className="h-5 w-full rounded skeleton" />
        <div className="h-4 w-3/4 mx-auto rounded skeleton" />
        <div className="flex items-center justify-between">
          <div className="h-5 w-16 rounded-full skeleton" />
          <div className="h-4 w-12 rounded skeleton" />
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/3 skeleton" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/2 skeleton" />
      </div>
    </div>
  );
}
