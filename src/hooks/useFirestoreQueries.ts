/**
 * React Hook for Firestore Queries
 * Provides easy access to Firestore query functions with React hooks
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  getTotalPointsFromFirestore,
  getTodayPointsFromFirestore,
  getPointsInDateRangeFromFirestore,
  getPointsByActivityTypeFromFirestore,
  getPointsStatisticsFromFirestore,
  type PointsStatistics,
} from '@/lib/cloudSync/firestoreQueries';

/**
 * Hook to get total points from Firestore
 */
export function useTotalPoints() {
  const { user, isAuthenticated } = useAuth();
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTotalPoints = useCallback(async () => {
    if (!isAuthenticated || !user?.uid) {
      setTotalPoints(0);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const points = await getTotalPointsFromFirestore(user.uid);
      setTotalPoints(points);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch total points';
      setError(errorMessage);
      console.error('Error fetching total points:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.uid]);

  useEffect(() => {
    fetchTotalPoints();
  }, [fetchTotalPoints]);

  return {
    totalPoints,
    loading,
    error,
    refetch: fetchTotalPoints,
  };
}

/**
 * Hook to get today's points from Firestore
 */
export function useTodayPoints() {
  const { user, isAuthenticated } = useAuth();
  const [todayPoints, setTodayPoints] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodayPoints = useCallback(async () => {
    if (!isAuthenticated || !user?.uid) {
      setTodayPoints(0);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const points = await getTodayPointsFromFirestore(user.uid);
      setTodayPoints(points);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch today points';
      setError(errorMessage);
      console.error('Error fetching today points:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.uid]);

  useEffect(() => {
    fetchTodayPoints();
    // Refresh every minute to get latest data
    const interval = setInterval(fetchTodayPoints, 60000);
    return () => clearInterval(interval);
  }, [fetchTodayPoints]);

  return {
    todayPoints,
    loading,
    error,
    refetch: fetchTodayPoints,
  };
}

/**
 * Hook to get points statistics (total, today, this week, this month)
 */
export function usePointsStatistics() {
  const { user, isAuthenticated } = useAuth();
  const [statistics, setStatistics] = useState<PointsStatistics>({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    if (!isAuthenticated || !user?.uid) {
      setStatistics({
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const stats = await getPointsStatisticsFromFirestore(user.uid);
      setStatistics(stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch statistics';
      setError(errorMessage);
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.uid]);

  useEffect(() => {
    fetchStatistics();
    // Refresh every 5 minutes
    const interval = setInterval(fetchStatistics, 300000);
    return () => clearInterval(interval);
  }, [fetchStatistics]);

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics,
  };
}

/**
 * Hook to get points by activity type
 */
export function usePointsByActivityType() {
  const { user, isAuthenticated } = useAuth();
  const [pointsByType, setPointsByType] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPointsByType = useCallback(async () => {
    if (!isAuthenticated || !user?.uid) {
      setPointsByType(new Map());
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const pointsMap = await getPointsByActivityTypeFromFirestore(user.uid);
      setPointsByType(pointsMap);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch points by type';
      setError(errorMessage);
      console.error('Error fetching points by type:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.uid]);

  useEffect(() => {
    fetchPointsByType();
  }, [fetchPointsByType]);

  return {
    pointsByType,
    loading,
    error,
    refetch: fetchPointsByType,
  };
}

/**
 * Hook to get points in a date range
 */
export function usePointsInDateRange(startDate: Date, endDate: Date) {
  const { user, isAuthenticated } = useAuth();
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPoints = useCallback(async () => {
    if (!isAuthenticated || !user?.uid) {
      setPoints(0);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const rangePoints = await getPointsInDateRangeFromFirestore(user.uid, startDate, endDate);
      setPoints(rangePoints);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch points in range';
      setError(errorMessage);
      console.error('Error fetching points in range:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.uid, startDate, endDate]);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  return {
    points,
    loading,
    error,
    refetch: fetchPoints,
  };
}
