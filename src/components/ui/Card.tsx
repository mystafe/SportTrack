'use client';

import React from 'react';
import { designTokens } from '@/lib/design-tokens';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';
export type CardSize = 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card variant style
   * @default 'default'
   */
  variant?: CardVariant;

  /**
   * Card size (affects padding)
   * @default 'md'
   */
  size?: CardSize;

  /**
   * Show hover effect
   * @default false
   */
  hoverable?: boolean;

  /**
   * Show clickable effect
   * @default false
   */
  clickable?: boolean;

  /**
   * Card header content
   */
  header?: React.ReactNode;

  /**
   * Card footer content
   */
  footer?: React.ReactNode;

  /**
   * Card content
   */
  children: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: `
    bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl
    border-2 border-white/20 dark:border-gray-700/50
    shadow-elevation-2
  `,
  elevated: `
    bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl
    border-2 border-white/20 dark:border-gray-700/50
    shadow-elevation-4
  `,
  outlined: `
    bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl
    border-2 border-white/30 dark:border-gray-600/50
    shadow-none
  `,
  filled: `
    bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-xl
    border-2 border-white/20 dark:border-gray-700/30
    shadow-elevation-1
  `,
};

const sizeStyles: Record<CardSize, { padding: string; gap: string }> = {
  sm: {
    padding: 'p-3',
    gap: 'gap-2',
  },
  md: {
    padding: 'p-4 sm:p-6',
    gap: 'gap-3',
  },
  lg: {
    padding: 'p-6 sm:p-8',
    gap: 'gap-4',
  },
};

/**
 * Card Component
 *
 * A versatile card component with multiple variants, sizes, and interactive states.
 * Follows design system tokens and accessibility best practices.
 *
 * @example
 * ```tsx
 * <Card variant="default" size="md" hoverable>
 *   <Card.Header>Title</Card.Header>
 *   <Card.Content>Content goes here</Card.Content>
 *   <Card.Footer>Footer</Card.Footer>
 * </Card>
 *
 * <Card variant="elevated" clickable onClick={handleClick}>
 *   Clickable card
 * </Card>
 * ```
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      size = 'md',
      hoverable = false,
      clickable = false,
      header,
      footer,
      children,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const sizeConfig = sizeStyles[size];
    const variantStyle = variantStyles[variant].trim().replace(/\s+/g, ' ');

    const baseClasses = `
      rounded-xl
      transition-all
      duration-normal
      ease-out
      ${variantStyle}
      ${hoverable ? 'hover:shadow-elevation-5 hover:scale-[1.02] hover:border-brand/50 dark:hover:border-brand/50' : ''}
      ${clickable ? `cursor-pointer touch-feedback mobile-press ${isMobile ? 'active:scale-[0.97] active:brightness-95' : 'active:scale-[0.98]'}` : ''}
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ');

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (clickable && onClick) {
        onClick(e);
      }
    };

    return (
      <div
        ref={ref}
        className={baseClasses}
        onClick={handleClick}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={
          clickable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick(e as any);
                }
              }
            : undefined
        }
        {...props}
      >
        {header && (
          <div
            className={`${sizeConfig.padding} ${sizeConfig.gap} border-b-2 border-gray-200 dark:border-gray-700 pb-3`}
          >
            {header}
          </div>
        )}
        <div className={header || footer ? sizeConfig.padding : sizeConfig.padding}>{children}</div>
        {footer && (
          <div
            className={`${sizeConfig.padding} ${sizeConfig.gap} border-t-2 border-gray-200 dark:border-gray-700 pt-3`}
          >
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Sub-components for better composition
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`text-lg font-bold text-gray-900 dark:text-white ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardHeader.displayName = 'CardHeader';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`text-gray-700 dark:text-gray-300 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`text-sm text-gray-600 dark:text-gray-400 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
CardFooter.displayName = 'CardFooter';

// Attach sub-components
(
  Card as typeof Card & {
    Header: typeof CardHeader;
    Content: typeof CardContent;
    Footer: typeof CardFooter;
  }
).Header = CardHeader;
(
  Card as typeof Card & {
    Header: typeof CardHeader;
    Content: typeof CardContent;
    Footer: typeof CardFooter;
  }
).Content = CardContent;
(
  Card as typeof Card & {
    Header: typeof CardHeader;
    Content: typeof CardContent;
    Footer: typeof CardFooter;
  }
).Footer = CardFooter;

export default Card;
