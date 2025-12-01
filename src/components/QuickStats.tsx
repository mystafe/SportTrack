'use client';

import { useMemo, memo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities, useActivitiesSummary } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';
import { startOfDay, subDays, isSameDay, parseISO } from 'date-fns';
import { Card } from '@/components/ui/Card';

export const QuickStats = memo(function QuickStats() {
  const { lang } = useI18n();
  const { activities, hydrated } = useActivities();
  const { settings } = useSettings();
  const dailyTarget =
    settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : DEFAULT_DAILY_TARGET;
  const summary = useActivitiesSummary(dailyTarget);

  const stats = useMemo(() => {
    if (!hydrated) return null;

    const now = new Date();
    const today = startOfDay(now);
    const yesterday = startOfDay(subDays(now, 1));
    const weekAgo = startOfDay(subDays(now, 7));

    // Today's stats
    const todayActivities = activities.filter((activity) => {
      if (!activity?.performedAt) return false;
      try {
        return isSameDay(startOfDay(parseISO(activity.performedAt)), today);
      } catch {
        return false;
      }
    });
    const todayPoints = todayActivities.reduce((sum, a) => sum + (a.points || 0), 0);
    const todayCount = todayActivities.length;

    // Yesterday's stats
    const yesterdayActivities = activities.filter((activity) => {
      if (!activity?.performedAt) return false;
      try {
        return isSameDay(startOfDay(parseISO(activity.performedAt)), yesterday);
      } catch {
        return false;
      }
    });
    const yesterdayPoints = yesterdayActivities.reduce((sum, a) => sum + (a.points || 0), 0);

    // Last 7 days stats
    const weekActivities = activities.filter((activity) => {
      if (!activity?.performedAt) return false;
      try {
        const activityDate = startOfDay(parseISO(activity.performedAt));
        return activityDate >= weekAgo && activityDate < today;
      } catch {
        return false;
      }
    });
    const weekPoints = weekActivities.reduce((sum, a) => sum + (a.points || 0), 0);
    const weekCount = weekActivities.length;
    const weekAverage = weekCount > 0 ? Math.round(weekPoints / 7) : 0;

    // Streak
    const streak = summary.streakDays;

    return {
      todayPoints,
      todayCount,
      yesterdayPoints,
      weekAverage,
      weekCount,
      streak,
      progress: dailyTarget > 0 ? Math.min(100, Math.round((todayPoints / dailyTarget) * 100)) : 0,
    };
  }, [activities, hydrated, summary.streakDays, dailyTarget]);

  if (!hydrated || !stats) {
    return null;
  }

  const numberFormatter = new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US');

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {/* Today's Points */}
      <div className="glass-effect card-3d bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:from-blue-500/20 dark:to-blue-600/10 rounded-lg p-3 border-2 border-white/20 dark:border-blue-800/50 backdrop-blur-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          {lang === 'tr' ? 'Bugün' : 'Today'}
        </div>
        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
          {numberFormatter.format(stats.todayPoints)}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {stats.todayCount} {lang === 'tr' ? 'aktivite' : 'activities'}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 dark:from-green-500/20 dark:to-green-600/10 rounded-lg p-3 border border-green-200 dark:border-green-800">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          {lang === 'tr' ? 'İlerleme' : 'Progress'}
        </div>
        <div className="text-lg font-bold text-green-600 dark:text-green-400">
          {stats.progress}%
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
          <div
            className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${stats.progress}%` }}
          />
        </div>
      </div>

      {/* Streak */}
      <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 dark:from-orange-500/20 dark:to-orange-600/10 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          {lang === 'tr' ? 'Seri' : 'Streak'}
        </div>
        <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
          {stats.streak} {lang === 'tr' ? 'gün' : 'days'}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">🔥</div>
      </div>

      {/* Week Average */}
      <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 dark:from-purple-500/20 dark:to-purple-600/10 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          {lang === 'tr' ? 'Haftalık Ort.' : 'Week Avg.'}
        </div>
        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
          {numberFormatter.format(stats.weekAverage)}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {stats.weekCount} {lang === 'tr' ? 'aktivite' : 'activities'}
        </div>
      </div>

      {/* Yesterday Comparison */}
      <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 dark:from-pink-500/20 dark:to-pink-600/10 rounded-lg p-3 border border-pink-200 dark:border-pink-800">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          {lang === 'tr' ? 'Dün' : 'Yesterday'}
        </div>
        <div className="text-lg font-bold text-pink-600 dark:text-pink-400">
          {numberFormatter.format(stats.yesterdayPoints)}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {stats.todayPoints > stats.yesterdayPoints
            ? '📈'
            : stats.todayPoints < stats.yesterdayPoints
              ? '📉'
              : '➡️'}
        </div>
      </div>

      {/* Total Activities */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 dark:from-indigo-500/20 dark:to-indigo-600/10 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          {lang === 'tr' ? 'Toplam' : 'Total'}
        </div>
        <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
          {numberFormatter.format(summary.totalPoints)}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {summary.totalActivities} {lang === 'tr' ? 'kayıt' : 'records'}
        </div>
      </div>
    </div>
  );
});
