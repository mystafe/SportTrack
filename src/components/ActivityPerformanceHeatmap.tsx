'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useActivityDefinitions } from '@/lib/activityStore';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import {
  format,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  startOfDay,
  parseISO,
  subMonths,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { enUS, tr } from 'date-fns/locale';

export function ActivityPerformanceHeatmap() {
  const { lang } = useI18n();
  const { activities, hydrated } = useActivities();
  const definitions = useActivityDefinitions();
  const isMobile = useIsMobile();
  const dateLocale = lang === 'tr' ? tr : enUS;

  const [selectedActivityKey, setSelectedActivityKey] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'year' | '6months' | '3months'>('year');

  const activityKeys = useMemo(() => {
    const keys = new Set<string>();
    activities.forEach((a) => keys.add(a.activityKey));
    return Array.from(keys).slice(0, 8);
  }, [activities]);

  const selectedActivity = useMemo(() => {
    if (!selectedActivityKey && activityKeys.length > 0) {
      return activityKeys[0];
    }
    return selectedActivityKey;
  }, [selectedActivityKey, activityKeys]);

  const heatmapData = useMemo(() => {
    if (!selectedActivity || !hydrated) return [];

    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (timeRange) {
      case 'year':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      case '6months':
        startDate = subMonths(now, 6);
        break;
      case '3months':
        startDate = subMonths(now, 3);
        break;
    }

    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    const activityRecords = activities.filter(
      (a) =>
        a.activityKey === selectedActivity &&
        parseISO(a.performedAt) >= startDate &&
        parseISO(a.performedAt) <= endDate
    );

    const pointsMap = new Map<string, number>();
    const countMap = new Map<string, number>();

    activityRecords.forEach((activity) => {
      const date = startOfDay(parseISO(activity.performedAt));
      const key = format(date, 'yyyy-MM-dd');
      pointsMap.set(key, (pointsMap.get(key) || 0) + activity.points);
      countMap.set(key, (countMap.get(key) || 0) + 1);
    });

    // Calculate max points for intensity scaling
    const maxPoints = Math.max(...Array.from(pointsMap.values()), 1);

    return allDays.map((day) => {
      const key = format(day, 'yyyy-MM-dd');
      const points = pointsMap.get(key) || 0;
      const count = countMap.get(key) || 0;

      // Calculate intensity (0-4) based on points relative to max
      let intensity = 0;
      if (points > 0) {
        const ratio = points / maxPoints;
        if (ratio >= 0.8) intensity = 4;
        else if (ratio >= 0.6) intensity = 3;
        else if (ratio >= 0.4) intensity = 2;
        else intensity = 1;
      }

      return {
        date: day,
        key,
        points,
        count,
        intensity,
      };
    });
  }, [selectedActivity, activities, hydrated, timeRange]);

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 4:
        return 'bg-green-600 dark:bg-green-500';
      case 3:
        return 'bg-green-400 dark:bg-green-600';
      case 2:
        return 'bg-yellow-400 dark:bg-yellow-600';
      case 1:
        return 'bg-gray-300 dark:bg-gray-600';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  // Group by weeks
  const weeks = useMemo(() => {
    const weekGroups: Array<typeof heatmapData> = [];
    let currentWeek: typeof heatmapData = [];

    for (const day of heatmapData) {
      const dayOfWeek = day.date.getDay();
      currentWeek.push(day);

      if (dayOfWeek === 6 || day === heatmapData[heatmapData.length - 1]) {
        weekGroups.push([...currentWeek]);
        currentWeek = [];
      }
    }

    return weekGroups;
  }, [heatmapData]);

  const selectedActivityDefinition = useMemo(() => {
    if (!selectedActivity) return null;
    return definitions.find((d) => d.key === selectedActivity);
  }, [selectedActivity, definitions]);

  const totalPoints = useMemo(() => {
    return heatmapData.reduce((sum, day) => sum + day.points, 0);
  }, [heatmapData]);

  const totalCount = useMemo(() => {
    return heatmapData.reduce((sum, day) => sum + day.count, 0);
  }, [heatmapData]);

  const daysWithActivity = useMemo(() => {
    return heatmapData.filter((day) => day.points > 0).length;
  }, [heatmapData]);

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );

  if (!hydrated || activityKeys.length === 0) {
    return null;
  }

  return (
    <Card
      variant="default"
      size="md"
      hoverable
      className="card-entrance"
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Aktivite Performans Heatmap' : 'Activity Performance Heatmap'}
            </h2>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Activity Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-950 dark:text-white mb-1">
            {lang === 'tr' ? 'Aktivite Seç' : 'Select Activity'}
          </label>
          <div className="flex flex-wrap gap-2">
            {activityKeys.map((key) => {
              const def = definitions.find((d) => d.key === key);
              const isSelected = key === selectedActivity;

              return (
                <button
                  key={key}
                  onClick={() => setSelectedActivityKey(key)}
                  className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-brand bg-brand/10 dark:bg-brand/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{def?.icon || '🏃'}</span>
                    <span className="text-xs font-semibold text-gray-950 dark:text-white">
                      {def ? (lang === 'tr' ? def.label : def.labelEn || def.label) : key}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Range Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-950 dark:text-white mb-1">
            {lang === 'tr' ? 'Zaman Aralığı' : 'Time Range'}
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'year', label: lang === 'tr' ? 'Yıl' : 'Year' },
              { key: '6months', label: lang === 'tr' ? '6 Ay' : '6 Months' },
              { key: '3months', label: lang === 'tr' ? '3 Ay' : '3 Months' },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setTimeRange(option.key as typeof timeRange)}
                className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                  timeRange === option.key
                    ? 'border-brand bg-brand/10 dark:bg-brand/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="text-xs font-semibold text-gray-950 dark:text-white">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        {selectedActivityDefinition && (
          <div className="p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{selectedActivityDefinition.icon}</span>
              <div>
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">
                  {lang === 'tr'
                    ? selectedActivityDefinition.label
                    : selectedActivityDefinition.labelEn || selectedActivityDefinition.label}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {lang === 'tr' ? 'Seçili zaman aralığı' : 'Selected time range'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {lang === 'tr' ? 'Toplam Puan' : 'Total Points'}
                </div>
                <div className="text-sm font-bold text-brand">
                  {numberFormatter.format(totalPoints)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {lang === 'tr' ? 'Toplam Sayı' : 'Total Count'}
                </div>
                <div className="text-sm font-bold text-gray-950 dark:text-white">
                  {numberFormatter.format(totalCount)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {lang === 'tr' ? 'Aktif Günler' : 'Active Days'}
                </div>
                <div className="text-sm font-bold text-gray-950 dark:text-white">
                  {numberFormatter.format(daysWithActivity)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Heatmap */}
        {heatmapData.length > 0 && (
          <div>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <div
                  className={`grid ${isMobile ? 'grid-cols-7' : 'grid-cols-[repeat(53,minmax(0,1fr))]'} gap-1`}
                >
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.map((day, dayIndex) => (
                        <div
                          key={day.key}
                          className={`w-3 h-3 ${getIntensityColor(day.intensity)} rounded-sm transition-all hover:scale-125 hover:z-10 cursor-pointer`}
                          title={`${format(day.date, 'dd MMM yyyy', { locale: dateLocale })}: ${day.points} ${lang === 'tr' ? 'puan' : 'points'} · ${day.count} ${lang === 'tr' ? 'kez' : 'times'}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
              <span>{lang === 'tr' ? 'Daha az' : 'Less'}</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm" />
                <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-sm" />
                <div className="w-3 h-3 bg-yellow-400 dark:bg-yellow-600 rounded-sm" />
                <div className="w-3 h-3 bg-green-400 dark:bg-green-600 rounded-sm" />
                <div className="w-3 h-3 bg-green-600 dark:bg-green-500 rounded-sm" />
              </div>
              <span>{lang === 'tr' ? 'Daha fazla' : 'More'}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
