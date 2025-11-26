'use client';

import React from 'react';
import { designTokens } from '@/lib/design-tokens';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'filled' | 'outlined';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input size
   * @default 'md'
   */
  size?: InputSize;

  /**
   * Input variant style
   * @default 'default'
   */
  variant?: InputVariant;

  /**
   * Label text (for accessibility)
   */
  label?: string;

  /**
   * Helper text displayed below input
   */
  helperText?: string;

  /**
   * Error message displayed below input
   */
  error?: string;

  /**
   * Icon to display before the input
   */
  icon?: React.ReactNode;

  /**
   * Icon to display after the input
   */
  iconRight?: React.ReactNode;

  /**
   * Full width input
   * @default false
   */
  fullWidth?: boolean;
}

const sizeStyles: Record<
  InputSize,
  { padding: string; fontSize: string; minHeight: string; gap: string }
> = {
  sm: {
    padding: 'px-3 py-1.5',
    fontSize: 'text-sm',
    minHeight: 'min-h-[36px]',
    gap: 'gap-2',
  },
  md: {
    padding: 'px-4 py-2',
    fontSize: 'text-base',
    minHeight: 'min-h-[44px]', // iOS minimum touch target
    gap: 'gap-2',
  },
  lg: {
    padding: 'px-5 py-3',
    fontSize: 'text-lg',
    minHeight: 'min-h-[48px]', // Android recommended touch target
    gap: 'gap-3',
  },
};

const variantStyles: Record<InputVariant, string> = {
  default: `
    bg-white dark:bg-gray-900
    border-2 border-gray-200 dark:border-gray-700
    text-gray-900 dark:text-gray-100
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    focus:border-brand focus:ring-2 focus:ring-brand/20
    focus:outline-none
    hover:border-gray-300 dark:hover:border-gray-600
    active:border-brand active:ring-1 active:ring-brand/10
    transition-all duration-fast ease-out
    disabled:bg-gray-50 dark:disabled:bg-gray-800
    disabled:text-gray-500 dark:disabled:text-gray-500
    disabled:border-gray-200 dark:disabled:border-gray-700
    disabled:cursor-not-allowed
    disabled:opacity-60
  `,
  filled: `
    bg-gray-50 dark:bg-gray-800
    border-2 border-transparent
    text-gray-900 dark:text-gray-100
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    focus:bg-white dark:focus:bg-gray-900
    focus:border-brand focus:ring-2 focus:ring-brand/20
    focus:outline-none
    focus-visible:ring-2 focus-visible:ring-brand/30
    hover:bg-gray-100 dark:hover:bg-gray-700
    active:border-brand active:ring-1 active:ring-brand/10
    transition-all duration-fast ease-out
    disabled:bg-gray-50 dark:disabled:bg-gray-800
    disabled:text-gray-500 dark:disabled:text-gray-500
    disabled:cursor-not-allowed
    disabled:opacity-60
  `,
  outlined: `
    bg-transparent
    border-2 border-gray-300 dark:border-gray-600
    text-gray-900 dark:text-gray-100
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    focus:border-brand focus:ring-2 focus:ring-brand/20
    focus:outline-none
    hover:border-gray-400 dark:hover:border-gray-500
    active:border-brand active:ring-1 active:ring-brand/10
    transition-all duration-fast ease-out
    disabled:text-gray-500 dark:disabled:text-gray-500
    disabled:border-gray-200 dark:disabled:border-gray-700
    disabled:cursor-not-allowed
    disabled:opacity-60
  `,
};

/**
 * Input Component
 *
 * A versatile input component with multiple variants, sizes, and states.
 * Follows design system tokens and accessibility best practices.
 *
 * @example
 * ```tsx
 * <Input
 *   type="text"
 *   label="Name"
 *   placeholder="Enter your name"
 *   value={value}
 *   onChange={handleChange}
 * />
 *
 * <Input
 *   type="number"
 *   variant="filled"
 *   size="lg"
 *   icon={<Icon />}
 *   error="Invalid input"
 * />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      variant = 'default',
      label,
      helperText,
      error,
      icon,
      iconRight,
      fullWidth = false,
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    // Adjust minHeight for mobile touch targets (44x44px minimum)
    const sizeConfig = {
      ...sizeStyles[size],
      minHeight: isMobile && size === 'sm' ? 'min-h-[44px]' : sizeStyles[size].minHeight,
    };
    const variantStyle = variantStyles[variant].trim().replace(/\s+/g, ' ');

    const inputClasses = `
      ${sizeConfig.padding}
      ${sizeConfig.fontSize}
      ${sizeConfig.minHeight}
      ${variantStyle}
      rounded-lg
      transition-all
      duration-fast
      ease-out
      ${fullWidth ? 'w-full' : ''}
      ${icon ? 'pl-10' : ''}
      ${iconRight ? 'pr-12' : ''}
      ${hasError ? 'border-error focus:border-error focus:ring-error/20 animate-shake' : ''}
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ');

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">{iconRight}</div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-error" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
