'use client';

export function ChartSkeleton() {
  return (
    <div className="w-full h-[300px] sm:h-[400px] flex items-center justify-center">
      <div className="w-full h-full rounded-lg glass-effect card-3d bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-white/20 dark:border-gray-700/50 shadow-lg animate-pulse" />
    </div>
  );
}
