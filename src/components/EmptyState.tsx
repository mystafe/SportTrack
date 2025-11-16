'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export type EmptyStateVariant =
  | 'default'
  | 'activities'
  | 'badges'
  | 'challenges'
  | 'search'
  | 'error'
  | 'success';

export interface EmptyStateProps {
  /**
   * Empty state variant (determines icon and default message)
   * @default 'default'
   */
  variant?: EmptyStateVariant;

  /**
   * Custom icon (emoji or React node)
   */
  icon?: React.ReactNode;

  /**
   * Title text
   */
  title: string;

  /**
   * Description text
   */
  description?: string;

  /**
   * Primary action button
   */
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };

  /**
   * Secondary action button
   */
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };

  /**
   * Additional CSS classes
   */
  className?: string;
}

const variantIcons: Record<EmptyStateVariant, string> = {
  default: '📭',
  activities: '🏃',
  badges: '🏆',
  challenges: '🎯',
  search: '🔍',
  error: '⚠️',
  success: '✅',
};

/**
 * EmptyState Component
 *
 * A versatile empty state component for displaying when there's no content.
 * Follows design system tokens and accessibility best practices.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   variant="activities"
 *   title="No activities yet"
 *   description="Start tracking your fitness journey"
 *   action={{
 *     label: "Add Activity",
 *     onClick: handleAdd,
 *     variant: "primary"
 *   }}
 * />
 * ```
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    { variant = 'default', icon, title, description, action, secondaryAction, className = '' },
    ref
  ) => {
    const isMobile = useIsMobile();
    const displayIcon = icon || variantIcons[variant];

    return (
      <Card
        ref={ref}
        variant="outlined"
        size="lg"
        className={`
          flex flex-col items-center justify-center
          text-center
          py-12 sm:py-16
          px-4 sm:px-6
          animate-fade-in-scale
          ${className}
        `
          .trim()
          .replace(/\s+/g, ' ')}
      >
        <div
          className={`
            text-6xl sm:text-7xl mb-4 sm:mb-6
            ${variant === 'error' ? 'animate-shake' : ''}
            ${variant === 'success' ? 'animate-scale-bounce' : ''}
          `
            .trim()
            .replace(/\s+/g, ' ')}
          role="img"
          aria-hidden="true"
        >
          {displayIcon}
        </div>
        <h2
          className={`
            text-xl sm:text-2xl font-bold
            text-gray-900 dark:text-gray-100
            mb-2 sm:mb-3
          `
            .trim()
            .replace(/\s+/g, ' ')}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`
              text-sm sm:text-base
              text-gray-600 dark:text-gray-400
              mb-6 sm:mb-8
              max-w-md
              leading-relaxed
            `
              .trim()
              .replace(/\s+/g, ' ')}
          >
            {description}
          </p>
        )}
        {(action || secondaryAction) && (
          <div
            className={`
              flex flex-col sm:flex-row
              items-stretch sm:items-center
              gap-3 sm:gap-4
              w-full sm:w-auto
            `
              .trim()
              .replace(/\s+/g, ' ')}
          >
            {action && (
              <Button
                variant={action.variant || 'primary'}
                size={isMobile ? 'md' : 'md'}
                onClick={action.onClick}
                className="w-full sm:w-auto"
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant={secondaryAction.variant || 'outline'}
                size={isMobile ? 'md' : 'md'}
                onClick={secondaryAction.onClick}
                className="w-full sm:w-auto"
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </Card>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export default EmptyState;
