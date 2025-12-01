/**
 * Smart Insights Generator
 * Analyzes user activity patterns and generates personalized tips and insights
 */

import { ActivityRecord } from './activityStore';
import { calculateWeeklyStats, calculateStreakStats } from './statisticsUtils';
import { compareWeeks } from './comparisonUtils';
import { startOfWeek, endOfWeek, startOfDay, parseISO, format, getDay, isWeekend } from 'date-fns';
import { DEFAULT_DAILY_TARGET } from './activityConfig';

export type InsightType = 'motivation' | 'tip' | 'achievement' | 'warning' | 'suggestion';

export interface Insight {
  type: InsightType;
  title: { tr: string; en: string };
  message: { tr: string; en: string };
  icon: string;
  priority: number; // Higher = more important
  actionable?: boolean; // Whether user can act on this insight
}

/**
 * Generate smart insights based on user activity data
 */
export function generateSmartInsights(
  activities: ActivityRecord[],
  dailyTarget: number,
  lang: 'tr' | 'en'
): Insight[] {
  const insights: Insight[] = [];

  if (activities.length === 0) {
    return [
      {
        type: 'motivation',
        title: {
          tr: 'Başlamaya Hazır mısın?',
          en: 'Ready to Start?',
        },
        message: {
          tr: 'İlk aktiviteni ekleyerek fitness yolculuğuna başla! Her adım önemli.',
          en: 'Start your fitness journey by adding your first activity! Every step counts.',
        },
        icon: '🚀',
        priority: 10,
        actionable: true,
      },
    ];
  }

  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  // Get current week activities
  const currentWeekActivities = activities.filter((activity) => {
    const activityDate = startOfDay(parseISO(activity.performedAt));
    return activityDate >= currentWeekStart && activityDate <= currentWeekEnd;
  });

  // Calculate statistics
  const weeklyStats = calculateWeeklyStats(activities, dailyTarget, 4);
  const currentWeek = weeklyStats[weeklyStats.length - 1];
  const streakStats = calculateStreakStats(activities, dailyTarget);
  const weekComparison = compareWeeks(activities, dailyTarget);

  // Insight 1: Streak motivation
  if (streakStats.currentStreak > 0) {
    insights.push({
      type: 'achievement',
      title: {
        tr: `${streakStats.currentStreak} Günlük Seri! 🔥`,
        en: `${streakStats.currentStreak} Day Streak! 🔥`,
      },
      message: {
        tr: `Harika gidiyorsun! ${streakStats.currentStreak} gün üst üste hedefini tamamladın. Serini korumaya devam et!`,
        en: `You're doing great! You've completed your goal ${streakStats.currentStreak} days in a row. Keep your streak going!`,
      },
      icon: '🔥',
      priority: 9,
    });
  }

  // Insight 2: Week comparison
  if (weekComparison) {
    const change = weekComparison.change.pointsPercent;
    if (change > 10) {
      insights.push({
        type: 'achievement',
        title: {
          tr: 'Geçen Haftaya Göre %' + Math.round(change) + ' Daha İyi! 📈',
          en: Math.round(change) + '% Better Than Last Week! 📈',
        },
        message: {
          tr: `Harika ilerleme! Bu hafta geçen haftaya göre %${Math.round(change)} daha fazla puan topladın.`,
          en: `Great progress! You've earned ${Math.round(change)}% more points this week compared to last week.`,
        },
        icon: '📈',
        priority: 8,
      });
    } else if (change < -10) {
      insights.push({
        type: 'warning',
        title: {
          tr: 'Hedefine Ulaşmak İçin Daha Fazla Çaba Göster',
          en: 'Push Harder to Reach Your Goal',
        },
        message: {
          tr: `Bu hafta geçen haftaya göre %${Math.round(Math.abs(change))} daha az aktivite yaptın. Küçük adımlarla başlayarak tekrar toparlanabilirsin!`,
          en: `You've been ${Math.round(Math.abs(change))}% less active this week compared to last week. You can bounce back by starting with small steps!`,
        },
        icon: '💪',
        priority: 7,
        actionable: true,
      });
    }
  }

  // Insight 3: Completion rate
  if (currentWeek.completionRate < 50) {
    insights.push({
      type: 'suggestion',
      title: {
        tr: 'Haftalık Hedefini Tamamlamaya Yaklaşıyorsun',
        en: "You're Close to Completing Your Weekly Goal",
      },
      message: {
        tr: `Bu hafta hedefinin %${Math.round(currentWeek.completionRate)}'sini tamamladın. Kalan günlerde biraz daha çaba göstererek haftayı tamamlayabilirsin!`,
        en: `You've completed ${Math.round(currentWeek.completionRate)}% of your weekly goal. Push a bit more in the remaining days to finish the week strong!`,
      },
      icon: '🎯',
      priority: 6,
      actionable: true,
    });
  } else if (currentWeek.completionRate >= 100) {
    insights.push({
      type: 'achievement',
      title: {
        tr: 'Mükemmel Hafta! 🌟',
        en: 'Perfect Week! 🌟',
      },
      message: {
        tr: 'Tebrikler! Bu hafta her gün hedefini tamamladın. Bu harika bir başarı!',
        en: 'Congratulations! You completed your goal every day this week. This is an amazing achievement!',
      },
      icon: '🌟',
      priority: 9,
    });
  }

  // Insight 4: Activity pattern (weekend vs weekday)
  const weekdayActivities = currentWeekActivities.filter((a) => {
    const day = getDay(startOfDay(parseISO(a.performedAt)));
    return day >= 1 && day <= 5; // Monday to Friday
  });
  const weekendActivities = currentWeekActivities.filter((a) => {
    const day = getDay(startOfDay(parseISO(a.performedAt)));
    return day === 0 || day === 6; // Saturday or Sunday
  });

  const weekdayPoints = weekdayActivities.reduce((sum, a) => sum + a.points, 0);
  const weekendPoints = weekendActivities.reduce((sum, a) => sum + a.points, 0);
  const weekdayAvg = weekdayActivities.length > 0 ? weekdayPoints / weekdayActivities.length : 0;
  const weekendAvg = weekendActivities.length > 0 ? weekendPoints / weekendActivities.length : 0;

  if (weekendAvg < weekdayAvg * 0.5 && weekendActivities.length > 0) {
    insights.push({
      type: 'tip',
      title: {
        tr: 'Hafta Sonları Daha Aktif Olabilirsin',
        en: 'You Could Be More Active on Weekends',
      },
      message: {
        tr: 'Hafta içi günlere göre hafta sonlarında daha az aktivite yapıyorsun. Hafta sonları da küçük bir yürüyüş veya egzersiz yaparak rutinini koruyabilirsin!',
        en: "You're less active on weekends compared to weekdays. You can maintain your routine by doing a small walk or exercise on weekends too!",
      },
      icon: '🏃',
      priority: 5,
      actionable: true,
    });
  }

  // Insight 5: Consistency tip
  const daysWithActivity = new Set(
    currentWeekActivities.map((a) => format(startOfDay(parseISO(a.performedAt)), 'yyyy-MM-dd'))
  ).size;

  if (daysWithActivity < 4 && currentWeekActivities.length > 0) {
    insights.push({
      type: 'tip',
      title: {
        tr: 'Tutarlılık Anahtardır',
        en: 'Consistency is Key',
      },
      message: {
        tr: `Bu hafta ${daysWithActivity} gün aktivite yaptın. Her gün küçük bir aktivite bile olsa yapmak, büyük farklar yaratır!`,
        en: `You've been active on ${daysWithActivity} days this week. Even a small activity every day makes a big difference!`,
      },
      icon: '📅',
      priority: 6,
      actionable: true,
    });
  }

  // Insight 6: Target adjustment suggestion
  if (currentWeek.completionRate >= 100 && currentWeek.averagePerDay > dailyTarget * 1.2) {
    insights.push({
      type: 'suggestion',
      title: {
        tr: 'Hedefini Artırmayı Düşün',
        en: 'Consider Increasing Your Goal',
      },
      message: {
        tr: `Harika! Hedefini sürekli aşıyorsun (ortalama ${Math.round(currentWeek.averagePerDay)} puan/gün). Hedefini biraz artırarak kendini daha fazla zorlayabilirsin!`,
        en: `Great! You're consistently exceeding your goal (average ${Math.round(currentWeek.averagePerDay)} points/day). You can challenge yourself more by slightly increasing your goal!`,
      },
      icon: '🎯',
      priority: 5,
      actionable: true,
    });
  }

  // Insight 7: Motivation for low activity
  if (currentWeek.totalPoints < dailyTarget * 2) {
    insights.push({
      type: 'motivation',
      title: {
        tr: 'Her Yolculuk Bir Adımla Başlar',
        en: 'Every Journey Starts with a Step',
      },
      message: {
        tr: 'Küçük başlangıçlar büyük sonuçlara yol açar. Bugün küçük bir aktivite ekleyerek başlayabilirsin!',
        en: 'Small beginnings lead to great results. You can start by adding a small activity today!',
      },
      icon: '🌱',
      priority: 7,
      actionable: true,
    });
  }

  // Sort by priority (highest first) and return top 3
  return insights.sort((a, b) => b.priority - a.priority).slice(0, 3);
}
