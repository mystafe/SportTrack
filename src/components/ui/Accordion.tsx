'use client';

import { useState, ReactNode } from 'react';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

type AccordionProps = {
  title: string | ReactNode;
  icon?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
};

export function Accordion({
  title,
  icon,
  children,
  defaultOpen = true,
  variant = 'default',
  className = '',
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isMobile = useIsMobile();

  return (
    <div
      className={`rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 hover:border-brand/50 dark:hover:border-brand/50 hover:shadow-lg ${className}`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }
        }}
        className={`w-full flex items-center justify-between ${variant === 'compact' ? (isMobile ? 'p-3' : 'p-3 sm:p-4') : isMobile ? 'p-4' : 'p-4 sm:p-5'} text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 ${
          isOpen
            ? 'bg-gradient-to-r from-brand/10 to-brand/5 dark:from-brand/20 dark:to-brand/10'
            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
        } ${isMobile ? 'touch-feedback active:bg-gray-100 dark:active:bg-gray-700' : ''}`}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${typeof title === 'string' ? title.replace(/\s+/g, '-').toLowerCase() : 'accordion'}`}
        id={`accordion-button-${typeof title === 'string' ? title.replace(/\s+/g, '-').toLowerCase() : 'accordion'}`}
        aria-label={
          typeof title === 'string' ? `${isOpen ? 'Collapse' : 'Expand'} ${title}` : undefined
        }
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {icon && <span className="text-xl sm:text-2xl flex-shrink-0">{icon}</span>}
          <h3
            className={`font-bold text-gray-950 dark:text-white truncate ${
              variant === 'compact' ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
            }`}
          >
            {title}
          </h3>
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        id={`accordion-content-${typeof title === 'string' ? title.replace(/\s+/g, '-').toLowerCase() : 'accordion'}`}
        role="region"
        aria-labelledby={`accordion-button-${typeof title === 'string' ? title.replace(/\s+/g, '-').toLowerCase() : 'accordion'}`}
        aria-hidden={!isOpen}
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div
          className={`${variant === 'compact' ? (isMobile ? 'p-3 pt-2' : 'p-3 sm:p-4 pt-2 sm:pt-3') : isMobile ? 'p-4' : 'p-4 sm:p-5'}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
