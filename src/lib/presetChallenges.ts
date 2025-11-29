/**
 * Preset Challenge Templates
 * Ready-to-use challenge examples that users can quickly add
 */

import {
  ChallengeType,
  createDailyChallenge,
  createWeeklyChallenge,
  createMonthlyChallenge,
  createYearlyChallenge,
  createSeasonalChallenge,
  createStreakBasedChallenge,
  createTimeBasedChallenge,
  createActivitySpecificChallenge,
  createCustomChallenge,
} from './challenges';
import { endOfDay, endOfWeek, endOfMonth, endOfYear } from 'date-fns';

export interface PresetChallenge {
  id: string;
  type: ChallengeType;
  name: { tr: string; en: string };
  description: { tr: string; en: string };
  target: number;
  icon: string;
  category: 'motivation' | 'achievement' | 'consistency' | 'milestone' | 'special';
}

export const PRESET_CHALLENGES: PresetChallenge[] = [
  // Motivation Challenges
  {
    id: 'preset-weekly-super',
    type: 'weekly',
    name: { tr: 'Haftalık Süper Hedef', en: 'Weekly Super Goal' },
    description: {
      tr: 'Bu hafta 75.000 puan topla ve haftayı süper bir şekilde bitir!',
      en: 'Score 75,000 points this week and finish the week super!',
    },
    target: 75000,
    icon: '🚀',
    category: 'motivation',
  },
  {
    id: 'preset-monthly-perfection',
    type: 'monthly',
    name: { tr: 'Aylık Mükemmellik', en: 'Monthly Perfection' },
    description: {
      tr: 'Bu ay her gün hedefini tamamla ve mükemmel bir ay geçir!',
      en: 'Complete your daily goal every day this month for a perfect month!',
    },
    target: 300000,
    icon: '✨',
    category: 'motivation',
  },
  {
    id: 'preset-morning-bird',
    type: 'time_based',
    name: { tr: 'Sabah Kuşu', en: 'Morning Bird' },
    description: {
      tr: 'Sabah 6-9 arası 30.000 puan topla ve güne erken başla!',
      en: 'Score 30,000 points between 6-9 AM and start your day early!',
    },
    target: 30000,
    icon: '🌅',
    category: 'motivation',
  },
  {
    id: 'preset-weekend-warrior',
    type: 'time_based',
    name: { tr: 'Hafta Sonu Savaşçısı', en: 'Weekend Warrior' },
    description: {
      tr: 'Hafta sonu 100.000 puan topla ve haftayı güçlü bitir!',
      en: 'Score 100,000 points on weekends and finish the week strong!',
    },
    target: 100000,
    icon: '💪',
    category: 'motivation',
  },

  // Achievement Challenges
  {
    id: 'preset-first-100k',
    type: 'custom',
    name: { tr: 'İlk 100K', en: 'First 100K' },
    description: {
      tr: 'Tek bir günde 100.000 puan topla ve büyük bir başarı elde et!',
      en: 'Score 100,000 points in a single day and achieve greatness!',
    },
    target: 100000,
    icon: '🏆',
    category: 'achievement',
  },
  {
    id: 'preset-half-million',
    type: 'monthly',
    name: { tr: 'Yarım Milyon', en: 'Half Million' },
    description: {
      tr: 'Bu ay 500.000 puan topla ve büyük bir kilometre taşına ulaş!',
      en: 'Score 500,000 points this month and reach a major milestone!',
    },
    target: 500000,
    icon: '💎',
    category: 'achievement',
  },
  {
    id: 'preset-million-club',
    type: 'yearly',
    name: { tr: 'Milyon Kulübü', en: 'Million Club' },
    description: {
      tr: 'Bu yıl 1.000.000 puan topla ve elit kulübe katıl!',
      en: 'Score 1,000,000 points this year and join the elite club!',
    },
    target: 1000000,
    icon: '👑',
    category: 'achievement',
  },

  // Consistency Challenges
  {
    id: 'preset-7-day-streak',
    type: 'streak_based',
    name: { tr: '7 Gün Serisi', en: '7 Day Streak' },
    description: {
      tr: '7 gün üst üste hedefini tamamla ve tutarlılık kazan!',
      en: 'Complete your goal 7 days in a row and build consistency!',
    },
    target: 7,
    icon: '🔥',
    category: 'consistency',
  },
  {
    id: 'preset-30-day-challenge',
    type: 'streak_based',
    name: { tr: '30 Gün Mücadelesi', en: '30 Day Challenge' },
    description: {
      tr: '30 gün üst üste hedefini tamamla ve alışkanlık oluştur!',
      en: 'Complete your goal 30 days in a row and build a habit!',
    },
    target: 30,
    icon: '📅',
    category: 'consistency',
  },
  {
    id: 'preset-perfect-week',
    type: 'weekly',
    name: { tr: 'Mükemmel Hafta', en: 'Perfect Week' },
    description: {
      tr: 'Bu hafta her gün hedefini tamamla ve mükemmel bir hafta geçir!',
      en: 'Complete your daily goal every day this week for a perfect week!',
    },
    target: 70000,
    icon: '⭐',
    category: 'consistency',
  },

  // Milestone Challenges
  {
    id: 'preset-new-year-resolution',
    type: 'yearly',
    name: { tr: 'Yeni Yıl Kararı', en: 'New Year Resolution' },
    description: {
      tr: 'Bu yıl 5.000.000 puan topla ve yeni yıl kararını gerçekleştir!',
      en: 'Score 5,000,000 points this year and fulfill your New Year resolution!',
    },
    target: 5000000,
    icon: '🎊',
    category: 'milestone',
  },
  {
    id: 'preset-summer-champion',
    type: 'seasonal',
    name: { tr: 'Yaz Şampiyonu', en: 'Summer Champion' },
    description: {
      tr: 'Yaz mevsiminde 1.500.000 puan topla ve yaz şampiyonu ol!',
      en: 'Score 1,500,000 points in summer and become the summer champion!',
    },
    target: 1500000,
    icon: '☀️',
    category: 'milestone',
  },
  {
    id: 'preset-winter-warrior',
    type: 'seasonal',
    name: { tr: 'Kış Savaşçısı', en: 'Winter Warrior' },
    description: {
      tr: 'Kış mevsiminde 1.200.000 puan topla ve kışı fethet!',
      en: 'Score 1,200,000 points in winter and conquer the cold!',
    },
    target: 1200000,
    icon: '❄️',
    category: 'milestone',
  },

  // Special Challenges
  {
    id: 'preset-cardio-master',
    type: 'activity_specific',
    name: { tr: 'Kardiyo Ustası', en: 'Cardio Master' },
    description: {
      tr: 'Kardiyo aktivitelerinde 200.000 puan topla ve kardiyo ustası ol!',
      en: 'Score 200,000 points in cardio activities and become a cardio master!',
    },
    target: 200000,
    icon: '❤️',
    category: 'special',
  },
  {
    id: 'preset-strength-king',
    type: 'activity_specific',
    name: { tr: 'Güç Kralı', en: 'Strength King' },
    description: {
      tr: 'Güç antrenmanlarında 150.000 puan topla ve güç kralı ol!',
      en: 'Score 150,000 points in strength training and become the strength king!',
    },
    target: 150000,
    icon: '💪',
    category: 'special',
  },
  {
    id: 'preset-speed-demon',
    type: 'time_based',
    name: { tr: 'Hız Şeytanı', en: 'Speed Demon' },
    description: {
      tr: 'Sabah 6-9 arası 50.000 puan topla ve hız şeytanı ol!',
      en: 'Score 50,000 points between 6-9 AM and become a speed demon!',
    },
    target: 50000,
    icon: '⚡',
    category: 'special',
  },
];

