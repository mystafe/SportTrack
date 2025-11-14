/**
 * Haptic Feedback Hook
 * Provides haptic feedback for mobile devices
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

export function useHapticFeedback() {
  const isMobile = useIsMobile();

  const triggerHaptic = (type: HapticType = 'light') => {
    if (!isMobile || typeof window === 'undefined') return;

    // Check if Vibration API is available
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

    // iOS Haptics API (if available)
    if ('DeviceMotionEvent' in window && 'requestPermission' in (DeviceMotionEvent as any)) {
      // iOS haptics would require additional setup
      // For now, we rely on Vibration API which works on most devices
    }
  };

  return { triggerHaptic };
}
