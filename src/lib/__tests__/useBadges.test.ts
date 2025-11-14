/**
 * Tests for useBadges hook
 */

import { renderHook, act, waitFor } from '@/test-utils';
import { useBadges } from '@/lib/badgeStore';
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

describe('useBadges', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should initialize with empty badges when localStorage is empty', async () => {
    const { result } = renderHook(() => useBadges());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    expect(result.current.badges).toEqual([]);
  });

  it('should load badges from localStorage on mount', async () => {
    const mockBadges = [
      {
        id: 'first_activity' as const,
        name: { tr: 'İlk Adım', en: 'First Step' },
        description: { tr: 'İlk aktiviteni ekle', en: 'Add your first activity' },
        icon: '🎯',
        category: 'special' as const,
        rarity: 'common' as const,
        unlockedAt: new Date(),
      },
      {
        id: 'streak_7' as const,
        name: { tr: '7 Günlük Seri', en: '7 Day Streak' },
        description: {
          tr: '7 gün üst üste hedefini tamamla',
          en: 'Complete your goal 7 days in a row',
        },
        icon: '🔥',
        category: 'streak' as const,
        rarity: 'common' as const,
        unlockedAt: new Date(),
      },
    ];
    localStorageMock.setItem(STORAGE_KEYS.BADGES, JSON.stringify(mockBadges));

    const { result } = renderHook(() => useBadges());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    expect(result.current.badges).toHaveLength(2);
    expect(result.current.badges[0].id).toBe(mockBadges[0].id);
  });

  it('should unlock a new badge', async () => {
    const { result } = renderHook(() => useBadges());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    const newBadge = {
      id: 'first_activity' as const,
      name: { tr: 'İlk Adım', en: 'First Step' },
      description: { tr: 'İlk aktiviteni ekle', en: 'Add your first activity' },
      icon: '🎯',
      category: 'special' as const,
      rarity: 'common' as const,
    };

    act(() => {
      result.current.unlockBadge(newBadge);
    });

    await waitFor(() => {
      expect(result.current.badges).toHaveLength(1);
      expect(result.current.badges[0].id).toBe(newBadge.id);
    });
  });

  it('should clear all badges', async () => {
    const mockBadges = [
      {
        id: 'first_activity' as const,
        name: { tr: 'İlk Adım', en: 'First Step' },
        description: { tr: 'İlk aktiviteni ekle', en: 'Add your first activity' },
        icon: '🎯',
        category: 'special' as const,
        rarity: 'common' as const,
        unlockedAt: new Date(),
      },
    ];
    localStorageMock.setItem(STORAGE_KEYS.BADGES, JSON.stringify(mockBadges));

    const { result } = renderHook(() => useBadges());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    act(() => {
      result.current.clearAllBadges();
    });

    await waitFor(() => {
      expect(result.current.badges).toHaveLength(0);
      expect(localStorageMock.getItem(STORAGE_KEYS.BADGES)).toBeNull();
    });
  });

  it('should handle corrupted localStorage data gracefully', async () => {
    // Set invalid JSON in localStorage
    localStorageMock.setItem(STORAGE_KEYS.BADGES, 'invalid-json');

    const { result } = renderHook(() => useBadges());

    await waitFor(() => {
      expect(result.current.hydrated).toBe(true);
    });

    // Should handle error gracefully and initialize with empty array
    expect(result.current.badges).toEqual([]);
  });
});
