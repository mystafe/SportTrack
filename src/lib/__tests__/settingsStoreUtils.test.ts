/**
 * Tests for settingsStore utility functions
 */

import { findActivityDefinition } from '@/lib/settingsStore';
import type { UserSettings, CustomActivityDefinition } from '@/lib/settingsStore';
import { BASE_ACTIVITY_MAP } from '@/lib/activityConfig';
import type { ActivityKey } from '@/lib/activityConfig';

describe('settingsStore utilities', () => {
  describe('findActivityDefinition', () => {
    it('should find base activity definition', () => {
      const result = findActivityDefinition('WALKING', null);

      expect(result).toBeDefined();
      expect(result?.key).toBe('WALKING');
      expect(result?.isCustom).toBeFalsy();
    });

    it('should find custom activity definition when settings provided', () => {
      const customActivity: CustomActivityDefinition = {
        id: 'CUSTOM_TEST' as ActivityKey,
        label: 'Test Activity',
        labelEn: 'Test Activity',
        icon: '🧪',
        multiplier: 5,
        unit: 'test',
        unitEn: 'test',
        defaultAmount: 10,
      };

      const settings: UserSettings = {
        name: 'Test User',
        dailyTarget: 1000,
        customActivities: [customActivity],
      };

      const result = findActivityDefinition('CUSTOM_TEST' as ActivityKey, settings);

      expect(result).toBeDefined();
      expect(result?.key).toBe('CUSTOM_TEST');
      expect(result?.isCustom).toBe(true);
      expect(result?.label).toBe('Test Activity');
      expect(result?.multiplier).toBe(5);
    });

    it('should prioritize custom activity over base activity', () => {
      const customActivity: CustomActivityDefinition = {
        id: 'WALKING' as ActivityKey,
        label: 'Custom Walking',
        labelEn: 'Custom Walking',
        icon: '🚶',
        multiplier: 2,
        unit: 'steps',
        unitEn: 'steps',
        defaultAmount: 5000,
      };

      const settings: UserSettings = {
        name: 'Test User',
        dailyTarget: 1000,
        customActivities: [customActivity],
      };

      const result = findActivityDefinition('WALKING', settings);

      expect(result).toBeDefined();
      expect(result?.isCustom).toBe(true);
      expect(result?.label).toBe('Custom Walking');
      expect(result?.multiplier).toBe(2);
    });

    it('should return undefined for non-existent activity', () => {
      const result = findActivityDefinition('NON_EXISTENT' as ActivityKey, null);
      expect(result).toBeUndefined();
    });

    it('should return undefined for non-existent custom activity', () => {
      const settings: UserSettings = {
        name: 'Test User',
        dailyTarget: 1000,
        customActivities: [],
      };

      const result = findActivityDefinition('NON_EXISTENT' as ActivityKey, settings);
      expect(result).toBeUndefined();
    });

    it('should handle null settings gracefully', () => {
      const result = findActivityDefinition('WALKING', null);
      expect(result).toBeDefined();
      expect(result).toBe(BASE_ACTIVITY_MAP['WALKING']);
    });

    it('should handle settings with empty custom activities', () => {
      const settings: UserSettings = {
        name: 'Test User',
        dailyTarget: 1000,
        customActivities: [],
      };

      const result = findActivityDefinition('WALKING', settings);
      expect(result).toBeDefined();
      expect(result?.isCustom).toBeFalsy();
      expect(result).toBe(BASE_ACTIVITY_MAP['WALKING']);
    });
  });

  // Note: dedupeCustomActivities is not exported, so we test it indirectly
  // through the SettingsProvider behavior in useSettings tests
});
