'use client';

import { useState, useEffect } from 'react';
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
  };
  cloudCount: {
    activities: number;
    badges: number;
  };
  localLastModified?: Date | null;
  cloudLastModified?: Date | null;
}

export function ConflictResolutionDialog({
  open,
  onResolve,
  onCancel,
  localCount,
  cloudCount,
  localLastModified,
  cloudLastModified,
}: ConflictResolutionDialogProps) {
  const { lang } = useI18n();
  const isMobile = useIsMobile();
  const [selectedLocal, setSelectedLocal] = useState(false);
  const [selectedCloud, setSelectedCloud] = useState(false);

  // Reset selections when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedLocal(false);
      setSelectedCloud(false);
    }
  }, [open]);

  const handleLocalClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Ctrl/Cmd click: toggle selection
      setSelectedLocal(!selectedLocal);
    } else {
      // Regular click: select only this one
      setSelectedLocal(true);
      setSelectedCloud(false);
    }
  };

  const handleCloudClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Ctrl/Cmd click: toggle selection
      setSelectedCloud(!selectedCloud);
    } else {
      // Regular click: select only this one
      setSelectedCloud(true);
      setSelectedLocal(false);
    }
  };

  const handleContinue = () => {
    if (selectedLocal && selectedCloud) {
      // Both selected: merge
      onResolve('merge');
    } else if (selectedLocal) {
      // Only local selected: use local
      onResolve('local');
    } else if (selectedCloud) {
      // Only cloud selected: use cloud
      onResolve('cloud');
    } else {
      // Nothing selected: use newest
      onResolve('newest');
    }
  };

  const formatDate = (date: Date | null | undefined): string => {
    if (!date) return lang === 'tr' ? 'Bilinmiyor' : 'Unknown';
    try {
      return new Date(date).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return lang === 'tr' ? 'Bilinmiyor' : 'Unknown';
    }
  };

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
            ? 'Yerel ve bulut verileriniz arasında farklılıklar var. Hangi veriyi kullanmak istersiniz?'
            : 'There are differences between your local and cloud data. Which data would you like to use?'}
        </p>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Local Data Box */}
            <button
              type="button"
              onClick={handleLocalClick}
              className={`relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                selectedLocal
                  ? 'border-brand bg-brand/10 dark:bg-brand/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📲</span>
                  <div
                    className={`font-semibold ${
                      selectedLocal
                        ? 'text-brand dark:text-brand-light'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {lang === 'tr' ? 'Yerel' : 'Local'}
                  </div>
                </div>
                {selectedLocal && <span className="text-brand text-xl">✓</span>}
              </div>
              <div
                className={`space-y-1 text-sm ${
                  selectedLocal
                    ? 'text-gray-700 dark:text-gray-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <div>
                  {localCount.activities} {lang === 'tr' ? 'aktivite' : 'activities'}
                </div>
                <div>
                  {localCount.badges} {lang === 'tr' ? 'rozet' : 'badges'}
                </div>
              </div>
              <div
                className={`mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs ${
                  selectedLocal
                    ? 'text-gray-600 dark:text-gray-400'
                    : 'text-gray-500 dark:text-gray-500'
                }`}
              >
                <div className="font-medium">
                  {lang === 'tr' ? 'Son Değişiklik:' : 'Last Modified:'}
                </div>
                <div className="font-semibold mt-0.5">{formatDate(localLastModified)}</div>
              </div>
              {selectedLocal && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>

            {/* Cloud Data Box */}
            <button
              type="button"
              onClick={handleCloudClick}
              className={`relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                selectedCloud
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg'
                  : 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">☁️</span>
                  <div
                    className={`font-semibold ${
                      selectedCloud
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {lang === 'tr' ? 'Bulut' : 'Cloud'}
                  </div>
                </div>
                {selectedCloud && <span className="text-blue-500 text-xl">✓</span>}
              </div>
              <div
                className={`space-y-1 text-sm ${
                  selectedCloud
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-blue-600 dark:text-blue-400'
                }`}
              >
                <div>
                  {cloudCount.activities} {lang === 'tr' ? 'aktivite' : 'activities'}
                </div>
                <div>
                  {cloudCount.badges} {lang === 'tr' ? 'rozet' : 'badges'}
                </div>
              </div>
              <div
                className={`mt-2 pt-2 border-t border-blue-200 dark:border-blue-700 text-xs ${
                  selectedCloud
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-blue-500 dark:text-blue-500'
                }`}
              >
                <div className="font-medium">
                  {lang === 'tr' ? 'Son Değişiklik:' : 'Last Modified:'}
                </div>
                <div className="font-semibold mt-0.5">{formatDate(cloudLastModified)}</div>
              </div>
              {selectedCloud && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>
          </div>

          {/* Hint */}
          <div className="text-xs text-gray-500 dark:text-gray-400 italic">
            {lang === 'tr'
              ? '💡 İpucu: Ctrl (Cmd) tuşuna basılı tutarak her ikisini de seçebilirsiniz (birleştirme)'
              : '💡 Tip: Hold Ctrl (Cmd) to select both (merge)'}
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
            onClick={handleContinue}
            className="flex-1 px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300"
          >
            {lang === 'tr' ? 'Devam Et' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
