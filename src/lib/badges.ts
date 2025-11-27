import { ActivityRecord } from '@/lib/activityStore';
import { UserSettings } from '@/lib/settingsStore';
import { startOfDay, parseISO, isSameDay, subDays, startOfWeek, startOfMonth } from 'date-fns';
import { BASE_ACTIVITY_DEFINITIONS } from '@/lib/activityConfig';

// Helper function to get season
function getSeason(date: Date): 'spring' | 'summer' | 'autumn' | 'winter' {
  const month = date.getMonth(); // 0-11
  if (month >= 2 && month <= 4) return 'spring'; // March, April, May
  if (month >= 5 && month <= 7) return 'summer'; // June, July, August
  if (month >= 8 && month <= 10) return 'autumn'; // September, October, November
  return 'winter'; // December, January, February
}

export type BadgeId =
  | 'first_activity'
  | 'streak_3'
  | 'streak_7'
  | 'streak_14'
  | 'streak_21'
  | 'streak_30'
  | 'streak_60'
  | 'streak_100'
  | 'streak_200'
  | 'streak_365'
  | 'streak_500'
  | 'points_1k'
  | 'points_2_5k'
  | 'points_5k'
  | 'points_7_5k'
  | 'points_10k'
  | 'points_25k'
  | 'points_50k'
  | 'points_100k'
  | 'points_250k'
  | 'points_500k'
  | 'points_1m'
  | 'points_2m'
  | 'points_5m'
  | 'activities_10'
  | 'activities_50'
  | 'activities_100'
  | 'activities_250'
  | 'activities_500'
  | 'activities_1000'
  | 'activities_2000'
  | 'activities_5000'
  | 'all_activities'
  | 'weekend_warrior'
  | 'weekday_warrior'
  | 'early_bird'
  | 'noon_warrior'
  | 'night_owl'
  | 'midnight_runner'
  | 'perfect_week'
  | 'perfect_month'
  | 'speed_demon'
  | 'marathon_day'
  | 'consistency_king'
  | 'variety_seeker'
  | 'early_riser'
  | 'night_trainer'
  | 'weekend_champion'
  | 'perfect_quarter'
  | 'year_warrior'
  | 'comeback_king'
  | 'social_butterfly'
  | 'power_hour'
  | 'steady_eddie'
  | 'explorer'
  | 'dedication'
  | 'running_master'
  | 'swimming_master'
  | 'strength_master'
  | 'cardio_master'
  | 'spring_warrior'
  | 'summer_champion'
  | 'autumn_hero'
  | 'winter_legend'
  | 'habit_former'
  | 'progress_maker'
  | 'consistency_master'
  | 'milestone_reacher'
  | 'weekly_champion'
  | 'monthly_champion'
  | 'daily_average_king';

