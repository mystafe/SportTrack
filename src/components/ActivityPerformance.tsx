'use client';

import { useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import {
  calculateActivityPerformance,
  getPerformanceInsights,
  type ActivityPerformance,
} from '@/lib/activityPerformance';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import { format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';

export function ActivityPerformanceAnalysis() {
  const { t, lang } = useI18n();
  const { activities } = useActivities();
  const isMobile = useIsMobile();
  const dateLocale = lang === 'tr' ? tr : enUS;

  const performances = useMemo(() => calculateActivityPerformance(activities, 90), [activities]);
  const insights = useMemo(() => getPerformanceInsights(performances), [performances]);

  if (performances.length === 0) {
    return null;
  }

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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Insights Section */}
      {(insights.topPerformer || insights.mostConsistent || insights.mostImproved) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {insights.topPerformer && (
            <Card
              variant="default"
              size="sm"
              hoverable
              className="card-entrance border-2 border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🏆</span>
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">
                  {lang === 'tr' ? 'En İyi Performans' : 'Top Performer'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{insights.topPerformer.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-950 dark:text-white truncate">
                    {lang === 'tr'
                      ? insights.topPerformer.label
                      : insights.topPerformer.labelEn || insights.topPerformer.label}
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {insights.topPerformer.totalPoints.toLocaleString(
                      lang === 'tr' ? 'tr-TR' : 'en-US'
                    )}{' '}
                    {lang === 'tr' ? 'puan' : 'points'}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {insights.mostConsistent && (
            <Card
              variant="default"
              size="sm"
              hoverable
              className="card-entrance border-2 border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎯</span>
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">
                  {lang === 'tr' ? 'En Tutarlı' : 'Most Consistent'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{insights.mostConsistent.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-950 dark:text-white truncate">
                    {lang === 'tr'
                      ? insights.mostConsistent.label
                      : insights.mostConsistent.labelEn || insights.mostConsistent.label}
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {Math.round(insights.mostConsistent.consistencyScore)}%{' '}
                    {lang === 'tr' ? 'tutarlılık' : 'consistency'}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {insights.mostImproved && (
            <Card
              variant="default"
              size="sm"
              hoverable
              className="card-entrance border-2 border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🚀</span>
                <h3 className="text-sm font-bold text-gray-950 dark:text-white">
                  {lang === 'tr' ? 'En Çok Gelişen' : 'Most Improved'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{insights.mostImproved.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-950 dark:text-white truncate">
                    {lang === 'tr'
                      ? insights.mostImproved.label
                      : insights.mostImproved.labelEn || insights.mostImproved.label}
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {getTrendIcon(insights.mostImproved.recentTrend)}{' '}
                    {lang === 'tr' ? 'Gelişiyor' : 'Improving'}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Needs Attention */}
      {insights.needsAttention.length > 0 && (
        <Card
          variant="default"
          size="md"
          hoverable
          className="card-entrance border-2 border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">⚠️</span>
            <h3 className="text-base sm:text-lg font-bold text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Dikkat Gerektiren Aktiviteler' : 'Activities Needing Attention'}
            </h3>
          </div>
          <div className="space-y-2">
            {insights.needsAttention.slice(0, 3).map((activity) => (
              <div
                key={activity.activityKey}
                className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-gray-800"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{activity.icon}</span>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-950 dark:text-white">
                      {lang === 'tr' ? activity.label : activity.labelEn || activity.label}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {lang === 'tr'
                        ? `${activity.daysSinceLastPerformed} gün önce`
                        : `${activity.daysSinceLastPerformed} days ago`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Detailed Performance List */}
      <Card
        variant="default"
        size="md"
        hoverable
        className="card-entrance"
        header={
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Aktivite Performans Analizi' : 'Activity Performance Analysis'}
            </h2>
          </div>
        }
      >
        <div className="space-y-3">
          {performances.slice(0, 10).map((performance) => (
            <div
              key={performance.activityKey}
              className={`p-3 sm:p-4 rounded-lg border transition-all duration-300 ${
                isMobile
                  ? 'touch-feedback active:scale-[0.98]'
                  : 'hover:shadow-md hover:scale-[1.01]'
              } bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl sm:text-3xl flex-shrink-0">{performance.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm sm:text-base font-bold text-gray-950 dark:text-white">
                      {lang === 'tr' ? performance.label : performance.labelEn || performance.label}
                    </h3>
                    <span
                      className={`text-xs sm:text-sm font-semibold ${getTrendColor(performance.recentTrend)}`}
                    >
                      {getTrendIcon(performance.recentTrend)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {lang === 'tr' ? 'Toplam' : 'Total'}
                      </p>
                      <p className="font-semibold text-gray-950 dark:text-white">
                        {performance.totalPoints.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {lang === 'tr' ? 'Ortalama' : 'Average'}
                      </p>
                      <p className="font-semibold text-gray-950 dark:text-white">
                        {Math.round(performance.averagePoints).toLocaleString(
                          lang === 'tr' ? 'tr-TR' : 'en-US'
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {lang === 'tr' ? 'Haftalık' : 'Weekly'}
                      </p>
                      <p className="font-semibold text-gray-950 dark:text-white">
                        {performance.weeklyFrequency.toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {lang === 'tr' ? 'Tutarlılık' : 'Consistency'}
                      </p>
                      <p
                        className={`font-semibold ${getConsistencyColor(performance.consistencyScore)}`}
                      >
                        {Math.round(performance.consistencyScore)}%
                      </p>
                    </div>
                  </div>

                  {performance.bestDay && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {lang === 'tr' ? 'En İyi Gün' : 'Best Day'}:{' '}
                        <span className="font-semibold text-gray-950 dark:text-white">
                          {format(performance.bestDay.date, 'dd MMM yyyy', { locale: dateLocale })}
                        </span>{' '}
                        (
                        {performance.bestDay.points.toLocaleString(
                          lang === 'tr' ? 'tr-TR' : 'en-US'
                        )}{' '}
                        {lang === 'tr' ? 'puan' : 'points'})
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
