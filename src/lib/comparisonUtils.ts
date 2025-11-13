/**
 * Weekly and Monthly Comparison Utilities
 * Calculate and compare performance across different time periods
 */

import { ActivityRecord } from './activityStore';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, parseISO, isWithinInterval, format, subWeeks, subMonths, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';

export interface PeriodStats {
  period: string; // Week or month identifier
  startDate: Date;
  endDate: Date;
  totalPoints: number;
  totalActivities: number;
  averageDailyPoints: number;
  daysWithActivities: number;
  completionRate: number; // Percentage of days that met target
  topActivity: {
    key: string;
    label: string;
    icon: string;
    points: number;
    count: number;
  } | null;
}

export interface ComparisonResult {
  current: PeriodStats;
  previous: PeriodStats;
  change: {
    points: number; // Absolute change
    pointsPercent: number; // Percentage change
    activities: number;
    activitiesPercent: number;
    averageDaily: number;
    averageDailyPercent: number;
    completionRate: number;
    completionRatePercent: number;
  };
}

/**
 * Calculate statistics for a specific week
 */
export function calculateWeekStats(
  activities: ActivityRecord[],
  weekStart: Date,
  target: number
): PeriodStats {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 }); // Monday to Sunday
  const start = startOfDay(weekStart);
  const end = startOfDay(weekEnd);

  const weekActivities = activities.filter(activity => {
    const activityDate = parseISO(activity.performedAt);
    return isWithinInterval(startOfDay(activityDate), { start, end });
  });

  const daysMap = new Map<string, { points: number; count: number }>();
  let totalPoints = 0;
  let totalActivities = 0;
  const activityMap = new Map<string, { label: string; icon: string; points: number; count: number }>();

  for (const activity of weekActivities) {
    totalPoints += activity.points;
    totalActivities++;

    const dayKey = format(startOfDay(parseISO(activity.performedAt)), 'yyyy-MM-dd');
    const dayData = daysMap.get(dayKey) || { points: 0, count: 0 };
    dayData.points += activity.points;
    dayData.count++;
    daysMap.set(dayKey, dayData);

    const actKey = activity.activityKey;
    const actData = activityMap.get(actKey) || {
      label: activity.label,
      icon: activity.icon,
      points: 0,
      count: 0
    };
    actData.points += activity.points;
    actData.count++;
    activityMap.set(actKey, actData);
  }

  const daysWithActivities = daysMap.size;
  const daysInWeek = 7;
  const completedDays = Array.from(daysMap.values()).filter(d => d.points >= target).length;
  const completionRate = daysInWeek > 0 ? Math.round((completedDays / daysInWeek) * 100) : 0;
  const averageDailyPoints = daysWithActivities > 0 ? Math.round(totalPoints / daysWithActivities) : 0;

  let topActivity: PeriodStats['topActivity'] = null;
  if (activityMap.size > 0) {
    const top = Array.from(activityMap.values()).reduce((best, current) =>
      current.points > best.points ? current : best
    );
    const topKey = Array.from(activityMap.entries()).find(([_, v]) => v === top)?.[0];
    if (topKey) {
      topActivity = {
        key: topKey,
        label: top.label,
        icon: top.icon,
        points: top.points,
        count: top.count
      };
    }
  }

  return {
    period: format(weekStart, 'yyyy-MM-dd'),
    startDate: start,
    endDate: end,
    totalPoints,
    totalActivities,
    averageDailyPoints,
    daysWithActivities,
    completionRate,
    topActivity
  };
}

/**
 * Calculate statistics for a specific month
 */
