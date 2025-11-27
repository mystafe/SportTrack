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
import { format, parseISO } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import Link from 'next/link';

export function ActivityGoalsDashboard() {
  const { t, lang } = useI18n();
  const { activities } = useActivities();
  const isMobile = useIsMobile();
  const dateLocale = lang === 'tr' ? tr : enUS;

  const [goals, setGoals] = useState<ActivityGoal[]>([]);

  useEffect(() => {
    const loadedGoals = getActivityGoals();
    const updatedGoals = updateActivityGoalProgress(loadedGoals, activities);
    setGoals(updatedGoals);
  }, [activities]);

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );

  const activeGoals = useMemo(() => goals.filter((g) => g.enabled && !g.isCompleted), [goals]);
  const completedGoals = useMemo(() => goals.filter((g) => g.isCompleted), [goals]);

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

  if (goals.length === 0) {
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
            <span className="text-xl">🎯</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Aktivite Hedefleri' : 'Activity Goals'}
            </h2>
          </div>
          <Link
            href="/"
            className="text-xs sm:text-sm text-brand hover:text-brand-dark font-semibold"
          >
            {lang === 'tr' ? 'Yönet →' : 'Manage →'}
          </Link>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {lang === 'tr' ? 'Aktif' : 'Active'}
            </p>
            <p className="text-lg font-bold text-gray-950 dark:text-white">{activeGoals.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {lang === 'tr' ? 'Tamamlanan' : 'Completed'}
            </p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {completedGoals.length}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {lang === 'tr' ? 'Toplam' : 'Total'}
            </p>
            <p className="text-lg font-bold text-gray-950 dark:text-white">{goals.length}</p>
          </div>
        </div>

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-3">
              {lang === 'tr' ? 'Aktif Hedefler' : 'Active Goals'}
            </h3>
            <div className="space-y-3">
              {activeGoals.slice(0, 5).map((goal) => {
                const progress = getGoalProgress(goal);
                const daysRemaining = getGoalDaysRemaining(goal);

                return (
                  <div
                    key={goal.id}
                    className="p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl flex-shrink-0">{goal.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-gray-950 dark:text-white truncate">
                            {lang === 'tr' ? goal.label : goal.labelEn || goal.label}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold text-white bg-gradient-to-r ${getPeriodColor(goal.period)}`}
                          >
                            {getPeriodLabel(goal.period)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {goal.currentCount} / {goal.targetCount}{' '}
                          {lang === 'tr' ? 'tamamlandı' : 'completed'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          {lang === 'tr' ? 'İlerleme' : 'Progress'}
                        </span>
                        <span className="font-semibold text-gray-950 dark:text-white">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getPeriodColor(goal.period)} transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {daysRemaining > 0 && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {lang === 'tr'
                            ? `${daysRemaining} gün kaldı`
                            : `${daysRemaining} days remaining`}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Goals Preview */}
        {completedGoals.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-2">
              {lang === 'tr' ? 'Son Tamamlananlar' : 'Recently Completed'}
            </h3>
            <div className="space-y-2">
              {completedGoals.slice(0, 3).map((goal) => (
                <div
                  key={goal.id}
                  className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{goal.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-950 dark:text-white truncate">
                        {lang === 'tr' ? goal.label : goal.labelEn || goal.label}
                      </p>
                      {goal.completedAt && (
                        <p className="text-[10px] text-gray-600 dark:text-gray-400">
                          {format(parseISO(goal.completedAt), 'dd MMM yyyy', {
                            locale: dateLocale,
                          })}
                        </p>
                      )}
                    </div>
                    <span className="text-lg">✓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {activeGoals.length === 0 && completedGoals.length === 0 && (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">🎯</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {lang === 'tr' ? 'Henüz hedef yok' : 'No goals yet'}
            </p>
            <Link
              href="/"
              className="inline-block px-4 py-2 rounded-lg bg-brand text-white hover:bg-brand-dark text-sm font-semibold transition-all duration-300"
            >
              {lang === 'tr' ? 'Hedef Ekle' : 'Add Goal'}
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
