/**
 * Tests for useAutoSync hook
 */

import { renderHook, act, waitFor } from '@/test-utils';
import { useAutoSync } from '@/hooks/useAutoSync';
import { useCloudSync } from '@/hooks/useCloudSync';
import { useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { useBadges } from '@/lib/badgeStore';
import { useChallenges } from '@/lib/challengeStore';

// Mock dependencies
jest.mock('@/hooks/useCloudSync');
jest.mock('@/lib/activityStore');
jest.mock('@/lib/settingsStore');
jest.mock('@/lib/badgeStore');
jest.mock('@/lib/challengeStore');
jest.mock('@/hooks/useAuth');
jest.mock('@/components/Toaster');
jest.mock('@/lib/i18n');

describe('useAutoSync', () => {
  const mockSyncToCloud = jest.fn();
  const mockActivities = [
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
      note: null,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    (useCloudSync as jest.Mock).mockReturnValue({
      syncToCloud: mockSyncToCloud,
    });

    (useActivities as jest.Mock).mockReturnValue({
      activities: mockActivities,
      hydrated: true,
    });

    (useSettings as jest.Mock).mockReturnValue({
      settings: { name: 'Test', dailyTarget: 10000 },
      hydrated: true,
    });

    (useBadges as jest.Mock).mockReturnValue({
      badges: [],
      hydrated: true,
    });

    (useChallenges as jest.Mock).mockReturnValue({
      challenges: [],
      hydrated: true,
    });

    const { useAuth } = require('@/hooks/useAuth');
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isConfigured: true,
    });

    const { useToaster } = require('@/components/Toaster');
    useToaster.mockReturnValue({
      showToast: jest.fn(),
    });

    const { useI18n } = require('@/lib/i18n');
    useI18n.mockReturnValue({
      t: (key: string) => key,
      lang: 'en',
    });
  });

  it('should initialize without errors', () => {
    const { result } = renderHook(() => useAutoSync());

    expect(result.current).toBeDefined();
    expect(result.current.flushPendingSync).toBeDefined();
  });

  it('should trigger sync when activity is added', async () => {
    const { result, rerender } = renderHook(() => useAutoSync());

    // Set initial sync complete flag
    localStorage.setItem('sporttrack_initial_sync_complete', 'true');

    // Wait for initial setup
    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    // Update activities (simulate adding a new activity)
    (useActivities as jest.Mock).mockReturnValue({
      activities: [
        ...mockActivities,
        {
          id: '2',
          activityKey: 'RUNNING',
          label: 'Running',
          icon: '🏃',
          unit: 'steps',
          multiplier: 2,
          amount: 500,
          points: 1000,
          performedAt: new Date().toISOString(),
          note: null,
        },
      ],
      hydrated: true,
    });

    rerender();

    // Wait for debounced sync (2 seconds)
    await waitFor(
      () => {
        expect(mockSyncToCloud).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );
  });

  it('should trigger sync when activity is edited', async () => {
    const { result, rerender } = renderHook(() => useAutoSync());

    localStorage.setItem('sporttrack_initial_sync_complete', 'true');

    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    // Edit activity (change amount)
    (useActivities as jest.Mock).mockReturnValue({
      activities: [
        {
          ...mockActivities[0],
          amount: 2000, // Changed amount
          points: 2000, // Changed points
        },
      ],
      hydrated: true,
    });

    rerender();

    // Wait for debounced sync
    await waitFor(
      () => {
        expect(mockSyncToCloud).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );
  });

  it('should trigger sync when activity is deleted', async () => {
    const { result, rerender } = renderHook(() => useAutoSync());

    localStorage.setItem('sporttrack_initial_sync_complete', 'true');

    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    // Delete activity (empty array)
    (useActivities as jest.Mock).mockReturnValue({
      activities: [],
      hydrated: true,
    });

    rerender();

    // Wait for debounced sync
    await waitFor(
      () => {
        expect(mockSyncToCloud).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );
  });

  it('should not sync if initial sync is not complete', async () => {
    const { result } = renderHook(() => useAutoSync());

    // Don't set initial sync complete flag
    localStorage.removeItem('sporttrack_initial_sync_complete');

    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    // Update activities
    (useActivities as jest.Mock).mockReturnValue({
      activities: [...mockActivities, { id: '2', ...mockActivities[0] }],
      hydrated: true,
    });

    // Wait a bit
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Should not sync
    expect(mockSyncToCloud).not.toHaveBeenCalled();
  });

  it('should flush pending sync immediately', async () => {
    mockSyncToCloud.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAutoSync());

    localStorage.setItem('sporttrack_initial_sync_complete', 'true');

    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    // Trigger a change
    (useActivities as jest.Mock).mockReturnValue({
      activities: [...mockActivities, { id: '2', ...mockActivities[0] }],
      hydrated: true,
    });

    // Flush immediately
    await act(async () => {
      await result.current.flushPendingSync();
    });

    // Should sync immediately
    expect(mockSyncToCloud).toHaveBeenCalled();
  });
});
