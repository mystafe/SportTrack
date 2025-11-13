'use client';

import { ReactNode } from 'react';
import { I18nProvider } from '@/lib/i18n';
import { ActivitiesProvider } from '@/lib/activityStore';
import { SettingsProvider } from '@/lib/settingsStore';
import { BadgeProvider } from '@/lib/badgeStore';
import { ToasterProvider } from '@/components/Toaster';
import { StorageErrorHandler } from '@/components/StorageErrorHandler';
import { InstallPrompt } from '@/components/InstallPrompt';
import { NotificationManager } from '@/components/NotificationManager';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <SettingsProvider>
        <ActivitiesProvider>
          <BadgeProvider>
            <ToasterProvider>
              <StorageErrorHandler />
              <InstallPrompt />
              <NotificationManager />
              {children}
            </ToasterProvider>
          </BadgeProvider>
        </ActivitiesProvider>
      </SettingsProvider>
    </I18nProvider>
  );
}

