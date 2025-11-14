'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export function AppleHealthGuide() {
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 p-4 space-y-3">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-2 text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">📱</span>
          <span
            className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-900 dark:text-white`}
          >
            {t('appleHealth.guideTitle')}
          </span>
        </div>
        <span
          className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        >
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className="space-y-3 pt-2 border-t border-blue-200 dark:border-blue-800 animate-fade-in">
          <div className="space-y-2">
            <h4
              className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-900 dark:text-white`}
            >
              {t('appleHealth.step1')}
            </h4>
            <ol
              className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 space-y-2 list-decimal list-inside ml-2`}
            >
              <li>{t('appleHealth.step1a')}</li>
              <li>{t('appleHealth.step1b')}</li>
              <li>{t('appleHealth.step1c')}</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4
              className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-900 dark:text-white`}
            >
              {t('appleHealth.step2')}
            </h4>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300`}>
              {t('appleHealth.step2a')}
            </p>
            <div className="bg-white dark:bg-gray-800 rounded p-3 text-xs font-mono text-gray-800 dark:text-gray-200">
              {t('appleHealth.step2b')}
            </div>
          </div>

          <div className="space-y-2">
            <h4
              className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-900 dark:text-white`}
            >
              {t('appleHealth.step3')}
            </h4>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300`}>
              {t('appleHealth.step3a')}
            </p>
          </div>

          <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-3 border border-blue-200 dark:border-blue-800">
            <p
              className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-900 dark:text-blue-200 font-medium`}
            >
              ⚠️ {t('appleHealth.note')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
