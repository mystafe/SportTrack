/**
 * Cloud Sync Listener Hook
 * Listens to cloud changes and updates local stores
 */

'use client';

import { useEffect, useRef } from 'react';
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

  // Use refs to avoid re-subscribing on every change
  const activitiesRef = useRef(activities);
  const settingsRef = useRef(settings);
  const badgesRef = useRef(badges);
  const challengesRef = useRef(challenges);
  const saveSettingsRef = useRef(saveSettings);

  // Update refs when values change
  useEffect(() => {
    activitiesRef.current = activities;
  }, [activities]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    badgesRef.current = badges;
  }, [badges]);

  useEffect(() => {
    challengesRef.current = challenges;
  }, [challenges]);

  useEffect(() => {
    saveSettingsRef.current = saveSettings;
  }, [saveSettings]);

  const allHydrated =
    activitiesHydrated && settingsHydrated && badgesHydrated && challengesHydrated;

  useEffect(() => {
    if (!isAuthenticated || !isConfigured || !allHydrated) {
      return;
    }

    console.log('👂 Setting up cloud sync listener...');

    const unsubscribe = cloudSyncService.subscribeToCloud((cloudData: CloudData | null) => {
      if (!cloudData) {
        console.log('📭 No cloud data available');
        return;
      }

      console.log('📥 Cloud data received:', {
        activities: cloudData.activities?.length || 0,
        settings: cloudData.settings ? 'present' : 'null',
        badges: cloudData.badges?.length || 0,
        challenges: cloudData.challenges?.length || 0,
      });

      // Use refs to get current values without causing re-renders
      const currentActivities = activitiesRef.current;
      const currentSettings = settingsRef.current;
      const currentBadges = badgesRef.current;
      const currentChallenges = challengesRef.current;
      const currentSaveSettings = saveSettingsRef.current;

      // Sync settings - only if different and not caused by our own sync
      if (cloudData.settings) {
        // Normalize both settings objects for comparison (handle undefined vs null)
        const normalizeSettings = (s: any) => {
          if (!s) return null;
          return {
            name: s.name || '',
            dailyTarget: s.dailyTarget || 10000,
            customActivities: s.customActivities || [],
            mood: s.mood !== undefined ? s.mood : null,
          };
        };

        const normalizedCloud = normalizeSettings(cloudData.settings);
        const normalizedLocal = normalizeSettings(currentSettings);

        const cloudSettingsStr = JSON.stringify(normalizedCloud);
        const localSettingsStr = JSON.stringify(normalizedLocal);

        if (cloudSettingsStr !== localSettingsStr) {
          console.log('🔄 Updating settings from cloud (different from local)');
          console.log('Cloud:', normalizedCloud);
          console.log('Local:', normalizedLocal);
          // Use ref to avoid dependency issues
          // Note: This will trigger useAutoSync, but useAutoSync checks if data actually changed
          // and compares with lastSyncRef, so it should not cause infinite loops
          currentSaveSettings(cloudData.settings as any);
        } else {
          console.log('✅ Settings already in sync (no update needed)');
        }
      } else {
        console.log('ℹ️ No settings in cloud data');
      }

      // Note: Activities, badges, and challenges sync would require bulk update methods
      // For now, we only sync settings to avoid infinite loops
    });

    return () => {
      console.log('🔇 Cleaning up cloud sync listener');
      unsubscribe();
    };
  }, [isAuthenticated, isConfigured, allHydrated]); // Removed activities, settings, badges, challenges, saveSettings from dependencies
}
