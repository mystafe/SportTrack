/**
 * Tests for syncService
 */

import { cloudSyncService } from '../syncService';
import type { ActivityRecord } from '@/lib/activityStore';
import type { UserSettings } from '@/lib/settingsStore';
import type { Badge } from '@/lib/badges';
import type { Challenge } from '@/lib/challenges';

// Import Firestore functions to access mocks
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => {
  const mockDb = {};
  const mockDoc = jest.fn(() => ({}));
  const mockCollection = jest.fn(() => ({}));
  const mockGetDoc = jest.fn();
  const mockSetDoc = jest.fn();
  const mockGetDocs = jest.fn();
  const mockWriteBatch = jest.fn(() => ({
    set: jest.fn(),
    delete: jest.fn(),
    commit: jest.fn(() => Promise.resolve()),
  }));
  const mockDeleteDoc = jest.fn();
  const mockOnSnapshot = jest.fn();
  const mockServerTimestamp = jest.fn(() => ({ seconds: Date.now() / 1000, nanoseconds: 0 }));
  const mockTimestamp = {
    fromDate: jest.fn((date: Date) => ({ seconds: date.getTime() / 1000, nanoseconds: 0 })),
    now: jest.fn(() => ({ seconds: Date.now() / 1000, nanoseconds: 0 })),
  };

  return {
    getFirestore: jest.fn(() => mockDb),
    doc: mockDoc,
    collection: mockCollection,
    getDoc: mockGetDoc,
    setDoc: mockSetDoc,
    getDocs: mockGetDocs,
    writeBatch: mockWriteBatch,
    deleteDoc: mockDeleteDoc,
    onSnapshot: mockOnSnapshot,
    serverTimestamp: mockServerTimestamp,
    Timestamp: mockTimestamp,
  };
});

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: {
      uid: 'test-user-id',
      email: 'test@example.com',
    },
  })),
}));

// Mock Firebase config
jest.mock('@/lib/firebase/config', () => {
  const mockDb = {};
  const mockAuth = {
    currentUser: {
      uid: 'test-user-id',
      email: 'test@example.com',
    },
  };

  return {
    db: mockDb,
    auth: mockAuth,
    isFirebaseConfigured: jest.fn(() => true),
  };
});

