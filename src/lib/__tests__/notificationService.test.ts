/**
 * Tests for notification service
 */

import { notificationService } from '@/lib/notificationService';

describe('notificationService', () => {
  beforeEach(() => {
    // Mock Notification API
    global.Notification = jest.fn().mockImplementation(() => ({
      close: jest.fn(),
    })) as any;

    // Mock navigator.permissions
    Object.defineProperty(navigator, 'permissions', {
      writable: true,
      configurable: true,
      value: {
        query: jest.fn().mockResolvedValue({ state: 'granted' }),
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('requestPermission', () => {
    it('should request notification permission', async () => {
      const mockRequestPermission = jest.fn().mockResolvedValue('granted');
      Object.defineProperty(global.Notification, 'requestPermission', {
        writable: true,
        configurable: true,
        value: mockRequestPermission,
      });

      const result = await notificationService.requestPermission();

      expect(typeof result).toBe('string');
      expect(['default', 'granted', 'denied']).toContain(result);
    });

    it('should handle permission states', async () => {
      // Test that the function handles different permission states
      const result = await notificationService.requestPermission();
      expect(['default', 'granted', 'denied']).toContain(result);
    });
  });

  describe('showNotification', () => {
    it('should handle notification display', async () => {
      // Test that the function doesn't throw
      await expect(
        notificationService.showNotification('Test Title', {
          body: 'Test Body',
        })
      ).resolves.not.toThrow();
    });
  });

  describe('canNotify', () => {
    it('should check if notifications can be shown', () => {
      const canNotify = notificationService.canNotify();
      expect(typeof canNotify).toBe('boolean');
    });
  });
});
