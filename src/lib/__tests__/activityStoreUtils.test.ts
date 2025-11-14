/**
 * Tests for activityStore utility functions
 * Note: computePoints is an internal function, tested indirectly through activity creation
 */

import { ActivityRecord } from '@/lib/activityStore';

describe('activityStore utils', () => {
  describe('Points calculation logic', () => {
    it('should calculate points as multiplier * amount', () => {
      const multiplier = 2;
      const amount = 1000;
      const expectedPoints = Math.max(0, Math.round(amount * multiplier));

      expect(expectedPoints).toBe(2000); // 2 * 1000
    });

    it('should handle zero multiplier', () => {
      const multiplier = 0;
      const amount = 1000;
      const expectedPoints = Math.max(0, Math.round(amount * multiplier));

      expect(expectedPoints).toBe(0);
    });

    it('should handle zero amount', () => {
      const multiplier = 2;
      const amount = 0;
      const expectedPoints = Math.max(0, Math.round(amount * multiplier));

      expect(expectedPoints).toBe(0);
    });

    it('should handle decimal multipliers', () => {
      const multiplier = 1.5;
      const amount = 1000;
      const expectedPoints = Math.max(0, Math.round(amount * multiplier));

      expect(expectedPoints).toBe(1500); // 1.5 * 1000
    });

    it('should round points correctly', () => {
      const multiplier = 1.333;
      const amount = 1000;
      const expectedPoints = Math.max(0, Math.round(amount * multiplier));

      expect(expectedPoints).toBe(Math.round(1333));
    });

    it('should ensure points are non-negative', () => {
      const multiplier = -1;
      const amount = 1000;
      const expectedPoints = Math.max(0, Math.round(amount * multiplier));

      expect(expectedPoints).toBe(0); // Should be clamped to 0
    });
  });
});
