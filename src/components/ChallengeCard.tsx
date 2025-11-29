'use client';

import { memo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useChallenges } from '@/lib/challengeStore';
import { Button } from '@/components/ui/Button';
import { Challenge } from '@/lib/challenges';
import { format, parseISO } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { PRESET_CHALLENGES } from '@/lib/presetChallenges';

interface ChallengeCardProps {
  challenge: Challenge;
  onEdit: () => void;
  onDelete: () => void;
}

export const ChallengeCard = memo(function ChallengeCard({
  challenge,
  onEdit,
  onDelete,
}: ChallengeCardProps) {
  const { t, lang } = useI18n();
  const { getChallengeProgress } = useChallenges();
  const progress = getChallengeProgress(challenge.id);
  const dateLocale = lang === 'tr' ? tr : enUS;
  const isMobile = useIsMobile();

  if (!progress) return null;

  // Get category from challenge or preset
  const getCategory = () => {
    // First check if challenge has category field
    if (challenge.category) {
      return challenge.category;
    }
    // Fallback to preset lookup
    if (challenge.id.startsWith('preset-')) {
      const preset = PRESET_CHALLENGES.find(
        (p) => challenge.id.startsWith(p.id + '-') || challenge.id === p.id
      );
      return preset ? preset.category : null;
    }
    // Check if it's a custom challenge
    if (
      !challenge.id.startsWith('preset-') &&
      !challenge.id.startsWith('daily-') &&
      !challenge.id.startsWith('weekly-') &&
      !challenge.id.startsWith('yearly-') &&
      challenge.type === 'custom'
    ) {
      return 'custom';
    }
    return null;
  };

  const challengeCategory = getCategory();
  const isCustom = challengeCategory === 'custom';

  const categoryLabels: Record<string, { tr: string; en: string; color: string }> = {
    motivation: {
      tr: 'Motivasyon',
      en: 'Motivation',
      color: 'bg-orange-500 dark:bg-orange-600 border-orange-600 dark:border-orange-700',
    },
    achievement: {
      tr: 'Başarı',
      en: 'Achievement',
      color: 'bg-yellow-500 dark:bg-yellow-600 border-yellow-600 dark:border-yellow-700',
    },
    consistency: {
      tr: 'Tutarlılık',
      en: 'Consistency',
      color: 'bg-red-500 dark:bg-red-600 border-red-600 dark:border-red-700',
    },
    milestone: {
      tr: 'Kilometre Taşı',
      en: 'Milestone',
      color: 'bg-green-500 dark:bg-green-600 border-green-600 dark:border-green-700',
    },
    special: {
      tr: 'Özel',
      en: 'Special',
      color: 'bg-indigo-500 dark:bg-indigo-600 border-indigo-600 dark:border-indigo-700',
    },
    custom: {
      tr: 'Özel',
      en: 'Custom',
      color: 'bg-purple-500 dark:bg-purple-600 border-purple-600 dark:border-purple-700',
    },
  };

  const getStatusColor = () => {
    switch (challenge.status) {
      case 'completed':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'failed':
      case 'expired':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'border-brand bg-brand/5';
    }
  };

  const getStatusIcon = () => {
    switch (challenge.status) {
      case 'completed':
        return '✅';
      case 'failed':
      case 'expired':
        return '❌';
      default:
        return challenge.icon || '🎯';
    }
  };

  const startDate = format(parseISO(challenge.startDate), 'dd MMM yyyy', { locale: dateLocale });
  const endDate = challenge.endDate
    ? format(parseISO(challenge.endDate), 'dd MMM yyyy', { locale: dateLocale })
    : null;

  return (
    <div
      className={`card-entrance stagger-item rounded-xl border-2 ${isMobile ? 'p-3' : 'p-4'} ${getStatusColor()} transition-all duration-300 hover:shadow-xl hover:scale-[1.02] shadow-md bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'mobile-card-lift touch-feedback' : 'magnetic-hover'} gpu-accelerated`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span
            className={`${isMobile ? 'text-xl' : 'text-2xl sm:text-3xl'} emoji-bounce flex-shrink-0`}
          >
            {getStatusIcon()}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={`text-heading-3 text-gray-950 dark:text-white ${isMobile ? 'text-sm' : ''} break-words`}
              >
                {challenge.name[lang]}
              </h3>
              {/* Badge for category - Always show if category exists */}
              {challengeCategory && categoryLabels[challengeCategory] ? (
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${categoryLabels[challengeCategory].color} text-white shadow-sm border flex-shrink-0`}
                >
                  {categoryLabels[challengeCategory][lang]}
                </span>
              ) : null}
            </div>
            <p className="text-label text-gray-700 dark:text-gray-300">
              {t(`challenges.${challenge.type}`)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Only show edit/delete buttons for custom challenges (user-created) */}
          {/* Hide for: preset challenges, daily/weekly/yearly challenges (auto-generated) */}
          {challenge.category === 'custom' &&
            !challenge.id.startsWith('preset-') &&
            !challenge.id.startsWith('daily-') &&
            !challenge.id.startsWith('weekly-') &&
            !challenge.id.startsWith('yearly-') && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size={isMobile ? 'sm' : 'sm'}
                  onClick={onEdit}
                  className={`${isMobile ? 'p-2 min-h-[36px] min-w-[36px]' : 'p-1.5'} hover:scale-110 active:scale-95 ${isMobile ? 'touch-feedback mobile-press' : ''}`}
                  aria-label={t('challenges.editChallenge')}
                >
                  ✏️
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size={isMobile ? 'sm' : 'sm'}
                  onClick={onDelete}
                  className={`${isMobile ? 'p-2 min-h-[36px] min-w-[36px]' : 'p-1.5'} hover:text-red-600 dark:hover:text-red-400 hover:scale-110 active:scale-95 ${isMobile ? 'touch-feedback mobile-press' : ''}`}
                  aria-label={t('challenges.deleteChallenge')}
                >
                  🗑️
                </Button>
              </>
            )}
        </div>
      </div>

      <p className="text-body text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
        {challenge.description[lang]}
      </p>

      <div className="space-y-2">
        <div className={`flex items-center justify-between ${isMobile ? 'text-xs' : 'text-sm'}`}>
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {t('challenges.progress')}
          </span>
          <span className="font-bold text-gray-950 dark:text-white">
            {progress.current.toLocaleString()} / {progress.target.toLocaleString()} {t('level.xp')}
          </span>
        </div>

        <div
          className={`w-full ${isMobile ? 'h-2.5' : 'h-3'} bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner relative group/progress`}
        >
          <div
            className={`h-full transition-all duration-1000 ease-out shadow-sm progress-bar-fill relative ${
              challenge.status === 'completed'
                ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600'
                : challenge.status === 'expired' || challenge.status === 'failed'
                  ? 'bg-gradient-to-r from-red-500 via-rose-500 to-red-600'
                  : 'bg-gradient-to-r from-brand via-brand-light to-brand-dark'
            }`}
            style={{ width: `${Math.min(100, progress.percentage)}%` }}
          >
            {/* Shimmer effect */}
            {progress.percentage > 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer rounded-full" />
            )}
            {/* Pulse effect when near completion */}
            {progress.percentage >= 90 && progress.percentage < 100 && (
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            )}
          </div>
          {/* Completion glow effect */}
          {progress.percentage === 100 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer rounded-full" />
          )}
        </div>

        <div
          className={`flex items-center justify-between ${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-600 dark:text-gray-400`}
        >
          <span>{Math.round(progress.percentage)}%</span>
          {progress.daysRemaining !== undefined && progress.daysRemaining > 0 && (
            <span>
              {progress.daysRemaining} {t('challenges.daysRemaining')}
            </span>
          )}
        </div>

        <div
          className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700`}
        >
          {startDate} {endDate && `- ${endDate}`}
        </div>
      </div>
    </div>
  );
});
