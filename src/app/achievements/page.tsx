'use client';

import { useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useBadges } from '@/lib/badgeStore';
import { BADGE_DEFINITIONS, Badge } from '@/lib/badges';
import { format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

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
      special: []
    };

    const unlockedIds = new Set(badges.map(b => b.id));

    // Add unlocked badges
    badges.forEach(badge => {
      categories[badge.category].push(badge);
    });

    // Add locked badges
    Object.values(BADGE_DEFINITIONS).forEach(definition => {
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
    special: lang === 'tr' ? 'Özel' : 'Special'
  };

  if (!hydrated) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const totalBadges = Object.keys(BADGE_DEFINITIONS).length;
  const unlockedCount = badges.length;
  const progress = totalBadges > 0 ? Math.round((unlockedCount / totalBadges) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">{t('achievements.title')}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t('achievements.subtitle')}
        </p>
      </div>

      {/* Progress Summary */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('achievements.progress')}
          </span>
          <span className="text-lg font-bold">
            {unlockedCount} / {totalBadges}
          </span>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {progress}% {lang === 'tr' ? 'tamamlandı' : 'complete'}
        </div>
      </div>

      {/* Badges by Category */}
      {(['streak', 'points', 'activities', 'special'] as const).map(category => (
        <div key={category} className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-card">
          <h2 className="text-lg font-semibold mb-4">{categoryLabels[category]}</h2>
          <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'} gap-3 sm:gap-4`}>
            {badgesByCategory[category].map(badge => {
              const isUnlocked = !!badge.unlockedAt;
              return (
                <div
                  key={badge.id}
                  className={`relative rounded-lg border-2 p-3 sm:p-4 transition-all duration-200 ${
                    isUnlocked
                      ? `${getRarityColor(badge.rarity)} hover:scale-105`
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60'
                  }`}
                >
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl opacity-30">🔒</div>
                    </div>
                  )}
                  <div className={`text-4xl mb-2 ${!isUnlocked ? 'opacity-30' : ''}`}>
                    {badge.icon}
                  </div>
                  <div className={`text-sm font-semibold mb-1 ${!isUnlocked ? 'opacity-30' : ''}`}>
                    {badge.name[lang]}
                  </div>
                  <div className={`text-xs text-gray-600 dark:text-gray-400 mb-2 ${!isUnlocked ? 'opacity-30' : ''}`}>
                    {badge.description[lang]}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isUnlocked
                        ? badge.rarity === 'common'
                          ? 'bg-gray-200 dark:bg-gray-700'
                          : badge.rarity === 'rare'
                          ? 'bg-blue-200 dark:bg-blue-800'
                          : badge.rarity === 'epic'
                          ? 'bg-purple-200 dark:bg-purple-800'
                          : 'bg-yellow-200 dark:bg-yellow-800'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      {getRarityLabel(badge.rarity)}
                    </span>
                    {isUnlocked && badge.unlockedAt && (
                      <span className="text-xs text-gray-500">
                        {format(badge.unlockedAt, 'd MMM', { locale: dateLocale })}
                      </span>
                    )}
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

