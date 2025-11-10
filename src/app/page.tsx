 'use client';

import { StatsCards } from '@/components/StatsCards';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function HomePage() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t('header.overviewTitle')}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('header.overviewSubtitle')}
          </p>
        </div>
        <Link
          href="/activities"
          className="px-3 py-2 rounded bg-brand text-white hover:bg-brand-dark text-sm shadow"
        >
          {t('actions.addActivity')}
        </Link>
      </div>
      <StatsCards />
    </div>
  );
}
