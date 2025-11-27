'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { calculateActivityPerformance, type ActivityPerformance } from '@/lib/activityPerformance';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';

type ComparisonMetric =
  | 'totalPoints'
  | 'totalCount'
  | 'averagePoints'
  | 'consistencyScore'
  | 'weeklyFrequency';

export function ActivityComparisonMatrix() {
  const { lang } = useI18n();
  const { activities, hydrated } = useActivities();
  const isMobile = useIsMobile();

  const [selectedMetrics, setSelectedMetrics] = useState<ComparisonMetric[]>([
    'totalPoints',
    'totalCount',
  ]);
  const [maxActivities, setMaxActivities] = useState(5);

  const performances = useMemo(() => {
    if (!hydrated || activities.length === 0) return [];
    return calculateActivityPerformance(activities, 90);
  }, [activities, hydrated]);

  const topPerformances = useMemo(() => {
    return [...performances].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, maxActivities);
  }, [performances, maxActivities]);

  const getMetricLabel = (metric: ComparisonMetric) => {
    switch (metric) {
      case 'totalPoints':
        return lang === 'tr' ? 'Toplam Puan' : 'Total Points';
      case 'totalCount':
        return lang === 'tr' ? 'Toplam Sayı' : 'Total Count';
      case 'averagePoints':
        return lang === 'tr' ? 'Ortalama Puan' : 'Average Points';
      case 'consistencyScore':
        return lang === 'tr' ? 'Tutarlılık' : 'Consistency';
      case 'weeklyFrequency':
        return lang === 'tr' ? 'Haftalık Frekans' : 'Weekly Frequency';
    }
  };

  const getMetricValue = (perf: ActivityPerformance, metric: ComparisonMetric) => {
    switch (metric) {
      case 'totalPoints':
        return perf.totalPoints;
      case 'totalCount':
        return perf.totalCount;
      case 'averagePoints':
        return Math.round(perf.averagePoints);
      case 'consistencyScore':
        return Math.round(perf.consistencyScore);
      case 'weeklyFrequency':
        return perf.weeklyFrequency.toFixed(1);
    }
  };

  const getMetricMaxValue = (metric: ComparisonMetric) => {
    if (topPerformances.length === 0) return 1;
    return Math.max(
      ...topPerformances.map((p) => {
        const value = getMetricValue(p, metric);
        return typeof value === 'string' ? parseFloat(value) : value;
      }),
      1
    );
  };

  const getMetricColor = (metric: ComparisonMetric) => {
    switch (metric) {
      case 'totalPoints':
        return 'bg-blue-500';
      case 'totalCount':
        return 'bg-green-500';
      case 'averagePoints':
        return 'bg-purple-500';
      case 'consistencyScore':
        return 'bg-yellow-500';
      case 'weeklyFrequency':
        return 'bg-pink-500';
    }
  };

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );

  const toggleMetric = (metric: ComparisonMetric) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
    );
  };

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
              {lang === 'tr' ? 'Aktivite Karşılaştırma Matrisi' : 'Activity Comparison Matrix'}
            </h2>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Metric Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-950 dark:text-white mb-1">
            {lang === 'tr' ? 'Karşılaştırma Metrikleri' : 'Comparison Metrics'}
          </label>
          <div className="flex flex-wrap gap-2">
            {(
              [
                'totalPoints',
                'totalCount',
                'averagePoints',
                'consistencyScore',
                'weeklyFrequency',
              ] as ComparisonMetric[]
            ).map((metric) => (
              <button
                key={metric}
                onClick={() => toggleMetric(metric)}
                className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                  selectedMetrics.includes(metric)
                    ? 'border-brand bg-brand/10 dark:bg-brand/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="text-xs font-semibold text-gray-950 dark:text-white">
                  {getMetricLabel(metric)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Activity Count Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-950 dark:text-white mb-1">
            {lang === 'tr' ? 'Aktivite Sayısı' : 'Number of Activities'}
          </label>
          <div className="flex flex-wrap gap-2">
            {[3, 5, 8, 10].map((count) => (
              <button
                key={count}
                onClick={() => setMaxActivities(count)}
                className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                  maxActivities === count
                    ? 'border-brand bg-brand/10 dark:bg-brand/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="text-xs font-semibold text-gray-950 dark:text-white">{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Matrix */}
        {selectedMetrics.length > 0 && topPerformances.length > 0 && (
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="text-left p-2 text-xs font-semibold text-gray-950 dark:text-white">
                      {lang === 'tr' ? 'Aktivite' : 'Activity'}
                    </th>
                    {selectedMetrics.map((metric) => (
                      <th
                        key={metric}
                        className="text-center p-2 text-xs font-semibold text-gray-950 dark:text-white"
                      >
                        {getMetricLabel(metric)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topPerformances.map((perf, index) => {
                    const maxValues = selectedMetrics.reduce(
                      (acc, metric) => {
                        acc[metric] = getMetricMaxValue(metric);
                        return acc;
                      },
                      {} as Record<ComparisonMetric, number>
                    );

                    return (
                      <tr
                        key={perf.activityKey}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 dark:text-gray-600">
                              #{index + 1}
                            </span>
                            <span className="text-lg">{perf.icon}</span>
                            <span className="text-xs font-semibold text-gray-950 dark:text-white truncate">
                              {lang === 'tr' ? perf.label : perf.labelEn || perf.label}
                            </span>
                          </div>
                        </td>
                        {selectedMetrics.map((metric) => {
                          const value = getMetricValue(perf, metric);
                          const maxValue = maxValues[metric];
                          const percentage =
                            typeof value === 'string'
                              ? (parseFloat(value) / maxValue) * 100
                              : (value / maxValue) * 100;

                          return (
                            <td key={metric} className="p-2">
                              <div className="space-y-1">
                                <div className="text-xs font-bold text-gray-950 dark:text-white text-center">
                                  {typeof value === 'string'
                                    ? value
                                    : numberFormatter.format(value)}
                                  {metric === 'consistencyScore' && '%'}
                                  {metric === 'weeklyFrequency' &&
                                    ` ${lang === 'tr' ? '/hafta' : '/week'}`}
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${getMetricColor(metric)} transition-all duration-500`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedMetrics.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">⚖️</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lang === 'tr'
                ? 'Lütfen en az bir metrik seçin'
                : 'Please select at least one metric'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