/**
 * Get preset challenges by category
 */
export function getPresetChallengesByCategory(
  category?: PresetChallenge['category']
): PresetChallenge[] {
  if (!category) return PRESET_CHALLENGES;
  return PRESET_CHALLENGES.filter((preset) => preset.category === category);
}

/**
 * Create a challenge from a preset
 */
export function createChallengeFromPreset(
  preset: PresetChallenge,
  startDate: Date = new Date()
): import('./challenges').Challenge {
  let endDate: Date;

  switch (preset.type) {
    case 'daily':
      endDate = endOfDay(startDate);
      break;
    case 'weekly':
      endDate = endOfWeek(startDate, { weekStartsOn: 1 });
      break;
    case 'monthly':
      endDate = endOfMonth(startDate);
      break;
    case 'yearly':
      endDate = endOfYear(startDate);
      break;
    case 'seasonal':
      endDate = endOfYear(startDate); // Will be adjusted by createSeasonalChallenge
      break;
    case 'streak_based':
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + preset.target - 1); // target is number of days for streak challenges
      break;
    case 'time_based':
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7); // Default 7 days for time-based challenges
      break;
    case 'activity_specific':
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 30); // Default 30 days for activity-specific challenges
      break;
    default:
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);
  }

  // Use appropriate creation function based on type
  let challenge: import('./challenges').Challenge;
  switch (preset.type) {
    case 'daily':
      challenge = createDailyChallenge(preset.name, preset.target, startDate, preset.icon);
      break;
    case 'weekly':
      challenge = createWeeklyChallenge(preset.name, preset.target, startDate, preset.icon);
      break;
    case 'monthly':
      challenge = createMonthlyChallenge(preset.name, preset.target, startDate, preset.icon);
      break;
    case 'yearly':
      challenge = createYearlyChallenge(preset.name, preset.target, startDate, preset.icon);
      break;
    case 'seasonal':
      challenge = createSeasonalChallenge(preset.name, preset.target, startDate, preset.icon);
      break;
    case 'streak_based':
      challenge = createStreakBasedChallenge(
        preset.name,
        preset.description,
        preset.target,
        startDate,
        endDate, // endDate for streak challenges
        preset.icon
      );
      break;
    case 'time_based':
      challenge = createTimeBasedChallenge(
        preset.name,
        preset.description,
        preset.target,
        6, // startHour
        9, // endHour
        startDate,
        endDate,
        preset.icon
      );
      break;
    case 'activity_specific':
      challenge = createActivitySpecificChallenge(
        preset.name,
        preset.description,
        preset.target,
        'general', // activityKey
        startDate,
        endDate,
        preset.icon
      );
      break;
    default:
      challenge = createCustomChallenge(
        preset.name,
        preset.description,
        preset.target,
        startDate,
        endDate,
        preset.icon
      );
  }

  // Override ID to use preset ID as prefix to ensure consistent identification
  // This prevents duplicates when the same preset is added multiple times
  const presetIdPrefix = preset.id; // e.g., "preset-first-100k"
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  // Create ID that starts with preset ID for easy matching: preset-id-timestamp-random
  const presetChallengeId = `${presetIdPrefix}-${timestamp}-${random}`;

  // Add category from preset and override ID
  return {
    ...challenge,
    id: presetChallengeId,
    category: preset.category,
  };
}
