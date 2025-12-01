'use client';

import React from 'react';
import { designTokens } from '@/lib/design-tokens';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export type RadioSize = 'sm' | 'md' | 'lg';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Radio size
   * @default 'md'
   */
  size?: RadioSize;

  /**
   * Label text
   */
  label?: string;

  /**
   * Helper text displayed below radio
   */
  helperText?: string;

  /**
   * Error message displayed below radio
   */
  error?: string;

  /**
   * Full width radio
   * @default false
   */
  fullWidth?: boolean;
}

const sizeStyles: Record<RadioSize, { radio: string; label: string; helper: string }> = {
  sm: {
    radio: 'w-4 h-4',
    label: 'text-sm',
    helper: 'text-xs',
  },
  md: {
    radio: 'w-5 h-5',
    label: 'text-base',
    helper: 'text-sm',
  },
  lg: {
    radio: 'w-6 h-6',
    label: 'text-lg',
    helper: 'text-base',
  },
};

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    { size = 'md', label, helperText, error, fullWidth = false, className = '', id, ...props },
    ref
  ) => {
    const isMobile = useIsMobile();
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const sizeConfig = sizeStyles[size];

    const radioClasses = `
      ${sizeConfig.radio}
      rounded-full
      border-2
      ${hasError ? 'border-error' : 'border-white/30 dark:border-gray-600/50'}
      bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl
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
          <input ref={ref} type="radio" id={radioId} className={radioClasses} {...props} />
        </div>
        {(label || helperText || error) && (
          <div className="flex-1 min-w-0">
            {label && (
              <label htmlFor={radioId} className={labelClasses}>
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

Radio.displayName = 'Radio';

/**
 * Radio Group Component
 * Manages a group of radio buttons with shared name
 */
export interface RadioGroupProps {
  /**
   * Group name (shared by all radios in the group)
   */
  name: string;

  /**
   * Selected value
   */
  value?: string;

  /**
   * Change handler
   */
  onChange?: (value: string) => void;

  /**
   * Radio options
   */
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
    helperText?: string;
  }>;

  /**
   * Radio size
   * @default 'md'
   */
  size?: RadioSize;

  /**
   * Label for the group
   */
  label?: string;

  /**
   * Helper text for the group
   */
  helperText?: string;

  /**
   * Error message for the group
   */
  error?: string;

  /**
   * Full width group
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Orientation
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name,
      value,
      onChange,
      options,
      size = 'md',
      label,
      helperText,
      error,
      fullWidth = false,
      orientation = 'vertical',
      ...props
    },
    ref
  ) => {
    const sizeConfig = sizeStyles[size];

    const groupClasses = `
      ${orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2'}
      ${fullWidth ? 'w-full' : ''}
    `
      .trim()
      .replace(/\s+/g, ' ');

    return (
      <div ref={ref} {...props}>
        {label && (
          <label
            className={`${sizeConfig.label} font-semibold text-gray-900 dark:text-gray-100 mb-2 block`}
          >
            {label}
            {error && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className={groupClasses}>
          {options.map((option) => (
            <Radio
              key={option.value}
              size={size}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={option.disabled}
              label={option.label}
              helperText={option.helperText}
              fullWidth={orientation === 'vertical'}
            />
          ))}
        </div>
        {helperText && !error && (
          <p className={`${sizeConfig.helper} text-gray-600 dark:text-gray-400 mt-2`}>
            {helperText}
          </p>
        )}
        {error && <p className={`${sizeConfig.helper} text-error mt-2`}>{error}</p>}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
