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
          {t('level.level')} {levelInfo.level} · {levelTitle}
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
          className={`w-full ${isMobile ? 'h-1.5' : 'h-2'} bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden`}
        >
          <div
            className={`${isMobile ? 'h-1.5' : 'h-2'} bg-brand transition-all duration-500 ease-out`}
            style={{ width: `${levelInfo.progress * 100}%` }}
          />
        </div>
        <div
          className={`${isMobile ? 'text-[9px]' : 'text-[10px]'} text-gray-500 dark:text-gray-400`}
        >
          {xpRemaining > 0 ? (
            <span>
              {xpRemaining.toLocaleString()} {t('level.xpNeeded')} {t('level.nextLevel')}
            </span>
          ) : (
            <span>
              {t('level.level')} {levelInfo.level}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
