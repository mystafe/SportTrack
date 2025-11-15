import { ActivityRecord } from '@/lib/activityStore';
import { UserSettings } from '@/lib/settingsStore';
import { startOfDay, parseISO, isSameDay, subDays } from 'date-fns';

export type BadgeId =
  | 'first_activity'
  | 'streak_7'
  | 'streak_30'
  | 'streak_100'
  | 'points_10k'
  | 'points_50k'
  | 'points_100k'
  | 'points_500k'
  | 'activities_100'
  | 'activities_500'
  | 'activities_1000'
  | 'all_activities'
  | 'weekend_warrior'
  | 'early_bird'
  | 'night_owl'
  | 'perfect_week'
  | 'perfect_month';

export interface Badge {
  id: BadgeId;
  name: { tr: string; en: string };
  description: { tr: string; en: string };
  icon: string;
  category: 'streak' | 'points' | 'activities' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

export const BADGE_DEFINITIONS: Record<BadgeId, Omit<Badge, 'unlockedAt'>> = {
  first_activity: {
    id: 'first_activity',
    name: { tr: 'İlk Adım', en: 'First Step' },
    description: { tr: 'İlk aktiviteni ekle', en: 'Add your first activity' },
    icon: '🎯',
    category: 'special',
    rarity: 'common',
  },
  streak_7: {
    id: 'streak_7',
    name: { tr: '7 Günlük Seri', en: '7 Day Streak' },
    description: {
      tr: '7 gün üst üste hedefini tamamla',
      en: 'Complete your goal 7 days in a row',
    },
    icon: '🔥',
    category: 'streak',
    rarity: 'common',
  },
  streak_30: {
    id: 'streak_30',
    name: { tr: '30 Günlük Seri', en: '30 Day Streak' },
    description: {
      tr: '30 gün üst üste hedefini tamamla',
      en: 'Complete your goal 30 days in a row',
    },
    icon: '💪',
    category: 'streak',
    rarity: 'rare',
  },
  streak_100: {
    id: 'streak_100',
    name: { tr: '100 Günlük Seri', en: '100 Day Streak' },
    description: {
      tr: '100 gün üst üste hedefini tamamla',
      en: 'Complete your goal 100 days in a row',
    },
    icon: '👑',
    category: 'streak',
    rarity: 'legendary',
  },
  points_10k: {
    id: 'points_10k',
    name: { tr: '10K Puan', en: '10K Points' },
    description: { tr: 'Toplamda 10.000 puan kazan', en: 'Earn 10,000 total points' },
    icon: '⭐',
    category: 'points',
    rarity: 'common',
  },
  points_50k: {
    id: 'points_50k',
    name: { tr: '50K Puan', en: '50K Points' },
    description: { tr: 'Toplamda 50.000 puan kazan', en: 'Earn 50,000 total points' },
    icon: '🌟',
    category: 'points',
    rarity: 'rare',
  },
  points_100k: {
    id: 'points_100k',
    name: { tr: '100K Puan', en: '100K Points' },
    description: { tr: 'Toplamda 100.000 puan kazan', en: 'Earn 100,000 total points' },
    icon: '💫',
    category: 'points',
    rarity: 'epic',
  },
  points_500k: {
    id: 'points_500k',
    name: { tr: '500K Puan', en: '500K Points' },
    description: { tr: 'Toplamda 500.000 puan kazan', en: 'Earn 500,000 total points' },
    icon: '🏆',
    category: 'points',
    rarity: 'legendary',
  },
  activities_100: {
    id: 'activities_100',
    name: { tr: '100 Egzersiz', en: '100 Exercises' },
    description: { tr: '100 egzersiz ekle', en: 'Add 100 exercises' },
    icon: '📝',
    category: 'activities',
    rarity: 'common',
  },
  activities_500: {
    id: 'activities_500',
    name: { tr: '500 Egzersiz', en: '500 Exercises' },
    description: { tr: '500 egzersiz ekle', en: 'Add 500 exercises' },
    icon: '📊',
    category: 'activities',
    rarity: 'rare',
  },
  activities_1000: {
    id: 'activities_1000',
    name: { tr: '1000 Egzersiz', en: '1000 Exercises' },
    description: { tr: '1000 egzersiz ekle', en: 'Add 1000 exercises' },
    icon: '🎖️',
    category: 'activities',
    rarity: 'epic',
  },
  all_activities: {
    id: 'all_activities',
    name: { tr: 'Tüm Egzersizler', en: 'All Exercises' },
    description: { tr: 'Tüm egzersiz türlerini dene', en: 'Try all exercise types' },
    icon: '🎯',
    category: 'special',
    rarity: 'rare',
  },
  weekend_warrior: {
    id: 'weekend_warrior',
    name: { tr: 'Hafta Sonu Savaşçısı', en: 'Weekend Warrior' },
    description: { tr: 'Hafta sonu egzersizleri yap', en: 'Do exercises on weekends' },
    icon: '🏋️',
    category: 'special',
    rarity: 'common',
  },
  early_bird: {
    id: 'early_bird',
    name: { tr: 'Erken Kuş', en: 'Early Bird' },
    description: { tr: 'Sabah 6-9 arası aktivite yap', en: 'Do activities between 6-9 AM' },
    icon: '🌅',
    category: 'special',
    rarity: 'common',
  },
  night_owl: {
    id: 'night_owl',
    name: { tr: 'Gece Kuşu', en: 'Night Owl' },
    description: { tr: 'Gece 21-24 arası aktivite yap', en: 'Do activities between 9 PM-12 AM' },
    icon: '🦉',
    category: 'special',
    rarity: 'common',
  },
  perfect_week: {
    id: 'perfect_week',
    name: { tr: 'Mükemmel Hafta', en: 'Perfect Week' },
    description: {
      tr: 'Bir hafta boyunca her gün hedefini tamamla',
      en: 'Complete your goal every day for a week',
    },
    icon: '✨',
    category: 'special',
    rarity: 'rare',
  },
  perfect_month: {
    id: 'perfect_month',
    name: { tr: 'Mükemmel Ay', en: 'Perfect Month' },
    description: {
      tr: 'Bir ay boyunca her gün hedefini tamamla',
      en: 'Complete your goal every day for a month',
    },
    icon: '💎',
    category: 'special',
    rarity: 'epic',
  },
};

export function checkBadges(
  activities: ActivityRecord[],
  settings: UserSettings | null,
  target: number,
  existingBadges: Badge[] = []
): Badge[] {
  const unlockedBadges: Badge[] = [];
  const existingBadgeIds = new Set(existingBadges.map((b) => b.id));

  if (activities.length === 0) {
    return unlockedBadges;
  }

  // Calculate statistics
  const totalPoints = activities.reduce((sum, a) => sum + a.points, 0);
  const totalActivities = activities.length;
  const uniqueActivityKeys = new Set(activities.map((a) => a.activityKey));

  // Calculate streak
  const daysWithActivities = new Map<string, number>();
  for (const activity of activities) {
    const date = startOfDay(parseISO(activity.performedAt));
    const key = date.toISOString();
    daysWithActivities.set(key, (daysWithActivities.get(key) || 0) + activity.points);
  }

  const sortedDays = Array.from(daysWithActivities.entries())
    .map(([key, points]) => ({ date: new Date(key), points }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  let currentStreak = 0;
  const today = startOfDay(new Date());
  for (const day of sortedDays) {
    if (
      isSameDay(day.date, today) ||
      isSameDay(day.date, startOfDay(subDays(today, currentStreak)))
    ) {
      if (day.points >= target) {
        currentStreak++;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  // Check each badge
  for (const [badgeId, definition] of Object.entries(BADGE_DEFINITIONS)) {
    if (existingBadgeIds.has(badgeId as BadgeId)) continue;

    let unlocked = false;

    switch (badgeId) {
      case 'first_activity':
        unlocked = totalActivities >= 1;
        break;

      case 'streak_7':
        unlocked = currentStreak >= 7;
        break;

      case 'streak_30':
        unlocked = currentStreak >= 30;
        break;

      case 'streak_100':
        unlocked = currentStreak >= 100;
        break;

      case 'points_10k':
        unlocked = totalPoints >= 10000;
        break;

      case 'points_50k':
        unlocked = totalPoints >= 50000;
        break;

      case 'points_100k':
        unlocked = totalPoints >= 100000;
        break;

      case 'points_500k':
        unlocked = totalPoints >= 500000;
        break;

      case 'activities_100':
        unlocked = totalActivities >= 100;
        break;

      case 'activities_500':
        unlocked = totalActivities >= 500;
        break;

      case 'activities_1000':
        unlocked = totalActivities >= 1000;
        break;

      case 'all_activities':
        // Check if user tried all base activities (assuming 8 base activities)
        unlocked = uniqueActivityKeys.size >= 8;
        break;

      case 'weekend_warrior':
        unlocked = activities.some((a) => {
          const date = parseISO(a.performedAt);
          const dayOfWeek = date.getDay();
          return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
        });
        break;

      case 'early_bird':
        unlocked = activities.some((a) => {
          const date = parseISO(a.performedAt);
          const hour = date.getHours();
          return hour >= 6 && hour < 9;
        });
        break;

      case 'night_owl':
        unlocked = activities.some((a) => {
          const date = parseISO(a.performedAt);
          const hour = date.getHours();
          return hour >= 21 || hour < 24;
        });
        break;

      case 'perfect_week':
        // Check if last 7 days all have activities >= target
        const last7Days = Array.from({ length: 7 }, (_, i) => startOfDay(subDays(today, i)));
        unlocked = last7Days.every((day) => {
          const dayKey = day.toISOString();
          const dayPoints = daysWithActivities.get(dayKey) || 0;
          return dayPoints >= target;
        });
        break;

      case 'perfect_month':
        // Check if last 30 days all have activities >= target
        const last30Days = Array.from({ length: 30 }, (_, i) => startOfDay(subDays(today, i)));
        unlocked = last30Days.every((day) => {
          const dayKey = day.toISOString();
          const dayPoints = daysWithActivities.get(dayKey) || 0;
          return dayPoints >= target;
        });
        break;
    }

    if (unlocked) {
      unlockedBadges.push({
        ...definition,
        unlockedAt: new Date(),
      });
    }
  }

  return unlockedBadges;
}
