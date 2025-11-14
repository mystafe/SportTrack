import {
  createError,
  isQuotaError,
  isNetworkError,
  getUserFriendlyMessage,
  handleError,
  type AppError,
} from '../errorHandler';

describe('errorHandler', () => {
  describe('createError', () => {
    it('should create an error with all properties', () => {
      const error = createError('storage', 'Test error', {
        code: 'TEST_CODE',
        originalError: new Error('Original'),
        context: { key: 'value' },
      });

      expect(error.type).toBe('storage');
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.originalError).toEqual(new Error('Original'));
      expect(error.context).toEqual({ key: 'value' });
      expect(error.timestamp).toBeDefined();
    });

    it('should create an error with minimal properties', () => {
      const error = createError('unknown', 'Minimal error');

      expect(error.type).toBe('unknown');
      expect(error.message).toBe('Minimal error');
      expect(error.code).toBeUndefined();
      expect(error.originalError).toBeUndefined();
      expect(error.context).toBeUndefined();
    });
  });

  describe('isQuotaError', () => {
    it('should return true for QuotaExceededError', () => {
      const error = new DOMException('Quota exceeded', 'QuotaExceededError');
      expect(isQuotaError(error)).toBe(true);
    });

    it('should return false for other errors', () => {
      expect(isQuotaError(new Error('Other error'))).toBe(false);
      expect(isQuotaError(new DOMException('Other', 'OtherError'))).toBe(false);
      expect(isQuotaError('string')).toBe(false);
    });
  });

  describe('isNetworkError', () => {
    it('should return true for network-related errors', () => {
      expect(isNetworkError(new Error('network error'))).toBe(true);
      expect(isNetworkError(new Error('fetch failed'))).toBe(true);
      expect(isNetworkError(new Error('timeout occurred'))).toBe(true);
    });

    it('should return false for non-network errors', () => {
      expect(isNetworkError(new Error('other error'))).toBe(false);
      expect(isNetworkError('string')).toBe(false);
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should return Turkish message by default', () => {
      const error: AppError = {
        type: 'storage',
        message: 'Test',
        timestamp: new Date().toISOString(),
      };
      const message = getUserFriendlyMessage(error);
      expect(message).toContain('Depolama');
    });

    it('should return English message when lang is en', () => {
      const error: AppError = {
        type: 'network',
        message: 'Test',
        timestamp: new Date().toISOString(),
      };
      const message = getUserFriendlyMessage(error, 'en');
      expect(message).toContain('Network');
    });

    it('should handle all error types', () => {
      const types: Array<AppError['type']> = [
        'storage',
        'network',
        'validation',
        'parse',
        'unknown',
      ];

      types.forEach((type) => {
        const error: AppError = {
          type,
          message: 'Test',
          timestamp: new Date().toISOString(),
        };
        const message = getUserFriendlyMessage(error);
        expect(message).toBeTruthy();
        expect(typeof message).toBe('string');
      });
    });
  });

  describe('handleError', () => {
    it('should handle quota errors', () => {
      const error = new DOMException('Quota exceeded', 'QuotaExceededError');
      const message = handleError(error);
      expect(message).toBeTruthy();
      expect(typeof message).toBe('string');
    });

    it('should handle network errors', () => {
      const error = new Error('network error');
      const message = handleError(error);
      expect(message).toBeTruthy();
    });

    it('should handle generic errors', () => {
      const error = new Error('Generic error');
      const message = handleError(error);
      expect(message).toBeTruthy();
    });

    it('should handle unknown error types', () => {
      const message = handleError('string error');
      expect(message).toBeTruthy();
    });

    it('should accept context parameter', () => {
      const error = new Error('Test');
      const message = handleError(error, 'tr', { key: 'value' });
      expect(message).toBeTruthy();
    });
  });
});
