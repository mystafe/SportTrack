'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { calculateAllActivityForecasts, type ActivityForecast } from '@/lib/activityForecastUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import { format, parseISO } from 'date-fns';
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
  ReferenceLine,
} from 'recharts';

export function ActivityPerformanceForecast() {
  const { lang } = useI18n();
  const { activities, hydrated } = useActivities();
  const isMobile = useIsMobile();
  const dateLocale = lang === 'tr' ? tr : enUS;

  const [selectedActivityKey, setSelectedActivityKey] = useState<string | null>(null);
  const [forecastDays, setForecastDays] = useState(30);

  const forecasts = useMemo(() => {
    if (!hydrated || activities.length === 0) return [];
    return calculateAllActivityForecasts(activities, forecastDays);
  }, [activities, hydrated, forecastDays]);

  const selectedForecast = useMemo(() => {
    if (!selectedActivityKey) {
      return forecasts.length > 0 ? forecasts[0] : null;
    }
    return forecasts.find((f) => f.activityKey === selectedActivityKey) || null;
  }, [forecasts, selectedActivityKey]);

  const chartData = useMemo(() => {
    if (!selectedForecast) return [];

    // Get historical data (last 30 days)
    const now = new Date();
    const historicalData = selectedForecast.forecast.slice(-30).map((f) => ({
      date: format(parseISO(f.date), 'dd MMM', { locale: dateLocale }),
      predicted: f.predictedPoints,
      confidence: f.confidence,
    }));

    return historicalData;
  }, [selectedForecast, dateLocale]);

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );

  const getTrendIcon = (trend: ActivityForecast['trend']) => {
    switch (trend) {
      case 'increasing':
        return '📈';
      case 'decreasing':
        return '📉';
      case 'stable':
        return '➡️';
    }
  };

  const getTrendColor = (trend: ActivityForecast['trend']) => {
    switch (trend) {
      case 'increasing':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'decreasing':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'stable':
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
    }
  };

  if (!hydrated || forecasts.length === 0) {
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
            <span className="text-xl">🔮</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Performans Tahmini' : 'Performance Forecast'}
            </h2>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Forecast Days Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-950 dark:text-white mb-1">
            {lang === 'tr' ? 'Tahmin Süresi' : 'Forecast Period'}
          </label>
          <div className="flex flex-wrap gap-2">
            {[7, 14, 30, 60].map((days) => (
              <button
                key={days}
                onClick={() => setForecastDays(days)}
                className={`px-2 py-1 rounded text-xs font-semibold transition-all duration-200 ${
                  forecastDays === days
                    ? 'bg-brand text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-950 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {days} {lang === 'tr' ? 'gün' : 'days'}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-950 dark:text-white mb-1">
            {lang === 'tr' ? 'Aktivite Seç' : 'Select Activity'}
          </label>
          <div className="flex flex-wrap gap-2">
            {forecasts.slice(0, 5).map((forecast) => (
              <button
                key={forecast.activityKey}
                onClick={() => setSelectedActivityKey(forecast.activityKey)}
                className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                  selectedForecast?.activityKey === forecast.activityKey
                    ? 'border-brand bg-brand/10 dark:bg-brand/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{forecast.icon}</span>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-gray-950 dark:text-white">
                      {lang === 'tr' ? forecast.label : forecast.labelEn || forecast.label}
                    </div>
                    <div className="text-[10px] text-gray-600 dark:text-gray-400">
                      {getTrendIcon(forecast.trend)}{' '}
                      {numberFormatter.format(forecast.nextMonthPrediction)}{' '}
                      {lang === 'tr' ? 'puan' : 'pts'}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Forecast Details */}
        {selectedForecast && (
          <div>
            <div className="p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedForecast.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-gray-950 dark:text-white">
                      {lang === 'tr'
                        ? selectedForecast.label
                        : selectedForecast.labelEn || selectedForecast.label}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {lang === 'tr' ? 'Geçmiş ortalama' : 'Historical average'}:{' '}
                      {numberFormatter.format(selectedForecast.historicalAverage)}{' '}
                      {lang === 'tr' ? 'puan/gün' : 'points/day'}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-semibold ${getTrendColor(selectedForecast.trend)}`}
                >
                  {getTrendIcon(selectedForecast.trend)}
                </div>
              </div>
            </div>

            {/* Predictions Summary */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {lang === 'tr' ? 'Önümüzdeki Hafta' : 'Next Week'}
                </div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {numberFormatter.format(selectedForecast.nextWeekPrediction)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {lang === 'tr' ? 'puan' : 'points'}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {lang === 'tr' ? 'Önümüzdeki Ay' : 'Next Month'}
                </div>
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {numberFormatter.format(selectedForecast.nextMonthPrediction)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {lang === 'tr' ? 'puan' : 'points'}
                </div>
              </div>
            </div>

            {/* Forecast Chart */}
            {chartData.length > 0 && (
              <div>
                <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="currentColor"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="date"
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
                    <ReferenceLine
                      y={selectedForecast.historicalAverage}
                      stroke="#10b981"
                      strokeDasharray="5 5"
                      label={{
                        value: lang === 'tr' ? 'Ortalama' : 'Average',
                        position: 'right',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#0ea5e9' }}
                      activeDot={{ r: 6 }}
                      name={lang === 'tr' ? 'Tahmin' : 'Forecast'}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-4 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                ⚠️{' '}
                {lang === 'tr'
                  ? 'Tahminler geçmiş verilere dayanmaktadır ve kesin değildir.'
                  : 'Forecasts are based on historical data and are not guaranteed.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
