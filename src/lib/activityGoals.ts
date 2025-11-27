/**
 * Activity Goals System
 * Allows users to set goals for specific activities
 */

import { ActivityKey } from './activityConfig';
import { STORAGE_KEYS } from './constants';
import { ActivityRecord } from './activityStore';
import {
  startOfDay,
  parseISO,
  isWithinInterval,
  addDays,
  addWeeks,
  addMonths,
  format,
} from 'date-fns';

export type GoalPeriod = 'daily' | 'weekly' | 'monthly';

export interface ActivityGoal {
  id: string;
  activityKey: ActivityKey;
  label: string;
  labelEn?: string;
  icon: string;
  targetCount: number; // Target number of times to perform the activity
  period: GoalPeriod;
  startDate: string; // ISO string
  endDate: string; // ISO string (calculated based on period)
  currentCount: number;
  isCompleted: boolean;
  completedAt?: string; // ISO string
  createdAt: string; // ISO string
  enabled: boolean;
}

export function getActivityGoals(): ActivityGoal[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITY_GOALS);
    if (!stored) return [];
    return JSON.parse(stored) as ActivityGoal[];
  } catch (error) {
    console.error('Failed to load activity goals:', error);
    return [];
  }
}

export function saveActivityGoals(goals: ActivityGoal[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_GOALS, JSON.stringify(goals));
  } catch (error) {
    console.error('Failed to save activity goals:', error);
  }
}

function calculateEndDate(startDate: Date, period: GoalPeriod): Date {
  switch (period) {
    case 'daily':
      return addDays(startDate, 1);
    case 'weekly':
      return addWeeks(startDate, 1);
    case 'monthly':
      return addMonths(startDate, 1);
  }
}

export function createActivityGoal(
  activityKey: ActivityKey,
  label: string,
  labelEn: string | undefined,
  icon: string,
  targetCount: number,
  period: GoalPeriod,
  startDate: Date = new Date()
): ActivityGoal {
  const start = startOfDay(startDate);
  const end = calculateEndDate(start, period);

  return {
    id: `goal-${activityKey}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    activityKey,
    label,
    labelEn,
    icon,
    targetCount,
    period,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    currentCount: 0,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    enabled: true,
  };
}

export function updateActivityGoalProgress(
  goals: ActivityGoal[],
  activities: ActivityRecord[]
): ActivityGoal[] {
  const now = new Date();

  return goals.map((goal) => {
    if (!goal.enabled) return goal;

    const start = parseISO(goal.startDate);
    const end = parseISO(goal.endDate);

    // Check if goal period has expired
    if (now > end && !goal.isCompleted) {
      return {
        ...goal,
        enabled: false,
      };
    }

    // Count activities within goal period
    const relevantActivities = activities.filter((activity) => {
      if (activity.activityKey !== goal.activityKey) return false;
      const activityDate = parseISO(activity.performedAt);
      return isWithinInterval(activityDate, { start, end });
    });

    const currentCount = relevantActivities.length;
    const isCompleted = currentCount >= goal.targetCount;

    return {
      ...goal,
      currentCount,
      isCompleted,
      completedAt: isCompleted && !goal.completedAt ? now.toISOString() : goal.completedAt,
    };
  });
}

export function addActivityGoal(goal: Omit<ActivityGoal, 'id' | 'createdAt'>): ActivityGoal {
  const goals = getActivityGoals();
  const newGoal: ActivityGoal = {
    ...goal,
    id: `goal-${goal.activityKey}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  goals.push(newGoal);
  saveActivityGoals(goals);
  return newGoal;
}

export function updateActivityGoal(
  id: string,
  updates: Partial<ActivityGoal>
): ActivityGoal | null {
  const goals = getActivityGoals();
  const index = goals.findIndex((g) => g.id === id);
  if (index === -1) return null;

  goals[index] = { ...goals[index], ...updates };
  saveActivityGoals(goals);
  return goals[index];
}

export function deleteActivityGoal(id: string): boolean {
  const goals = getActivityGoals();
  const filtered = goals.filter((g) => g.id !== id);
  if (filtered.length === goals.length) return false;

  saveActivityGoals(filtered);
  return true;
}

export function toggleActivityGoal(id: string): ActivityGoal | null {
  const goals = getActivityGoals();
  const goal = goals.find((g) => g.id === id);
  if (!goal) return null;

  goal.enabled = !goal.enabled;
  saveActivityGoals(goals);
  return goal;
}

/**
 * Get progress percentage for a goal
 */
export function getGoalProgress(goal: ActivityGoal): number {
  if (goal.targetCount === 0) return 0;
  return Math.min(100, Math.round((goal.currentCount / goal.targetCount) * 100));
}

/**
 * Get days remaining for a goal
 */
export function getGoalDaysRemaining(goal: ActivityGoal): number {
  const now = startOfDay(new Date());
  const end = startOfDay(parseISO(goal.endDate));
  const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}
