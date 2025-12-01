'use client';

import { useMemo, useState, memo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import {
  calculateActivityTrends,
  getTopActivityTypes,
  type ActivityTypeTrend as ActivityTypeTrendData,
} from '@/lib/activityTrendUtils';
import { useActivityDefinitions } from '@/lib/settingsStore';
import { getActivityLabel } from '@/lib/activityUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { Button } from '@/components/ui/Button';

export const ActivityTypeTrend = memo(function ActivityTypeTrend() {
  const { t, lang } = useI18n();
  const { activities, hydrated } = useActivities();
  const definitions = useActivityDefinitions();
  const isMobile = useIsMobile();
  const dateLocale = lang === 'tr' ? tr : enUS;
  const [trendDays, setTrendDays] = useState<7 | 30 | 90>(30);

  const trends = useMemo(() => {
    if (!hydrated || activities.length === 0) return [];
    return calculateActivityTrends(activities, trendDays);
  }, [activities, hydrated, trendDays]);

  const topTrends = useMemo(() => {
    return getTopActivityTypes(trends, 5);
  }, [trends]);

  const chartData = useMemo(() => {
    if (topTrends.length === 0) return [];

    // Create a map of dates to data points
    const dateMap = new Map<string, Record<string, number | string>>();

    topTrends.forEach((trend) => {
      trend.dailyData.forEach((day) => {
        if (!dateMap.has(day.date)) {
          dateMap.set(day.date, { date: day.date });
        }
        const dayData = dateMap.get(day.date)!;
        dayData[trend.activityKey] = day.points;
      });
    });

    return Array.from(dateMap.values())
      .sort((a, b) => (a.date as string).localeCompare(b.date as string))
      .map((item) => ({
        ...item,
        dateLabel: format(parseISO(item.date as string), 'd MMM', { locale: dateLocale }),
      }));
  }, [topTrends, dateLocale]);

  if (!hydrated) {
    return null;
  }

  if (trends.length === 0) {
    return (
      <section className="mt-8 spacing-md">
        <div>
          <h2 className="text-heading-3 text-gray-900 dark:text-white">
            {t('activityTrend.title')}
          </h2>
          <p className="text-body text-gray-600 dark:text-gray-400 mt-1">
            {t('activityTrend.subtitle')}
          </p>
        </div>
        <div className="card-entrance glass-effect card-3d rounded-xl border-2 border-white/20 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-6 shadow-lg">
          <p className="text-body text-gray-600 dark:text-gray-400 text-center">
            {t('activityTrend.noData')}
          </p>
        </div>
      </section>
    );
  }

  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  return (
    <section className="mt-8 spacing-md">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-heading-3 text-gray-900 dark:text-white">
            {t('activityTrend.title')}
          </h2>
          <p className="text-body text-gray-600 dark:text-gray-400 mt-1">
            {t('activityTrend.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {([7, 30, 90] as const).map((days) => (
            <Button
              key={days}
              type="button"
              variant={trendDays === days ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTrendDays(days)}
            >
              {days} {lang === 'tr' ? 'gün' : 'days'}
            </Button>
          ))}
        </div>
      </div>

      <div className="card-entrance glass-effect card-3d rounded-xl border-2 border-white/20 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
        {chartData.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {t('activityTrend.noData')}
          </p>
        ) : (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 350}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="dateLabel"
                  stroke="#6b7280"
                  fontSize={isMobile ? 10 : 12}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis stroke="#6b7280" fontSize={isMobile ? 10 : 12} tick={{ fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.75rem',
                    boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                    fontSize: isMobile ? '12px' : '14px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
                {topTrends.map((trend, index) => {
                  const definition = definitions.find((d) => d.key === trend.activityKey);
                  const label = definition ? getActivityLabel(definition, lang) : trend.label;
                  return (
                    <Line
                      key={trend.activityKey}
                      type="monotone"
                      dataKey={trend.activityKey}
                      name={`${trend.icon} ${label}`}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>

            {/* Summary Cards */}
            <div
              className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} gap-3 mt-4`}
            >
              {topTrends.map((trend, index) => (
                <div
                  key={trend.activityKey}
                  className="rounded-lg glass-effect card-3d border-2 border-white/20 dark:border-gray-800/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{trend.icon}</span>
                    <span
                      className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-900 dark:text-white`}
                    >
                      {(() => {
                        const definition = definitions.find((d) => d.key === trend.activityKey);
                        return definition ? getActivityLabel(definition, lang) : trend.label;
                      })()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>{t('activityTrend.totalCount')}</span>
                      <span className="font-medium">{trend.totalCount}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>{t('activityTrend.totalPoints')}</span>
                      <span className="font-medium text-brand">
                        {trend.totalPoints.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>{t('activityTrend.avgPerDay')}</span>
                      <span className="font-medium">{trend.averagePerDay}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});
