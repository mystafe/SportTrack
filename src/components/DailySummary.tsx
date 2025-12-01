'use client';

import { useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities, useActivitiesSummary } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';
import { getActivityLabel } from '@/lib/activityUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import { startOfDay, isSameDay, parseISO, getHours, format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import Link from 'next/link';

export function DailySummary() {
  const { t, lang } = useI18n();
  const { activities } = useActivities();
  const { settings } = useSettings();
  const isMobile = useIsMobile();
  const dailyTarget =
    settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : DEFAULT_DAILY_TARGET;
  const summary = useActivitiesSummary(dailyTarget);
  const dateLocale = lang === 'tr' ? tr : enUS;

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );

  // Get today's activities
  const todayActivities = useMemo(() => {
    const today = startOfDay(new Date());
    return activities
      .filter((activity) => isSameDay(startOfDay(parseISO(activity.performedAt)), today))
      .sort((a, b) => parseISO(b.performedAt).getTime() - parseISO(a.performedAt).getTime());
  }, [activities]);

  // Group activities by type
  const activitiesByType = useMemo(() => {
    const grouped = new Map<
      string,
      {
        label: string;
        icon: string;
        count: number;
        totalPoints: number;
        totalAmount: number;
      }
    >();

    todayActivities.forEach((activity) => {
      const key = activity.activityKey;
      const existing = grouped.get(key);

      if (existing) {
        existing.count += 1;
        existing.totalPoints += activity.points;
        existing.totalAmount += activity.amount;
      } else {
        grouped.set(key, {
          label: getActivityLabel(activity, lang),
          icon: activity.icon,
          count: 1,
          totalPoints: activity.points,
          totalAmount: activity.amount,
        });
      }
    });

    return Array.from(grouped.values()).sort((a, b) => b.totalPoints - a.totalPoints);
  }, [todayActivities, lang]);

  // Get hour distribution
  const hourDistribution = useMemo(() => {
    const hours = new Map<number, number>();

    todayActivities.forEach((activity) => {
      const hour = getHours(parseISO(activity.performedAt));
      hours.set(hour, (hours.get(hour) || 0) + 1);
    });

    return Array.from(hours.entries())
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => a.hour - b.hour);
  }, [todayActivities]);

  const progress =
    dailyTarget > 0 ? Math.min(100, Math.round((summary.todayPoints / dailyTarget) * 100)) : 0;
  const remainingPoints = Math.max(0, dailyTarget - summary.todayPoints);

  if (todayActivities.length === 0) {
    return (
      <Card
        variant="default"
        size="md"
        hoverable
        className="card-entrance glass-effect card-3d border-2 border-dashed border-white/20 dark:border-gray-700/50"
      >
        <div className="text-center py-6 sm:py-8">
          <div className="text-4xl sm:text-5xl mb-3">📅</div>
          <h3 className="text-base sm:text-lg font-bold text-gray-950 dark:text-white mb-2">
            {lang === 'tr' ? 'Bugün Henüz Aktivite Yok' : 'No Activities Today'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {lang === 'tr'
              ? 'İlk aktivitenizi ekleyerek başlayın!'
              : 'Start by adding your first activity!'}
          </p>
          <Link
            href="/add"
            className="inline-block px-4 py-2 rounded-lg bg-brand text-white hover:bg-brand-dark text-sm font-semibold transition-all duration-300"
          >
            {lang === 'tr' ? 'Aktivite Ekle' : 'Add Activity'}
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card
      variant="default"
      size="md"
      hoverable
      className="card-entrance glass-effect card-3d"
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Bugünün Özeti' : "Today's Summary"}
            </h2>
          </div>
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {format(new Date(), 'dd MMM yyyy', { locale: dateLocale })}
          </span>
        </div>
      }
    >
      <div className="space-y-4 sm:space-y-5">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {lang === 'tr' ? 'Günlük Hedef' : 'Daily Goal'}
            </span>
            <span className="text-sm font-bold text-gray-950 dark:text-white">
              {numberFormatter.format(summary.todayPoints)} / {numberFormatter.format(dailyTarget)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4 overflow-hidden shadow-inner relative progress-glow">
            <div
              className={`h-full rounded-full transition-all duration-500 shadow-sm ${
                progress >= 100
                  ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 animate-gradient pulse-glow'
                  : progress >= 75
                    ? 'bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 animate-gradient'
                    : progress >= 50
                      ? 'bg-gradient-to-r from-yellow-500 via-orange-400 to-orange-500 animate-gradient'
                      : 'bg-gradient-to-r from-red-500 via-pink-400 to-pink-500 animate-gradient'
              }`}
              style={{ width: `${progress}%` }}
            >
              {progress > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer rounded-full" />
              )}
            </div>
          </div>
          {remainingPoints > 0 && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {lang === 'tr'
                ? `${numberFormatter.format(remainingPoints)} puan kaldı`
                : `${numberFormatter.format(remainingPoints)} points remaining`}
            </p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg glass-effect bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-white/20 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {lang === 'tr' ? 'Toplam Aktivite' : 'Total Activities'}
            </p>
            <p className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {todayActivities.length}
            </p>
          </div>
          <div className="p-3 rounded-lg glass-effect bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-white/20 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {lang === 'tr' ? 'Aktivite Türü' : 'Activity Types'}
            </p>
            <p className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {activitiesByType.length}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {lang === 'tr' ? 'Ortalama Puan' : 'Avg Points'}
            </p>
            <p className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {Math.round(summary.todayPoints / todayActivities.length)}
            </p>
          </div>
        </div>

        {/* Activities by Type */}
        {activitiesByType.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-2">
              {lang === 'tr' ? 'Aktivite Türlerine Göre' : 'By Activity Type'}
            </h3>
            <div className="space-y-2">
              {activitiesByType.slice(0, 5).map((activity) => (
                <div
                  key={activity.label}
                  className="flex items-center justify-between p-2 sm:p-3 rounded-lg glass-effect bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-2 border-white/20 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
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
                      {numberFormatter.format(activity.totalPoints)}
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

        {/* Hour Distribution */}
        {hourDistribution.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-2">
              {lang === 'tr' ? 'Saat Bazlı Dağılım' : 'Hour Distribution'}
            </h3>
            <div className="flex items-end gap-1 sm:gap-2 h-20 sm:h-24">
              {hourDistribution.map(({ hour, count }) => {
                const maxCount = Math.max(...hourDistribution.map((h) => h.count));
                const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                return (
                  <div key={hour} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-brand to-brand-dark rounded-t transition-all duration-300 hover:opacity-80"
                      style={{ height: `${height}%` }}
                      title={`${hour}:00 - ${count} ${lang === 'tr' ? 'aktivite' : 'activities'}`}
                    />
                    <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {hour}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View All Link */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/activities"
            className="block text-center text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            {lang === 'tr' ? 'Tüm Aktiviteleri Gör →' : 'View All Activities →'}
          </Link>
        </div>
      </div>
    </Card>
  );
}
