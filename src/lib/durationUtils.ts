'use client';

import { startOfDay, parseISO } from 'date-fns';
import { ActivityRecord } from './activityStore';

export interface DurationStats {
  averageDailyDuration: number; // in seconds
  totalDuration: number; // in seconds
  daysWithDuration: number;
  longestDayDuration: number; // in seconds
  longestDayDate: string | null;
}

/**
 * Calculate duration statistics from activity records
 */
export function calculateDurationStats(
  activities: ActivityRecord[]
): DurationStats {
  if (activities.length === 0) {
    return {
      averageDailyDuration: 0,
      totalDuration: 0,
      daysWithDuration: 0,
      longestDayDuration: 0,
      longestDayDate: null
    };
  }

  // Group activities by day and sum durations
  const dailyDurations = new Map<string, number>();
  
  for (const activity of activities) {
    if (activity.duration && activity.duration > 0) {
      const date = startOfDay(parseISO(activity.performedAt));
      const dayKey = date.toISOString();
      dailyDurations.set(
        dayKey,
        (dailyDurations.get(dayKey) ?? 0) + activity.duration
      );
    }
  }

  const durations = Array.from(dailyDurations.values());
  const daysWithDuration = durations.length;
  const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);
  const averageDailyDuration = daysWithDuration > 0 
    ? Math.round(totalDuration / daysWithDuration) 
    : 0;

  // Find longest day
  let longestDayDuration = 0;
  let longestDayDate: string | null = null;
  
  for (const [dayKey, duration] of dailyDurations.entries()) {
    if (duration > longestDayDuration) {
      longestDayDuration = duration;
      longestDayDate = dayKey;
    }
  }

  return {
    averageDailyDuration,
    totalDuration,
    daysWithDuration,
    longestDayDuration,
    longestDayDate
  };
}

/**
 * Format duration in seconds to human-readable string
 */
export function formatDuration(seconds: number, lang: 'tr' | 'en'): string {
  if (seconds === 0) return lang === 'tr' ? '0 saniye' : '0 seconds';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts: string[] = [];
  
  if (hours > 0) {
    parts.push(
      lang === 'tr' 
        ? `${hours} ${hours === 1 ? 'saat' : 'saat'}`
        : `${hours} ${hours === 1 ? 'hour' : 'hours'}`
    );
  }
  
  if (minutes > 0) {
    parts.push(
      lang === 'tr'
        ? `${minutes} ${minutes === 1 ? 'dakika' : 'dakika'}`
        : `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
    );
  }
  
  if (secs > 0 && hours === 0) {
    parts.push(
      lang === 'tr'
        ? `${secs} ${secs === 1 ? 'saniye' : 'saniye'}`
        : `${secs} ${secs === 1 ? 'second' : 'seconds'}`
    );
  }
  
  return parts.join(' ') || (lang === 'tr' ? '0 saniye' : '0 seconds');
}

/**
 * Format duration in MM:SS or HH:MM:SS format
 */
export function formatDurationShort(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

