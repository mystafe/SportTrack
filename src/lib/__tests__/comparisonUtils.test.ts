/**
 * Tests for comparison utilities
 */

import {
  calculateWeekStats,
  calculateMonthStats,
  compareWeeks,
  compareMonths,
} from '@/lib/comparisonUtils';
import { ActivityRecord } from '@/lib/activityStore';
import { startOfWeek, subWeeks, startOfMonth, subMonths } from 'date-fns';

describe('comparisonUtils', () => {
  const createMockActivity = (
    date: Date,
    points: number = 1000,
    activityKey: string = 'WALKING'
  ): ActivityRecord => ({
    id: `activity-${date.getTime()}`,
    activityKey,
    label: 'Yürüme',
    icon: '🚶‍♂️',
    amount: 1000,
    points,
    performedAt: date.toISOString(),
  });

  describe('calculateWeekStats', () => {
    it('should return zero stats for empty activities', () => {
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const stats = calculateWeekStats([], weekStart, 10000);

      expect(stats.totalPoints).toBe(0);
      expect(stats.totalActivities).toBe(0);
      expect(stats.averageDailyPoints).toBe(0);
      expect(stats.daysWithActivities).toBe(0);
      expect(stats.completionRate).toBe(0);
    });

    it('should calculate correct stats for activities in the week', () => {
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const activities: ActivityRecord[] = [
        createMockActivity(new Date(weekStart.getTime() + 24 * 60 * 60 * 1000), 2000), // Day 2
        createMockActivity(new Date(weekStart.getTime() + 48 * 60 * 60 * 1000), 3000), // Day 3
      ];

      const stats = calculateWeekStats(activities, weekStart, 10000);

      expect(stats.totalPoints).toBe(5000);
      expect(stats.totalActivities).toBe(2);
      expect(stats.daysWithActivities).toBe(2);
    });

    it('should filter out activities outside the week', () => {
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const previousWeek = subWeeks(weekStart, 1);
      const activities: ActivityRecord[] = [
        createMockActivity(weekStart, 2000),
        createMockActivity(previousWeek, 3000), // Should be filtered out
      ];

      const stats = calculateWeekStats(activities, weekStart, 10000);

      expect(stats.totalPoints).toBe(2000);
      expect(stats.totalActivities).toBe(1);
    });
  });

  describe('calculateMonthStats', () => {
    it('should return zero stats for empty activities', () => {
      const monthStart = startOfMonth(new Date());
      const stats = calculateMonthStats([], monthStart, 10000);

      expect(stats.totalPoints).toBe(0);
      expect(stats.totalActivities).toBe(0);
      expect(stats.averageDailyPoints).toBe(0);
      expect(stats.daysWithActivities).toBe(0);
      expect(stats.completionRate).toBe(0);
    });

    it('should calculate correct stats for activities in the month', () => {
      const monthStart = startOfMonth(new Date());
      const activities: ActivityRecord[] = [
        createMockActivity(new Date(monthStart.getTime() + 24 * 60 * 60 * 1000), 2000),
        createMockActivity(new Date(monthStart.getTime() + 48 * 60 * 60 * 1000), 3000),
      ];

      const stats = calculateMonthStats(activities, monthStart, 10000);

      expect(stats.totalPoints).toBe(5000);
      expect(stats.totalActivities).toBe(2);
      expect(stats.daysWithActivities).toBe(2);
    });
  });

  describe('compareWeeks', () => {
    it('should return null when both weeks have no activities', () => {
      const result = compareWeeks([], 10000);
      expect(result).toBeNull();
    });

    it('should calculate comparison when current week has activities', () => {
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const activities: ActivityRecord[] = [
        createMockActivity(new Date(weekStart.getTime() + 24 * 60 * 60 * 1000), 2000),
      ];

      const result = compareWeeks(activities, 10000, weekStart);

      expect(result).not.toBeNull();
      expect(result?.current.totalActivities).toBeGreaterThan(0);
      expect(result?.change.points).toBeDefined();
      expect(result?.change.pointsPercent).toBeDefined();
    });

    it('should calculate positive change when current week has more points', () => {
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const currentWeekDate = new Date(weekStart.getTime() + 24 * 60 * 60 * 1000);
      const previousWeekDate = subWeeks(currentWeekDate, 1);

      const activities: ActivityRecord[] = [
        createMockActivity(currentWeekDate, 5000), // Current week
        createMockActivity(previousWeekDate, 2000), // Previous week
      ];

      const result = compareWeeks(activities, 10000, currentWeekDate);

      expect(result).not.toBeNull();
      expect(result?.change.points).toBeGreaterThan(0);
    });
  });

  describe('compareMonths', () => {
    it('should return null when both months have no activities', () => {
      const result = compareMonths([], 10000);
      expect(result).toBeNull();
    });

    it('should calculate comparison when current month has activities', () => {
      const monthStart = startOfMonth(new Date());
      const activities: ActivityRecord[] = [
        createMockActivity(new Date(monthStart.getTime() + 24 * 60 * 60 * 1000), 2000),
      ];

      const result = compareMonths(activities, 10000, monthStart);

      expect(result).not.toBeNull();
      expect(result?.current.totalActivities).toBeGreaterThan(0);
      expect(result?.change.points).toBeDefined();
      expect(result?.change.pointsPercent).toBeDefined();
    });
  });
});
