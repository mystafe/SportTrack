'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { calculateActivityTrends, type ActivityTypeTrend } from '@/lib/activityTrendUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';

export function ActivityTrendAnalysis() {
  const { t, lang } = useI18n();
  const { activities } = useActivities();
  const isMobile = useIsMobile();
  const dateLocale = lang === 'tr' ? tr : enUS;
  const [selectedDays, setSelectedDays] = useState<7 | 30 | 90>(30);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );

  const trends = useMemo(
    () => calculateActivityTrends(activities, selectedDays),
    [activities, selectedDays]
  );

  // Auto-select top 3 activities if none selected
  const displayedTrends = useMemo(() => {
    if (selectedActivities.length === 0) {
      return trends.slice(0, 3);
    }
    return trends.filter((t) => selectedActivities.includes(t.activityKey));
  }, [trends, selectedActivities]);

  const chartData = useMemo(() => {
    const dataMap = new Map<string, Record<string, number>>();

    displayedTrends.forEach((trend) => {
      trend.dailyData.forEach((day) => {
        const existing = dataMap.get(day.date) || {};
        existing[trend.activityKey] = day.points;
        dataMap.set(day.date, existing);
      });
    });

    return Array.from(dataMap.entries())
      .map(([date, points]) => ({
        date,
        dateLabel: format(
          parseISO(date),
          selectedDays === 7 ? 'EEE' : selectedDays === 30 ? 'd MMM' : 'MMM d',
          {
            locale: dateLocale,
          }
        ),
        ...points,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [displayedTrends, selectedDays, dateLocale]);

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  const handleToggleActivity = (activityKey: string) => {
    if (selectedActivities.includes(activityKey)) {
      setSelectedActivities(selectedActivities.filter((k) => k !== activityKey));
    } else if (selectedActivities.length < 5) {
      setSelectedActivities([...selectedActivities, activityKey]);
    }
  };

  if (trends.length === 0) {
    return null;
  }

  return (
    <Card
      variant="default"
      size="md"
      hoverable
      className="card-entrance"
      header={
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">📈</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Aktivite Trend Analizi' : 'Activity Trend Analysis'}
            </h2>
          </div>
          <div className="flex gap-2">
            {([7, 30, 90] as const).map((days) => (
              <Button
                key={days}
                variant={selectedDays === days ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedDays(days)}
              >
                {days} {lang === 'tr' ? 'gün' : 'days'}
              </Button>
            ))}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Activity Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {lang === 'tr' ? 'Gösterilecek Aktiviteler (Max 5)' : 'Activities to Display (Max 5)'}
          </label>
          <div className="flex flex-wrap gap-2">
            {trends.slice(0, 10).map((trend) => {
              const isSelected =
                selectedActivities.includes(trend.activityKey) ||
                (selectedActivities.length === 0 && trends.indexOf(trend) < 3);

              return (
                <button
                  key={trend.activityKey}
                  type="button"
                  onClick={() => handleToggleActivity(trend.activityKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    isSelected
                      ? 'bg-brand text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  disabled={!isSelected && selectedActivities.length >= 5}
                >
                  {trend.icon} {trend.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trend Chart */}
        {chartData.length > 0 && displayedTrends.length > 0 && (
          <div>
            <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-30" />
                <XAxis
                  dataKey="dateLabel"
                  stroke="currentColor"
                  tick={{ fill: 'currentColor', fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis stroke="currentColor" tick={{ fill: 'currentColor', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--tw-bg-white)',
                    border: '1px solid var(--tw-border-gray-200)',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value: number) => numberFormatter.format(value)}
                />
                <Legend />
                {displayedTrends.map((trend, index) => (
                  <Line
                    key={trend.activityKey}
                    type="monotone"
                    dataKey={trend.activityKey}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                    name={`${trend.icon} ${trend.label}`}
                    animationDuration={300}
                    className="transition-all duration-300 ease-out"
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Trend Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayedTrends.map((trend) => {
            const firstHalf = trend.dailyData.slice(0, Math.floor(trend.dailyData.length / 2));
            const secondHalf = trend.dailyData.slice(Math.floor(trend.dailyData.length / 2));

            const firstHalfPoints = firstHalf.reduce((sum, d) => sum + d.points, 0);
            const secondHalfPoints = secondHalf.reduce((sum, d) => sum + d.points, 0);

            const change =
              firstHalfPoints > 0
                ? ((secondHalfPoints - firstHalfPoints) / firstHalfPoints) * 100
                : secondHalfPoints > 0
                  ? 100
                  : 0;

            const trendDirection = change > 10 ? 'up' : change < -10 ? 'down' : 'stable';

            return (
              <div
                key={trend.activityKey}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{trend.icon}</span>
                  <h3 className="text-sm font-bold text-gray-950 dark:text-white">{trend.label}</h3>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {lang === 'tr' ? 'Toplam Puan' : 'Total Points'}
                    </span>
                    <span className="font-semibold text-gray-950 dark:text-white">
                      {numberFormatter.format(trend.totalPoints)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {lang === 'tr' ? 'Ortalama/Gün' : 'Avg/Day'}
                    </span>
                    <span className="font-semibold text-gray-950 dark:text-white">
                      {numberFormatter.format(trend.averagePerDay)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      {lang === 'tr' ? 'Trend' : 'Trend'}
                    </span>
                    <span
                      className={`font-semibold ${
                        trendDirection === 'up'
                          ? 'text-green-600 dark:text-green-400'
                          : trendDirection === 'down'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {trendDirection === 'up' ? '📈' : trendDirection === 'down' ? '📉' : '➡️'}{' '}
                      {change > 0 ? '+' : ''}
                      {change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