export function calculateMonthStats(
  activities: ActivityRecord[],
  monthStart: Date,
  target: number
): PeriodStats {
  const monthEnd = endOfMonth(monthStart);
  const start = startOfDay(monthStart);
  const end = startOfDay(monthEnd);

  const monthActivities = activities.filter(activity => {
    const activityDate = parseISO(activity.performedAt);
    return isWithinInterval(startOfDay(activityDate), { start, end });
  });

  const daysMap = new Map<string, { points: number; count: number }>();
  let totalPoints = 0;
  let totalActivities = 0;
  const activityMap = new Map<string, { label: string; icon: string; points: number; count: number }>();

  for (const activity of monthActivities) {
    totalPoints += activity.points;
    totalActivities++;

    const dayKey = format(startOfDay(parseISO(activity.performedAt)), 'yyyy-MM-dd');
    const dayData = daysMap.get(dayKey) || { points: 0, count: 0 };
    dayData.points += activity.points;
    dayData.count++;
    daysMap.set(dayKey, dayData);

    const actKey = activity.activityKey;
    const actData = activityMap.get(actKey) || {
      label: activity.label,
      icon: activity.icon,
      points: 0,
      count: 0
    };
    actData.points += activity.points;
    actData.count++;
    activityMap.set(actKey, actData);
  }

  const daysWithActivities = daysMap.size;
  const daysInMonth = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const completedDays = Array.from(daysMap.values()).filter(d => d.points >= target).length;
  const completionRate = daysInMonth > 0 ? Math.round((completedDays / daysInMonth) * 100) : 0;
  const averageDailyPoints = daysWithActivities > 0 ? Math.round(totalPoints / daysWithActivities) : 0;

  let topActivity: PeriodStats['topActivity'] = null;
  if (activityMap.size > 0) {
    const top = Array.from(activityMap.values()).reduce((best, current) =>
      current.points > best.points ? current : best
    );
    const topKey = Array.from(activityMap.entries()).find(([_, v]) => v === top)?.[0];
    if (topKey) {
      topActivity = {
        key: topKey,
        label: top.label,
        icon: top.icon,
        points: top.points,
        count: top.count
      };
    }
  }

  return {
    period: format(monthStart, 'yyyy-MM'),
    startDate: start,
    endDate: end,
    totalPoints,
    totalActivities,
    averageDailyPoints,
    daysWithActivities,
    completionRate,
    topActivity
  };
}

/**
 * Compare current week with previous week
 */
export function compareWeeks(
  activities: ActivityRecord[],
  target: number,
  referenceDate: Date = new Date()
): ComparisonResult | null {
  const currentWeekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
  const previousWeekStart = subWeeks(currentWeekStart, 1);

  const current = calculateWeekStats(activities, currentWeekStart, target);
  const previous = calculateWeekStats(activities, previousWeekStart, target);

  if (current.totalActivities === 0 && previous.totalActivities === 0) {
    return null;
  }

  const change = {
    points: current.totalPoints - previous.totalPoints,
    pointsPercent: previous.totalPoints > 0
      ? Math.round(((current.totalPoints - previous.totalPoints) / previous.totalPoints) * 100)
      : current.totalPoints > 0 ? 100 : 0,
    activities: current.totalActivities - previous.totalActivities,
    activitiesPercent: previous.totalActivities > 0
      ? Math.round(((current.totalActivities - previous.totalActivities) / previous.totalActivities) * 100)
      : current.totalActivities > 0 ? 100 : 0,
    averageDaily: current.averageDailyPoints - previous.averageDailyPoints,
    averageDailyPercent: previous.averageDailyPoints > 0
      ? Math.round(((current.averageDailyPoints - previous.averageDailyPoints) / previous.averageDailyPoints) * 100)
      : current.averageDailyPoints > 0 ? 100 : 0,
    completionRate: current.completionRate - previous.completionRate,
    completionRatePercent: previous.completionRate > 0
      ? Math.round(((current.completionRate - previous.completionRate) / previous.completionRate) * 100)
      : current.completionRate > 0 ? 100 : 0
  };

  return { current, previous, change };
}

/**
 * Compare current month with previous month
 */
export function compareMonths(
  activities: ActivityRecord[],
  target: number,
  referenceDate: Date = new Date()
): ComparisonResult | null {
  const currentMonthStart = startOfMonth(referenceDate);
  const previousMonthStart = subMonths(currentMonthStart, 1);

  const current = calculateMonthStats(activities, currentMonthStart, target);
  const previous = calculateMonthStats(activities, previousMonthStart, target);

  if (current.totalActivities === 0 && previous.totalActivities === 0) {
    return null;
  }

  const change = {
    points: current.totalPoints - previous.totalPoints,
    pointsPercent: previous.totalPoints > 0
      ? Math.round(((current.totalPoints - previous.totalPoints) / previous.totalPoints) * 100)
      : current.totalPoints > 0 ? 100 : 0,
    activities: current.totalActivities - previous.totalActivities,
    activitiesPercent: previous.totalActivities > 0
      ? Math.round(((current.totalActivities - previous.totalActivities) / previous.totalActivities) * 100)
      : current.totalActivities > 0 ? 100 : 0,
    averageDaily: current.averageDailyPoints - previous.averageDailyPoints,
    averageDailyPercent: previous.averageDailyPoints > 0
      ? Math.round(((current.averageDailyPoints - previous.averageDailyPoints) / previous.averageDailyPoints) * 100)
      : current.averageDailyPoints > 0 ? 100 : 0,
    completionRate: current.completionRate - previous.completionRate,
    completionRatePercent: previous.completionRate > 0
      ? Math.round(((current.completionRate - previous.completionRate) / previous.completionRate) * 100)
      : current.completionRate > 0 ? 100 : 0
  };

  return { current, previous, change };
}

