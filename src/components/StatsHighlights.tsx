'use client';

import { useMemo, memo, useState } from 'react';
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

export const StatsHighlights = memo(function StatsHighlights() {
  const [isOpen, setIsOpen] = useState(true);
  const { activities, hydrated } = useActivities();
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const target =
    settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : DEFAULT_DAILY_TARGET;
  const summary = useActivitiesSummary(target);
  const dateLocale = lang === 'tr' ? tr : enUS;
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );
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

  const topActivity = useMemo<{
    label: string;
    icon: string;
    points: number;
    count: number;
  } | null>(() => {
    if (activities.length === 0) return null;
    const totals = new Map<
      string,
      { label: string; icon: string; points: number; count: number }
    >();
    for (const activity of activities) {
      const bucket = totals.get(activity.activityKey) ?? {
        label: getActivityLabel(activity, lang),
        icon: activity.icon,
        points: 0,
        count: 0,
      };
      bucket.points += activity.points;
      bucket.count += 1;
      totals.set(activity.activityKey, bucket);
    }
    let winner: { label: string; icon: string; points: number; count: number } | null = null;
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
    return (
      <button
        type="button"
        className="flex w-full items-center justify-between text-xs font-bold text-gray-900 dark:text-white mb-2 transition-all duration-200 hover:text-brand"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="stats-highlights"
      >
        <span className="font-bold">{t('stats.highlightsTitle')}</span>
        <span
          className="ml-2 text-base font-bold transition-transform duration-300 ease-in-out text-brand dark:text-brand-light"
          aria-hidden
          style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
        >
          ▼
        </span>
      </button>
    );
  };

  return (
    <section className="mt-0">
      <div className="card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-3 shadow-md hover:shadow-xl transition-shadow duration-300">
        {renderHeader()}
        {isOpen && (
          <div
            id="stats-highlights"
            className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2'} ${isMobile ? 'gap-2' : 'gap-3'}`}
          >
            <div
              className={`stagger-item stats-highlight-card card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'p-3' : 'p-4'} shadow-md hover:shadow-xl transition-shadow duration-300 space-y-1 gpu-accelerated`}
            >
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 dark:text-gray-200`}
              >
                {t('stats.highlight.bestDay')}
              </div>
              {bestDay ? (
                <>
                  <div
                    className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : 'number-transition'}`}
                  >
                    {format(new Date(bestDay.date), 'd MMMM yyyy, EEEE', { locale: dateLocale })}
                  </div>
                  <div
                    className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 font-semibold ${isMobile ? 'number-count-mobile' : 'number-count'}`}
                  >
                    {numberFormatter.format(bestDay.points)} {t('list.pointsUnit')}
                  </div>
                </>
              ) : (
                <div
                  className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-200 font-medium`}
                >
                  {t('stats.highlight.bestDayFallback')}
                </div>
              )}
            </div>

            <div
              className={`stagger-item stats-highlight-card card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'p-3' : 'p-4'} shadow-md hover:shadow-xl transition-shadow duration-300 space-y-1 gpu-accelerated`}
            >
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 dark:text-gray-200`}
              >
                {t('stats.highlight.bestActivity')}
              </div>
              {topActivity ? (
                <>
                  <div
                    className={`${isMobile ? 'text-base' : 'text-lg'} font-bold flex items-center gap-2 text-gray-950 dark:text-gray-100`}
                  >
                    <span className={isMobile ? 'emoji-celebrate' : 'emoji-bounce'}>
                      {topActivity.icon}
                    </span>
                    <span className={isMobile ? 'number-count-mobile' : 'number-transition'}>
                      {topActivity.label}
                    </span>
                  </div>
                  <div
                    className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 font-semibold ${isMobile ? 'number-count-mobile' : 'number-count'}`}
                  >
                    {numberFormatter.format(topActivity.points)} {t('list.pointsUnit')} •{' '}
                    {topActivity.count} {t('stats.highlight.sessions')}
                  </div>
                </>
              ) : (
                <div
                  className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-200 font-medium`}
                >
                  {t('stats.highlight.bestActivityFallback')}
                </div>
              )}
            </div>

            <div
              className={`stagger-item stats-highlight-card card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'p-3' : 'p-4'} shadow-md hover:shadow-xl transition-shadow duration-300 space-y-1 gpu-accelerated`}
            >
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 dark:text-gray-200`}
              >
                {t('stats.highlight.currentStreak')}
              </div>
              <div
                className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : 'number-transition'}`}
              >
                {summary.streakDays}
              </div>
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 font-semibold`}
              >
                {t('stats.highlight.totalActivities', {
                  count: summary.totalActivities,
                })}
              </div>
            </div>

            <div
              className={`stagger-item stats-highlight-card card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'p-3' : 'p-4'} shadow-md hover:shadow-xl transition-shadow duration-300 space-y-1 gpu-accelerated`}
            >
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 dark:text-gray-200`}
              >
                {t('stats.highlight.averageDaily')}
              </div>
              <div
                className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : 'number-transition'}`}
              >
                {numberFormatter.format(averageDailyPoints)} {t('list.pointsUnit')}
              </div>
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 font-semibold ${isMobile ? 'number-count-mobile' : 'number-count'}`}
              >
                {t('stats.highlight.totalDays', { count: totalDays })}
              </div>
            </div>

            <div
              className={`stagger-item stats-highlight-card card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'p-3' : 'p-4'} shadow-md hover:shadow-xl transition-shadow duration-300 space-y-1 gpu-accelerated`}
            >
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 dark:text-gray-200`}
              >
                {t('stats.highlight.totalPoints')}
              </div>
              <div
                className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : 'number-transition'}`}
              >
                {numberFormatter.format(summary.totalPoints)} {t('list.pointsUnit')}
              </div>
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 font-semibold ${isMobile ? 'number-count-mobile' : 'number-count'}`}
              >
                {t('stats.highlight.totalActivities', {
                  count: summary.totalActivities,
                })}
              </div>
            </div>

            <div
              className={`stagger-item stats-highlight-card card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'p-3' : 'p-4'} shadow-md hover:shadow-xl transition-shadow duration-300 space-y-1 gpu-accelerated`}
            >
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 dark:text-gray-200`}
              >
                {t('stats.highlight.todayProgress')}
              </div>
              <div
                className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : 'number-transition'}`}
              >
                {numberFormatter.format(summary.todayPoints)} /{' '}
                {numberFormatter.format(summary.targetPoints)}
              </div>
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 font-semibold ${isMobile ? 'number-count-mobile' : 'number-count'}`}
              >
                {Math.round((summary.todayPoints / summary.targetPoints) * 100)}%{' '}
                {t('stats.highlight.complete')}
              </div>
            </div>

            <Link
              href="/stats"
              className={`stagger-item card-entrance slide-in-right magnetic-hover hover-scale-glow rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-gradient-to-br from-brand/10 via-brand/8 to-brand/5 dark:from-brand/20 dark:via-brand/15 dark:to-brand/10 ${isMobile ? 'p-3' : 'p-4'} shadow-lg group gpu-accelerated col-span-2`}
            >
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-gray-900 dark:text-white group-hover:text-brand transition-colors whitespace-nowrap overflow-hidden text-ellipsis`}
                title={`${t('stats.detailed.title')} - ${t('stats.detailed.subtitle')}`}
              >
                {t('stats.detailed.title')} - {t('stats.detailed.subtitle')}
              </div>
              <div
                className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-700 dark:text-gray-200 font-medium mt-2`}
              >
                → {t('nav.stats')}
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
});
