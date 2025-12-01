'use client';

import { memo } from 'react';

export const ActivityListSkeleton = memo(function ActivityListSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading activities">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="glass-effect card-3d rounded-xl border-2 border-white/20 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-4 shadow-lg skeleton animate-pulse"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
                <div className="h-4 w-24 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
              </div>
            </div>
            <div className="h-7 w-20 rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
});

export const StatsCardSkeleton = memo(function StatsCardSkeleton() {
  return (
    <div
      className="glass-effect card-3d rounded-xl border-2 border-white/20 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-4 shadow-lg skeleton animate-pulse"
      role="status"
      aria-label="Loading stats"
    >
      <div className="space-y-3">
        <div className="h-4 w-24 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
        <div className="h-8 w-32 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
        <div className="h-3 w-20 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
      </div>
    </div>
  );
});

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
    <div className="glass-effect card-3d rounded-xl border-2 border-white/20 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-4 sm:p-6 shadow-lg skeleton animate-pulse">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
          <div className="h-5 w-16 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
        </div>
        <div className="h-4 w-full rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
        <div className="h-4 w-3/4 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-brand/40 via-brand/60 to-brand/40 rounded-full skeleton shimmer progress-bar-glow" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
          <div className="h-8 w-20 rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
        </div>
      </div>
    </div>
  );
}

export function BadgeCardSkeleton() {
  return (
    <div className="glass-effect card-3d rounded-xl border-2 border-white/20 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-3 sm:p-4 shadow-lg skeleton animate-pulse">
      <div className="space-y-3">
        <div className="h-12 w-12 mx-auto rounded-lg bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
        <div className="h-5 w-full rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
        <div className="h-4 w-3/4 mx-auto rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
        <div className="flex items-center justify-between">
          <div className="h-5 w-16 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
          <div className="h-4 w-12 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg w-1/3 skeleton shimmer" />
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg w-1/2 skeleton shimmer" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-effect card-3d w-full h-64 rounded-lg border-2 border-white/20 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-4 shadow-lg skeleton animate-pulse">
      <div className="space-y-3">
        <div className="h-4 w-32 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
        <div className="h-48 w-full rounded bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
          <div className="h-3 w-20 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
        </div>
      </div>
    </div>
  );
}

export function WidgetSkeleton() {
  return (
    <div className="glass-effect card-3d rounded-xl border-2 border-white/20 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-3 sm:p-4 shadow-lg skeleton animate-pulse">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="h-8 w-8 rounded bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
        <div className="h-4 w-20 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
        <div className="h-6 w-16 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
        <div className="h-3 w-24 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
      </div>
    </div>
  );
}

export function AccordionSkeleton() {
  return (
    <div className="glass-effect card-3d rounded-xl border-2 border-white/20 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl overflow-hidden shadow-lg skeleton animate-pulse">
      <div className="p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="h-6 w-6 rounded bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
          <div className="h-5 w-32 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
        </div>
        <div className="h-5 w-5 rounded bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 skeleton shimmer" />
      </div>
    </div>
  );
}
