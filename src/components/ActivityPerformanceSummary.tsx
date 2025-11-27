'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import {
  calculateActivityPerformance,
  getPerformanceInsights,
  type ActivityPerformance,
} from '@/lib/activityPerformance';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import { format, parseISO } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';

type SortOption =
  | 'totalPoints'
  | 'totalCount'
  | 'averagePoints'
  | 'consistencyScore'
  | 'recentTrend';

export function ActivityPerformanceSummary() {
  const { lang } = useI18n();
  const { activities, hydrated } = useActivities();
  const isMobile = useIsMobile();
  const dateLocale = lang === 'tr' ? tr : enUS;

  const [sortBy, setSortBy] = useState<SortOption>('totalPoints');
  const [filterTrend, setFilterTrend] = useState<'all' | 'improving' | 'stable' | 'declining'>(
    'all'
  );

  const performances = useMemo(() => {
    if (!hydrated || activities.length === 0) return [];
    return calculateActivityPerformance(activities, 90);
  }, [activities, hydrated]);

  const filteredPerformances = useMemo(() => {
    let filtered = [...performances];

    if (filterTrend !== 'all') {
      filtered = filtered.filter((p) => p.recentTrend === filterTrend);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'totalPoints':
          return b.totalPoints - a.totalPoints;
        case 'totalCount':
          return b.totalCount - a.totalCount;
        case 'averagePoints':
          return b.averagePoints - a.averagePoints;
        case 'consistencyScore':
          return b.consistencyScore - a.consistencyScore;
        case 'recentTrend':
          const trendOrder = { improving: 3, stable: 2, declining: 1 };
          return trendOrder[b.recentTrend] - trendOrder[a.recentTrend];
        default:
          return 0;
      }
    });
  }, [performances, sortBy, filterTrend]);

  const insights = useMemo(() => getPerformanceInsights(performances), [performances]);

  const getTrendIcon = (trend: ActivityPerformance['recentTrend']) => {
    switch (trend) {
      case 'improving':
        return '📈';
      case 'declining':
        return '📉';
      case 'stable':
        return '➡️';
    }
  };

  const getTrendColor = (trend: ActivityPerformance['recentTrend']) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'declining':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'stable':
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getConsistencyColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
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
            <span className="text-xl">📊</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Aktivite Performans Özeti' : 'Activity Performance Summary'}
            </h2>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Quick Insights */}
        {(insights.topPerformer || insights.mostConsistent || insights.mostImproved) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {insights.topPerformer && (
              <div className="p-3 rounded-lg border-2 border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🏆</span>
                  <span className="text-xs font-semibold text-gray-950 dark:text-white">
                    {lang === 'tr' ? 'En İyi' : 'Top'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm">{insights.topPerformer.icon}</span>
                  <span className="text-xs font-bold text-gray-950 dark:text-white truncate">
                    {lang === 'tr'
                      ? insights.topPerformer.label
                      : insights.topPerformer.labelEn || insights.topPerformer.label}
                  </span>
                </div>
              </div>
            )}

            {insights.mostConsistent && (
              <div className="p-3 rounded-lg border-2 border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🎯</span>
                  <span className="text-xs font-semibold text-gray-950 dark:text-white">
                    {lang === 'tr' ? 'En Tutarlı' : 'Consistent'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm">{insights.mostConsistent.icon}</span>
                  <span className="text-xs font-bold text-gray-950 dark:text-white truncate">
                    {lang === 'tr'
                      ? insights.mostConsistent.label
                      : insights.mostConsistent.labelEn || insights.mostConsistent.label}
                  </span>
                </div>
              </div>
            )}

            {insights.mostImproved && (
              <div className="p-3 rounded-lg border-2 border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">📈</span>
                  <span className="text-xs font-semibold text-gray-950 dark:text-white">
                    {lang === 'tr' ? 'Gelişen' : 'Improving'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm">{insights.mostImproved.icon}</span>
                  <span className="text-xs font-bold text-gray-950 dark:text-white truncate">
                    {lang === 'tr'
                      ? insights.mostImproved.label
                      : insights.mostImproved.labelEn || insights.mostImproved.label}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-semibold text-gray-950 dark:text-white mb-1">
              {lang === 'tr' ? 'Sıralama' : 'Sort By'}
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { key: 'totalPoints', label: lang === 'tr' ? 'Toplam Puan' : 'Total Points' },
                  { key: 'totalCount', label: lang === 'tr' ? 'Toplam Sayı' : 'Total Count' },
                  {
                    key: 'averagePoints',
                    label: lang === 'tr' ? 'Ortalama Puan' : 'Average Points',
                  },
                  { key: 'consistencyScore', label: lang === 'tr' ? 'Tutarlılık' : 'Consistency' },
                  { key: 'recentTrend', label: lang === 'tr' ? 'Trend' : 'Trend' },
                ] as Array<{ key: SortOption; label: string }>
              ).map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSortBy(option.key)}
                  className={`px-2 py-1 rounded text-xs font-semibold transition-all duration-200 ${
                    sortBy === option.key
                      ? 'bg-brand text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-950 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-950 dark:text-white mb-1">
              {lang === 'tr' ? 'Trend Filtresi' : 'Trend Filter'}
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { key: 'all', label: lang === 'tr' ? 'Tümü' : 'All' },
                  { key: 'improving', label: lang === 'tr' ? 'Gelişen' : 'Improving' },
                  { key: 'stable', label: lang === 'tr' ? 'Stabil' : 'Stable' },
                  { key: 'declining', label: lang === 'tr' ? 'Düşen' : 'Declining' },
                ] as Array<{ key: typeof filterTrend; label: string }>
              ).map((option) => (
                <button
                  key={option.key}
                  onClick={() => setFilterTrend(option.key)}
                  className={`px-2 py-1 rounded text-xs font-semibold transition-all duration-200 ${
                    filterTrend === option.key
                      ? 'bg-brand text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-950 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Performance List */}
        <div className="space-y-2">
          {filteredPerformances.map((perf, index) => (
            <div
              key={perf.activityKey}
              className="p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xl flex-shrink-0">{perf.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-950 dark:text-white truncate">
                        {lang === 'tr' ? perf.label : perf.labelEn || perf.label}
                      </h3>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${getTrendColor(perf.recentTrend)}`}
                      >
                        {getTrendIcon(perf.recentTrend)}
                      </span>
                    </div>
                    {perf.lastPerformed && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {lang === 'tr' ? 'Son yapılan' : 'Last performed'}:{' '}
                        {format(perf.lastPerformed, 'dd MMM yyyy', { locale: dateLocale })}
                        {perf.daysSinceLastPerformed !== null &&
                          perf.daysSinceLastPerformed > 0 && (
                            <span className="ml-1">
                              ({perf.daysSinceLastPerformed}{' '}
                              {lang === 'tr' ? 'gün önce' : 'days ago'})
                            </span>
                          )}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-brand">
                    {numberFormatter.format(perf.totalPoints)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {lang === 'tr' ? 'puan' : 'points'}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
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
                  <div
                    className={`text-sm font-semibold ${getConsistencyColor(perf.consistencyScore)}`}
                  >
                    {numberFormatter.format(Math.round(perf.consistencyScore))}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {lang === 'tr' ? 'Haftalık' : 'Weekly'}
                  </div>
                  <div className="text-sm font-semibold text-gray-950 dark:text-white">
                    {perf.weeklyFrequency.toFixed(1)}
                  </div>
                </div>
              </div>

              {/* Best Day */}
              {perf.bestDay && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      {lang === 'tr' ? 'En iyi gün' : 'Best day'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-950 dark:text-white">
                        {format(perf.bestDay.date, 'dd MMM yyyy', { locale: dateLocale })}
                      </span>
                      <span className="font-semibold text-brand">
                        {numberFormatter.format(perf.bestDay.points)}{' '}
                        {lang === 'tr' ? 'puan' : 'pts'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPerformances.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lang === 'tr'
                ? 'Filtreye uygun aktivite bulunamadı'
                : 'No activities match the filter'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
