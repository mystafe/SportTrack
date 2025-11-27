'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useActivityDefinitions } from '@/lib/activityStore';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import {
  format,
  startOfDay,
  parseISO,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  getDay,
} from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';

type DistributionType = 'daily' | 'weekly' | 'monthly' | 'dayOfWeek' | 'hourOfDay';

export function ActivityPerformanceDistribution() {
  const { lang } = useI18n();
  const { activities, hydrated } = useActivities();
  const definitions = useActivityDefinitions();
  const isMobile = useIsMobile();
  const dateLocale = lang === 'tr' ? tr : enUS;

  const [selectedActivityKey, setSelectedActivityKey] = useState<string | null>(null);
  const [distributionType, setDistributionType] = useState<DistributionType>('daily');

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

  const chartData = useMemo(() => {
    if (!selectedActivity || !hydrated) return [];

    const activityRecords = activities.filter((a) => a.activityKey === selectedActivity);
    const now = new Date();

    switch (distributionType) {
      case 'daily': {
        const days = 30;
        const startDate = subDays(now, days);
        const dateRange = eachDayOfInterval({ start: startDate, end: now });

        return dateRange.map((date) => {
          const dayActivities = activityRecords.filter((a) => {
            const activityDate = startOfDay(parseISO(a.performedAt));
            return activityDate.getTime() === startOfDay(date).getTime();
          });

          return {
            date: format(date, 'dd MMM', { locale: dateLocale }),
            points: dayActivities.reduce((sum, a) => sum + a.points, 0),
            count: dayActivities.length,
          };
        });
      }

      case 'weekly': {
        const weeks = 12;
        const startDate = subDays(now, weeks * 7);
        const weekRange = eachWeekOfInterval({ start: startDate, end: now }, { weekStartsOn: 1 });

        return weekRange.map((weekStart) => {
          const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
          const weekActivities = activityRecords.filter((a) => {
            const activityDate = parseISO(a.performedAt);
            return activityDate >= weekStart && activityDate <= weekEnd;
          });

          return {
            date: format(weekStart, 'dd MMM', { locale: dateLocale }),
            points: weekActivities.reduce((sum, a) => sum + a.points, 0),
            count: weekActivities.length,
          };
        });
      }

      case 'monthly': {
        const months = 12;
        const startDate = subDays(now, months * 30);
        const monthRange = eachMonthOfInterval({ start: startDate, end: now });

        return monthRange.map((monthStart) => {
          const monthEnd = endOfMonth(monthStart);
          const monthActivities = activityRecords.filter((a) => {
            const activityDate = parseISO(a.performedAt);
            return activityDate >= monthStart && activityDate <= monthEnd;
          });

          return {
            date: format(monthStart, 'MMM yyyy', { locale: dateLocale }),
            points: monthActivities.reduce((sum, a) => sum + a.points, 0),
            count: monthActivities.length,
          };
        });
      }

      case 'dayOfWeek': {
        const dayMap = new Map<number, { points: number; count: number }>();
        for (let i = 0; i < 7; i++) {
          dayMap.set(i, { points: 0, count: 0 });
        }

        activityRecords.forEach((activity) => {
          const date = parseISO(activity.performedAt);
          const dayOfWeek = getDay(date);
          const existing = dayMap.get(dayOfWeek)!;
          existing.points += activity.points;
          existing.count += 1;
        });

        const dayNames =
          lang === 'tr'
            ? ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
            : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        return Array.from(dayMap.entries()).map(([day, data]) => ({
          date: dayNames[day],
          points: data.points,
          count: data.count,
        }));
      }

      case 'hourOfDay': {
        const hourMap = new Map<number, { points: number; count: number }>();
        for (let i = 0; i < 24; i++) {
          hourMap.set(i, { points: 0, count: 0 });
        }

        activityRecords.forEach((activity) => {
          const date = parseISO(activity.performedAt);
          const hour = date.getHours();
          const existing = hourMap.get(hour)!;
          existing.points += activity.points;
          existing.count += 1;
        });

        return Array.from(hourMap.entries()).map(([hour, data]) => ({
          date: `${hour}:00`,
          points: data.points,
          count: data.count,
        }));
      }

      default:
        return [];
    }
  }, [selectedActivity, activities, hydrated, distributionType, dateLocale, lang]);

  const selectedActivityDefinition = useMemo(() => {
    if (!selectedActivity) return null;
    return definitions.find((d) => d.key === selectedActivity);
  }, [selectedActivity, definitions]);

  const totalPoints = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.points, 0);
  }, [chartData]);

  const totalCount = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.count, 0);
  }, [chartData]);

  const averagePoints = useMemo(() => {
    return chartData.length > 0 ? totalPoints / chartData.length : 0;
  }, [chartData, totalPoints]);

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
            <span className="text-xl">📊</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Aktivite Performans Dağılımı' : 'Activity Performance Distribution'}
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

        {/* Distribution Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-950 dark:text-white mb-1">
            {lang === 'tr' ? 'Dağılım Tipi' : 'Distribution Type'}
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'daily', label: lang === 'tr' ? 'Günlük' : 'Daily' },
              { key: 'weekly', label: lang === 'tr' ? 'Haftalık' : 'Weekly' },
              { key: 'monthly', label: lang === 'tr' ? 'Aylık' : 'Monthly' },
              { key: 'dayOfWeek', label: lang === 'tr' ? 'Haftanın Günü' : 'Day of Week' },
              { key: 'hourOfDay', label: lang === 'tr' ? 'Günün Saati' : 'Hour of Day' },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setDistributionType(option.key as DistributionType)}
                className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                  distributionType === option.key
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
                  {lang === 'tr' ? 'Dağılım analizi' : 'Distribution analysis'}
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
                  {lang === 'tr' ? 'Ortalama' : 'Average'}
                </div>
                <div className="text-sm font-bold text-gray-950 dark:text-white">
                  {numberFormatter.format(Math.round(averagePoints))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chart */}
        {chartData.length > 0 && (
          <div>
            <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  stroke="currentColor"
                  angle={distributionType === 'daily' || distributionType === 'weekly' ? -45 : 0}
                  textAnchor={
                    distributionType === 'daily' || distributionType === 'weekly' ? 'end' : 'middle'
                  }
                  height={distributionType === 'daily' || distributionType === 'weekly' ? 80 : 40}
                  tick={{ fill: 'currentColor', fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis
                  stroke="currentColor"
                  tick={{ fill: 'currentColor', fontSize: isMobile ? 10 : 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--tw-bg-white)',
                    border: '1px solid var(--tw-border-gray-200)',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  labelStyle={{ color: 'var(--tw-text-gray-900)', fontWeight: '600' }}
                  formatter={(value: number, name: string) => {
                    if (name === 'points') {
                      return [numberFormatter.format(value), lang === 'tr' ? 'Puan' : 'Points'];
                    }
                    return [numberFormatter.format(value), lang === 'tr' ? 'Sayı' : 'Count'];
                  }}
                />
                <Legend />
                <Bar dataKey="points" fill="#0ea5e9" radius={[8, 8, 0, 0]} animationDuration={1000}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#0ea5e9" />
                  ))}
                </Bar>
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} animationDuration={1000}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-count-${index}`} fill="#10b981" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
}
