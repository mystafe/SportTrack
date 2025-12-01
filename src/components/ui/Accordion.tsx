'use client';

import { useState, ReactNode, useEffect, useRef } from 'react';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

type AccordionProps = {
  title: string | ReactNode;
  icon?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
};

export function Accordion({
  title,
  icon,
  children,
  defaultOpen = true,
  variant = 'default',
  className = '',
  isOpen: controlledIsOpen,
  onToggle,
}: AccordionProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const isMobile = useIsMobile();
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const contentRef = useRef<HTMLDivElement>(null);

  const setIsOpen = (open: boolean) => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(open);
    }
    onToggle?.(open);
  };

  // Prevent focus on interactive elements when accordion is closed
  useEffect(() => {
    if (!contentRef.current) return;

    const interactiveSelectors = [
      'button',
      'a[href]',
      'input',
      'select',
      'textarea',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const interactiveElements =
      contentRef.current.querySelectorAll<HTMLElement>(interactiveSelectors);

    if (!isOpen) {
      // When closed: disable focus on all interactive elements
      interactiveElements.forEach((el) => {
        // Store original tabIndex if it exists
        if (!el.hasAttribute('data-original-tabindex')) {
          const originalTabIndex = el.getAttribute('tabindex');
          if (originalTabIndex !== null) {
            el.setAttribute('data-original-tabindex', originalTabIndex);
          }
        }
        el.setAttribute('tabindex', '-1');
        el.setAttribute('aria-hidden', 'true');
      });
    } else {
      // When open: restore original tabIndex and remove aria-hidden
      interactiveElements.forEach((el) => {
        const originalTabIndex = el.getAttribute('data-original-tabindex');
        if (originalTabIndex !== null) {
          el.setAttribute('tabindex', originalTabIndex);
          el.removeAttribute('data-original-tabindex');
        } else {
          el.removeAttribute('tabindex');
        }
        el.removeAttribute('aria-hidden');
      });
    }
  }, [isOpen]);

  return (
    <div
      className={`rounded-xl glass-effect card-3d border-2 border-white/20 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-brand/50 dark:hover:border-brand/50 hover:shadow-xl hover:scale-[1.01] relative z-0 ${className}`}
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
            ? 'bg-gradient-to-r from-brand/15 via-brand/10 to-brand/5 dark:from-brand/25 dark:via-brand/20 dark:to-brand/10 backdrop-blur-sm'
            : 'hover:bg-white/50 dark:hover:bg-gray-800/50'
        } ${isMobile ? 'touch-feedback active:bg-white/70 dark:active:bg-gray-800/70' : ''}`}
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
              variant === 'compact' ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
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
          isOpen ? 'h-auto opacity-100 max-h-[9999px]' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
        style={!isOpen ? { pointerEvents: 'none', display: 'none' } : { display: 'block' }}
        ref={contentRef}
      >
        <div
          className={`${variant === 'compact' ? (isMobile ? 'p-3 pt-2' : 'p-3 sm:p-4 pt-2 sm:pt-3') : isMobile ? 'p-4' : 'p-4 sm:p-5'}`}
          tabIndex={isOpen ? undefined : -1}
          style={!isOpen ? { pointerEvents: 'none' } : undefined}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
