'use client';

import { useIsMobile } from '@/lib/hooks/useIsMobile';

interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

/**
 * Circular Progress Indicator Component
 * Displays progress as a circular progress ring
 */
export function CircularProgress({
  progress,
  size = 80,
  strokeWidth = 8,
  showLabel = true,
  label,
  className = '',
}: CircularProgressProps) {
  const isMobile = useIsMobile();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        aria-label={label || `${clampedProgress}% complete`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-800"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-brand transition-all duration-700 ease-out circular-progress"
          style={{
            strokeDashoffset,
          }}
        />
      </svg>
      {/* Center label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-gray-900 dark:text-gray-100`}
          >
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
    </div>
  );
}
