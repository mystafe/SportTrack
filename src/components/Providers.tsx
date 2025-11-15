'use client';

import { ReactNode, useEffect, lazy, Suspense } from 'react';
import { I18nProvider } from '@/lib/i18n';
import { ActivitiesProvider } from '@/lib/activityStore';
import { SettingsProvider } from '@/lib/settingsStore';
import { BadgeProvider } from '@/lib/badgeStore';
import { LevelProvider } from '@/lib/levelStore';
import { ChallengeProvider } from '@/lib/challengeStore';
import { ToasterProvider } from '@/components/Toaster';
import { StorageErrorHandler } from '@/components/StorageErrorHandler';
import { NotificationManager } from '@/components/NotificationManager';
import { BadgeUnlockNotification } from '@/components/BadgeUnlockNotification';
import { OnlineStatusIndicator } from '@/components/OnlineStatusIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AutoSyncProvider } from '@/components/AutoSyncProvider';
import { NameDialog } from '@/components/NameDialog';

// Lazy load components that are not immediately needed
const InstallPrompt = lazy(() =>
  import('@/components/InstallPrompt').then((m) => ({ default: m.InstallPrompt }))
);
const OnboardingManager = lazy(() =>
  import('@/components/OnboardingManager').then((m) => ({ default: m.OnboardingManager }))
);
const KeyboardShortcuts = lazy(() =>
  import('@/components/KeyboardShortcuts').then((m) => ({ default: m.KeyboardShortcuts }))
);
const ConflictResolutionManager = lazy(() =>
  import('@/components/ConflictResolutionManager').then((m) => ({
    default: m.ConflictResolutionManager,
  }))
);
const WelcomeToast = lazy(() =>
  import('@/components/WelcomeToast').then((m) => ({
    default: m.WelcomeToast,
  }))
);

export function Providers({ children }: { children: ReactNode }) {
  // Import console helpers to make them available in browser console (only in browser)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@/lib/consoleHelpers');
      import('@/lib/syncDebug');
    }
  }, []);
  return (
    <ErrorBoundary>
      <I18nProvider>
        <SettingsProvider>
          <ActivitiesProvider>
            <LevelProvider>
              <ChallengeProvider>
                <BadgeProvider>
                  <ToasterProvider>
                    <AutoSyncProvider>
                      <StorageErrorHandler />
                      <Suspense fallback={null}>
                        <InstallPrompt />
                      </Suspense>
                      <NotificationManager />
                      <Suspense fallback={null}>
                        <OnboardingManager />
                      </Suspense>
                      <Suspense fallback={null}>
                        <KeyboardShortcuts />
                      </Suspense>
                      <BadgeUnlockNotification />
                      <OnlineStatusIndicator />
                      <NameDialog />
                      <Suspense fallback={null}>
                        <ConflictResolutionManager />
                      </Suspense>
                      <Suspense fallback={null}>
                        <WelcomeToast />
                      </Suspense>
                      {children}
                    </AutoSyncProvider>
                  </ToasterProvider>
                </BadgeProvider>
              </ChallengeProvider>
            </LevelProvider>
          </ActivitiesProvider>
        </SettingsProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}
