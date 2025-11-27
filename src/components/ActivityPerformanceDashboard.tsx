'use client';

import { useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useActivityDefinitions } from '@/lib/activityStore';
import {
  calculateActivityPerformance,
  getPerformanceInsights,
  type ActivityPerformance,
} from '@/lib/activityPerformance';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export function ActivityPerformanceDashboard() {
  const { lang } = useI18n();
  const { activities, hydrated } = useActivities();
  const definitions = useActivityDefinitions();
  const isMobile = useIsMobile();

  const performances = useMemo(() => {
    if (!hydrated || activities.length === 0) return [];
    return calculateActivityPerformance(activities, 90);
  }, [activities, hydrated]);

  const insights = useMemo(() => getPerformanceInsights(performances), [performances]);

  const topPerformers = useMemo(() => {
    return performances.slice(0, 5);
  }, [performances]);

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );

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
        return 'text-green-600 dark:text-green-400';
      case 'declining':
        return 'text-red-600 dark:text-red-400';
      case 'stable':
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getConsistencyColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
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
            <span className="text-xl">📊</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Aktivite Performans Dashboard' : 'Activity Performance Dashboard'}
            </h2>
          </div>
          <Link
            href="/stats"
            className="text-xs sm:text-sm text-brand hover:text-brand-dark font-semibold"
          >
            {lang === 'tr' ? 'Detaylar →' : 'Details →'}
          </Link>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Quick Insights */}
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
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {numberFormatter.format(insights.topPerformer.totalPoints)}{' '}
                {lang === 'tr' ? 'puan' : 'points'}
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
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {Math.round(insights.mostConsistent.consistencyScore)}%
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
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {getTrendIcon(insights.mostImproved.recentTrend)}
              </div>
            </div>
          )}
        </div>

        {/* Top Performers List */}
        <div>
          <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-3">
            {lang === 'tr' ? 'En İyi Performans Gösterenler' : 'Top Performers'}
          </h3>
          <div className="space-y-2">
            {topPerformers.map((perf, index) => (
              <div
                key={perf.activityKey}
                className="p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-lg font-bold text-gray-400 dark:text-gray-600">
                      #{index + 1}
                    </span>
                    <span className="text-xl flex-shrink-0">{perf.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-gray-950 dark:text-white truncate">
                          {lang === 'tr' ? perf.label : perf.labelEn || perf.label}
                        </h4>
                        <span className={`text-xs ${getTrendColor(perf.recentTrend)}`}>
                          {getTrendIcon(perf.recentTrend)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {numberFormatter.format(perf.totalPoints)}{' '}
                          {lang === 'tr' ? 'puan' : 'pts'}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {numberFormatter.format(perf.totalCount)}{' '}
                          {lang === 'tr' ? 'kez' : 'times'}
                        </span>
                        <span
                          className={`text-xs font-semibold ${getConsistencyColor(perf.consistencyScore)}`}
                        >
                          {Math.round(perf.consistencyScore)}%{' '}
                          {lang === 'tr' ? 'tutarlılık' : 'consistency'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {lang === 'tr' ? 'Toplam Aktivite' : 'Total Activities'}
            </div>
            <div className="text-lg font-bold text-gray-950 dark:text-white">
              {performances.length}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {lang === 'tr' ? 'Toplam Puan' : 'Total Points'}
            </div>
            <div className="text-lg font-bold text-brand">
              {numberFormatter.format(performances.reduce((sum, p) => sum + p.totalPoints, 0))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {lang === 'tr' ? 'Ortalama Tutarlılık' : 'Avg Consistency'}
            </div>
            <div className="text-lg font-bold text-gray-950 dark:text-white">
              {performances.length > 0
                ? Math.round(
                    performances.reduce((sum, p) => sum + p.consistencyScore, 0) /
                      performances.length
                  )
                : 0}
              %
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {lang === 'tr' ? 'Gelişen' : 'Improving'}
            </div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {performances.filter((p) => p.recentTrend === 'improving').length}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
