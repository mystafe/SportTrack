'use client';

import { useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';
import { calculateWeeklyStats } from '@/lib/statisticsUtils';
import { compareWeeks } from '@/lib/comparisonUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import {
  startOfWeek,
  endOfWeek,
  format,
  eachDayOfInterval,
  startOfDay,
  parseISO,
  isSameDay,
} from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { getActivityLabel } from '@/lib/activityUtils';

export function WeeklySummary() {
  const { t, lang } = useI18n();
  const { activities } = useActivities();
  const { settings } = useSettings();
  const isMobile = useIsMobile();
  const dailyTarget =
    settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : DEFAULT_DAILY_TARGET;
  const dateLocale = lang === 'tr' ? tr : enUS;

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );

  // Get current week stats
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  // Get weekly stats for last 4 weeks
  const weeklyStats = useMemo(
    () => calculateWeeklyStats(activities, dailyTarget, 4),
    [activities, dailyTarget]
  );
  const currentWeek = weeklyStats[weeklyStats.length - 1]; // Last week is current week

  // Compare with previous week
  const weekComparison = useMemo(
    () => compareWeeks(activities, dailyTarget),
    [activities, dailyTarget]
  );

  // Get current week activities
  const currentWeekActivities = useMemo(() => {
    return activities.filter((activity) => {
      const activityDate = startOfDay(parseISO(activity.performedAt));
      return activityDate >= currentWeekStart && activityDate <= currentWeekEnd;
    });
  }, [activities, currentWeekStart, currentWeekEnd]);

  // Get daily breakdown for current week
  const dailyBreakdown = useMemo(() => {
    const days = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd });
    const breakdown = days.map((day) => {
      const dayActivities = currentWeekActivities.filter((activity) =>
        isSameDay(startOfDay(parseISO(activity.performedAt)), day)
      );
      const dayPoints = dayActivities.reduce((sum, a) => sum + a.points, 0);
      const isCompleted = dayPoints >= dailyTarget;

      return {
        date: day,
        dayName: format(day, 'EEE', { locale: dateLocale }),
        dayNumber: format(day, 'd'),
        points: dayPoints,
        count: dayActivities.length,
        isCompleted,
        isToday: isSameDay(day, new Date()),
      };
    });

    return breakdown;
  }, [currentWeekActivities, currentWeekStart, currentWeekEnd, dailyTarget, dateLocale]);

  // Get top activities for the week
  const topActivities = useMemo(() => {
    const activityMap = new Map<
      string,
      {
        label: string;
        icon: string;
        count: number;
        points: number;
      }
    >();

    currentWeekActivities.forEach((activity) => {
      const key = activity.activityKey;
      const existing = activityMap.get(key);

      if (existing) {
        existing.count += 1;
        existing.points += activity.points;
      } else {
        activityMap.set(key, {
          label: getActivityLabel(activity, lang),
          icon: activity.icon,
          count: 1,
          points: activity.points,
        });
      }
    });

    return Array.from(activityMap.values())
      .sort((a, b) => b.points - a.points)
      .slice(0, 5);
  }, [currentWeekActivities, lang]);

  if (!currentWeek) {
    return null;
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return '📈';
    if (change < 0) return '📉';
    return '➡️';
  };

  return (
    <Card
      variant="default"
      size="md"
      hoverable
      className="card-entrance"
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📅</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Haftalık Özet' : 'Weekly Summary'}
            </h2>
          </div>
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {format(currentWeekStart, 'dd MMM', { locale: dateLocale })} -{' '}
            {format(currentWeekEnd, 'dd MMM yyyy', { locale: dateLocale })}
          </span>
        </div>
      }
    >
      <div className="space-y-4 sm:space-y-5">
        {/* Week Comparison */}
        {weekComparison && (
          <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {lang === 'tr' ? 'Geçen Hafta ile Karşılaştırma' : 'vs Last Week'}
              </span>
              <span
                className={`text-sm font-bold ${getChangeColor(weekComparison.change.pointsPercent)}`}
              >
                {getChangeIcon(weekComparison.change.pointsPercent)}
                {weekComparison.change.pointsPercent > 0 ? '+' : ''}
                {weekComparison.change.pointsPercent.toFixed(1)}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  {lang === 'tr' ? 'Puan' : 'Points'}
                </p>
                <p className="font-semibold text-gray-950 dark:text-white">
                  {weekComparison.change.points > 0 ? '+' : ''}
                  {numberFormatter.format(weekComparison.change.points)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  {lang === 'tr' ? 'Aktivite' : 'Activities'}
                </p>
                <p className="font-semibold text-gray-950 dark:text-white">
                  {weekComparison.change.activities > 0 ? '+' : ''}
                  {weekComparison.change.activities}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {lang === 'tr' ? 'Toplam Puan' : 'Total Points'}
            </p>
            <p className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {numberFormatter.format(currentWeek.totalPoints)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {lang === 'tr' ? 'Günlük Ortalama' : 'Daily Avg'}
            </p>
            <p className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {numberFormatter.format(Math.round(currentWeek.averagePerDay))}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {lang === 'tr' ? 'Tamamlanan Gün' : 'Completed Days'}
            </p>
            <p className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {currentWeek.completedDays}/7
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {lang === 'tr' ? 'Tamamlama Oranı' : 'Completion Rate'}
            </p>
            <p className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {Math.round(currentWeek.completionRate)}%
            </p>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div>
          <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-3">
            {lang === 'tr' ? 'Günlük Dağılım' : 'Daily Breakdown'}
          </h3>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {dailyBreakdown.map((day) => (
              <div
                key={day.date.toISOString()}
                className={`p-2 rounded-lg text-center transition-all duration-300 ${
                  day.isToday
                    ? 'bg-brand text-white shadow-lg scale-105'
                    : day.isCompleted
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100'
                      : day.points > 0
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <p className="text-[10px] sm:text-xs font-semibold mb-1">{day.dayName}</p>
                <p className="text-xs sm:text-sm font-bold mb-1">{day.dayNumber}</p>
                {day.points > 0 ? (
                  <>
                    <p className="text-[10px] font-semibold">
                      {numberFormatter.format(day.points)}
                    </p>
                    {day.isCompleted && <span className="text-[10px] block mt-0.5">✓</span>}
                  </>
                ) : (
                  <p className="text-[10px] opacity-50">-</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Activities */}
        {topActivities.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-2">
              {lang === 'tr' ? 'En Çok Yapılan Aktiviteler' : 'Top Activities'}
            </h3>
            <div className="space-y-2">
              {topActivities.map((activity) => (
                <div
                  key={activity.label}
                  className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-lg sm:text-xl flex-shrink-0">{activity.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-gray-950 dark:text-white truncate">
                        {activity.label}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {activity.count} {lang === 'tr' ? 'kez' : 'times'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-bold text-gray-950 dark:text-white">
                      {numberFormatter.format(activity.points)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {lang === 'tr' ? 'puan' : 'pts'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Trend Chart */}
        {weeklyStats.length > 1 && (
          <div>
            <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-2">
              {lang === 'tr' ? 'Haftalık Trend' : 'Weekly Trend'}
            </h3>
            <div className="flex items-end gap-1 sm:gap-2 h-24 sm:h-32">
              {weeklyStats.map((week, index) => {
                const maxPoints = Math.max(...weeklyStats.map((w) => w.totalPoints));
                const height = maxPoints > 0 ? (week.totalPoints / maxPoints) * 100 : 0;
                const isCurrentWeek = index === weeklyStats.length - 1;

                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className={`w-full rounded-t transition-all duration-300 hover:opacity-80 ${
                        isCurrentWeek
                          ? 'bg-gradient-to-t from-brand to-brand-dark'
                          : 'bg-gradient-to-t from-gray-400 to-gray-500'
                      }`}
                      style={{ height: `${height}%` }}
                      title={`${format(week.weekStart, 'dd MMM', { locale: dateLocale })}: ${numberFormatter.format(week.totalPoints)} ${lang === 'tr' ? 'puan' : 'points'}`}
                    />
                    <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {format(week.weekStart, 'dd/MM', { locale: dateLocale })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
