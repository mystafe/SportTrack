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
              className="card-entrance glass-effect card-3d border-2 border-yellow-300/50 dark:border-yellow-600/50 bg-yellow-50/80 dark:bg-yellow-900/30 backdrop-blur-sm hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl icon-bounce">🏆</span>
                <h3 className="text-sm font-bold shimmer-text text-gray-950 dark:text-white">
                  {lang === 'tr' ? 'En İyi Performans' : 'Top Performer'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl icon-bounce">{insights.topPerformer.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-950 dark:text-white truncate shimmer-text">
                    {lang === 'tr'
                      ? insights.topPerformer.label
                      : insights.topPerformer.labelEn || insights.topPerformer.label}
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-medium pulse-glow">
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
              className="card-entrance glass-effect card-3d border-2 border-blue-300/50 dark:border-blue-600/50 bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-sm hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl icon-bounce">🎯</span>
                <h3 className="text-sm font-bold shimmer-text text-gray-950 dark:text-white">
                  {lang === 'tr' ? 'En Tutarlı' : 'Most Consistent'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl icon-bounce">{insights.mostConsistent.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-950 dark:text-white truncate shimmer-text">
                    {lang === 'tr'
                      ? insights.mostConsistent.label
                      : insights.mostConsistent.labelEn || insights.mostConsistent.label}
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-medium pulse-glow">
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
              className="card-entrance glass-effect card-3d border-2 border-green-300/50 dark:border-green-600/50 bg-green-50/80 dark:bg-green-900/30 backdrop-blur-sm hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl icon-bounce">🚀</span>
                <h3 className="text-sm font-bold shimmer-text text-gray-950 dark:text-white">
                  {lang === 'tr' ? 'En Çok Gelişen' : 'Most Improved'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl icon-bounce">{insights.mostImproved.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-950 dark:text-white truncate shimmer-text">
                    {lang === 'tr'
                      ? insights.mostImproved.label
                      : insights.mostImproved.labelEn || insights.mostImproved.label}
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-medium pulse-glow">
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
          className="card-entrance glass-effect card-3d border-2 border-orange-300/50 dark:border-orange-600/50 bg-orange-50/80 dark:bg-orange-900/30 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl icon-bounce">⚠️</span>
            <h3 className="text-base sm:text-lg font-bold shimmer-text text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Dikkat Gerektiren Aktiviteler' : 'Activities Needing Attention'}
            </h3>
          </div>
          <div className="space-y-2">
            {insights.needsAttention.slice(0, 3).map((activity) => (
              <div
                key={activity.activityKey}
                className="flex items-center justify-between p-2 rounded-xl glass-effect bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg icon-bounce">{activity.icon}</span>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-gray-950 dark:text-white">
                      {lang === 'tr' ? activity.label : activity.labelEn || activity.label}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
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
        className="card-entrance glass-effect card-3d"
        header={
          <div className="flex items-center gap-2">
            <span className="text-xl icon-bounce">📊</span>
            <h2 className="text-lg sm:text-xl font-bold shimmer-text text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Aktivite Performans Analizi' : 'Activity Performance Analysis'}
            </h2>
          </div>
        }
      >
        <div className="space-y-3">
          {performances.slice(0, 10).map((performance) => (
            <div
              key={performance.activityKey}
              className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                isMobile
                  ? 'touch-feedback active:scale-[0.98]'
                  : 'hover:shadow-xl hover:scale-[1.02]'
              } glass-effect bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-white/30 dark:border-gray-700/50 card-3d`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl sm:text-3xl flex-shrink-0 icon-bounce">
                  {performance.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm sm:text-base font-bold shimmer-text text-gray-950 dark:text-white">
                      {lang === 'tr' ? performance.label : performance.labelEn || performance.label}
                    </h3>
                    <span
                      className={`text-xs sm:text-sm font-bold pulse-glow ${getTrendColor(performance.recentTrend)}`}
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
                    <div className="mt-2 pt-2 border-t border-white/20 dark:border-gray-700/50">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {lang === 'tr' ? 'En İyi Gün' : 'Best Day'}:{' '}
                        <span className="font-bold text-gray-950 dark:text-white pulse-glow">
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
