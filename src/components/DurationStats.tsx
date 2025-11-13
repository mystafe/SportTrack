'use client';

import { useMemo, memo } from 'react';
import { format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { calculateDurationStats, formatDuration } from '@/lib/durationUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export const DurationStats = memo(function DurationStats() {
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
          <div className="text-label text-gray-700 dark:text-gray-300">
            {t('stats.duration.averageDaily')}
          </div>
          <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-brand dark:text-brand-light`}>
            {formatDuration(stats.averageDailyDuration, lang)}
          </div>
        </div>

        <div className={`card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'p-3 space-y-1.5' : 'p-4 space-y-2'} shadow-md hover:shadow-xl transition-shadow duration-300`}>
          <div className="text-label text-gray-700 dark:text-gray-300">
            {t('stats.duration.totalDuration')}
          </div>
          <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-950 dark:text-gray-100`}>
            {formatDuration(stats.totalDuration, lang)}
          </div>
        </div>

        <div className={`card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'p-3 space-y-1.5' : 'p-4 space-y-2'} shadow-md hover:shadow-xl transition-shadow duration-300`}>
          <div className="text-label text-gray-700 dark:text-gray-300">
            {t('stats.duration.daysWithDuration')}
          </div>
          <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-950 dark:text-gray-100`}>
            {stats.daysWithDuration}
          </div>
        </div>

        <div className={`card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'p-3 space-y-1.5' : 'p-4 space-y-2'} shadow-md hover:shadow-xl transition-shadow duration-300`}>
          <div className="text-label text-gray-700 dark:text-gray-300">
            {t('stats.duration.longestDay')}
          </div>
          <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-brand dark:text-brand-light`}>
            {formatDuration(stats.longestDayDuration, lang)}
          </div>
          {stats.longestDayDate && (
            <div className="text-body-small text-gray-600 dark:text-gray-400">
              {format(new Date(stats.longestDayDate), 'd MMM yyyy', { locale: dateLocale })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

