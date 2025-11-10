'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useI18n } from '@/lib/i18n';
import { useActivities, useActivitiesSummary } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';

export function StatsHighlights() {
  const { activities } = useActivities();
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const target = settings?.dailyTarget && settings.dailyTarget > 0
    ? settings.dailyTarget
    : DEFAULT_DAILY_TARGET;
  const summary = useActivitiesSummary(target);
  const dateLocale = lang === 'tr' ? tr : enUS;
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );

  const bestDay = useMemo<{ date: string; points: number } | null>(() => {
    if (activities.length === 0) return null;
    const totals = new Map<string, { points: number }>();
    for (const activity of activities) {
      const key = new Date(activity.performedAt).toISOString().slice(0, 10);
      const bucket = totals.get(key) ?? { points: 0 };
      bucket.points += activity.points;
      totals.set(key, bucket);
    }
    let winner: { date: string; points: number } | null = null;
    totals.forEach((value, key) => {
      if (!winner || value.points > winner.points) {
        winner = { date: key, points: value.points };
      }
    });
    return winner;
  }, [activities]);

  const topActivity = useMemo<
    { label: string; icon: string; points: number; count: number } | null
  >(() => {
    if (activities.length === 0) return null;
    const totals = new Map<
      string,
      { label: string; icon: string; points: number; count: number }
    >();
    for (const activity of activities) {
      const bucket =
        totals.get(activity.activityKey) ?? {
          label: activity.label,
          icon: activity.icon,
          points: 0,
          count: 0
        };
      bucket.points += activity.points;
      bucket.count += 1;
      totals.set(activity.activityKey, bucket);
    }
    let winner: { label: string; icon: string; points: number; count: number } | null =
      null;
    totals.forEach((value) => {
      if (!winner || value.points > winner.points) {
        winner = value;
      }
    });
    return winner;
  }, [activities]);

  return (
    <section className="mt-8 space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        {t('stats.highlightsTitle')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-card space-y-1">
          <div className="text-xs text-gray-500">{t('stats.highlight.bestDay')}</div>
          {bestDay ? (
            <>
              <div className="text-lg font-semibold">
                {format(new Date(bestDay.date), 'd MMMM yyyy, EEEE', { locale: dateLocale })}
              </div>
              <div className="text-xs text-gray-500">
                {numberFormatter.format(bestDay.points)} {t('list.pointsUnit')}
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('stats.highlight.bestDayFallback')}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-card space-y-1">
          <div className="text-xs text-gray-500">{t('stats.highlight.bestActivity')}</div>
          {topActivity ? (
            <>
              <div className="text-lg font-semibold flex items-center gap-2">
                <span>{topActivity.icon}</span>
                <span>{topActivity.label}</span>
              </div>
              <div className="text-xs text-gray-500">
                {numberFormatter.format(topActivity.points)} {t('list.pointsUnit')} •{' '}
                {topActivity.count} {t('stats.highlight.sessions')}
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('stats.highlight.bestActivityFallback')}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-card space-y-1">
          <div className="text-xs text-gray-500">{t('stats.highlight.currentStreak')}</div>
          <div className="text-lg font-semibold">{summary.streakDays}</div>
          <div className="text-xs text-gray-500">
            {t('stats.highlight.totalActivities', {
              count: summary.totalActivities
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

