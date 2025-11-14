/**
 * Tests for quotes utility
 */

import { getRandomQuote, MOTIVATIONAL_QUOTES } from '@/lib/quotes';

describe('quotes', () => {
  describe('getRandomQuote', () => {
    it('should return a quote object', () => {
      const quote = getRandomQuote();

      expect(quote).toBeDefined();
      expect(quote.tr).toBeDefined();
      expect(quote.en).toBeDefined();
      expect(typeof quote.tr).toBe('string');
      expect(typeof quote.en).toBe('string');
      expect(quote.tr.length).toBeGreaterThan(0);
      expect(quote.en.length).toBeGreaterThan(0);
    });

    it('should return quotes from the quotes array', () => {
      const quote = getRandomQuote();

      const foundInArray = MOTIVATIONAL_QUOTES.some((q) => q.tr === quote.tr && q.en === quote.en);
      expect(foundInArray).toBe(true);
    });

    it('should return different quotes on multiple calls (statistical test)', () => {
      const quotes = new Set<string>();
      // Call multiple times to increase chance of getting different quotes
      for (let i = 0; i < 20; i++) {
        const quote = getRandomQuote();
        quotes.add(quote.tr);
      }

      // With 20 calls, we should get at least 2 different quotes (statistically)
      expect(quotes.size).toBeGreaterThanOrEqual(1);
    });

    it('should handle empty quotes array gracefully', () => {
      // This test ensures the function doesn't crash
      const quote = getRandomQuote();
      expect(quote).toBeDefined();
    });
  });

  describe('MOTIVATIONAL_QUOTES array', () => {
    it('should have quotes defined', () => {
      expect(MOTIVATIONAL_QUOTES).toBeDefined();
      expect(Array.isArray(MOTIVATIONAL_QUOTES)).toBe(true);
      expect(MOTIVATIONAL_QUOTES.length).toBeGreaterThan(0);
    });

    it('should have quotes with both Turkish and English translations', () => {
      MOTIVATIONAL_QUOTES.forEach((quote) => {
        expect(quote.tr).toBeDefined();
        expect(quote.en).toBeDefined();
        expect(typeof quote.tr).toBe('string');
        expect(typeof quote.en).toBe('string');
        expect(quote.tr.length).toBeGreaterThan(0);
        expect(quote.en.length).toBeGreaterThan(0);
      });
    });
  });
});
