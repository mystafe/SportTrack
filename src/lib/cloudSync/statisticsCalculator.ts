/**
 * Statistics Calculator
 * Calculates statistics from exercises and saves to Firestore
 */

import type { ActivityRecord } from '@/lib/activityStore';
import type { StatisticsDocument } from './types';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';
import { parseISO } from 'date-fns';

/**
 * Calculate overall statistics from exercises
 */
export function calculateOverallStatistics(
  exercises: ActivityRecord[],
  dailyTarget: number
): StatisticsDocument {
  const now = new Date();
  const totalPoints = exercises.reduce((sum, ex) => sum + (ex.points || 0), 0);
  const totalExercises = exercises.length;

  // Calculate unique activity types
  const activityTypes = new Set(exercises.map((ex) => ex.activityKey));
  const totalActivities = activityTypes.size;

  // Calculate streak
  const streakDays = calculateStreak(exercises, dailyTarget);

  // Calculate average daily points
  const daysWithExercises = new Set(
    exercises.map((ex) => format(startOfDay(parseISO(ex.performedAt)), 'yyyy-MM-dd'))
  ).size;
  const averageDailyPoints =
    daysWithExercises > 0 ? Math.round(totalPoints / daysWithExercises) : 0;

  // Calculate completion rate
  const completedDays = calculateCompletedDays(exercises, dailyTarget);
  const completionRate =
    daysWithExercises > 0 ? Math.round((completedDays / daysWithExercises) * 100) : 0;

  return {
    id: 'overall',
    totalPoints,
    totalExercises,
    totalActivities,
    streakDays,
    averageDailyPoints,
    completionRate,
    lastCalculated: now,
  };
}

/**
 * Calculate statistics for a specific period
 */
export function calculatePeriodStatistics(
  exercises: ActivityRecord[],
  dailyTarget: number,
  startDate: Date,
  endDate: Date
): StatisticsDocument {
  const periodStart = startOfDay(startDate);
  const periodEnd = endOfDay(endDate);

  const periodExercises = exercises.filter((ex) => {
    const exDate = startOfDay(parseISO(ex.performedAt));
    return exDate >= periodStart && exDate <= periodEnd;
  });

  const totalPoints = periodExercises.reduce((sum, ex) => sum + (ex.points || 0), 0);
  const totalExercises = periodExercises.length;

  const activityTypes = new Set(periodExercises.map((ex) => ex.activityKey));
  const totalActivities = activityTypes.size;

  const daysWithExercises = new Set(
    periodExercises.map((ex) => format(startOfDay(parseISO(ex.performedAt)), 'yyyy-MM-dd'))
  ).size;

  const averageDailyPoints =
    daysWithExercises > 0 ? Math.round(totalPoints / daysWithExercises) : 0;

  const completedDays = calculateCompletedDays(periodExercises, dailyTarget);
  const completionRate =
    daysWithExercises > 0 ? Math.round((completedDays / daysWithExercises) * 100) : 0;

  return {
    id: `period-${format(periodStart, 'yyyy-MM-dd')}-${format(periodEnd, 'yyyy-MM-dd')}`,
    totalPoints,
    totalExercises,
    totalActivities,
    streakDays: calculateStreak(periodExercises, dailyTarget),
    averageDailyPoints,
    completionRate,
    lastCalculated: new Date(),
    period: {
      start: periodStart,
      end: periodEnd,
    },
  };
}

/**
 * Calculate streak days
 */
function calculateStreak(exercises: ActivityRecord[], dailyTarget: number): number {
  if (exercises.length === 0) return 0;

  // Group exercises by day
  const dailyPoints = new Map<string, number>();
  for (const ex of exercises) {
    const dayKey = format(startOfDay(parseISO(ex.performedAt)), 'yyyy-MM-dd');
    dailyPoints.set(dayKey, (dailyPoints.get(dayKey) || 0) + (ex.points || 0));
  }

  // Sort days descending
  const sortedDays = Array.from(dailyPoints.entries())
    .map(([date, points]) => ({ date, points }))
    .sort((a, b) => b.date.localeCompare(a.date));

  // Calculate streak from most recent day
  let streak = 0;
  const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
  let currentDate = today;

  for (const day of sortedDays) {
    if (day.date === currentDate && day.points >= dailyTarget) {
      streak++;
      // Move to previous day
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      currentDate = format(prevDate, 'yyyy-MM-dd');
    } else if (day.date === currentDate) {
      // Day exists but didn't meet target, streak broken
      break;
    } else if (day.date < currentDate) {
      // Gap in days, streak broken
      break;
    }
  }

  return streak;
}

/**
 * Calculate number of completed days (days that met daily target)
 */
function calculateCompletedDays(exercises: ActivityRecord[], dailyTarget: number): number {
  const dailyPoints = new Map<string, number>();
  for (const ex of exercises) {
    const dayKey = format(startOfDay(parseISO(ex.performedAt)), 'yyyy-MM-dd');
    dailyPoints.set(dayKey, (dailyPoints.get(dayKey) || 0) + (ex.points || 0));
  }

  let completedDays = 0;
  for (const points of dailyPoints.values()) {
    if (points >= dailyTarget) {
      completedDays++;
    }
  }

  return completedDays;
}
