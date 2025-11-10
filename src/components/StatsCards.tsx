'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useI18n } from '@/lib/i18n';
import { useActivitiesSummary } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';

export function StatsCards() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const dailyTarget = settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : 10_000;
  const summary = useActivitiesSummary(dailyTarget);
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );
  const dateLocale = lang === 'tr' ? tr : enUS;

  const pct =
    summary.targetPoints > 0
      ? Math.min(100, Math.round((summary.todayPoints / summary.targetPoints) * 100))
      : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2 shadow-card">
          <div className="text-sm text-gray-500">{t('stats.todayPoints')}</div>
          <div className="text-3xl font-semibold text-brand">
            {numberFormatter.format(summary.todayPoints)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {t('stats.target')}: {numberFormatter.format(summary.targetPoints)}
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-brand to-brand-dark rounded"
              style={{ width: `${pct}%` }}
              aria-hidden
            />
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2 shadow-card">
          <div className="text-sm text-gray-500">{t('stats.totalPoints')}</div>
          <div className="text-3xl font-semibold">
            {numberFormatter.format(summary.totalPoints)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{t('stats.totalActivities', { count: summary.totalActivities })}</div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2 shadow-card">
          <div className="text-sm text-gray-500">{t('stats.streak')}</div>
          <div className="text-3xl font-semibold">{summary.streakDays}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{t('stats.streakDesc')}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-card">
          <div className="text-sm text-gray-500 mb-3">{t('stats.breakdownToday')}</div>
          {summary.breakdownToday.length === 0 ? (
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('stats.noActivityToday')}</div>
          ) : (
            <ul className="space-y-2">
              {summary.breakdownToday.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center justify-between gap-3 border rounded px-3 py-2 border-gray-200 dark:border-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-lg">{item.icon}</div>
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.amount} {item.unit}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-brand">
                    +{numberFormatter.format(item.points)} {t('list.pointsUnit')}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-card">
          <div className="text-sm text-gray-500 mb-3">{t('stats.lastSeven')}</div>
          {summary.lastSevenDays.length === 0 ? (
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('stats.noData')}</div>
          ) : (
            <ul className="space-y-2">
              {summary.lastSevenDays.map((day) => (
                <li
                  key={day.date}
                  className="flex items-center justify-between gap-3 border rounded px-3 py-2 border-gray-200 dark:border-gray-800"
                >
                  <div className="text-sm font-medium">
                    {format(new Date(day.date), 'd MMMM EEEE', { locale: dateLocale })}
                  </div>
                  <div className="text-sm font-semibold">
                    {numberFormatter.format(day.points)} / {numberFormatter.format(summary.targetPoints)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
