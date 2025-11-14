'use client';

export function ChartSkeleton() {
  return (
    <div className="w-full h-[300px] sm:h-[400px] flex items-center justify-center">
      <div className="w-full h-full rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 animate-pulse" />
    </div>
  );
}

