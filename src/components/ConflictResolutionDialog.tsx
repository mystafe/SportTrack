'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import type { ConflictStrategy } from '@/lib/cloudSync/conflictResolver';

interface ConflictResolutionDialogProps {
  open: boolean;
  onResolve: (strategy: ConflictStrategy) => void;
  onCancel: () => void;
  localCount: {
    activities: number;
    badges: number;
    challenges: number;
  };
  cloudCount: {
    activities: number;
    badges: number;
    challenges: number;
  };
}

export function ConflictResolutionDialog({
  open,
  onResolve,
  onCancel,
  localCount,
  cloudCount,
}: ConflictResolutionDialogProps) {
  const { lang } = useI18n();
  const isMobile = useIsMobile();
  const [selectedStrategy, setSelectedStrategy] = useState<ConflictStrategy>('newest');

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className={`${isMobile ? 'w-full mx-4' : 'w-full max-w-md'} bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-950 dark:text-white mb-4`}
        >
          {lang === 'tr' ? 'Senkronizasyon Çakışması' : 'Sync Conflict'}
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {lang === 'tr'
            ? 'Yerel ve bulut verileriniz arasında farklılıklar var. Nasıl devam etmek istersiniz?'
            : 'There are differences between your local and cloud data. How would you like to proceed?'}
        </p>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
              <div className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {lang === 'tr' ? 'Yerel' : 'Local'}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {localCount.activities} {lang === 'tr' ? 'aktivite' : 'activities'}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {localCount.badges} {lang === 'tr' ? 'rozet' : 'badges'}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {localCount.challenges} {lang === 'tr' ? 'hedef' : 'challenges'}
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
                {lang === 'tr' ? 'Bulut' : 'Cloud'}
              </div>
              <div className="text-blue-600 dark:text-blue-400">
                {cloudCount.activities} {lang === 'tr' ? 'aktivite' : 'activities'}
              </div>
              <div className="text-blue-600 dark:text-blue-400">
                {cloudCount.badges} {lang === 'tr' ? 'rozet' : 'badges'}
              </div>
              <div className="text-blue-600 dark:text-blue-400">
                {cloudCount.challenges} {lang === 'tr' ? 'hedef' : 'challenges'}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
              <input
                type="radio"
                name="strategy"
                value="newest"
                checked={selectedStrategy === 'newest'}
                onChange={() => setSelectedStrategy('newest')}
                className="text-brand"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {lang === 'tr' ? 'En yeni veriyi kullan' : 'Use newest data'}
              </span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
              <input
                type="radio"
                name="strategy"
                value="merge"
                checked={selectedStrategy === 'merge'}
                onChange={() => setSelectedStrategy('merge')}
                className="text-brand"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {lang === 'tr' ? 'Birleştir' : 'Merge'}
              </span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
              <input
                type="radio"
                name="strategy"
                value="local"
                checked={selectedStrategy === 'local'}
                onChange={() => setSelectedStrategy('local')}
                className="text-brand"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {lang === 'tr' ? 'Yerel veriyi kullan' : 'Use local data'}
              </span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
              <input
                type="radio"
                name="strategy"
                value="cloud"
                checked={selectedStrategy === 'cloud'}
                onChange={() => setSelectedStrategy('cloud')}
                className="text-brand"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {lang === 'tr' ? 'Bulut verisini kullan' : 'Use cloud data'}
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 font-semibold"
          >
            {lang === 'tr' ? 'İptal' : 'Cancel'}
          </button>
          <button
            onClick={() => onResolve(selectedStrategy)}
            className="flex-1 px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300"
          >
            {lang === 'tr' ? 'Devam Et' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
