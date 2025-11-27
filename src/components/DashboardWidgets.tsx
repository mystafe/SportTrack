'use client';

import { useMemo, memo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities, useActivitiesSummary } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';
import { startOfDay, subDays, isSameDay, parseISO, getHours } from 'date-fns';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export const DashboardWidgets = memo(function DashboardWidgets() {
  const { lang } = useI18n();
  const { activities, hydrated } = useActivities();
  const { settings } = useSettings();
  const dailyTarget =
    settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : DEFAULT_DAILY_TARGET;
  const summary = useActivitiesSummary(dailyTarget);

  const widgets = useMemo(() => {
    if (!hydrated) return [];

    const now = new Date();
    const today = startOfDay(now);
    const yesterday = startOfDay(subDays(now, 1));
    const weekAgo = startOfDay(subDays(now, 7));

    // Today's activities
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

    // Yesterday comparison
    const yesterdayActivities = activities.filter((activity) => {
      if (!activity?.performedAt) return false;
      try {
        return isSameDay(startOfDay(parseISO(activity.performedAt)), yesterday);
      } catch {
        return false;
      }
    });
    const yesterdayPoints = yesterdayActivities.reduce((sum, a) => sum + (a.points || 0), 0);
    const pointsChange = todayPoints - yesterdayPoints;
    const pointsChangePercent =
      yesterdayPoints > 0 ? Math.round((pointsChange / yesterdayPoints) * 100) : 0;

    // Week average
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
    const weekAverage = weekPoints / 7;

    // Most active hour
    const hourCounts = new Map<number, number>();
    todayActivities.forEach((activity) => {
      if (!activity?.performedAt) return;
      try {
        const hour = getHours(parseISO(activity.performedAt));
        hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
      } catch {
        // Skip invalid dates
      }
    });
    let mostActiveHour = 0;
    let maxCount = 0;
    hourCounts.forEach((count, hour) => {
      if (count > maxCount) {
        maxCount = count;
        mostActiveHour = hour;
      }
    });

    // Top activity today
    const activityCounts = new Map<string, { count: number; points: number; icon: string }>();
    todayActivities.forEach((activity) => {
      if (!activity?.activityKey) return;
      const existing = activityCounts.get(activity.activityKey) || {
        count: 0,
        points: 0,
        icon: activity.icon || '🏃',
      };
      existing.count++;
      existing.points += activity.points || 0;
      activityCounts.set(activity.activityKey, existing);
    });
    let topActivity = { key: '', count: 0, points: 0, icon: '' };
    activityCounts.forEach((value, key) => {
      if (value.count > topActivity.count) {
        topActivity = { key, ...value };
      }
    });

    return [
      {
        id: 'today-progress',
        title: lang === 'tr' ? 'Bugünün İlerlemesi' : "Today's Progress",
        icon: '📊',
        value: `${Math.round((todayPoints / dailyTarget) * 100)}%`,
        subtitle: `${todayPoints.toLocaleString()} / ${dailyTarget.toLocaleString()}`,
        link: '/stats',
        color: 'from-blue-500 to-blue-600',
      },
      {
        id: 'yesterday-comparison',
        title: lang === 'tr' ? 'Dün ile Karşılaştırma' : 'Yesterday Comparison',
        icon: pointsChange >= 0 ? '📈' : '📉',
        value: `${pointsChange >= 0 ? '+' : ''}${pointsChangePercent}%`,
        subtitle:
          pointsChange >= 0
            ? lang === 'tr'
              ? `${pointsChange} puan daha fazla`
              : `${pointsChange} more points`
            : lang === 'tr'
              ? `${Math.abs(pointsChange)} puan daha az`
              : `${Math.abs(pointsChange)} less points`,
        link: '/stats',
        color: pointsChange >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600',
      },
      {
        id: 'week-average',
        title: lang === 'tr' ? 'Haftalık Ortalama' : 'Weekly Average',
        icon: '📅',
        value: Math.round(weekAverage).toLocaleString(),
        subtitle: lang === 'tr' ? 'Son 7 gün' : 'Last 7 days',
        link: '/stats',
        color: 'from-purple-500 to-purple-600',
      },
      {
        id: 'most-active-hour',
        title: lang === 'tr' ? 'En Aktif Saat' : 'Most Active Hour',
        icon: '⏰',
        value: `${mostActiveHour}:00`,
        subtitle:
          maxCount > 0
            ? lang === 'tr'
              ? `${maxCount} aktivite`
              : `${maxCount} activities`
            : lang === 'tr'
              ? 'Henüz aktivite yok'
              : 'No activities yet',
        link: '/stats',
        color: 'from-orange-500 to-orange-600',
      },
      {
        id: 'top-activity',
        title: lang === 'tr' ? 'En Çok Yapılan Aktivite' : 'Top Activity',
        icon: topActivity.icon || '🏃',
        value: topActivity.count > 0 ? `${topActivity.count}x` : '0',
        subtitle:
          topActivity.count > 0
            ? `${topActivity.points.toLocaleString()} ${lang === 'tr' ? 'puan' : 'points'}`
            : lang === 'tr'
              ? 'Henüz aktivite yok'
              : 'No activities yet',
        link: '/activities',
        color: 'from-indigo-500 to-indigo-600',
      },
      {
        id: 'streak',
        title: lang === 'tr' ? 'Seri' : 'Streak',
        icon: '🔥',
        value: `${summary.streakDays}`,
        subtitle: lang === 'tr' ? 'gün üst üste' : 'days in a row',
        link: '/stats',
        color: 'from-yellow-500 to-yellow-600',
      },
    ];
  }, [activities, hydrated, dailyTarget, summary.streakDays, lang]);

  if (!hydrated || widgets.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
      {widgets.map((widget) => (
        <Link
          key={widget.id}
          href={widget.link}
          className="block group focus:outline-none focus:ring-2 focus:ring-brand/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-xl"
          aria-label={widget.title}
        >
          <Card
            variant="default"
            size="sm"
            hoverable
            className={`card-entrance bg-gradient-to-br ${widget.color} text-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 relative overflow-hidden group`}
          >
            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover:from-white/10 group-hover:via-white/5 group-hover:to-white/10 transition-all duration-300 pointer-events-none"></div>
            <div className="flex flex-col items-center text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl mb-2">{widget.icon}</div>
              <div className="text-xs sm:text-sm font-semibold mb-1 opacity-90">{widget.title}</div>
              <div className="text-lg sm:text-xl font-bold mb-1">{widget.value}</div>
              <div className="text-[10px] sm:text-xs opacity-75">{widget.subtitle}</div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
});
