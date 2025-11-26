/**
 * Challenges System
 * Daily, weekly, and custom goals/challenges
 */

import { ActivityRecord } from './activityStore';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  parseISO,
  isWithinInterval,
  format,
  subDays,
} from 'date-fns';

/**
 * Get season number from date (0=Spring, 1=Summer, 2=Fall, 3=Winter)
 * date-fns doesn't have getSeason, so we implement it manually
 */
function getSeason(date: Date): 0 | 1 | 2 | 3 {
  const month = date.getMonth(); // 0-11
  // Northern hemisphere seasons:
  // Spring: March (2), April (3), May (4)
  // Summer: June (5), July (6), August (7)
  // Fall: September (8), October (9), November (10)
  // Winter: December (11), January (0), February (1)
  if (month >= 2 && month <= 4) return 0; // Spring
  if (month >= 5 && month <= 7) return 1; // Summer
  if (month >= 8 && month <= 10) return 2; // Fall
  return 3; // Winter
}

export type ChallengeType =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'seasonal'
  | 'activity_specific'
  | 'time_based'
  | 'streak_based'
  | 'custom';
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
  const relevantActivities = activities.filter((activity) => {
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
    daysRemaining,
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
        completedAt: endDate.toISOString(),
      };
    } else {
      return {
        ...challenge,
        status: 'expired',
        progress: progress.current,
      };
    }
  }

  // Check if completed
  if (progress.isCompleted && challenge.status === 'active') {
    return {
      ...challenge,
      status: 'completed',
      progress: progress.current,
      completedAt: now.toISOString(),
    };
  }

  // Update progress
  return {
    ...challenge,
    progress: progress.current,
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
      en: `Today's ${target.toLocaleString('en-US')} points goal`,
    },
    target,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    status: 'active',
    progress: 0,
    createdAt: new Date().toISOString(),
    icon: icon || '🎯',
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
      en: `This week's ${target.toLocaleString('en-US')} points goal`,
    },
    target,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    status: 'active',
    progress: 0,
    createdAt: new Date().toISOString(),
    icon: icon || '📅',
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
      en: `This month's ${target.toLocaleString('en-US')} points goal`,
    },
    target,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    status: 'active',
    progress: 0,
    createdAt: new Date().toISOString(),
    icon: icon || '📆',
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
    icon: icon || '🏆',
  };
}

/**
 * Get default daily challenge (based on user's daily target)
 */
export function getDefaultDailyChallenge(dailyTarget: number): Challenge {
  return createDailyChallenge(
    {
      tr: 'Günlük Hedef',
      en: 'Daily Goal',
    },
    dailyTarget,
    new Date(),
    '⭐'
  );
}

/**
 * Get default weekly challenge (50k points)
 */
export function getDefaultWeeklyChallenge(): Challenge {
  return createWeeklyChallenge(
    {
      tr: 'Haftalık Hedef',
      en: 'Weekly Goal',
    },
    50000,
    new Date(),
    '🔥'
  );
}

/**
 * Create a yearly challenge
 */
export function createYearlyChallenge(
  name: { tr: string; en: string },
  target: number,
  yearStart: Date = new Date(),
  icon?: string
): Challenge {
  const start = startOfYear(yearStart);
  const end = endOfYear(start);

  return {
    id: `yearly-${format(start, 'yyyy')}-${Date.now()}`,
    type: 'yearly',
    name,
    description: {
      tr: `Bu yıl ${target.toLocaleString('tr-TR')} puan hedefi`,
      en: `This year's ${target.toLocaleString('en-US')} points goal`,
    },
    target,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    status: 'active',
    progress: 0,
    createdAt: new Date().toISOString(),
    icon: icon || '📅',
  };
}

/**
 * Create a seasonal challenge
 */
