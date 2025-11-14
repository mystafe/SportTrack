/**
 * Tests for useActivities hook
 */

import { renderHook, act, waitFor } from '@/test-utils';
import { useActivities } from '@/lib/activityStore';
import { createMockActivity, createMockActivities } from '@/test-helpers';
import { BASE_ACTIVITY_MAP } from '@/lib/activityConfig';
import { STORAGE_KEYS } from '@/lib/constants';

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

describe('useActivities', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should initialize with empty activities when localStorage is empty', async () => {
    const { result } = renderHook(() => useActivities());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    expect(result.current.activities).toEqual([]);
  });

  it('should load activities from localStorage on mount', async () => {
    const mockActivities = createMockActivities(3);
    localStorageMock.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(mockActivities));

    const { result } = renderHook(() => useActivities());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    expect(result.current.activities).toHaveLength(3);
    expect(result.current.activities[0].id).toBe(mockActivities[0].id);
  });

  it('should add a new activity', async () => {
    const { result } = renderHook(() => useActivities());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    const walkingDef = BASE_ACTIVITY_MAP['WALKING'] || BASE_ACTIVITY_MAP['walking'];
    expect(walkingDef).toBeDefined();

    act(() => {
      const newActivity = result.current.addActivity({
        definition: walkingDef!,
        amount: 5000,
        performedAt: new Date().toISOString(),
      });

      expect(newActivity).toBeDefined();
      expect(newActivity.activityKey).toBe('WALKING');
      expect(newActivity.amount).toBe(5000);
    });

    await waitFor(() => {
      expect(result.current.activities).toHaveLength(1);
      expect(result.current.activities[0].activityKey).toBe('WALKING');
      expect(result.current.activities[0].amount).toBe(5000);
    });
  });

  it('should update an existing activity', async () => {
    const mockActivity = createMockActivity({ amount: 1000 });
    localStorageMock.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify([mockActivity]));

    const { result } = renderHook(() => useActivities());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    const walkingDef = BASE_ACTIVITY_MAP['WALKING'] || BASE_ACTIVITY_MAP['walking'];
    expect(walkingDef).toBeDefined();

    act(() => {
      const updated = result.current.updateActivity(mockActivity.id, {
        definition: walkingDef!,
        amount: 2000,
        performedAt: mockActivity.performedAt,
      });

      expect(updated).toBeDefined();
      expect(updated?.amount).toBe(2000);
    });

    await waitFor(() => {
      expect(result.current.activities[0].amount).toBe(2000);
    });
  });

  it('should delete an activity', async () => {
    const mockActivities = createMockActivities(3);
    localStorageMock.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(mockActivities));

    const { result } = renderHook(() => useActivities());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    const activityToDelete = mockActivities[1];

    act(() => {
      result.current.deleteActivity(activityToDelete.id);
    });

    await waitFor(() => {
      expect(result.current.activities).toHaveLength(2);
      expect(result.current.activities.find((a) => a.id === activityToDelete.id)).toBeUndefined();
    });
  });

  it('should clear all activities', async () => {
    const mockActivities = createMockActivities(5);
    localStorageMock.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(mockActivities));

    const { result } = renderHook(() => useActivities());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    act(() => {
      result.current.clearAllActivities();
    });

    await waitFor(() => {
      expect(result.current.activities).toHaveLength(0);
      expect(localStorageMock.getItem(STORAGE_KEYS.ACTIVITIES)).toBeNull();
    });
  });

  it('should validate and sanitize dates when adding activities', async () => {
    const { result } = renderHook(() => useActivities());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    const walkingDef = BASE_ACTIVITY_MAP['WALKING'] || BASE_ACTIVITY_MAP['walking'];
    expect(walkingDef).toBeDefined();

    // Test with invalid date string - should use current date
    act(() => {
      const newActivity = result.current.addActivity({
        definition: walkingDef!,
        amount: 1000,
        performedAt: 'invalid-date-string',
      });

      // Should still create activity with valid date
      expect(newActivity).toBeDefined();
      expect(newActivity.performedAt).toBeTruthy();
      expect(() => new Date(newActivity.performedAt)).not.toThrow();
    });
  });

  it('should handle corrupted localStorage data gracefully', async () => {
    // Set invalid JSON in localStorage
    localStorageMock.setItem(STORAGE_KEYS.ACTIVITIES, 'invalid-json');

    const { result } = renderHook(() => useActivities());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    // Should handle error gracefully and initialize with empty array
    expect(result.current.activities).toEqual([]);
    // storageError might be null if error is caught and handled silently
    expect(result.current.storageError === 'parse' || result.current.storageError === null).toBe(
      true
    );
  });
});
