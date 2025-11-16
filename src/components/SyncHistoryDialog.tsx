'use client';

import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import {
  syncHistoryService,
  type SyncHistoryItem,
  type SyncStatistics,
} from '@/lib/cloudSync/syncHistory';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';

interface SyncHistoryDialogProps {
  open: boolean;
  statistics: SyncStatistics;
  onClose: () => void;
}

export function SyncHistoryDialog({ open, statistics, onClose }: SyncHistoryDialogProps) {
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const history = syncHistoryService.getRecentSyncs(20);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const dialog = (
    <div
      className={`fixed inset-0 z-[9999] flex ${isMobile ? 'items-end' : 'items-center justify-center'} bg-black/50 ${isMobile ? '' : 'backdrop-blur-sm'} animate-fade-in safe-bottom`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sync-history-title"
    >
      <div
        className={`bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'rounded-t-xl w-full max-h-[90vh] overflow-y-auto' : 'rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 max-w-2xl w-full mx-4'} border-2 border-gray-200 dark:border-gray-700 animate-scale-in`}
      >
        <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <h2
            id="sync-history-title"
            className={`${isMobile ? 'text-xl' : 'text-lg'} font-bold text-gray-950 dark:text-white mb-4`}
          >
            {lang === 'tr' ? 'Senkronizasyon Geçmişi' : 'Sync History'}
          </h2>

          {/* Statistics */}
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
              <div
                className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-blue-600 dark:text-blue-400 mb-1`}
              >
                {lang === 'tr' ? 'Toplam Sync' : 'Total Syncs'}
              </div>
              <div
                className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-blue-900 dark:text-blue-100`}
              >
                {statistics.totalSyncs}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
              <div
                className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-green-600 dark:text-green-400 mb-1`}
              >
                {lang === 'tr' ? 'Başarılı' : 'Successful'}
              </div>
              <div
                className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-green-900 dark:text-green-100`}
              >
                {statistics.successfulSyncs}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
              <div
                className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-red-600 dark:text-red-400 mb-1`}
              >
                {lang === 'tr' ? 'Başarısız' : 'Failed'}
              </div>
              <div
                className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-red-900 dark:text-red-100`}
              >
                {statistics.failedSyncs}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700">
              <div
                className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-purple-600 dark:text-purple-400 mb-1`}
              >
                {lang === 'tr' ? 'Ortalama Süre' : 'Avg Duration'}
              </div>
              <div
                className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-purple-900 dark:text-purple-100`}
              >
                {Math.round(statistics.averageSyncDuration)}ms
              </div>
            </div>
          </div>

          {/* Recent Syncs */}
          <div className="mb-4">
            <h3
              className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-800 dark:text-gray-200 mb-2`}
            >
              {lang === 'tr' ? 'Son Senkronizasyonlar' : 'Recent Syncs'}
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.length === 0 ? (
                <div
                  className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400 text-center py-4`}
                >
                  {lang === 'tr' ? 'Henüz sync geçmişi yok' : 'No sync history yet'}
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2 rounded-lg border ${
                      item.status === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                        : item.status === 'failed'
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                          : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div
                          className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold ${
                            item.status === 'success'
                              ? 'text-green-900 dark:text-green-100'
                              : item.status === 'failed'
                                ? 'text-red-900 dark:text-red-100'
                                : 'text-yellow-900 dark:text-yellow-100'
                          }`}
                        >
                          {item.status === 'success'
                            ? '✅'
                            : item.status === 'failed'
                              ? '❌'
                              : '⚠️'}{' '}
                          {format(
                            item.timestamp,
                            lang === 'tr' ? 'dd.MM.yyyy HH:mm' : 'MM/dd/yyyy HH:mm'
                          )}
                        </div>
                        <div
                          className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-600 dark:text-gray-400 mt-1`}
                        >
                          {item.itemsSynced} {lang === 'tr' ? 'öğe' : 'items'} • {item.duration}ms
                        </div>
                        {item.error && (
                          <div
                            className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-red-600 dark:text-red-400 mt-1 truncate`}
                          >
                            {item.error}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="primary"
              size={isMobile ? 'md' : 'md'}
              onClick={onClose}
              fullWidth={isMobile}
            >
              {lang === 'tr' ? 'Kapat' : 'Close'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
