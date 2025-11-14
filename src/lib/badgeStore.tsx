'use client';

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { Badge, checkBadges } from '@/lib/badges';
import { useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';
import { STORAGE_KEYS } from '@/lib/constants';

type BadgeContextValue = {
  badges: Badge[];
  hydrated: boolean;
  checkNewBadges: () => Badge[];
  unlockBadge: (badge: Badge) => void;
};

const BadgeContext = createContext<BadgeContextValue | null>(null);

export function BadgeProvider({ children }: { children: React.ReactNode }) {
  const { activities, hydrated: activitiesHydrated } = useActivities();
  const { settings, hydrated: settingsHydrated } = useSettings();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const target =
    settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : DEFAULT_DAILY_TARGET;

  // Load badges from localStorage
  useEffect(() => {
    if (!activitiesHydrated || !settingsHydrated) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BADGES);
      if (stored) {
        const parsed = JSON.parse(stored) as Badge[];
        // Convert unlockedAt strings back to Date objects
        const badgesWithDates = parsed.map((badge) => ({
          ...badge,
          unlockedAt: badge.unlockedAt ? new Date(badge.unlockedAt) : undefined,
        }));
        setBadges(badgesWithDates);
      }
    } catch (error) {
      console.error('Failed to load badges:', error);
    } finally {
      setHydrated(true);
    }
  }, [activitiesHydrated, settingsHydrated]);

  // Save badges to localStorage
  const saveBadges = useCallback((newBadges: Badge[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(newBadges));
      setBadges(newBadges);
    } catch (error) {
      console.error('Failed to save badges:', error);
    }
  }, []);

  // Check for new badges (only returns badges that are actually new)
  const checkNewBadges = useCallback((): Badge[] => {
    if (!hydrated || activities.length === 0) return [];

    const existingBadgeIds = new Set(badges.map((b) => b.id));
    const newBadges = checkBadges(activities, settings, target, badges);

    // Filter out badges that already exist
    const trulyNewBadges = newBadges.filter((badge) => !existingBadgeIds.has(badge.id));

    if (trulyNewBadges.length > 0) {
      const updatedBadges = [...badges, ...trulyNewBadges];
      saveBadges(updatedBadges);
      return trulyNewBadges;
    }
    return [];
  }, [activities, settings, target, badges, hydrated, saveBadges]);

  // Unlock a badge manually (for testing or special cases)
  const unlockBadge = useCallback(
    (badge: Badge) => {
      const exists = badges.some((b) => b.id === badge.id);
      if (!exists) {
        const updatedBadges = [...badges, { ...badge, unlockedAt: new Date() }];
        saveBadges(updatedBadges);
      }
    },
    [badges, saveBadges]
  );

  const value = useMemo<BadgeContextValue>(
    () => ({
      badges,
      hydrated,
      checkNewBadges,
      unlockBadge,
    }),
    [badges, hydrated, checkNewBadges, unlockBadge]
  );

  return <BadgeContext.Provider value={value}>{children}</BadgeContext.Provider>;
}

export function useBadges() {
  const ctx = useContext(BadgeContext);
  if (!ctx) {
    throw new Error('useBadges must be used within BadgeProvider');
  }
  return ctx;
}
