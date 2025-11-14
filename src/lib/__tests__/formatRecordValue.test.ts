/**
 * Tests for formatRecordValue utility function
 */

import { formatRecordValue } from '@/lib/personalRecords';
import type { PersonalRecord } from '@/lib/personalRecords';

describe('formatRecordValue', () => {
  const createMockRecord = (type: PersonalRecord['type'], value: number): PersonalRecord => ({
    id: 'test-1',
    type,
    value,
    date: new Date().toISOString(),
    label: { tr: 'Test', en: 'Test' },
    icon: '⭐',
  });

  describe('points type', () => {
    it('should format points in Turkish', () => {
      const record = createMockRecord('points', 10000);
      const formatted = formatRecordValue(record, 'tr');

      // Value will be formatted with locale (e.g., "10.000 puan" in Turkish)
      expect(formatted).toContain('puan');
      expect(formatted.length).toBeGreaterThan(0);
    });

    it('should format points in English', () => {
      const record = createMockRecord('points', 10000);
      const formatted = formatRecordValue(record, 'en');

      // Value will be formatted with locale (e.g., "10,000 points" in English)
      expect(formatted).toContain('points');
      expect(formatted.length).toBeGreaterThan(0);
    });

    it('should format large point values', () => {
      const record = createMockRecord('points', 1000000);
      const formatted = formatRecordValue(record, 'en');

      // Value will be formatted with locale (e.g., "1,000,000 points")
      expect(formatted).toContain('points');
      expect(formatted.length).toBeGreaterThan(0);
    });
  });

  describe('amount type', () => {
    it('should format amount in Turkish', () => {
      const record = createMockRecord('amount', 5000);
      const formatted = formatRecordValue(record, 'tr');

      expect(formatted).toBe('5.000');
    });

    it('should format amount in English', () => {
      const record = createMockRecord('amount', 5000);
      const formatted = formatRecordValue(record, 'en');

      expect(formatted).toBe('5,000');
    });
  });

  describe('streak type', () => {
    it('should format streak in Turkish', () => {
      const record = createMockRecord('streak', 7);
      const formatted = formatRecordValue(record, 'tr');

      expect(formatted).toContain('7');
      expect(formatted).toContain('gün');
    });

    it('should format streak in English', () => {
      const record = createMockRecord('streak', 7);
      const formatted = formatRecordValue(record, 'en');

      expect(formatted).toContain('7');
      expect(formatted).toContain('days');
    });
  });

  describe('speed type', () => {
    it('should format speed in Turkish', () => {
      const record = createMockRecord('speed', 2.5);
      const formatted = formatRecordValue(record, 'tr');

      expect(formatted).toContain('2.5');
      expect(formatted).toContain('saat');
    });

    it('should format speed in English', () => {
      const record = createMockRecord('speed', 2.5);
      const formatted = formatRecordValue(record, 'en');

      expect(formatted).toContain('2.5');
      expect(formatted).toContain('hours');
    });
  });
});
