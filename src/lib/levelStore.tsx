'use client';

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useActivities } from '@/lib/activityStore';
import { calculateXPFromActivities, getLevelInfo, checkLevelUp, type LevelInfo } from './levelSystem';
import { STORAGE_KEYS } from './constants';

type LevelContextValue = {
  levelInfo: LevelInfo;
  hydrated: boolean;
  checkLevelUp: () => number | null;
};

const LevelContext = createContext<LevelContextValue | null>(null);

export function LevelProvider({ children }: { children: React.ReactNode }) {
  const { activities, hydrated: activitiesHydrated } = useActivities();
  const [previousTotalXP, setPreviousTotalXP] = useState<number>(0);
  const [hydrated, setHydrated] = useState(false);

  // Calculate total XP from activities
  const totalXP = useMemo(() => {
    return calculateXPFromActivities(activities);
  }, [activities]);

  // Load previous XP from localStorage
  useEffect(() => {
    if (!activitiesHydrated) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LEVELS);
      if (stored) {
        const data = JSON.parse(stored) as { totalXP: number };
        setPreviousTotalXP(data.totalXP);
      } else {
        // First time: set to current XP
        setPreviousTotalXP(totalXP);
      }
    } catch (error) {
      console.error('Failed to load level data:', error);
      setPreviousTotalXP(totalXP);
    } finally {
      setHydrated(true);
    }
  }, [activitiesHydrated, totalXP]);

  // Save current XP to localStorage
  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(STORAGE_KEYS.LEVELS, JSON.stringify({ totalXP }));
      setPreviousTotalXP(totalXP);
    } catch (error) {
      console.error('Failed to save level data:', error);
    }
  }, [totalXP, hydrated]);

  // Get level info
  const levelInfo = useMemo(() => {
    return getLevelInfo(totalXP);
  }, [totalXP]);

  // Check for level up
  const checkLevelUpCallback = useCallback((): number | null => {
    if (!hydrated) return null;
    return checkLevelUp(previousTotalXP, totalXP);
  }, [previousTotalXP, totalXP, hydrated]);

  const value = useMemo<LevelContextValue>(() => ({
    levelInfo,
    hydrated,
    checkLevelUp: checkLevelUpCallback
  }), [levelInfo, hydrated, checkLevelUpCallback]);

  return <LevelContext.Provider value={value}>{children}</LevelContext.Provider>;
}

export function useLevel() {
  const ctx = useContext(LevelContext);
  if (!ctx) {
    throw new Error('useLevel must be used within LevelProvider');
  }
  return ctx;
}

