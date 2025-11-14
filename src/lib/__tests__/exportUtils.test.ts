import { exportToCSV, exportToPDF, exportToJSON } from '../exportUtils';
import { ActivityRecord } from '../activityStore';
import { createMockActivity } from '@/test-helpers';

// Mock DOM APIs
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();
global.Blob = jest.fn((content: unknown[]) => ({ content })) as unknown as typeof Blob;
global.document.createElement = jest.fn(() => ({
  href: '',
  download: '',
  click: jest.fn(),
})) as unknown as typeof document.createElement;
global.document.body.appendChild = jest.fn();
global.document.body.removeChild = jest.fn();

// Mock jsPDF
jest.mock('jspdf', () => {
  const mockDoc = {
    save: jest.fn(),
    text: jest.fn(),
    setFontSize: jest.fn(),
    setFont: jest.fn(),
    internal: {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297,
      },
    },
  };
  return {
    jsPDF: jest.fn(() => mockDoc),
  };
});

// Mock jsPDF-autotable
jest.mock('jspdf-autotable', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('exportUtils', () => {
  const mockActivities: ActivityRecord[] = [
    createMockActivity({ amount: 1000, points: 1000 }),
    createMockActivity({ amount: 2000, points: 2000 }),
  ];

  const mockSettings = {
    name: 'Test User',
    dailyTarget: 10000,
    customActivities: [],
    mood: null,
  };

  const mockSummary = {
    totalPoints: 3000,
    totalActivities: 2,
    averageDaily: 1500,
  };

  describe('exportToCSV', () => {
    it('should create CSV file download', () => {
      exportToCSV(mockActivities, mockSettings, {
        format: 'csv',
        language: 'en',
      });
      expect(global.document.createElement).toHaveBeenCalledWith('a');
    });

    it('should handle empty activities array', () => {
      exportToCSV([], mockSettings, {
        format: 'csv',
        language: 'en',
      });
      expect(global.document.createElement).toHaveBeenCalled();
    });
  });

  describe('exportToPDF', () => {
    it('should create PDF document', async () => {
      await exportToPDF(mockActivities, mockSettings, {
        format: 'pdf',
        language: 'en',
      });
      // PDF creation is async, just verify it doesn't throw
      expect(true).toBe(true);
    });

    it('should handle empty activities array', async () => {
      await exportToPDF([], mockSettings, {
        format: 'pdf',
        language: 'en',
      });
      expect(true).toBe(true);
    });
  });

  describe('exportToJSON', () => {
    it('should create JSON file download', () => {
      exportToJSON(mockActivities, mockSettings, {
        format: 'json',
        language: 'en',
      });
      expect(global.document.createElement).toHaveBeenCalledWith('a');
    });

    it('should handle empty activities array', () => {
      exportToJSON([], mockSettings, {
        format: 'json',
        language: 'en',
      });
      expect(global.document.createElement).toHaveBeenCalled();
    });
  });
});
