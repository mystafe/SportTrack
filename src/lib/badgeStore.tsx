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
  markBadgeAsShown: (badgeId: string) => void;
  clearAllBadges: () => void;
  reloadFromStorage: () => void;
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
        const now = new Date();
        let needsMigration = false;

        // Convert unlockedAt strings back to Date objects and ensure shown field exists
        // Migration: If unlockedAt is missing, set it to current time (for old badges)
        const badgesWithDates = parsed.map((badge) => {
          const hasUnlockedAt = badge.unlockedAt !== undefined && badge.unlockedAt !== null;
          if (!hasUnlockedAt) {
            needsMigration = true;
          }
          return {
            ...badge,
            unlockedAt: badge.unlockedAt ? new Date(badge.unlockedAt) : now, // Migration: Set to now if missing
            shown: badge.shown !== undefined ? badge.shown : false, // Default to false if not set
          };
        });

        // Save migrated badges back to localStorage if migration was needed
        if (needsMigration) {
          try {
            localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badgesWithDates));
            console.log('✅ Migrated badges: Added unlockedAt timestamps to old badges');
          } catch (migrationError) {
            console.error('Failed to save migrated badges:', migrationError);
          }
        }

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

      // Update local last modified date
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('sporttrack_last_sync', new Date().toISOString());
        } catch (error) {
          console.error('Failed to save local last modified:', error);
        }
      }
    } catch (error) {
      console.error('Failed to save badges:', error);
    }
  }, []);

  // Check for new badges (only returns badges that are actually new and not shown)
  const checkNewBadges = useCallback((): Badge[] => {
    if (!hydrated || activities.length === 0) return [];

    const existingBadgeIds = new Set(badges.map((b) => b.id));
    // Also track badges that are already shown
    const shownBadgeIds = new Set(badges.filter((b) => b.shown === true).map((b) => b.id));

    const newBadges = checkBadges(activities, settings, target, badges);

    // Filter out badges that already exist OR are already shown
    const trulyNewBadges = newBadges.filter(
      (badge) => !existingBadgeIds.has(badge.id) && !shownBadgeIds.has(badge.id)
    );

    if (trulyNewBadges.length > 0) {
      // Check if we should mark badges as "shown" (suppress notification)
      const shouldSuppressBadges =
        typeof window !== 'undefined' &&
        (localStorage.getItem('sporttrack.dummy_data_loading') === 'true' ||
          localStorage.getItem('sporttrack.data_importing') === 'true' ||
          localStorage.getItem('sporttrack.is_new_login') === 'true');

      // Mark badges as shown if we're suppressing notifications
      const badgesToAdd = trulyNewBadges.map((badge) => ({
        ...badge,
        unlockedAt: badge.unlockedAt || new Date(),
        shown: shouldSuppressBadges ? true : false, // Mark as shown if suppressing
      }));

      const updatedBadges = [...badges, ...badgesToAdd];
      saveBadges(updatedBadges);

      // Return only badges that should be shown (not suppressed)
      return shouldSuppressBadges ? [] : badgesToAdd;
    }

    // Return empty array - no new badges
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

  // Mark a badge as shown (notification displayed)
  const markBadgeAsShown = useCallback(
    (badgeId: string) => {
      const badgeIndex = badges.findIndex((b) => b.id === badgeId);
      if (badgeIndex !== -1) {
        const updatedBadges = badges.map((badge, index) =>
          index === badgeIndex ? { ...badge, shown: true } : badge
        );
        saveBadges(updatedBadges);
      }
    },
    [badges, saveBadges]
  );

  const clearAllBadges = useCallback(() => {
    setBadges([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.BADGES);
    }
  }, []);

  const reloadFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BADGES);
      if (stored) {
        const parsed = JSON.parse(stored) as Badge[];
        const now = new Date();
        let needsMigration = false;

        // Convert unlockedAt strings back to Date objects and ensure shown field exists
        // Migration: If unlockedAt is missing, set it to current time (for old badges)
        const badgesWithDates = parsed.map((badge) => {
          const hasUnlockedAt = badge.unlockedAt !== undefined && badge.unlockedAt !== null;
          if (!hasUnlockedAt) {
            needsMigration = true;
          }
          return {
            ...badge,
            unlockedAt: badge.unlockedAt ? new Date(badge.unlockedAt) : now, // Migration: Set to now if missing
            shown: badge.shown !== undefined ? badge.shown : false, // Default to false if not set
          };
        });

        // Save migrated badges back to localStorage if migration was needed
        if (needsMigration) {
          try {
            localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badgesWithDates));
            console.log('✅ Migrated badges: Added unlockedAt timestamps to old badges');
          } catch (migrationError) {
            console.error('Failed to save migrated badges:', migrationError);
          }
        }

        setBadges(badgesWithDates);
      } else {
        setBadges([]);
      }
    } catch (error) {
      console.error('Failed to load badges:', error);
    }
  }, []);

  const value = useMemo<BadgeContextValue>(
    () => ({
      badges,
      hydrated,
      checkNewBadges,
      unlockBadge,
      markBadgeAsShown,
      clearAllBadges,
      reloadFromStorage,
    }),
    [
      badges,
      hydrated,
      checkNewBadges,
      unlockBadge,
      markBadgeAsShown,
      clearAllBadges,
      reloadFromStorage,
    ]
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
