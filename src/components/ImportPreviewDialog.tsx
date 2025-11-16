'use client';

import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Button } from '@/components/ui/Button';
import { ActivityRecord } from '@/lib/activityStore';
import { UserSettings } from '@/lib/settingsStore';
import { Badge } from '@/lib/badges';
import { Challenge } from '@/lib/challenges';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import {
  detectDuplicates,
  validateActivities,
  validateSettings,
  validateBadge,
  validateChallenge,
} from '@/lib/dataValidation';

interface ImportPreviewData {
  exercises: ActivityRecord[];
  activities?: Array<{
    key: string;
    label: string;
    labelEn?: string;
    icon: string;
    multiplier: number;
    unit: string;
    unitEn?: string;
    defaultAmount: number;
    description?: string;
    descriptionEn?: string;
    isCustom?: boolean;
    category?: string;
  }>;
  settings?: UserSettings | null;
  userName?: string | null;
  badges?: Badge[];
  challenges?: Challenge[];
}

interface ImportPreviewDialogProps {
  open: boolean;
  data: ImportPreviewData | null;
  onConfirm: () => void;
  onCancel: () => void;
  existingExercisesCount: number;
  existingActivitiesCount: number;
}

export function ImportPreviewDialog({
  open,
  data,
  onConfirm,
  onCancel,
  existingExercisesCount,
  existingActivitiesCount,
}: ImportPreviewDialogProps) {
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const locale = lang === 'tr' ? tr : enUS;

  const previewStats = useMemo(() => {
    if (!data) return null;

    const exercises = data.exercises || [];
    const activityDefinitions = data.activities || [];
    const badges = data.badges || [];
    const challenges = data.challenges || [];

    // Calculate date range
    let dateRange: { start: Date | null; end: Date | null } = { start: null, end: null };
    if (exercises.length > 0) {
      const dates = exercises
        .map((e) => {
          try {
            return parseISO(e.performedAt);
          } catch {
            return null;
          }
        })
        .filter((d): d is Date => d !== null)
        .sort((a, b) => a.getTime() - b.getTime());

      if (dates.length > 0) {
        dateRange.start = dates[0];
        dateRange.end = dates[dates.length - 1];
      }
    }

    // Count activities by type
    const activityCounts = new Map<string, number>();
    exercises.forEach((e) => {
      const count = activityCounts.get(e.activityKey) || 0;
      activityCounts.set(e.activityKey, count + 1);
    });

    // Calculate total points
    const totalPoints = exercises.reduce((sum, e) => sum + (e.points || 0), 0);

    // Use validation service to detect duplicates and issues
    const { duplicates, unique } = detectDuplicates(exercises);
    const duplicateIds = duplicates.map((d) => d.activity.id);
    const conflicts = duplicates.map((d) => {
      const date = parseISO(d.activity.performedAt);
      return {
        id: d.activity.id,
        date: format(date, 'dd.MM.yyyy', { locale }),
        activity: d.activity.label,
      };
    });

    // Validate activities to get validation errors
    const { invalid } = validateActivities(exercises);
    const validationErrors = invalid.length;

    return {
      exercisesCount: exercises.length,
      activityDefinitionsCount: activityDefinitions.length,
      badgesCount: badges.length,
      challengesCount: challenges.length,
      dateRange,
      activityCounts: Array.from(activityCounts.entries())
        .map(([key, count]) => ({ key, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5), // Top 5 activities
      totalPoints,
      duplicateIds: duplicateIds.length,
      conflicts: conflicts.slice(0, 10), // Show first 10 conflicts
      validationErrors,
      hasUserName: Boolean(data.userName || data.settings?.name),
      userName: data.userName || data.settings?.name || null,
    };
  }, [data, locale]);

  if (!open || !data || !previewStats) return null;

  const dialog = (
    <div
      className={`fixed inset-0 z-[10000] flex ${isMobile ? 'items-end' : 'items-center justify-center'} bg-black/50 ${isMobile ? '' : 'backdrop-blur-sm'} animate-fade-in safe-bottom`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-preview-title"
    >
      <div
        className={`bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'rounded-t-xl w-full max-h-[90vh] overflow-y-auto' : 'rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 max-w-2xl w-full mx-4'} border-2 border-gray-200 dark:border-gray-700 animate-scale-in`}
      >
        <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
          {/* Header */}
          <div className="mb-4">
            <h2
              id="import-preview-title"
              className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-950 dark:text-white mb-2 flex items-center gap-2`}
            >
              <span>👀</span>
              {lang === 'tr' ? 'Import Önizlemesi' : 'Import Preview'}
            </h2>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400`}>
              {lang === 'tr'
                ? 'Aşağıdaki veriler import edilecek. Devam etmek istiyor musunuz?'
                : 'The following data will be imported. Do you want to continue?'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Exercises */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-blue-900 dark:text-blue-100 mb-1`}
              >
                {lang === 'tr' ? 'Egzersizler' : 'Exercises'}
              </div>
              <div
                className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-blue-950 dark:text-blue-50`}
              >
                {previewStats.exercisesCount.toLocaleString()}
              </div>
              {existingExercisesCount > 0 && (
                <div
                  className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-blue-700 dark:text-blue-300 mt-1`}
                >
                  {lang === 'tr'
                    ? `Mevcut: ${existingExercisesCount.toLocaleString()}`
                    : `Existing: ${existingExercisesCount.toLocaleString()}`}
                </div>
              )}
            </div>

            {/* Activity Definitions */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-purple-900 dark:text-purple-100 mb-1`}
              >
                {lang === 'tr' ? 'Aktivite Tanımları' : 'Activity Definitions'}
              </div>
              <div
                className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-purple-950 dark:text-purple-50`}
              >
                {previewStats.activityDefinitionsCount.toLocaleString()}
              </div>
              {existingActivitiesCount > 0 && (
                <div
                  className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-purple-700 dark:text-purple-300 mt-1`}
                >
                  {lang === 'tr'
                    ? `Mevcut: ${existingActivitiesCount.toLocaleString()}`
                    : `Existing: ${existingActivitiesCount.toLocaleString()}`}
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-lg p-3 border border-yellow-200 dark:border-yellow-700">
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-yellow-900 dark:text-yellow-100 mb-1`}
              >
                {lang === 'tr' ? 'Rozetler' : 'Badges'}
              </div>
              <div
                className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-yellow-950 dark:text-yellow-50`}
              >
                {previewStats.badgesCount.toLocaleString()}
              </div>
            </div>

            {/* Challenges */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-3 border border-green-200 dark:border-green-700">
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-green-900 dark:text-green-100 mb-1`}
              >
                {lang === 'tr' ? 'Hedefler' : 'Challenges'}
              </div>
              <div
                className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-green-950 dark:text-green-50`}
              >
                {previewStats.challengesCount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Date Range */}
          {previewStats.dateRange.start && previewStats.dateRange.end && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 dark:text-gray-200 mb-1`}
              >
                {lang === 'tr' ? 'Tarih Aralığı' : 'Date Range'}
              </div>
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400`}
              >
                {format(previewStats.dateRange.start, 'dd MMMM yyyy', { locale })} -{' '}
                {format(previewStats.dateRange.end, 'dd MMMM yyyy', { locale })}
              </div>
            </div>
          )}

          {/* Total Points */}
          {previewStats.totalPoints > 0 && (
            <div className="mb-4 p-3 bg-gradient-to-r from-brand/10 to-brand/5 dark:from-brand/20 dark:to-brand/10 rounded-lg border border-brand/20 dark:border-brand/30">
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 dark:text-gray-200 mb-1`}
              >
                {lang === 'tr' ? 'Toplam Puan' : 'Total Points'}
              </div>
              <div
                className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-brand dark:text-brand-light`}
              >
                {previewStats.totalPoints.toLocaleString()} {lang === 'tr' ? 'puan' : 'points'}
              </div>
            </div>
          )}

          {/* Top Activities */}
          {previewStats.activityCounts.length > 0 && (
            <div className="mb-4">
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 dark:text-gray-200 mb-2`}
              >
                {lang === 'tr' ? 'En Çok Yapılan Aktiviteler' : 'Most Performed Activities'}
              </div>
              <div className="space-y-1">
                {previewStats.activityCounts.map(({ key, count }) => {
                  const exercise = data.exercises?.find((e) => e.activityKey === key);
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-200 dark:border-gray-700"
                    >
                      <span
                        className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300`}
                      >
                        {exercise?.icon} {exercise?.label || key}
                      </span>
                      <span
                        className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-gray-900 dark:text-gray-100`}
                      >
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* User Name */}
          {previewStats.hasUserName && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-blue-900 dark:text-blue-100 mb-1`}
              >
                {lang === 'tr' ? 'Kullanıcı Adı' : 'User Name'}
              </div>
              <div
                className={`${isMobile ? 'text-sm' : 'text-base'} text-blue-950 dark:text-blue-50`}
              >
                {previewStats.userName}
              </div>
            </div>
          )}

          {/* Warnings */}
          {(previewStats.validationErrors > 0 ||
            previewStats.duplicateIds > 0 ||
            previewStats.conflicts.length > 0) && (
            <div className="mb-4 space-y-2">
              {previewStats.validationErrors > 0 && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                  <div
                    className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-red-900 dark:text-red-100 mb-1`}
                  >
                    ❌ {lang === 'tr' ? 'Geçersiz Kayıtlar' : 'Invalid Records'}
                  </div>
                  <div
                    className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-800 dark:text-red-200`}
                  >
                    {lang === 'tr'
                      ? `${previewStats.validationErrors} adet geçersiz kayıt bulundu. Bu kayıtlar atlanacak.`
                      : `${previewStats.validationErrors} invalid records found. These will be skipped.`}
                  </div>
                </div>
              )}

              {previewStats.duplicateIds > 0 && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <div
                    className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-yellow-900 dark:text-yellow-100 mb-1`}
                  >
                    ⚠️ {lang === 'tr' ? 'Tekrar Eden Kayıtlar' : 'Duplicate Records'}
                  </div>
                  <div
                    className={`${isMobile ? 'text-xs' : 'text-sm'} text-yellow-800 dark:text-yellow-200`}
                  >
                    {lang === 'tr'
                      ? `${previewStats.duplicateIds} adet tekrar eden kayıt bulundu. Bu kayıtlar atlanacak.`
                      : `${previewStats.duplicateIds} duplicate records found. These will be skipped.`}
                  </div>
                </div>
              )}

              {previewStats.conflicts.length > 0 && (
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                  <div
                    className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-orange-900 dark:text-orange-100 mb-1`}
                  >
                    ⚠️ {lang === 'tr' ? 'Olası Çakışmalar' : 'Potential Conflicts'}
                  </div>
                  <div
                    className={`${isMobile ? 'text-xs' : 'text-sm'} text-orange-800 dark:text-orange-200 mb-2`}
                  >
                    {lang === 'tr'
                      ? `${previewStats.conflicts.length} adet olası çakışma bulundu.`
                      : `${previewStats.conflicts.length} potential conflicts found.`}
                  </div>
                  {previewStats.conflicts.length <= 5 && (
                    <div className="space-y-1">
                      {previewStats.conflicts.map((conflict, idx) => (
                        <div
                          key={idx}
                          className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-orange-700 dark:text-orange-300`}
                        >
                          • {conflict.date} - {conflict.activity}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div
            className={`flex items-center ${isMobile ? 'flex-col-reverse gap-2' : 'justify-end gap-3'} mt-6`}
          >
            <Button
              type="button"
              variant="outline"
              size={isMobile ? 'md' : 'md'}
              onClick={onCancel}
              fullWidth={isMobile}
              className={isMobile ? 'min-h-[44px]' : ''}
            >
              {t('form.cancel')}
            </Button>
            <Button
              type="button"
              variant="primary"
              size={isMobile ? 'md' : 'md'}
              onClick={onConfirm}
              fullWidth={isMobile}
              className={isMobile ? 'min-h-[44px]' : ''}
            >
              {lang === 'tr' ? '✅ Import Et' : '✅ Import'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
