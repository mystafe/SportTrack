'use client';

import { useMemo, useCallback } from 'react';
import { useI18n } from '@/lib/i18n';
import { useBadges } from '@/lib/badgeStore';
import { BADGE_DEFINITIONS, Badge } from '@/lib/badges';
import { format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { PageSkeleton, BadgeCardSkeleton } from '@/components/LoadingSkeleton';

export default function AchievementsPage() {
  const { badges, hydrated } = useBadges();
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const dateLocale = lang === 'tr' ? tr : enUS;

  const badgesByCategory = useMemo(() => {
    const categories: Record<string, Badge[]> = {
      streak: [],
      points: [],
      activities: [],
      special: [],
    };

    const unlockedIds = new Set(badges.map((b) => b.id));

    // Add unlocked badges
    badges.forEach((badge) => {
      categories[badge.category].push(badge);
    });

    // Add locked badges
    Object.values(BADGE_DEFINITIONS).forEach((definition) => {
      if (!unlockedIds.has(definition.id)) {
        categories[definition.category].push(definition as Badge);
      }
    });

    return categories;
  }, [badges]);

  const getRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800';
      case 'rare':
        return 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'epic':
        return 'border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20';
      case 'legendary':
        return 'border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'border-gray-300 dark:border-gray-600';
    }
  };

  const getRarityLabel = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common':
        return lang === 'tr' ? 'Yaygın' : 'Common';
      case 'rare':
        return lang === 'tr' ? 'Nadir' : 'Rare';
      case 'epic':
        return lang === 'tr' ? 'Efsanevi' : 'Epic';
      case 'legendary':
        return lang === 'tr' ? 'Efsane' : 'Legendary';
      default:
        return '';
    }
  };

  const categoryLabels = {
    streak: lang === 'tr' ? 'Seriler' : 'Streaks',
    points: lang === 'tr' ? 'Puanlar' : 'Points',
    activities: lang === 'tr' ? 'Aktiviteler' : 'Activities',
    special: lang === 'tr' ? 'Özel' : 'Special',
  };

  // Helper function to safely format badge date
  const formatBadgeDate = useCallback(
    (unlockedAt: Date | undefined | null): string | null => {
      if (!unlockedAt) return null;

      try {
        // Handle Firestore Timestamp or Date string
        const dateValue =
          unlockedAt instanceof Date
            ? unlockedAt
            : typeof unlockedAt === 'string'
              ? new Date(unlockedAt)
              : (unlockedAt as any)?.toDate
                ? (unlockedAt as any).toDate()
                : new Date(unlockedAt as any);

        // Check if date is valid
        if (isNaN(dateValue.getTime())) {
          return null;
        }

        return format(dateValue, 'd MMM', { locale: dateLocale });
      } catch (error) {
        console.error('Error formatting badge date:', error, unlockedAt);
        return null;
      }
    },
    [dateLocale]
  );

  if (!hydrated) {
    return (
      <main className="space-y-6" role="main" aria-label={t('nav.achievements')}>
        <PageSkeleton />
        <div className="card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 skeleton">
          <div className="h-4 w-32 rounded skeleton mb-3" />
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gray-300 dark:bg-gray-700 rounded-full skeleton" />
          </div>
        </div>
        <div
          className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'} gap-3 sm:gap-4`}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <BadgeCardSkeleton key={i} />
          ))}
        </div>
      </main>
    );
  }

  const totalBadges = Object.keys(BADGE_DEFINITIONS).length;
  const unlockedCount = badges.length;
  const progress = totalBadges > 0 ? Math.round((unlockedCount / totalBadges) * 100) : 0;

  return (
    <div className="space-y-6 page-transition">
      <div>
        <h1
          className={`text-2xl sm:text-3xl font-bold flex items-center gap-2 ${isMobile ? 'title-entrance' : ''}`}
        >
          <span className={`text-2xl sm:text-3xl ${isMobile ? 'emoji-celebrate' : 'emoji-bounce'}`}>
            🏆
          </span>
          <span className="text-gray-950 dark:text-white">{t('achievements.title')}</span>
        </h1>
        <p className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
          {t('achievements.subtitle')}
        </p>
      </div>

      {/* Progress Summary */}
      <div className="card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200">
            {t('achievements.progress')}
          </span>
          <span className="text-lg sm:text-xl font-bold text-gray-950 dark:text-gray-100">
            {unlockedCount} / {totalBadges}
          </span>
        </div>
        <div
          className={`${isMobile ? 'h-3' : 'h-4'} bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner relative`}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${t('achievements.progress')}: ${progress}%`}
        >
          <div
            className={`h-full bg-gradient-to-r from-brand via-brand-light to-brand-dark transition-all duration-700 ease-out progress-fill shadow-sm rounded-full`}
            style={{ width: `${progress}%` }}
          />
          {progress > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-progress-shimmer rounded-full" />
          )}
        </div>
        <div className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mt-2">
          {progress}% {lang === 'tr' ? 'tamamlandı' : 'complete'}
        </div>
      </div>

      {/* Badges by Category */}
      {(['streak', 'points', 'activities', 'special'] as const).map((category) => (
        <div
          key={category}
          className="card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white mb-4">
            {categoryLabels[category]}
          </h2>
          <div
            className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'} gap-3 sm:gap-4`}
          >
            {badgesByCategory[category].map((badge) => {
              const isUnlocked = !!badge.unlockedAt;
              return (
                <div
                  key={badge.id}
                  className={`stagger-item relative rounded-xl border-2 p-3 sm:p-4 transition-all duration-300 ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : 'hover:scale-105'} ${
                    isUnlocked
                      ? `${getRarityColor(badge.rarity)} shadow-md hover:shadow-xl`
                      : 'border-gray-300 dark:border-gray-800 bg-gradient-to-br from-gray-100 via-gray-200/30 to-gray-100 dark:from-gray-900/80 dark:via-gray-900/50 dark:to-gray-900/80 opacity-50 blur-[0.5px]'
                  }`}
                >
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="text-4xl opacity-40 dark:opacity-30">🔒</div>
                    </div>
                  )}
                  <div
                    className={`text-4xl sm:text-5xl mb-2 ${!isUnlocked ? 'opacity-20 blur-[1px]' : isMobile ? 'emoji-celebrate' : 'emoji-bounce'}`}
                  >
                    {badge.icon}
                  </div>
                  <div
                    className={`text-sm sm:text-base font-bold mb-1 text-gray-950 dark:text-gray-100 ${!isUnlocked ? 'opacity-20 blur-[0.5px]' : ''}`}
                  >
                    {badge.name[lang]}
                  </div>
                  <div
                    className={`text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${!isUnlocked ? 'opacity-20 blur-[0.5px]' : ''}`}
                  >
                    {badge.description[lang]}
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isUnlocked
                          ? badge.rarity === 'common'
                            ? 'bg-gray-200 dark:bg-gray-700'
                            : badge.rarity === 'rare'
                              ? 'bg-blue-200 dark:bg-blue-800'
                              : badge.rarity === 'epic'
                                ? 'bg-purple-200 dark:bg-purple-800'
                                : 'bg-yellow-200 dark:bg-yellow-800'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      {getRarityLabel(badge.rarity)}
                    </span>
                    {(() => {
                      const formattedDate = formatBadgeDate(badge.unlockedAt);
                      return formattedDate ? (
                        <span className="text-xs text-gray-500">{formattedDate}</span>
                      ) : null;
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
