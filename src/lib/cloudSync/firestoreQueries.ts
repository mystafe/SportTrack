/**
 * Firestore Query Utilities
 * Helper functions for querying aggregated data from Firestore
 */

import { db } from '@/lib/firebase/config';
import { doc, getDoc, collection, query, where, getDocs, sum } from 'firebase/firestore';
import type { ActivityRecord } from '@/lib/activityStore';

/**
 * Get total points for a user from Firestore
 * Method 1: Fetch document and calculate client-side (for nested arrays)
 */
export async function getTotalPointsFromFirestore(userId: string): Promise<number> {
  if (!db) {
    throw new Error('Firebase not configured');
  }

  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return 0;
    }

    const data = userDocSnap.data();
    const activities = (data.activities || []) as ActivityRecord[];

    // Calculate total points from activities array
    const totalPoints = activities.reduce((sum, activity) => {
      return sum + (activity.points || 0);
    }, 0);

    return totalPoints;
  } catch (error) {
    console.error('Failed to get total points from Firestore:', error);
    throw error;
  }
}

/**
 * Get total points for today
 */
export async function getTodayPointsFromFirestore(userId: string): Promise<number> {
  if (!db) {
    throw new Error('Firebase not configured');
  }

  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return 0;
    }

    const data = userDocSnap.data();
    const activities = (data.activities || []) as ActivityRecord[];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter today's activities and sum points
    const todayPoints = activities
      .filter((activity) => {
        const activityDate = new Date(activity.performedAt);
        activityDate.setHours(0, 0, 0, 0);
        return activityDate.getTime() === today.getTime();
      })
      .reduce((sum, activity) => sum + (activity.points || 0), 0);

    return todayPoints;
  } catch (error) {
    console.error('Failed to get today points from Firestore:', error);
    throw error;
  }
}

/**
 * Get total points for a date range
 */
export async function getPointsInDateRangeFromFirestore(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  if (!db) {
    throw new Error('Firebase not configured');
  }

  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return 0;
    }

    const data = userDocSnap.data();
    const activities = (data.activities || []) as ActivityRecord[];

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Filter activities in date range and sum points
    const rangePoints = activities
      .filter((activity) => {
        const activityDate = new Date(activity.performedAt);
        return activityDate >= start && activityDate <= end;
      })
      .reduce((sum, activity) => sum + (activity.points || 0), 0);

    return rangePoints;
  } catch (error) {
    console.error('Failed to get points in date range from Firestore:', error);
    throw error;
  }
}

/**
 * Get points grouped by activity type
 */
export async function getPointsByActivityTypeFromFirestore(
  userId: string
): Promise<Map<string, number>> {
  if (!db) {
    throw new Error('Firebase not configured');
  }

  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return new Map();
    }

    const data = userDocSnap.data();
    const activities = (data.activities || []) as ActivityRecord[];

    // Group points by activity key
    const pointsByType = new Map<string, number>();
    activities.forEach((activity) => {
      const key = activity.activityKey;
      const current = pointsByType.get(key) || 0;
      pointsByType.set(key, current + (activity.points || 0));
    });

    return pointsByType;
  } catch (error) {
    console.error('Failed to get points by activity type from Firestore:', error);
    throw error;
  }
}

/**
 * Get points statistics (total, today, this week, this month)
 */
export interface PointsStatistics {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export async function getPointsStatisticsFromFirestore(userId: string): Promise<PointsStatistics> {
  if (!db) {
    throw new Error('Firebase not configured');
  }

  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return {
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
      };
    }

    const data = userDocSnap.data();
    const activities = (data.activities || []) as ActivityRecord[];

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    monthAgo.setHours(0, 0, 0, 0);

    let total = 0;
    let todayPoints = 0;
    let weekPoints = 0;
    let monthPoints = 0;

    activities.forEach((activity) => {
      const points = activity.points || 0;
      const activityDate = new Date(activity.performedAt);

      total += points;

      if (activityDate >= today) {
        todayPoints += points;
      }

      if (activityDate >= weekAgo) {
        weekPoints += points;
      }

      if (activityDate >= monthAgo) {
        monthPoints += points;
      }
    });

    return {
      total,
      today: todayPoints,
      thisWeek: weekPoints,
      thisMonth: monthPoints,
    };
  } catch (error) {
    console.error('Failed to get points statistics from Firestore:', error);
    throw error;
  }
}
