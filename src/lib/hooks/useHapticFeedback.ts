/**
 * Haptic Feedback Hook
 * Provides haptic feedback for mobile devices with iOS Haptics API support
 */

import { useIsMobile } from './useIsMobile';

export type HapticType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection';

interface HapticFeedback {
  impact?: (style: 'light' | 'medium' | 'heavy') => void;
  notification?: (type: 'success' | 'warning' | 'error') => void;
  selection?: () => void;
}

export function useHapticFeedback() {
  const isMobile = useIsMobile();

  const triggerHaptic = (type: HapticType = 'light') => {
    if (!isMobile || typeof window === 'undefined') return;

    // iOS Haptics API (preferred method for iOS devices)
    const hapticFeedback = getHapticFeedback();

    if (hapticFeedback) {
      try {
        switch (type) {
          case 'light':
            hapticFeedback.impact?.('light');
            break;
          case 'medium':
            hapticFeedback.impact?.('medium');
            break;
          case 'heavy':
          case 'warning':
            hapticFeedback.impact?.('heavy');
            break;
          case 'success':
            hapticFeedback.notification?.('success');
            break;
          case 'error':
            hapticFeedback.notification?.('error');
            break;
          case 'selection':
            hapticFeedback.selection?.();
            break;
        }
        return; // iOS haptics handled, no need for vibration API
      } catch (error) {
        // Fallback to vibration API if iOS haptics fail
        console.debug('iOS Haptics API failed, falling back to Vibration API');
      }
    }

    // Fallback: Vibration API (works on Android and other devices)
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
        case 'selection':
          navigator.vibrate(10); // Very short vibration
          break;
        case 'medium':
        case 'success':
          navigator.vibrate(20); // Short vibration
          break;
        case 'heavy':
        case 'warning':
          navigator.vibrate([10, 50, 10]); // Pattern: vibrate, pause, vibrate
          break;
        case 'error':
          navigator.vibrate([20, 50, 20, 50, 20]); // Pattern: error vibration
          break;
        default:
          navigator.vibrate(10);
      }
    }
  };

  return { triggerHaptic };
}

/**
 * Get iOS Haptics API if available
 * iOS Safari supports Haptic Feedback API through window.navigator
 * Note: iOS Haptics API is only available in standalone mode (PWA) or native apps
 */
function getHapticFeedback(): HapticFeedback | null {
  if (typeof window === 'undefined') return null;

  // Check for iOS Haptics API (available in standalone mode)
  // @ts-ignore - iOS Haptics API is not in TypeScript definitions
  const haptic = (window.navigator as any)?.vibrate ? null : (window.navigator as any)?.haptics;

  if (haptic && typeof haptic === 'object') {
    return {
      impact: (style: 'light' | 'medium' | 'heavy') => {
        try {
          // iOS Haptics API impact feedback
          if (typeof haptic.impactFeedback === 'function') {
            haptic.impactFeedback(style);
          } else if (typeof haptic.impact === 'function') {
            // Alternative API naming
            haptic.impact(style);
          }
        } catch (error) {
          console.debug('iOS Haptics impact failed:', error);
        }
      },
      notification: (type: 'success' | 'warning' | 'error') => {
        try {
          // iOS Haptics API notification feedback
          if (typeof haptic.notificationFeedback === 'function') {
            haptic.notificationFeedback(type);
          } else if (typeof haptic.notification === 'function') {
            // Alternative API naming
            haptic.notification(type);
          }
        } catch (error) {
          console.debug('iOS Haptics notification failed:', error);
        }
      },
      selection: () => {
        try {
          // iOS Haptics API selection feedback
          if (typeof haptic.selectionFeedback === 'function') {
            haptic.selectionFeedback();
          } else if (typeof haptic.selection === 'function') {
            // Alternative API naming
            haptic.selection();
          }
        } catch (error) {
          console.debug('iOS Haptics selection failed:', error);
        }
      },
    };
  }

  return null;
}
