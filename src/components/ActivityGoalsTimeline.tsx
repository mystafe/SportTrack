'use client';

import { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import {
  getActivityGoals,
  updateActivityGoalProgress,
  getGoalProgress,
  getGoalDaysRemaining,
  type ActivityGoal,
} from '@/lib/activityGoals';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import {
  format,
  parseISO,
  startOfDay,
  eachDayOfInterval,
  isWithinInterval,
  addDays,
  addWeeks,
  addMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
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

export function ActivityGoalsTimeline() {
  const { t, lang } = useI18n();
  const { activities, hydrated } = useActivities();
  const isMobile = useIsMobile();
  const dateLocale = lang === 'tr' ? tr : enUS;

  const [goals, setGoals] = useState<ActivityGoal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    const loadedGoals = getActivityGoals();
    const updatedGoals = updateActivityGoalProgress(loadedGoals, activities);
    setGoals(updatedGoals);
    if (updatedGoals.length > 0 && !selectedGoalId) {
      const firstActiveGoal = updatedGoals.find((g) => g.enabled && !g.isCompleted);
      if (firstActiveGoal) {
        setSelectedGoalId(firstActiveGoal.id);
      }
    }
  }, [activities, hydrated, selectedGoalId]);

  const activeGoals = useMemo(() => goals.filter((g) => g.enabled && !g.isCompleted), [goals]);
  const selectedGoal = useMemo(
    () => goals.find((g) => g.id === selectedGoalId),
    [goals, selectedGoalId]
  );

  const timelineData = useMemo(() => {
    if (!selectedGoal || !hydrated) return [];

    const start = parseISO(selectedGoal.startDate);
    const end = parseISO(selectedGoal.endDate);
    const now = new Date();
    const endDate = end > now ? now : end;

    let intervalDays: Date[] = [];
    if (selectedGoal.period === 'daily') {
      intervalDays = eachDayOfInterval({ start, end: endDate });
    } else if (selectedGoal.period === 'weekly') {
      const weeks = Math.ceil((endDate.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
      for (let i = 0; i <= weeks; i++) {
        const weekStart = addWeeks(start, i);
        intervalDays.push(startOfWeek(weekStart, { weekStartsOn: 1 }));
      }
    } else if (selectedGoal.period === 'monthly') {
      const months = Math.ceil((endDate.getTime() - start.getTime()) / (30 * 24 * 60 * 60 * 1000));
      for (let i = 0; i <= months; i++) {
        const monthStart = addMonths(start, i);
        intervalDays.push(startOfMonth(monthStart));
      }
    }

    const goalActivities = activities.filter(
      (a) =>
        a.activityKey === selectedGoal.activityKey &&
        isWithinInterval(parseISO(a.performedAt), { start, end: endDate })
    );

    return intervalDays.map((day) => {
      let count = 0;
      let points = 0;

      if (selectedGoal.period === 'daily') {
        const dayActivities = goalActivities.filter((a) =>
          isWithinInterval(parseISO(a.performedAt), {
            start: startOfDay(day),
            end: addDays(startOfDay(day), 1),
          })
        );
        count = dayActivities.length;
        points = dayActivities.reduce((sum, a) => sum + a.points, 0);
      } else if (selectedGoal.period === 'weekly') {
        const weekEnd = endOfWeek(day, { weekStartsOn: 1 });
        const weekActivities = goalActivities.filter((a) =>
          isWithinInterval(parseISO(a.performedAt), { start: day, end: weekEnd })
        );
        count = weekActivities.length;
        points = weekActivities.reduce((sum, a) => sum + a.points, 0);
      } else if (selectedGoal.period === 'monthly') {
        const monthEnd = endOfMonth(day);
        const monthActivities = goalActivities.filter((a) =>
          isWithinInterval(parseISO(a.performedAt), { start: day, end: monthEnd })
        );
        count = monthActivities.length;
        points = monthActivities.reduce((sum, a) => sum + a.points, 0);
      }

      return {
        date: day,
        dateLabel:
          selectedGoal.period === 'daily'
            ? format(day, 'd MMM', { locale: dateLocale })
            : selectedGoal.period === 'weekly'
              ? format(day, 'd MMM', { locale: dateLocale })
              : format(day, 'MMM yyyy', { locale: dateLocale }),
        count,
        target: selectedGoal.targetCount,
        progress: Math.min((count / selectedGoal.targetCount) * 100, 100),
        points,
      };
    });
  }, [selectedGoal, activities, hydrated, dateLocale]);

  const getPeriodLabel = (period: ActivityGoal['period']) => {
    switch (period) {
      case 'daily':
        return lang === 'tr' ? 'Günlük' : 'Daily';
      case 'weekly':
        return lang === 'tr' ? 'Haftalık' : 'Weekly';
      case 'monthly':
        return lang === 'tr' ? 'Aylık' : 'Monthly';
    }
  };

  const getPeriodColor = (period: ActivityGoal['period']) => {
    switch (period) {
      case 'daily':
        return 'from-green-500 to-emerald-600';
      case 'weekly':
        return 'from-blue-500 to-indigo-600';
      case 'monthly':
        return 'from-purple-500 to-pink-600';
    }
  };

  if (!hydrated || activeGoals.length === 0) {
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
            <span className="text-xl">📈</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Hedef İlerleme Takibi' : 'Goal Progress Timeline'}
            </h2>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Goal Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-950 dark:text-white mb-2">
            {lang === 'tr' ? 'Hedef Seç' : 'Select Goal'}
          </label>
          <div className="flex flex-wrap gap-2">
            {activeGoals.map((goal) => {
              const progress = getGoalProgress(goal);
              const isSelected = goal.id === selectedGoalId;

              return (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoalId(goal.id)}
                  className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? `border-brand bg-brand/10 dark:bg-brand/20`
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{goal.icon}</span>
                    <div className="text-left">
                      <div className="text-xs font-semibold text-gray-950 dark:text-white">
                        {lang === 'tr' ? goal.label : goal.labelEn || goal.label}
                      </div>
                      <div className="text-[10px] text-gray-600 dark:text-gray-400">
                        {progress}% · {getPeriodLabel(goal.period)}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline Chart */}
        {selectedGoal && timelineData.length > 0 && (
          <div>
            <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedGoal.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-gray-950 dark:text-white">
                      {lang === 'tr'
                        ? selectedGoal.label
                        : selectedGoal.labelEn || selectedGoal.label}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {getPeriodLabel(selectedGoal.period)} · {selectedGoal.currentCount} /{' '}
                      {selectedGoal.targetCount}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-brand">
                    {getGoalProgress(selectedGoal)}%
                  </div>
                  {getGoalDaysRemaining(selectedGoal) > 0 && (
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {getGoalDaysRemaining(selectedGoal)}{' '}
                      {lang === 'tr' ? 'gün kaldı' : 'days left'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <LineChart data={timelineData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-30" />
                <XAxis
                  dataKey="dateLabel"
                  stroke="currentColor"
                  className="text-xs"
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
                  formatter={(value: number, name: string) => {
                    if (name === 'count') {
                      return [value, lang === 'tr' ? 'Yapılan' : 'Done'];
                    }
                    if (name === 'target') {
                      return [value, lang === 'tr' ? 'Hedef' : 'Target'];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#0ea5e9' }}
                  activeDot={{ r: 6 }}
                  name={lang === 'tr' ? 'Yapılan' : 'Done'}
                  animationDuration={1000}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                  name={lang === 'tr' ? 'Hedef' : 'Target'}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {lang === 'tr' ? 'Toplam' : 'Total'}
                </p>
                <p className="text-lg font-bold text-gray-950 dark:text-white">
                  {timelineData.reduce((sum, d) => sum + d.count, 0)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {lang === 'tr' ? 'Ortalama' : 'Average'}
                </p>
                <p className="text-lg font-bold text-gray-950 dark:text-white">
                  {timelineData.length > 0
                    ? Math.round(
                        timelineData.reduce((sum, d) => sum + d.count, 0) / timelineData.length
                      )
                    : 0}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {lang === 'tr' ? 'En Yüksek' : 'Peak'}
                </p>
                <p className="text-lg font-bold text-brand">
                  {Math.max(...timelineData.map((d) => d.count), 0)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedGoal && timelineData.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lang === 'tr' ? 'Henüz veri yok' : 'No data yet'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
