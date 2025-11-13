'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { calculateDurationStats, formatDuration } from '@/lib/durationUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export function DurationStats() {
  const { t, lang } = useI18n();
  const { activities, hydrated } = useActivities();
  const isMobile = useIsMobile();
  const dateLocale = lang === 'tr' ? tr : enUS;

  const stats = useMemo(() => {
    if (!hydrated || activities.length === 0) {
      return null;
    }
    return calculateDurationStats(activities);
  }, [activities, hydrated]);

  if (!hydrated) {
    return null;
  }

  if (!stats || stats.daysWithDuration === 0) {
    return (
      <section className="mt-8 space-y-4">
        <div>
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900 dark:text-white`}>
            {t('stats.duration.title')}
          </h2>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400 mt-1`}>
            {t('stats.duration.subtitle')}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-card">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {t('stats.duration.noDurationData')}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 space-y-4">
      <div>
        <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900 dark:text-white`}>
          {t('stats.duration.title')}
        </h2>
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400 mt-1`}>
          {t('stats.duration.subtitle')}
        </p>
      </div>

      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} gap-4`}>
        <div className={`rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${isMobile ? 'p-3 space-y-1.5' : 'p-4 space-y-2'} shadow-card hover-lift transition-smooth`}>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
            {t('stats.duration.averageDaily')}
          </div>
          <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-semibold text-brand`}>
            {formatDuration(stats.averageDailyDuration, lang)}
          </div>
        </div>

        <div className={`rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${isMobile ? 'p-3 space-y-1.5' : 'p-4 space-y-2'} shadow-card hover-lift transition-smooth`}>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
            {t('stats.duration.totalDuration')}
          </div>
          <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-semibold`}>
            {formatDuration(stats.totalDuration, lang)}
          </div>
        </div>

        <div className={`rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${isMobile ? 'p-3 space-y-1.5' : 'p-4 space-y-2'} shadow-card hover-lift transition-smooth`}>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
            {t('stats.duration.daysWithDuration')}
          </div>
          <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-semibold`}>
            {stats.daysWithDuration}
          </div>
        </div>

        <div className={`rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${isMobile ? 'p-3 space-y-1.5' : 'p-4 space-y-2'} shadow-card hover-lift transition-smooth`}>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
            {t('stats.duration.longestDay')}
          </div>
          <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-semibold text-brand`}>
            {formatDuration(stats.longestDayDuration, lang)}
          </div>
          {stats.longestDayDate && (
            <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-600 dark:text-gray-400`}>
              {format(new Date(stats.longestDayDate), 'd MMM yyyy', { locale: dateLocale })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

