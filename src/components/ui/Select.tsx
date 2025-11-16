'use client';

import React from 'react';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * Select size
   * @default 'md'
   */
  size?: SelectSize;

  /**
   * Label text (for accessibility)
   */
  label?: string;

  /**
   * Helper text displayed below select
   */
  helperText?: string;

  /**
   * Error message displayed below select
   */
  error?: string;

  /**
   * Options array
   */
  options: SelectOption[];

  /**
   * Full width select
   * @default false
   */
  fullWidth?: boolean;
}

const sizeStyles: Record<SelectSize, { padding: string; fontSize: string; minHeight: string }> = {
  sm: {
    padding: 'px-3 py-1.5',
    fontSize: 'text-sm',
    minHeight: 'min-h-[36px]',
  },
  md: {
    padding: 'px-4 py-2',
    fontSize: 'text-base',
    minHeight: 'min-h-[44px]', // iOS minimum touch target
  },
  lg: {
    padding: 'px-5 py-3',
    fontSize: 'text-lg',
    minHeight: 'min-h-[48px]', // Android recommended touch target
  },
};

/**
 * Select Component
 *
 * A versatile select component with multiple sizes and states.
 * Follows design system tokens and accessibility best practices.
 *
 * @example
 * ```tsx
 * <Select
 *   label="Choose an option"
 *   options={[
 *     { value: '1', label: 'Option 1' },
 *     { value: '2', label: 'Option 2' },
 *   ]}
 *   value={value}
 *   onChange={handleChange}
 * />
 * ```
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      size = 'md',
      label,
      helperText,
      error,
      options,
      fullWidth = false,
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const sizeConfig = sizeStyles[size];

    const selectClasses = `
      ${sizeConfig.padding}
      ${sizeConfig.fontSize}
      ${sizeConfig.minHeight}
      bg-white dark:bg-gray-900
      border-2 ${hasError ? 'border-error' : 'border-gray-200 dark:border-gray-700'}
      text-gray-900 dark:text-gray-100
      rounded-lg
      transition-all
      duration-fast
      ease-out
      focus:outline-none
      focus:ring-2
      focus:ring-offset-2
      ${hasError ? 'focus:ring-error/20 focus:border-error' : 'focus:ring-brand/20 focus:border-brand'}
      focus:ring-offset-white dark:focus:ring-offset-gray-900
      hover:border-gray-300 dark:hover:border-gray-600
      disabled:bg-gray-50 dark:disabled:bg-gray-800
      disabled:text-gray-400 dark:disabled:text-gray-600
      disabled:border-gray-200 dark:disabled:border-gray-700
      disabled:cursor-not-allowed
      appearance-none
      bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")] bg-[length:1.5em_1.5em] bg-[right_0.75rem_center] bg-no-repeat
      dark:bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%9ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")]
      ${fullWidth ? 'w-full' : ''}
      pr-10
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ');

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={selectClasses}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
          }
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${selectId}-error`} className="mt-1.5 text-sm text-error" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${selectId}-helper`} className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
