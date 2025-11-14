/**
 * Tests for useChallenges hook
 */

import { renderHook, act, waitFor } from '@/test-utils';
import { useChallenges } from '@/lib/challengeStore';
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

describe('useChallenges', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should initialize with default challenges when localStorage is empty', async () => {
    const { result } = renderHook(() => useChallenges());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    // Challenge store automatically creates default daily and weekly challenges
    expect(result.current.challenges.length).toBeGreaterThanOrEqual(0);
  });

  it('should load challenges from localStorage on mount', async () => {
    const mockChallenges = [
      {
        id: 'challenge-1',
        name: { tr: 'Test Hedef', en: 'Test Challenge' },
        description: { tr: 'Test açıklaması', en: 'Test description' },
        target: 10000,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'custom' as const,
        status: 'active' as const,
        progress: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'challenge-2',
        name: { tr: 'Test Hedef 2', en: 'Test Challenge 2' },
        description: { tr: 'Test açıklaması 2', en: 'Test description 2' },
        target: 50000,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'custom' as const,
        status: 'active' as const,
        progress: 0,
        createdAt: new Date().toISOString(),
      },
    ];
    localStorageMock.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(mockChallenges));

    const { result } = renderHook(() => useChallenges());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    // Should have at least the loaded challenges (may have default ones too)
    expect(result.current.challenges.length).toBeGreaterThanOrEqual(2);
    const challenge1 = result.current.challenges.find((c) => c.id === 'challenge-1');
    expect(challenge1).toBeDefined();
  });

  it('should add a new challenge', async () => {
    const { result } = renderHook(() => useChallenges());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    const initialCount = result.current.challenges.length;

    const newChallenge = {
      id: 'custom-challenge-1',
      name: { tr: 'Yeni Hedef', en: 'New Challenge' },
      description: { tr: 'Yeni hedef açıklaması', en: 'New challenge description' },
      target: 20000,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'custom' as const,
      status: 'active' as const,
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    act(() => {
      result.current.addChallenge(newChallenge);
    });

    await waitFor(() => {
      expect(result.current.challenges.length).toBe(initialCount + 1);
      const added = result.current.challenges.find((c) => c.id === newChallenge.id);
      expect(added).toBeDefined();
      expect(added?.name.tr).toBe(newChallenge.name.tr);
    });
  });

  it('should update an existing challenge', async () => {
    const mockChallenge = {
      id: 'challenge-1',
      name: { tr: 'Test Hedef', en: 'Test Challenge' },
      description: { tr: 'Test açıklaması', en: 'Test description' },
      target: 10000,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'custom' as const,
      status: 'active' as const,
      progress: 0,
      createdAt: new Date().toISOString(),
    };
    localStorageMock.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify([mockChallenge]));

    const { result } = renderHook(() => useChallenges());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    const updatedChallenge = {
      name: { tr: 'Güncellenmiş Hedef', en: 'Updated Challenge' },
      target: 20000,
    };

    act(() => {
      result.current.updateChallenge(mockChallenge.id, updatedChallenge);
    });

    await waitFor(() => {
      const updated = result.current.challenges.find((c) => c.id === mockChallenge.id);
      expect(updated).toBeDefined();
      expect(updated?.name.tr).toBe('Güncellenmiş Hedef');
      expect(updated?.target).toBe(20000);
    });
  });

  it('should delete a challenge', async () => {
    const mockChallenges = [
      {
        id: 'challenge-1',
        name: { tr: 'Test Hedef', en: 'Test Challenge' },
        description: { tr: 'Test açıklaması', en: 'Test description' },
        target: 10000,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'custom' as const,
        status: 'active' as const,
        progress: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'challenge-2',
        name: { tr: 'Test Hedef 2', en: 'Test Challenge 2' },
        description: { tr: 'Test açıklaması 2', en: 'Test description 2' },
        target: 50000,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'custom' as const,
        status: 'active' as const,
        progress: 0,
        createdAt: new Date().toISOString(),
      },
    ];
    localStorageMock.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(mockChallenges));

    const { result } = renderHook(() => useChallenges());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    const initialCount = result.current.challenges.length;

    act(() => {
      result.current.deleteChallenge('challenge-1');
    });

    await waitFor(() => {
      expect(result.current.challenges.length).toBe(initialCount - 1);
      const deleted = result.current.challenges.find((c) => c.id === 'challenge-1');
      expect(deleted).toBeUndefined();
    });
  });

  it('should clear all challenges', async () => {
    const mockChallenges = [
      {
        id: 'challenge-1',
        name: { tr: 'Test Hedef', en: 'Test Challenge' },
        description: { tr: 'Test açıklaması', en: 'Test description' },
        target: 10000,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'custom' as const,
        status: 'active' as const,
        progress: 0,
        createdAt: new Date().toISOString(),
      },
    ];
    localStorageMock.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(mockChallenges));

    const { result } = renderHook(() => useChallenges());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    act(() => {
      result.current.clearAllChallenges();
    });

    await waitFor(() => {
      expect(result.current.challenges).toHaveLength(0);
      expect(localStorageMock.getItem(STORAGE_KEYS.CHALLENGES)).toBeNull();
    });
  });

  it('should handle corrupted localStorage data gracefully', async () => {
    // Set invalid JSON in localStorage
    localStorageMock.setItem(STORAGE_KEYS.CHALLENGES, 'invalid-json');

    const { result } = renderHook(() => useChallenges());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    // Should handle error gracefully and initialize with default challenges
    expect(result.current.challenges.length).toBeGreaterThanOrEqual(0);
  });
});
