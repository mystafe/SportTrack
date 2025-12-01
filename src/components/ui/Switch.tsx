'use client';

import React from 'react';
import { designTokens } from '@/lib/design-tokens';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /**
   * Switch size
   * @default 'md'
   */
  size?: SwitchSize;

  /**
   * Label text
   */
  label?: string;

  /**
   * Helper text displayed below switch
   */
  helperText?: string;

  /**
   * Error message displayed below switch
   */
  error?: string;

  /**
   * Full width switch
   * @default false
   */
  fullWidth?: boolean;
}

const sizeStyles: Record<
  SwitchSize,
  { switch: string; thumb: string; label: string; helper: string }
> = {
  sm: {
    switch: 'w-9 h-5',
    thumb: 'w-4 h-4',
    label: 'text-sm',
    helper: 'text-xs',
  },
  md: {
    switch: 'w-11 h-6',
    thumb: 'w-5 h-5',
    label: 'text-base',
    helper: 'text-sm',
  },
  lg: {
    switch: 'w-14 h-7',
    thumb: 'w-6 h-6',
    label: 'text-lg',
    helper: 'text-base',
  },
};

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      size = 'md',
      label,
      helperText,
      error,
      fullWidth = false,
      className = '',
      id,
      checked,
      disabled,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const sizeConfig = sizeStyles[size];

    const switchClasses = `
      ${sizeConfig.switch}
      relative
      inline-flex
      items-center
      rounded-full
      transition-colors
      duration-fast
      ease-out
      focus:outline-none
      focus:ring-2
      focus:ring-offset-2
      ${hasError ? 'focus:ring-error/20' : 'focus:ring-brand/20'}
      focus:ring-offset-white dark:focus:ring-offset-gray-900
      ${checked ? (hasError ? 'bg-error shadow-lg shadow-error/30' : 'bg-brand shadow-lg shadow-brand/30') : 'bg-gray-300/90 dark:bg-gray-600/90 backdrop-blur-sm'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ');

    const getTranslateX = () => {
      if (!checked) return 'translate-x-0';
      // Calculate translate-x based on switch width minus thumb width minus padding
      switch (size) {
        case 'sm':
          // w-9 (36px) - w-4 (16px) - left-0.5 (2px) - right padding (2px) = 16px
          return 'translate-x-[1rem]';
        case 'md':
          // w-11 (44px) - w-5 (20px) - left-0.5 (2px) - right padding (2px) = 20px
          return 'translate-x-[1.25rem]';
        case 'lg':
          // w-14 (56px) - w-6 (24px) - left-0.5 (2px) - right padding (2px) = 28px
          return 'translate-x-[1.75rem]';
        default:
          return 'translate-x-[1.25rem]';
      }
    };

    const thumbClasses = `
      ${sizeConfig.thumb}
      inline-block
      transform
      rounded-full
      bg-white
      shadow-sm
      transition-transform
      duration-fast
      ease-out
      ${getTranslateX()}
      absolute
      left-0.5
      top-1/2
      -translate-y-1/2
    `
      .trim()
      .replace(/\s+/g, ' ');

    const labelClasses = `
      ${sizeConfig.label}
      font-medium
      text-gray-900 dark:text-gray-100
      cursor-pointer
      select-none
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `
      .trim()
      .replace(/\s+/g, ' ');

    const wrapperClasses = `
      flex
      items-center
      gap-3
      ${fullWidth ? 'w-full' : ''}
    `
      .trim()
      .replace(/\s+/g, ' ');

    return (
      <div className={wrapperClasses}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            className="sr-only"
            checked={checked}
            disabled={disabled}
            {...props}
          />
          <label htmlFor={switchId} className={switchClasses} aria-label={label || 'Toggle switch'}>
            <span className={thumbClasses} />
          </label>
        </div>
        {(label || helperText || error) && (
          <div className="flex-1 min-w-0">
            {label && (
              <label htmlFor={switchId} className={labelClasses}>
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

Switch.displayName = 'Switch';
