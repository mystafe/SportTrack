/**
 * Advanced Statistics Utilities
 * Calculates various metrics for statistics page
 */

import { ActivityRecord } from './activityStore';
import {
  startOfDay,
  parseISO,
  startOfWeek,
  startOfMonth,
  subWeeks,
  subMonths,
  getDay,
  getHours,
  isWeekend,
  isSameDay,
  subDays,
} from 'date-fns';

export interface WeeklyStats {
  weekStart: Date;
  totalPoints: number;
  averagePerDay: number;
  completedDays: number;
  completionRate: number;
}

export interface MonthlyStats {
  monthStart: Date;
  totalPoints: number;
  averagePerDay: number;
  completedDays: number;
  completionRate: number;
}

export interface ConsistencyScore {
  score: number; // 0-100
  factors: {
    regularity: number; // How consistent the activity pattern is
    frequency: number; // How often activities are performed
    progression: number; // Whether there's improvement over time
  };
}

export interface ActivityDiversity {
  score: number; // 0-100
  uniqueActivities: number;
  totalActivities: number;
  diversityRatio: number;
}

export interface ProgressVelocity {
  currentAverage: number;
  previousAverage: number;
  velocity: number; // Percentage change
  trend: 'up' | 'down' | 'stable';
}

/**
 * Calculate weekly statistics
 */
export function calculateWeeklyStats(
  activities: ActivityRecord[],
  target: number,
  weeksBack: number = 4
): WeeklyStats[] {
  const weeks: WeeklyStats[] = [];
  const today = startOfDay(new Date());

  for (let i = 0; i < weeksBack; i++) {
    const weekStart = startOfWeek(subWeeks(today, i), { weekStartsOn: 1 }); // Monday
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weekActivities = activities.filter((activity) => {
      const activityDate = startOfDay(parseISO(activity.performedAt));
      return activityDate >= weekStart && activityDate <= weekEnd;
    });

    const daysMap = new Map<string, number>();
    for (const activity of weekActivities) {
      const dateKey = startOfDay(parseISO(activity.performedAt)).toISOString();
      daysMap.set(dateKey, (daysMap.get(dateKey) || 0) + activity.points);
    }

    const totalPoints = weekActivities.reduce((sum, a) => sum + a.points, 0);
    const completedDays = Array.from(daysMap.values()).filter((points) => points >= target).length;
    const averagePerDay = daysMap.size > 0 ? totalPoints / daysMap.size : 0;
    const completionRate = daysMap.size > 0 ? (completedDays / 7) * 100 : 0;

    weeks.push({
      weekStart,
      totalPoints,
      averagePerDay,
      completedDays,
      completionRate,
    });
  }

  return weeks.reverse(); // Oldest first
}

/**
 * Calculate monthly statistics
 */
export function calculateMonthlyStats(
  activities: ActivityRecord[],
  target: number,
  monthsBack: number = 6
): MonthlyStats[] {
  const months: MonthlyStats[] = [];
  const today = startOfDay(new Date());

  for (let i = 0; i < monthsBack; i++) {
    const monthStart = startOfMonth(subMonths(today, i));
    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    monthEnd.setDate(0); // Last day of month

    const monthActivities = activities.filter((activity) => {
      const activityDate = startOfDay(parseISO(activity.performedAt));
      return activityDate >= monthStart && activityDate <= monthEnd;
    });

    const daysMap = new Map<string, number>();
    for (const activity of monthActivities) {
      const dateKey = startOfDay(parseISO(activity.performedAt)).toISOString();
      daysMap.set(dateKey, (daysMap.get(dateKey) || 0) + activity.points);
    }

    const totalPoints = monthActivities.reduce((sum, a) => sum + a.points, 0);
    const completedDays = Array.from(daysMap.values()).filter((points) => points >= target).length;
    const daysInMonth = monthEnd.getDate();
    const averagePerDay = daysMap.size > 0 ? totalPoints / daysMap.size : 0;
    const completionRate = daysInMonth > 0 ? (completedDays / daysInMonth) * 100 : 0;

    months.push({
      monthStart,
      totalPoints,
      averagePerDay,
      completedDays,
      completionRate,
    });
  }

  return months.reverse(); // Oldest first
}

