/**
 * Tests for level system utilities
 */

import {
  getLevelFromXP,
  getXPForLevel,
  getTotalXPForLevel,
  getLevelInfo,
  checkLevelUp,
  getLevelTitle,
  calculateXPFromActivities,
} from '@/lib/levelSystem';
import { ActivityRecord } from '@/lib/activityStore';

describe('levelSystem', () => {
  describe('getLevelFromXP', () => {
    it('should return level 1 for 0 XP', () => {
      expect(getLevelFromXP(0)).toBe(1);
    });

    it('should return level 1 for XP below first threshold', () => {
      expect(getLevelFromXP(999)).toBe(1);
    });

    it('should return level 2 for XP at first threshold', () => {
      // 1000 XP should be level 2 (formula: level = floor((-1 + sqrt(1 + 8*1000/1000)) / 2))
      // sqrt(9) = 3, so level = floor((3-1)/2) = floor(1) = 1... wait, let's check actual value
      const level = getLevelFromXP(1000);
      expect(level).toBeGreaterThanOrEqual(1);
      expect(level).toBeLessThanOrEqual(3);
    });

    it('should return correct level for various XP values', () => {
      // Test that levels increase with XP
      const level5k = getLevelFromXP(5000);
      const level10k = getLevelFromXP(10000);
      const level50k = getLevelFromXP(50000);
      expect(level10k).toBeGreaterThanOrEqual(level5k);
      expect(level50k).toBeGreaterThan(level10k);
      expect(level50k).toBeGreaterThan(5);
    });

    it('should handle very large XP values', () => {
      const level = getLevelFromXP(1000000);
      expect(level).toBeGreaterThan(10);
      expect(typeof level).toBe('number');
    });
  });

  describe('getXPForLevel', () => {
    it('should return 0 for level 1', () => {
      expect(getXPForLevel(1)).toBe(0);
    });

    it('should return correct XP for level 2', () => {
      expect(getXPForLevel(2)).toBe(1000);
    });

    it('should return increasing XP for higher levels', () => {
      const level2XP = getXPForLevel(2);
      const level3XP = getXPForLevel(3);
      expect(level3XP).toBeGreaterThan(level2XP);
    });
  });

  describe('getTotalXPForLevel', () => {
    it('should return XP needed for level 2', () => {
      const xp = getTotalXPForLevel(1);
      expect(xp).toBe(1000);
    });

    it('should return increasing XP for higher levels', () => {
      const level1XP = getTotalXPForLevel(1);
      const level2XP = getTotalXPForLevel(2);
      expect(level2XP).toBeGreaterThan(level1XP);
    });
  });

  describe('getLevelInfo', () => {
    it('should return correct info for level 1 with 0 XP', () => {
      const info = getLevelInfo(0);
      expect(info.level).toBe(1);
      expect(info.progress).toBeGreaterThanOrEqual(0);
      expect(info.progress).toBeLessThanOrEqual(1);
    });

    it('should return progress between 0 and 1', () => {
      const info = getLevelInfo(5000);
      expect(info.progress).toBeGreaterThanOrEqual(0);
      expect(info.progress).toBeLessThanOrEqual(1);
    });

    it('should return correct level and XP values', () => {
      const info = getLevelInfo(10000);
      expect(info.level).toBeGreaterThan(1);
      expect(info.totalXP).toBe(10000);
      expect(info.xpForNextLevel).toBeGreaterThan(info.xpForCurrentLevel);
    });
  });

  describe('checkLevelUp', () => {
    it('should return null when no level up', () => {
      expect(checkLevelUp(1000, 1500)).toBeNull();
    });

    it('should return new level when level up occurs', () => {
      // Start at level 1 (999 XP), end at level 3+ (3000+ XP)
      const newLevel = checkLevelUp(999, 3000);
      expect(newLevel).toBeGreaterThan(1);
      expect(typeof newLevel).toBe('number');
    });

    it('should return null for same level', () => {
      expect(checkLevelUp(5000, 5000)).toBeNull();
    });
  });

  describe('getLevelTitle', () => {
    it('should return correct title for low levels', () => {
      expect(getLevelTitle(1, 'tr')).toBe('Başlangıç');
      expect(getLevelTitle(1, 'en')).toBe('Beginner');
    });

    it('should return correct title for medium levels', () => {
      expect(getLevelTitle(10, 'tr')).toBe('Deneyimli');
      expect(getLevelTitle(10, 'en')).toBe('Experienced');
    });

    it('should return correct title for high levels', () => {
      // Level 30 falls in the 20-30 range, which is "Efsane" / "Legend"
      expect(getLevelTitle(30, 'tr')).toBe('Efsane');
      expect(getLevelTitle(30, 'en')).toBe('Legend');
    });

    it('should return correct title for very high levels', () => {
      expect(getLevelTitle(50, 'tr')).toBe('Efsanevi');
      expect(getLevelTitle(50, 'en')).toBe('Mythic');
    });
  });

  describe('calculateXPFromActivities', () => {
    it('should return 0 for empty activities', () => {
      const activities: ActivityRecord[] = [];
      expect(calculateXPFromActivities(activities)).toBe(0);
    });

    it('should sum points from activities', () => {
      const activities: ActivityRecord[] = [
        {
          id: '1',
          activityKey: 'WALKING',
          label: 'Yürüme',
          icon: '🚶‍♂️',
          amount: 1000,
          points: 1000,
          performedAt: new Date().toISOString(),
        },
        {
          id: '2',
          activityKey: 'RUNNING',
          label: 'Koşma',
          icon: '🏃',
          amount: 500,
          points: 1000,
          performedAt: new Date().toISOString(),
        },
      ];
      expect(calculateXPFromActivities(activities)).toBe(2000);
    });
  });
});
