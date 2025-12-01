/**
 * Request Deduplication Hook
 * Prevents duplicate API calls and caches responses
 */

import { useRef, useCallback } from 'react';

interface PendingRequest<T> {
  promise: Promise<T>;
  timestamp: number;
}

const requestCache = new Map<string, PendingRequest<any>>();
const CACHE_DURATION = 5000; // 5 seconds

export function useRequestDeduplication<T>(
  key: string,
  requestFn: () => Promise<T>,
  cacheDuration: number = CACHE_DURATION
): () => Promise<T> {
  const cacheKey = useRef(key);

  return useCallback(async () => {
    const now = Date.now();
    const cached = requestCache.get(cacheKey.current);

    // Return cached promise if still valid
    if (cached && now - cached.timestamp < cacheDuration) {
      return cached.promise;
    }

    // Create new request
    const promise = requestFn().catch((error) => {
      // Remove from cache on error
      requestCache.delete(cacheKey.current);
      throw error;
    });

    // Cache the promise
    requestCache.set(cacheKey.current, {
      promise,
      timestamp: now,
    });

    return promise;
  }, [cacheKey.current, requestFn, cacheDuration]);
}

/**
 * Clear request cache (useful for testing or manual cache invalidation)
 */
export function clearRequestCache(key?: string) {
  if (key) {
    requestCache.delete(key);
  } else {
    requestCache.clear();
  }
}
