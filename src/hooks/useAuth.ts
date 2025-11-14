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
        setUser(convertUser(currentUser));
      }
      setLoading(false);

      // Subscribe to auth state changes
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

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const authUser = await signIn(email, password);
      setUser(authUser);
      return authUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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
      return authUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setError(null);
      await signOutUser();
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

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
