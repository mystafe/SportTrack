'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { calculateActivityPerformance, type ActivityPerformance } from '@/lib/activityPerformance';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
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

type ComparisonMetric = 'totalPoints' | 'totalCount' | 'averagePoints' | 'consistencyScore';

export function ActivityPerformanceComparison() {
  const { lang } = useI18n();
  const { activities, hydrated } = useActivities();
  const isMobile = useIsMobile();

  const [selectedMetric, setSelectedMetric] = useState<ComparisonMetric>('totalPoints');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [maxActivities, setMaxActivities] = useState(5);

  const performances = useMemo(() => {
    if (!hydrated || activities.length === 0) return [];
    return calculateActivityPerformance(activities, 90);
  }, [activities, hydrated]);

  const sortedPerformances = useMemo(() => {
    return [...performances].sort((a, b) => {
      switch (selectedMetric) {
        case 'totalPoints':
          return b.totalPoints - a.totalPoints;
        case 'totalCount':
          return b.totalCount - a.totalCount;
        case 'averagePoints':
          return b.averagePoints - a.averagePoints;
        case 'consistencyScore':
          return b.consistencyScore - a.consistencyScore;
        default:
          return 0;
      }
    });
  }, [performances, selectedMetric]);

  const topPerformances = useMemo(() => {
    return sortedPerformances.slice(0, maxActivities);
  }, [sortedPerformances, maxActivities]);

  const chartData = useMemo(() => {
    const dataToUse =
      selectedActivities.length > 0
        ? performances.filter((p) => selectedActivities.includes(p.activityKey))
        : topPerformances;

    return dataToUse.map((perf) => ({
      name: lang === 'tr' ? perf.label : perf.labelEn || perf.label,
      icon: perf.icon,
      totalPoints: perf.totalPoints,
      totalCount: perf.totalCount,
      averagePoints: Math.round(perf.averagePoints),
      consistencyScore: Math.round(perf.consistencyScore),
    }));
  }, [topPerformances, selectedActivities, performances, lang]);

  const getMetricLabel = (metric: ComparisonMetric) => {
    switch (metric) {
      case 'totalPoints':
        return lang === 'tr' ? 'Toplam Puan' : 'Total Points';
      case 'totalCount':
        return lang === 'tr' ? 'Toplam Sayı' : 'Total Count';
      case 'averagePoints':
        return lang === 'tr' ? 'Ortalama Puan' : 'Average Points';
      case 'consistencyScore':
        return lang === 'tr' ? 'Tutarlılık Skoru' : 'Consistency Score';
    }
  };

  const getMetricValue = (perf: ActivityPerformance) => {
    switch (selectedMetric) {
      case 'totalPoints':
        return perf.totalPoints;
      case 'totalCount':
        return perf.totalCount;
      case 'averagePoints':
        return Math.round(perf.averagePoints);
      case 'consistencyScore':
        return Math.round(perf.consistencyScore);
    }
  };

  const getMetricColor = (metric: ComparisonMetric) => {
    switch (metric) {
      case 'totalPoints':
        return '#0ea5e9'; // brand blue
      case 'totalCount':
        return '#10b981'; // green
      case 'averagePoints':
        return '#8b5cf6'; // purple
      case 'consistencyScore':
        return '#f59e0b'; // amber
    }
  };

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );

  if (!hydrated || performances.length === 0) {
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
            <span className="text-xl">⚖️</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {lang === 'tr'
                ? 'Aktivite Performans Karşılaştırması'
                : 'Activity Performance Comparison'}
            </h2>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Metric Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-950 dark:text-white mb-2">
            {lang === 'tr' ? 'Karşılaştırma Metriği' : 'Comparison Metric'}
          </label>
          <div className="flex flex-wrap gap-2">
            {(
              [
                'totalPoints',
                'totalCount',
                'averagePoints',
                'consistencyScore',
              ] as ComparisonMetric[]
            ).map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                  selectedMetric === metric
                    ? 'border-brand bg-brand/10 dark:bg-brand/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-xs font-semibold text-gray-950 dark:text-white">
                  {getMetricLabel(metric)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Activity Count Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-950 dark:text-white mb-2">
            {lang === 'tr' ? 'Gösterilecek Aktivite Sayısı' : 'Number of Activities to Show'}
          </label>
          <div className="flex flex-wrap gap-2">
            {[3, 5, 10, 15].map((count) => (
              <button
                key={count}
                onClick={() => setMaxActivities(count)}
                className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                  maxActivities === count
                    ? 'border-brand bg-brand/10 dark:bg-brand/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-xs font-semibold text-gray-950 dark:text-white">{count}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div>
            <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-30" />
                <XAxis
                  dataKey="name"
                  stroke="currentColor"
                  angle={-45}
                  textAnchor="end"
                  height={80}
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
                  formatter={(value: number) => numberFormatter.format(value)}
                />
                <Legend />
                <Bar
                  dataKey={
                    selectedMetric === 'totalPoints'
                      ? 'totalPoints'
                      : selectedMetric === 'totalCount'
                        ? 'totalCount'
                        : selectedMetric === 'averagePoints'
                          ? 'averagePoints'
                          : 'consistencyScore'
                  }
                  fill={getMetricColor(selectedMetric)}
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getMetricColor(selectedMetric)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Performance List */}
        <div>
          <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-3">
            {lang === 'tr' ? 'Detaylı Performans Listesi' : 'Detailed Performance List'}
          </h3>
          <div className="space-y-2">
            {topPerformances.map((perf, index) => {
              const value = getMetricValue(perf);
              const maxValue = topPerformances.length > 0 ? getMetricValue(topPerformances[0]) : 1;
              const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

              return (
                <div
                  key={perf.activityKey}
                  className="p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-lg flex-shrink-0">{perf.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-gray-950 dark:text-white truncate">
                          {lang === 'tr' ? perf.label : perf.labelEn || perf.label}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          #{index + 1} · {getMetricLabel(selectedMetric)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-brand">
                        {numberFormatter.format(value)}
                      </div>
                      {selectedMetric === 'consistencyScore' && (
                        <div className="text-xs text-gray-600 dark:text-gray-400">/ 100</div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r transition-all duration-500`}
                      style={{
                        width: `${percentage}%`,
                        background: `linear-gradient(to right, ${getMetricColor(selectedMetric)}, ${getMetricColor(selectedMetric)}88)`,
                      }}
                    />
                  </div>

                  {/* Additional Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {lang === 'tr' ? 'Toplam' : 'Total'}
                      </div>
                      <div className="text-sm font-semibold text-gray-950 dark:text-white">
                        {numberFormatter.format(perf.totalCount)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {lang === 'tr' ? 'Ortalama' : 'Avg'}
                      </div>
                      <div className="text-sm font-semibold text-gray-950 dark:text-white">
                        {numberFormatter.format(Math.round(perf.averagePoints))}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {lang === 'tr' ? 'Tutarlılık' : 'Consistency'}
                      </div>
                      <div className="text-sm font-semibold text-gray-950 dark:text-white">
                        {numberFormatter.format(Math.round(perf.consistencyScore))}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
