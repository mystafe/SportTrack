'use client';

import { ReactNode } from 'react';
import { I18nProvider } from '@/lib/i18n';
import { ActivitiesProvider } from '@/lib/activityStore';
import { SettingsProvider } from '@/lib/settingsStore';
import { ToasterProvider } from '@/components/Toaster';
import { StorageErrorHandler } from '@/components/StorageErrorHandler';
import { InstallPrompt } from '@/components/InstallPrompt';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <SettingsProvider>
      <ActivitiesProvider>
        <ToasterProvider>
          <StorageErrorHandler />
          <InstallPrompt />
          {children}
        </ToasterProvider>
      </ActivitiesProvider>
      </SettingsProvider>
    </I18nProvider>
  );
}

