'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/lib/settingsStore';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Button } from '@/components/ui/Button';

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
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActionTimeRef = useRef<number>(Date.now());

  const currentStepData = steps[currentStep];

  // Auto-close after 30 seconds of inactivity
  useEffect(() => {
    // Reset timeout when step changes or user interacts
    const resetTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      lastActionTimeRef.current = Date.now();

      timeoutRef.current = setTimeout(() => {
        const timeSinceLastAction = Date.now() - lastActionTimeRef.current;
        if (timeSinceLastAction >= 30000) {
          onSkip();
        }
      }, 30000);
    };

    resetTimeout();

    // Track user interactions
    const handleInteraction = () => {
      lastActionTimeRef.current = Date.now();
      resetTimeout();
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('scroll', handleInteraction);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, [currentStep, onSkip]);

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

    // Wait a bit for DOM updates, then retry if element not found
    const findElement = (retryCount = 0): void => {
      let element: HTMLElement | null = null;

      // Try multiple selector strategies
      try {
        // First try direct selector
        element = document.querySelector(step.target) as HTMLElement;

        // If not found and it's a data-tour-id selector, try extracting the ID
        if (!element && step.target.includes('data-tour-id')) {
          // Extract tour ID from selector like '[data-tour-id="add-activity"]'
          const tourIdMatch = step.target.match(/data-tour-id="([^"]+)"/);
          if (tourIdMatch && tourIdMatch[1]) {
            element = document.querySelector(`[data-tour-id="${tourIdMatch[1]}"]`) as HTMLElement;
          }
          // Also try without brackets
          if (!element) {
            const tourIdMatch2 = step.target.match(/data-tour-id="([^"]+)"/);
            if (tourIdMatch2 && tourIdMatch2[1]) {
              element = document.querySelector(
                `button[data-tour-id="${tourIdMatch2[1]}"], a[data-tour-id="${tourIdMatch2[1]}"]`
              ) as HTMLElement;
            }
          }
        }
      } catch (e) {
        // If selector fails, try alternative approaches
        if (step.target.includes('data-tour-id')) {
          const tourIdMatch = step.target.match(/data-tour-id="([^"]+)"/);
          if (tourIdMatch && tourIdMatch[1]) {
            // Try multiple element types
            element =
              (document.querySelector(`button[data-tour-id="${tourIdMatch[1]}"]`) as HTMLElement) ||
              (document.querySelector(`a[data-tour-id="${tourIdMatch[1]}"]`) as HTMLElement) ||
              (document.querySelector(`[data-tour-id="${tourIdMatch[1]}"]`) as HTMLElement);
          }
        } else if (step.target.includes('href')) {
          const href = step.target.match(/href="([^"]+)"/)?.[1];
          if (href) {
            element = document.querySelector(`a[href="${href}"]`) as HTMLElement;
          }
        } else if (step.target.includes('aria-label')) {
          const label = step.target.match(/aria-label[*]="([^"]+)"/)?.[1];
          if (label) {
            element = Array.from(document.querySelectorAll('button, a')).find((el) =>
              el.getAttribute('aria-label')?.includes(label)
            ) as HTMLElement;
          }
        }
      }

      // If still not found and it's a data-tour-id selector, try more aggressive search
      if (!element && step.target.includes('data-tour-id')) {
        const tourIdMatch = step.target.match(/data-tour-id="([^"]+)"/);
        if (tourIdMatch && tourIdMatch[1]) {
          const tourId = tourIdMatch[1];
          // Try all possible selectors
          const selectors = [
            `[data-tour-id="${tourId}"]`,
            `button[data-tour-id="${tourId}"]`,
            `a[data-tour-id="${tourId}"]`,
            `*[data-tour-id="${tourId}"]`,
          ];

          for (const selector of selectors) {
            try {
              element = document.querySelector(selector) as HTMLElement;
              if (element) break;
            } catch (e) {
              // Continue to next selector
            }
          }

          // Last resort: search all elements with data-tour-id and match by value
          if (!element) {
            const allTourElements = document.querySelectorAll('[data-tour-id]');
            for (const el of Array.from(allTourElements)) {
              if (el.getAttribute('data-tour-id') === tourId) {
                element = el as HTMLElement;
                break;
              }
            }
          }
        }
      }

      // Debug log
      if (process.env.NODE_ENV === 'development') {
        // Also check if any element with data-tour-id exists
        const allTourElements = document.querySelectorAll('[data-tour-id]');
        const tourElementIds = Array.from(allTourElements).map((el) =>
          el.getAttribute('data-tour-id')
        );
        console.log(`[OnboardingTour] Finding element (attempt ${retryCount + 1}):`, {
          stepId: step.id,
          target: step.target,
          found: !!element,
          elementTag: element?.tagName,
          allTourElementsFound: allTourElements.length,
          tourElementIds: tourElementIds,
          elementVisible: element
            ? element.offsetParent !== null || element.getBoundingClientRect().width > 0
            : false,
        });
      }

      // If element not found and we haven't exceeded retry limit, retry
      // Increase retry count and delay for elements that might render later
      if (!element && retryCount < 10 && step.target !== 'body') {
        const delay = retryCount < 3 ? 200 : retryCount < 6 ? 300 : 500; // Progressive delay
        setTimeout(() => findElement(retryCount + 1), delay);
        return;
      }

      // Handle 'body' target specially - set viewport dimensions
      if (step.target === 'body') {
        setTargetElement(document.body);
        setPosition({
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        });
      } else if (element) {
        setTargetElement(element);

        // Debug log
        if (process.env.NODE_ENV === 'development') {
          const rect = element.getBoundingClientRect();
          console.log('[OnboardingTour] Element found:', {
            stepId: step.id,
            target: step.target,
            rect: {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            },
            windowScroll: {
              scrollY: window.scrollY,
              scrollX: window.scrollX,
            },
          });
        }

        // Scroll element into view - but only if it's not already visible
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

        // Only scroll if element is not visible or too close to bottom
        if (!isVisible || rect.bottom > window.innerHeight * 0.8) {
          // Use a more conservative scroll that doesn't go to the very bottom
          const scrollY = rect.top + window.scrollY - window.innerHeight / 2;
          window.scrollTo({
            top: Math.max(0, scrollY),
            behavior: 'smooth',
          });

          // Wait for scroll to complete, then update position
          setTimeout(() => {
            updatePosition(element);
          }, 500); // Wait for smooth scroll animation
        } else {
          // Element is already visible, update position immediately
          updatePosition(element);
        }
      } else {
        console.warn(
          `[OnboardingTour] Could not find element with selector: ${step.target} after ${retryCount + 1} attempts`
        );

        // If element not found after all retries, skip this step and move to next
        // This prevents the tour from getting stuck
        if (retryCount >= 10 && step.target !== 'body') {
          console.warn(
            `[OnboardingTour] Skipping step "${step.id}" - element not found. Moving to next step.`
          );

          // Wait a bit then move to next step
          setTimeout(() => {
            if (currentStep < steps.length - 1) {
              setCurrentStep(currentStep + 1);
            } else {
              // If this was the last step, complete the tour
              onComplete();
            }
          }, 500);
          return;
        }

        // If element not found, try to use center position as fallback
        // But only if it's not already a center-positioned step
        if (step.position !== 'center' && step.target !== 'body') {
          console.warn(`[OnboardingTour] Falling back to center position for step: ${step.id}`);
          // Set a dummy position so tooltip can render in center
          setPosition({
            top: window.innerHeight / 2,
            left: window.innerWidth / 2,
            width: 0,
            height: 0,
          });
        }
      }
    };

    // Start finding element after initial delay
    setTimeout(() => findElement(0), 300);
  }, [currentStep, steps, onComplete, setCurrentStep]);

  useEffect(() => {
    if (!targetElement) return;

    const updatePosition = () => {
      const rect = targetElement.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
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
    const newPosition = {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height,
    };

    // Debug log
    if (process.env.NODE_ENV === 'development') {
      console.log('[OnboardingTour] updatePosition:', {
        rect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
        scroll: {
          scrollY: window.scrollY,
          scrollX: window.scrollX,
        },
        calculatedPosition: newPosition,
      });
    }

    setPosition(newPosition);
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

  // Force center position for first step (welcome) and last step (complete)
  // Also force center if target is 'body' or position is explicitly 'center'
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const isBodyTarget = currentStepData?.target === 'body';
  const tooltipPosition =
    isFirstStep || isLastStep || isBodyTarget || currentStepData?.position === 'center'
      ? 'center'
      : currentStepData?.position || (isMobile ? 'center' : 'bottom');

  // Debug log (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('[OnboardingTour] Step info:', {
      currentStep,
      stepId: currentStepData?.id,
      target: currentStepData?.target,
      position: currentStepData?.position,
      tooltipPosition,
      isFirstStep,
      isLastStep,
      isBodyTarget,
      hasPosition: !!position,
      positionValue: position,
    });
  }

  // Force center positioning via ref for center position - use setProperty with !important
  useEffect(() => {
    if (tooltipPosition === 'center' && tooltipRef.current) {
      const element = tooltipRef.current;
      // Force center positioning via inline styles with !important
      element.style.setProperty('position', 'fixed', 'important');
      element.style.setProperty('top', '50%', 'important');
      element.style.setProperty('left', '50%', 'important');
      element.style.setProperty('right', 'auto', 'important');
      element.style.setProperty('bottom', 'auto', 'important');
      element.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
      element.style.setProperty('margin', '0', 'important');
      element.style.setProperty('margin-left', '0', 'important');
      element.style.setProperty('margin-right', '0', 'important');
      element.style.setProperty('margin-top', '0', 'important');
      element.style.setProperty('margin-bottom', '0', 'important');
      element.style.setProperty('width', isMobile ? 'calc(100vw - 2rem)' : 'auto', 'important');
      element.style.setProperty(
        'max-width',
        isMobile ? 'calc(100vw - 2rem)' : 'min(90vw, 500px)',
        'important'
      );
    }
  }, [tooltipPosition, isMobile, currentStep]);

  // For body target or center position, we don't need position state
  // For other positions, we need position state
  if (!currentStepData) {
    return null;
  }

  if (tooltipPosition !== 'center' && !position) {
    return null;
  }

  // Calculate tooltip position - smarter positioning to avoid going off-screen
  // Skip calculation for center position - we'll use direct styles
  let tooltipStyle: React.CSSProperties = {};
  const spacing = 16;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;

  // Only calculate tooltipStyle if NOT center position
  if (tooltipPosition !== 'center') {
    // Calculate if element is near edges (only if position exists and not center)
    const isNearTop = position ? position.top < viewportHeight * 0.3 : false;
    const isNearBottom = position ? position.top + position.height > viewportHeight * 0.7 : false;
    const isNearLeft = position ? position.left < viewportWidth * 0.2 : false;
    const isNearRight = position ? position.left + position.width > viewportWidth * 0.8 : false;

    switch (tooltipPosition) {
      case 'top':
        if (position) {
          tooltipStyle = {
            bottom: `${position.height + spacing}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '90vw',
          };
        }
        break;
      case 'bottom':
        // If near bottom, show tooltip above instead
        if (position) {
          if (isNearBottom) {
            tooltipStyle = {
              bottom: `${viewportHeight - position.top + spacing}px`,
              left: `${position.left + position.width / 2}px`,
              transform: 'translateX(-50%)',
              maxWidth: isMobile ? 'calc(100vw - 2rem)' : '90vw',
            };
          } else {
            tooltipStyle = {
              top: `${position.top + position.height + spacing}px`,
              left: `${position.left + position.width / 2}px`,
              transform: 'translateX(-50%)',
              maxWidth: isMobile ? 'calc(100vw - 2rem)' : '90vw',
            };
          }
        }
        break;
      case 'left':
        if (position) {
          tooltipStyle = {
            right: `${position.width + spacing}px`,
            top: '50%',
            transform: 'translateY(-50%)',
            maxWidth: '40vw',
          };
        }
        break;
      case 'right':
        // Check if tooltip would overflow right edge
        if (position) {
          const padding = 16;
          const rightTooltipLeft = position.left + position.width + spacing;
          const rightTooltipWidth = isMobile
            ? Math.min(320, viewportWidth - 32)
            : Math.min(400, viewportWidth * 0.4);
          if (rightTooltipLeft + rightTooltipWidth > viewportWidth - padding) {
            // Position on left side instead
            tooltipStyle = {
              right: `${viewportWidth - position.left + spacing}px`,
              top: '50%',
              transform: 'translateY(-50%)',
              maxWidth: '40vw',
            };
          } else {
            tooltipStyle = {
              left: `${rightTooltipLeft}px`,
              top: '50%',
              transform: 'translateY(-50%)',
              maxWidth: '40vw',
            };
          }
        }
        break;
    }
  }

  // Ensure tooltip stays within viewport (mobile-specific fixes)
  // Skip viewport adjustments for center position - it's already centered
  if (isMobile && tooltipPosition !== 'center') {
    const tooltipHeight = 250; // Approximate tooltip height
    const tooltipWidth = Math.min(320, viewportWidth - 32); // Max width with padding
    const padding = 16; // Safe padding from edges

    // Handle top/bottom positioning
    if (tooltipStyle.top !== undefined && typeof tooltipStyle.top === 'string') {
      const topValue = parseFloat(tooltipStyle.top.replace('px', ''));
      // Check if tooltip would overflow bottom
      if (position && topValue + tooltipHeight > viewportHeight - padding) {
        // Try to position above element instead
        if (position.top > tooltipHeight + padding) {
          tooltipStyle.top = `${position.top - tooltipHeight - spacing}px`;
          tooltipStyle.transform = 'translateX(-50%)';
        } else {
          // If can't fit above, position at bottom with padding
          tooltipStyle.top = `${viewportHeight - tooltipHeight - padding}px`;
        }
      }

      // Check if tooltip would overflow top
      if (topValue < padding) {
        tooltipStyle.top = `${padding}px`;
      }
    }

    // Handle left/right positioning (when using transform: translateX(-50%))
    if (
      tooltipStyle.left !== undefined &&
      typeof tooltipStyle.left === 'string' &&
      tooltipStyle.transform?.includes('translateX')
    ) {
      const leftValue = parseFloat(tooltipStyle.left.replace('px', ''));
      const halfWidth = tooltipWidth / 2;

      // Check if tooltip would overflow right
      if (leftValue + halfWidth > viewportWidth - padding) {
        tooltipStyle.left = `${viewportWidth - halfWidth - padding}px`;
      }

      // Check if tooltip would overflow left
      if (leftValue - halfWidth < padding) {
        tooltipStyle.left = `${halfWidth + padding}px`;
      }
    } else if (tooltipStyle.left !== undefined && typeof tooltipStyle.left === 'string') {
      // Handle absolute left positioning
      const leftValue = parseFloat(tooltipStyle.left.replace('px', ''));

      // Check if tooltip would overflow right
      if (leftValue + tooltipWidth > viewportWidth - padding) {
        tooltipStyle.left = `${viewportWidth - tooltipWidth - padding}px`;
      }

      // Check if tooltip would overflow left
      if (leftValue < padding) {
        tooltipStyle.left = `${padding}px`;
      }
    }
  } else {
    // Desktop: Ensure tooltip stays within viewport (skip for center position)
    if (
      tooltipPosition !== 'center' &&
      tooltipStyle.top !== undefined &&
      typeof tooltipStyle.top === 'string'
    ) {
      const topValue = parseFloat(tooltipStyle.top.replace('px', ''));
      if (topValue + 200 > viewportHeight) {
        tooltipStyle.top = `${Math.max(20, viewportHeight - 250)}px`;
      }
    }
  }

  return typeof window !== 'undefined'
    ? createPortal(
        <>
          {/* Overlay - Less blurry, more transparent */}
          <div
            ref={overlayRef}
            className="fixed inset-0 z-[10002] bg-black/40 backdrop-blur-[2px] animate-fade-in"
            onClick={skipTour}
            aria-hidden="true"
          />

          {/* Highlight - More visible, less dark overlay */}
          {/* Don't show highlight for center position */}
          {position && tooltipPosition !== 'center' && (
            <div
              className="fixed z-[10003] rounded-xl border-4 border-brand animate-scale-in pointer-events-none"
              style={{
                top: `${position.top - 4}px`,
                left: `${position.left - 4}px`,
                width: `${position.width + 8}px`,
                height: `${position.height + 8}px`,
                boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 0 4px #0ea5e9, 0 0 40px rgba(14, 165, 233, 1), 0 0 80px rgba(14, 165, 233, 0.6), inset 0 0 30px rgba(14, 165, 233, 0.4)`,
                backgroundColor: 'rgba(14, 165, 233, 0.2)',
                zIndex: 10003,
                filter: 'drop-shadow(0 0 20px rgba(14, 165, 233, 0.8))',
              }}
            />
          )}

          {/* Tooltip */}
          <div
            ref={tooltipRef}
            className={`${
              tooltipPosition === 'center'
                ? 'fixed z-[10004] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border-2 border-brand/30 p-4 sm:p-6 animate-scale-in'
                : `fixed z-[10004] ${
                    isMobile ? 'w-[calc(100vw-2rem)] max-w-sm' : 'w-80'
                  } bg-white dark:bg-gray-900 rounded-xl shadow-2xl border-2 border-brand/30 p-4 sm:p-6 animate-scale-in`
            }`}
            style={
              tooltipPosition === 'center'
                ? {
                    // Center position: use absolute positioning values
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    transform: 'translate(-50%, -50%)',
                    width: isMobile ? 'calc(100vw - 2rem)' : 'auto',
                    maxWidth: isMobile ? 'calc(100vw - 2rem)' : 'min(90vw, 500px)',
                    zIndex: 10004,
                    margin: 0,
                    marginLeft: 0,
                    marginRight: 0,
                    marginTop: 0,
                    marginBottom: 0,
                    inset: 'auto',
                  }
                : {
                    ...tooltipStyle,
                    position: 'fixed',
                  }
            }
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {lang === 'tr' ? currentStepData.title : currentStepData.title}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={skipTour}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none h-auto p-0 min-w-0"
                  aria-label={t('onboarding.skip')}
                >
                  ×
                </Button>
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
                    <Button type="button" variant="outline" size="sm" onClick={prevStep}>
                      {t('onboarding.previous')}
                    </Button>
                  )}
                  <Button type="button" variant="primary" size="sm" onClick={nextStep}>
                    {currentStep === steps.length - 1
                      ? t('onboarding.finish')
                      : t('onboarding.next')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )
    : null;
}
