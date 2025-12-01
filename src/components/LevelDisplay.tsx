'use client';

import { useLevel } from '@/lib/levelStore';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { getLevelTitle } from '@/lib/levelSystem';

export function LevelDisplay() {
  const { levelInfo, hydrated } = useLevel();
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();

  if (!hydrated) {
    return null;
  }

  const levelTitle = getLevelTitle(levelInfo.level, lang);
  const xpNeeded = levelInfo.xpForNextLevel - levelInfo.xpForCurrentLevel;
  const xpRemaining = xpNeeded - levelInfo.currentXP;

  return (
    <div className={`${isMobile ? 'space-y-1.5' : 'space-y-2'}`}>
      <div className="flex items-center justify-between">
        <span
          className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-medium text-gray-600 dark:text-gray-300`}
        >
          {t('level.level')}
        </span>
        <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold text-brand`}>
          {levelInfo.level} · {levelTitle}
        </span>
      </div>
      <div className={`${isMobile ? 'space-y-1' : 'space-y-1.5'}`}>
        <div
          className={`flex items-center justify-between ${isMobile ? 'text-[9px]' : 'text-[10px]'} text-gray-500 dark:text-gray-400`}
        >
          <span>
            {levelInfo.currentXP.toLocaleString()} / {xpNeeded.toLocaleString()} {t('level.xp')}
          </span>
          <span>{Math.round(levelInfo.progress * 100)}%</span>
        </div>
        <div
          className={`w-full ${isMobile ? 'h-2' : 'h-2.5'} glass-effect bg-gray-200/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full overflow-hidden relative shadow-inner border border-white/10 dark:border-gray-700/30`}
          role="progressbar"
          aria-valuenow={Math.round(levelInfo.progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${t('level.level')} ${levelInfo.level} - ${Math.round(levelInfo.progress * 100)}%`}
        >
          <div
            className={`${isMobile ? 'h-2' : 'h-2.5'} bg-gradient-to-r from-brand via-brand-light to-brand-dark rounded-full transition-all duration-700 ease-out progress-fill shadow-sm progress-bar-glow`}
            style={{ width: `${levelInfo.progress * 100}%` }}
          />
          {levelInfo.progress > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-progress-shimmer rounded-full" />
          )}
        </div>
        {xpRemaining > 0 && (
          <div
            className={`${isMobile ? 'text-[9px]' : 'text-[10px]'} text-gray-500 dark:text-gray-400`}
          >
            <span>
              {xpRemaining.toLocaleString()} {t('level.xpNeeded')} {t('level.nextLevel')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
