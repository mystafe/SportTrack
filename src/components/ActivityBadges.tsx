'use client';

import { useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import {
  getAllActivityBadges,
  getActivityBadgesByActivity,
  getUnlockedActivityBadges,
  type ActivityBadge,
} from '@/lib/activityBadges';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import { format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';

export function ActivityBadges() {
  const { lang } = useI18n();
  const { activities, hydrated } = useActivities();
  const isMobile = useIsMobile();
  const dateLocale = lang === 'tr' ? tr : enUS;

  const allBadges = useMemo(() => {
    if (!hydrated || activities.length === 0) return [];
    return getAllActivityBadges(activities);
  }, [activities, hydrated]);

  const unlockedBadges = useMemo(() => {
    return getUnlockedActivityBadges(activities);
  }, [activities]);

  const badgesByActivity = useMemo(() => {
    return getActivityBadgesByActivity(activities);
  }, [activities]);

  const getRarityColor = (rarity: ActivityBadge['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800';
      case 'rare':
        return 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'epic':
        return 'border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20';
      case 'legendary':
        return 'border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    }
  };

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );

  if (!hydrated || allBadges.length === 0) {
    return null;
  }

  const totalBadges = allBadges.length;
  const unlockedCount = unlockedBadges.length;
  const progress = totalBadges > 0 ? Math.round((unlockedCount / totalBadges) * 100) : 0;

  return (
    <Card
      variant="default"
      size="md"
      hoverable
      className="card-entrance"
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎖️</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Aktivite Rozetleri' : 'Activity Badges'}
            </h2>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Progress Summary */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-950 dark:text-white">
              {lang === 'tr' ? 'İlerleme' : 'Progress'}
            </span>
            <span className="text-sm font-bold text-brand">
              {unlockedCount} / {totalBadges}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand to-brand-dark transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {progress}% {lang === 'tr' ? 'tamamlandı' : 'completed'}
          </div>
        </div>

        {/* Badges by Activity */}
        <div className="space-y-4">
          {Array.from(badgesByActivity.entries()).map(([activityKey, badges]) => {
            const unlockedForActivity = badges.filter((b) => b.unlockedAt !== undefined);
            const firstBadge = badges[0];

            return (
              <div
                key={activityKey}
                className="p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{firstBadge.activityIcon}</span>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-950 dark:text-white">
                      {lang === 'tr'
                        ? firstBadge.activityLabel
                        : firstBadge.activityLabelEn || firstBadge.activityLabel}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {unlockedForActivity.length} / {badges.length}{' '}
                      {lang === 'tr' ? 'rozet açıldı' : 'badges unlocked'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {badges.map((badge) => {
                    const isUnlocked = badge.unlockedAt !== undefined;

                    return (
                      <div
                        key={badge.id}
                        className={`p-2 rounded-lg border-2 text-center transition-all duration-200 ${
                          isUnlocked
                            ? getRarityColor(badge.rarity)
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 opacity-50'
                        } ${isUnlocked ? 'hover:scale-105 cursor-pointer' : ''}`}
                        title={
                          isUnlocked
                            ? `${badge.name[lang]} - ${badge.description[lang]}`
                            : badge.description[lang]
                        }
                      >
                        <div className="text-lg mb-1">{badge.icon}</div>
                        <div
                          className={`text-xs font-semibold ${
                            isUnlocked
                              ? 'text-gray-950 dark:text-white'
                              : 'text-gray-400 dark:text-gray-600'
                          }`}
                        >
                          {badge.milestone}
                        </div>
                        {isUnlocked && badge.unlockedAt && (
                          <div className="text-[8px] text-gray-500 dark:text-gray-500 mt-1">
                            {format(badge.unlockedAt, 'dd MMM', { locale: dateLocale })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {badgesByActivity.size === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🎖️</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lang === 'tr' ? 'Henüz aktivite rozeti yok' : 'No activity badges yet'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
