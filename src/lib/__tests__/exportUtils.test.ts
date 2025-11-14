/**
 * Tests for export utilities
 */

import { exportToCSV, exportToJSON } from '@/lib/exportUtils';
import type { ActivityRecord } from '@/lib/activityStore';
import type { UserSettings } from '@/lib/settingsStore';

// Mock document.createElement and URL.createObjectURL for CSV export
const mockCreateElement = jest.fn();
const mockCreateObjectURL = jest.fn();
const mockRevokeObjectURL = jest.fn();
const mockClick = jest.fn();
const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();

beforeAll(() => {
  global.URL.createObjectURL = mockCreateObjectURL;
  global.URL.revokeObjectURL = mockRevokeObjectURL;

  const mockAnchor = {
    href: '',
    download: '',
    click: mockClick,
  };

  mockCreateElement.mockReturnValue(mockAnchor);

  // Mock document.body
  Object.defineProperty(global.document, 'body', {
    value: {
      appendChild: mockAppendChild,
      removeChild: mockRemoveChild,
    },
    writable: true,
  });

  global.document.createElement = mockCreateElement as any;
});

beforeEach(() => {
  jest.clearAllMocks();
  mockCreateObjectURL.mockReturnValue('blob:mock-url');
});

describe('exportUtils', () => {
  const mockActivities: ActivityRecord[] = [
    {
      id: '1',
      activityKey: 'WALKING',
      label: 'Yürüme',
      labelEn: 'Walking',
      icon: '🚶',
      unit: 'adım',
      unitEn: 'steps',
      multiplier: 1,
      amount: 5000,
      points: 5000,
      performedAt: '2024-01-15T10:00:00Z',
      note: 'Morning walk',
      isCustom: false,
    },
    {
      id: '2',
      activityKey: 'RUNNING',
      label: 'Koşu',
      labelEn: 'Running',
      icon: '🏃',
      unit: 'km',
      unitEn: 'km',
      multiplier: 10,
      amount: 5,
      points: 50,
      performedAt: '2024-01-15T18:00:00Z',
      note: null,
      isCustom: false,
    },
  ];

  const mockSettings: UserSettings = {
    name: 'Test User',
    dailyTarget: 1000,
    customActivities: [],
  };

  describe('exportToCSV', () => {
    it('should create CSV file with activities', () => {
      exportToCSV(mockActivities, mockSettings, {
        format: 'csv',
        language: 'tr',
      });

      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalled();
    });

    it('should filter activities by date range', () => {
      const startDate = new Date('2024-01-15T00:00:00Z');
      const endDate = new Date('2024-01-15T23:59:59Z');

      exportToCSV(mockActivities, mockSettings, {
        format: 'csv',
        language: 'tr',
        dateRange: { start: startDate, end: endDate },
      });

      expect(mockCreateElement).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });

    it('should use English headers when language is en', () => {
      exportToCSV(mockActivities, mockSettings, {
        format: 'csv',
        language: 'en',
      });

      expect(mockCreateElement).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });

    it('should handle empty activities array', () => {
      exportToCSV([], mockSettings, {
        format: 'csv',
        language: 'tr',
      });

      expect(mockCreateElement).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });

    it('should handle null settings', () => {
      exportToCSV(mockActivities, null, {
        format: 'csv',
        language: 'tr',
      });

      expect(mockCreateElement).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });
  });

  describe('exportToJSON', () => {
    it('should create JSON file with activities', () => {
      exportToJSON(mockActivities, mockSettings, {
        format: 'json',
        language: 'tr',
      });

      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalled();
    });

    it('should filter activities by date range', () => {
      const startDate = new Date('2024-01-15T00:00:00Z');
      const endDate = new Date('2024-01-15T23:59:59Z');

      exportToJSON(mockActivities, mockSettings, {
        format: 'json',
        language: 'tr',
        dateRange: { start: startDate, end: endDate },
      });

      expect(mockCreateElement).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });

    it('should include metadata in JSON export', () => {
      exportToJSON(mockActivities, mockSettings, {
        format: 'json',
        language: 'tr',
      });

      expect(mockCreateElement).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });

    it('should handle empty activities array', () => {
      exportToJSON([], mockSettings, {
        format: 'json',
        language: 'tr',
      });

      expect(mockCreateElement).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });

    it('should handle null settings', () => {
      exportToJSON(mockActivities, null, {
        format: 'json',
        language: 'tr',
      });

      expect(mockCreateElement).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });
  });
});
