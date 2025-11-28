'use client';

import React from 'react';
import { designTokens } from '@/lib/design-tokens';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';
import { LoadingSpinner } from './LoadingSpinner';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'warning';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonState = 'default' | 'hover' | 'active' | 'disabled' | 'loading';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant style
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Show loading spinner
   * @default false
   */
  loading?: boolean;

  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Icon to display before the label
   */
  icon?: React.ReactNode;

  /**
   * Icon to display after the label
   */
  iconRight?: React.ReactNode;

  /**
   * Button content
   */
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-brand to-brand-dark
    text-white
    shadow-elevation-2 shadow-colored-primary
    hover:from-brand-dark hover:to-brand
    hover:shadow-elevation-4 hover:shadow-colored-primary-hover
    active:scale-[0.98]
    disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none
    disabled:cursor-not-allowed
    disabled:opacity-70
  `,
  secondary: `
    bg-gradient-to-r from-gray-100 to-white
    dark:from-gray-800 dark:to-gray-700
    text-gray-900 dark:text-gray-100
    border-2 border-gray-200 dark:border-gray-700
    shadow-elevation-1
    hover:from-gray-200 hover:to-gray-100
    dark:hover:from-gray-700 dark:hover:to-gray-600
    hover:border-gray-300 dark:hover:border-gray-600
    hover:shadow-elevation-2
    active:scale-[0.98]
    disabled:from-gray-100 disabled:to-gray-100
    disabled:dark:from-gray-800 disabled:dark:to-gray-800
    disabled:text-gray-500 dark:disabled:text-gray-500
    disabled:border-gray-200 disabled:dark:border-gray-700
    disabled:cursor-not-allowed
  `,
  outline: `
    bg-transparent
    text-gray-900 dark:text-gray-100
    border-2 border-gray-300 dark:border-gray-600
    hover:bg-gray-50 dark:hover:bg-gray-800
    hover:border-gray-400 dark:hover:border-gray-500
    active:scale-[0.98]
    disabled:text-gray-500 dark:disabled:text-gray-500
    disabled:border-gray-200 disabled:dark:border-gray-700
    disabled:cursor-not-allowed
  `,
  ghost: `
    bg-transparent
    text-gray-800 dark:text-gray-200
    hover:bg-gray-100 dark:hover:bg-gray-800
    active:scale-[0.98]
    disabled:text-gray-500 dark:disabled:text-gray-500
    disabled:cursor-not-allowed
    disabled:opacity-70
  `,
  danger: `
    bg-gradient-to-r from-error-500 to-error-600
    text-white
    shadow-elevation-2 shadow-colored-error
    hover:from-error-600 hover:to-error-500
    hover:shadow-elevation-4
    active:scale-[0.98]
    disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none
    disabled:cursor-not-allowed
    disabled:opacity-70
  `,
  success: `
    bg-gradient-to-r from-success to-success-dark
    text-white
    shadow-elevation-2 shadow-colored-success
    hover:from-success-dark hover:to-success
    hover:shadow-elevation-4
    active:scale-[0.98]
    disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none
    disabled:cursor-not-allowed
    disabled:opacity-70
  `,
  warning: `
    bg-gradient-to-r from-warning to-warning-dark
    text-white
    shadow-elevation-2 shadow-colored-warning
    hover:from-warning-dark hover:to-warning
    hover:shadow-elevation-4
    active:scale-[0.98]
    disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none
    disabled:cursor-not-allowed
    disabled:opacity-70
  `,
};

const sizeStyles: Record<
  ButtonSize,
  { padding: string; fontSize: string; minHeight: string; gap: string }
> = {
  sm: {
    padding: 'px-3 py-1.5',
    fontSize: 'text-sm',
    minHeight: 'min-h-[44px]', // Mobile minimum touch target (44x44px)
    gap: 'gap-1.5',
  },
  md: {
    padding: 'px-4 py-2',
    fontSize: 'text-base',
    minHeight: 'min-h-[44px]', // iOS minimum touch target
    gap: 'gap-2',
  },
  lg: {
    padding: 'px-6 py-3',
    fontSize: 'text-lg',
    minHeight: 'min-h-[48px]', // Android recommended touch target
    gap: 'gap-2.5',
  },
};

/**
 * Button Component
 *
 * A versatile button component with multiple variants, sizes, and states.
 * Follows design system tokens and accessibility best practices.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click Me
 * </Button>
 *
 * <Button variant="secondary" icon={<Icon />} loading={isLoading}>
 *   Save
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      icon,
      iconRight,
      children,
      className = '',
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const { triggerHaptic } = useHapticFeedback();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      // Haptic feedback on mobile
      if (isMobile && onClick) {
        triggerHaptic('light');
      }

      onClick?.(e);
    };

    const isDisabled = disabled || loading;

    const sizeConfig = sizeStyles[size] || sizeStyles.md;
    const variantStyle = (variantStyles[variant] || variantStyles.primary)
      .trim()
      .replace(/\s+/g, ' ');

    const baseClasses = `
      inline-flex
      items-center
      justify-center
      font-semibold
      rounded-lg
      transition-all
      duration-fast
      ease-out
      focus:outline-none
      focus-visible:ring-2
      focus-visible:ring-offset-2
      focus-visible:ring-brand
      focus-visible:ring-offset-white
      dark:focus-visible:ring-offset-gray-900
      touch-feedback
      mobile-press
      ${isMobile ? 'active:scale-[0.95] active:brightness-95' : ''}
      ${sizeConfig.padding}
      ${sizeConfig.fontSize}
      ${sizeConfig.minHeight}
      ${sizeConfig.gap}
      ${fullWidth ? 'w-full' : ''}
      ${variantStyle}
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ');

    return (
      <button
        ref={ref}
        type={props.type || 'button'}
        className={baseClasses}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        onClick={handleClick}
        style={{
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          pointerEvents: isDisabled ? 'none' : 'auto',
          ...props.style,
        }}
        {...props}
      >
        {loading && (
          <LoadingSpinner
            size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
            variant={
              variant === 'primary' ? 'primary' : variant === 'secondary' ? 'secondary' : 'primary'
            }
            aria-label="Loading"
            className="flex-shrink-0"
          />
        )}
        {!loading && icon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className={loading ? 'opacity-0' : ''}>{children}</span>
        {!loading && iconRight && (
          <span className="flex-shrink-0" aria-hidden="true">
            {iconRight}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
