'use client';

import { ReactNode } from 'react';
import { I18nProvider } from '@/lib/i18n';
import { ActivitiesProvider } from '@/lib/activityStore';
import { SettingsProvider } from '@/lib/settingsStore';
import { BadgeProvider } from '@/lib/badgeStore';
import { LevelProvider } from '@/lib/levelStore';
import { ChallengeProvider } from '@/lib/challengeStore';
import { ToasterProvider } from '@/components/Toaster';
import { StorageErrorHandler } from '@/components/StorageErrorHandler';
import { InstallPrompt } from '@/components/InstallPrompt';
import { NotificationManager } from '@/components/NotificationManager';
import { OnboardingManager } from '@/components/OnboardingManager';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';
import { BadgeUnlockNotification } from '@/components/BadgeUnlockNotification';
import { OnlineStatusIndicator } from '@/components/OnlineStatusIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AutoSyncProvider } from '@/components/AutoSyncProvider';
import { NameDialog } from '@/components/NameDialog';
import { ConflictResolutionManager } from '@/components/ConflictResolutionManager';

export function Providers({ children }: { children: ReactNode }) {
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
                      <InstallPrompt />
                      <NotificationManager />
                      <OnboardingManager />
                      <KeyboardShortcuts />
                      <BadgeUnlockNotification />
                      <OnlineStatusIndicator />
                      <NameDialog />
                      <ConflictResolutionManager />
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
