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
          glass-effect card-3d
          bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl
          border-2 border-white/20 dark:border-gray-700/50
          shadow-2xl hover:shadow-3xl transition-all duration-300
          ${className}
        `
          .trim()
          .replace(/\s+/g, ' ')}
      >
        <div
          className={`
            relative text-6xl sm:text-7xl mb-4 sm:mb-6
            ${variant === 'error' ? 'animate-shake' : ''}
            ${variant === 'success' ? 'animate-scale-bounce icon-bounce' : ''}
            ${variant === 'default' || variant === 'activities' || variant === 'badges' || variant === 'challenges' ? 'animate-pulse-subtle icon-bounce' : ''}
            filter drop-shadow-lg
          `
            .trim()
            .replace(/\s+/g, ' ')}
          role="img"
          aria-hidden="true"
        >
          {/* Enhanced decorative glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand/30 via-brand/20 via-transparent to-brand/30 blur-3xl opacity-60 -z-10 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-brand/20 blur-2xl opacity-40 -z-10"></div>
          <div className="relative z-10 sparkle">{displayIcon}</div>
        </div>
        <h2
          className={`
            text-xl sm:text-2xl md:text-3xl font-bold
            text-gray-950 dark:text-gray-100
            mb-2 sm:mb-3
            leading-tight
            neon-glow-brand
          `
            .trim()
            .replace(/\s+/g, ' ')}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`
              text-sm sm:text-base md:text-lg
              text-gray-700 dark:text-gray-300
              mb-6 sm:mb-8
              max-w-lg
              leading-relaxed
              font-medium
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
                className={`w-full sm:w-auto btn-enhanced animate-gradient hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl transition-all duration-300 ${action.variant === 'primary' ? 'shadow-brand/30' : ''}`}
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant={secondaryAction.variant || 'outline'}
                size={isMobile ? 'md' : 'md'}
                onClick={secondaryAction.onClick}
                className="w-full sm:w-auto btn-enhanced hover:scale-105 active:scale-95 transition-all duration-300"
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
