'use client';

import { ActivityRecord } from './activityStore';
import { startOfDay, parseISO, subDays, format, eachDayOfInterval } from 'date-fns';

export interface ActivityTrendData {
  date: string;
  activities: Map<string, {
    label: string;
    icon: string;
    count: number;
    totalPoints: number;
    totalAmount: number;
  }>;
}

export interface ActivityTypeTrend {
  activityKey: string;
  label: string;
  icon: string;
  dailyData: Array<{
    date: string;
    count: number;
    points: number;
    amount: number;
  }>;
  totalCount: number;
  totalPoints: number;
  averagePerDay: number;
}

/**
 * Calculate activity trends by type over a date range
 */
export function calculateActivityTrends(
  activities: ActivityRecord[],
  days: number = 30
): ActivityTypeTrend[] {
  if (activities.length === 0) return [];

  const endDate = startOfDay(new Date());
  const startDate = subDays(endDate, days - 1);
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  // Group activities by type and date
  const activityMap = new Map<string, ActivityTypeTrend>();
  const dateMap = new Map<string, Map<string, {
    count: number;
    points: number;
    amount: number;
  }>>();

  // Initialize date map
  dateRange.forEach(date => {
    const dateKey = format(date, 'yyyy-MM-dd');
    dateMap.set(dateKey, new Map());
  });

  // Process activities
  activities.forEach(activity => {
    const activityDate = startOfDay(parseISO(activity.performedAt));
    const dateKey = format(activityDate, 'yyyy-MM-dd');
    
    // Skip if outside date range
    if (activityDate < startDate || activityDate > endDate) return;

    const dateActivities = dateMap.get(dateKey);
    if (!dateActivities) return;

    const existing = dateActivities.get(activity.activityKey);
    if (existing) {
      existing.count++;
      existing.points += activity.points;
      existing.amount += activity.amount;
    } else {
      dateActivities.set(activity.activityKey, {
        count: 1,
        points: activity.points,
        amount: activity.amount
      });
    }

    // Initialize or update activity trend
    if (!activityMap.has(activity.activityKey)) {
      activityMap.set(activity.activityKey, {
        activityKey: activity.activityKey,
        label: activity.label,
        icon: activity.icon,
        dailyData: dateRange.map(date => ({
          date: format(date, 'yyyy-MM-dd'),
          count: 0,
          points: 0,
          amount: 0
        })),
        totalCount: 0,
        totalPoints: 0,
        averagePerDay: 0
      });
    }
  });

  // Fill in daily data
  dateRange.forEach(date => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dateActivities = dateMap.get(dateKey);
    
    if (dateActivities) {
      dateActivities.forEach((data, activityKey) => {
        const trend = activityMap.get(activityKey);
        if (trend) {
          const dayData = trend.dailyData.find(d => d.date === dateKey);
          if (dayData) {
            dayData.count = data.count;
            dayData.points = data.points;
            dayData.amount = data.amount;
          }
        }
      });
    }
  });

  // Calculate totals and averages
  const trends = Array.from(activityMap.values()).map(trend => {
    const daysWithActivity = trend.dailyData.filter(d => d.count > 0).length;
    const totalCount = trend.dailyData.reduce((sum, d) => sum + d.count, 0);
    const totalPoints = trend.dailyData.reduce((sum, d) => sum + d.points, 0);
    
    return {
      ...trend,
      totalCount,
      totalPoints,
      averagePerDay: daysWithActivity > 0 ? Math.round(totalPoints / daysWithActivity) : 0
    };
  });

  // Sort by total points descending
  return trends.sort((a, b) => b.totalPoints - a.totalPoints);
}

/**
 * Get top N activity types by total points
 */
export function getTopActivityTypes(
  trends: ActivityTypeTrend[],
  limit: number = 5
): ActivityTypeTrend[] {
  return trends.slice(0, limit);
}

