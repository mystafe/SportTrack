'use client';

import { useState, useMemo } from 'react';
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
import { format, parseISO, startOfDay, subDays } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
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

export function ActivityPerformanceReport() {
  const { lang } = useI18n();
  const { activities, hydrated } = useActivities();
  const definitions = useActivityDefinitions();
  const isMobile = useIsMobile();
  const dateLocale = lang === 'tr' ? tr : enUS;

  const [selectedActivityKey, setSelectedActivityKey] = useState<string | null>(null);

  const performances = useMemo(() => {
    if (!hydrated || activities.length === 0) return [];
    return calculateActivityPerformance(activities, 90);
  }, [activities, hydrated]);

  const selectedPerformance = useMemo(() => {
    if (!selectedActivityKey) {
      return performances.length > 0 ? performances[0] : null;
    }
    return performances.find((p) => p.activityKey === selectedActivityKey) || null;
  }, [performances, selectedActivityKey]);

  const activityData = useMemo(() => {
    if (!selectedPerformance) return [];

    const now = new Date();
    const days = 30;
    const startDate = subDays(now, days);

    const activityRecords = activities.filter(
      (a) =>
        a.activityKey === selectedPerformance.activityKey && parseISO(a.performedAt) >= startDate
    );

    const dailyData = new Map<string, { points: number; count: number }>();
    for (let i = 0; i < days; i++) {
      const date = subDays(now, days - i - 1);
      const key = format(startOfDay(date), 'yyyy-MM-dd');
      dailyData.set(key, { points: 0, count: 0 });
    }

    activityRecords.forEach((activity) => {
      const date = startOfDay(parseISO(activity.performedAt));
      const key = format(date, 'yyyy-MM-dd');
      const existing = dailyData.get(key);
      if (existing) {
        existing.points += activity.points;
        existing.count += 1;
      }
    });

    return Array.from(dailyData.entries()).map(([date, data]) => ({
      date,
      dateLabel: format(parseISO(date), 'dd MMM', { locale: dateLocale }),
      points: data.points,
      count: data.count,
    }));
  }, [selectedPerformance, activities, dateLocale]);

  const insights = useMemo(() => getPerformanceInsights(performances), [performances]);

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

  const getRecommendations = (perf: ActivityPerformance | null): string[] => {
    if (!perf) return [];

    const recommendations: string[] = [];

    if (perf.recentTrend === 'declining') {
      recommendations.push(
        lang === 'tr'
          ? 'Son 30 günde performans düşüş gösteriyor. Daha sık yapmayı deneyin.'
          : 'Performance has declined in the last 30 days. Try doing it more frequently.'
      );
    }

    if (perf.consistencyScore < 60) {
      recommendations.push(
        lang === 'tr'
          ? 'Tutarlılık skorunuz düşük. Daha düzenli bir program oluşturun.'
          : 'Your consistency score is low. Create a more regular schedule.'
      );
    }

    if (perf.daysSinceLastPerformed !== null && perf.daysSinceLastPerformed > 7) {
      recommendations.push(
        lang === 'tr'
          ? `${perf.daysSinceLastPerformed} gündür bu aktiviteyi yapmadınız. Tekrar başlamayı düşünün.`
          : `You haven't done this activity for ${perf.daysSinceLastPerformed} days. Consider starting again.`
      );
    }

    if (perf.weeklyFrequency < 2) {
      recommendations.push(
        lang === 'tr'
          ? 'Haftalık frekansınız düşük. Haftada en az 2-3 kez yapmayı hedefleyin.'
          : 'Your weekly frequency is low. Aim to do it at least 2-3 times per week.'
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        lang === 'tr'
          ? 'Harika gidiyorsunuz! Bu aktiviteyi bu şekilde devam ettirin.'
          : "You're doing great! Keep up the good work with this activity."
      );
    }

    return recommendations;
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
            <span className="text-xl">📋</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Aktivite Performans Raporu' : 'Activity Performance Report'}
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
            {performances.slice(0, 8).map((perf) => (
              <button
                key={perf.activityKey}
                onClick={() => setSelectedActivityKey(perf.activityKey)}
                className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                  selectedPerformance?.activityKey === perf.activityKey
                    ? 'border-brand bg-brand/10 dark:bg-brand/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{perf.icon}</span>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-gray-950 dark:text-white">
                      {lang === 'tr' ? perf.label : perf.labelEn || perf.label}
                    </div>
                    <div className="text-[10px] text-gray-600 dark:text-gray-400">
                      {numberFormatter.format(perf.totalPoints)} {lang === 'tr' ? 'puan' : 'pts'}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Report Content */}
        {selectedPerformance && (
          <div className="space-y-4">
            {/* Header */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedPerformance.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-950 dark:text-white">
                      {lang === 'tr'
                        ? selectedPerformance.label
                        : selectedPerformance.labelEn || selectedPerformance.label}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {lang === 'tr'
                        ? 'Son 90 günlük performans analizi'
                        : 'Last 90 days performance analysis'}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${getTrendColor(selectedPerformance.recentTrend)}`}
                >
                  {getTrendIcon(selectedPerformance.recentTrend)}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2 rounded bg-white dark:bg-gray-800">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {lang === 'tr' ? 'Toplam Puan' : 'Total Points'}
                  </div>
                  <div className="text-lg font-bold text-brand">
                    {numberFormatter.format(selectedPerformance.totalPoints)}
                  </div>
                </div>
                <div className="p-2 rounded bg-white dark:bg-gray-800">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {lang === 'tr' ? 'Toplam Sayı' : 'Total Count'}
                  </div>
                  <div className="text-lg font-bold text-gray-950 dark:text-white">
                    {numberFormatter.format(selectedPerformance.totalCount)}
                  </div>
                </div>
                <div className="p-2 rounded bg-white dark:bg-gray-800">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {lang === 'tr' ? 'Ortalama' : 'Average'}
                  </div>
                  <div className="text-lg font-bold text-gray-950 dark:text-white">
                    {numberFormatter.format(Math.round(selectedPerformance.averagePoints))}
                  </div>
                </div>
                <div className="p-2 rounded bg-white dark:bg-gray-800">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {lang === 'tr' ? 'Tutarlılık' : 'Consistency'}
                  </div>
                  <div
                    className={`text-lg font-bold ${getConsistencyColor(selectedPerformance.consistencyScore)}`}
                  >
                    {numberFormatter.format(Math.round(selectedPerformance.consistencyScore))}%
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            {activityData.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-gray-950 dark:text-white mb-2">
                  {lang === 'tr' ? 'Son 30 Günlük Performans' : 'Last 30 Days Performance'}
                </h4>
                <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                  <LineChart data={activityData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="currentColor"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="dateLabel"
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
                    <Line
                      type="monotone"
                      dataKey="points"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#0ea5e9' }}
                      activeDot={{ r: 6 }}
                      name={lang === 'tr' ? 'Puanlar' : 'Points'}
                      animationDuration={1000}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#10b981' }}
                      activeDot={{ r: 6 }}
                      name={lang === 'tr' ? 'Sayı' : 'Count'}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Additional Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedPerformance.bestDay && (
                <div className="p-3 rounded-lg border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {lang === 'tr' ? 'En İyi Gün' : 'Best Day'}
                  </div>
                  <div className="text-sm font-bold text-gray-950 dark:text-white">
                    {format(selectedPerformance.bestDay.date, 'dd MMM yyyy', {
                      locale: dateLocale,
                    })}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {numberFormatter.format(selectedPerformance.bestDay.points)}{' '}
                    {lang === 'tr' ? 'puan' : 'points'} · {selectedPerformance.bestDay.count}{' '}
                    {lang === 'tr' ? 'kez' : 'times'}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {lang === 'tr' ? 'Haftalık Frekans' : 'Weekly Frequency'}
                </div>
                <div className="text-sm font-bold text-gray-950 dark:text-white">
                  {selectedPerformance.weeklyFrequency.toFixed(1)}{' '}
                  {lang === 'tr' ? 'kez/hafta' : 'times/week'}
                </div>
                {selectedPerformance.lastPerformed && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {lang === 'tr' ? 'Son yapılan' : 'Last performed'}:{' '}
                    {format(selectedPerformance.lastPerformed, 'dd MMM yyyy', {
                      locale: dateLocale,
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-3 rounded-lg border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                💡 {lang === 'tr' ? 'Öneriler' : 'Recommendations'}
              </div>
              <ul className="space-y-1">
                {getRecommendations(selectedPerformance).map((rec, index) => (
                  <li key={index} className="text-xs text-gray-700 dark:text-gray-300">
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
