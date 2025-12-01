'use client';

import React from 'react';
import { designTokens } from '@/lib/design-tokens';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

export interface LoadingSpinnerProps {
  /**
   * Spinner size
   * @default 'md'
   */
  size?: SpinnerSize;

  /**
   * Spinner variant color
   * @default 'primary'
   */
  variant?: SpinnerVariant;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Label for accessibility
   */
  'aria-label'?: string;
}

const sizeStyles: Record<SpinnerSize, { width: string; height: string; borderWidth: string }> = {
  sm: {
    width: 'w-4',
    height: 'h-4',
    borderWidth: 'border-2',
  },
  md: {
    width: 'w-6',
    height: 'h-6',
    borderWidth: 'border-2',
  },
  lg: {
    width: 'w-8',
    height: 'h-8',
    borderWidth: 'border-3',
  },
};

const variantStyles: Record<SpinnerVariant, string> = {
  primary: 'border-brand border-t-transparent shadow-lg shadow-brand/20',
  secondary: 'border-gray-400 border-t-transparent dark:border-gray-500 shadow-md',
  success: 'border-success border-t-transparent shadow-lg shadow-success/20',
  warning: 'border-warning border-t-transparent shadow-lg shadow-warning/20',
  error: 'border-error border-t-transparent shadow-lg shadow-error/20',
};

/**
 * LoadingSpinner Component
 *
 * A circular loading spinner with multiple sizes and color variants.
 * Follows design system tokens and accessibility best practices.
 *
 * @example
 * ```tsx
 * <LoadingSpinner size="md" variant="primary" />
 * <LoadingSpinner size="sm" variant="success" aria-label="Loading..." />
 * ```
 */
export const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  (
    {
      size = 'md',
      variant = 'primary',
      className = '',
      'aria-label': ariaLabel = 'Loading...',
      ...props
    },
    ref
  ) => {
    const sizeConfig = sizeStyles[size];
    const variantStyle = variantStyles[variant];

    const spinnerClasses = `
      ${sizeConfig.width}
      ${sizeConfig.height}
      ${sizeConfig.borderWidth}
      ${variantStyle}
      rounded-full
      animate-spin
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ');

    return (
      <div
        ref={ref}
        className={spinnerClasses}
        role="status"
        aria-label={ariaLabel}
        aria-live="polite"
        {...props}
      >
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
