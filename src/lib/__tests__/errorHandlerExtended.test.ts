/**
 * Extended tests for errorHandler utilities
 */

import {
  createError,
  isNetworkError,
  getUserFriendlyMessage,
  handleError,
} from '@/lib/errorHandler';
import type { AppError, ErrorType } from '@/lib/errorHandler';

describe('errorHandler extended', () => {
  describe('createError', () => {
    it('should create error with required fields', () => {
      const error = createError('storage', 'Test error');

      expect(error.type).toBe('storage');
      expect(error.message).toBe('Test error');
      expect(error.timestamp).toBeDefined();
      expect(new Date(error.timestamp).getTime()).not.toBeNaN();
    });

    it('should include optional code', () => {
      const error = createError('network', 'Test error', { code: 'TEST_CODE' });

      expect(error.code).toBe('TEST_CODE');
    });

    it('should include original error', () => {
      const originalError = new Error('Original');
      const error = createError('validation', 'Test error', { originalError });

      expect(error.originalError).toBe(originalError);
    });

    it('should include context', () => {
      const context = { userId: '123', action: 'save' };
      const error = createError('unknown', 'Test error', { context });

      expect(error.context).toEqual(context);
    });
  });

  describe('isNetworkError', () => {
    it('should detect network error by message', () => {
      const error = new Error('network error occurred');
      expect(isNetworkError(error)).toBe(true);
    });

    it('should detect fetch error', () => {
      const error = new Error('Failed to fetch');
      expect(isNetworkError(error)).toBe(true);
    });

    it('should detect timeout error', () => {
      const error = new Error('Request timeout');
      expect(isNetworkError(error)).toBe(true);
    });

    it('should return false for non-network errors', () => {
      const error = new Error('Some other error');
      expect(isNetworkError(error)).toBe(false);
    });

    it('should return false for non-Error objects', () => {
      expect(isNetworkError('string')).toBe(false);
      expect(isNetworkError(null)).toBe(false);
      expect(isNetworkError(undefined)).toBe(false);
    });
  });

  describe('getUserFriendlyMessage', () => {
    const errorTypes: ErrorType[] = ['storage', 'network', 'validation', 'parse', 'unknown'];

    errorTypes.forEach((type) => {
      it(`should return message for ${type} error in Turkish`, () => {
        const error: AppError = {
          type,
          message: 'Test',
          timestamp: new Date().toISOString(),
        };
        const message = getUserFriendlyMessage(error, 'tr');

        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });

      it(`should return message for ${type} error in English`, () => {
        const error: AppError = {
          type,
          message: 'Test',
          timestamp: new Date().toISOString(),
        };
        const message = getUserFriendlyMessage(error, 'en');

        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });
  });

  describe('handleError', () => {
    it('should handle quota error', () => {
      const error = new DOMException('QuotaExceededError', 'QuotaExceededError');
      const message = handleError(error, 'tr');

      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });

    it('should handle network error', () => {
      const error = new Error('Network error');
      const message = handleError(error, 'en');

      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });

    it('should handle regular Error', () => {
      const error = new Error('Some error');
      const message = handleError(error, 'tr');

      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });

    it('should handle unknown error types', () => {
      const error = 'String error';
      const message = handleError(error, 'en');

      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });

    it('should include context in error', () => {
      const error = new Error('Test');
      const context = { userId: '123' };
      const message = handleError(error, 'tr', context);

      expect(typeof message).toBe('string');
    });
  });
});
