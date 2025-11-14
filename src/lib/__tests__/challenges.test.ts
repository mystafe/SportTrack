/**
 * Tests for challenges utility functions
 */

import {
  calculateChallengeProgress,
  updateChallengeStatus,
  createDailyChallenge,
  createWeeklyChallenge,
  createMonthlyChallenge,
  createCustomChallenge,
  getDefaultDailyChallenge,
  getDefaultWeeklyChallenge,
} from '@/lib/challenges';
import { ActivityRecord } from '@/lib/activityStore';
import { startOfDay, subDays, addDays } from 'date-fns';
import type { Challenge } from '@/lib/challenges';

describe('challenges', () => {
  const createMockActivity = (date: Date, points: number = 1000): ActivityRecord => ({
    id: `activity-${date.getTime()}`,
    activityKey: 'WALKING',
    label: 'Yürüme',
    icon: '🚶‍♂️',
    amount: 1000,
    points,
    performedAt: date.toISOString(),
  });

  describe('calculateChallengeProgress', () => {
    it('should return zero progress for empty activities', () => {
      const challenge: Challenge = {
        id: 'test-1',
        type: 'daily',
        name: { tr: 'Test', en: 'Test' },
        description: { tr: 'Test', en: 'Test' },
        target: 10000,
        startDate: new Date().toISOString(),
        status: 'active',
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      const progress = calculateChallengeProgress(challenge, []);

      expect(progress.current).toBe(0);
      expect(progress.target).toBe(10000);
      expect(progress.percentage).toBe(0);
      expect(progress.isCompleted).toBe(false);
    });

    it('should calculate progress for daily challenge', () => {
      const today = startOfDay(new Date());
      const challenge: Challenge = {
        id: 'test-1',
        type: 'daily',
        name: { tr: 'Test', en: 'Test' },
        description: { tr: 'Test', en: 'Test' },
        target: 10000,
        startDate: today.toISOString(),
        status: 'active',
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      const activities: ActivityRecord[] = [
        createMockActivity(today, 5000),
        createMockActivity(today, 3000),
      ];

      const progress = calculateChallengeProgress(challenge, activities);

      expect(progress.current).toBe(8000);
      expect(progress.target).toBe(10000);
      expect(progress.percentage).toBe(80);
      expect(progress.isCompleted).toBe(false);
    });

    it('should mark challenge as completed when target is reached', () => {
      const today = startOfDay(new Date());
      const challenge: Challenge = {
        id: 'test-1',
        type: 'daily',
        name: { tr: 'Test', en: 'Test' },
        description: { tr: 'Test', en: 'Test' },
        target: 10000,
        startDate: today.toISOString(),
        status: 'active',
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      const activities: ActivityRecord[] = [
        createMockActivity(today, 6000),
        createMockActivity(today, 5000),
      ];

      const progress = calculateChallengeProgress(challenge, activities);

      expect(progress.current).toBe(11000);
      expect(progress.isCompleted).toBe(true);
      expect(progress.percentage).toBeGreaterThanOrEqual(100);
    });

    it('should calculate progress for weekly challenge', () => {
      const weekStart = startOfDay(subDays(new Date(), 3));
      const challenge: Challenge = {
        id: 'test-1',
        type: 'weekly',
        name: { tr: 'Test', en: 'Test' },
        description: { tr: 'Test', en: 'Test' },
        target: 50000,
        startDate: weekStart.toISOString(),
        status: 'active',
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      const activities: ActivityRecord[] = [
        createMockActivity(weekStart, 10000),
        createMockActivity(addDays(weekStart, 1), 15000),
        createMockActivity(addDays(weekStart, 2), 20000),
      ];

      const progress = calculateChallengeProgress(challenge, activities);

      expect(progress.current).toBe(45000);
      expect(progress.target).toBe(50000);
      expect(progress.isCompleted).toBe(false);
    });
  });

  describe('updateChallengeStatus', () => {
    it('should update status to completed when progress reaches target', () => {
      const challenge: Challenge = {
        id: 'test-1',
        type: 'daily',
        name: { tr: 'Test', en: 'Test' },
        description: { tr: 'Test', en: 'Test' },
        target: 10000,
        startDate: new Date().toISOString(),
        status: 'active',
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      const progress = {
        current: 10000,
        target: 10000,
        percentage: 100,
        isCompleted: true,
      };

      const updated = updateChallengeStatus(challenge, progress);

      expect(updated.status).toBe('completed');
      expect(updated.progress).toBe(10000);
      expect(updated.completedAt).toBeDefined();
    });

    it('should keep status as active when progress is below target', () => {
      const challenge: Challenge = {
        id: 'test-1',
        type: 'daily',
        name: { tr: 'Test', en: 'Test' },
        description: { tr: 'Test', en: 'Test' },
        target: 10000,
        startDate: new Date().toISOString(),
        status: 'active',
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      const progress = {
        current: 5000,
        target: 10000,
        percentage: 50,
        isCompleted: false,
      };

      const updated = updateChallengeStatus(challenge, progress);

      expect(updated.status).toBe('active');
      expect(updated.progress).toBe(5000);
      expect(updated.completedAt).toBeUndefined();
    });
  });

  describe('createDailyChallenge', () => {
    it('should create a daily challenge with correct properties', () => {
      const today = new Date();
      const challenge = createDailyChallenge(
        { tr: 'Günlük Hedef', en: 'Daily Goal' },
        10000,
        today,
        '⭐'
      );

      expect(challenge.type).toBe('daily');
      expect(challenge.target).toBe(10000);
      expect(challenge.name.tr).toBe('Günlük Hedef');
      expect(challenge.name.en).toBe('Daily Goal');
      expect(challenge.icon).toBe('⭐');
      expect(challenge.status).toBe('active');
      expect(challenge.id).toContain('daily-');
    });
  });

  describe('createWeeklyChallenge', () => {
    it('should create a weekly challenge with correct properties', () => {
      const today = new Date();
      const challenge = createWeeklyChallenge(
        { tr: 'Haftalık Hedef', en: 'Weekly Goal' },
        50000,
        today,
        '🔥'
      );

      expect(challenge.type).toBe('weekly');
      expect(challenge.target).toBe(50000);
      expect(challenge.name.tr).toBe('Haftalık Hedef');
      expect(challenge.name.en).toBe('Weekly Goal');
      expect(challenge.icon).toBe('🔥');
      expect(challenge.status).toBe('active');
      expect(challenge.id).toContain('weekly-');
    });
  });

  describe('createMonthlyChallenge', () => {
    it('should create a monthly challenge with correct properties', () => {
      const today = new Date();
      const challenge = createMonthlyChallenge(
        { tr: 'Aylık Hedef', en: 'Monthly Goal' },
        200000,
        today,
        '📆'
      );

      expect(challenge.type).toBe('monthly');
      expect(challenge.target).toBe(200000);
      expect(challenge.name.tr).toBe('Aylık Hedef');
      expect(challenge.name.en).toBe('Monthly Goal');
      expect(challenge.icon).toBe('📆');
      expect(challenge.status).toBe('active');
      expect(challenge.id).toContain('monthly-');
    });
  });

  describe('createCustomChallenge', () => {
    it('should create a custom challenge with correct properties', () => {
      const startDate = new Date();
      const endDate = addDays(startDate, 7);
      const challenge = createCustomChallenge(
        { tr: 'Özel Hedef', en: 'Custom Goal' },
        { tr: 'Açıklama', en: 'Description' },
        30000,
        startDate,
        endDate,
        '🏆'
      );

      expect(challenge.type).toBe('custom');
      expect(challenge.target).toBe(30000);
      expect(challenge.name.tr).toBe('Özel Hedef');
      expect(challenge.name.en).toBe('Custom Goal');
      expect(challenge.icon).toBe('🏆');
      expect(challenge.status).toBe('active');
      expect(challenge.id).toContain('custom-');
      expect(challenge.endDate).toBeDefined();
    });
  });

  describe('getDefaultDailyChallenge', () => {
    it('should create default daily challenge with specified target', () => {
      const challenge = getDefaultDailyChallenge(15000);

      expect(challenge.type).toBe('daily');
      expect(challenge.target).toBe(15000);
      expect(challenge.name.tr).toBe('Günlük Hedef');
      expect(challenge.name.en).toBe('Daily Goal');
    });
  });

  describe('getDefaultWeeklyChallenge', () => {
    it('should create default weekly challenge with 50k target', () => {
      const challenge = getDefaultWeeklyChallenge();

      expect(challenge.type).toBe('weekly');
      expect(challenge.target).toBe(50000);
      expect(challenge.name.tr).toBe('Haftalık Hedef');
      expect(challenge.name.en).toBe('Weekly Goal');
    });
  });
});
