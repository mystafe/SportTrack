/**
 * Tests for useCloudSync hook
 */

import { renderHook, act, waitFor } from '@/test-utils';
import { useCloudSync } from '@/hooks/useCloudSync';
import { cloudSyncService } from '@/lib/cloudSync/syncService';

// Mock cloudSyncService
jest.mock('@/lib/cloudSync/syncService', () => ({
  cloudSyncService: {
    isConfigured: jest.fn(() => true),
    uploadToCloud: jest.fn(),
    downloadFromCloud: jest.fn(),
    setUserId: jest.fn(),
    cleanup: jest.fn(),
  },
}));

// Mock useOnlineStatus
jest.mock('@/hooks/useOnlineStatus', () => ({
  useOnlineStatus: jest.fn(() => ({ isOnline: true })),
}));

describe('useCloudSync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (cloudSyncService.isConfigured as jest.Mock).mockReturnValue(true);
  });

  it('should initialize with idle status', async () => {
    const { result } = renderHook(() => useCloudSync());

    await waitFor(() => {
      expect(result.current.syncState.status).toBe('idle');
    });
  });

  it('should return syncToCloud function', async () => {
    const { result } = renderHook(() => useCloudSync());

    await waitFor(() => {
      expect(result.current.syncToCloud).toBeDefined();
      expect(typeof result.current.syncToCloud).toBe('function');
    });
  });

  it('should return syncFromCloud function', async () => {
    const { result } = renderHook(() => useCloudSync());

    await waitFor(() => {
      expect(result.current.syncFromCloud).toBeDefined();
      expect(typeof result.current.syncFromCloud).toBe('function');
    });
  });

  it('should set status to syncing when syncToCloud is called', async () => {
    (cloudSyncService.uploadToCloud as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    const { result } = renderHook(() => useCloudSync());

    await waitFor(() => {
      expect(result.current.syncState.status).toBe('idle');
    });

    const mockData = {
      activities: [],
      settings: null,
      badges: [],
      challenges: [],
    };

    act(() => {
      result.current.syncToCloud(mockData);
    });

    await waitFor(() => {
      expect(result.current.syncState.status).toBe('syncing');
    });
  });

  it('should set status to synced after successful syncToCloud', async () => {
    (cloudSyncService.uploadToCloud as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useCloudSync());

    await waitFor(() => {
      expect(result.current.syncState.status).toBe('idle');
    });

    const mockData = {
      activities: [],
      settings: null,
      badges: [],
      challenges: [],
    };

    await act(async () => {
      await result.current.syncToCloud(mockData);
    });

    await waitFor(() => {
      expect(result.current.syncState.status).toBe('synced');
    });
  });

  it('should set status to error after failed syncToCloud', async () => {
    const error = new Error('Sync failed');
    (cloudSyncService.uploadToCloud as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useCloudSync());

    await waitFor(() => {
      expect(result.current.syncState.status).toBe('idle');
    });

    const mockData = {
      activities: [],
      settings: null,
      badges: [],
      challenges: [],
    };

    await act(async () => {
      try {
        await result.current.syncToCloud(mockData);
      } catch (e) {
        // Expected error
      }
    });

    await waitFor(() => {
      expect(result.current.syncState.status).toBe('error');
      expect(result.current.syncState.error).toContain('Sync failed');
    });
  });

  it('should set status to syncing when syncFromCloud is called', async () => {
    (cloudSyncService.downloadFromCloud as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    const { result } = renderHook(() => useCloudSync());

    await waitFor(() => {
      expect(result.current.syncState.status).toBe('idle');
    });

    act(() => {
      result.current.syncFromCloud();
    });

    await waitFor(() => {
      expect(result.current.syncState.status).toBe('syncing');
    });
  });

  it('should set status to synced after successful syncFromCloud', async () => {
    const mockData = {
      activities: [],
      settings: null,
      badges: [],
      challenges: [],
      metadata: {
        lastModified: new Date().toISOString(),
        version: '1.0',
      },
    };
    (cloudSyncService.downloadFromCloud as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useCloudSync());

    await waitFor(() => {
      expect(result.current.syncState.status).toBe('idle');
    });

    await act(async () => {
      await result.current.syncFromCloud();
    });

    await waitFor(() => {
      expect(result.current.syncState.status).toBe('synced');
    });
  });

  it('should reset status to idle after 3 seconds when synced', async () => {
    (cloudSyncService.uploadToCloud as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useCloudSync());

    await waitFor(() => {
      expect(result.current.syncState.status).toBe('idle');
    });

    const mockData = {
      activities: [],
      settings: null,
      badges: [],
      challenges: [],
    };

    await act(async () => {
      await result.current.syncToCloud(mockData);
    });

    await waitFor(() => {
      expect(result.current.syncState.status).toBe('synced');
    });

    // Wait for auto-reset (3 seconds)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 3100));
    });

    await waitFor(() => {
      expect(result.current.syncState.status).toBe('idle');
    });
  }, 10000); // Increase timeout for this test
});
