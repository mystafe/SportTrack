'use client';

import { useMemo, memo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';
import { compareWeeks, compareMonths, type ComparisonResult } from '@/lib/comparisonUtils';
import { format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const PeriodComparison = memo(function PeriodComparison() {
  const { activities, hydrated } = useActivities();
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const dateLocale = lang === 'tr' ? tr : enUS;

  const dailyTarget =
    settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : DEFAULT_DAILY_TARGET;

  const weekComparison = useMemo(() => {
    if (!hydrated || activities.length === 0) return null;
    return compareWeeks(activities, dailyTarget);
  }, [activities, dailyTarget, hydrated]);

  const monthComparison = useMemo(() => {
    if (!hydrated || activities.length === 0) return null;
    return compareMonths(activities, dailyTarget);
  }, [activities, dailyTarget, hydrated]);

  const formatChange = (value: number, percent: number, isPositive: boolean) => {
    const sign = value >= 0 ? '+' : '';
    const color = isPositive
      ? value >= 0
        ? 'text-green-600'
        : 'text-red-600'
      : value >= 0
        ? 'text-red-600'
        : 'text-green-600';
    return (
      <span className={color}>
        {sign}
        {value.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')} ({sign}
        {percent}%)
      </span>
    );
  };

  if (!hydrated || (!weekComparison && !monthComparison)) {
    return null;
  }

  return (
    <div className="spacing-lg">
      <div>
        <h2 className="text-heading-3 text-gray-900 dark:text-white mb-4">
          {t('comparison.title')}
        </h2>
        <p className="text-body text-gray-600 dark:text-gray-400 mb-4">
          {t('comparison.subtitle')}
        </p>
      </div>

      {/* Weekly Comparison */}
      {weekComparison && (
        <div className="card-entrance glass-effect card-3d rounded-xl border-2 border-white/20 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
          <h3 className="text-heading-3 text-gray-900 dark:text-white mb-4">
            {t('comparison.weekly')}
          </h3>

          <div className="space-y-4">
            {/* Summary Cards */}
            <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-3`}>
              <div className="rounded-lg glass-effect border-2 border-white/20 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t('comparison.totalPoints')}
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {weekComparison.current.totalPoints.toLocaleString(
                    lang === 'tr' ? 'tr-TR' : 'en-US'
                  )}
                </div>
                <div className="text-xs mt-1">
                  {formatChange(
                    weekComparison.change.points,
                    weekComparison.change.pointsPercent,
                    false
                  )}
                </div>
              </div>

              <div className="rounded-lg glass-effect border-2 border-white/20 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t('comparison.totalActivities')}
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {weekComparison.current.totalActivities}
                </div>
                <div className="text-xs mt-1">
                  {formatChange(
                    weekComparison.change.activities,
                    weekComparison.change.activitiesPercent,
                    false
                  )}
                </div>
              </div>

              <div className="rounded-lg glass-effect border-2 border-white/20 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t('comparison.avgDaily')}
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {weekComparison.current.averageDailyPoints.toLocaleString(
                    lang === 'tr' ? 'tr-TR' : 'en-US'
                  )}
                </div>
                <div className="text-xs mt-1">
                  {formatChange(
                    weekComparison.change.averageDaily,
                    weekComparison.change.averageDailyPercent,
                    false
                  )}
                </div>
              </div>

              <div className="rounded-lg glass-effect border-2 border-white/20 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t('comparison.completionRate')}
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {weekComparison.current.completionRate}%
                </div>
                <div className="text-xs mt-1">
                  {formatChange(
                    weekComparison.change.completionRate,
                    weekComparison.change.completionRatePercent,
                    true
                  )}
                </div>
              </div>
            </div>

            {/* Comparison Chart */}
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
                <BarChart
                  data={[
                    {
                      period: format(weekComparison.previous.startDate, 'dd MMM', {
                        locale: dateLocale,
                      }),
                      points: weekComparison.previous.totalPoints,
                      activities: weekComparison.previous.totalActivities,
                    },
                    {
                      period: format(weekComparison.current.startDate, 'dd MMM', {
                        locale: dateLocale,
                      }),
                      points: weekComparison.current.totalPoints,
                      activities: weekComparison.current.totalActivities,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="period" tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <Tooltip
                    formatter={(value: number) => [
                      value.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US'),
                      '',
                    ]}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.75rem',
                      boxShadow:
                        '0 8px 16px -4px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                    }}
                  />
                  <Bar dataKey="points" fill="#3b82f6" name={t('comparison.points')} />
                  <Bar dataKey="activities" fill="#10b981" name={t('comparison.activities')} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Comparison */}
      {monthComparison && (
        <div className="card-entrance glass-effect card-3d rounded-xl border-2 border-white/20 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
          <h3 className="text-heading-3 text-gray-900 dark:text-white mb-4">
            {t('comparison.monthly')}
          </h3>

          <div className="space-y-4">
            {/* Summary Cards */}
            <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-3`}>
              <div className="rounded-lg glass-effect border-2 border-white/20 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t('comparison.totalPoints')}
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {monthComparison.current.totalPoints.toLocaleString(
                    lang === 'tr' ? 'tr-TR' : 'en-US'
                  )}
                </div>
                <div className="text-xs mt-1">
                  {formatChange(
                    monthComparison.change.points,
                    monthComparison.change.pointsPercent,
                    false
                  )}
                </div>
              </div>

              <div className="rounded-lg glass-effect border-2 border-white/20 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t('comparison.totalActivities')}
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {monthComparison.current.totalActivities}
                </div>
                <div className="text-xs mt-1">
                  {formatChange(
                    monthComparison.change.activities,
                    monthComparison.change.activitiesPercent,
                    false
                  )}
                </div>
              </div>

              <div className="rounded-lg glass-effect border-2 border-white/20 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t('comparison.avgDaily')}
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {monthComparison.current.averageDailyPoints.toLocaleString(
                    lang === 'tr' ? 'tr-TR' : 'en-US'
                  )}
                </div>
                <div className="text-xs mt-1">
                  {formatChange(
                    monthComparison.change.averageDaily,
                    monthComparison.change.averageDailyPercent,
                    false
                  )}
                </div>
              </div>

              <div className="rounded-lg glass-effect border-2 border-white/20 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t('comparison.completionRate')}
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {monthComparison.current.completionRate}%
                </div>
                <div className="text-xs mt-1">
                  {formatChange(
                    monthComparison.change.completionRate,
                    monthComparison.change.completionRatePercent,
                    true
                  )}
                </div>
              </div>
            </div>

            {/* Comparison Chart */}
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
                <BarChart
                  data={[
                    {
                      period: format(monthComparison.previous.startDate, 'MMM yyyy', {
                        locale: dateLocale,
                      }),
                      points: monthComparison.previous.totalPoints,
                      activities: monthComparison.previous.totalActivities,
                    },
                    {
                      period: format(monthComparison.current.startDate, 'MMM yyyy', {
                        locale: dateLocale,
                      }),
                      points: monthComparison.current.totalPoints,
                      activities: monthComparison.current.totalActivities,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="period" tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <Tooltip
                    formatter={(value: number) => [
                      value.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US'),
                      '',
                    ]}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.75rem',
                      boxShadow:
                        '0 8px 16px -4px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                    }}
                  />
                  <Bar dataKey="points" fill="#3b82f6" name={t('comparison.points')} />
                  <Bar dataKey="activities" fill="#10b981" name={t('comparison.activities')} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
