'use client';

import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useActivities } from '@/lib/activityStore';
import { detectDuplicates } from '@/lib/dataValidation';
import { format, parseISO } from 'date-fns';
import { getActivityLabel, getActivityUnit } from '@/lib/activityUtils';
import { useToaster } from './Toaster';
import { Button } from '@/components/ui/Button';

interface DuplicateDetectionDialogProps {
  open: boolean;
  onClose: () => void;
}

export function DuplicateDetectionDialog({ open, onClose }: DuplicateDetectionDialogProps) {
  const { activities, deleteActivity } = useActivities();
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const { showToast } = useToaster();

  const [detectionMode, setDetectionMode] = useState<'id' | 'content' | 'both'>('both');
  const [selectedDuplicates, setSelectedDuplicates] = useState<Set<string>>(new Set());
  const [isRemoving, setIsRemoving] = useState(false);

  // Detect duplicates based on mode
  const duplicateResults = useMemo(() => {
    if (activities.length === 0) {
      return { duplicates: [], unique: activities };
    }

    const { duplicates, unique } = detectDuplicates(activities);

    // Filter duplicates based on detection mode
    let filteredDuplicates = duplicates;
    if (detectionMode === 'id') {
      filteredDuplicates = duplicates.filter((d) => d.reason.includes('Duplicate ID'));
    } else if (detectionMode === 'content') {
      filteredDuplicates = duplicates.filter((d) => d.reason.includes('Duplicate entry'));
    }

    return { duplicates: filteredDuplicates, unique };
  }, [activities, detectionMode]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSelectAll = () => {
    if (selectedDuplicates.size === duplicateResults.duplicates.length) {
      setSelectedDuplicates(new Set());
    } else {
      setSelectedDuplicates(new Set(duplicateResults.duplicates.map((d) => d.activity.id)));
    }
  };

  const handleToggleDuplicate = (id: string) => {
    const newSelected = new Set(selectedDuplicates);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDuplicates(newSelected);
  };

  const handleRemoveSelected = async () => {
    if (selectedDuplicates.size === 0) {
      showToast(
        lang === 'tr' ? 'Lütfen kaldırılacak kayıtları seçin' : 'Please select records to remove',
        'warning'
      );
      return;
    }

    setIsRemoving(true);
    try {
      let removedCount = 0;
      for (const id of selectedDuplicates) {
        try {
          deleteActivity(id);
          removedCount++;
        } catch (error) {
          console.error(`Failed to remove activity ${id}:`, error);
        }
      }

      showToast(
        lang === 'tr'
          ? `${removedCount} yinelenen kayıt kaldırıldı`
          : `${removedCount} duplicate records removed`,
        'success'
      );

      setSelectedDuplicates(new Set());
      onClose();
    } catch (error) {
      console.error('Failed to remove duplicates:', error);
      showToast(
        lang === 'tr'
          ? 'Yinelenen kayıtlar kaldırılırken hata oluştu'
          : 'Error removing duplicates',
        'error'
      );
    } finally {
      setIsRemoving(false);
    }
  };

  if (!open) return null;

  const dialog = (
    <div
      className={`fixed inset-0 z-[9999] flex ${isMobile ? 'items-end' : 'items-center justify-center'} bg-black/50 ${isMobile ? '' : 'backdrop-blur-sm'} animate-fade-in safe-bottom`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="duplicate-detection-title"
    >
      <div
        className={`bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'rounded-t-xl w-full max-h-[90vh] overflow-y-auto' : 'rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 max-w-3xl w-full mx-4'} border-2 border-gray-200 dark:border-gray-700 animate-scale-in`}
      >
        <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <h2
            id="duplicate-detection-title"
            className={`${isMobile ? 'text-xl' : 'text-lg'} font-bold text-gray-950 dark:text-white mb-4`}
          >
            {lang === 'tr' ? 'Yinelenen Kayıt Tespiti' : 'Duplicate Detection'}
          </h2>

          {/* Detection Mode Selection */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {lang === 'tr' ? 'Tespit Modu' : 'Detection Mode'}
            </label>
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-2`}>
              <Button
                type="button"
                variant={detectionMode === 'id' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setDetectionMode('id')}
                className="flex-1"
              >
                {lang === 'tr' ? 'ID' : 'ID'}
              </Button>
              <Button
                type="button"
                variant={detectionMode === 'content' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setDetectionMode('content')}
                className="flex-1"
              >
                {lang === 'tr' ? 'İçerik' : 'Content'}
              </Button>
              <Button
                type="button"
                variant={detectionMode === 'both' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setDetectionMode('both')}
                className="flex-1"
              >
                {lang === 'tr' ? 'Her İkisi' : 'Both'}
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
            <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-800 dark:text-blue-200`}>
              {lang === 'tr' ? (
                <>
                  <span className="font-bold">{duplicateResults.duplicates.length}</span> yinelenen
                  kayıt bulundu
                  <br />
                  <span className="font-bold">{duplicateResults.unique.length}</span> benzersiz
                  kayıt
                </>
              ) : (
                <>
                  <span className="font-bold">{duplicateResults.duplicates.length}</span> duplicate
                  records found
                  <br />
                  <span className="font-bold">{duplicateResults.unique.length}</span> unique records
                </>
              )}
            </div>
          </div>

          {/* Duplicate List */}
          {duplicateResults.duplicates.length > 0 ? (
            <>
              {/* Select All */}
              <div className="mb-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDuplicates.size === duplicateResults.duplicates.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-brand focus:ring-brand"
                  />
                  <span
                    className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300`}
                  >
                    {lang === 'tr' ? 'Tümünü Seç' : 'Select All'}
                  </span>
                </label>
                <span
                  className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400`}
                >
                  {selectedDuplicates.size} / {duplicateResults.duplicates.length}{' '}
                  {lang === 'tr' ? 'seçili' : 'selected'}
                </span>
              </div>

              {/* Duplicate Items */}
              <div className="mb-4 max-h-64 overflow-y-auto space-y-2">
                {duplicateResults.duplicates.map(({ activity, reason }) => (
                  <div
                    key={activity.id}
                    className={`p-3 rounded-lg border-2 ${
                      selectedDuplicates.has(activity.id)
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
                        : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDuplicates.has(activity.id)}
                        onChange={() => handleToggleDuplicate(activity.id)}
                        className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-brand focus:ring-brand"
                      />
                      <div className="flex-1">
                        <div
                          className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-900 dark:text-gray-100 mb-1`}
                        >
                          {getActivityLabel(activity, lang)} - {activity.amount}{' '}
                          {getActivityUnit(activity, lang)}
                        </div>
                        <div
                          className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-600 dark:text-gray-400 mb-1`}
                        >
                          {format(
                            parseISO(activity.performedAt),
                            lang === 'tr' ? 'dd.MM.yyyy HH:mm' : 'MM/dd/yyyy HH:mm'
                          )}{' '}
                          • {activity.points} {lang === 'tr' ? 'puan' : 'points'}
                        </div>
                        <div
                          className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-red-600 dark:text-red-400 italic`}
                        >
                          ⚠️ {reason}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size={isMobile ? 'md' : 'md'}
                  onClick={onClose}
                  fullWidth={isMobile}
                  className={isMobile ? 'min-h-[44px]' : ''}
                >
                  {lang === 'tr' ? 'İptal' : 'Cancel'}
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size={isMobile ? 'md' : 'md'}
                  onClick={handleRemoveSelected}
                  disabled={isRemoving || selectedDuplicates.size === 0}
                  loading={isRemoving}
                  fullWidth={isMobile}
                  className={isMobile ? 'min-h-[44px]' : ''}
                >
                  {isRemoving
                    ? lang === 'tr'
                      ? 'Kaldırılıyor...'
                      : 'Removing...'
                    : lang === 'tr'
                      ? `Seçilenleri Kaldır (${selectedDuplicates.size})`
                      : `Remove Selected (${selectedDuplicates.size})`}
                </Button>
              </div>
            </>
          ) : (
            <div className="mb-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-center">
              <div
                className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-green-900 dark:text-green-100`}
              >
                ✅ {lang === 'tr' ? 'Yinelenen kayıt bulunamadı!' : 'No duplicate records found!'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
