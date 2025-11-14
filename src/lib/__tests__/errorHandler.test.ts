/**
 * Tests for error handler utilities
 */

import { isQuotaError } from '@/lib/errorHandler';

describe('errorHandler', () => {
  describe('isQuotaError', () => {
    it('should detect QuotaExceededError DOMException', () => {
      const error = new DOMException('QuotaExceededError', 'QuotaExceededError');
      expect(isQuotaError(error)).toBe(true);
    });

    it('should return false for regular Error', () => {
      const error = new Error('Some error');
      expect(isQuotaError(error)).toBe(false);
    });

    it('should return false for error with QuotaExceededError name but not DOMException', () => {
      const error = { name: 'QuotaExceededError' };
      expect(isQuotaError(error)).toBe(false);
    });

    it('should return false for non-quota errors', () => {
      const error = new Error('Some other error');
      expect(isQuotaError(error)).toBe(false);
    });

    it('should handle null error', () => {
      expect(isQuotaError(null)).toBe(false);
    });

    it('should handle undefined error', () => {
      expect(isQuotaError(undefined)).toBe(false);
    });

    it('should handle error with no properties', () => {
      const error = {};
      expect(isQuotaError(error)).toBe(false);
    });
  });
});
