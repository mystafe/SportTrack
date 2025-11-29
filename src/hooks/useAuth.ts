/**
 * Authentication Hook
 * Manages user authentication state
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  signIn,
  signUp,
  signInWithGoogle,
  signOutUser,
  resetPassword,
  onAuthStateChange,
  convertUser,
  getCurrentUser,
  type AuthUser,
} from '@/lib/firebase/auth';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { cloudSyncService } from '@/lib/cloudSync/syncService';
import { batchSyncService } from '@/lib/cloudSync/batchSyncService';
import { STORAGE_KEYS } from '@/lib/constants';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isConfigured = isFirebaseConfigured();

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    // Small delay to ensure Firebase is initialized
    const timer = setTimeout(() => {
      // Get initial user
      const currentUser = getCurrentUser();
      if (currentUser) {
        const authUser = convertUser(currentUser);
        setUser(authUser);
        // Set user ID for cloud sync on initial load
        if (authUser) {
          cloudSyncService.setUserId(authUser.uid);
        } else {
          cloudSyncService.setUserId(null);
        }
      } else {
        cloudSyncService.setUserId(null);
      }
      setLoading(false);

      // Subscribe to auth state changes
      // Note: onAuthStateChange also calls cloudSyncService.setUserId() on changes
      const unsubscribe = onAuthStateChange((authUser) => {
        setUser(authUser);
        setLoading(false);
      });

      return () => {
        unsubscribe();
      };
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [isConfigured]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setError(null);
        setLoading(true);
        const authUser = await signIn(email, password);
        setUser(authUser);

        // After successful login, download data from cloud (don't upload)
        if (authUser && isConfigured) {
          cloudSyncService.setUserId(authUser.uid);

          try {
            // Download cloud data and merge with local
            const cloudData = await cloudSyncService.downloadFromCloud();
            if (cloudData) {
              // Merge cloud data with local (cloud takes precedence)
              if (cloudData.exercises && cloudData.exercises.length > 0) {
                localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(cloudData.exercises));
              }
              if (cloudData.settings) {
                localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(cloudData.settings));
              }
              if (cloudData.badges && cloudData.badges.length > 0) {
                localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(cloudData.badges));
              }
              if (cloudData.challenges && cloudData.challenges.length > 0) {
                localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(cloudData.challenges));
              }

              // Trigger page reload to apply new data
              window.location.reload();
            }
          } catch (downloadError) {
            console.error('Failed to download cloud data on login:', downloadError);
          }
        }

        return authUser;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isConfigured]
  );

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    try {
      setError(null);
      setLoading(true);
      const authUser = await signUp(email, password, displayName);
      setUser(authUser);
      return authUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const authUser = await signInWithGoogle();
      setUser(authUser);

      // After successful login, download data from cloud (don't upload)
      if (authUser && isConfigured) {
        cloudSyncService.setUserId(authUser.uid);

        try {
          // Download cloud data and merge with local
          const cloudData = await cloudSyncService.downloadFromCloud();
          if (cloudData) {
            // Merge cloud data with local (cloud takes precedence)
            if (cloudData.exercises && cloudData.exercises.length > 0) {
              localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(cloudData.exercises));
            }
            if (cloudData.settings) {
              localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(cloudData.settings));
            }
            if (cloudData.badges && cloudData.badges.length > 0) {
              localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(cloudData.badges));
            }
            if (cloudData.challenges && cloudData.challenges.length > 0) {
              localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(cloudData.challenges));
            }

            // Trigger page reload to apply new data
            window.location.reload();
          }
        } catch (downloadError) {
          console.error('Failed to download cloud data on login:', downloadError);
        }
      }

      return authUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isConfigured]);

  const logout = useCallback(async () => {
    try {
      setError(null);

      // Flush pending batch sync before logout
      if (isConfigured && cloudSyncService.isConfigured()) {
        try {
          await batchSyncService.flushBatch();
        } catch (syncError) {
          console.error('Failed to flush batch sync on logout:', syncError);
        }
      }

      await signOutUser();
      setUser(null);
      cloudSyncService.setUserId(null);
      batchSyncService.clear();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      throw err;
    }
  }, [isConfigured]);

  const resetPasswordEmail = useCallback(async (email: string) => {
    try {
      setError(null);
      await resetPassword(email);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isConfigured,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPasswordEmail,
  };
}
