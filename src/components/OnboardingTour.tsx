'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/lib/settingsStore';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export interface TourStep {
  id: string;
  target: string; // CSS selector
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void; // Optional action to perform before showing step
}

interface OnboardingTourProps {
  steps: TourStep[];
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingTour({ steps, onComplete, onSkip }: OnboardingTourProps) {
  const { t, lang } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (currentStep >= steps.length) {
      onComplete();
      return;
    }

    const step = steps[currentStep];
    
    // Execute action if provided
    if (step.action) {
      step.action();
    }

    // Wait a bit for DOM updates
    setTimeout(() => {
      let element: HTMLElement | null = null;
      
      // Try multiple selector strategies
      try {
        element = document.querySelector(step.target) as HTMLElement;
      } catch (e) {
        // If selector fails, try alternative approaches
        if (step.target.includes('data-tour-id')) {
          const tourId = step.target.match(/data-tour-id="([^"]+)"/)?.[1];
          if (tourId) {
            element = document.querySelector(`[data-tour-id="${tourId}"]`) as HTMLElement;
          }
        } else if (step.target.includes('href')) {
          const href = step.target.match(/href="([^"]+)"/)?.[1];
          if (href) {
            element = document.querySelector(`a[href="${href}"]`) as HTMLElement;
          }
        } else if (step.target.includes('aria-label')) {
          const label = step.target.match(/aria-label[*]="([^"]+)"/)?.[1];
          if (label) {
            element = Array.from(document.querySelectorAll('button, a')).find(
              el => el.getAttribute('aria-label')?.includes(label)
            ) as HTMLElement;
          }
        }
      }
      
      if (element) {
        setTargetElement(element);
        updatePosition(element);
        // Scroll element into view - but only if it's not already visible
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        
        // Only scroll if element is not visible or too close to bottom
        if (!isVisible || rect.bottom > window.innerHeight * 0.8) {
          // Use a more conservative scroll that doesn't go to the very bottom
          const scrollY = rect.top + window.scrollY - (window.innerHeight / 2);
          window.scrollTo({ 
            top: Math.max(0, scrollY), 
            behavior: 'smooth' 
          });
        }
      } else {
        console.warn(`Onboarding: Could not find element with selector: ${step.target}`);
      }
    }, 300);
  }, [currentStep, steps, onComplete]);

  useEffect(() => {
    if (!targetElement) return;

    const updatePosition = () => {
      const rect = targetElement.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height
      });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [targetElement]);

  const updatePosition = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    onSkip();
  };

  if (!currentStepData || !position) {
    return null;
  }

  const tooltipPosition = currentStepData.position || (isMobile ? 'bottom' : 'right');
  
  // Calculate tooltip position - smarter positioning to avoid going off-screen
  let tooltipStyle: React.CSSProperties = {};
  const spacing = 16;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
  
  // Calculate if element is near edges
  const isNearTop = position.top < viewportHeight * 0.3;
  const isNearBottom = position.top + position.height > viewportHeight * 0.7;
  const isNearLeft = position.left < viewportWidth * 0.2;
  const isNearRight = position.left + position.width > viewportWidth * 0.8;
  
  switch (tooltipPosition) {
    case 'top':
      tooltipStyle = {
        bottom: `${position.height + spacing}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: '90vw'
      };
      break;
    case 'bottom':
      // If near bottom, show tooltip above instead
      if (isNearBottom) {
        tooltipStyle = {
          bottom: `${position.height + spacing}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: '90vw'
        };
      } else {
        tooltipStyle = {
          top: `${position.top + position.height + spacing}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: '90vw'
        };
      }
      break;
    case 'left':
      tooltipStyle = {
        right: `${position.width + spacing}px`,
        top: '50%',
        transform: 'translateY(-50%)',
        maxWidth: '40vw'
      };
      break;
    case 'right':
      tooltipStyle = {
        left: `${position.left + position.width + spacing}px`,
        top: '50%',
        transform: 'translateY(-50%)',
        maxWidth: '40vw'
      };
      break;
    case 'center':
      tooltipStyle = {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '90vw'
      };
      break;
  }
  
  // Ensure tooltip stays within viewport
  if (tooltipStyle.top !== undefined && typeof tooltipStyle.top === 'string') {
    const topValue = parseInt(tooltipStyle.top);
    if (topValue + 200 > viewportHeight) {
      tooltipStyle.top = `${Math.max(20, viewportHeight - 250)}px`;
    }
  }

  return typeof window !== 'undefined' ? createPortal(
    <>
      {/* Overlay - Less blurry, more transparent */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px] animate-fade-in"
        onClick={skipTour}
        aria-hidden="true"
      />
      
      {/* Highlight - More visible, less dark overlay */}
      {position && (
        <div
          className="fixed z-[9999] rounded-xl border-4 border-brand animate-scale-in pointer-events-none"
          style={{
            top: `${position.top - 4}px`,
            left: `${position.left - 4}px`,
            width: `${position.width + 8}px`,
            height: `${position.height + 8}px`,
            boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 0 4px #0ea5e9, 0 0 40px rgba(14, 165, 233, 1), 0 0 80px rgba(14, 165, 233, 0.6), inset 0 0 30px rgba(14, 165, 233, 0.4)`,
            backgroundColor: 'rgba(14, 165, 233, 0.2)',
            zIndex: 9999,
            filter: 'drop-shadow(0 0 20px rgba(14, 165, 233, 0.8))'
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={`fixed z-[10000] ${isMobile ? 'w-[calc(100vw-2rem)] max-w-sm' : 'w-80'} bg-white dark:bg-gray-900 rounded-xl shadow-2xl border-2 border-brand/30 p-4 sm:p-6 animate-scale-in`}
        style={{
          ...tooltipStyle,
          ...(tooltipPosition === 'center' ? {} : { position: 'absolute' })
        }}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {lang === 'tr' ? currentStepData.title : currentStepData.title}
            </h3>
            <button
              onClick={skipTour}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-xl leading-none"
              aria-label={t('onboarding.skip')}
            >
              ×
            </button>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {lang === 'tr' ? currentStepData.content : currentStepData.content}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {currentStep + 1} / {steps.length}
            </div>
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('onboarding.previous')}
                </button>
              )}
              <button
                onClick={nextStep}
                className="px-4 py-1.5 text-xs rounded-lg bg-brand text-white hover:bg-brand-dark transition-colors font-medium"
              >
                {currentStep === steps.length - 1 ? t('onboarding.finish') : t('onboarding.next')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  ) : null;
}

