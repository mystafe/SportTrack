'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities, type ActivityRecord } from '@/lib/activityStore';
import { useActivityDefinitions } from '@/lib/settingsStore';
import { ActivityKey } from '@/lib/activityConfig';
import { getActivityLabel } from '@/lib/activityUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { parseISO, startOfDay, format, subDays } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';

interface ActivityStats {
  activityKey: ActivityKey;
  label: string;
  icon: string;
  totalPoints: number;
  totalCount: number;
  averagePoints: number;
  bestDay: { date: Date; points: number } | null;
  lastPerformed: Date | null;
  trend30Days: 'up' | 'down' | 'stable';
  trend7Days: 'up' | 'down' | 'stable';
}

function calculateActivityStats(
  activities: ActivityRecord[],
  activityKey: ActivityKey,
  lang: 'tr' | 'en'
): ActivityStats | null {
  const activityRecords = activities.filter((a) => a.activityKey === activityKey);
  if (activityRecords.length === 0) return null;

  const firstActivity = activityRecords[0];
  const totalPoints = activityRecords.reduce((sum, a) => sum + a.points, 0);
  const totalCount = activityRecords.length;
  const averagePoints = totalPoints / totalCount;

  // Find best day
  const dayMap = new Map<string, number>();
  activityRecords.forEach((activity) => {
    const date = startOfDay(parseISO(activity.performedAt));
    const key = date.toISOString();
    dayMap.set(key, (dayMap.get(key) || 0) + activity.points);
  });

  let bestDay: { date: Date; points: number } | null = null;
  dayMap.forEach((points, dateKey) => {
    if (!bestDay || points > bestDay.points) {
      bestDay = { date: parseISO(dateKey), points };
    }
  });

  // Find last performed
  const sortedByDate = [...activityRecords].sort(
    (a, b) => parseISO(b.performedAt).getTime() - parseISO(a.performedAt).getTime()
  );
  const lastPerformed = parseISO(sortedByDate[0].performedAt);

  // Calculate trends
  const now = new Date();
  const last30Days = activityRecords.filter((a) => {
    const activityDate = parseISO(a.performedAt);
    const daysDiff = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 30;
  });

  const previous30Days = activityRecords.filter((a) => {
    const activityDate = parseISO(a.performedAt);
    const daysDiff = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff > 30 && daysDiff <= 60;
  });

  const last7Days = activityRecords.filter((a) => {
    const activityDate = parseISO(a.performedAt);
    const daysDiff = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7;
  });

  const previous7Days = activityRecords.filter((a) => {
    const activityDate = parseISO(a.performedAt);
    const daysDiff = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff > 7 && daysDiff <= 14;
  });

  const recent30Points = last30Days.reduce((sum, a) => sum + a.points, 0);
  const previous30Points = previous30Days.reduce((sum, a) => sum + a.points, 0);
  const recent7Points = last7Days.reduce((sum, a) => sum + a.points, 0);
  const previous7Points = previous7Days.reduce((sum, a) => sum + a.points, 0);

  let trend30Days: 'up' | 'down' | 'stable' = 'stable';
  if (previous30Points === 0) {
    trend30Days = recent30Points > 0 ? 'up' : 'stable';
  } else {
    const change = ((recent30Points - previous30Points) / previous30Points) * 100;
    if (change > 10) trend30Days = 'up';
    else if (change < -10) trend30Days = 'down';
  }

  let trend7Days: 'up' | 'down' | 'stable' = 'stable';
  if (previous7Points === 0) {
    trend7Days = recent7Points > 0 ? 'up' : 'stable';
  } else {
    const change = ((recent7Points - previous7Points) / previous7Points) * 100;
    if (change > 10) trend7Days = 'up';
    else if (change < -10) trend7Days = 'down';
  }

  return {
    activityKey,
    label: getActivityLabel(firstActivity, lang),
    icon: firstActivity.icon,
    totalPoints,
    totalCount,
    averagePoints,
    bestDay,
    lastPerformed,
    trend30Days,
    trend7Days,
  };
}

