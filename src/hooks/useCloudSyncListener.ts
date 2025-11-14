/**
 * Cloud Sync Listener Hook
 * Listens to cloud changes and updates local stores
 */

'use client';

import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { cloudSyncService } from '@/lib/cloudSync/syncService';
import { useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { useBadges } from '@/lib/badgeStore';
import { useChallenges } from '@/lib/challengeStore';
import type { CloudData } from '@/lib/cloudSync/types';

export function useCloudSyncListener() {
  const { isAuthenticated, isConfigured } = useAuth();
  const { activities, hydrated: activitiesHydrated } = useActivities();
  const { settings, hydrated: settingsHydrated, saveSettings } = useSettings();
  const { badges, hydrated: badgesHydrated } = useBadges();
  const { challenges, hydrated: challengesHydrated } = useChallenges();

  const allHydrated =
    activitiesHydrated && settingsHydrated && badgesHydrated && challengesHydrated;

  useEffect(() => {
    if (!isAuthenticated || !isConfigured || !allHydrated) {
      return;
    }

    const unsubscribe = cloudSyncService.subscribeToCloud((cloudData: CloudData | null) => {
      if (!cloudData) {
        return;
      }

      // Only sync if cloud data is newer than local
      // For now, we'll merge cloud data with local data
      // In a production app, you'd want more sophisticated conflict resolution

      // Sync activities (merge by ID)
      if (cloudData.activities && Array.isArray(cloudData.activities)) {
        const cloudActivityIds = new Set(
          cloudData.activities.map((a: any) => a.id).filter(Boolean)
        );
        const localActivityIds = new Set(activities.map((a) => a.id));

        // Add activities that exist in cloud but not locally
        const newActivities = cloudData.activities.filter(
          (a: any) => a.id && !localActivityIds.has(a.id)
        );

        if (newActivities.length > 0) {
          // Note: This would require exposing a method to add activities in bulk
          // For now, we'll skip automatic activity sync from cloud
          console.log('Cloud has new activities, but bulk add not implemented');
        }
      }

      // Sync settings
      if (cloudData.settings) {
        const cloudSettingsStr = JSON.stringify(cloudData.settings);
        const localSettingsStr = settings ? JSON.stringify(settings) : null;

        if (cloudSettingsStr !== localSettingsStr) {
          // Only update if cloud settings are different
          // In production, you'd want to check timestamps
          saveSettings(cloudData.settings as any);
        }
      }

      // Sync badges (merge by ID)
      if (cloudData.badges && Array.isArray(cloudData.badges)) {
        const cloudBadgeIds = new Set(cloudData.badges.map((b: any) => b.id).filter(Boolean));
        const localBadgeIds = new Set(badges.map((b) => b.id));

        const newBadges = cloudData.badges.filter((b: any) => b.id && !localBadgeIds.has(b.id));

        if (newBadges.length > 0) {
          // Note: This would require exposing a method to add badges in bulk
          console.log('Cloud has new badges, but bulk add not implemented');
        }
      }

      // Sync challenges (merge by ID)
      if (cloudData.challenges && Array.isArray(cloudData.challenges)) {
        const cloudChallengeIds = new Set(
          cloudData.challenges.map((c: any) => c.id).filter(Boolean)
        );
        const localChallengeIds = new Set(challenges.map((c) => c.id));

        const newChallenges = cloudData.challenges.filter(
          (c: any) => c.id && !localChallengeIds.has(c.id)
        );

        if (newChallenges.length > 0) {
          // Note: This would require exposing a method to add challenges in bulk
          console.log('Cloud has new challenges, but bulk add not implemented');
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [
    isAuthenticated,
    isConfigured,
    allHydrated,
    activities,
    settings,
    badges,
    challenges,
    saveSettings,
  ]);
}
