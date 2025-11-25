'use client';

import { ReactNode, useEffect, lazy, Suspense } from 'react';
import { I18nProvider } from '@/lib/i18n';
import { ActivitiesProvider } from '@/lib/activityStore';
import { SettingsProvider, useSettings } from '@/lib/settingsStore';
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
import { CloudSyncLoading } from '@/components/CloudSyncLoading';

// Lazy load components that are not immediately needed
const InstallPrompt = lazy(() =>
  import('@/components/InstallPrompt').then((m) => ({ default: m.InstallPrompt }))
);
const KeyboardShortcuts = lazy(() =>
  import('@/components/KeyboardShortcuts').then((m) => ({ default: m.KeyboardShortcuts }))
);
const CommandPalette = lazy(() =>
  import('@/components/CommandPalette').then((m) => ({ default: m.CommandPalette }))
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

function AnimationReducer({ children }: { children: ReactNode }) {
  const { settings } = useSettings();

  useEffect(() => {
    if (typeof window !== 'undefined' && settings?.reduceAnimations) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }, [settings?.reduceAnimations]);

  return <>{children}</>;
}

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
          <AnimationReducer>
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
                        <CloudSyncLoading />
                        <Suspense fallback={null}>
                          <KeyboardShortcuts />
                        </Suspense>
                        <Suspense fallback={null}>
                          <CommandPalette />
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
          </AnimationReducer>
        </SettingsProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}
