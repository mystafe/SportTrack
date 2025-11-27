'use client';

import { useMemo, memo, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';
import { calculateStreakStats } from '@/lib/statisticsUtils';
import { startOfDay, subDays, format, isSameDay, parseISO } from 'date-fns';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import { Accordion } from '@/components/ui/Accordion';

export const StreakVisualization = memo(function StreakVisualization() {
  const { activities, hydrated } = useActivities();
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();

  const dailyTarget =
    settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : DEFAULT_DAILY_TARGET;

  const streakData = useMemo(() => {
    if (!hydrated || activities.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        averageStreak: 0,
        last30Days: [] as Array<{ date: Date; completed: boolean; points: number }>,
      };
    }

    const stats = calculateStreakStats(activities, dailyTarget);
    const today = startOfDay(new Date());
    const last30Days: Array<{ date: Date; completed: boolean; points: number }> = [];

    // Create a map of daily points
    const dailyPoints = new Map<string, number>();
    activities.forEach((activity) => {
      if (!activity?.performedAt) return;
      try {
        const dateKey = startOfDay(parseISO(activity.performedAt)).toISOString();
        dailyPoints.set(dateKey, (dailyPoints.get(dateKey) || 0) + (activity.points || 0));
      } catch {
        // Skip invalid dates
      }
    });

    // Generate last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const dateKey = date.toISOString();
      const points = dailyPoints.get(dateKey) || 0;
      last30Days.push({
        date,
        completed: points >= dailyTarget,
        points,
      });
    }

    return {
      ...stats,
      last30Days,
    };
  }, [activities, dailyTarget, hydrated]);

  if (!hydrated) {
    return null;
  }

  const getIntensityColor = (completed: boolean, points: number) => {
    if (!completed) return 'bg-gray-200 dark:bg-gray-800';
    const intensity = Math.min(1, points / (dailyTarget * 1.5));
    if (intensity >= 1) return 'bg-green-600 dark:bg-green-500';
    if (intensity >= 0.75) return 'bg-green-500 dark:bg-green-600';
    if (intensity >= 0.5) return 'bg-green-400 dark:bg-green-700';
    return 'bg-green-300 dark:bg-green-800';
  };

  return (
    <Accordion
      title={lang === 'tr' ? '🔥 Seri Görselleştirme' : '🔥 Streak Visualization'}
      icon="🔥"
      defaultOpen={true}
      className="mb-4"
    >
      <Card variant="outlined" size="lg" className="p-4 sm:p-6">
        {/* Streak Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="text-center">
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
              {lang === 'tr' ? 'Mevcut Seri' : 'Current Streak'}
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-brand dark:text-brand-light">
              {streakData.currentStreak}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
              {lang === 'tr' ? 'gün' : 'days'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
              {lang === 'tr' ? 'En Uzun Seri' : 'Longest Streak'}
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
              {streakData.longestStreak}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
              {lang === 'tr' ? 'gün' : 'days'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
              {lang === 'tr' ? 'Ortalama Seri' : 'Average Streak'}
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
              {streakData.averageStreak}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
              {lang === 'tr' ? 'gün' : 'days'}
            </div>
          </div>
        </div>

        {/* Last 30 Days Grid */}
        <div className="mb-4">
          <div className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {lang === 'tr' ? 'Son 30 Gün' : 'Last 30 Days'}
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {streakData.last30Days.map((day, index) => {
              const isToday = isSameDay(day.date, startOfDay(new Date()));
              return (
                <div
                  key={index}
                  className={`
                    aspect-square rounded-sm sm:rounded-md
                    ${getIntensityColor(day.completed, day.points)}
                    ${isToday ? 'ring-2 ring-brand dark:ring-brand-light ring-offset-1 dark:ring-offset-gray-800' : ''}
                    transition-all duration-200 hover:scale-110 cursor-pointer
                    flex items-center justify-center
                    group relative
                  `}
                  title={`${format(day.date, 'd MMM yyyy')}: ${day.points.toLocaleString()} ${lang === 'tr' ? 'puan' : 'points'}`}
                >
                  {isToday && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-brand dark:bg-brand-light rounded-full animate-pulse" />
                  )}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs sm:text-sm px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                    {format(day.date, 'd MMM')}
                    <br />
                    {day.points.toLocaleString()} {lang === 'tr' ? 'puan' : 'pts'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gray-200 dark:bg-gray-800" />
            <span>{lang === 'tr' ? 'Hedef altı' : 'Below target'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-green-300 dark:bg-green-800" />
            <span>{lang === 'tr' ? 'Hedef' : 'Target'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-green-600 dark:bg-green-500" />
            <span>{lang === 'tr' ? 'Mükemmel' : 'Excellent'}</span>
          </div>
        </div>
      </Card>
    </Accordion>
  );
});
