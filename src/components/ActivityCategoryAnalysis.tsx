'use client';

import { useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useActivityDefinitions } from '@/lib/settingsStore';
import { ActivityCategory } from '@/lib/activityConfig';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { subDays, startOfDay, parseISO } from 'date-fns';

interface CategoryStats {
  category: ActivityCategory;
  label: { tr: string; en: string };
  icon: string;
  color: string;
  totalPoints: number;
  totalCount: number;
  averagePoints: number;
  percentage: number;
  last30Days: {
    points: number;
    count: number;
  };
  last7Days: {
    points: number;
    count: number;
  };
}

const CATEGORY_INFO: Record<
  ActivityCategory,
  { label: { tr: string; en: string }; icon: string; color: string }
> = {
  cardio: {
    label: { tr: 'Kardiyovasküler', en: 'Cardiovascular' },
    icon: '❤️',
    color: '#ef4444',
  },
  strength: {
    label: { tr: 'Güç Antrenmanı', en: 'Strength Training' },
    icon: '💪',
    color: '#f59e0b',
  },
  flexibility: {
    label: { tr: 'Esneklik', en: 'Flexibility' },
    icon: '🧘',
    color: '#8b5cf6',
  },
  sports: {
    label: { tr: 'Spor', en: 'Sports' },
    icon: '⚽',
    color: '#10b981',
  },
  other: {
    label: { tr: 'Diğer', en: 'Other' },
    icon: '🏃',
    color: '#6b7280',
  },
};

