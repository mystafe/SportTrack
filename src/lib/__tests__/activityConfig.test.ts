/**
 * Tests for activity configuration
 */

import {
  BASE_ACTIVITY_DEFINITIONS,
  DEFAULT_DAILY_TARGET,
  BASE_ACTIVITY_MAP,
} from '@/lib/activityConfig';
import type { ActivityDefinition } from '@/lib/activityConfig';

describe('activityConfig', () => {
  describe('BASE_ACTIVITY_DEFINITIONS', () => {
    it('should have activity definitions', () => {
      expect(BASE_ACTIVITY_DEFINITIONS).toBeDefined();
      expect(Array.isArray(BASE_ACTIVITY_DEFINITIONS)).toBe(true);
      expect(BASE_ACTIVITY_DEFINITIONS.length).toBeGreaterThan(0);
    });

    it('should have valid activity definitions', () => {
      BASE_ACTIVITY_DEFINITIONS.forEach((activity) => {
        expect(activity.key).toBeDefined();
        expect(activity.label).toBeDefined();
        expect(activity.icon).toBeDefined();
        expect(activity.multiplier).toBeDefined();
        expect(typeof activity.multiplier).toBe('number');
        expect(activity.multiplier).toBeGreaterThan(0);
        expect(activity.unit).toBeDefined();
        expect(activity.defaultAmount).toBeDefined();
        expect(typeof activity.defaultAmount).toBe('number');
      });
    });

    it('should have unique activity keys', () => {
      const keys = BASE_ACTIVITY_DEFINITIONS.map((a) => a.key);
      const uniqueKeys = new Set(keys);
      expect(keys.length).toBe(uniqueKeys.size);
    });

    it('should have both Turkish and English labels', () => {
      BASE_ACTIVITY_DEFINITIONS.forEach((activity) => {
        expect(activity.label).toBeDefined();
        expect(activity.labelEn).toBeDefined();
        expect(typeof activity.label).toBe('string');
        expect(typeof activity.labelEn).toBe('string');
        expect(activity.label.length).toBeGreaterThan(0);
        expect(activity.labelEn.length).toBeGreaterThan(0);
      });
    });
  });

  describe('BASE_ACTIVITY_MAP', () => {
    it('should have activity map defined', () => {
      expect(BASE_ACTIVITY_MAP).toBeDefined();
      expect(typeof BASE_ACTIVITY_MAP).toBe('object');
    });

    it('should map all activity keys correctly', () => {
      BASE_ACTIVITY_DEFINITIONS.forEach((activity) => {
        expect(BASE_ACTIVITY_MAP[activity.key]).toBeDefined();
        expect(BASE_ACTIVITY_MAP[activity.key].key).toBe(activity.key);
      });
    });
  });

  describe('DEFAULT_DAILY_TARGET', () => {
    it('should have default daily target defined', () => {
      expect(DEFAULT_DAILY_TARGET).toBeDefined();
      expect(typeof DEFAULT_DAILY_TARGET).toBe('number');
      expect(DEFAULT_DAILY_TARGET).toBeGreaterThan(0);
    });

    it('should have reasonable default target value', () => {
      expect(DEFAULT_DAILY_TARGET).toBeGreaterThanOrEqual(1000);
      expect(DEFAULT_DAILY_TARGET).toBeLessThanOrEqual(100000);
    });
  });

  describe('Activity categories', () => {
    it('should have valid categories', () => {
      const categories = new Set<string>();
      BASE_ACTIVITY_DEFINITIONS.forEach((activity) => {
        if (activity.category) {
          categories.add(activity.category);
        }
      });

      // Should have at least some categories
      expect(categories.size).toBeGreaterThan(0);
    });
  });
});
