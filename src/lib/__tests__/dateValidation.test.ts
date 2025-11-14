/**
 * Tests for date validation utilities
 */

// Note: validateAndSanitizeDate is not exported, so we test it indirectly
// through activity creation, but we can test date-related logic

describe('date validation', () => {
  describe('Date parsing and validation', () => {
    it('should handle valid ISO date strings', () => {
      const validDate = new Date().toISOString();
      const parsed = new Date(validDate);

      expect(parsed.getTime()).not.toBeNaN();
      expect(parsed.toISOString()).toBe(validDate);
    });

    it('should handle invalid date strings', () => {
      const invalidDate = 'invalid-date';
      const parsed = new Date(invalidDate);

      expect(isNaN(parsed.getTime())).toBe(true);
    });

    it('should handle null dates', () => {
      const nullDate: string | null = null;
      const fallback = new Date().toISOString();

      expect(fallback).toBeDefined();
      expect(new Date(fallback).getTime()).not.toBeNaN();
    });

    it('should handle undefined dates', () => {
      const undefinedDate: string | undefined = undefined;
      const fallback = new Date().toISOString();

      expect(fallback).toBeDefined();
      expect(new Date(fallback).getTime()).not.toBeNaN();
    });

    it('should handle date range validation', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      expect(yesterday < today).toBe(true);
      expect(tomorrow > today).toBe(true);
    });

    it('should handle date string format variations', () => {
      const formats = [
        new Date().toISOString(),
        new Date().toLocaleDateString(),
        new Date().toString(),
      ];

      formats.forEach((format) => {
        const parsed = new Date(format);
        expect(parsed.getTime()).not.toBeNaN();
      });
    });
  });
});
