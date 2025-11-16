'use client';

import React from 'react';
import { designTokens } from '@/lib/design-tokens';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Checkbox size
   * @default 'md'
   */
  size?: CheckboxSize;

  /**
   * Label text
   */
  label?: string;

  /**
   * Helper text displayed below checkbox
   */
  helperText?: string;

  /**
   * Error message displayed below checkbox
   */
  error?: string;

  /**
   * Full width checkbox
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Indeterminate state (for parent checkboxes)
   * @default false
   */
  indeterminate?: boolean;
}

const sizeStyles: Record<CheckboxSize, { checkbox: string; label: string; helper: string }> = {
  sm: {
    checkbox: 'w-4 h-4',
    label: 'text-sm',
    helper: 'text-xs',
  },
  md: {
    checkbox: 'w-5 h-5',
    label: 'text-base',
    helper: 'text-sm',
  },
  lg: {
    checkbox: 'w-6 h-6',
    label: 'text-lg',
    helper: 'text-base',
  },
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = 'md',
      label,
      helperText,
      error,
      fullWidth = false,
      indeterminate = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const sizeConfig = sizeStyles[size];

    // Handle indeterminate state
    const checkboxRef = React.useRef<HTMLInputElement | null>(null);
    React.useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const combinedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        checkboxRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const checkboxClasses = `
      ${sizeConfig.checkbox}
      rounded
      border-2
      ${hasError ? 'border-error' : 'border-gray-300 dark:border-gray-600'}
      bg-white dark:bg-gray-900
      text-brand
      focus:outline-none
      focus:ring-2
      focus:ring-offset-2
      ${hasError ? 'focus:ring-error/20 focus:border-error' : 'focus:ring-brand/20 focus:border-brand'}
      focus:ring-offset-white dark:focus:ring-offset-gray-900
      transition-all
      duration-fast
      ease-out
      cursor-pointer
      disabled:bg-gray-100 dark:disabled:bg-gray-800
      disabled:border-gray-200 dark:disabled:border-gray-700
      disabled:cursor-not-allowed
      disabled:opacity-50
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ');

    const labelClasses = `
      ${sizeConfig.label}
      font-medium
      text-gray-900 dark:text-gray-100
      cursor-pointer
      select-none
      ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `
      .trim()
      .replace(/\s+/g, ' ');

    const wrapperClasses = `
      flex
      items-start
      gap-2
      ${fullWidth ? 'w-full' : ''}
    `
      .trim()
      .replace(/\s+/g, ' ');

    return (
      <div className={wrapperClasses}>
        <div className="flex items-center h-5">
          <input
            ref={combinedRef}
            type="checkbox"
            id={checkboxId}
            className={checkboxClasses}
            {...props}
          />
        </div>
        {(label || helperText || error) && (
          <div className="flex-1 min-w-0">
            {label && (
              <label htmlFor={checkboxId} className={labelClasses}>
                {label}
                {props.required && <span className="text-error ml-1">*</span>}
              </label>
            )}
            {helperText && !error && (
              <p className={`${sizeConfig.helper} text-gray-600 dark:text-gray-400 mt-1`}>
                {helperText}
              </p>
            )}
            {error && <p className={`${sizeConfig.helper} text-error mt-1`}>{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