export function ActivityComparison() {
  const { t, lang } = useI18n();
  const { activities } = useActivities();
  const activityDefinitions = useActivityDefinitions();
  const isMobile = useIsMobile();
  const dateLocale = lang === 'tr' ? tr : enUS;

  const [selectedActivities, setSelectedActivities] = useState<ActivityKey[]>([]);

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );

  // Get activities that have been performed
  const performedActivities = useMemo(() => {
    const activityKeys = new Set<ActivityKey>();
    activities.forEach((a) => activityKeys.add(a.activityKey));
    return Array.from(activityKeys);
  }, [activities]);

  const activityStats = useMemo(() => {
    return selectedActivities
      .map((key) => calculateActivityStats(activities, key, lang))
      .filter((stats): stats is ActivityStats => stats !== null);
  }, [selectedActivities, activities, lang]);

  const handleAddActivity = (key: ActivityKey) => {
    if (!selectedActivities.includes(key) && selectedActivities.length < 4) {
      setSelectedActivities([...selectedActivities, key]);
    }
  };

  const handleRemoveActivity = (key: ActivityKey) => {
    setSelectedActivities(selectedActivities.filter((k) => k !== key));
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      case 'stable':
        return '➡️';
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      case 'stable':
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (performedActivities.length === 0) {
    return null;
  }

  return (
    <Card
      variant="default"
      size="md"
      hoverable
      className="card-entrance"
      header={
        <div className="flex items-center gap-2">
          <span className="text-xl">⚖️</span>
          <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
            {lang === 'tr' ? 'Aktivite Karşılaştırması' : 'Activity Comparison'}
          </h2>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Activity Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {lang === 'tr'
              ? 'Karşılaştırılacak Aktiviteler (Max 4)'
              : 'Activities to Compare (Max 4)'}
          </label>
          <div className="flex flex-wrap gap-2">
            {performedActivities.map((key) => {
              const activity = activityDefinitions.find((a) => a.key === key);
              if (!activity) return null;

              const isSelected = selectedActivities.includes(key);

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => (isSelected ? handleRemoveActivity(key) : handleAddActivity(key))}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isSelected
                      ? 'bg-brand text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  disabled={!isSelected && selectedActivities.length >= 4}
                >
                  {activity.icon}{' '}
                  {lang === 'tr' ? activity.label : activity.labelEn || activity.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comparison Cards */}
        {activityStats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activityStats.map((stats) => (
              <div
                key={stats.activityKey}
                className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{stats.icon}</span>
                  <h3 className="text-base font-bold text-gray-950 dark:text-white">
                    {stats.label}
                  </h3>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {lang === 'tr' ? 'Toplam Puan' : 'Total Points'}
                    </span>
                    <span className="text-sm font-bold text-gray-950 dark:text-white">
                      {numberFormatter.format(stats.totalPoints)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {lang === 'tr' ? 'Toplam Aktivite' : 'Total Activities'}
                    </span>
                    <span className="text-sm font-bold text-gray-950 dark:text-white">
                      {stats.totalCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {lang === 'tr' ? 'Ortalama Puan' : 'Average Points'}
                    </span>
                    <span className="text-sm font-bold text-gray-950 dark:text-white">
                      {numberFormatter.format(Math.round(stats.averagePoints))}
                    </span>
                  </div>

                  {stats.bestDay && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {lang === 'tr' ? 'En İyi Gün' : 'Best Day'}
                      </span>
                      <span className="text-xs font-semibold text-gray-950 dark:text-white">
                        {format(stats.bestDay.date, 'dd MMM yyyy', { locale: dateLocale })}
                      </span>
                    </div>
                  )}

                  {stats.lastPerformed && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {lang === 'tr' ? 'Son Yapılan' : 'Last Performed'}
                      </span>
                      <span className="text-xs font-semibold text-gray-950 dark:text-white">
                        {format(stats.lastPerformed, 'dd MMM yyyy', { locale: dateLocale })}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {lang === 'tr' ? '30 Günlük Trend' : '30-Day Trend'}
                      </span>
                      <span className={`text-sm font-bold ${getTrendColor(stats.trend30Days)}`}>
                        {getTrendIcon(stats.trend30Days)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {lang === 'tr' ? '7 Günlük Trend' : '7-Day Trend'}
                      </span>
                      <span className={`text-sm font-bold ${getTrendColor(stats.trend7Days)}`}>
                        {getTrendIcon(stats.trend7Days)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedActivities.length === 0 && (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">⚖️</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lang === 'tr'
                ? 'Karşılaştırmak için aktiviteler seçin'
                : 'Select activities to compare'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
