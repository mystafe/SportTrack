import type { ActivityDefinition } from '@/lib/activityConfig';
import type { UserSettings } from '@/lib/settingsStore';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';

export type DummyActivityInput = {
  definition: ActivityDefinition;
  amount: number;
  performedAt: string;
};

/**
 * Helper function to round numbers nicely based on activity type
 */
export function roundAmount(amount: number, activity: ActivityDefinition): number {
  if (activity.unit.includes('adım') || activity.unit.includes('steps')) {
    return Math.round(amount / 100) * 100; // Round to nearest 100 for steps
  } else if (activity.unit.includes('dakika') || activity.unit.includes('minutes')) {
    return Math.round(amount / 5) * 5; // Round to nearest 5 for minutes
  } else if (activity.unit.includes('tekrar') || activity.unit.includes('reps')) {
    return Math.round(amount / 5) * 5; // Round to nearest 5 for reps
  } else if (activity.unit.includes('basamak')) {
    return Math.round(amount / 10) * 10; // Round to nearest 10 for stairs
  }
  return Math.round(amount);
}

/**
 * Helper function to compute points from multiplier and amount
 */
export function computePoints(multiplier: number, amount: number): number {
  return Math.max(0, Math.round(amount * multiplier));
}

/**
 * Get realistic amount for an activity based on its type and multiplier
 * This ensures activities generate appropriate points
 */
export function getRealisticAmount(
  activity: ActivityDefinition,
  intensity: 'low' | 'medium' | 'high' = 'medium'
): number {
  const baseMultiplier = activity.multiplier;
  let targetPoints: number;

  // Determine target points based on intensity
  switch (intensity) {
    case 'low':
      targetPoints = 500 + Math.random() * 1000; // 500-1500 points
      break;
    case 'high':
      targetPoints = 3000 + Math.random() * 5000; // 3000-8000 points
      break;
    case 'medium':
    default:
      targetPoints = 1500 + Math.random() * 2000; // 1500-3500 points
      break;
  }

  // Calculate amount needed to reach target points
  const baseAmount = targetPoints / baseMultiplier;

  // Apply realistic ranges based on activity type
  let amount: number;
  switch (activity.key) {
    case 'WALKING':
      // Walking: 3000-15000 steps (multiplier: 1)
      amount = baseAmount * (0.8 + Math.random() * 0.4);
      amount = Math.max(3000, Math.min(15000, amount));
      break;
    case 'RUNNING':
      // Running: 2000-10000 steps (multiplier: 2)
      amount = baseAmount * (0.8 + Math.random() * 0.4);
      amount = Math.max(2000, Math.min(10000, amount));
      break;
    case 'SWIMMING':
      // Swimming: 15-60 minutes (multiplier: 5)
      amount = baseAmount * (0.8 + Math.random() * 0.4);
      amount = Math.max(15, Math.min(60, amount));
      break;
    case 'PUSH_UP':
      // Push-ups: 20-200 reps (multiplier: 20)
      amount = baseAmount * (0.8 + Math.random() * 0.4);
      amount = Math.max(20, Math.min(200, amount));
      break;
    case 'SIT_UP':
      // Sit-ups: 30-300 reps (multiplier: 10)
      amount = baseAmount * (0.8 + Math.random() * 0.4);
      amount = Math.max(30, Math.min(300, amount));
      break;
    case 'WEIGHT_LIFTING':
      // Weight lifting: 20-120 minutes (multiplier: 10)
      amount = baseAmount * (0.8 + Math.random() * 0.4);
      amount = Math.max(20, Math.min(120, amount));
      break;
    case 'CRUNCH':
      // Crunch/Plank: 30-300 reps (multiplier: 10)
      amount = baseAmount * (0.8 + Math.random() * 0.4);
      amount = Math.max(30, Math.min(300, amount));
      break;
    case 'STAIRS':
      // Stairs: 20-200 steps (multiplier: 50)
      amount = baseAmount * (0.8 + Math.random() * 0.4);
      amount = Math.max(20, Math.min(200, amount));
      break;
    default:
      amount = baseAmount * (0.8 + Math.random() * 0.4);
      break;
  }

  return roundAmount(amount, activity);
}

/**
 * Generate realistic dummy activities for a given day
 */
