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

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <SettingsProvider>
        <ActivitiesProvider>
          <LevelProvider>
            <ChallengeProvider>
              <BadgeProvider>
                <ToasterProvider>
                  <StorageErrorHandler />
                  <InstallPrompt />
                  <NotificationManager />
                  <OnboardingManager />
                  <KeyboardShortcuts />
                  <BadgeUnlockNotification />
                  {children}
                </ToasterProvider>
              </BadgeProvider>
            </ChallengeProvider>
          </LevelProvider>
        </ActivitiesProvider>
      </SettingsProvider>
    </I18nProvider>
  );
}

