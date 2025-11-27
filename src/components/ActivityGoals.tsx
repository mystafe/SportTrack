'use client';

import { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useActivityDefinitions } from '@/lib/settingsStore';
import {
  getActivityGoals,
  addActivityGoal,
  updateActivityGoal,
  deleteActivityGoal,
  toggleActivityGoal,
  updateActivityGoalProgress,
  createActivityGoal,
  getGoalProgress,
  getGoalDaysRemaining,
  type ActivityGoal,
  type GoalPeriod,
} from '@/lib/activityGoals';
import { ActivityKey } from '@/lib/activityConfig';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToaster } from '@/components/Toaster';
import { format, parseISO } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';

export function ActivityGoals() {
  const { t, lang } = useI18n();
  const { showToast } = useToaster();
  const isMobile = useIsMobile();
  const { activities } = useActivities();
  const activityDefinitions = useActivityDefinitions();
  const dateLocale = lang === 'tr' ? tr : enUS;

  const [goals, setGoals] = useState<ActivityGoal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityKey | ''>('');
  const [targetCount, setTargetCount] = useState('5');
  const [period, setPeriod] = useState<GoalPeriod>('weekly');

  useEffect(() => {
    const loadedGoals = getActivityGoals();
    const updatedGoals = updateActivityGoalProgress(loadedGoals, activities);
    setGoals(updatedGoals);
    saveActivityGoals(updatedGoals);
  }, [activities]);

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );

  const handleAddGoal = () => {
    if (!selectedActivity) {
      showToast(lang === 'tr' ? 'Lütfen bir aktivite seçin' : 'Please select an activity', 'error');
      return;
    }

    const count = parseInt(targetCount, 10);
    if (isNaN(count) || count <= 0) {
      showToast(
        lang === 'tr' ? "Hedef sayı 0'dan büyük olmalıdır" : 'Target count must be greater than 0',
        'error'
      );
      return;
    }

    const activity = activityDefinitions.find((a) => a.key === selectedActivity);
    if (!activity) return;

    const newGoal = createActivityGoal(
      selectedActivity,
      activity.label,
      activity.labelEn,
      activity.icon,
      count,
      period
    );

    addActivityGoal(newGoal);
    setGoals(getActivityGoals());
    setShowAddForm(false);
    setSelectedActivity('');
    setTargetCount('5');
    setPeriod('weekly');

    showToast(lang === 'tr' ? 'Hedef eklendi' : 'Goal added', 'success');
  };

  const handleToggleGoal = (id: string) => {
    toggleActivityGoal(id);
    setGoals(getActivityGoals());
  };

  const handleDeleteGoal = (id: string) => {
    if (
      confirm(
        lang === 'tr'
          ? 'Hedefi silmek istediğinize emin misiniz?'
          : 'Are you sure you want to delete this goal?'
      )
    ) {
      deleteActivityGoal(id);
      setGoals(getActivityGoals());
      showToast(lang === 'tr' ? 'Hedef silindi' : 'Goal deleted', 'success');
    }
  };

  const activeGoals = goals.filter((g) => g.enabled && !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);
  const expiredGoals = goals.filter((g) => !g.enabled && !g.isCompleted);

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
          <Button variant="primary" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? '✕' : '+'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Add Form */}
        {showAddForm && (
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {lang === 'tr' ? 'Aktivite' : 'Activity'}
                </label>
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value as ActivityKey)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-950 dark:text-white"
                >
                  <option value="">{lang === 'tr' ? 'Seçin...' : 'Select...'}</option>
                  {activityDefinitions.map((activity) => (
                    <option key={activity.key} value={activity.key}>
                      {activity.icon}{' '}
                      {lang === 'tr' ? activity.label : activity.labelEn || activity.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {lang === 'tr' ? 'Hedef Sayı' : 'Target Count'}
                  </label>
                  <Input
                    type="number"
                    value={targetCount}
                    onChange={(e) => setTargetCount(e.target.value)}
                    min="1"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {lang === 'tr' ? 'Periyot' : 'Period'}
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as GoalPeriod)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-950 dark:text-white"
                  >
                    <option value="daily">{lang === 'tr' ? 'Günlük' : 'Daily'}</option>
                    <option value="weekly">{lang === 'tr' ? 'Haftalık' : 'Weekly'}</option>
                    <option value="monthly">{lang === 'tr' ? 'Aylık' : 'Monthly'}</option>
                  </select>
                </div>
              </div>

              <Button variant="primary" size="sm" onClick={handleAddGoal} className="w-full">
                {lang === 'tr' ? 'Hedef Ekle' : 'Add Goal'}
              </Button>
            </div>
          </div>
        )}

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-2">
              {lang === 'tr' ? 'Aktif Hedefler' : 'Active Goals'}
            </h3>
            <div className="space-y-2">
              {activeGoals.map((goal) => {
                const progress = getGoalProgress(goal);
                const daysRemaining = getGoalDaysRemaining(goal);

                return (
                  <div
                    key={goal.id}
                    className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-xl flex-shrink-0">{goal.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-950 dark:text-white">
                            {lang === 'tr' ? goal.label : goal.labelEn || goal.label}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {goal.currentCount} / {goal.targetCount}{' '}
                            {lang === 'tr'
                              ? goal.period === 'daily'
                                ? 'günlük'
                                : goal.period === 'weekly'
                                  ? 'haftalık'
                                  : 'aylık'
                              : goal.period}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleGoal(goal.id)}
                          className="px-2 py-1 rounded text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          ⏸️
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="px-2 py-1 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          🗑️
                        </button>
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
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
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

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-2">
              {lang === 'tr' ? 'Tamamlanan Hedefler' : 'Completed Goals'}
            </h3>
            <div className="space-y-2">
              {completedGoals.slice(0, 5).map((goal) => (
                <div
                  key={goal.id}
                  className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xl flex-shrink-0">{goal.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-950 dark:text-white">
                          {lang === 'tr' ? goal.label : goal.labelEn || goal.label}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {goal.currentCount} / {goal.targetCount} ✓
                        </p>
                      </div>
                    </div>
                    {goal.completedAt && (
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {format(parseISO(goal.completedAt), 'dd MMM', { locale: dateLocale })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {goals.length === 0 && (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">🎯</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lang === 'tr'
                ? 'Henüz hedef yok. Yeni bir hedef ekleyin!'
                : 'No goals yet. Add a new goal!'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

// Helper function to save goals (needed for the component)
function saveActivityGoals(goals: ActivityGoal[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('sporttrack.activityGoals.v1', JSON.stringify(goals));
  } catch (error) {
    console.error('Failed to save activity goals:', error);
  }
}
