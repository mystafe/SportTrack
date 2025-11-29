'use client';

import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import type { ConflictStrategy } from '@/lib/cloudSync/conflictResolver';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ActivityRecord } from '@/lib/activityStore';
import { Badge } from '@/lib/badges';
import type { Challenge } from '@/lib/challenges';
import { format, parseISO } from 'date-fns';
import { getActivityLabel, getActivityUnit } from '@/lib/activityUtils';
import { resolveConflicts } from '@/lib/cloudSync/conflictResolver';
import type { CloudData } from '@/lib/cloudSync/types';
import type { ActivityDefinition } from '@/lib/activityConfig';
import type { UserSettings } from '@/lib/settingsStore';
import { useSettings } from '@/lib/settingsStore';
import { STORAGE_KEYS } from '@/lib/constants';

interface ConflictResolutionDialogProps {
  open: boolean;
  onResolve: (strategy: ConflictStrategy) => void;
  onCancel: () => void;
  localData: {
    activities: ActivityRecord[];
    badges: Badge[];
    challenges: unknown[];
    settings?: UserSettings | null;
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
  const { settings: currentSettings } = useSettings(); // Get current settings from store
  const [selectedLocal, setSelectedLocal] = useState(false); // Default to false - user must choose
  const [selectedCloud, setSelectedCloud] = useState(false); // Default to false - user must choose
  const [showDetails, setShowDetails] = useState(false);
  const [showMergePreview, setShowMergePreview] = useState(false); // Default to false - user must select both

  // Track localStorage changes for theme and language to force re-computation
  const [localStorageVersion, setLocalStorageVersion] = useState(0);

  useEffect(() => {
    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.THEME || e.key === STORAGE_KEYS.LANGUAGE) {
        setLocalStorageVersion((v) => v + 1);
      }
    };

    // Also listen for custom events (same-tab changes)
    const handleThemeChange = () => {
      setLocalStorageVersion((v) => v + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sporttrack:theme-changed', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sporttrack:theme-changed', handleThemeChange);
    };
  }, []);

  // Reset selections when dialog opens (user must make a choice)
  useEffect(() => {
    if (open) {
      setSelectedLocal(false); // User must choose
      setSelectedCloud(false); // User must choose
      setShowDetails(false);
      setShowMergePreview(false); // User must select both to see merge preview
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
    e.preventDefault();
    e.stopPropagation();
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
    e.preventDefault();
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      // Ctrl/Cmd click: toggle selection
      setSelectedCloud(!selectedCloud);
    } else {
      // Regular click: select only this one
      setSelectedCloud(true);
      setSelectedLocal(false);
    }
  };

  const handleContinue = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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
    // Use exercises from new structure (exercises are ActivityRecord[], activities are ActivityDefinition[])
    const cloudActivities = (cloudData.exercises as ActivityRecord[]) || [];
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

    // Find settings differences
    // Always use current settings from store instead of localData.settings
    // This ensures that any settings changes made after conflict detection are reflected
    // If theme/language are not in settings, read from localStorage as fallback
    let localSettings = currentSettings || (localData.settings as UserSettings | null | undefined);

    // Always read theme and language from localStorage as they might be more up-to-date
    // This ensures that any changes made via ThemeToggle/LanguageToggle are reflected
    if (typeof window !== 'undefined') {
      const themeFromStorage = localStorage.getItem(STORAGE_KEYS.THEME) as
        | 'light'
        | 'dark'
        | 'system'
        | null;
      const languageFromStorage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as 'tr' | 'en' | null;

      if (localSettings) {
        // Merge localStorage values with settings (localStorage takes precedence)
        localSettings = {
          ...localSettings,
          theme: themeFromStorage || localSettings.theme || 'system',
          language: languageFromStorage || localSettings.language || 'tr',
        };
      } else {
        // If no settings at all, create minimal settings from localStorage
        if (themeFromStorage || languageFromStorage) {
          localSettings = {
            name: '',
            dailyTarget: 10000,
            customActivities: [],
            baseActivityOverrides: [],
            theme: themeFromStorage || 'system',
            language: languageFromStorage || 'tr',
          };
        }
      }
    }

    const cloudSettings = cloudData.settings as UserSettings | null | undefined;
    const settingsDifferences: {
      field: string;
      local: string | number | boolean | null | undefined;
      cloud: string | number | boolean | null | undefined;
    }[] = [];

    if (localSettings || cloudSettings) {
      const fieldsToCompare: Array<
        keyof Pick<
          UserSettings,
          'theme' | 'language' | 'name' | 'dailyTarget' | 'listDensity' | 'reduceAnimations'
        >
      > = ['theme', 'language', 'name', 'dailyTarget', 'listDensity', 'reduceAnimations'];

      fieldsToCompare.forEach((field) => {
        const localValue = localSettings?.[field];
        const cloudValue = cloudSettings?.[field];

        // Compare values (treat undefined/null as same)
        // Only compare simple types (string, number, boolean)
        if (localValue !== cloudValue && (localValue !== undefined || cloudValue !== undefined)) {
          // Ensure we only push simple types
          const localSimple =
            typeof localValue === 'string' ||
            typeof localValue === 'number' ||
            typeof localValue === 'boolean'
              ? localValue
              : null;
          const cloudSimple =
            typeof cloudValue === 'string' ||
            typeof cloudValue === 'number' ||
            typeof cloudValue === 'boolean'
              ? cloudValue
              : null;

          if (localSimple !== cloudSimple) {
            settingsDifferences.push({
              field,
              local: localSimple ?? null,
              cloud: cloudSimple ?? null,
            });
          }
        }
      });
    }

    return {
      localOnlyActivities,
      cloudOnlyActivities,
      differentActivities,
      localOnlyBadges,
      cloudOnlyBadges,
      settingsDifferences,
    };
  }, [localData, cloudData, currentSettings, localStorageVersion]);

  // Calculate merge preview
  const mergePreview = useMemo(() => {
    if (!selectedLocal || !selectedCloud || !localData || !cloudData) return null;

    try {
      const merged = resolveConflicts(
        {
          activities: localData.activities || [],
          settings: localData.settings || null,
          badges: localData.badges || [],
          challenges: (localData.challenges as Challenge[]) || [],
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
        settings: merged.resolvedData.settings,
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

    // Don't include activities/settings in comparison - they sync automatically
    return {
      exercises: exercises.length,
      activities: 0, // Activities and settings sync automatically, not shown in comparison
      badges: localData.badges?.length || 0,
      challenges: localData.challenges?.length || 0,
      totalPoints,
    };
  }, [localData]);

  // Calculate cloud statistics
  const cloudStats = useMemo(() => {
    const cloudExercises = (cloudData.exercises as ActivityRecord[]) || [];
    // activities is ActivityDefinition[], not ActivityRecord[], so we only use exercises
    const exercises = cloudExercises;

    // Don't include activities/settings in comparison - they sync automatically
    // Total Points: Calculate from exercises array (most accurate)
    // cloudData.points might be stale or incorrect, so always calculate from actual exercises
    const totalPoints = exercises.reduce((sum, ex) => sum + (ex.points || 0), 0);

    return {
      exercises: exercises.length,
      activities: 0, // Activities and settings sync automatically, not shown in comparison
      badges: (cloudData.badges as Badge[])?.length || 0,
      challenges: (cloudData.challenges || [])?.length || 0,
      totalPoints,
    };
  }, [cloudData]);

  // Check if local and cloud data are identical
  // Note: Activities and settings are not compared - they sync automatically
  const isIdentical = useMemo(() => {
    return (
      differences.localOnlyActivities.length === 0 &&
      differences.cloudOnlyActivities.length === 0 &&
      differences.differentActivities.length === 0 &&
      differences.localOnlyBadges.length === 0 &&
      differences.cloudOnlyBadges.length === 0 &&
      localStats.exercises === cloudStats.exercises &&
      localStats.badges === cloudStats.badges &&
      localStats.challenges === cloudStats.challenges &&
      localStats.totalPoints === cloudStats.totalPoints
    );
  }, [differences, localStats, cloudStats]);

  const dialog = (
    <div
      className={`fixed inset-0 z-[10025] flex ${isMobile ? 'items-start pt-28 px-4' : 'items-center justify-center pt-20'} bg-black/50 ${isMobile ? '' : 'backdrop-blur-sm'} animate-fade-in safe-top`}
      onClick={(e) => {
        // Only close if clicking the backdrop, not the card content
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="conflict-resolution-title"
    >
      <Card
        variant="elevated"
        size="md"
        className={`${isMobile ? 'rounded-xl w-full max-h-[85vh] overflow-y-auto' : 'rounded-xl max-w-3xl w-full mx-4'} animate-scale-in`}
        onClick={(e) => {
          // Prevent clicks inside card from closing dialog
          e.stopPropagation();
        }}
        header={
          <h2
            id="conflict-resolution-title"
            className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-950 dark:text-white mb-4`}
          >
            {lang === 'tr' ? 'Senkronizasyon Çakışması' : 'Sync Conflict'}
          </h2>
        }
      >
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
                      <span className="font-bold">{mergePreview.badges}</span> rozet,{' '}
                      <span className="font-bold">{mergePreview.challenges}</span> hedef
                    </div>
                    <div>
                      Toplam puan:{' '}
                      <span className="font-bold">{mergePreview.totalPoints.toLocaleString()}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      After merge: <span className="font-bold">{mergePreview.exercises}</span>{' '}
                      activities, <span className="font-bold">{mergePreview.badges}</span> badges,{' '}
                      <span className="font-bold">{mergePreview.challenges}</span> challenges
                    </div>
                    <div>
                      Total points:{' '}
                      <span className="font-bold">{mergePreview.totalPoints.toLocaleString()}</span>
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

              {/* Settings Differences - Compact */}
              {differences.settingsDifferences && differences.settingsDifferences.length > 0 && (
                <div>
                  <div
                    className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold text-purple-900 dark:text-purple-100 mb-1`}
                  >
                    ⚙️ {lang === 'tr' ? 'Ayarlar:' : 'Settings:'}
                  </div>
                  <div className="space-y-1">
                    {differences.settingsDifferences.map((diff) => {
                      const fieldLabels: Record<string, { tr: string; en: string }> = {
                        theme: { tr: 'Tema', en: 'Theme' },
                        language: { tr: 'Dil', en: 'Language' },
                        name: { tr: 'İsim', en: 'Name' },
                        dailyTarget: { tr: 'Günlük Hedef', en: 'Daily Target' },
                        listDensity: { tr: 'Liste Yoğunluğu', en: 'List Density' },
                        reduceAnimations: { tr: 'Animasyonları Azalt', en: 'Reduce Animations' },
                      };

                      const formatValue = (
                        value: string | number | boolean | null | undefined
                      ): string => {
                        if (value === null || value === undefined)
                          return lang === 'tr' ? 'Yok' : 'None';
                        if (typeof value === 'boolean')
                          return value
                            ? lang === 'tr'
                              ? 'Açık'
                              : 'On'
                            : lang === 'tr'
                              ? 'Kapalı'
                              : 'Off';
                        if (diff.field === 'theme') {
                          const themeMap: Record<string, { tr: string; en: string }> = {
                            light: { tr: 'Aydınlık', en: 'Light' },
                            dark: { tr: 'Karanlık', en: 'Dark' },
                            system: { tr: 'Sistem', en: 'System' },
                          };
                          return themeMap[value as string]?.[lang] || String(value);
                        }
                        if (diff.field === 'language') {
                          return value === 'tr' ? 'Türkçe' : 'English';
                        }
                        if (diff.field === 'listDensity') {
                          return value === 'compact'
                            ? lang === 'tr'
                              ? 'Kompakt'
                              : 'Compact'
                            : lang === 'tr'
                              ? 'Rahat'
                              : 'Comfortable';
                        }
                        return String(value);
                      };

                      const label = fieldLabels[diff.field]?.[lang] || diff.field;

                      return (
                        <div
                          key={diff.field}
                          className={`${isMobile ? 'text-[9px]' : 'text-[10px]'} px-2 py-1 rounded bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-purple-900 dark:text-purple-100">
                              {label}:
                            </span>
                            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                              <span className="text-purple-600 dark:text-purple-400">
                                📲 {formatValue(diff.local)}
                              </span>
                              <span className="text-purple-500">→</span>
                              <span className="text-purple-600 dark:text-purple-400">
                                ☁️ {formatValue(diff.cloud)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No Differences */}
              {differences.localOnlyActivities.length === 0 &&
                differences.cloudOnlyActivities.length === 0 &&
                differences.differentActivities.length === 0 &&
                differences.localOnlyBadges.length === 0 &&
                differences.cloudOnlyBadges.length === 0 &&
                (!differences.settingsDifferences ||
                  differences.settingsDifferences.length === 0) && (
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
          <Button
            variant="outline"
            size={isMobile ? 'sm' : 'md'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCancel();
            }}
            className="flex-1"
          >
            {lang === 'tr' ? 'İptal' : 'Cancel'}
          </Button>
          <Button
            variant="primary"
            size={isMobile ? 'sm' : 'md'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleContinue(e);
            }}
            className="flex-1"
          >
            {lang === 'tr' ? 'Devam Et' : 'Continue'}
          </Button>
        </div>
      </Card>
    </div>
  );

  return createPortal(dialog, document.body);
}
