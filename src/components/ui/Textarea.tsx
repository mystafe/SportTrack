'use client';

import React from 'react';
import { designTokens } from '@/lib/design-tokens';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Textarea size
   * @default 'md'
   */
  size?: TextareaSize;

  /**
   * Label text (for accessibility)
   */
  label?: string;

  /**
   * Helper text displayed below textarea
   */
  helperText?: string;

  /**
   * Error message displayed below textarea
   */
  error?: string;

  /**
   * Full width textarea
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Number of rows (default: 3)
   */
  rows?: number;
}

const sizeStyles: Record<TextareaSize, { padding: string; fontSize: string; minHeight: string }> = {
  sm: {
    padding: 'px-3 py-1.5',
    fontSize: 'text-sm',
    minHeight: 'min-h-[80px]',
  },
  md: {
    padding: 'px-4 py-2',
    fontSize: 'text-base',
    minHeight: 'min-h-[100px]',
  },
  lg: {
    padding: 'px-5 py-3',
    fontSize: 'text-lg',
    minHeight: 'min-h-[120px]',
  },
};

/**
 * Textarea Component
 *
 * A versatile textarea component with multiple sizes and states.
 * Follows design system tokens and accessibility best practices.
 *
 * @example
 * ```tsx
 * <Textarea
 *   label="Description"
 *   placeholder="Enter description"
 *   value={value}
 *   onChange={handleChange}
 *   rows={4}
 * />
 * ```
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = 'md',
      label,
      helperText,
      error,
      fullWidth = false,
      rows = 3,
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const sizeConfig = sizeStyles[size];

    const textareaClasses = `
      ${sizeConfig.padding}
      ${sizeConfig.fontSize}
      ${sizeConfig.minHeight}
      bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl
      border-2 ${hasError ? 'border-error' : 'border-white/20 dark:border-gray-700/50'}
      text-gray-900 dark:text-gray-100
      placeholder:text-gray-400 dark:placeholder:text-gray-500
      rounded-lg
      transition-all
      duration-fast
      ease-out
      resize-y
      focus:outline-none
      focus-visible:ring-2
      focus-visible:ring-offset-2
      ${hasError ? 'focus-visible:ring-error/30 focus:border-error' : 'focus-visible:ring-brand/30 focus:border-brand'}
      focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900
      active:border-brand active:ring-1 active:ring-brand/10
      hover:border-gray-300 dark:hover:border-gray-600
      disabled:bg-gray-50 dark:disabled:bg-gray-800
      disabled:text-gray-500 dark:disabled:text-gray-500
      disabled:border-gray-200 dark:disabled:border-gray-700
      disabled:cursor-not-allowed
      disabled:opacity-60
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ');

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={textareaClasses}
          rows={rows}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore="true"
          data-form-type="other"
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="mt-1.5 text-sm text-error" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p
            id={`${textareaId}-helper`}
            className="mt-1.5 text-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