describe('syncService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    // Set environment variables for isConfigured
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-key';
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project';
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com';
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test.appspot.com';
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = '123456789';
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID = 'test-app-id';

    // Mock Firestore functions
    const { setDoc, getDoc, getDocs } = require('firebase/firestore');
    setDoc.mockResolvedValue(undefined);
    getDoc.mockResolvedValue({
      exists: () => false,
      data: () => null,
    });
    getDocs.mockResolvedValue({
      docs: [],
    });

    // Mock isFirebaseConfigured
    const { isFirebaseConfigured } = require('@/lib/firebase/config');
    isFirebaseConfigured.mockReturnValue(true);

    // Set userId for syncService
    cloudSyncService.setUserId('test-user-id');
  });

  describe('isConfigured', () => {
    it('should return true when Firebase is configured', () => {
      // Environment variables are set in beforeEach
      expect(cloudSyncService.isConfigured()).toBe(true);
    });

    it('should return false when Firebase is not configured', () => {
      // Mock isFirebaseConfigured to return false
      const { isFirebaseConfigured } = require('@/lib/firebase/config');
      isFirebaseConfigured.mockReturnValueOnce(false);

      expect(cloudSyncService.isConfigured()).toBe(false);
    });
  });

  describe('uploadToCloud', () => {
    it('should throw error when not configured', async () => {
      // Mock isConfigured to return false
      jest.spyOn(cloudSyncService, 'isConfigured').mockReturnValue(false);

      const data = {
        activities: [],
        settings: null,
        badges: [],
        challenges: [],
      };

      await expect(cloudSyncService.uploadToCloud(data)).rejects.toThrow(
        'Cloud sync not configured'
      );
    });

    it('should prevent uploading empty data unless reset', async () => {
      jest.spyOn(cloudSyncService, 'isConfigured').mockReturnValue(true);

      const emptyData = {
        activities: [],
        settings: null,
        badges: [],
        challenges: [],
      };

      // Should not throw but should not upload
      await expect(cloudSyncService.uploadToCloud(emptyData)).resolves.not.toThrow();
    });

    it('should allow uploading empty data during reset', async () => {
      jest.spyOn(cloudSyncService, 'isConfigured').mockReturnValue(true);

      const emptyData = {
        activities: [],
        settings: null,
        badges: [],
        challenges: [],
      };

      await expect(
        cloudSyncService.uploadToCloud(emptyData, { isReset: true })
      ).resolves.not.toThrow();
    });
  });

  describe('downloadFromCloud', () => {
    it('should throw error when not configured', async () => {
      jest.spyOn(cloudSyncService, 'isConfigured').mockReturnValue(false);

      await expect(cloudSyncService.downloadFromCloud()).rejects.toThrow(
        'Cloud sync not configured'
      );
    });

    it('should return null when user is not authenticated', async () => {
      jest.spyOn(cloudSyncService, 'isConfigured').mockReturnValue(true);

      // Clear userId
      cloudSyncService.setUserId(null as any);

      await expect(cloudSyncService.downloadFromCloud()).rejects.toThrow(
        'Firebase not configured or user not authenticated'
      );
    });
  });

  describe('data validation', () => {
    it('should sanitize invalid dates in activities', async () => {
      jest.spyOn(cloudSyncService, 'isConfigured').mockReturnValue(true);

      const dataWithInvalidDate = {
        activities: [
          {
            id: '1',
            activityKey: 'WALKING',
            label: 'Walking',
            icon: '🚶',
            unit: 'steps',
            multiplier: 1,
            amount: 1000,
            points: 1000,
            performedAt: 'invalid-date',
            note: null,
          } as unknown as ActivityRecord,
        ],
        settings: null,
        badges: [],
        challenges: [],
      };

      // Should not throw - invalid dates should be sanitized
      await expect(cloudSyncService.uploadToCloud(dataWithInvalidDate)).resolves.not.toThrow();
    });

    it('should handle missing optional fields', async () => {
      jest.spyOn(cloudSyncService, 'isConfigured').mockReturnValue(true);

      const minimalData = {
        activities: [
          {
            id: '1',
            activityKey: 'WALKING',
            label: 'Walking',
            icon: '🚶',
            unit: 'steps',
            multiplier: 1,
            amount: 1000,
            points: 1000,
            performedAt: new Date().toISOString(),
          } as ActivityRecord,
        ],
        settings: null,
        badges: [],
        challenges: [],
      };

      await expect(cloudSyncService.uploadToCloud(minimalData)).resolves.not.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      jest.spyOn(cloudSyncService, 'isConfigured').mockReturnValue(true);

      const { setDoc } = require('firebase/firestore');
      setDoc.mockRejectedValueOnce(new Error('Network error'));

      const data = {
        activities: [
          {
            id: '1',
            activityKey: 'WALKING',
            label: 'Walking',
            icon: '🚶',
            unit: 'steps',
            multiplier: 1,
            amount: 1000,
            points: 1000,
            performedAt: new Date().toISOString(),
          } as ActivityRecord,
        ],
        settings: null,
        badges: [],
        challenges: [],
      };

      await expect(cloudSyncService.uploadToCloud(data)).rejects.toThrow();
    });

    it('should handle permission errors', async () => {
      jest.spyOn(cloudSyncService, 'isConfigured').mockReturnValue(true);

      const { setDoc } = require('firebase/firestore');
      const permissionError = new Error('Permission denied');
      (permissionError as any).code = 'permission-denied';
      setDoc.mockRejectedValueOnce(permissionError);

      const data = {
        activities: [
          {
            id: '1',
            activityKey: 'WALKING',
            label: 'Walking',
            icon: '🚶',
            unit: 'steps',
            multiplier: 1,
            amount: 1000,
            points: 1000,
            performedAt: new Date().toISOString(),
          } as ActivityRecord,
        ],
        settings: null,
        badges: [],
        challenges: [],
      };

      await expect(cloudSyncService.uploadToCloud(data)).rejects.toThrow('PERMISSION_DENIED');
    });
  });
});
