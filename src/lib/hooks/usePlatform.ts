import { useEffect, useState } from 'react';

export type Platform = 'ios' | 'android' | 'desktop' | 'unknown';

export interface PlatformInfo {
  platform: Platform;
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  isStandalone: boolean;
  isPWA: boolean;
}

/**
 * Hook to detect the current platform (iOS, Android, Desktop)
 * and PWA-specific features (standalone mode, installable)
 */
export function usePlatform(): PlatformInfo {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    platform: 'unknown',
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    isDesktop: false,
    isStandalone: false,
    isPWA: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userAgent = window.navigator.userAgent.toLowerCase();
    const platform = window.navigator.platform.toLowerCase();

    // Detect iOS
    const isIOS =
      /iphone|ipad|ipod/.test(userAgent) ||
      (platform === 'macintel' && navigator.maxTouchPoints > 1);

    // Detect Android
    const isAndroid = /android/.test(userAgent);

    // Detect mobile
    const isMobile = isIOS || isAndroid || /mobile/.test(userAgent);

    // Detect desktop
    const isDesktop = !isMobile;

    // Detect standalone mode (PWA installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    // Detect PWA capabilities
    const isPWA =
      isStandalone ||
      'serviceWorker' in navigator ||
      window.matchMedia('(display-mode: standalone)').matches;

    // Determine platform type
    let platformType: Platform = 'unknown';
    if (isIOS) {
      platformType = 'ios';
    } else if (isAndroid) {
      platformType = 'android';
    } else if (isDesktop) {
      platformType = 'desktop';
    }

    setPlatformInfo({
      platform: platformType,
      isIOS,
      isAndroid,
      isMobile,
      isDesktop,
      isStandalone,
      isPWA,
    });
  }, []);

  return platformInfo;
}
