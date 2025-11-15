'use client';

import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import type { ConflictStrategy } from '@/lib/cloudSync/conflictResolver';
import { ActivityRecord } from '@/lib/activityStore';
import { Badge } from '@/lib/badges';
import { format, parseISO } from 'date-fns';
import { getActivityLabel, getActivityUnit } from '@/lib/activityUtils';
import { resolveConflicts } from '@/lib/cloudSync/conflictResolver';
import type { CloudData } from '@/lib/cloudSync/types';
import type { ActivityDefinition } from '@/lib/activityConfig';

interface ConflictResolutionDialogProps {
  open: boolean;
  onResolve: (strategy: ConflictStrategy) => void;
  onCancel: () => void;
  localData: {
    activities: ActivityRecord[];
    badges: Badge[];
    challenges: unknown[];
    settings?: {
      customActivities?: Array<{ id: string; [key: string]: unknown }>;
      [key: string]: unknown;
    } | null;
  };
  cloudData: CloudData;
  localLastModified?: Date | null;
  cloudLastModified?: Date | null;
}

export function ConflictResolutionDialog({
  open,
  onResolve,
  onCancel,
  localData,
  cloudData,
  localLastModified,
  cloudLastModified,
}: ConflictResolutionDialogProps) {
  const { lang } = useI18n();
  const isMobile = useIsMobile();
  const [selectedLocal, setSelectedLocal] = useState(true); // Default to true for merge
  const [selectedCloud, setSelectedCloud] = useState(true); // Default to true for merge
  const [showDetails, setShowDetails] = useState(false);
  const [showMergePreview, setShowMergePreview] = useState(true); // Default to true since both are selected

  // Reset selections when dialog opens (default to merge - both selected)
  useEffect(() => {
    if (open) {
      setSelectedLocal(true); // Default to merge
      setSelectedCloud(true); // Default to merge
      setShowDetails(false);
      setShowMergePreview(true); // Show merge preview by default
    }
  }, [open]);

  // Update merge preview when selections change
  useEffect(() => {
    if (selectedLocal && selectedCloud) {
      setShowMergePreview(true);
    } else {
      setShowMergePreview(false);
    }
  }, [selectedLocal, selectedCloud]);

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

  // Find differences between local and cloud
  const differences = useMemo(() => {
    if (!localData || !cloudData) {
      return {
        localOnlyActivities: [],
        cloudOnlyActivities: [],
        differentActivities: [],
        localOnlyBadges: [],
        cloudOnlyBadges: [],
      };
    }

    const localActivities = localData.activities || [];
    // Use exercises from new structure, fallback to activities for backward compatibility
    const cloudActivities =
      (cloudData.exercises as ActivityRecord[]) || (cloudData.activities as ActivityRecord[]) || [];
    const localBadges = localData.badges || [];
    const cloudBadges = (cloudData.badges as Badge[]) || [];

    // Find activities only in local
    const localOnlyActivities = localActivities.filter(
      (local) => !cloudActivities.some((cloud) => cloud.id === local.id)
    );

    // Find activities only in cloud
    const cloudOnlyActivities = cloudActivities.filter(
      (cloud) => !localActivities.some((local) => local.id === cloud.id)
    );

    // Find activities in both but different
    const differentActivities = localActivities
      .filter((local) => {
        const cloud = cloudActivities.find((c) => c.id === local.id);
        if (!cloud) return false;
        // Compare key fields
        return (
          local.amount !== cloud.amount ||
          local.performedAt !== cloud.performedAt ||
          local.points !== cloud.points
        );
      })
      .map((local) => {
        const cloud = cloudActivities.find((c) => c.id === local.id)!;
        return { local, cloud };
      });

    // Find badges only in local
    const localOnlyBadges = localBadges.filter(
      (local) => !cloudBadges.some((cloud) => cloud.id === local.id)
    );

    // Find badges only in cloud
    const cloudOnlyBadges = cloudBadges.filter(
      (cloud) => !localBadges.some((local) => local.id === cloud.id)
    );

    return {
      localOnlyActivities,
      cloudOnlyActivities,
      differentActivities,
      localOnlyBadges,
      cloudOnlyBadges,
    };
  }, [localData, cloudData]);

  // Calculate merge preview
  const mergePreview = useMemo(() => {
    if (!selectedLocal || !selectedCloud || !localData || !cloudData) return null;

    try {
      const merged = resolveConflicts(
        {
          activities: localData.activities || [],
          settings: null,
          badges: localData.badges || [],
          challenges: localData.challenges || [],
        },
        cloudData,
        'merge'
      );

      const mergedExercises = merged.resolvedData.activities || [];
      const totalPoints = mergedExercises.reduce((sum, ex) => sum + (ex.points || 0), 0);

      return {
        exercises: mergedExercises.length,
        activities: 0, // Activity definitions are not merged
        badges: merged.resolvedData.badges.length,
        challenges: merged.resolvedData.challenges.length,
        totalPoints,
      };
    } catch (error) {
      console.error('Failed to calculate merge preview:', error);
      return null;
    }
  }, [selectedLocal, selectedCloud, localData, cloudData]);

  if (!open) return null;

  // Safety checks
  if (!localData || !cloudData) {
    console.error('ConflictResolutionDialog: localData or cloudData is missing');
    return null;
  }

  // Calculate local statistics
  const localStats = useMemo(() => {
    const exercises = localData.activities || [];
    const totalPoints = exercises.reduce((sum, ex) => sum + (ex.points || 0), 0);

    // Count custom activity definitions from settings
    const customActivitiesCount = localData.settings?.customActivities?.length || 0;

    return {
      exercises: exercises.length,
      activities: customActivitiesCount, // Custom activity definitions from settings
      badges: localData.badges?.length || 0,
      challenges: localData.challenges?.length || 0,
      totalPoints,
    };
  }, [localData]);

  // Calculate cloud statistics
  const cloudStats = useMemo(() => {
    const cloudExercises = (cloudData.exercises as ActivityRecord[]) || [];
    const cloudActivitiesLegacy = (cloudData.activities as ActivityRecord[]) || [];
    // Prefer exercises (new structure), fallback to activities (legacy)
    const exercises = cloudExercises.length > 0 ? cloudExercises : cloudActivitiesLegacy;

    // Activity definitions (aktivite tanımları) - separate from exercises
    // In CloudData, activities is ActivityDefinition[] (not ActivityRecord[])
    // Check if it's ActivityDefinition by checking for 'key' property (ActivityDefinition has 'key', ActivityRecord has 'id')
    const activitiesArray = cloudData.activities || [];

    // Filter custom activity definitions (isCustom === true)
    let activityDefCount = 0;
    if (activitiesArray.length > 0) {
      const firstItem = activitiesArray[0];
      if (
        firstItem &&
        typeof firstItem === 'object' &&
        'key' in firstItem &&
        !('id' in firstItem)
      ) {
        // This is ActivityDefinition[], count only custom ones
        activityDefCount = activitiesArray.filter(
          (activity: unknown) =>
            typeof activity === 'object' &&
            activity !== null &&
            'isCustom' in activity &&
            (activity as { isCustom?: boolean }).isCustom === true
        ).length;
      }
    }

    // Also check settings.customActivities as fallback
    if (activityDefCount === 0 && cloudData.settings?.customActivities) {
      activityDefCount = Array.isArray(cloudData.settings.customActivities)
        ? cloudData.settings.customActivities.length
        : 0;
    }

    // Total Points: Calculate from exercises array (most accurate)
    // cloudData.points might be stale or incorrect, so always calculate from actual exercises
    const totalPoints = exercises.reduce((sum, ex) => sum + (ex.points || 0), 0);

    return {
      exercises: exercises.length,
      activities: activityDefCount,
      badges: (cloudData.badges as Badge[])?.length || 0,
      challenges: (cloudData.challenges || [])?.length || 0,
      totalPoints,
    };
  }, [cloudData]);

  // Check if local and cloud data are identical
  const isIdentical = useMemo(() => {
    return (
      differences.localOnlyActivities.length === 0 &&
      differences.cloudOnlyActivities.length === 0 &&
      differences.differentActivities.length === 0 &&
      differences.localOnlyBadges.length === 0 &&
      differences.cloudOnlyBadges.length === 0 &&
      localStats.exercises === cloudStats.exercises &&
      localStats.activities === cloudStats.activities &&
      localStats.badges === cloudStats.badges &&
      localStats.challenges === cloudStats.challenges &&
      localStats.totalPoints === cloudStats.totalPoints
    );
  }, [differences, localStats, cloudStats]);

  const dialog = (
    <div
      className={`fixed inset-0 z-[9999] flex ${isMobile ? 'items-end' : 'items-center justify-center'} bg-black/50 ${isMobile ? '' : 'backdrop-blur-sm'} animate-fade-in safe-bottom`}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="conflict-resolution-title"
    >
      <div
        className={`bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'rounded-t-xl w-full max-h-[90vh] overflow-y-auto' : 'rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 max-w-3xl w-full mx-4'} border-2 border-gray-200 dark:border-gray-700 animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <h2
            id="conflict-resolution-title"
            className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-950 dark:text-white mb-4`}
          >
            {lang === 'tr' ? 'Senkronizasyon Çakışması' : 'Sync Conflict'}
          </h2>

          {isIdentical ? (
            <div
              className={`${isMobile ? 'text-xs' : 'text-sm'} mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700`}
            >
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <span className="text-lg">✅</span>
                <span className="font-semibold">
                  {lang === 'tr'
                    ? 'Yerel ve bulut verileriniz tamamen aynı!'
                    : 'Your local and cloud data are identical!'}
                </span>
              </div>
              <p
                className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-green-600 dark:text-green-500 mt-2`}
              >
                {lang === 'tr'
                  ? 'Herhangi bir senkronizasyon gerekmiyor.'
                  : 'No synchronization needed.'}
              </p>
            </div>
          ) : (
            <p
              className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400 mb-6`}
            >
              {lang === 'tr'
                ? 'Yerel ve bulut verileriniz arasında farklılıklar var. Hangi veriyi kullanmak istersiniz?'
                : 'There are differences between your local and cloud data. Which data would you like to use?'}
            </p>
          )}

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
                  className={`space-y-1 ${isMobile ? 'text-xs' : 'text-sm'} ${
                    selectedLocal
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <div>
                    <span className="font-semibold">{localStats.exercises}</span>{' '}
                    {lang === 'tr' ? 'Egzersizler' : 'Exercises'}
                  </div>
                  <div>
                    <span className="font-semibold">{localStats.activities}</span>{' '}
                    {lang === 'tr' ? 'Aktivite Tipleri' : 'Activity Types'}
                  </div>
                  <div>
                    <span className="font-semibold">{localStats.badges}</span>{' '}
                    {lang === 'tr' ? 'Başarılar' : 'Badges'}
                  </div>
                  <div>
                    <span className="font-semibold">{localStats.challenges}</span>{' '}
                    {lang === 'tr' ? 'Hedefler' : 'Challenges'}
                  </div>
                  <div className="pt-1 border-t border-gray-200 dark:border-gray-700 mt-1">
                    <span className="font-semibold">{localStats.totalPoints.toLocaleString()}</span>{' '}
                    {lang === 'tr' ? 'Toplam Puan' : 'Total Points'}
                  </div>
                </div>
                <div
                  className={`mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 ${isMobile ? 'text-[10px]' : 'text-xs'} ${
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
                  className={`space-y-1 ${isMobile ? 'text-xs' : 'text-sm'} ${
                    selectedCloud
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-blue-600 dark:text-blue-400'
                  }`}
                >
                  <div>
                    <span className="font-semibold">{cloudStats.exercises}</span>{' '}
                    {lang === 'tr' ? 'Egzersizler' : 'Exercises'}
                  </div>
                  <div>
                    <span className="font-semibold">{cloudStats.activities}</span>{' '}
                    {lang === 'tr' ? 'Aktivite Tipleri' : 'Activity Types'}
                  </div>
                  <div>
                    <span className="font-semibold">{cloudStats.badges}</span>{' '}
                    {lang === 'tr' ? 'Başarılar' : 'Badges'}
                  </div>
                  <div>
                    <span className="font-semibold">{cloudStats.challenges}</span>{' '}
                    {lang === 'tr' ? 'Hedefler' : 'Challenges'}
                  </div>
                  <div className="pt-1 border-t border-blue-200 dark:border-blue-700 mt-1">
                    <span className="font-semibold">{cloudStats.totalPoints.toLocaleString()}</span>{' '}
                    {lang === 'tr' ? 'Toplam Puan' : 'Total Points'}
                  </div>
                </div>
                <div
                  className={`mt-2 pt-2 border-t border-blue-200 dark:border-blue-700 ${isMobile ? 'text-[10px]' : 'text-xs'} ${
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

            {/* Merge Preview */}
            {showMergePreview && mergePreview && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                <div
                  className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-green-900 dark:text-green-100 mb-1`}
                >
                  🔄 {lang === 'tr' ? 'Birleştirme Önizlemesi' : 'Merge Preview'}
                </div>
                <div
                  className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-green-800 dark:text-green-200 space-y-1`}
                >
                  {lang === 'tr' ? (
                    <>
                      <div>
                        Birleştirme sonrası:{' '}
                        <span className="font-bold">{mergePreview.exercises}</span> aktivite,{' '}
                        <span className="font-bold">{mergePreview.activities}</span> aktivite
                        tanımı, <span className="font-bold">{mergePreview.badges}</span> rozet,{' '}
                        <span className="font-bold">{mergePreview.challenges}</span> hedef
                      </div>
                      <div>
                        Toplam puan:{' '}
                        <span className="font-bold">
                          {mergePreview.totalPoints.toLocaleString()}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        After merge: <span className="font-bold">{mergePreview.exercises}</span>{' '}
                        activities, <span className="font-bold">{mergePreview.activities}</span>{' '}
                        activity definitions,{' '}
                        <span className="font-bold">{mergePreview.badges}</span> badges,{' '}
                        <span className="font-bold">{mergePreview.challenges}</span> challenges
                      </div>
                      <div>
                        Total points:{' '}
                        <span className="font-bold">
                          {mergePreview.totalPoints.toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Details Toggle */}
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className={`w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300`}
            >
              {showDetails ? '▼' : '▶'} {lang === 'tr' ? 'Detayları Göster' : 'Show Details'}
            </button>

            {/* Detailed Differences */}
            {showDetails && (
              <div className="space-y-3 max-h-64 overflow-y-auto p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                {/* Local Only Activities */}
                {differences.localOnlyActivities.length > 0 && (
                  <div>
                    <div
                      className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-900 dark:text-gray-100 mb-1`}
                    >
                      📲 {lang === 'tr' ? 'Sadece Yerelde:' : 'Only in Local:'}{' '}
                      {differences.localOnlyActivities.length}{' '}
                      {lang === 'tr' ? 'aktivite' : 'activities'}
                    </div>
                    <div className="space-y-1">
                      {differences.localOnlyActivities.slice(0, 5).map((activity) => (
                        <div
                          key={activity.id}
                          className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-700 dark:text-gray-300`}
                        >
                          • {getActivityLabel(activity, lang)} - {activity.amount}{' '}
                          {getActivityUnit(activity, lang)} (
                          {format(
                            parseISO(activity.performedAt),
                            lang === 'tr' ? 'dd.MM.yyyy' : 'MM/dd/yyyy'
                          )}
                          )
                        </div>
                      ))}
                      {differences.localOnlyActivities.length > 5 && (
                        <div
                          className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-500 dark:text-gray-400 italic`}
                        >
                          ... {lang === 'tr' ? 've' : 'and'}{' '}
                          {differences.localOnlyActivities.length - 5}{' '}
                          {lang === 'tr' ? 'aktivite daha' : 'more activities'}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Cloud Only Activities */}
                {differences.cloudOnlyActivities.length > 0 && (
                  <div>
                    <div
                      className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-900 dark:text-gray-100 mb-1`}
                    >
                      ☁️ {lang === 'tr' ? 'Sadece Bulutta:' : 'Only in Cloud:'}{' '}
                      {differences.cloudOnlyActivities.length}{' '}
                      {lang === 'tr' ? 'aktivite' : 'activities'}
                    </div>
                    <div className="space-y-1">
                      {differences.cloudOnlyActivities.slice(0, 5).map((activity) => (
                        <div
                          key={activity.id}
                          className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-700 dark:text-gray-300`}
                        >
                          • {getActivityLabel(activity, lang)} - {activity.amount}{' '}
                          {getActivityUnit(activity, lang)} (
                          {format(
                            parseISO(activity.performedAt),
                            lang === 'tr' ? 'dd.MM.yyyy' : 'MM/dd/yyyy'
                          )}
                          )
                        </div>
                      ))}
                      {differences.cloudOnlyActivities.length > 5 && (
                        <div
                          className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-500 dark:text-gray-400 italic`}
                        >
                          ... {lang === 'tr' ? 've' : 'and'}{' '}
                          {differences.cloudOnlyActivities.length - 5}{' '}
                          {lang === 'tr' ? 'aktivite daha' : 'more activities'}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Different Activities */}
                {differences.differentActivities.length > 0 && (
                  <div>
                    <div
                      className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-orange-900 dark:text-orange-100 mb-1`}
                    >
                      ⚠️ {lang === 'tr' ? 'Farklı Olanlar:' : 'Different:'}{' '}
                      {differences.differentActivities.length}{' '}
                      {lang === 'tr' ? 'aktivite' : 'activities'}
                    </div>
                    <div className="space-y-2">
                      {differences.differentActivities.slice(0, 3).map(({ local, cloud }) => (
                        <div
                          key={local.id}
                          className={`${isMobile ? 'text-[10px]' : 'text-xs'} p-2 rounded bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700`}
                        >
                          <div className="font-medium text-orange-900 dark:text-orange-100 mb-1">
                            {getActivityLabel(local, lang)}
                          </div>
                          <div className="text-orange-800 dark:text-orange-200">
                            📲 {lang === 'tr' ? 'Yerel:' : 'Local:'} {local.amount}{' '}
                            {getActivityUnit(local, lang)} ({local.points}{' '}
                            {lang === 'tr' ? 'puan' : 'points'})
                          </div>
                          <div className="text-orange-800 dark:text-orange-200">
                            ☁️ {lang === 'tr' ? 'Bulut:' : 'Cloud:'} {cloud.amount}{' '}
                            {getActivityUnit(cloud, lang)} ({cloud.points}{' '}
                            {lang === 'tr' ? 'puan' : 'points'})
                          </div>
                        </div>
                      ))}
                      {differences.differentActivities.length > 3 && (
                        <div
                          className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-orange-600 dark:text-orange-400 italic`}
                        >
                          ... {lang === 'tr' ? 've' : 'and'}{' '}
                          {differences.differentActivities.length - 3}{' '}
                          {lang === 'tr' ? 'aktivite daha' : 'more activities'}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Badges */}
                {(differences.localOnlyBadges.length > 0 ||
                  differences.cloudOnlyBadges.length > 0) && (
                  <div>
                    <div
                      className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-900 dark:text-gray-100 mb-1`}
                    >
                      🏆 {lang === 'tr' ? 'Rozetler:' : 'Badges:'}
                    </div>
                    {differences.localOnlyBadges.length > 0 && (
                      <div
                        className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-700 dark:text-gray-300`}
                      >
                        📲 {lang === 'tr' ? 'Sadece Yerelde:' : 'Only in Local:'}{' '}
                        {differences.localOnlyBadges.length}
                      </div>
                    )}
                    {differences.cloudOnlyBadges.length > 0 && (
                      <div
                        className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-700 dark:text-gray-300`}
                      >
                        ☁️ {lang === 'tr' ? 'Sadece Bulutta:' : 'Only in Cloud:'}{' '}
                        {differences.cloudOnlyBadges.length}
                      </div>
                    )}
                  </div>
                )}

                {/* No Differences */}
                {differences.localOnlyActivities.length === 0 &&
                  differences.cloudOnlyActivities.length === 0 &&
                  differences.differentActivities.length === 0 &&
                  differences.localOnlyBadges.length === 0 &&
                  differences.cloudOnlyBadges.length === 0 && (
                    <div
                      className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400 italic text-center py-2`}
                    >
                      {lang === 'tr' ? 'Detaylı fark bulunamadı' : 'No detailed differences found'}
                    </div>
                  )}
              </div>
            )}

            {/* Hint */}
            <div
              className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-500 dark:text-gray-400 italic`}
            >
              {lang === 'tr'
                ? '💡 İpucu: Ctrl (Cmd) tuşuna basılı tutarak her ikisini de seçebilirsiniz (birleştirme)'
                : '💡 Tip: Hold Ctrl (Cmd) to select both (merge)'}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className={`flex-1 ${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-2 text-sm'} rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 font-semibold`}
            >
              {lang === 'tr' ? 'İptal' : 'Cancel'}
            </button>
            <button
              onClick={handleContinue}
              className={`flex-1 ${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-2 text-sm'} rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300`}
            >
              {lang === 'tr' ? 'Devam Et' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
