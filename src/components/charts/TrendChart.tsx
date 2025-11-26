'use client';

import { useMemo } from 'react';
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
import { format, subDays, startOfDay } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useI18n } from '@/lib/i18n';
import { ActivityRecord } from '@/lib/activityStore';
import { parseISO } from 'date-fns';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

type TrendChartProps = {
  activities: ActivityRecord[];
  target: number;
  days: 7 | 30 | 90;
};

export function TrendChart({ activities, target, days }: TrendChartProps) {
  const { lang } = useI18n();
  const isMobile = useIsMobile();
  const dateLocale = lang === 'tr' ? tr : enUS;

  const chartData = useMemo(() => {
    const today = startOfDay(new Date());
    const data: Array<{ date: string; points: number; target: number; dateLabel: string }> = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateKey = date.toISOString();
      const dateStart = startOfDay(date);

      const dayActivities = activities.filter((activity) => {
        const activityDate = startOfDay(parseISO(activity.performedAt));
        return activityDate.getTime() === dateStart.getTime();
      });

      const points = dayActivities.reduce((sum, a) => sum + a.points, 0);

      data.push({
        date: dateKey,
        points,
        target,
        dateLabel: format(date, days === 7 ? 'EEE' : days === 30 ? 'd MMM' : 'MMM d', {
          locale: dateLocale,
        }),
      });
    }

    return data;
  }, [activities, target, days, dateLocale]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        {lang === 'tr' ? 'Yeterli veri yok' : 'Not enough data'}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-30" />
        <XAxis
          dataKey="dateLabel"
          stroke="currentColor"
          className="text-xs"
          tick={{ fill: 'currentColor', fontSize: 12 }}
        />
        <YAxis stroke="currentColor" tick={{ fill: 'currentColor', fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--tw-bg-white)',
            border: '1px solid var(--tw-border-gray-200)',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease-in-out',
          }}
          labelStyle={{ color: 'var(--tw-text-gray-900)', fontWeight: '600' }}
          animationDuration={200}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="points"
          stroke="#0ea5e9"
          strokeWidth={2}
          dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 6, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }}
          name={lang === 'tr' ? 'Puanlar' : 'Points'}
          animationDuration={1000}
          animationEasing="ease-out"
          isAnimationActive={true}
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="#10b981"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          name={lang === 'tr' ? 'Hedef' : 'Target'}
          animationDuration={1000}
          animationEasing="ease-out"
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
