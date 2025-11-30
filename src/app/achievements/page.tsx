'use client';

import { useMemo, useCallback } from 'react';
import { useI18n } from '@/lib/i18n';
import { useBadges } from '@/lib/badgeStore';
import { BADGE_DEFINITIONS, Badge } from '@/lib/badges';
import { format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { PageSkeleton, BadgeCardSkeleton } from '@/components/LoadingSkeleton';
import { Card } from '@/components/ui/Card';
import { Badge as BadgeComponent } from '@/components/ui/Badge';
import { ActivityBadges } from '@/components/ActivityBadges';
import { Accordion } from '@/components/ui/Accordion';
import { lazy, Suspense } from 'react';
import { PullToRefresh } from '@/components/PullToRefresh';

// Lazy load ActivityBadges for better performance
const ActivityBadgesLazy = lazy(() =>
  import('@/components/ActivityBadges').then((m) => ({ default: m.ActivityBadges }))
);

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

    // Early return if badges not loaded yet
    if (!hydrated || badges.length === 0) {
      // Still add all locked badges for display
      const badgeDefinitionsArray = Object.values(BADGE_DEFINITIONS);
      badgeDefinitionsArray.forEach((definition) => {
        categories[definition.category].push(definition as Badge);
      });
      return categories;
    }

    const unlockedIds = new Set(badges.map((b) => b.id));

    // Add unlocked badges first
    badges.forEach((badge) => {
      const category = badge.category || 'special';
      if (categories[category]) {
        categories[category].push(badge);
      }
    });

    // Add locked badges (only if not already unlocked)
    const badgeDefinitionsArray = Object.values(BADGE_DEFINITIONS);
    badgeDefinitionsArray.forEach((definition) => {
      if (!unlockedIds.has(definition.id)) {
        categories[definition.category].push(definition as Badge);
      }
    });

    return categories;
  }, [badges, hydrated]);

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

        {/* Activity Badges Section */}
        <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
          <ActivityBadgesLazy />
        </Suspense>
      </main>
    );
  }

  const totalBadges = Object.keys(BADGE_DEFINITIONS).length;
  const unlockedCount = badges.length;
  const progress = totalBadges > 0 ? Math.round((unlockedCount / totalBadges) * 100) : 0;

  const handleRefresh = async () => {
    window.location.reload();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-6 page-transition">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-bold flex items-center gap-2 ${isMobile ? 'title-entrance' : ''}`}
          >
            <span
              className={`text-2xl sm:text-3xl ${isMobile ? 'emoji-celebrate' : 'emoji-bounce'}`}
            >
              🏆
            </span>
            <span className="text-gray-950 dark:text-white">{t('achievements.title')}</span>
          </h1>
          <p className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
            {t('achievements.subtitle')}
          </p>
        </div>

        {/* Progress Summary */}
        <Card
          variant="default"
          size="md"
          hoverable
          className="card-entrance"
          header={
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200">
                {t('achievements.progress')}
              </span>
              <span className="text-lg sm:text-xl font-bold text-gray-950 dark:text-gray-100">
                {unlockedCount} / {totalBadges}
              </span>
            </div>
          }
        >
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
        </Card>

        {/* Badges by Category - Accordion */}
        {(['streak', 'points', 'activities', 'special'] as const).map((category) => {
          const categoryBadges = badgesByCategory[category];
          const unlockedCount = categoryBadges.filter((b) => !!b.unlockedAt).length;
          const totalCount = categoryBadges.length;
          const categoryIcons = {
            streak: '🔥',
            points: '⭐',
            activities: '🏃',
            special: '✨',
          };

          return (
            <Accordion
              key={category}
              title={`${categoryLabels[category]} (${unlockedCount} / ${totalCount})`}
              icon={categoryIcons[category]}
              defaultOpen={category === 'streak' || category === 'points'}
              className="card-entrance"
            >
              <div
                className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'} gap-3 sm:gap-4`}
              >
                {categoryBadges.map((badge) => {
                  const isUnlocked = !!badge.unlockedAt;
                  return (
                    <div
                      key={badge.id}
                      className={`stagger-item relative rounded-xl border-2 p-3 sm:p-4 transition-all duration-300 overflow-hidden group ${
                        isMobile
                          ? 'mobile-card-lift touch-feedback bounce-in-mobile'
                          : 'hover:scale-105 hover:-translate-y-1'
                      } ${
                        isUnlocked
                          ? `${getRarityColor(badge.rarity)} shadow-md hover:shadow-2xl badge-glow-${badge.rarity}`
                          : 'border-gray-300 dark:border-gray-800 bg-gradient-to-br from-gray-100 via-gray-200/30 to-gray-100 dark:from-gray-900/80 dark:via-gray-900/50 dark:to-gray-900/80 opacity-50 blur-[0.5px]'
                      }`}
                    >
                      {/* Glow effect overlay for unlocked badges */}
                      {isUnlocked && (
                        <div
                          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 badge-glow-overlay-${badge.rarity} pointer-events-none rounded-xl z-0`}
                        ></div>
                      )}
                      {!isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900/20 dark:bg-gray-900/40 rounded-xl">
                          <div className="text-5xl sm:text-6xl opacity-80 dark:opacity-70 drop-shadow-lg filter blur-[0.5px]">
                            🔒
                          </div>
                        </div>
                      )}
                      <div className="relative z-10">
                        <div
                          className={`text-4xl sm:text-5xl mb-2 ${!isUnlocked ? 'opacity-20 blur-[1px]' : isMobile ? 'emoji-celebrate' : 'emoji-bounce group-hover:scale-110 group-hover:rotate-6 transition-all duration-300'}`}
                        >
                          {badge.icon}
                          {/* Particle effect for legendary badges */}
                          {isUnlocked && badge.rarity === 'legendary' && (
                            <div className="absolute inset-0 badge-particles opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                              <span className="absolute top-0 left-1/2 text-xs animate-float">
                                ✨
                              </span>
                              <span
                                className="absolute top-1/4 right-0 text-xs animate-float"
                                style={{ animationDelay: '0.2s' }}
                              >
                                ⭐
                              </span>
                              <span
                                className="absolute bottom-1/4 left-0 text-xs animate-float"
                                style={{ animationDelay: '0.4s' }}
                              >
                                💫
                              </span>
                              <span
                                className="absolute bottom-0 right-1/4 text-xs animate-float"
                                style={{ animationDelay: '0.6s' }}
                              >
                                ✨
                              </span>
                            </div>
                          )}
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
                          <BadgeComponent
                            variant={
                              isUnlocked
                                ? badge.rarity === 'common'
                                  ? 'default'
                                  : badge.rarity === 'rare'
                                    ? 'info'
                                    : badge.rarity === 'epic'
                                      ? 'primary'
                                      : 'warning'
                                : 'default'
                            }
                            size="sm"
                            className={!isUnlocked ? 'opacity-50' : ''}
                          >
                            {getRarityLabel(badge.rarity)}
                          </BadgeComponent>
                          {(() => {
                            const formattedDate = formatBadgeDate(badge.unlockedAt);
                            return formattedDate ? (
                              <span className="text-xs text-gray-500">{formattedDate}</span>
                            ) : null;
                          })()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Accordion>
          );
        })}

        {/* Activity Badges - Accordion */}
        <Accordion
          title={lang === 'tr' ? 'Aktivite Rozetleri' : 'Activity Badges'}
          icon="🎖️"
          defaultOpen={false}
          className="card-entrance"
        >
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <ActivityBadgesLazy />
          </Suspense>
        </Accordion>
      </div>
    </PullToRefresh>
  );
}
