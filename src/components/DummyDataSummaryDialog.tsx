'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface DummyDataSummaryDialogProps {
  open: boolean;
  statistics: {
    activitiesCount: number;
    badgesCount: number;
    challengesCount: number;
    totalPoints: number;
    dateRange: {
      start: Date;
      end: Date;
    };
  };
  onClose: () => void;
}

export function DummyDataSummaryDialog({ open, statistics, onClose }: DummyDataSummaryDialogProps) {
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!mounted || !open) return null;

  const formatDate = (date: Date): string => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        return lang === 'tr' ? 'Geçersiz tarih' : 'Invalid date';
      }
      return d.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return lang === 'tr' ? 'Geçersiz tarih' : 'Invalid date';
    }
  };

  const dialog = (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 dark:bg-black/60 backdrop-blur-md animate-fade-in safe-bottom p-4`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dummy-summary-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Card
        variant="elevated"
        size="md"
        className={`${isMobile ? 'rounded-2xl w-full max-h-[90vh] overflow-y-auto' : 'rounded-2xl max-w-lg w-full mx-4'} animate-scale-in glass-effect card-3d shadow-2xl border-2 border-white/20 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl`}
        onClick={(e) => {
          e.stopPropagation();
        }}
        header={
          <div className="flex items-center gap-3">
            <span className="text-3xl emoji-celebrate icon-bounce">🎉</span>
            <h2
              id="dummy-summary-title"
              className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-950 dark:text-white neon-glow-brand`}
            >
              {lang === 'tr' ? 'Dummy Veri Yükleme Özeti' : 'Dummy Data Loading Summary'}
            </h2>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Success Message */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 dark:from-green-900/30 dark:via-emerald-900/20 dark:to-green-900/30 border-2 border-green-300 dark:border-green-600 shadow-lg pulse-glow">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <span className="text-2xl icon-bounce">✅</span>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-bold shimmer-text`}>
                {lang === 'tr'
                  ? 'Dummy veriler başarıyla yüklendi!'
                  : 'Dummy data loaded successfully!'}
              </span>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Activities */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 via-sky-50 to-blue-50 dark:from-blue-900/30 dark:via-sky-900/20 dark:to-blue-900/30 border-2 border-blue-300 dark:border-blue-600 shadow-md hover:shadow-lg transition-all duration-300 card-3d hover:scale-105">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl icon-bounce">🏃</span>
                <div className="flex-1">
                  <div
                    className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400 font-medium`}
                  >
                    {lang === 'tr' ? 'Aktiviteler' : 'Activities'}
                  </div>
                  <div
                    className={`${isMobile ? 'text-xl' : 'text-2xl'} font-black text-blue-700 dark:text-blue-300 neon-glow`}
                  >
                    {statistics.activitiesCount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-50 dark:from-yellow-900/30 dark:via-amber-900/20 dark:to-yellow-900/30 border-2 border-yellow-300 dark:border-yellow-600 shadow-md hover:shadow-lg transition-all duration-300 card-3d hover:scale-105">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl icon-bounce">🏆</span>
                <div className="flex-1">
                  <div
                    className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400 font-medium`}
                  >
                    {lang === 'tr' ? 'Başarılar' : 'Badges'}
                  </div>
                  <div
                    className={`${isMobile ? 'text-xl' : 'text-2xl'} font-black text-yellow-700 dark:text-yellow-300 neon-glow`}
                  >
                    {statistics.badgesCount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Challenges */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 via-violet-50 to-purple-50 dark:from-purple-900/30 dark:via-violet-900/20 dark:to-purple-900/30 border-2 border-purple-300 dark:border-purple-600 shadow-md hover:shadow-lg transition-all duration-300 card-3d hover:scale-105">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl icon-bounce">🎯</span>
                <div className="flex-1">
                  <div
                    className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400 font-medium`}
                  >
                    {lang === 'tr' ? 'Hedefler' : 'Challenges'}
                  </div>
                  <div
                    className={`${isMobile ? 'text-xl' : 'text-2xl'} font-black text-purple-700 dark:text-purple-300 neon-glow`}
                  >
                    {statistics.challengesCount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Total Points */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 dark:from-emerald-900/30 dark:via-green-900/20 dark:to-emerald-900/30 border-2 border-emerald-300 dark:border-emerald-600 shadow-md hover:shadow-lg transition-all duration-300 card-3d hover:scale-105 pulse-glow">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl icon-bounce sparkle">⭐</span>
                <div className="flex-1">
                  <div
                    className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400 font-medium`}
                  >
                    {lang === 'tr' ? 'Toplam Puan' : 'Total Points'}
                  </div>
                  <div
                    className={`${isMobile ? 'text-xl' : 'text-2xl'} font-black text-emerald-700 dark:text-emerald-300 neon-glow shimmer-text`}
                  >
                    {statistics.totalPoints.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800/60 dark:via-gray-800/40 dark:to-gray-800/60 border-2 border-gray-300 dark:border-gray-600 shadow-md backdrop-blur-sm">
            <div
              className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400 mb-1.5 font-semibold flex items-center gap-2`}
            >
              <span className="text-lg">📅</span>
              <span>{lang === 'tr' ? 'Tarih Aralığı' : 'Date Range'}</span>
            </div>
            <div
              className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-gray-800 dark:text-gray-200`}
            >
              {statistics.activitiesCount > 0 ? (
                <span>
                  {formatDate(statistics.dateRange.start)} - {formatDate(statistics.dateRange.end)}
                </span>
              ) : (
                <span className="text-gray-500 dark:text-gray-400 italic">
                  {lang === 'tr' ? 'Aktivite bulunamadı' : 'No activities found'}
                </span>
              )}
            </div>
          </div>

          {/* Info Message */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 via-sky-50 to-blue-50 dark:from-blue-900/30 dark:via-sky-900/20 dark:to-blue-900/30 border-2 border-blue-300 dark:border-blue-600 shadow-md">
            <p
              className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-700 dark:text-blue-300 font-medium flex items-start gap-2`}
            >
              <span className="text-lg icon-bounce">💡</span>
              <span>
                {lang === 'tr'
                  ? 'Artık uygulamayı keşfedebilir, istatistikleri görüntüleyebilir ve başarılarınızı takip edebilirsiniz!'
                  : 'You can now explore the app, view statistics, and track your achievements!'}
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="primary"
              size={isMobile ? 'sm' : 'md'}
              onClick={onClose}
              className="flex-1 btn-enhanced animate-gradient hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {lang === 'tr' ? 'Tamam' : 'OK'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  return createPortal(dialog, document.body);
}
