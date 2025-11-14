/**
 * Tests for activity trend utilities
 */

import { calculateActivityTrends, type ActivityTypeTrend } from '@/lib/activityTrendUtils';
import { ActivityRecord } from '@/lib/activityStore';
import { startOfDay, subDays } from 'date-fns';

describe('activityTrendUtils', () => {
  const createMockActivity = (
    activityKey: string,
    date: Date,
    points: number = 1000
  ): ActivityRecord => ({
    id: `activity-${date.getTime()}-${activityKey}`,
    activityKey: activityKey as any,
    label: activityKey,
    icon: '🏃',
    amount: 1000,
    points,
    performedAt: date.toISOString(),
  });

  describe('calculateActivityTrends', () => {
    it('should return empty array for empty activities', () => {
      const trends = calculateActivityTrends([], 30);

      expect(trends).toEqual([]);
    });

    it('should calculate trends for single activity type', () => {
      const today = startOfDay(new Date());
      const activities: ActivityRecord[] = [
        createMockActivity('WALKING', today, 1000),
        createMockActivity('WALKING', subDays(today, 1), 2000),
        createMockActivity('WALKING', subDays(today, 2), 1500),
      ];

      const trends = calculateActivityTrends(activities, 30);

      expect(trends.length).toBeGreaterThan(0);
      const walkingTrend = trends.find((t) => t.activityKey === 'WALKING');
      expect(walkingTrend).toBeDefined();
      expect(walkingTrend?.totalPoints).toBe(4500);
      expect(walkingTrend?.totalCount).toBe(3);
    });

    it('should calculate trends for multiple activity types', () => {
      const today = startOfDay(new Date());
      const activities: ActivityRecord[] = [
        createMockActivity('WALKING', today, 1000),
        createMockActivity('RUNNING', today, 2000),
        createMockActivity('WALKING', subDays(today, 1), 1500),
        createMockActivity('CYCLING', subDays(today, 1), 3000),
      ];

      const trends = calculateActivityTrends(activities, 30);

      expect(trends.length).toBeGreaterThanOrEqual(3);
      const walkingTrend = trends.find((t) => t.activityKey === 'WALKING');
      const runningTrend = trends.find((t) => t.activityKey === 'RUNNING');
      const cyclingTrend = trends.find((t) => t.activityKey === 'CYCLING');

      expect(walkingTrend).toBeDefined();
      expect(runningTrend).toBeDefined();
      expect(cyclingTrend).toBeDefined();
    });

    it('should filter activities by days parameter', () => {
      const today = startOfDay(new Date());
      const activities: ActivityRecord[] = [
        createMockActivity('WALKING', today, 1000),
        createMockActivity('WALKING', subDays(today, 10), 2000),
        createMockActivity('WALKING', subDays(today, 35), 3000), // Should be excluded
      ];

      const trends = calculateActivityTrends(activities, 30);

      const walkingTrend = trends.find((t) => t.activityKey === 'WALKING');
      expect(walkingTrend?.totalPoints).toBe(3000); // Only first two activities
    });

    it('should calculate average per day correctly', () => {
      const today = startOfDay(new Date());
      const activities: ActivityRecord[] = [];
      // Create activities for 5 days
      for (let i = 0; i < 5; i++) {
        activities.push(createMockActivity('WALKING', subDays(today, i), 1000));
      }

      const trends = calculateActivityTrends(activities, 30);

      const walkingTrend = trends.find((t) => t.activityKey === 'WALKING');
      expect(walkingTrend).toBeDefined();
      expect(walkingTrend?.averagePerDay).toBeGreaterThan(0);
    });

    it('should handle activities with zero points', () => {
      const today = startOfDay(new Date());
      const activities: ActivityRecord[] = [
        {
          ...createMockActivity('WALKING', today, 0),
          points: 0,
        },
      ];

      const trends = calculateActivityTrends(activities, 30);

      const walkingTrend = trends.find((t) => t.activityKey === 'WALKING');
      expect(walkingTrend).toBeDefined();
      expect(walkingTrend?.totalPoints).toBe(0);
    });

    it('should sort trends by total points descending', () => {
      const today = startOfDay(new Date());
      const activities: ActivityRecord[] = [
        createMockActivity('WALKING', today, 1000),
        createMockActivity('RUNNING', today, 5000),
        createMockActivity('CYCLING', today, 3000),
      ];

      const trends = calculateActivityTrends(activities, 30);

      expect(trends.length).toBeGreaterThanOrEqual(3);
      // First trend should have highest points
      expect(trends[0].totalPoints).toBeGreaterThanOrEqual(trends[1].totalPoints);
      expect(trends[1].totalPoints).toBeGreaterThanOrEqual(trends[2].totalPoints);
    });

    it('should include activity metadata in trends', () => {
      const today = startOfDay(new Date());
      const activities: ActivityRecord[] = [createMockActivity('WALKING', today, 1000)];

      const trends = calculateActivityTrends(activities, 30);

      const walkingTrend = trends.find((t) => t.activityKey === 'WALKING');
      expect(walkingTrend).toBeDefined();
      if (walkingTrend) {
        expect(walkingTrend.activityKey).toBe('WALKING');
        expect(walkingTrend.totalPoints).toBeDefined();
        expect(walkingTrend.totalCount).toBeDefined();
        expect(walkingTrend.averagePerDay).toBeDefined();
      }
    });
  });
});