/**
 * Calculate consistency score (0-100)
 */
export function calculateConsistencyScore(
  activities: ActivityRecord[],
  target: number
): ConsistencyScore {
  if (activities.length === 0) {
    return {
      score: 0,
      factors: {
        regularity: 0,
        frequency: 0,
        progression: 0,
      },
    };
  }

  const daysMap = new Map<string, number>();
  for (const activity of activities) {
    const dateKey = startOfDay(parseISO(activity.performedAt)).toISOString();
    daysMap.set(dateKey, (daysMap.get(dateKey) || 0) + activity.points);
  }

  const sortedDays = Array.from(daysMap.entries())
    .map(([date, points]) => ({ date: parseISO(date), points }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Regularity: How consistent the pattern is (variance in daily points)
  const dailyPoints = sortedDays.map((d) => d.points);
  const mean = dailyPoints.reduce((sum, p) => sum + p, 0) / dailyPoints.length;
  const variance =
    dailyPoints.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / dailyPoints.length;
  const stdDev = Math.sqrt(variance);
  const regularity = Math.max(0, 100 - (stdDev / mean) * 100); // Lower variance = higher score

  // Frequency: How often activities are performed
  const totalDays = sortedDays.length;
  const firstDay = sortedDays[0]?.date || new Date();
  const lastDay = sortedDays[sortedDays.length - 1]?.date || new Date();
  const daysSpan = Math.max(
    1,
    Math.ceil((lastDay.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24))
  );
  const frequency = (totalDays / daysSpan) * 100;

  // Progression: Whether there's improvement over time
  const recentDays = sortedDays.slice(-7);
  const olderDays = sortedDays.slice(0, Math.min(7, sortedDays.length - 7));
  const recentAvg =
    recentDays.length > 0
      ? recentDays.reduce((sum, d) => sum + d.points, 0) / recentDays.length
      : 0;
  const olderAvg =
    olderDays.length > 0 ? olderDays.reduce((sum, d) => sum + d.points, 0) / olderDays.length : 0;
  const progression = olderAvg > 0 ? Math.min(100, (recentAvg / olderAvg) * 100) : 50;

  const score = Math.round(regularity * 0.4 + frequency * 0.3 + progression * 0.3);

  return {
    score: Math.min(100, Math.max(0, score)),
    factors: {
      regularity: Math.round(regularity),
      frequency: Math.round(frequency),
      progression: Math.round(progression),
    },
  };
}

/**
 * Calculate activity diversity score
 */
export function calculateActivityDiversity(activities: ActivityRecord[]): ActivityDiversity {
  if (activities.length === 0) {
    return {
      score: 0,
      uniqueActivities: 0,
      totalActivities: activities.length,
      diversityRatio: 0,
    };
  }

  const uniqueActivities = new Set(activities.map((a) => a.activityKey)).size;
  const totalActivities = activities.length;
  const diversityRatio = uniqueActivities / totalActivities;
  const score = Math.round(diversityRatio * 100);

  return {
    score: Math.min(100, score),
    uniqueActivities,
    totalActivities,
    diversityRatio,
  };
}

/**
 * Calculate progress velocity
 */
export function calculateProgressVelocity(
  activities: ActivityRecord[],
  days: number = 30
): ProgressVelocity {
  if (activities.length === 0) {
    return {
      currentAverage: 0,
      previousAverage: 0,
      velocity: 0,
      trend: 'stable',
    };
  }

  const today = startOfDay(new Date());
  const currentPeriodStart = subDays(today, days);
  const previousPeriodStart = subDays(currentPeriodStart, days);

  const currentActivities = activities.filter((activity) => {
    const activityDate = startOfDay(parseISO(activity.performedAt));
    return activityDate >= currentPeriodStart && activityDate < today;
  });

  const previousActivities = activities.filter((activity) => {
    const activityDate = startOfDay(parseISO(activity.performedAt));
    return activityDate >= previousPeriodStart && activityDate < currentPeriodStart;
  });

  const currentDaysMap = new Map<string, number>();
  for (const activity of currentActivities) {
    const dateKey = startOfDay(parseISO(activity.performedAt)).toISOString();
    currentDaysMap.set(dateKey, (currentDaysMap.get(dateKey) || 0) + activity.points);
  }

  const previousDaysMap = new Map<string, number>();
  for (const activity of previousActivities) {
    const dateKey = startOfDay(parseISO(activity.performedAt)).toISOString();
    previousDaysMap.set(dateKey, (previousDaysMap.get(dateKey) || 0) + activity.points);
  }

  const currentAverage =
    currentDaysMap.size > 0
      ? Array.from(currentDaysMap.values()).reduce((sum, p) => sum + p, 0) / currentDaysMap.size
      : 0;
  const previousAverage =
    previousDaysMap.size > 0
      ? Array.from(previousDaysMap.values()).reduce((sum, p) => sum + p, 0) / previousDaysMap.size
      : 0;

  const velocity =
    previousAverage > 0 ? ((currentAverage - previousAverage) / previousAverage) * 100 : 0;
  const trend = velocity > 5 ? 'up' : velocity < -5 ? 'down' : 'stable';

  return {
    currentAverage,
    previousAverage,
    velocity: Math.round(velocity * 10) / 10,
    trend,
  };
}

/**
 * Get most active day of week (weekday vs weekend)
 */
export function getMostActiveDayType(activities: ActivityRecord[]): {
  weekday: { total: number; average: number; count: number };
  weekend: { total: number; average: number; count: number };
  mostActive: 'weekday' | 'weekend' | 'equal';
} {
  const weekdayActivities: ActivityRecord[] = [];
  const weekendActivities: ActivityRecord[] = [];

  for (const activity of activities) {
    const activityDate = parseISO(activity.performedAt);
    if (isWeekend(activityDate)) {
      weekendActivities.push(activity);
    } else {
      weekdayActivities.push(activity);
    }
  }

  const weekdayDays = new Set(
    weekdayActivities.map((a) => startOfDay(parseISO(a.performedAt)).toISOString())
  ).size;
  const weekendDays = new Set(
    weekendActivities.map((a) => startOfDay(parseISO(a.performedAt)).toISOString())
  ).size;

  const weekdayTotal = weekdayActivities.reduce((sum, a) => sum + a.points, 0);
  const weekendTotal = weekendActivities.reduce((sum, a) => sum + a.points, 0);

  const weekdayAverage = weekdayDays > 0 ? weekdayTotal / weekdayDays : 0;
  const weekendAverage = weekendDays > 0 ? weekendTotal / weekendDays : 0;

  let mostActive: 'weekday' | 'weekend' | 'equal' = 'equal';
  if (weekdayAverage > weekendAverage * 1.1) {
    mostActive = 'weekday';
  } else if (weekendAverage > weekdayAverage * 1.1) {
    mostActive = 'weekend';
  }

  return {
    weekday: {
      total: weekdayTotal,
      average: Math.round(weekdayAverage),
      count: weekdayDays,
    },
    weekend: {
      total: weekendTotal,
      average: Math.round(weekendAverage),
      count: weekendDays,
    },
    mostActive,
  };
}

/**
 * Get most active hour range
 */
export function getMostActiveHourRange(activities: ActivityRecord[]): {
  hour: number;
  count: number;
  percentage: number;
  distribution: Array<{ hour: number; count: number; percentage: number }>;
} {
  const hourCounts = new Map<number, number>();

  for (const activity of activities) {
    const activityDate = parseISO(activity.performedAt);
    const hour = getHours(activityDate);
    hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
  }

  const distribution = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: hourCounts.get(i) || 0,
    percentage: 0,
  }));

  const total = activities.length;
  distribution.forEach((item) => {
    item.percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
  });

  const mostActive = distribution.reduce(
    (max, item) => (item.count > max.count ? item : max),
    distribution[0]
  );

  return {
    hour: mostActive.hour,
    count: mostActive.count,
    percentage: mostActive.percentage,
    distribution,
  };
}

