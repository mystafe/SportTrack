'use client';

import { useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { calculateActivityPerformance, type ActivityPerformance } from '@/lib/activityPerformance';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import { format, subDays, parseISO, startOfDay } from 'date-fns';

type Recommendation = {
  type: 'increase-frequency' | 'improve-consistency' | 'try-new' | 'maintain-streak' | 'set-goal';
  priority: 'high' | 'medium' | 'low';
  activityKey?: string;
  activityLabel?: string;
  activityIcon?: string;
  message: string;
  suggestion: string;
  metric?: {
    label: string;
    value: string | number;
    target?: string | number;
  };
};

export function ActivityPerformanceRecommendations() {
  const { lang } = useI18n();
  const { activities, hydrated } = useActivities();
  const isMobile = useIsMobile();

  const performances = useMemo(() => {
    if (!hydrated || activities.length === 0) return [];
    return calculateActivityPerformance(activities, 90);
  }, [activities, hydrated]);

  const recommendations = useMemo(() => {
    const recs: Recommendation[] = [];

    if (performances.length === 0) {
      return recs;
    }

    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const sevenDaysAgo = subDays(now, 7);

    // Get activities performed in last 7 days
    const recentActivityKeys = new Set<string>();
    activities.forEach((activity) => {
      if (!activity?.performedAt) return;
      try {
        const performedAt = parseISO(activity.performedAt);
        if (performedAt >= sevenDaysAgo && activity.activityKey) {
          recentActivityKeys.add(activity.activityKey);
        }
      } catch (error) {
        console.warn('Failed to parse activity date:', error, activity);
      }
    });

    // Find activities with low frequency
    const lowFrequencyActivities = performances
      .filter((p) => p.weeklyFrequency < 1 && p.totalCount > 0)
      .sort((a, b) => a.weeklyFrequency - b.weeklyFrequency)
      .slice(0, 3);

    lowFrequencyActivities.forEach((perf) => {
      if (!recentActivityKeys.has(perf.activityKey)) {
        recs.push({
          type: 'increase-frequency',
          priority: 'high',
          activityKey: perf.activityKey,
          activityLabel: lang === 'tr' ? perf.label : perf.labelEn || perf.label,
          activityIcon: perf.icon,
          message:
            lang === 'tr'
              ? `${perf.label} aktivitesini daha sık yapmalısın`
              : `You should do ${perf.labelEn || perf.label} more frequently`,
          suggestion:
            lang === 'tr'
              ? `Haftalık frekansın ${perf.weeklyFrequency.toFixed(1)}. Bunu en az 2'ye çıkarmayı hedefle.`
              : `Your weekly frequency is ${perf.weeklyFrequency.toFixed(1)}. Aim to increase it to at least 2.`,
          metric: {
            label: lang === 'tr' ? 'Haftalık Frekans' : 'Weekly Frequency',
            value: perf.weeklyFrequency.toFixed(1),
            target: '2.0',
          },
        });
      }
    });

    // Find activities with low consistency
    const lowConsistencyActivities = performances
      .filter((p) => p.consistencyScore < 50 && p.totalCount >= 5)
      .sort((a, b) => a.consistencyScore - b.consistencyScore)
      .slice(0, 3);

    lowConsistencyActivities.forEach((perf) => {
      recs.push({
        type: 'improve-consistency',
        priority: 'high',
        activityKey: perf.activityKey,
        activityLabel: lang === 'tr' ? perf.label : perf.labelEn || perf.label,
        activityIcon: perf.icon,
        message:
          lang === 'tr'
            ? `${perf.label} için tutarlılığını artırmalısın`
            : `You should improve consistency for ${perf.labelEn || perf.label}`,
        suggestion:
          lang === 'tr'
            ? `Tutarlılık skorun %${Math.round(perf.consistencyScore)}. Düzenli bir program oluşturmayı dene.`
            : `Your consistency score is ${Math.round(perf.consistencyScore)}%. Try creating a regular schedule.`,
        metric: {
          label: lang === 'tr' ? 'Tutarlılık Skoru' : 'Consistency Score',
          value: `${Math.round(perf.consistencyScore)}%`,
          target: '70%',
        },
      });
    });

    // Find activities not performed recently
    const inactiveActivities = performances
      .filter((p) => {
        if (!p.lastPerformed) return false;
        // lastPerformed is already a Date object, not a string
        const lastPerformedDate =
          p.lastPerformed instanceof Date ? p.lastPerformed : new Date(p.lastPerformed);
        return lastPerformedDate < thirtyDaysAgo && p.totalCount >= 3;
      })
      .sort((a, b) => {
        const aDate = a.lastPerformed
          ? a.lastPerformed instanceof Date
            ? a.lastPerformed.getTime()
            : new Date(a.lastPerformed).getTime()
          : 0;
        const bDate = b.lastPerformed
          ? b.lastPerformed instanceof Date
            ? b.lastPerformed.getTime()
            : new Date(b.lastPerformed).getTime()
          : 0;
        return aDate - bDate;
      })
      .slice(0, 2);

    inactiveActivities.forEach((perf) => {
      const daysSince = perf.lastPerformed
        ? Math.floor(
            (now.getTime() -
              (perf.lastPerformed instanceof Date
                ? perf.lastPerformed.getTime()
                : new Date(perf.lastPerformed).getTime())) /
              (1000 * 60 * 60 * 24)
          )
        : 0;
      recs.push({
        type: 'try-new',
        priority: 'medium',
        activityKey: perf.activityKey,
        activityLabel: lang === 'tr' ? perf.label : perf.labelEn || perf.label,
        activityIcon: perf.icon,
        message:
          lang === 'tr'
            ? `${perf.label} aktivitesini tekrar denemelisin`
            : `You should try ${perf.labelEn || perf.label} again`,
        suggestion:
          lang === 'tr'
            ? `${daysSince} gündür bu aktiviteyi yapmıyorsun. Tekrar başlamayı düşün.`
            : `You haven't done this activity for ${daysSince} days. Consider starting again.`,
        metric: {
          label: lang === 'tr' ? 'Son Yapılan' : 'Last Performed',
          value:
            daysSince > 0
              ? `${daysSince} ${lang === 'tr' ? 'gün önce' : 'days ago'}`
              : lang === 'tr'
                ? 'Hiç'
                : 'Never',
        },
      });
    });

    // Find activities with good performance to maintain
    const goodPerformances = performances
      .filter((p) => p.consistencyScore >= 70 && p.weeklyFrequency >= 2)
      .sort((a, b) => b.consistencyScore - a.consistencyScore)
      .slice(0, 2);

    goodPerformances.forEach((perf) => {
      recs.push({
        type: 'maintain-streak',
        priority: 'low',
        activityKey: perf.activityKey,
        activityLabel: lang === 'tr' ? perf.label : perf.labelEn || perf.label,
        activityIcon: perf.icon,
        message:
          lang === 'tr'
            ? `${perf.label} için harika bir performans gösteriyorsun!`
            : `You're doing great with ${perf.labelEn || perf.label}!`,
        suggestion:
          lang === 'tr'
            ? `Tutarlılık skorun %${Math.round(perf.consistencyScore)} ve haftalık frekansın ${perf.weeklyFrequency.toFixed(1)}. Bu düzeni koru!`
            : `Your consistency score is ${Math.round(perf.consistencyScore)}% and weekly frequency is ${perf.weeklyFrequency.toFixed(1)}. Keep up the good work!`,
        metric: {
          label: lang === 'tr' ? 'Tutarlılık' : 'Consistency',
          value: `${Math.round(perf.consistencyScore)}%`,
        },
      });
    });

    // General goal setting recommendation
    if (performances.length > 0 && performances.some((p) => p.totalCount > 0 && !p.lastPerformed)) {
      recs.push({
        type: 'set-goal',
        priority: 'medium',
        message:
          lang === 'tr'
            ? 'Aktivite hedefleri belirlemeyi düşün'
            : 'Consider setting activity goals',
        suggestion:
          lang === 'tr'
            ? 'Belirli aktiviteler için günlük, haftalık veya aylık hedefler belirleyerek motivasyonunu artırabilirsin.'
            : 'You can increase your motivation by setting daily, weekly, or monthly goals for specific activities.',
      });
    }

    // Sort by priority (high > medium > low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }, [performances, activities, lang]);

  const getPriorityColor = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700';
    }
  };

  const getPriorityIcon = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
    }
  };

  const getTypeIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'increase-frequency':
        return '📈';
      case 'improve-consistency':
        return '🎯';
      case 'try-new':
        return '🔄';
      case 'maintain-streak':
        return '🔥';
      case 'set-goal':
        return '🎯';
    }
  };

  if (!hydrated || recommendations.length === 0) {
    return null;
  }

  return (
    <Card
      variant="default"
      size="md"
      hoverable
      className="card-entrance"
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Performans Önerileri' : 'Performance Recommendations'}
            </h2>
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getPriorityColor(rec.priority)}`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTypeIcon(rec.type)}</span>
                  <span className="text-sm">{getPriorityIcon(rec.priority)}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    {rec.activityIcon && rec.activityLabel && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{rec.activityIcon}</span>
                        <span className="text-sm font-semibold text-gray-950 dark:text-white">
                          {rec.activityLabel}
                        </span>
                      </div>
                    )}
                    <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-1">
                      {rec.message}
                    </h3>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                      {rec.suggestion}
                    </p>
                  </div>
                </div>

                {/* Metric */}
                {rec.metric && (
                  <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {rec.metric.label}:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-950 dark:text-white">
                          {rec.metric.value}
                        </span>
                        {rec.metric.target && (
                          <>
                            <span className="text-xs text-gray-400 dark:text-gray-500">→</span>
                            <span className="text-xs font-semibold text-brand">
                              {rec.metric.target}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {recommendations.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">✨</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {lang === 'tr'
              ? 'Tüm aktivitelerin için harika bir performans gösteriyorsun!'
              : "You're performing great for all your activities!"}
          </p>
        </div>
      )}
    </Card>
  );
}
