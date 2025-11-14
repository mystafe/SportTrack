/**
 * Extended tests for activityUtils
 */

import { getActivityLabel, getActivityUnit, getActivityDescription } from '@/lib/activityUtils';
import type { ActivityDefinition } from '@/lib/activityConfig';

describe('activityUtils extended', () => {
  const mockDefinition: ActivityDefinition = {
    key: 'WALKING',
    label: 'Yürüme',
    labelEn: 'Walking',
    icon: '🚶‍♂️',
    multiplier: 1,
    unit: 'adım',
    unitEn: 'steps',
    defaultAmount: 1000,
    description: 'Adım sayınızı girin',
    descriptionEn: 'Enter your step count',
  };

  describe('getActivityLabel', () => {
    it('should return Turkish label when lang is tr', () => {
      const label = getActivityLabel(mockDefinition, 'tr');
      expect(label).toBe('Yürüme');
    });

    it('should return English label when lang is en and labelEn exists', () => {
      const label = getActivityLabel(mockDefinition, 'en');
      expect(label).toBe('Walking');
    });

    it('should fallback to Turkish label when labelEn is missing', () => {
      const definitionWithoutEn = {
        label: 'Yürüme',
        labelEn: undefined,
      };
      const label = getActivityLabel(definitionWithoutEn, 'en');
      expect(label).toBe('Yürüme');
    });

    it('should handle activity record format', () => {
      const record = {
        label: 'Yürüme',
        labelEn: 'Walking',
      };
      const labelTr = getActivityLabel(record, 'tr');
      const labelEn = getActivityLabel(record, 'en');
      expect(labelTr).toBe('Yürüme');
      expect(labelEn).toBe('Walking');
    });
  });

  describe('getActivityUnit', () => {
    it('should return Turkish unit when lang is tr', () => {
      const unit = getActivityUnit(mockDefinition, 'tr');
      expect(unit).toBe('adım');
    });

    it('should return English unit when lang is en and unitEn exists', () => {
      const unit = getActivityUnit(mockDefinition, 'en');
      expect(unit).toBe('steps');
    });

    it('should fallback to Turkish unit when unitEn is missing', () => {
      const definitionWithoutEn = {
        unit: 'adım',
        unitEn: undefined,
      };
      const unit = getActivityUnit(definitionWithoutEn, 'en');
      expect(unit).toBe('adım');
    });

    it('should handle activity record format', () => {
      const record = {
        unit: 'adım',
        unitEn: 'steps',
      };
      const unitTr = getActivityUnit(record, 'tr');
      const unitEn = getActivityUnit(record, 'en');
      expect(unitTr).toBe('adım');
      expect(unitEn).toBe('steps');
    });
  });

  describe('getActivityDescription', () => {
    it('should return Turkish description when lang is tr', () => {
      const description = getActivityDescription(mockDefinition, 'tr');
      expect(description).toBe('Adım sayınızı girin');
    });

    it('should return English description when lang is en and descriptionEn exists', () => {
      const description = getActivityDescription(mockDefinition, 'en');
      expect(description).toBe('Enter your step count');
    });

    it('should fallback to Turkish description when descriptionEn is missing', () => {
      const definitionWithoutEn = {
        description: 'Adım sayınızı girin',
        descriptionEn: undefined,
      };
      const description = getActivityDescription(definitionWithoutEn, 'en');
      expect(description).toBe('Adım sayınızı girin');
    });

    it('should return undefined when description is missing', () => {
      const definitionWithoutDesc = {
        description: undefined,
        descriptionEn: undefined,
      };
      const description = getActivityDescription(definitionWithoutDesc, 'tr');
      expect(description).toBeUndefined();
    });
  });
});
