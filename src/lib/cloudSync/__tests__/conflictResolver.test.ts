/**
 * Tests for conflictResolver
 */

import { resolveConflicts, isEmpty, mergeData, useNewest } from '../conflictResolver';
import type { ActivityRecord } from '@/lib/activityStore';
import type { UserSettings } from '@/lib/settingsStore';
import type { Badge } from '@/lib/badges';
import type { Challenge } from '@/lib/challenges';

describe('conflictResolver', () => {
  const createMockActivity = (id: string, performedAt: string): ActivityRecord => ({
    id,
    activityKey: 'WALKING',
    label: 'Walking',
    icon: '🚶',
    unit: 'steps',
    multiplier: 1,
    amount: 1000,
    points: 1000,
    performedAt,
    note: null,
  });

  const createMockBadge = (id: string, unlockedAt: string): Badge => ({
    id,
    name: { tr: 'Test Badge', en: 'Test Badge' },
    description: { tr: 'Test', en: 'Test' },
    icon: '🏆',
    category: 'activity',
    rarity: 'common',
    unlockedAt: new Date(unlockedAt),
  });

  describe('isEmpty', () => {
    it('should return true for empty data', () => {
      const emptyData = {
        activities: [],
        badges: [],
        challenges: [],
        settings: null,
      };

      expect(isEmpty(emptyData)).toBe(true);
    });

    it('should return false when activities exist', () => {
      const dataWithActivities = {
        activities: [createMockActivity('1', new Date().toISOString())],
        badges: [],
        challenges: [],
        settings: null,
      };

      expect(isEmpty(dataWithActivities)).toBe(false);
    });

    it('should return false when badges exist', () => {
      const dataWithBadges = {
        activities: [],
        badges: [createMockBadge('1', new Date().toISOString())],
        challenges: [],
        settings: null,
      };

      expect(isEmpty(dataWithBadges)).toBe(false);
    });

    it('should return false when challenges exist', () => {
      const dataWithChallenges = {
        activities: [],
        badges: [],
        challenges: [{ id: '1', name: { tr: 'Test', en: 'Test' } } as Challenge],
        settings: null,
      };

      expect(isEmpty(dataWithChallenges)).toBe(false);
    });

    it('should return true when only settings exist', () => {
      const dataWithOnlySettings = {
        activities: [],
        badges: [],
        challenges: [],
        settings: { name: 'Test', dailyTarget: 10000 } as UserSettings,
      };

      expect(isEmpty(dataWithOnlySettings)).toBe(true);
    });
  });

  describe('resolveConflicts', () => {
    it('should use local strategy', () => {
      const local = {
        activities: [createMockActivity('1', new Date().toISOString())],
        badges: [],
        challenges: [],
        settings: { name: 'Local', dailyTarget: 10000 } as UserSettings,
      };

      const cloud = {
        activities: [createMockActivity('2', new Date().toISOString())],
        badges: [],
        challenges: [],
        settings: { name: 'Cloud', dailyTarget: 20000 } as UserSettings,
      };

      const result = resolveConflicts(local, cloud, 'local');

      expect(result.resolvedData.activities).toEqual(local.activities);
      expect(result.resolvedData.settings?.name).toBe('Local');
    });

    it('should use cloud strategy', () => {
      const local = {
        activities: [createMockActivity('1', new Date().toISOString())],
        badges: [],
        challenges: [],
        settings: { name: 'Local', dailyTarget: 10000 } as UserSettings,
      };

      const cloud = {
        activities: [createMockActivity('2', new Date().toISOString())],
        badges: [],
        challenges: [],
        settings: { name: 'Cloud', dailyTarget: 20000 } as UserSettings,
      };

      const result = resolveConflicts(local, cloud, 'cloud');

      expect(result.resolvedData.activities).toEqual(cloud.activities);
      expect(result.resolvedData.settings?.name).toBe('Cloud');
    });

    it('should merge data correctly', () => {
      const local = {
        activities: [createMockActivity('1', new Date().toISOString())],
        badges: [createMockBadge('1', new Date().toISOString())],
        challenges: [],
        settings: { name: 'Local', dailyTarget: 10000 } as UserSettings,
      };

      const cloud = {
        activities: [createMockActivity('2', new Date().toISOString())],
        badges: [createMockBadge('2', new Date().toISOString())],
        challenges: [],
        settings: { name: 'Cloud', dailyTarget: 20000 } as UserSettings,
      };

      const result = resolveConflicts(local, cloud, 'merge');

      // Should contain activities from both
      expect(result.resolvedData.activities.length).toBe(2);
      expect(result.resolvedData.badges.length).toBe(2);
      // Settings should prefer cloud but preserve local custom activities
      expect(result.resolvedData.settings?.dailyTarget).toBe(20000);
    });

    it('should use newest strategy', () => {
      const oldDate = new Date('2024-01-01').toISOString();
      const newDate = new Date('2024-12-31').toISOString();

      const local = {
        activities: [createMockActivity('1', oldDate)],
        badges: [],
        challenges: [],
        settings: { name: 'Local', dailyTarget: 10000 } as UserSettings,
      };

      const cloud = {
        activities: [createMockActivity('1', newDate)],
        badges: [],
        challenges: [],
        settings: { name: 'Cloud', dailyTarget: 20000 } as UserSettings,
        metadata: {
          lastModified: new Date('2024-12-31'),
          version: '1.0',
        },
      };

      // Set local lastModified to be older
      localStorage.setItem('sporttrack_last_sync', new Date('2024-01-01').toISOString());

      const result = resolveConflicts(local, cloud, 'newest');

      // Should use cloud data as it's newer (based on metadata.lastModified)
      expect(result.resolvedData.settings?.dailyTarget).toBe(20000);
    });
  });

  describe('mergeData', () => {
    it('should merge activities without duplicates', () => {
      const local = {
        activities: [createMockActivity('1', new Date().toISOString())],
        badges: [],
        challenges: [],
        settings: null,
      };

      const cloud = {
        activities: [createMockActivity('2', new Date().toISOString())],
        badges: [],
        challenges: [],
        settings: null,
      };

      const merged = mergeData(local, cloud);

      expect(merged.activities.length).toBe(2);
      expect(merged.activities.map((a) => a.id)).toEqual(['1', '2']);
    });

    it('should handle duplicate activities (keep newer)', () => {
      const oldDate = new Date('2024-01-01').toISOString();
      const newDate = new Date('2024-12-31').toISOString();

      const local = {
        activities: [createMockActivity('1', oldDate)],
        badges: [],
        challenges: [],
        settings: null,
      };

      const cloud = {
        activities: [createMockActivity('1', newDate)],
        badges: [],
        challenges: [],
        settings: null,
      };

      const merged = mergeData(local, cloud);

      // Should keep the newer one
      expect(merged.activities.length).toBe(1);
      expect(merged.activities[0].performedAt).toBe(newDate);
    });
  });

  describe('useNewest', () => {
    it('should use local when local is newer', () => {
      const newDate = new Date('2024-12-31').toISOString();
      const oldDate = new Date('2024-01-01').toISOString();

      const local = {
        activities: [createMockActivity('1', newDate)],
        badges: [],
        challenges: [],
        settings: { name: 'Local', dailyTarget: 10000 } as UserSettings,
      };

      const cloud = {
        activities: [createMockActivity('1', oldDate)],
        badges: [],
        challenges: [],
        settings: { name: 'Cloud', dailyTarget: 20000 } as UserSettings,
      };

      const result = useNewest(local, cloud);

      expect(result.activities[0].performedAt).toBe(newDate);
      expect(result.settings?.name).toBe('Local');
    });

    it('should use cloud when cloud is newer', () => {
      const oldDate = new Date('2024-01-01').toISOString();
      const newDate = new Date('2024-12-31').toISOString();

      const local = {
        activities: [createMockActivity('1', oldDate)],
        badges: [],
        challenges: [],
        settings: { name: 'Local', dailyTarget: 10000 } as UserSettings,
      };

      const cloud = {
        activities: [createMockActivity('1', newDate)],
        badges: [],
        challenges: [],
        settings: { name: 'Cloud', dailyTarget: 20000 } as UserSettings,
        metadata: {
          lastModified: new Date('2024-12-31'),
          version: '1.0',
        },
      };

      const result = useNewest(local, cloud);

      // useNewest compares metadata.lastModified, not activity dates
      // Since cloud metadata is newer, should use cloud
      expect(result.settings?.name).toBe('Cloud');
      expect(result.settings?.dailyTarget).toBe(20000);
    });
  });
});
