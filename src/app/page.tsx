 'use client';

import { StatsCards } from '@/components/StatsCards';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/lib/settingsStore';
import { StatsHighlights } from '@/components/StatsHighlights';

export default function HomePage() {
  const { t } = useI18n();
  const { settings } = useSettings();
  const hasName = settings?.name;
  const greeting = hasName
    ? t('header.greeting', { name: settings!.name })
    : t('header.overviewTitle');
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">{greeting}</h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {t('header.overviewSubtitle')}
          </p>
        </div>
        <Link
          href="/activities"
          className="px-3 py-2 rounded bg-brand text-white hover:bg-brand-dark text-xs sm:text-sm shadow self-start sm:self-auto"
        >
          {t('actions.addActivity')}
        </Link>
      </div>
      <StatsCards />
      <StatsHighlights />
    </div>
  );
}
