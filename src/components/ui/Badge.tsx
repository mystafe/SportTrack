'use client';

import React from 'react';
import { designTokens } from '@/lib/design-tokens';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Badge variant style
   * @default 'default'
   */
  variant?: BadgeVariant;

  /**
   * Badge size
   * @default 'md'
   */
  size?: BadgeSize;

  /**
   * Show as dot (no text)
   * @default false
   */
  dot?: boolean;

  /**
   * Badge content
   */
  children?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: `
    bg-gray-100 dark:bg-gray-800
    text-gray-700 dark:text-gray-300
  `,
  primary: `
    bg-primary-100 dark:bg-primary-900/30
    text-primary-700 dark:text-primary-300
  `,
  success: `
    bg-success-100 dark:bg-success-900/30
    text-success-700 dark:text-success-300
  `,
  warning: `
    bg-warning-100 dark:bg-warning-900/30
    text-warning-700 dark:text-warning-300
  `,
  error: `
    bg-error-100 dark:bg-error-900/30
    text-error-700 dark:text-error-300
  `,
  info: `
    bg-info-100 dark:bg-info-900/30
    text-info-700 dark:text-info-300
  `,
};

const sizeStyles: Record<BadgeSize, { padding: string; fontSize: string; dotSize: string }> = {
  sm: {
    padding: 'px-1.5 py-0.5',
    fontSize: 'text-xs',
    dotSize: 'w-1.5 h-1.5',
  },
  md: {
    padding: 'px-2 py-1',
    fontSize: 'text-sm',
    dotSize: 'w-2 h-2',
  },
  lg: {
    padding: 'px-2.5 py-1.5',
    fontSize: 'text-base',
    dotSize: 'w-2.5 h-2.5',
  },
};

/**
 * Badge Component
 *
 * A versatile badge component for labels, status indicators, and counts.
 * Follows design system tokens and accessibility best practices.
 *
 * @example
 * ```tsx
 * <Badge variant="primary" size="md">New</Badge>
 * <Badge variant="success" dot />
 * <Badge variant="error" size="lg">99+</Badge>
 * ```
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', dot = false, children, className = '', ...props }, ref) => {
    const sizeConfig = sizeStyles[size];
    const variantStyle = variantStyles[variant].trim().replace(/\s+/g, ' ');

    const baseClasses = `
      inline-flex
      items-center
      justify-center
      font-medium
      rounded-full
      ${variantStyle}
      ${dot ? sizeConfig.dotSize : `${sizeConfig.padding} ${sizeConfig.fontSize}`}
      ${dot ? '' : 'min-w-[1.25rem]'}
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ');

    if (dot) {
      return (
        <span
          ref={ref}
          className={baseClasses}
          aria-label={props['aria-label'] || 'Badge'}
          {...props}
        />
      );
    }

    return (
      <span ref={ref} className={baseClasses} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
