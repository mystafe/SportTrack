/**
 * Challenges System
 * Daily, weekly, and custom goals/challenges
 */

import { ActivityRecord } from './activityStore';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO, isWithinInterval, format } from 'date-fns';

export type ChallengeType = 'daily' | 'weekly' | 'monthly' | 'custom';
export type ChallengeStatus = 'active' | 'completed' | 'failed' | 'expired';

export interface Challenge {
  id: string;
  type: ChallengeType;
  name: { tr: string; en: string };
  description: { tr: string; en: string };
  target: number; // Target points
  startDate: string; // ISO string
  endDate?: string; // ISO string (for custom challenges)
  status: ChallengeStatus;
  progress: number; // Current progress (points)
  completedAt?: string; // ISO string
  createdAt: string; // ISO string
  icon?: string;
}

export interface ChallengeProgress {
  current: number;
  target: number;
  percentage: number;
  isCompleted: boolean;
  daysRemaining?: number;
}

/**
 * Calculate progress for a challenge
 */
export function calculateChallengeProgress(
  challenge: Challenge,
  activities: ActivityRecord[]
): ChallengeProgress {
  const start = parseISO(challenge.startDate);
  const end = challenge.endDate ? parseISO(challenge.endDate) : new Date();
  
  // Filter activities within challenge period
  const relevantActivities = activities.filter(activity => {
    const activityDate = parseISO(activity.performedAt);
    return isWithinInterval(activityDate, { start, end });
  });

  const current = relevantActivities.reduce((sum, a) => sum + a.points, 0);
  const target = challenge.target;
  const percentage = target > 0 ? Math.min(100, (current / target) * 100) : 0;
  const isCompleted = current >= target;

  // Calculate days remaining for active challenges
  let daysRemaining: number | undefined;
  if (challenge.status === 'active' && challenge.endDate) {
    const endDate = parseISO(challenge.endDate);
    const today = startOfDay(new Date());
    const days = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    daysRemaining = Math.max(0, days);
  }

  return {
    current,
    target,
    percentage,
    isCompleted,
    daysRemaining
  };
}

/**
 * Check and update challenge status
 */
export function updateChallengeStatus(
  challenge: Challenge,
  progress: ChallengeProgress
): Challenge {
  const now = new Date();
  const endDate = challenge.endDate ? parseISO(challenge.endDate) : null;

  // Check if expired
  if (endDate && now > endDate && challenge.status === 'active') {
    if (progress.isCompleted) {
      return {
        ...challenge,
        status: 'completed',
        progress: progress.current,
        completedAt: endDate.toISOString()
      };
    } else {
      return {
        ...challenge,
        status: 'expired',
        progress: progress.current
      };
    }
  }

  // Check if completed
  if (progress.isCompleted && challenge.status === 'active') {
    return {
      ...challenge,
      status: 'completed',
      progress: progress.current,
      completedAt: now.toISOString()
    };
  }

  // Update progress
  return {
    ...challenge,
    progress: progress.current
  };
}

/**
 * Create a daily challenge
 */
export function createDailyChallenge(
  name: { tr: string; en: string },
  target: number,
  date: Date = new Date(),
  icon?: string
): Challenge {
  const start = startOfDay(date);
  const end = endOfDay(date);

  return {
    id: `daily-${format(start, 'yyyy-MM-dd')}-${Date.now()}`,
    type: 'daily',
    name,
    description: {
      tr: `Bugün ${target.toLocaleString('tr-TR')} puan hedefi`,
      en: `Today's ${target.toLocaleString('en-US')} points goal`
    },
    target,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    status: 'active',
    progress: 0,
    createdAt: new Date().toISOString(),
    icon: icon || '🎯'
  };
}

/**
 * Create a weekly challenge
 */
export function createWeeklyChallenge(
  name: { tr: string; en: string },
  target: number,
  weekStart: Date = new Date(),
  icon?: string
): Challenge {
  const start = startOfWeek(weekStart, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(start, { weekStartsOn: 1 });

  return {
    id: `weekly-${format(start, 'yyyy-MM-dd')}-${Date.now()}`,
    type: 'weekly',
    name,
    description: {
      tr: `Bu hafta ${target.toLocaleString('tr-TR')} puan hedefi`,
      en: `This week's ${target.toLocaleString('en-US')} points goal`
    },
    target,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    status: 'active',
    progress: 0,
    createdAt: new Date().toISOString(),
    icon: icon || '📅'
  };
}

/**
 * Create a monthly challenge
 */
export function createMonthlyChallenge(
  name: { tr: string; en: string },
  target: number,
  monthStart: Date = new Date(),
  icon?: string
): Challenge {
  const start = startOfMonth(monthStart);
  const end = endOfMonth(start);

  return {
    id: `monthly-${format(start, 'yyyy-MM')}-${Date.now()}`,
    type: 'monthly',
    name,
    description: {
      tr: `Bu ay ${target.toLocaleString('tr-TR')} puan hedefi`,
      en: `This month's ${target.toLocaleString('en-US')} points goal`
    },
    target,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    status: 'active',
    progress: 0,
    createdAt: new Date().toISOString(),
    icon: icon || '📆'
  };
}

/**
 * Create a custom challenge
 */
export function createCustomChallenge(
  name: { tr: string; en: string },
  description: { tr: string; en: string },
  target: number,
  startDate: Date,
  endDate: Date,
  icon?: string
): Challenge {
  return {
    id: `custom-${Date.now()}`,
    type: 'custom',
    name,
    description,
    target,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    status: 'active',
    progress: 0,
    createdAt: new Date().toISOString(),
    icon: icon || '🏆'
  };
}

/**
 * Get default daily challenge (based on user's daily target)
 */
export function getDefaultDailyChallenge(dailyTarget: number): Challenge {
  return createDailyChallenge(
    {
      tr: 'Günlük Hedef',
      en: 'Daily Goal'
    },
    dailyTarget,
    new Date(),
    '⭐'
  );
}