export function ActivityCategoryAnalysis() {
  const { t, lang } = useI18n();
  const { activities } = useActivities();
  const activityDefinitions = useActivityDefinitions();
  const isMobile = useIsMobile();

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );

  // Create activity key to category map
  const activityCategoryMap = useMemo(() => {
    const map = new Map<string, ActivityCategory>();
    activityDefinitions.forEach((def) => {
      if (def.category) {
        map.set(def.key, def.category);
      }
    });
    return map;
  }, [activityDefinitions]);

  // Calculate category statistics
  const categoryStats = useMemo(() => {
    const stats = new Map<ActivityCategory, CategoryStats>();

    // Initialize all categories
    Object.keys(CATEGORY_INFO).forEach((cat) => {
      const category = cat as ActivityCategory;
      const info = CATEGORY_INFO[category];
      stats.set(category, {
        category,
        label: info.label,
        icon: info.icon,
        color: info.color,
        totalPoints: 0,
        totalCount: 0,
        averagePoints: 0,
        percentage: 0,
        last30Days: { points: 0, count: 0 },
        last7Days: { points: 0, count: 0 },
      });
    });

    const now = new Date();
    const last30DaysStart = startOfDay(subDays(now, 30));
    const last7DaysStart = startOfDay(subDays(now, 7));

    // Process activities
    activities.forEach((activity) => {
      const category =
        activity.category || activityCategoryMap.get(activity.activityKey) || 'other';
      const stat = stats.get(category);
      if (!stat) return;

      stat.totalPoints += activity.points;
      stat.totalCount += 1;

      const activityDate = startOfDay(parseISO(activity.performedAt));
      if (activityDate >= last7DaysStart) {
        stat.last7Days.points += activity.points;
        stat.last7Days.count += 1;
      }
      if (activityDate >= last30DaysStart) {
        stat.last30Days.points += activity.points;
        stat.last30Days.count += 1;
      }
    });

    // Calculate totals and percentages
    const totalPoints = Array.from(stats.values()).reduce((sum, s) => sum + s.totalPoints, 0);
    const totalCount = Array.from(stats.values()).reduce((sum, s) => sum + s.totalCount, 0);

    stats.forEach((stat) => {
      stat.averagePoints = stat.totalCount > 0 ? stat.totalPoints / stat.totalCount : 0;
      stat.percentage = totalPoints > 0 ? (stat.totalPoints / totalPoints) * 100 : 0;
    });

    // Filter out categories with no activities
    return Array.from(stats.values()).filter((s) => s.totalCount > 0);
  }, [activities, activityCategoryMap]);

  // Prepare chart data
  const pieChartData = useMemo(
    () =>
      categoryStats.map((stat) => ({
        name: stat.label[lang],
        value: stat.totalPoints,
        fill: stat.color,
      })),
    [categoryStats, lang]
  );

  const barChartData = useMemo(
    () =>
      categoryStats.map((stat) => ({
        name: stat.label[lang],
        total: stat.totalPoints,
        last30Days: stat.last30Days.points,
        last7Days: stat.last7Days.points,
        fill: stat.color,
      })),
    [categoryStats, lang]
  );

  if (categoryStats.length === 0) {
    return null;
  }

  return (
    <Card
      variant="default"
      size="md"
      hoverable
      className="card-entrance"
      header={
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
            {lang === 'tr' ? 'Kategori Analizi' : 'Category Analysis'}
          </h2>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Pie Chart */}
        {pieChartData.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-3">
              {lang === 'tr' ? 'Kategori Dağılımı' : 'Category Distribution'}
            </h3>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={isMobile ? 80 : 100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => numberFormatter.format(value)}
                  contentStyle={{
                    backgroundColor: 'var(--tw-bg-white)',
                    border: '1px solid var(--tw-border-gray-200)',
                    borderRadius: '0.5rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Bar Chart */}
        {barChartData.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-3">
              {lang === 'tr' ? 'Zaman Bazlı Karşılaştırma' : 'Time-Based Comparison'}
            </h3>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <BarChart data={barChartData} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-30" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  stroke="currentColor"
                  tick={{ fill: 'currentColor', fontSize: 11 }}
                />
                <YAxis stroke="currentColor" tick={{ fill: 'currentColor', fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => numberFormatter.format(value)}
                  contentStyle={{
                    backgroundColor: 'var(--tw-bg-white)',
                    border: '1px solid var(--tw-border-gray-200)',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Bar dataKey="total" fill="#0ea5e9" name={lang === 'tr' ? 'Toplam' : 'Total'} />
                <Bar
                  dataKey="last30Days"
                  fill="#10b981"
                  name={lang === 'tr' ? 'Son 30 Gün' : 'Last 30 Days'}
                />
                <Bar
                  dataKey="last7Days"
                  fill="#f59e0b"
                  name={lang === 'tr' ? 'Son 7 Gün' : 'Last 7 Days'}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categoryStats.map((stat) => (
            <div
              key={stat.category}
              className="p-4 rounded-lg border-2"
              style={{
                borderColor: stat.color,
                backgroundColor: `${stat.color}15`,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <h3 className="text-base font-bold text-gray-950 dark:text-white">
                  {stat.label[lang]}
                </h3>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {lang === 'tr' ? 'Toplam Puan' : 'Total Points'}
                  </span>
                  <span className="font-bold text-gray-950 dark:text-white">
                    {numberFormatter.format(stat.totalPoints)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {lang === 'tr' ? 'Toplam Aktivite' : 'Total Activities'}
                  </span>
                  <span className="font-bold text-gray-950 dark:text-white">{stat.totalCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {lang === 'tr' ? 'Ortalama Puan' : 'Average Points'}
                  </span>
                  <span className="font-bold text-gray-950 dark:text-white">
                    {numberFormatter.format(Math.round(stat.averagePoints))}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {lang === 'tr' ? 'Dağılım' : 'Distribution'}
                    </span>
                    <span className="text-xs font-bold text-gray-950 dark:text-white">
                      {stat.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${stat.percentage}%`,
                        backgroundColor: stat.color,
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {lang === 'tr' ? 'Son 30 Gün' : 'Last 30 Days'}
                    </p>
                    <p className="font-semibold text-gray-950 dark:text-white">
                      {numberFormatter.format(stat.last30Days.points)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {lang === 'tr' ? 'Son 7 Gün' : 'Last 7 Days'}
                    </p>
                    <p className="font-semibold text-gray-950 dark:text-white">
                      {numberFormatter.format(stat.last7Days.points)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
