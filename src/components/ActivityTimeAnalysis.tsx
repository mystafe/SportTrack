'use client';

import { useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { parseISO } from 'date-fns';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ActivityTimeAnalysisProps {
  activities: Array<{ performedAt: string; points: number }>;
}

export function ActivityTimeAnalysis({ activities }: ActivityTimeAnalysisProps) {
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();

  // Analyze by hour (0-23)
  const hourlyData = useMemo(() => {
    const hourMap = new Map<number, { count: number; points: number }>();
    
    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hourMap.set(i, { count: 0, points: 0 });
    }

    for (const activity of activities) {
      const date = parseISO(activity.performedAt);
      const hour = date.getHours();
      const existing = hourMap.get(hour)!;
      existing.count++;
      existing.points += activity.points;
    }

    return Array.from(hourMap.entries())
      .map(([hour, data]) => ({
        hour,
        hourLabel: `${hour}:00`,
        count: data.count,
        points: data.points
      }))
      .filter(item => item.count > 0 || item.points > 0);
  }, [activities]);

  // Analyze by day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
  const dayOfWeekData = useMemo(() => {
    const dayMap = new Map<number, { count: number; points: number }>();
    
    // Initialize all days
    for (let i = 0; i < 7; i++) {
      dayMap.set(i, { count: 0, points: 0 });
    }

    for (const activity of activities) {
      const date = parseISO(activity.performedAt);
      const dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, etc.
      const existing = dayMap.get(dayOfWeek)!;
      existing.count++;
      existing.points += activity.points;
    }

    const dayNames = lang === 'tr'
      ? ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
      : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return Array.from(dayMap.entries())
      .map(([day, data]) => ({
        day,
        dayLabel: dayNames[day],
        count: data.count,
        points: data.points
      }))
      .sort((a, b) => {
        // Reorder: Monday=0, Tuesday=1, ..., Sunday=6
        const orderA = a.day === 0 ? 6 : a.day - 1;
        const orderB = b.day === 0 ? 6 : b.day - 1;
        return orderA - orderB;
      });
  }, [activities, lang]);

  // Find most active hour
  const mostActiveHour = useMemo(() => {
    if (hourlyData.length === 0) return null;
    return hourlyData.reduce((best, current) =>
      current.points > best.points ? current : best
    );
  }, [hourlyData]);

  // Find most active day
  const mostActiveDay = useMemo(() => {
    if (dayOfWeekData.length === 0) return null;
    return dayOfWeekData.reduce((best, current) =>
      current.points > best.points ? current : best
    );
  }, [dayOfWeekData]);

  if (activities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('timeAnalysis.title')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {t('timeAnalysis.subtitle')}
        </p>
      </div>

      {/* Summary Cards */}
      {(mostActiveHour || mostActiveDay) && (
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
          {mostActiveHour && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('timeAnalysis.mostActiveHour')}
              </div>
              <div className="text-lg font-bold text-brand">
                {mostActiveHour.hourLabel}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {mostActiveHour.points.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')} {t('level.xp')} • {mostActiveHour.count} {t('timeAnalysis.activities')}
              </div>
            </div>
          )}
          {mostActiveDay && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t('timeAnalysis.mostActiveDay')}
              </div>
              <div className="text-lg font-bold text-brand">
                {mostActiveDay.dayLabel}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {mostActiveDay.points.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')} {t('level.xp')} • {mostActiveDay.count} {t('timeAnalysis.activities')}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hour Distribution Chart */}
      {hourlyData.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            {t('timeAnalysis.hourDistribution')}
          </h3>
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="hourLabel"
                tick={{ fontSize: isMobile ? 10 : 12 }}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? 'end' : 'middle'}
                height={isMobile ? 60 : 40}
              />
              <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')} ${t('level.xp')}`,
                  t('timeAnalysis.points')
                ]}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Bar dataKey="points" fill="#3b82f6">
                {hourlyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.hour === mostActiveHour?.hour ? '#10b981' : '#3b82f6'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Day of Week Distribution Chart */}
      {dayOfWeekData.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            {t('timeAnalysis.dayDistribution')}
          </h3>
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
            <BarChart data={dayOfWeekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="dayLabel"
                tick={{ fontSize: isMobile ? 10 : 12 }}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? 'end' : 'middle'}
                height={isMobile ? 60 : 40}
              />
              <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')} ${t('level.xp')}`,
                  t('timeAnalysis.points')
                ]}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Bar dataKey="points" fill="#3b82f6">
                {dayOfWeekData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.day === mostActiveDay?.day ? '#10b981' : '#3b82f6'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

