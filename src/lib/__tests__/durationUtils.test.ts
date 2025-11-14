/**
 * Tests for duration utilities
 */

import { calculateDurationStats, formatDuration } from '@/lib/durationUtils';
import { ActivityRecord } from '@/lib/activityStore';
import { startOfDay, subDays } from 'date-fns';

describe('durationUtils', () => {
  describe('calculateDurationStats', () => {
    it('should return zero stats for empty activities', () => {
      const activities: ActivityRecord[] = [];
      const stats = calculateDurationStats(activities);

      expect(stats.totalDuration).toBe(0);
      expect(stats.averageDailyDuration).toBe(0);
      expect(stats.longestDayDuration).toBe(0);
      expect(stats.longestDayDate).toBeNull();
    });

    it('should calculate correct duration stats', () => {
      const today = startOfDay(new Date());
      const activities: ActivityRecord[] = [
        {
          id: '1',
          activityKey: 'WALKING',
          label: 'Yürüme',
          icon: '🚶‍♂️',
          amount: 1000,
          points: 1000,
          performedAt: today.toISOString(),
          duration: 1800, // 30 minutes
        },
        {
          id: '2',
          activityKey: 'RUNNING',
          label: 'Koşma',
          icon: '🏃',
          amount: 500,
          points: 1000,
          performedAt: today.toISOString(),
          duration: 1200, // 20 minutes
        },
      ];

      const stats = calculateDurationStats(activities);

      expect(stats.totalDuration).toBe(3000); // 1800 + 1200
      expect(stats.averageDailyDuration).toBe(3000);
      expect(stats.daysWithDuration).toBe(1);
    });

    it('should find longest day', () => {
      const today = startOfDay(new Date());
      const yesterday = subDays(today, 1);

      const activities: ActivityRecord[] = [
        {
          id: '1',
          activityKey: 'WALKING',
          label: 'Yürüme',
          icon: '🚶‍♂️',
          amount: 1000,
          points: 1000,
          performedAt: today.toISOString(),
          duration: 1800,
        },
        {
          id: '2',
          activityKey: 'RUNNING',
          label: 'Koşma',
          icon: '🏃',
          amount: 2000,
          points: 4000,
          performedAt: yesterday.toISOString(),
          duration: 3600,
        },
      ];

      const stats = calculateDurationStats(activities);

      expect(stats.longestDayDuration).toBe(3600);
      expect(stats.longestDayDate).toBeTruthy();
    });
  });

  describe('formatDuration', () => {
    it('should format seconds correctly in Turkish', () => {
      expect(formatDuration(0, 'tr')).toBe('0 saniye');
      expect(formatDuration(30, 'tr')).toBe('30 saniye');
      expect(formatDuration(60, 'tr')).toBe('1 dakika');
      expect(formatDuration(90, 'tr')).toBe('1 dakika 30 saniye');
      expect(formatDuration(3600, 'tr')).toBe('1 saat');
      // When hours > 0, seconds are not shown
      expect(formatDuration(3661, 'tr')).toBe('1 saat 1 dakika');
    });

    it('should format seconds correctly in English', () => {
      expect(formatDuration(0, 'en')).toBe('0 seconds');
      expect(formatDuration(30, 'en')).toBe('30 seconds');
      expect(formatDuration(60, 'en')).toBe('1 minute');
      expect(formatDuration(90, 'en')).toBe('1 minute 30 seconds');
      expect(formatDuration(3600, 'en')).toBe('1 hour');
      // When hours > 0, seconds are not shown
      expect(formatDuration(3661, 'en')).toBe('1 hour 1 minute');
    });

    it('should handle large durations', () => {
      const largeDuration = 86400; // 1 day
      const tr = formatDuration(largeDuration, 'tr');
      const en = formatDuration(largeDuration, 'en');

      expect(tr).toContain('saat');
      expect(en).toContain('hour');
    });

    it('should handle edge cases', () => {
      expect(formatDuration(-1, 'tr')).toBe('0 saniye');
      expect(formatDuration(-1, 'en')).toBe('0 seconds');
      expect(formatDuration(Number.MAX_SAFE_INTEGER, 'tr')).toBeTruthy();
      expect(formatDuration(Number.MAX_SAFE_INTEGER, 'en')).toBeTruthy();
    });
  });
});