export function createSeasonalChallenge(
  name: { tr: string; en: string },
  target: number,
  seasonStart: Date = new Date(),
  icon?: string
): Challenge {
  const season = getSeason(seasonStart);
  let start: Date;
  let end: Date;

  // Determine season dates (approximate)
  const year = seasonStart.getFullYear();
  switch (season) {
    case 0: // Spring (March 1 - May 31)
      start = new Date(year, 2, 1);
      end = new Date(year, 4, 31);
      break;
    case 1: // Summer (June 1 - August 31)
      start = new Date(year, 5, 1);
      end = new Date(year, 7, 31);
      break;
    case 2: // Fall (September 1 - November 30)
      start = new Date(year, 8, 1);
      end = new Date(year, 10, 30);
      break;
    case 3: // Winter (December 1 - February 28/29)
      start = new Date(year - 1, 11, 1);
      end = new Date(year, 1, 28);
      break;
    default:
      start = startOfMonth(seasonStart);
      end = endOfMonth(start);
  }

  return {
    id: `seasonal-${format(start, 'yyyy-MM')}-${Date.now()}`,
    type: 'seasonal',
    name,
    description: {
      tr: `Bu mevsim ${target.toLocaleString('tr-TR')} puan hedefi`,
      en: `This season's ${target.toLocaleString('en-US')} points goal`,
    },
    target,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    status: 'active',
    progress: 0,
    createdAt: new Date().toISOString(),
    icon: icon || '🍂',
  };
}

/**
 * Create an activity-specific challenge
 */
export function createActivitySpecificChallenge(
  name: { tr: string; en: string },
  description: { tr: string; en: string },
  target: number,
  activityKey: string,
  startDate: Date,
  endDate: Date,
  icon?: string
): Challenge {
  return {
    id: `activity-${activityKey}-${Date.now()}`,
    type: 'activity_specific',
    name,
    description,
    target,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    status: 'active',
    progress: 0,
    createdAt: new Date().toISOString(),
    icon: icon || '🎯',
  };
}

/**
 * Create a time-based challenge (e.g., morning challenge)
 */
export function createTimeBasedChallenge(
  name: { tr: string; en: string },
  description: { tr: string; en: string },
  target: number,
  startHour: number,
  endHour: number,
  startDate: Date,
  endDate: Date,
  icon?: string
): Challenge {
  return {
    id: `time-${startHour}-${endHour}-${Date.now()}`,
    type: 'time_based',
    name,
    description,
    target,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    status: 'active',
    progress: 0,
    createdAt: new Date().toISOString(),
    icon: icon || '⏰',
  };
}

/**
 * Create a streak-based challenge
 */
export function createStreakBasedChallenge(
  name: { tr: string; en: string },
  description: { tr: string; en: string },
  targetDays: number,
  startDate: Date = new Date(),
  icon?: string
): Challenge {
  const end = new Date(startDate);
  end.setDate(end.getDate() + targetDays - 1);

  return {
    id: `streak-${targetDays}-${Date.now()}`,
    type: 'streak_based',
    name,
    description,
    target: targetDays, // For streak challenges, target is number of days
    startDate: startDate.toISOString(),
    endDate: endOfDay(end).toISOString(),
    status: 'active',
    progress: 0,
    createdAt: new Date().toISOString(),
    icon: icon || '🔥',
  };
}

/**
 * Get default seasonal challenge based on current season
 */
export function getDefaultSeasonalChallenge(): Challenge {
  const now = new Date();
  const season = getSeason(now);
  const seasonNames = {
    0: { tr: 'İlkbahar', en: 'Spring' },
    1: { tr: 'Yaz', en: 'Summer' },
    2: { tr: 'Sonbahar', en: 'Fall' },
    3: { tr: 'Kış', en: 'Winter' },
  };
  const seasonName = seasonNames[season as keyof typeof seasonNames];

  return createSeasonalChallenge(
    {
      tr: `${seasonName.tr} Hedefi`,
      en: `${seasonName.en} Goal`,
    },
    200000, // 200K points for the season
    now,
    season === 0 ? '🌸' : season === 1 ? '☀️' : season === 2 ? '🍂' : '❄️'
  );
}

/**
 * Get default yearly challenge
 */
export function getDefaultYearlyChallenge(): Challenge {
  return createYearlyChallenge(
    {
      tr: 'Yıllık Hedef',
      en: 'Yearly Goal',
    },
    1000000, // 1M points for the year
    new Date(),
    '🗓️'
  );
}
