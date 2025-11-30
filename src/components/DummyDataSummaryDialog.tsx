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
    return new Date(date).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const dialog = (
    <div
      className={`fixed inset-0 z-[10060] flex items-center justify-center bg-black/60 ${isMobile ? '' : 'backdrop-blur-sm'} animate-fade-in safe-bottom p-4`}
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
        className={`${isMobile ? 'rounded-xl w-full max-h-[90vh] overflow-y-auto' : 'rounded-xl max-w-lg w-full mx-4'} animate-scale-in`}
        onClick={(e) => {
          e.stopPropagation();
        }}
        header={
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <h2
              id="dummy-summary-title"
              className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-950 dark:text-white`}
            >
              {lang === 'tr' ? 'Dummy Veri Yükleme Özeti' : 'Dummy Data Loading Summary'}
            </h2>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Success Message */}
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <span className="text-xl">✅</span>
              <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>
                {lang === 'tr'
                  ? 'Dummy veriler başarıyla yüklendi!'
                  : 'Dummy data loaded successfully!'}
              </span>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Activities */}
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🏃</span>
                <div>
                  <div
                    className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400`}
                  >
                    {lang === 'tr' ? 'Aktiviteler' : 'Activities'}
                  </div>
                  <div
                    className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-blue-700 dark:text-blue-300`}
                  >
                    {statistics.activitiesCount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🏆</span>
                <div>
                  <div
                    className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400`}
                  >
                    {lang === 'tr' ? 'Başarılar' : 'Badges'}
                  </div>
                  <div
                    className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-yellow-700 dark:text-yellow-300`}
                  >
                    {statistics.badgesCount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Challenges */}
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎯</span>
                <div>
                  <div
                    className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400`}
                  >
                    {lang === 'tr' ? 'Hedefler' : 'Challenges'}
                  </div>
                  <div
                    className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-purple-700 dark:text-purple-300`}
                  >
                    {statistics.challengesCount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Total Points */}
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⭐</span>
                <div>
                  <div
                    className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400`}
                  >
                    {lang === 'tr' ? 'Toplam Puan' : 'Total Points'}
                  </div>
                  <div
                    className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-emerald-700 dark:text-emerald-300`}
                  >
                    {statistics.totalPoints.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <div
              className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400 mb-1`}
            >
              {lang === 'tr' ? 'Tarih Aralığı' : 'Date Range'}
            </div>
            <div
              className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-800 dark:text-gray-200`}
            >
              {formatDate(statistics.dateRange.start)} - {formatDate(statistics.dateRange.end)}
            </div>
          </div>

          {/* Info Message */}
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-700 dark:text-blue-300`}>
              {lang === 'tr'
                ? '💡 Artık uygulamayı keşfedebilir, istatistikleri görüntüleyebilir ve başarılarınızı takip edebilirsiniz!'
                : '💡 You can now explore the app, view statistics, and track your achievements!'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="primary"
              size={isMobile ? 'sm' : 'md'}
              onClick={onClose}
              className="flex-1"
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
