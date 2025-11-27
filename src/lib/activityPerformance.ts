/**
 * Activity Performance Analysis
 * Analyzes user's performance across different activities
 */

import { ActivityRecord } from './activityStore';
import { parseISO, startOfDay, subDays, isSameDay, getDay } from 'date-fns';

export interface ActivityPerformance {
  activityKey: string;
  label: string;
  labelEn?: string;
  icon: string;
  totalCount: number;
  totalPoints: number;
  averagePoints: number;
  bestDay: {
    date: Date;
    points: number;
    count: number;
  } | null;
  recentTrend: 'improving' | 'stable' | 'declining';
  weeklyFrequency: number; // Average times per week
  consistencyScore: number; // 0-100, based on regularity
  lastPerformed: Date | null;
  daysSinceLastPerformed: number | null;
}

/**
 * Calculate performance metrics for each activity
 */
export function calculateActivityPerformance(
  activities: ActivityRecord[],
  days: number = 90
): ActivityPerformance[] {
  const now = new Date();
  const cutoffDate = subDays(now, days);
  const recentActivities = activities.filter((a) => {
    const activityDate = parseISO(a.performedAt);
    return activityDate >= cutoffDate;
  });

  // Group activities by activityKey
  const activityMap = new Map<string, ActivityRecord[]>();
  recentActivities.forEach((activity) => {
    const key = activity.activityKey;
    if (!activityMap.has(key)) {
      activityMap.set(key, []);
    }
    activityMap.get(key)!.push(activity);
  });

  const performances: ActivityPerformance[] = [];

  activityMap.forEach((activityList, activityKey) => {
    if (activityList.length === 0) return;

    const firstActivity = activityList[0];
    const totalCount = activityList.length;
    const totalPoints = activityList.reduce((sum, a) => sum + a.points, 0);
    const averagePoints = totalPoints / totalCount;

    // Find best day
    const dayMap = new Map<string, { date: Date; points: number; count: number }>();
    activityList.forEach((activity) => {
      const date = startOfDay(parseISO(activity.performedAt));
      const key = date.toISOString();
      const existing = dayMap.get(key);
      if (existing) {
        existing.points += activity.points;
        existing.count += 1;
      } else {
        dayMap.set(key, {
          date,
          points: activity.points,
          count: 1,
        });
      }
    });

    let bestDay: ActivityPerformance['bestDay'] = null;
    dayMap.forEach((dayData) => {
      if (!bestDay || dayData.points > bestDay.points) {
        bestDay = dayData;
      }
    });

    // Calculate recent trend (compare last 30 days vs previous 30 days)
    const last30Days = activityList.filter((a) => {
      const activityDate = parseISO(a.performedAt);
      const daysDiff = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 30;
    });

    const previous30Days = activityList.filter((a) => {
      const activityDate = parseISO(a.performedAt);
      const daysDiff = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff > 30 && daysDiff <= 60;
    });

    const recent30Points = last30Days.reduce((sum, a) => sum + a.points, 0);
    const previous30Points = previous30Days.reduce((sum, a) => sum + a.points, 0);

    let recentTrend: ActivityPerformance['recentTrend'] = 'stable';
    if (previous30Points === 0) {
      recentTrend = recent30Points > 0 ? 'improving' : 'stable';
    } else {
      const change = ((recent30Points - previous30Points) / previous30Points) * 100;
      if (change > 10) {
        recentTrend = 'improving';
      } else if (change < -10) {
        recentTrend = 'declining';
      }
    }

    // Calculate weekly frequency
    const uniqueDays = new Set<string>();
    activityList.forEach((activity) => {
      const date = startOfDay(parseISO(activity.performedAt));
      uniqueDays.add(date.toISOString());
    });
    const weeks = days / 7;
    const weeklyFrequency = uniqueDays.size / weeks;

    // Calculate consistency score (based on regularity)
    // Higher score = more consistent (activities spread evenly across time)
    const activityDates = Array.from(uniqueDays)
      .map((iso) => parseISO(iso))
      .sort((a, b) => a.getTime() - b.getTime());

    let consistencyScore = 0;
    if (activityDates.length > 1) {
      const intervals: number[] = [];
      for (let i = 1; i < activityDates.length; i++) {
        const diff = activityDates[i].getTime() - activityDates[i - 1].getTime();
        intervals.push(diff / (1000 * 60 * 60 * 24)); // days
      }

      if (intervals.length > 0) {
        const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
        const variance =
          intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) /
          intervals.length;
        const stdDev = Math.sqrt(variance);

        // Lower variance = higher consistency
        // Score: 100 - (stdDev / avgInterval * 100), clamped to 0-100
        consistencyScore = Math.max(
          0,
          Math.min(100, 100 - (stdDev / Math.max(avgInterval, 1)) * 50)
        );
      } else {
        consistencyScore = 100; // Only one activity = perfect consistency
      }
    } else if (activityDates.length === 1) {
      consistencyScore = 50; // Single activity = medium consistency
    }

    // Find last performed date
    const sortedByDate = [...activityList].sort(
      (a, b) => parseISO(b.performedAt).getTime() - parseISO(a.performedAt).getTime()
    );
    const lastPerformed = parseISO(sortedByDate[0].performedAt);
    const daysSinceLastPerformed = Math.floor(
      (now.getTime() - lastPerformed.getTime()) / (1000 * 60 * 60 * 24)
    );

    performances.push({
      activityKey,
      label: firstActivity.label,
      labelEn: firstActivity.labelEn,
      icon: firstActivity.icon,
      totalCount,
      totalPoints,
      averagePoints,
      bestDay,
      recentTrend,
      weeklyFrequency,
      consistencyScore,
      lastPerformed,
      daysSinceLastPerformed,
    });
  });

  // Sort by total points (descending)
  return performances.sort((a, b) => b.totalPoints - a.totalPoints);
}

/**
 * Get performance insights
 */
export function getPerformanceInsights(performances: ActivityPerformance[]): {
  topPerformer: ActivityPerformance | null;
  mostConsistent: ActivityPerformance | null;
  mostImproved: ActivityPerformance | null;
  needsAttention: ActivityPerformance[];
} {
  if (performances.length === 0) {
    return {
      topPerformer: null,
      mostConsistent: null,
      mostImproved: null,
      needsAttention: [],
    };
  }

  const topPerformer = performances[0]; // Already sorted by totalPoints

  const mostConsistent = performances.reduce((best, current) =>
    current.consistencyScore > best.consistencyScore ? current : best
  );

  const mostImproved = performances
    .filter((p) => p.recentTrend === 'improving')
    .reduce(
      (best, current) => {
        if (!best) return current;
        return current.totalPoints > best.totalPoints ? current : best;
      },
      null as ActivityPerformance | null
    );

  // Activities that haven't been performed in 14+ days
  const needsAttention = performances.filter(
    (p) => p.daysSinceLastPerformed !== null && p.daysSinceLastPerformed >= 14
  );

  return {
    topPerformer,
    mostConsistent,
    mostImproved,
    needsAttention,
  };
}
