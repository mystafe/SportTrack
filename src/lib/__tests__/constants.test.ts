/**
 * Tests for constants
 */

import { STORAGE_KEYS, BREAKPOINTS } from '@/lib/constants';

describe('constants', () => {
  describe('STORAGE_KEYS', () => {
    it('should have all required storage keys', () => {
      expect(STORAGE_KEYS.ACTIVITIES).toBeDefined();
      expect(STORAGE_KEYS.SETTINGS).toBeDefined();
      expect(STORAGE_KEYS.BADGES).toBeDefined();
      expect(STORAGE_KEYS.CHALLENGES).toBeDefined();
      expect(STORAGE_KEYS.ONBOARDING_COMPLETED).toBeDefined();
      expect(STORAGE_KEYS.THEME).toBeDefined();
    });

    it('should have unique storage key values', () => {
      const values = Object.values(STORAGE_KEYS);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });

    it('should have string values', () => {
      Object.values(STORAGE_KEYS).forEach((value) => {
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('BREAKPOINTS', () => {
    it('should have mobile breakpoint defined', () => {
      expect(BREAKPOINTS.MOBILE).toBeDefined();
      expect(typeof BREAKPOINTS.MOBILE).toBe('number');
      expect(BREAKPOINTS.MOBILE).toBeGreaterThan(0);
    });

    it('should have valid breakpoint values', () => {
      expect(BREAKPOINTS.MOBILE).toBeGreaterThan(0);
      expect(BREAKPOINTS.MOBILE).toBeLessThan(10000); // Reasonable upper limit
    });
  });
});
