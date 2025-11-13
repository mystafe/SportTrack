/**
 * Personal Records System
 * Track best performances and personal bests
 */

import { ActivityRecord } from './activityStore';
import { startOfDay, parseISO, format, isSameDay } from 'date-fns';

export interface PersonalRecord {
  id: string;
  type: 'points' | 'amount' | 'streak' | 'speed';
  activityKey?: string; // For activity-specific records
  value: number;
  date: string; // ISO string
  label: { tr: string; en: string };
  icon: string;
}

export interface PersonalRecords {
  // Overall records
  bestDay: { points: number; date: string } | null;
  bestWeek: { points: number; startDate: string } | null;
  bestMonth: { points: number; startDate: string } | null;
  longestStreak: { days: number; startDate: string; endDate: string } | null;
  fastestGoalCompletion: { hours: number; date: string } | null;
  
  // Activity-specific records
  activityRecords: Map<string, {
    bestPoints: { value: number; date: string } | null;
    bestAmount: { value: number; date: string } | null;
    totalCount: number;
  }>;
}

/**
 * Calculate all personal records from activities
 */
export function calculatePersonalRecords(
  activities: ActivityRecord[],
  dailyTarget: number
): PersonalRecord[] {
  if (activities.length === 0) return [];

  const records: PersonalRecord[] = [];

  // Group activities by day
  const daysMap = new Map<string, { date: Date; points: number; activities: ActivityRecord[] }>();
  for (const activity of activities) {
    const date = startOfDay(parseISO(activity.performedAt));
    const key = date.toISOString();
    const existing = daysMap.get(key);
    
    if (existing) {
      existing.points += activity.points;
      existing.activities.push(activity);
    } else {
      daysMap.set(key, {
        date,
        points: activity.points,
        activities: [activity]
      });
    }
  }

  const days = Array.from(daysMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime());

  // Best Day (highest daily points)
  if (days.length > 0) {
    const bestDay = days.reduce((best, day) => 
      day.points > best.points ? day : best
    );
    records.push({
      id: 'best-day',
      type: 'points',
      value: bestDay.points,
      date: bestDay.date.toISOString(),
      label: {
        tr: 'En İyi Gün',
        en: 'Best Day'
      },
      icon: '⭐'
    });
  }

  // Longest Streak
  let maxStreak = 0;
  let streakStart: Date | null = null;
  let streakEnd: Date | null = null;
  let currentStreak = 0;
  let currentStart: Date | null = null;

  for (const day of days) {
    if (day.points >= dailyTarget) {
      if (currentStreak === 0) {
        currentStart = day.date;
      }
      currentStreak++;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
        streakStart = currentStart!;
        streakEnd = day.date;
      }
    } else {
      currentStreak = 0;
      currentStart = null;
    }
  }

  if (maxStreak > 0 && streakStart && streakEnd) {
    records.push({
      id: 'longest-streak',
      type: 'streak',
      value: maxStreak,
      date: streakStart.toISOString(),
      label: {
        tr: 'En Uzun Seri',
        en: 'Longest Streak'
      },
      icon: '🔥'
    });
  }

  // Fastest Goal Completion (earliest time of day when goal was reached)
  const fastestCompletions: Array<{ hours: number; date: string }> = [];
  
  for (const day of days) {
    if (day.points >= dailyTarget) {
      // Find the earliest activity that completed the goal
      const sortedActivities = [...day.activities].sort((a, b) => 
        parseISO(a.performedAt).getTime() - parseISO(b.performedAt).getTime()
      );
      
      let cumulativePoints = 0;
      for (const activity of sortedActivities) {
        cumulativePoints += activity.points;
        if (cumulativePoints >= dailyTarget) {
          const activityDate = parseISO(activity.performedAt);
          const dayStart = startOfDay(activityDate);
          const hours = (activityDate.getTime() - dayStart.getTime()) / (1000 * 60 * 60);
          fastestCompletions.push({
            hours,
            date: activityDate.toISOString()
          });
          break;
        }
      }
    }
  }

  if (fastestCompletions.length > 0) {
    const fastest = fastestCompletions.reduce((best, current) =>
      current.hours < best.hours ? current : best
    );
    records.push({
      id: 'fastest-goal',
      type: 'speed',
      value: Math.round(fastest.hours * 10) / 10, // Round to 1 decimal
      date: fastest.date,
      label: {
        tr: 'En Hızlı Hedef Tamamlama',
        en: 'Fastest Goal Completion'
      },
      icon: '⚡'
    });
  }

  // Activity-specific records
  const activityMap = new Map<string, ActivityRecord[]>();
  for (const activity of activities) {
    const key = activity.activityKey;
    const existing = activityMap.get(key) || [];
    existing.push(activity);
    activityMap.set(key, existing);
  }

  for (const [activityKey, activityList] of activityMap.entries()) {
    if (activityList.length === 0) continue;

    // Best points for this activity
    const bestPoints = activityList.reduce((best, current) =>
      current.points > best.points ? current : best
    );

    // Best amount for this activity
    const bestAmount = activityList.reduce((best, current) =>
      current.amount > best.amount ? current : best
    );

    records.push({
      id: `activity-${activityKey}-points`,
      type: 'points',
      activityKey,
      value: bestPoints.points,
      date: bestPoints.performedAt,
      label: {
        tr: `${activityList[0].label} - En Yüksek Puan`,
        en: `${activityList[0].labelEn || activityList[0].label} - Best Points`
      },
      icon: activityList[0].icon || '🏃'
    });

    records.push({
      id: `activity-${activityKey}-amount`,
      type: 'amount',
      activityKey,
      value: bestAmount.amount,
      date: bestAmount.performedAt,
      label: {
        tr: `${activityList[0].label} - En Yüksek Miktar`,
        en: `${activityList[0].labelEn || activityList[0].label} - Best Amount`
      },
      icon: activityList[0].icon || '🏃'
    });
  }

  return records;
}

/**
 * Get formatted value for display
 */
export function formatRecordValue(record: PersonalRecord, lang: 'tr' | 'en'): string {
  switch (record.type) {
    case 'points':
      return `${record.value.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')} ${lang === 'tr' ? 'puan' : 'points'}`;
    case 'amount':
      return record.value.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US');
    case 'streak':
      return `${record.value} ${lang === 'tr' ? 'gün' : 'days'}`;
    case 'speed':
      return `${record.value} ${lang === 'tr' ? 'saat' : 'hours'}`;
    default:
      return String(record.value);
  }
}

