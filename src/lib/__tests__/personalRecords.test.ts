/**
 * Tests for personal records utility functions
 */

import { calculatePersonalRecords, type PersonalRecord } from '@/lib/personalRecords';
import { ActivityRecord } from '@/lib/activityStore';
import { startOfDay, subDays } from 'date-fns';

describe('personalRecords', () => {
  const createMockActivity = (
    activityKey: string,
    date: Date,
    points: number = 1000,
    amount: number = 1000
  ): ActivityRecord => ({
    id: `activity-${date.getTime()}-${activityKey}`,
    activityKey: activityKey as any,
    label: activityKey,
    icon: '🏃',
    amount,
    points,
    performedAt: date.toISOString(),
  });

  describe('calculatePersonalRecords', () => {
    const dailyTarget = 10000;

    it('should return empty records for empty activities', () => {
      const records = calculatePersonalRecords([], dailyTarget);

      expect(records).toEqual([]);
    });

    it('should calculate best day record', () => {
      const today = startOfDay(new Date());
      const yesterday = subDays(today, 1);
      const activities: ActivityRecord[] = [
        createMockActivity('WALKING', today, 5000),
        createMockActivity('RUNNING', today, 3000),
        createMockActivity('WALKING', yesterday, 2000),
      ];

      const records = calculatePersonalRecords(activities, dailyTarget);

      const bestDayRecord = records.find((r) => r.id === 'best-day');
      expect(bestDayRecord).toBeDefined();
      expect(bestDayRecord?.value).toBe(8000); // 5000 + 3000
      expect(bestDayRecord?.type).toBe('points');
    });

    it('should calculate longest streak record', () => {
      const today = startOfDay(new Date());
      const activities: ActivityRecord[] = [];
      // Create activities for 5 consecutive days reaching daily goal
      for (let i = 0; i < 5; i++) {
        const date = subDays(today, 4 - i);
        activities.push(createMockActivity('WALKING', date, dailyTarget));
      }

      const records = calculatePersonalRecords(activities, dailyTarget);

      const longestStreakRecord = records.find((r) => r.id === 'longest-streak');
      expect(longestStreakRecord).toBeDefined();
      expect(longestStreakRecord?.value).toBeGreaterThanOrEqual(5);
      expect(longestStreakRecord?.type).toBe('streak');
    });

    it('should calculate fastest goal completion record', () => {
      const today = startOfDay(new Date());
      const activities: ActivityRecord[] = [createMockActivity('WALKING', today, dailyTarget)];

      const records = calculatePersonalRecords(activities, dailyTarget);

      const fastestGoalRecord = records.find((r) => r.id === 'fastest-goal');
      expect(fastestGoalRecord).toBeDefined();
      expect(fastestGoalRecord?.type).toBe('speed');
    });

    it('should include date information for time-based records', () => {
      const today = startOfDay(new Date());
      const activities: ActivityRecord[] = [createMockActivity('WALKING', today, 5000)];

      const records = calculatePersonalRecords(activities, dailyTarget);

      const bestDayRecord = records.find((r) => r.id === 'best-day');
      expect(bestDayRecord?.date).toBeDefined();
    });

    it('should handle activities with zero points', () => {
      const today = startOfDay(new Date());
      const activities: ActivityRecord[] = [
        {
          ...createMockActivity('WALKING', today, 0),
          points: 0,
        },
      ];

      const records = calculatePersonalRecords(activities, dailyTarget);

      // Should still return best day record
      const bestDayRecord = records.find((r) => r.id === 'best-day');
      expect(bestDayRecord?.value).toBe(0);
    });

    it('should calculate activity-specific records', () => {
      const today = startOfDay(new Date());
      const activities: ActivityRecord[] = [
        createMockActivity('WALKING', today, 1000, 5000),
        createMockActivity('RUNNING', today, 2000, 10000),
        createMockActivity('CYCLING', today, 3000, 15000),
      ];

      const records = calculatePersonalRecords(activities, dailyTarget);

      expect(records.length).toBeGreaterThan(0);
      // Should have activity-specific records
      const walkingPointsRecord = records.find((r) => r.id === 'activity-WALKING-points');
      const walkingAmountRecord = records.find((r) => r.id === 'activity-WALKING-amount');
      expect(walkingPointsRecord).toBeDefined();
      expect(walkingAmountRecord).toBeDefined();
    });
  });
});
