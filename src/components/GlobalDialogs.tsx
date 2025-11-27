'use client';

import { lazy, Suspense } from 'react';
import { useGlobalDialogState } from '@/lib/globalDialogState';
import { ExportDialog } from '@/components/ExportDialog';
import { ImportPreviewDialog } from '@/components/ImportPreviewDialog';
import { DuplicateDetectionDialog } from '@/components/DuplicateDetectionDialog';
import { SyncHistoryDialog } from '@/components/SyncHistoryDialog';
import { ConflictResolutionDialog } from '@/components/ConflictResolutionDialog';
import { useActivities, ActivityRecord } from '@/lib/activityStore';
import { useSettings, UserSettings } from '@/lib/settingsStore';
import { syncHistoryService } from '@/lib/cloudSync/syncHistory';
import { useBadges, Badge } from '@/lib/badgeStore';
import { useChallenges, Challenge } from '@/lib/challengeStore';
import { useEffect } from 'react';
import type { ConflictStrategy } from '@/lib/cloudSync/conflictResolver';

// Lazy load Apple Health Guide
const AppleHealthGuide = lazy(() =>
  import('@/components/AppleHealthGuide').then((m) => ({ default: m.AppleHealthGuide }))
);

export function GlobalDialogs() {
  const {
    showExportDialog,
    setShowExportDialog,
    showImportPreviewDialog,
    setShowImportPreviewDialog,
    importPreviewData,
    setImportPreviewData,
    showDuplicateDialog,
    setShowDuplicateDialog,
    showHealthGuide,
    setShowHealthGuide,
    showConflictDialog,
    setShowConflictDialog,
    conflictData,
    setConflictData,
    showSyncHistoryDialog,
    setShowSyncHistoryDialog,
  } = useGlobalDialogState();

  const { activities } = useActivities();
  const { settings } = useSettings();
  const { badges } = useBadges();
  const { challenges } = useChallenges();

  // Get local and cloud last modified dates for ConflictResolutionDialog
  const getLocalLastModified = (): Date | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('sporttrack_last_sync');
      if (stored) {
        const date = new Date(stored);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
      if (activities.length > 0) {
        return new Date();
      }
    } catch (error) {
      console.error('Failed to get local last modified:', error);
    }
    return null;
  };

  const getCloudLastModified = (): Date | null => {
    if (!conflictData) return null;
    const cloudData = conflictData.cloud as any;
    const hasCloudData =
      (cloudData.activities && cloudData.activities.length > 0) ||
      (cloudData.badges && cloudData.badges.length > 0) ||
      (cloudData.challenges && cloudData.challenges.length > 0);
    if (!hasCloudData) {
      return null;
    }
    if (cloudData.metadata?.lastModified) {
      try {
        return new Date(cloudData.metadata.lastModified);
      } catch {
        return null;
      }
    }
    return null;
  };

  const handleConflictResolve = (strategy: ConflictStrategy) => {
    // Dispatch event to CloudSyncSettings to handle the actual resolution
    window.dispatchEvent(
      new CustomEvent('sporttrack:conflict-resolve-handler', { detail: strategy })
    );
    setShowConflictDialog(false);
    setConflictData(null);
  };

  const handleConflictCancel = () => {
    setShowConflictDialog(false);
    setConflictData(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sporttrack_sync_conflict');
    }
  };

  // Import handler - needs to be passed from DataExportImport
  // For now, we'll handle it here
  const handleImportConfirm = () => {
    // This will be handled by DataExportImport component
    // We need to dispatch an event or use a callback
    window.dispatchEvent(new CustomEvent('sporttrack:import-confirm'));
    setShowImportPreviewDialog(false);
  };

  const handleImportCancel = () => {
    setShowImportPreviewDialog(false);
    setImportPreviewData(null);
  };

  return (
    <>
      <ExportDialog open={showExportDialog} onClose={() => setShowExportDialog(false)} />
      <ImportPreviewDialog
        open={showImportPreviewDialog}
        data={importPreviewData}
        onConfirm={handleImportConfirm}
        onCancel={handleImportCancel}
        existingExercisesCount={activities.length}
        existingActivitiesCount={settings?.customActivities?.length || 0}
      />
      <DuplicateDetectionDialog
        open={showDuplicateDialog}
        onClose={() => setShowDuplicateDialog(false)}
      />
      <SyncHistoryDialog
        open={showSyncHistoryDialog}
        statistics={syncHistoryService.getStatistics()}
        onClose={() => setShowSyncHistoryDialog(false)}
      />
      {showConflictDialog && conflictData && (
        <ConflictResolutionDialog
          open={showConflictDialog}
          onResolve={handleConflictResolve}
          onCancel={handleConflictCancel}
          localData={{
            activities: (conflictData.local.activities as ActivityRecord[]) || [],
            badges: (conflictData.local.badges as Badge[]) || [],
            challenges: (conflictData.local.challenges as Challenge[]) || [],
            settings: settings || (conflictData.local.settings as UserSettings | null) || null,
          }}
          cloudData={{
            exercises: (conflictData.cloud.activities || []) as ActivityRecord[],
            activities: [],
            statistics: [],
            badges: (conflictData.cloud.badges || []) as Badge[],
            challenges: (conflictData.cloud.challenges || []) as Challenge[],
            settings: (conflictData.cloud.settings as UserSettings | null) || null,
            metadata: conflictData.cloud.metadata || {
              lastModified: new Date(),
              version: Date.now(),
              userId: 'unknown',
            },
            points: conflictData.cloud.points || 0,
            lastModified: conflictData.cloud.metadata?.lastModified || null,
          }}
          localLastModified={getLocalLastModified()}
          cloudLastModified={getCloudLastModified()}
        />
      )}
      {showHealthGuide && (
        <Suspense fallback={null}>
          <AppleHealthGuide />
        </Suspense>
      )}
    </>
  );
}
