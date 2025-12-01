/**
 * Activity Suggestions System
 * Provides intelligent activity suggestions based on user's history
 */

import { ActivityRecord } from './activityStore';
import { ActivityDefinition, BASE_ACTIVITY_DEFINITIONS } from './activityConfig';
import { parseISO, getHours, getDay, startOfDay, isSameDay, subDays } from 'date-fns';

export interface ActivitySuggestion {
  activity: ActivityDefinition;
  reason: { tr: string; en: string };
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

/**
 * Get activity suggestions based on user's history
 */
export function getActivitySuggestions(
  activities: ActivityRecord[],
  dailyTarget: number,
  todayPoints: number
): ActivitySuggestion[] {
  const suggestions: ActivitySuggestion[] = [];

  if (activities.length === 0) {
    // First-time user suggestions
    return [
      {
        activity: BASE_ACTIVITY_DEFINITIONS.find((a) => a.key === 'WALKING')!,
        reason: {
          tr: 'Başlamak için harika bir aktivite!',
          en: 'Great activity to get started!',
        },
        priority: 'high',
        icon: '🚶‍♂️',
      },
      {
        activity: BASE_ACTIVITY_DEFINITIONS.find((a) => a.key === 'RUNNING')!,
        reason: {
          tr: 'Kardiyovasküler sağlık için mükemmel',
          en: 'Perfect for cardiovascular health',
        },
        priority: 'medium',
        icon: '🏃',
      },
    ];
  }

  const now = new Date();
  const today = startOfDay(now);
  const currentHour = getHours(now);
  const currentDayOfWeek = getDay(now); // 0 = Sunday, 6 = Saturday

  // Get today's activities
  const todayActivities = activities.filter((a) =>
    isSameDay(startOfDay(parseISO(a.performedAt)), today)
  );

  // Get last 7 days activities
  const last7Days = activities.filter((a) => {
    const activityDate = startOfDay(parseISO(a.performedAt));
    const daysDiff = Math.floor((today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7 && daysDiff >= 0;
  });

  // Get last 30 days activities
  const last30Days = activities.filter((a) => {
    const activityDate = startOfDay(parseISO(a.performedAt));
    const daysDiff = Math.floor((today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 30 && daysDiff >= 0;
  });

  // Calculate activity frequency
  const activityFrequency = new Map<string, number>();
  last30Days.forEach((a) => {
    activityFrequency.set(a.activityKey, (activityFrequency.get(a.activityKey) || 0) + 1);
  });

  // Get most frequent activities
  const sortedActivities = Array.from(activityFrequency.entries()).sort((a, b) => b[1] - a[1]);
  const mostFrequent = sortedActivities.slice(0, 3).map(([key]) => key);

  // Check if user hasn't reached daily target
  if (todayPoints < dailyTarget) {
    const remainingPoints = dailyTarget - todayPoints;
    const percentageRemaining = (remainingPoints / dailyTarget) * 100;

    if (percentageRemaining > 50) {
      // More than 50% remaining - suggest high-point activities
      const highPointActivities = BASE_ACTIVITY_DEFINITIONS.filter(
        (a) => a.multiplier >= 5 && !todayActivities.some((ta) => ta.activityKey === a.key)
      );

      if (highPointActivities.length > 0) {
        const suggested = highPointActivities[0];
        suggestions.push({
          activity: suggested,
          reason: {
            tr: `Hedefinize ulaşmak için yüksek puanlı aktivite!`,
            en: `High-point activity to reach your goal!`,
          },
          priority: 'high',
          icon: '🎯',
        });
      }
    } else {
      // Less than 50% remaining - suggest any activity
      const unusedActivities = BASE_ACTIVITY_DEFINITIONS.filter(
        (a) => !todayActivities.some((ta) => ta.activityKey === a.key)
      );

      if (unusedActivities.length > 0) {
        const suggested = unusedActivities[0];
        suggestions.push({
          activity: suggested,
          reason: {
            tr: `Hedefinize çok yakınsınız!`,
            en: `You're very close to your goal!`,
          },
          priority: 'high',
          icon: '🔥',
        });
      }
    }
  }

  // Suggest activities based on time of day
  if (currentHour >= 6 && currentHour < 12) {
    // Morning - suggest cardio
    const morningActivities = BASE_ACTIVITY_DEFINITIONS.filter(
      (a) =>
        (a.key === 'WALKING' || a.key === 'RUNNING' || a.key === 'STAIRS') &&
        !todayActivities.some((ta) => ta.activityKey === a.key)
    );

    if (morningActivities.length > 0) {
      suggestions.push({
        activity: morningActivities[0],
        reason: {
          tr: 'Sabah kardiyo için mükemmel zaman!',
          en: 'Perfect time for morning cardio!',
        },
        priority: 'medium',
        icon: '🌅',
      });
    }
  } else if (currentHour >= 17 && currentHour < 21) {
    // Evening - suggest strength training
    const eveningActivities = BASE_ACTIVITY_DEFINITIONS.filter(
      (a) =>
        (a.key === 'PUSH_UP' ||
          a.key === 'SIT_UP' ||
          a.key === 'WEIGHT_LIFTING' ||
          a.key === 'CRUNCH') &&
        !todayActivities.some((ta) => ta.activityKey === a.key)
    );

    if (eveningActivities.length > 0) {
      suggestions.push({
        activity: eveningActivities[0],
        reason: {
          tr: 'Akşam güç antrenmanı için ideal zaman!',
          en: 'Ideal time for evening strength training!',
        },
        priority: 'medium',
        icon: '💪',
      });
    }
  }

  // Suggest activities based on day of week
  if (currentDayOfWeek === 0 || currentDayOfWeek === 6) {
    // Weekend - suggest fun activities
    const weekendActivities = BASE_ACTIVITY_DEFINITIONS.filter(
      (a) =>
        (a.key === 'SWIMMING' || a.key === 'RUNNING') &&
        !todayActivities.some((ta) => ta.activityKey === a.key)
    );

    if (weekendActivities.length > 0 && todayActivities.length === 0) {
      suggestions.push({
        activity: weekendActivities[0],
        reason: {
          tr: 'Hafta sonu için harika bir aktivite!',
          en: 'Great activity for the weekend!',
        },
        priority: 'medium',
        icon: '🎉',
      });
    }
  }

  // Suggest activities user hasn't tried recently
  const unusedRecently = BASE_ACTIVITY_DEFINITIONS.filter(
    (a) =>
      !last7Days.some((la) => la.activityKey === a.key) &&
      !todayActivities.some((ta) => ta.activityKey === a.key)
  );

  if (unusedRecently.length > 0 && suggestions.length < 3) {
    suggestions.push({
      activity: unusedRecently[0],
      reason: {
        tr: 'Son zamanlarda denemediğiniz bir aktivite',
        en: "An activity you haven't tried recently",
      },
      priority: 'low',
      icon: '🆕',
    });
  }

  // Suggest most frequent activities if user hasn't done them today
  if (mostFrequent.length > 0 && suggestions.length < 3) {
    const frequentNotToday = mostFrequent
      .map((key) => BASE_ACTIVITY_DEFINITIONS.find((a) => a.key === key))
      .filter(
        (a): a is ActivityDefinition =>
          a !== undefined && !todayActivities.some((ta) => ta.activityKey === a.key)
      );

    if (frequentNotToday.length > 0) {
      suggestions.push({
        activity: frequentNotToday[0],
        reason: {
          tr: 'En sık yaptığınız aktivitelerden biri',
          en: 'One of your most frequent activities',
        },
        priority: 'medium',
        icon: '⭐',
      });
    }
  }

  // Suggest variety - activities user hasn't tried much
  const leastFrequent = sortedActivities
    .slice(-3)
    .map(([key]) => BASE_ACTIVITY_DEFINITIONS.find((a) => a.key === key))
    .filter(
      (a): a is ActivityDefinition =>
        a !== undefined && !todayActivities.some((ta) => ta.activityKey === a.key)
    );

  if (leastFrequent.length > 0 && suggestions.length < 4) {
    suggestions.push({
      activity: leastFrequent[0],
      reason: {
        tr: 'Çeşitlilik için yeni bir aktivite deneyin',
        en: 'Try a new activity for variety',
      },
      priority: 'low',
      icon: '🎯',
    });
  }

  // Limit to 4 suggestions max
  return suggestions.slice(0, 4);
}

/**
 * Get suggestion priority color
 */
export function getSuggestionPriorityColor(priority: ActivitySuggestion['priority']): string {
  switch (priority) {
    case 'high':
      return 'border-2 border-red-300/50 dark:border-red-600/50 bg-red-50/95 dark:bg-red-900/30';
    case 'medium':
      return 'border-2 border-blue-300/50 dark:border-blue-600/50 bg-blue-50/95 dark:bg-blue-900/30';
    case 'low':
      return 'border-2 border-gray-300/50 dark:border-gray-600/50 bg-gray-50/95 dark:bg-gray-800/95';
  }
}
