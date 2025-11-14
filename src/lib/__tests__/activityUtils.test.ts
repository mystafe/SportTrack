import { getActivityLabel, getActivityUnit } from '../activityUtils';
import { ActivityRecord } from '../activityStore';

describe('activityUtils', () => {
  const mockActivity: ActivityRecord = {
    id: 'test-1',
    activityKey: 'walking',
    label: 'Yürüme',
    labelEn: 'Walking',
    icon: '🚶',
    unit: 'adım',
    unitEn: 'steps',
    multiplier: 1,
    amount: 1000,
    points: 1000,
    performedAt: new Date().toISOString(),
  };

  describe('getActivityLabel', () => {
    it('should return Turkish label when lang is tr', () => {
      expect(getActivityLabel(mockActivity, 'tr')).toBe('Yürüme');
    });

    it('should return English label when lang is en', () => {
      expect(getActivityLabel(mockActivity, 'en')).toBe('Walking');
    });

    it('should fallback to Turkish label when labelEn is missing', () => {
      const activityWithoutEn = { ...mockActivity, labelEn: undefined };
      expect(getActivityLabel(activityWithoutEn, 'en')).toBe('Yürüme');
    });

    it('should return label when labelEn is missing and lang is en', () => {
      const activityWithoutEn = { ...mockActivity, labelEn: undefined };
      expect(getActivityLabel(activityWithoutEn, 'en')).toBe('Yürüme');
    });
  });

  describe('getActivityUnit', () => {
    it('should return Turkish unit when lang is tr', () => {
      expect(getActivityUnit(mockActivity, 'tr')).toBe('adım');
    });

    it('should return English unit when lang is en', () => {
      expect(getActivityUnit(mockActivity, 'en')).toBe('steps');
    });

    it('should fallback to Turkish unit when unitEn is missing', () => {
      const activityWithoutEn = { ...mockActivity, unitEn: undefined };
      expect(getActivityUnit(activityWithoutEn, 'en')).toBe('adım');
    });
  });
});