/**
 * Calculate streak statistics
 */
export function calculateStreakStats(
  activities: ActivityRecord[],
  target: number
): {
  currentStreak: number;
  longestStreak: number;
  averageStreak: number;
  streakHistory: Array<{ start: Date; end: Date; length: number }>;
} {
  if (activities.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      averageStreak: 0,
      streakHistory: [],
    };
  }

  const daysMap = new Map<string, number>();
  for (const activity of activities) {
    const dateKey = startOfDay(parseISO(activity.performedAt)).toISOString();
    daysMap.set(dateKey, (daysMap.get(dateKey) || 0) + activity.points);
  }

  const sortedDays = Array.from(daysMap.entries())
    .map(([date, points]) => ({ date: parseISO(date), points, completed: points >= target }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  let currentStreak = 0;
  let longestStreak = 0;
  const streakHistory: Array<{ start: Date; end: Date; length: number }> = [];
  let currentStreakStart: Date | null = null;
  let currentStreakLength = 0;

  const today = startOfDay(new Date());
  const yesterday = subDays(today, 1);

  // Calculate current streak (from today backwards)
  for (let i = sortedDays.length - 1; i >= 0; i--) {
    const day = sortedDays[i];
    if (day.completed) {
      if (currentStreak === 0 && (isSameDay(day.date, today) || isSameDay(day.date, yesterday))) {
        currentStreak = 1;
        let j = i - 1;
        while (j >= 0 && sortedDays[j].completed) {
          const prevDay = sortedDays[j];
          const dayDiff = Math.ceil(
            (day.date.getTime() - prevDay.date.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (dayDiff === 1) {
            currentStreak++;
            j--;
          } else {
            break;
          }
        }
      }
    } else {
      break;
    }
  }

  // Calculate all streaks
  for (let i = 0; i < sortedDays.length; i++) {
    const day = sortedDays[i];
    if (day.completed) {
      if (currentStreakLength === 0) {
        currentStreakStart = day.date;
        currentStreakLength = 1;
      } else {
        const prevDay = sortedDays[i - 1];
        const dayDiff = Math.ceil(
          (day.date.getTime() - prevDay.date.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (dayDiff === 1) {
          currentStreakLength++;
        } else {
          // Streak broken
          if (currentStreakStart) {
            streakHistory.push({
              start: currentStreakStart,
              end: sortedDays[i - 1].date,
              length: currentStreakLength,
            });
            longestStreak = Math.max(longestStreak, currentStreakLength);
          }
          currentStreakStart = day.date;
          currentStreakLength = 1;
        }
      }
    } else {
      // Streak broken
      if (currentStreakStart && currentStreakLength > 0) {
        streakHistory.push({
          start: currentStreakStart,
          end: sortedDays[i - 1]?.date || currentStreakStart,
          length: currentStreakLength,
        });
        longestStreak = Math.max(longestStreak, currentStreakLength);
      }
      currentStreakStart = null;
      currentStreakLength = 0;
    }
  }

  // Add final streak if exists
  if (currentStreakStart && currentStreakLength > 0) {
    streakHistory.push({
      start: currentStreakStart,
      end: sortedDays[sortedDays.length - 1].date,
      length: currentStreakLength,
    });
    longestStreak = Math.max(longestStreak, currentStreakLength);
  }

  const averageStreak =
    streakHistory.length > 0
      ? Math.round(streakHistory.reduce((sum, s) => sum + s.length, 0) / streakHistory.length)
      : 0;

  return {
    currentStreak,
    longestStreak,
    averageStreak,
    streakHistory,
  };
}
