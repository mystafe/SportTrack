'use client';

import { useI18n } from '@/lib/i18n';
import { useChallenges } from '@/lib/challengeStore';
import { Challenge } from '@/lib/challenges';
import { format, parseISO } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';

interface ChallengeCardProps {
  challenge: Challenge;
  onEdit: () => void;
  onDelete: () => void;
}

export function ChallengeCard({ challenge, onEdit, onDelete }: ChallengeCardProps) {
  const { t, lang } = useI18n();
  const { getChallengeProgress } = useChallenges();
  const progress = getChallengeProgress(challenge.id);
  const dateLocale = lang === 'tr' ? tr : enUS;

  if (!progress) return null;

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
    <div className={`card-entrance rounded-xl border-2 p-4 ${getStatusColor()} transition-all duration-300 hover:shadow-xl shadow-md`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl emoji-bounce">{getStatusIcon()}</span>
          <div>
            <h3 className="font-bold text-gray-950 dark:text-white text-sm sm:text-base">
              {challenge.name[lang]}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
              {t(`challenges.${challenge.type}`)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:scale-110 active:scale-95 transition-all duration-200"
            aria-label={t('challenges.editChallenge')}
          >
            ✏️
          </button>
          {challenge.type !== 'daily' || !challenge.id.startsWith('daily-') ? (
            <button
              type="button"
              onClick={onDelete}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:scale-110 active:scale-95 transition-all duration-200"
              aria-label={t('challenges.deleteChallenge')}
            >
              🗑️
            </button>
          ) : null}
        </div>
      </div>

      <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
        {challenge.description[lang]}
      </p>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {t('challenges.progress')}
          </span>
          <span className="font-bold text-gray-950 dark:text-white">
            {progress.current.toLocaleString()} / {progress.target.toLocaleString()} {t('level.xp')}
          </span>
        </div>

        <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-500 shadow-sm ${
              challenge.status === 'completed'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : challenge.status === 'expired' || challenge.status === 'failed'
                ? 'bg-gradient-to-r from-red-500 to-rose-500'
                : 'bg-gradient-to-r from-brand to-brand-dark'
            }`}
            style={{ width: `${Math.min(100, progress.percentage)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-400">
          <span>{Math.round(progress.percentage)}%</span>
          {progress.daysRemaining !== undefined && progress.daysRemaining > 0 && (
            <span>{progress.daysRemaining} {t('challenges.daysRemaining')}</span>
          )}
        </div>

        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
          {startDate} {endDate && `- ${endDate}`}
        </div>
      </div>
    </div>
  );
}

