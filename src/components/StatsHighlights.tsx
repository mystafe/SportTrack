'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useI18n } from '@/lib/i18n';
import { useActivities, useActivitiesSummary } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';
import { getActivityLabel } from '@/lib/activityUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { StatsHighlightsSkeleton } from '@/components/LoadingSkeleton';

export function StatsHighlights() {
  const { activities, hydrated } = useActivities();
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
  const [isOpen, setIsOpen] = useState(true);
  const isMobile = useIsMobile();

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
          label: getActivityLabel(activity, lang),
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
  }, [activities, lang]);

  const averageDailyPoints = useMemo(() => {
    if (activities.length === 0) return 0;
    const totals = new Map<string, number>();
    for (const activity of activities) {
      const key = new Date(activity.performedAt).toISOString().slice(0, 10);
      totals.set(key, (totals.get(key) ?? 0) + activity.points);
    }
    const sum = Array.from(totals.values()).reduce((acc, val) => acc + val, 0);
    return totals.size > 0 ? Math.round(sum / totals.size) : 0;
  }, [activities]);

  const totalDays = useMemo(() => {
    const days = new Set<string>();
    for (const activity of activities) {
      days.add(new Date(activity.performedAt).toISOString().slice(0, 10));
    }
    return days.size;
  }, [activities]);

  const renderHeader = () => {
    if (!isMobile) {
      return (
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {t('stats.highlightsTitle')}
        </h2>
      );
    }
    return (
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{t('stats.highlightsTitle')}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    );
  };

  return (
    <section className="mt-8 space-y-4">
      {renderHeader()}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300 overflow-hidden ${
          isMobile && !isOpen ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'
        }`}
      >
        <Link
          href="/stats"
          className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-brand/10 to-brand/5 dark:from-brand/20 dark:to-brand/10 p-4 shadow-card hover-lift transition-smooth group"
        >
          <div className="text-xs text-gray-500 mb-1">{t('stats.detailed.title')}</div>
          <div className="text-lg font-semibold group-hover:text-brand transition-colors">
            {t('stats.detailed.subtitle')}
          </div>
          <div className="text-xs text-gray-500 mt-2">→ {t('nav.stats')}</div>
        </Link>
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-card space-y-1 hover-lift transition-smooth">
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

          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-card space-y-1 hover-lift transition-smooth">
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

          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-card space-y-1 hover-lift transition-smooth">
            <div className="text-xs text-gray-500">{t('stats.highlight.currentStreak')}</div>
            <div className="text-lg font-semibold">{summary.streakDays}</div>
            <div className="text-xs text-gray-500">
              {t('stats.highlight.totalActivities', {
                count: summary.totalActivities
              })}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-card space-y-1 hover-lift transition-smooth">
            <div className="text-xs text-gray-500">{t('stats.highlight.averageDaily')}</div>
            <div className="text-lg font-semibold">
              {numberFormatter.format(averageDailyPoints)} {t('list.pointsUnit')}
            </div>
            <div className="text-xs text-gray-500">
              {t('stats.highlight.totalDays', { count: totalDays })}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-card space-y-1 hover-lift transition-smooth">
            <div className="text-xs text-gray-500">{t('stats.highlight.totalPoints')}</div>
            <div className="text-lg font-semibold">
              {numberFormatter.format(summary.totalPoints)} {t('list.pointsUnit')}
            </div>
            <div className="text-xs text-gray-500">
              {t('stats.highlight.totalActivities', {
                count: summary.totalActivities
              })}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-card space-y-1 hover-lift transition-smooth">
            <div className="text-xs text-gray-500">{t('stats.highlight.todayProgress')}</div>
            <div className="text-lg font-semibold">
              {numberFormatter.format(summary.todayPoints)} / {numberFormatter.format(summary.targetPoints)}
            </div>
            <div className="text-xs text-gray-500">
              {Math.round((summary.todayPoints / summary.targetPoints) * 100)}% {t('stats.highlight.complete')}
            </div>
          </div>
        </div>
    </section>
  );
}

