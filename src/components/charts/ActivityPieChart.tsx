'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useI18n } from '@/lib/i18n';
import { ActivityRecord } from '@/lib/activityStore';
import { getActivityLabel } from '@/lib/activityUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

type ActivityPieChartProps = {
  activities: ActivityRecord[];
};

const COLORS = [
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
  '#f97316',
  '#6366f1',
];

export function ActivityPieChart({ activities }: ActivityPieChartProps) {
  const { lang } = useI18n();
  const isMobile = useIsMobile();

  const chartData = useMemo(() => {
    const breakdown = new Map<string, { name: string; value: number; count: number }>();

    for (const activity of activities) {
      const key = activity.activityKey;
      const existing = breakdown.get(key);

      if (existing) {
        existing.value += activity.points;
        existing.count += 1;
      } else {
        breakdown.set(key, {
          name: getActivityLabel(activity, lang),
          value: activity.points,
          count: 1,
        });
      }
    }

    return Array.from(breakdown.values()).sort((a, b) => b.value - a.value);
  }, [activities, lang]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        {lang === 'tr' ? 'Yeterli veri yok' : 'Not enough data'}
      </div>
    );
  }

  const renderLabel = (props: { name?: string; percent?: number }) => {
    if (!props.percent || props.percent < 0.05) return ''; // Don't show labels for small slices
    return `${props.name || ''}: ${(props.percent * 100).toFixed(0)}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel}
          outerRadius={isMobile ? 80 : 120}
          fill="#8884d8"
          dataKey="value"
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
        </Pie>
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
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => {
            const item = chartData.find((d) => d.name === value);
            return item ? `${value} (${item.count}x)` : value;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
