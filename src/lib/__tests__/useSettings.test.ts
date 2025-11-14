/**
 * Tests for useSettings hook
 */

import { renderHook, act, waitFor } from '@/test-utils';
import { useSettings } from '@/lib/settingsStore';
import { STORAGE_KEYS } from '@/lib/constants';
import { createMockSettings } from '@/test-helpers';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useSettings', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should initialize with null settings when localStorage is empty', async () => {
    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    // Settings hook returns null when localStorage is empty (no default settings)
    expect(result.current.settings).toBeNull();
  });

  it('should load settings from localStorage on mount', async () => {
    const mockSettings = createMockSettings();
    localStorageMock.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(mockSettings));

    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    expect(result.current.settings?.name).toBe(mockSettings.name);
    expect(result.current.settings?.dailyTarget).toBe(mockSettings.dailyTarget);
  });

  it('should update settings', async () => {
    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    act(() => {
      result.current.saveSettings({
        name: 'Test User',
        dailyTarget: 15000,
        customActivities: [],
        mood: 'happy',
      });
    });

    await waitFor(() => {
      expect(result.current.settings?.name).toBe('Test User');
      expect(result.current.settings?.dailyTarget).toBe(15000);
      expect(result.current.settings?.mood).toBe('happy');
    });
  });

  it('should persist settings to localStorage', async () => {
    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    act(() => {
      result.current.saveSettings({
        name: 'Test User',
        dailyTarget: 15000,
        customActivities: [],
        mood: null,
      });
    });

    await waitFor(() => {
      const stored = localStorageMock.getItem(STORAGE_KEYS.SETTINGS);
      expect(stored).toBeTruthy();
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.name).toBe('Test User');
        expect(parsed.dailyTarget).toBe(15000);
      }
    });
  });

  it('should handle corrupted localStorage data gracefully', async () => {
    // Set invalid JSON in localStorage
    localStorageMock.setItem(STORAGE_KEYS.SETTINGS, 'invalid-json');

    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    // Should handle error gracefully and initialize with null (no default settings)
    expect(result.current.settings).toBeNull();
  });

  it('should handle mood changes correctly', async () => {
    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    act(() => {
      result.current.saveSettings({
        name: 'Test',
        dailyTarget: 10000,
        customActivities: [],
        mood: 'happy',
      });
    });

    await waitFor(() => {
      expect(result.current.settings?.mood).toBe('happy');
    });

    act(() => {
      result.current.saveSettings({
        name: 'Test',
        dailyTarget: 10000,
        customActivities: [],
        mood: null,
      });
    });

    await waitFor(() => {
      expect(result.current.settings?.mood).toBeNull();
    });
  });
});
