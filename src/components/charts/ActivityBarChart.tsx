'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { useI18n } from '@/lib/i18n';
import { ActivityRecord } from '@/lib/activityStore';
import { getActivityLabel } from '@/lib/activityUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

type ActivityBarChartProps = {
  activities: ActivityRecord[];
};

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export function ActivityBarChart({ activities }: ActivityBarChartProps) {
  const { lang } = useI18n();
  const isMobile = useIsMobile();

  const chartData = useMemo(() => {
    const breakdown = new Map<string, { label: string; points: number; count: number }>();

    for (const activity of activities) {
      const key = activity.activityKey;
      const existing = breakdown.get(key);

      if (existing) {
        existing.points += activity.points;
        existing.count += 1;
      } else {
        breakdown.set(key, {
          label: getActivityLabel(activity, lang),
          points: activity.points,
          count: 1,
        });
      }
    }

    return Array.from(breakdown.values())
      .sort((a, b) => b.points - a.points)
      .slice(0, 7); // Top 7 activities
  }, [activities, lang]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        {lang === 'tr' ? 'Yeterli veri yok' : 'Not enough data'}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 250 : 350}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-30" />
        <XAxis
          dataKey="label"
          angle={-45}
          textAnchor="end"
          height={80}
          stroke="currentColor"
          tick={{ fill: 'currentColor', fontSize: 11 }}
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
        <Bar
          dataKey="points"
          name={lang === 'tr' ? 'Toplam Puan' : 'Total Points'}
          radius={[8, 8, 0, 0]}
          animationDuration={1000}
          animationEasing="ease-out"
          isAnimationActive={true}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              style={{
                transition: 'opacity 0.2s ease-in-out',
                cursor: 'pointer',
              }}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