export function generateDayActivities(
  date: Date,
  dailyTarget: number,
  activities: ActivityDefinition[],
  dayOfWeek: number,
  dayOffset: number
): DummyActivityInput[] {
  const dayActivities: DummyActivityInput[] = [];
  let dailyPoints = 0;
  const isSunday = dayOfWeek === 0;
  const isSaturday = dayOfWeek === 6;
  const isWeekend = isSunday || isSaturday;

  // Determine number of activities based on day type
  let numActivities: number;
  let intensity: 'low' | 'medium' | 'high';

  if (isSunday) {
    // Sunday - Rest day, lighter activities
    numActivities = Math.random() > 0.5 ? 2 : 3;
    intensity = 'low';
  } else if (isSaturday) {
    // Saturday - Active day, more activities
    numActivities = Math.random() > 0.3 ? 4 : 5;
    intensity = 'high';
  } else {
    // Weekdays - Regular activity
    numActivities = Math.random() > 0.3 ? (Math.random() > 0.5 ? 3 : 4) : 5;
    intensity = 'medium';
  }

  // Track used activities for variety
  const usedActivities = new Set<string>();
  const availableActivities = [...activities];

  // Generate activities with varied times
  const timeSlots = [
    { hour: 6, range: 3 }, // Early morning (6-9)
    { hour: 12, range: 2 }, // Noon (12-14)
    { hour: 17, range: 2 }, // Evening (17-19)
    { hour: 20, range: 2 }, // Night (20-22)
    { hour: 22, range: 2 }, // Late night (22-24)
  ];

  for (let i = 0; i < numActivities; i++) {
    // Select activity ensuring variety
    let activity: ActivityDefinition | undefined;
    let attempts = 0;
    do {
      const randomIndex = Math.floor(Math.random() * availableActivities.length);
      activity = availableActivities[randomIndex];
      attempts++;
      if (attempts > 10) break; // Prevent infinite loop
    } while (usedActivities.has(activity.key) && usedActivities.size < availableActivities.length);

    if (!activity) {
      // Fallback: use any available activity
      activity = availableActivities[Math.floor(Math.random() * availableActivities.length)];
    }

    usedActivities.add(activity.key);

    // Determine time slot
    const timeSlot = timeSlots[Math.min(i, timeSlots.length - 1)];
    const hour = timeSlot.hour + Math.floor(Math.random() * timeSlot.range);
    const minute = Math.floor(Math.random() * 60);

    const activityDate = new Date(date);
    activityDate.setHours(hour, minute, 0, 0);

    // Get realistic amount based on activity type and intensity
    let amount = getRealisticAmount(activity, intensity);

    // Adjust for specific activities on specific days
    if (isSaturday && activity.key === 'RUNNING') {
      // More running on Saturdays
      amount = roundAmount(amount * 1.5, activity);
    } else if (isSunday && activity.key === 'WALKING') {
      // More walking on Sundays
      amount = roundAmount(amount * 1.2, activity);
    } else if (!isWeekend && activity.key === 'WEIGHT_LIFTING') {
      // More weight lifting on weekdays
      amount = roundAmount(amount * 1.3, activity);
    }

    const points = computePoints(activity.multiplier, amount);
    dailyPoints += points;

    dayActivities.push({
      definition: activity,
      amount,
      performedAt: activityDate.toISOString(),
    });
  }

  // Ensure daily target is met (for streak badges)
  if (dailyPoints < dailyTarget) {
    const walkingActivity = activities.find((a) => a.key === 'WALKING');
    if (walkingActivity) {
      const neededPoints = dailyTarget - dailyPoints;
      const extraAmount = roundAmount(
        neededPoints / walkingActivity.multiplier + 1000,
        walkingActivity
      );
      const extraDate = new Date(date);
      extraDate.setHours(18 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0);

      dayActivities.push({
        definition: walkingActivity,
        amount: extraAmount,
        performedAt: extraDate.toISOString(),
      });
      dailyPoints += computePoints(walkingActivity.multiplier, extraAmount);
    }
  }

  // For Saturday, ensure we exceed target for weekend warrior badge
  if (isSaturday && dailyPoints < dailyTarget * 1.5) {
    const runningActivity = activities.find((a) => a.key === 'RUNNING');
    if (runningActivity) {
      const neededPoints = dailyTarget * 1.5 - dailyPoints;
      const extraAmount = roundAmount(
        neededPoints / runningActivity.multiplier + 2000,
        runningActivity
      );
      const extraDate = new Date(date);
      extraDate.setHours(19 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0);

      dayActivities.push({
        definition: runningActivity,
        amount: extraAmount,
        performedAt: extraDate.toISOString(),
      });
    }
  }

  return dayActivities;
}

/**
 * Generate comprehensive dummy data for the last N days
 */
export function generateDummyData(
  totalDays: number,
  settings: UserSettings | null,
  activities: ActivityDefinition[]
): DummyActivityInput[] {
  const now = new Date();
  const allActivities: DummyActivityInput[] = [];
  const dailyTarget = settings?.dailyTarget || DEFAULT_DAILY_TARGET;

  for (let dayOffset = 0; dayOffset < totalDays; dayOffset++) {
    const baseDate = new Date(now);
    baseDate.setDate(baseDate.getDate() - dayOffset);
    baseDate.setHours(0, 0, 0, 0);
    const dayOfWeek = baseDate.getDay();

    const dayActivities = generateDayActivities(
      baseDate,
      dailyTarget,
      activities,
      dayOfWeek,
      dayOffset
    );

    allActivities.push(...dayActivities);
  }

  return allActivities;
}
