/**
 * Tests for badges utility functions
 */

import { checkBadges } from '@/lib/badges';
import { ActivityRecord } from '@/lib/activityStore';
import type { UserSettings } from '@/lib/settingsStore';
import type { Badge } from '@/lib/badges';
import { startOfDay, subDays } from 'date-fns';

describe('badges', () => {
  const createMockActivity = (date: Date, points: number = 1000): ActivityRecord => ({
    id: `activity-${date.getTime()}`,
    activityKey: 'WALKING',
    label: 'Yürüme',
    icon: '🚶‍♂️',
    amount: 1000,
    points,
    performedAt: date.toISOString(),
  });

  const mockSettings: UserSettings = {
    dailyTarget: 10000,
    customActivities: [],
    mood: null,
    language: 'tr',
    theme: 'system',
  };

  describe('checkBadges', () => {
    it('should return empty array for empty activities', () => {
      const badges = checkBadges([], mockSettings, 10000, []);

      expect(badges).toEqual([]);
    });

    it('should unlock first_activity badge when first activity is added', () => {
      const today = startOfDay(new Date());
      const activities: ActivityRecord[] = [createMockActivity(today, 1000)];

      const badges = checkBadges(activities, mockSettings, 10000, []);

      const firstActivityBadge = badges.find((b) => b.id === 'first_activity');
      expect(firstActivityBadge).toBeDefined();
      expect(firstActivityBadge?.category).toBe('special');
    });

    it('should unlock perfect_week badge when weekly goal is reached', () => {
      const today = startOfDay(new Date());
      // Create activities for 7 consecutive days reaching daily goal
      const activities: ActivityRecord[] = [];
      for (let i = 0; i < 7; i++) {
        const date = subDays(today, 6 - i);
        activities.push(createMockActivity(date, 10000));
      }

      const badges = checkBadges(activities, mockSettings, 10000, []);

      const perfectWeekBadge = badges.find((b) => b.id === 'perfect_week');
      expect(perfectWeekBadge).toBeDefined();
    });

    it('should unlock perfect_week badge after 7 consecutive days reaching goal', () => {
      const activities: ActivityRecord[] = [];
      for (let i = 0; i < 7; i++) {
        const date = subDays(startOfDay(new Date()), 6 - i);
        activities.push(createMockActivity(date, 10000)); // Must reach daily goal
      }

      const badges = checkBadges(activities, mockSettings, 10000, []);

      const perfectWeekBadge = badges.find((b) => b.id === 'perfect_week');
      expect(perfectWeekBadge).toBeDefined();
    });

    it('should unlock points_100k badge at 100k total points', () => {
      const today = startOfDay(new Date());
      const activities: ActivityRecord[] = [
        createMockActivity(today, 100000), // 100k points
      ];

      const badges = checkBadges(activities, mockSettings, 10000, []);

      const milestoneBadge = badges.find((b) => b.id === 'points_100k');
      expect(milestoneBadge).toBeDefined();
    });

    it('should not return badges that already exist', () => {
      const today = startOfDay(new Date());
      const activities: ActivityRecord[] = [createMockActivity(today, 1000)];

      const existingBadges: Badge[] = [
        {
          id: 'first_activity',
          name: { tr: 'İlk Adım', en: 'First Step' },
          description: { tr: 'İlk aktiviteni ekle', en: 'Add your first activity' },
          icon: '🎯',
          category: 'special',
          rarity: 'common',
          unlockedAt: new Date(),
        },
      ];

      const badges = checkBadges(activities, mockSettings, 10000, existingBadges);

      // Should not return first_activity again since it already exists
      const firstActivityBadge = badges.find((b) => b.id === 'first_activity');
      expect(firstActivityBadge).toBeUndefined();
    });

    it('should unlock multiple badges when conditions are met', () => {
      const today = startOfDay(new Date());
      const activities: ActivityRecord[] = [
        createMockActivity(today, 10000), // First activity + 10k points
      ];

      const badges = checkBadges(activities, mockSettings, 10000, []);

      // Should unlock both first_activity and points_10k
      expect(badges.length).toBeGreaterThanOrEqual(2);
      const firstActivityBadge = badges.find((b) => b.id === 'first_activity');
      const pointsBadge = badges.find((b) => b.id === 'points_10k');
      expect(firstActivityBadge).toBeDefined();
      expect(pointsBadge).toBeDefined();
    });

    it('should handle activities with zero points', () => {
      const today = startOfDay(new Date());
      const activities: ActivityRecord[] = [
        {
          ...createMockActivity(today, 0),
          points: 0,
        },
      ];

      const badges = checkBadges(activities, mockSettings, 10000, []);

      // Should still unlock first_activity badge
      const firstActivityBadge = badges.find((b) => b.id === 'first_activity');
      expect(firstActivityBadge).toBeDefined();
    });

    it('should unlock streak_7 badge for 7 consecutive days', () => {
      const activities: ActivityRecord[] = [];
      // Create activities for 7 consecutive days reaching daily goal
      for (let i = 0; i < 7; i++) {
        const date = subDays(startOfDay(new Date()), 6 - i);
        activities.push(createMockActivity(date, 10000)); // Must reach daily goal
      }

      const badges = checkBadges(activities, mockSettings, 10000, []);

      const streakBadge = badges.find((b) => b.id === 'streak_7');
      expect(streakBadge).toBeDefined();
    });

    it('should unlock milestone badges at specific point thresholds', () => {
      const today = startOfDay(new Date());
      const activities: ActivityRecord[] = [
        createMockActivity(today, 10000), // 10k points
      ];

      const badges = checkBadges(activities, mockSettings, 10000, []);

      const milestoneBadge = badges.find((b) => b.id === 'points_10k');
      expect(milestoneBadge).toBeDefined();
    });
  });
});
