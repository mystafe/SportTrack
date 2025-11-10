'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { DAILY_TARGET_POINTS } from '@/lib/activityConfig';
import { useI18n } from '@/lib/i18n';

type Summary = {
  todayPoints: number;
  targetPoints: number;
  totalPoints: number;
  totalActivities: number;
  streakDays: number;
  lastSevenDays: Array<{ date: string; points: number }>;
  breakdownToday: Array<{
    key: string;
    label: string;
    amount: number;
    unit: string;
    points: number;
  }>;
};

export function StatsCards() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useI18n();
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );
  const dateLocale = lang === 'tr' ? tr : enUS;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/summary', { cache: 'no-store' });
        const data = await res.json();
        setSummary(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div>...</div>;

  if (!summary) {
    return <div>{t('stats.noData')}</div>;
  }

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
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.amount} {item.unit}
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
                    {numberFormatter.format(day.points)} / {numberFormatter.format(DAILY_TARGET_POINTS)}
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