export interface Badge {
  id: BadgeId;
  name: { tr: string; en: string };
  description: { tr: string; en: string };
  icon: string;
  category: 'streak' | 'points' | 'activities' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  shown?: boolean; // Whether the badge notification has been shown to the user
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
  streak_14: {
    id: 'streak_14',
    name: { tr: '14 Günlük Seri', en: '14 Day Streak' },
    description: {
      tr: '14 gün üst üste hedefini tamamla',
      en: 'Complete your goal 14 days in a row',
    },
    icon: '🔥',
    category: 'streak',
    rarity: 'rare',
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
  streak_60: {
    id: 'streak_60',
    name: { tr: '60 Günlük Seri', en: '60 Day Streak' },
    description: {
      tr: '60 gün üst üste hedefini tamamla',
      en: 'Complete your goal 60 days in a row',
    },
    icon: '⚡',
    category: 'streak',
    rarity: 'epic',
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
  streak_200: {
    id: 'streak_200',
    name: { tr: '200 Günlük Seri', en: '200 Day Streak' },
    description: {
      tr: '200 gün üst üste hedefini tamamla',
      en: 'Complete your goal 200 days in a row',
    },
    icon: '🌟',
    category: 'streak',
    rarity: 'legendary',
  },
  streak_365: {
    id: 'streak_365',
    name: { tr: '1 Yıllık Seri', en: '1 Year Streak' },
    description: {
      tr: '365 gün üst üste hedefini tamamla',
      en: 'Complete your goal 365 days in a row',
    },
    icon: '🏆',
    category: 'streak',
    rarity: 'legendary',
  },
  points_1k: {
    id: 'points_1k',
    name: { tr: '1K Puan', en: '1K Points' },
    description: { tr: 'Toplamda 1.000 puan kazan', en: 'Earn 1,000 total points' },
    icon: '⭐',
    category: 'points',
    rarity: 'common',
  },
  points_5k: {
    id: 'points_5k',
    name: { tr: '5K Puan', en: '5K Points' },
    description: { tr: 'Toplamda 5.000 puan kazan', en: 'Earn 5,000 total points' },
    icon: '⭐',
    category: 'points',
    rarity: 'common',
  },
  points_10k: {
    id: 'points_10k',
    name: { tr: '10K Puan', en: '10K Points' },
    description: { tr: 'Toplamda 10.000 puan kazan', en: 'Earn 10,000 total points' },
    icon: '⭐',
    category: 'points',
    rarity: 'common',
  },
  points_25k: {
    id: 'points_25k',
    name: { tr: '25K Puan', en: '25K Points' },
    description: { tr: 'Toplamda 25.000 puan kazan', en: 'Earn 25,000 total points' },
    icon: '⭐',
    category: 'points',
    rarity: 'rare',
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
  points_250k: {
    id: 'points_250k',
    name: { tr: '250K Puan', en: '250K Points' },
    description: { tr: 'Toplamda 250.000 puan kazan', en: 'Earn 250,000 total points' },
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
  points_1m: {
    id: 'points_1m',
    name: { tr: '1M Puan', en: '1M Points' },
    description: { tr: 'Toplamda 1.000.000 puan kazan', en: 'Earn 1,000,000 total points' },
    icon: '💎',
    category: 'points',
    rarity: 'legendary',
  },
  activities_10: {
    id: 'activities_10',
    name: { tr: '10 Egzersiz', en: '10 Exercises' },
    description: { tr: '10 egzersiz ekle', en: 'Add 10 exercises' },
    icon: '📝',
    category: 'activities',
    rarity: 'common',
  },
  activities_50: {
    id: 'activities_50',
    name: { tr: '50 Egzersiz', en: '50 Exercises' },
    description: { tr: '50 egzersiz ekle', en: 'Add 50 exercises' },
    icon: '📝',
    category: 'activities',
    rarity: 'common',
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
  activities_250: {
    id: 'activities_250',
    name: { tr: '250 Egzersiz', en: '250 Exercises' },
    description: { tr: '250 egzersiz ekle', en: 'Add 250 exercises' },
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
  activities_2000: {
    id: 'activities_2000',
    name: { tr: '2000 Egzersiz', en: '2000 Exercises' },
    description: { tr: '2000 egzersiz ekle', en: 'Add 2000 exercises' },
    icon: '🎖️',
    category: 'activities',
    rarity: 'epic',
  },
  activities_5000: {
    id: 'activities_5000',
    name: { tr: '5000 Egzersiz', en: '5000 Exercises' },
    description: { tr: '5000 egzersiz ekle', en: 'Add 5000 exercises' },
    icon: '👑',
    category: 'activities',
    rarity: 'legendary',
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
  speed_demon: {
    id: 'speed_demon',
    name: { tr: 'Hız Canavarı', en: 'Speed Demon' },
    description: {
      tr: 'Hedefini 6 saat içinde tamamla',
      en: 'Complete your goal within 6 hours',
    },
    icon: '⚡',
    category: 'special',
    rarity: 'rare',
  },
  marathon_day: {
    id: 'marathon_day',
    name: { tr: 'Maraton Günü', en: 'Marathon Day' },
    description: {
      tr: 'Tek günde 50.000+ puan kazan',
      en: 'Earn 50,000+ points in a single day',
    },
    icon: '🏃',
    category: 'special',
    rarity: 'epic',
  },
  consistency_king: {
    id: 'consistency_king',
    name: { tr: 'Tutarlılık Kralı', en: 'Consistency King' },
    description: {
      tr: '30 gün üst üste aynı saatte aktivite yap',
      en: 'Do activities at the same time for 30 days in a row',
    },
    icon: '👑',
    category: 'special',
    rarity: 'rare',
  },
  variety_seeker: {
    id: 'variety_seeker',
    name: { tr: 'Çeşitlilik Arayıcısı', en: 'Variety Seeker' },
    description: {
      tr: '10 farklı aktivite türü dene',
      en: 'Try 10 different activity types',
    },
    icon: '🎯',
    category: 'special',
    rarity: 'common',
  },
  early_riser: {
    id: 'early_riser',
    name: { tr: 'Erken Kalkan', en: 'Early Riser' },
    description: {
      tr: '7 gün üst üste sabah 6-8 arası aktivite yap',
      en: 'Do activities between 6-8 AM for 7 days in a row',
    },
    icon: '🌅',
    category: 'special',
    rarity: 'common',
  },
  night_trainer: {
    id: 'night_trainer',
    name: { tr: 'Gece Antrenörü', en: 'Night Trainer' },
    description: {
      tr: '7 gün üst üste gece 22-24 arası aktivite yap',
      en: 'Do activities between 10 PM-12 AM for 7 days in a row',
    },
    icon: '🌙',
    category: 'special',
    rarity: 'common',
  },
  weekend_champion: {
    id: 'weekend_champion',
    name: { tr: 'Hafta Sonu Şampiyonu', en: 'Weekend Champion' },
    description: {
      tr: '4 hafta üst üste hafta sonu aktivite yap',
      en: 'Do activities on weekends for 4 weeks in a row',
    },
    icon: '🏆',
    category: 'special',
    rarity: 'rare',
  },
  perfect_quarter: {
    id: 'perfect_quarter',
    name: { tr: 'Mükemmel Çeyrek', en: 'Perfect Quarter' },
    description: {
      tr: '90 gün üst üste hedefini tamamla',
      en: 'Complete your goal for 90 days in a row',
    },
    icon: '💎',
    category: 'special',
    rarity: 'epic',
  },
  year_warrior: {
    id: 'year_warrior',
    name: { tr: 'Yıl Savaşçısı', en: 'Year Warrior' },
    description: {
      tr: '365 gün aktivite yap',
      en: 'Do activities for 365 days',
    },
    icon: '🗓️',
    category: 'special',
    rarity: 'legendary',
  },
  comeback_king: {
    id: 'comeback_king',
    name: { tr: 'Geri Dönüş Kralı', en: 'Comeback King' },
    description: {
      tr: 'Seri kırıldıktan sonra tekrar başla',
      en: 'Start again after breaking your streak',
    },
    icon: '🔄',
    category: 'special',
    rarity: 'common',
  },
  social_butterfly: {
    id: 'social_butterfly',
    name: { tr: 'Sosyal Kelebek', en: 'Social Butterfly' },
    description: {
      tr: 'Hafta içi ve hafta sonu aktivite yap',
      en: 'Do activities on both weekdays and weekends',
    },
    icon: '🦋',
    category: 'special',
    rarity: 'common',
  },
  power_hour: {
    id: 'power_hour',
    name: { tr: 'Güç Saati', en: 'Power Hour' },
    description: {
      tr: 'Tek saatte 5.000+ puan kazan',
      en: 'Earn 5,000+ points in a single hour',
    },
    icon: '⚡',
    category: 'special',
    rarity: 'rare',
  },
  steady_eddie: {
    id: 'steady_eddie',
    name: { tr: 'Kararlı Eddie', en: 'Steady Eddie' },
    description: {
      tr: '14 gün üst üste aynı puan aralığında aktivite yap',
      en: 'Do activities in the same point range for 14 days in a row',
    },
    icon: '📊',
    category: 'special',
    rarity: 'common',
  },
  explorer: {
    id: 'explorer',
    name: { tr: 'Kaşif', en: 'Explorer' },
    description: {
      tr: 'Tüm özel aktiviteleri dene',
      en: 'Try all custom activities',
    },
    icon: '🗺️',
    category: 'special',
    rarity: 'rare',
  },
  dedication: {
    id: 'dedication',
    name: { tr: 'Adanmışlık', en: 'Dedication' },
    description: {
      tr: '100 gün üst üste aktivite yap',
      en: 'Do activities for 100 days in a row',
    },
    icon: '💪',
    category: 'special',
    rarity: 'epic',
  },
  streak_3: {
    id: 'streak_3',
    name: { tr: '3 Günlük Seri', en: '3 Day Streak' },
    description: {
      tr: '3 gün üst üste hedefini tamamla',
      en: 'Complete your goal 3 days in a row',
    },
    icon: '🔥',
    category: 'streak',
    rarity: 'common',
  },
  streak_21: {
    id: 'streak_21',
    name: { tr: '21 Günlük Alışkanlık', en: '21 Day Habit' },
    description: {
      tr: '21 gün üst üste hedefini tamamla - alışkanlık oluştur',
      en: 'Complete your goal 21 days in a row - form a habit',
    },
    icon: '✨',
    category: 'streak',
    rarity: 'rare',
  },
  streak_500: {
    id: 'streak_500',
    name: { tr: '500 Günlük Seri', en: '500 Day Streak' },
    description: {
      tr: '500 gün üst üste hedefini tamamla',
      en: 'Complete your goal 500 days in a row',
    },
    icon: '👑',
    category: 'streak',
    rarity: 'legendary',
  },
  points_2_5k: {
    id: 'points_2_5k',
    name: { tr: '2.5K Puan', en: '2.5K Points' },
    description: { tr: 'Toplamda 2.500 puan kazan', en: 'Earn 2,500 total points' },
    icon: '⭐',
    category: 'points',
    rarity: 'common',
  },
  points_7_5k: {
    id: 'points_7_5k',
    name: { tr: '7.5K Puan', en: '7.5K Points' },
    description: { tr: 'Toplamda 7.500 puan kazan', en: 'Earn 7,500 total points' },
    icon: '⭐',
    category: 'points',
    rarity: 'common',
  },
  points_2m: {
    id: 'points_2m',
    name: { tr: '2M Puan', en: '2M Points' },
    description: { tr: 'Toplamda 2.000.000 puan kazan', en: 'Earn 2,000,000 total points' },
    icon: '💎',
    category: 'points',
    rarity: 'legendary',
  },
  points_5m: {
    id: 'points_5m',
    name: { tr: '5M Puan', en: '5M Points' },
    description: { tr: 'Toplamda 5.000.000 puan kazan', en: 'Earn 5,000,000 total points' },
    icon: '💎',
    category: 'points',
    rarity: 'legendary',
  },
  weekday_warrior: {
    id: 'weekday_warrior',
    name: { tr: 'Hafta İçi Savaşçısı', en: 'Weekday Warrior' },
    description: {
      tr: '5 hafta üst üste hafta içi aktivite yap',
      en: 'Do activities on weekdays for 5 weeks in a row',
    },
    icon: '💼',
    category: 'special',
    rarity: 'rare',
  },
  noon_warrior: {
    id: 'noon_warrior',
    name: { tr: 'Öğle Savaşçısı', en: 'Noon Warrior' },
    description: {
      tr: 'Öğle vakti (12-14) aktivite yap',
      en: 'Do activities during noon (12-2 PM)',
    },
    icon: '☀️',
    category: 'special',
    rarity: 'common',
  },
  midnight_runner: {
    id: 'midnight_runner',
    name: { tr: 'Gece Yarısı Koşucusu', en: 'Midnight Runner' },
    description: {
      tr: 'Gece yarısı (00-02) aktivite yap',
      en: 'Do activities during midnight (12-2 AM)',
    },
    icon: '🌙',
    category: 'special',
    rarity: 'rare',
  },
  running_master: {
    id: 'running_master',
    name: { tr: 'Koşu Ustası', en: 'Running Master' },
    description: {
      tr: '100 kez koşu aktivitesi yap',
      en: 'Do running activities 100 times',
    },
    icon: '🏃',
    category: 'special',
    rarity: 'epic',
  },
  swimming_master: {
    id: 'swimming_master',
    name: { tr: 'Yüzme Ustası', en: 'Swimming Master' },
    description: {
      tr: '50 kez yüzme aktivitesi yap',
      en: 'Do swimming activities 50 times',
    },
    icon: '🏊',
    category: 'special',
    rarity: 'epic',
  },
  strength_master: {
    id: 'strength_master',
    name: { tr: 'Güç Ustası', en: 'Strength Master' },
    description: {
      tr: '200 kez güç aktivitesi yap',
      en: 'Do strength activities 200 times',
    },
    icon: '💪',
    category: 'special',
    rarity: 'epic',
  },
  cardio_master: {
    id: 'cardio_master',
    name: { tr: 'Kardiyo Ustası', en: 'Cardio Master' },
    description: {
      tr: '150 kez kardiyo aktivitesi yap',
      en: 'Do cardio activities 150 times',
    },
    icon: '❤️',
    category: 'special',
    rarity: 'epic',
  },
  spring_warrior: {
    id: 'spring_warrior',
    name: { tr: 'İlkbahar Savaşçısı', en: 'Spring Warrior' },
    description: {
      tr: 'İlkbahar mevsiminde 30 gün aktivite yap',
      en: 'Do activities for 30 days during spring',
    },
    icon: '🌸',
    category: 'special',
    rarity: 'rare',
  },
  summer_champion: {
    id: 'summer_champion',
    name: { tr: 'Yaz Şampiyonu', en: 'Summer Champion' },
    description: {
      tr: 'Yaz mevsiminde 30 gün aktivite yap',
      en: 'Do activities for 30 days during summer',
    },
    icon: '☀️',
    category: 'special',
    rarity: 'rare',
  },
  autumn_hero: {
    id: 'autumn_hero',
    name: { tr: 'Sonbahar Kahramanı', en: 'Autumn Hero' },
    description: {
      tr: 'Sonbahar mevsiminde 30 gün aktivite yap',
      en: 'Do activities for 30 days during autumn',
    },
    icon: '🍂',
    category: 'special',
    rarity: 'rare',
  },
  winter_legend: {
    id: 'winter_legend',
    name: { tr: 'Kış Efsanesi', en: 'Winter Legend' },
    description: {
      tr: 'Kış mevsiminde 30 gün aktivite yap',
      en: 'Do activities for 30 days during winter',
    },
    icon: '❄️',
    category: 'special',
    rarity: 'rare',
  },
  habit_former: {
    id: 'habit_former',
    name: { tr: 'Alışkanlık Oluşturucu', en: 'Habit Former' },
    description: {
      tr: '21 gün üst üste aktivite yaparak alışkanlık oluştur',
      en: 'Form a habit by doing activities for 21 days in a row',
    },
    icon: '🔄',
    category: 'special',
    rarity: 'rare',
  },
  progress_maker: {
    id: 'progress_maker',
    name: { tr: 'İlerleme Yapan', en: 'Progress Maker' },
    description: {
      tr: 'Son 7 günde önceki 7 güne göre %50 daha fazla puan kazan',
      en: 'Earn 50% more points in the last 7 days compared to the previous 7 days',
    },
    icon: '📈',
    category: 'special',
    rarity: 'rare',
  },
  consistency_master: {
    id: 'consistency_master',
    name: { tr: 'Tutarlılık Ustası', en: 'Consistency Master' },
    description: {
      tr: '60 gün üst üste hedefini tamamla',
      en: 'Complete your goal for 60 days in a row',
    },
    icon: '🎯',
    category: 'special',
    rarity: 'epic',
  },
  milestone_reacher: {
    id: 'milestone_reacher',
    name: { tr: 'Kilometre Taşına Ulaşan', en: 'Milestone Reacher' },
    description: {
      tr: 'Önemli bir kilometre taşına ulaş',
      en: 'Reach an important milestone',
    },
    icon: '🏁',
    category: 'special',
    rarity: 'epic',
  },
  weekly_champion: {
    id: 'weekly_champion',
    name: { tr: 'Haftalık Şampiyon', en: 'Weekly Champion' },
    description: {
      tr: 'Tek haftada 50.000+ puan kazan',
      en: 'Earn 50,000+ points in a single week',
    },
    icon: '📅',
    category: 'special',
    rarity: 'epic',
  },
  monthly_champion: {
    id: 'monthly_champion',
    name: { tr: 'Aylık Şampiyon', en: 'Monthly Champion' },
    description: {
      tr: 'Tek ayda 200.000+ puan kazan',
      en: 'Earn 200,000+ points in a single month',
    },
    icon: '📆',
    category: 'special',
    rarity: 'legendary',
  },
  daily_average_king: {
    id: 'daily_average_king',
    name: { tr: 'Günlük Ortalama Kralı', en: 'Daily Average King' },
    description: {
      tr: 'Son 30 günde günlük ortalama 5.000+ puan kazan',
      en: 'Earn an average of 5,000+ points per day over the last 30 days',
    },
    icon: '👑',
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

      case 'streak_14':
        unlocked = currentStreak >= 14;
        break;

      case 'streak_30':
        unlocked = currentStreak >= 30;
        break;

      case 'streak_60':
        unlocked = currentStreak >= 60;
        break;

      case 'streak_100':
        unlocked = currentStreak >= 100;
        break;

      case 'streak_200':
        unlocked = currentStreak >= 200;
        break;

      case 'streak_365':
        unlocked = currentStreak >= 365;
        break;

      case 'points_1k':
        unlocked = totalPoints >= 1000;
        break;

      case 'points_5k':
        unlocked = totalPoints >= 5000;
        break;

      case 'points_10k':
        unlocked = totalPoints >= 10000;
        break;

      case 'points_25k':
        unlocked = totalPoints >= 25000;
        break;

      case 'points_50k':
        unlocked = totalPoints >= 50000;
        break;

      case 'points_100k':
        unlocked = totalPoints >= 100000;
        break;

      case 'points_250k':
        unlocked = totalPoints >= 250000;
        break;

      case 'points_500k':
        unlocked = totalPoints >= 500000;
        break;

      case 'points_1m':
        unlocked = totalPoints >= 1000000;
        break;

      case 'activities_10':
        unlocked = totalActivities >= 10;
        break;

      case 'activities_50':
        unlocked = totalActivities >= 50;
        break;

      case 'activities_100':
        unlocked = totalActivities >= 100;
        break;

      case 'activities_250':
        unlocked = totalActivities >= 250;
        break;

      case 'activities_500':
        unlocked = totalActivities >= 500;
        break;

      case 'activities_1000':
        unlocked = totalActivities >= 1000;
        break;

      case 'activities_2000':
        unlocked = totalActivities >= 2000;
        break;

      case 'activities_5000':
        unlocked = totalActivities >= 5000;
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

      case 'speed_demon':
        // Check if goal was completed within 6 hours today
        const todayActivities = activities.filter((a) => {
          const activityDate = startOfDay(parseISO(a.performedAt));
          return isSameDay(activityDate, today);
        });
        if (todayActivities.length > 0) {
          const todayPoints = todayActivities.reduce((sum, a) => sum + a.points, 0);
          if (todayPoints >= target) {
            const sortedToday = todayActivities.sort(
              (a, b) => parseISO(a.performedAt).getTime() - parseISO(b.performedAt).getTime()
            );
            const firstActivity = parseISO(sortedToday[0].performedAt);
            const lastActivity = parseISO(sortedToday[sortedToday.length - 1].performedAt);
            const hoursDiff = (lastActivity.getTime() - firstActivity.getTime()) / (1000 * 60 * 60);
            unlocked = hoursDiff <= 6;
          }
        }
        break;

      case 'marathon_day':
        // Check if single day has 50K+ points
        const dayPointsMap = new Map<string, number>();
        activities.forEach((a) => {
          const date = startOfDay(parseISO(a.performedAt));
          const key = date.toISOString();
          dayPointsMap.set(key, (dayPointsMap.get(key) || 0) + a.points);
        });
        unlocked = Array.from(dayPointsMap.values()).some((points) => points >= 50000);
        break;

      case 'consistency_king':
        // Check if 30 days in a row with activities at the same hour (±1 hour tolerance)
        if (activities.length >= 30) {
          const last30Activities = activities
            .map((a) => ({
              date: parseISO(a.performedAt),
              hour: parseISO(a.performedAt).getHours(),
            }))
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 30);
          // Group by day and check if same hour
          const dayHours = new Map<string, number[]>();
          last30Activities.forEach((a) => {
            const dayKey = startOfDay(a.date).toISOString();
            if (!dayHours.has(dayKey)) {
              dayHours.set(dayKey, []);
            }
            dayHours.get(dayKey)!.push(a.hour);
          });
          // Check if we have 30 consecutive days
          const sortedDays = Array.from(dayHours.keys())
            .map((k) => new Date(k))
            .sort((a, b) => b.getTime() - a.getTime())
            .slice(0, 30);
          if (sortedDays.length === 30) {
            // Check if all days have activities at similar hours
            const hours = sortedDays
              .map((day) => {
                const dayKey = day.toISOString();
                const dayHoursList = dayHours.get(dayKey) || [];
                return dayHoursList.length > 0
                  ? Math.round(dayHoursList.reduce((a, b) => a + b, 0) / dayHoursList.length)
                  : null;
              })
              .filter((h) => h !== null) as number[];
            if (hours.length >= 30) {
              // Check if hours are consistent (±1 hour)
              const firstHour = hours[0];
              unlocked = hours.every((h) => Math.abs(h - firstHour) <= 1);
            }
          }
        }
        break;

      case 'variety_seeker':
        // Check if user tried 10 different activity types
        unlocked = uniqueActivityKeys.size >= 10;
        break;

      case 'early_riser':
        // Check if 7 days in a row with activities between 6-8 AM
        const earlyRiserDays = new Set<string>();
        activities.forEach((a) => {
          const date = parseISO(a.performedAt);
          const hour = date.getHours();
          if (hour >= 6 && hour < 8) {
            const dayKey = startOfDay(date).toISOString();
            earlyRiserDays.add(dayKey);
          }
        });
        // Check for 7 consecutive days
        const earlyRiserDaysList = Array.from(earlyRiserDays)
          .map((k) => new Date(k))
          .sort((a, b) => b.getTime() - a.getTime());
        if (earlyRiserDaysList.length >= 7) {
          let consecutiveCount = 1;
          for (let i = 0; i < earlyRiserDaysList.length - 1; i++) {
            const diff = Math.abs(
              (earlyRiserDaysList[i].getTime() - earlyRiserDaysList[i + 1].getTime()) /
                (1000 * 60 * 60 * 24)
            );
            if (diff === 1) {
              consecutiveCount++;
              if (consecutiveCount >= 7) {
                unlocked = true;
                break;
              }
            } else {
              consecutiveCount = 1;
            }
          }
        }
        break;

      case 'night_trainer':
        // Check if 7 days in a row with activities between 22-24 (10 PM-12 AM)
        const nightTrainerDays = new Set<string>();
        activities.forEach((a) => {
          const date = parseISO(a.performedAt);
          const hour = date.getHours();
          if (hour >= 22 || hour < 24) {
            const dayKey = startOfDay(date).toISOString();
            nightTrainerDays.add(dayKey);
          }
        });
        const nightTrainerDaysList = Array.from(nightTrainerDays)
          .map((k) => new Date(k))
          .sort((a, b) => b.getTime() - a.getTime());
        if (nightTrainerDaysList.length >= 7) {
          let consecutiveCount = 1;
          for (let i = 0; i < nightTrainerDaysList.length - 1; i++) {
            const diff = Math.abs(
              (nightTrainerDaysList[i].getTime() - nightTrainerDaysList[i + 1].getTime()) /
                (1000 * 60 * 60 * 24)
            );
            if (diff === 1) {
              consecutiveCount++;
              if (consecutiveCount >= 7) {
                unlocked = true;
                break;
              }
            } else {
              consecutiveCount = 1;
            }
          }
        }
        break;

      case 'weekend_champion':
        // Check if 4 weeks in a row with weekend activities
        const weekendDays = new Set<string>();
        activities.forEach((a) => {
          const date = parseISO(a.performedAt);
          const dayOfWeek = date.getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            // Sunday or Saturday
            const weekKey = `${date.getFullYear()}-W${Math.ceil(
              (date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) /
                (1000 * 60 * 60 * 24 * 7)
            )}`;
            weekendDays.add(weekKey);
          }
        });
        unlocked = weekendDays.size >= 4;
        break;

      case 'perfect_quarter':
        // Check if last 90 days all have activities >= target
        const last90Days = Array.from({ length: 90 }, (_, i) => startOfDay(subDays(today, i)));
        unlocked = last90Days.every((day) => {
          const dayKey = day.toISOString();
          const dayPoints = daysWithActivities.get(dayKey) || 0;
          return dayPoints >= target;
        });
        break;

      case 'year_warrior':
        // Check if user has activities on 365 different days (not necessarily consecutive)
        unlocked = daysWithActivities.size >= 365;
        break;

      case 'comeback_king':
        // Check if user has restarted after a broken streak
        // This is tricky - we'll check if there's a gap and then activities resumed
        if (sortedDays.length >= 2) {
          // Check if there's a gap of more than 1 day
          for (let i = 0; i < sortedDays.length - 1; i++) {
            const diff = Math.abs(
              (sortedDays[i].date.getTime() - sortedDays[i + 1].date.getTime()) /
                (1000 * 60 * 60 * 24)
            );
            if (diff > 1) {
              // There's a gap, check if activities resumed after
              if (i > 0) {
                unlocked = true;
                break;
              }
            }
          }
        }
        break;

      case 'social_butterfly':
        // Check if user has activities on both weekdays and weekends
        let hasWeekday = false;
        let hasWeekend = false;
        activities.forEach((a) => {
          const date = parseISO(a.performedAt);
          const dayOfWeek = date.getDay();
          if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            hasWeekday = true;
          } else if (dayOfWeek === 0 || dayOfWeek === 6) {
            hasWeekend = true;
          }
        });
        unlocked = hasWeekday && hasWeekend;
        break;

      case 'power_hour':
        // Check if user earned 5K+ points in a single hour
        const hourPointsMap = new Map<string, number>();
        activities.forEach((a) => {
          const date = parseISO(a.performedAt);
          const hourKey = `${startOfDay(date).toISOString()}-${date.getHours()}`;
          hourPointsMap.set(hourKey, (hourPointsMap.get(hourKey) || 0) + a.points);
        });
        unlocked = Array.from(hourPointsMap.values()).some((points) => points >= 5000);
        break;

      case 'steady_eddie':
        // Check if 14 days in a row with activities in similar point range (±20%)
        if (sortedDays.length >= 14) {
          const last14Days = sortedDays.slice(0, 14);
          const dayPointsList = last14Days.map((day) => day.points);
          if (dayPointsList.length === 14 && dayPointsList.every((p) => p > 0)) {
            const avgPoints = dayPointsList.reduce((a, b) => a + b, 0) / 14;
            const tolerance = avgPoints * 0.2; // 20% tolerance
            unlocked = dayPointsList.every((p) => Math.abs(p - avgPoints) <= tolerance);
          }
        }
        break;

      case 'explorer':
        // Check if user tried all custom activities
        // This requires checking settings for custom activities
        // For now, we'll check if user has tried many different activity types
        unlocked = uniqueActivityKeys.size >= 15; // Assuming there are many custom activities
        break;

      case 'dedication':
        // Check if 100 days in a row with activities (not necessarily meeting target)
        if (sortedDays.length >= 100) {
          let consecutiveCount = 0;
          for (let i = 0; i < sortedDays.length; i++) {
            const expectedDate = startOfDay(subDays(today, consecutiveCount));
            if (isSameDay(sortedDays[i].date, expectedDate)) {
              consecutiveCount++;
              if (consecutiveCount >= 100) {
                unlocked = true;
                break;
              }
            } else {
              consecutiveCount = 0;
            }
          }
        }
        break;

      case 'streak_3':
        unlocked = currentStreak >= 3;
        break;

      case 'streak_21':
        unlocked = currentStreak >= 21;
        break;

      case 'streak_500':
        unlocked = currentStreak >= 500;
        break;

      case 'points_2_5k':
        unlocked = totalPoints >= 2500;
        break;

      case 'points_7_5k':
        unlocked = totalPoints >= 7500;
        break;

      case 'points_2m':
        unlocked = totalPoints >= 2000000;
        break;

      case 'points_5m':
        unlocked = totalPoints >= 5000000;
        break;

      case 'weekday_warrior':
        // Check if 5 weeks in a row with weekday activities
        const weekdayWeeks = new Set<string>();
        activities.forEach((a) => {
          const date = parseISO(a.performedAt);
          const dayOfWeek = date.getDay();
          if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            const weekStart = startOfWeek(date, { weekStartsOn: 1 });
            const weekKey = weekStart.toISOString();
            weekdayWeeks.add(weekKey);
          }
        });
        const weekdayWeeksList = Array.from(weekdayWeeks)
          .map((k) => new Date(k))
          .sort((a, b) => b.getTime() - a.getTime());
        if (weekdayWeeksList.length >= 5) {
          let consecutiveWeeks = 1;
          for (let i = 0; i < weekdayWeeksList.length - 1; i++) {
            const diff = Math.abs(
              (weekdayWeeksList[i].getTime() - weekdayWeeksList[i + 1].getTime()) /
                (1000 * 60 * 60 * 24 * 7)
            );
            if (diff === 1) {
              consecutiveWeeks++;
              if (consecutiveWeeks >= 5) {
                unlocked = true;
                break;
              }
            } else {
              consecutiveWeeks = 1;
            }
          }
        }
        break;

      case 'noon_warrior':
        unlocked = activities.some((a) => {
          const date = parseISO(a.performedAt);
          const hour = date.getHours();
          return hour >= 12 && hour < 14;
        });
        break;

      case 'midnight_runner':
        unlocked = activities.some((a) => {
          const date = parseISO(a.performedAt);
          const hour = date.getHours();
          return hour >= 0 && hour < 2;
        });
        break;

      case 'running_master':
        const runningCount = activities.filter((a) => a.activityKey === 'RUNNING').length;
        unlocked = runningCount >= 100;
        break;

      case 'swimming_master':
        const swimmingCount = activities.filter((a) => a.activityKey === 'SWIMMING').length;
        unlocked = swimmingCount >= 50;
        break;

      case 'strength_master':
        const strengthActivities = ['PUSH_UP', 'SIT_UP', 'WEIGHT_LIFTING', 'CRUNCH'];
        const strengthCount = activities.filter((a) =>
          strengthActivities.includes(a.activityKey)
        ).length;
        unlocked = strengthCount >= 200;
        break;

      case 'cardio_master':
        const cardioActivities = ['WALKING', 'RUNNING', 'SWIMMING', 'STAIRS'];
        const cardioCount = activities.filter((a) =>
          cardioActivities.includes(a.activityKey)
        ).length;
        unlocked = cardioCount >= 150;
        break;

      case 'spring_warrior':
        const springDays = new Set<string>();
        activities.forEach((a) => {
          const date = parseISO(a.performedAt);
          if (getSeason(date) === 'spring') {
            const dayKey = startOfDay(date).toISOString();
            springDays.add(dayKey);
          }
        });
        unlocked = springDays.size >= 30;
        break;

      case 'summer_champion':
        const summerDays = new Set<string>();
        activities.forEach((a) => {
          const date = parseISO(a.performedAt);
          if (getSeason(date) === 'summer') {
            const dayKey = startOfDay(date).toISOString();
            summerDays.add(dayKey);
          }
        });
        unlocked = summerDays.size >= 30;
        break;

      case 'autumn_hero':
        const autumnDays = new Set<string>();
        activities.forEach((a) => {
          const date = parseISO(a.performedAt);
          if (getSeason(date) === 'autumn') {
            const dayKey = startOfDay(date).toISOString();
            autumnDays.add(dayKey);
          }
        });
        unlocked = autumnDays.size >= 30;
        break;

      case 'winter_legend':
        const winterDays = new Set<string>();
        activities.forEach((a) => {
          const date = parseISO(a.performedAt);
          if (getSeason(date) === 'winter') {
            const dayKey = startOfDay(date).toISOString();
            winterDays.add(dayKey);
          }
        });
        unlocked = winterDays.size >= 30;
        break;

      case 'habit_former':
        unlocked = currentStreak >= 21;
        break;

      case 'progress_maker':
        // Compare last 7 days to previous 7 days
        const last7DaysPoints = Array.from({ length: 7 }, (_, i) => {
          const day = startOfDay(subDays(today, i));
          const dayKey = day.toISOString();
          return daysWithActivities.get(dayKey) || 0;
        }).reduce((sum, p) => sum + p, 0);
        const prev7DaysPoints = Array.from({ length: 7 }, (_, i) => {
          const day = startOfDay(subDays(today, i + 7));
          const dayKey = day.toISOString();
          return daysWithActivities.get(dayKey) || 0;
        }).reduce((sum, p) => sum + p, 0);
        if (prev7DaysPoints > 0) {
          const increase = (last7DaysPoints - prev7DaysPoints) / prev7DaysPoints;
          unlocked = increase >= 0.5; // 50% increase
        }
        break;

      case 'consistency_master':
        unlocked = currentStreak >= 60;
        break;

      case 'milestone_reacher':
        // Check if user reached any major milestone (100K, 250K, 500K, 1M points)
        unlocked =
          totalPoints >= 100000 ||
          totalPoints >= 250000 ||
          totalPoints >= 500000 ||
          totalPoints >= 1000000 ||
          currentStreak >= 100 ||
          currentStreak >= 200 ||
          currentStreak >= 365;
        break;

      case 'weekly_champion':
        // Check if any week has 50K+ points
        const weekPointsMap = new Map<string, number>();
        activities.forEach((a) => {
          const date = parseISO(a.performedAt);
          const weekStart = startOfWeek(date, { weekStartsOn: 1 });
          const weekKey = weekStart.toISOString();
          weekPointsMap.set(weekKey, (weekPointsMap.get(weekKey) || 0) + a.points);
        });
        unlocked = Array.from(weekPointsMap.values()).some((points) => points >= 50000);
        break;

      case 'monthly_champion':
        // Check if any month has 200K+ points
        const monthPointsMap = new Map<string, number>();
        activities.forEach((a) => {
          const date = parseISO(a.performedAt);
          const monthStart = startOfMonth(date);
          const monthKey = monthStart.toISOString();
          monthPointsMap.set(monthKey, (monthPointsMap.get(monthKey) || 0) + a.points);
        });
        unlocked = Array.from(monthPointsMap.values()).some((points) => points >= 200000);
        break;

      case 'daily_average_king':
        // Check if last 30 days average is 5K+ points
        const last30DaysPoints = Array.from({ length: 30 }, (_, i) => {
          const day = startOfDay(subDays(today, i));
          const dayKey = day.toISOString();
          return daysWithActivities.get(dayKey) || 0;
        });
        const avgPoints = last30DaysPoints.reduce((sum, p) => sum + p, 0) / 30;
        unlocked = avgPoints >= 5000;
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
