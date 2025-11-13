'use client';

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useActivities } from './activityStore';
import { useSettings } from './settingsStore';
import {
  Challenge,
  ChallengeProgress,
  calculateChallengeProgress,
  updateChallengeStatus,
  getDefaultDailyChallenge,
  type ChallengeType
} from './challenges';
import { STORAGE_KEYS } from './constants';
import { DEFAULT_DAILY_TARGET } from './activityConfig';

type ChallengeContextValue = {
  challenges: Challenge[];
  hydrated: boolean;
  addChallenge: (challenge: Challenge) => void;
  updateChallenge: (id: string, updates: Partial<Challenge>) => void;
  deleteChallenge: (id: string) => void;
  getChallengeProgress: (challengeId: string) => ChallengeProgress | null;
  checkCompletedChallenges: () => Challenge[];
};

const ChallengeContext = createContext<ChallengeContextValue | null>(null);

export function ChallengeProvider({ children }: { children: React.ReactNode }) {
  const { activities, hydrated: activitiesHydrated } = useActivities();
  const { settings, hydrated: settingsHydrated } = useSettings();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load challenges from localStorage
  useEffect(() => {
    if (!activitiesHydrated || !settingsHydrated) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
      if (stored) {
        const parsed = JSON.parse(stored) as Challenge[];
        setChallenges(parsed);
      } else {
        // Create default daily challenge
        const dailyTarget = settings?.dailyTarget ?? DEFAULT_DAILY_TARGET;
        const defaultChallenge = getDefaultDailyChallenge(dailyTarget);
        setChallenges([defaultChallenge]);
      }
    } catch (error) {
      console.error('Failed to load challenges:', error);
      // Create default daily challenge on error
      const dailyTarget = settings?.dailyTarget ?? DEFAULT_DAILY_TARGET;
      const defaultChallenge = getDefaultDailyChallenge(dailyTarget);
      setChallenges([defaultChallenge]);
    } finally {
      setHydrated(true);
    }
  }, [activitiesHydrated, settingsHydrated, settings?.dailyTarget]);

  // Update default daily challenge when daily target changes
  useEffect(() => {
    if (!hydrated || !settings?.dailyTarget) return;

    const defaultDaily = challenges.find(c => c.type === 'daily' && c.id.startsWith('daily-'));
    if (defaultDaily && defaultDaily.target !== settings.dailyTarget) {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const isToday = defaultDaily.startDate.startsWith(todayStr);

      if (isToday) {
        // Update today's challenge
        const updated = challenges.map(c =>
          c.id === defaultDaily.id
            ? { ...c, target: settings.dailyTarget }
            : c
        );
        setChallenges(updated);
      } else {
        // Create new daily challenge for today
        const newDaily = getDefaultDailyChallenge(settings.dailyTarget);
        const updated = challenges.filter(c => c.id !== defaultDaily.id);
        setChallenges([...updated, newDaily]);
      }
    }
  }, [settings?.dailyTarget, hydrated, challenges]);

  // Save challenges to localStorage
  const saveChallenges = useCallback((newChallenges: Challenge[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(newChallenges));
      setChallenges(newChallenges);
    } catch (error) {
      console.error('Failed to save challenges:', error);
    }
  }, []);

  // Update challenge progress and status
  useEffect(() => {
    if (!hydrated || challenges.length === 0) return;

    const updated = challenges.map(challenge => {
      const progress = calculateChallengeProgress(challenge, activities);
      return updateChallengeStatus(challenge, progress);
    });

    // Only update if something changed
    const hasChanges = updated.some((c, i) => {
      const old = challenges[i];
      return (
        c.status !== old.status ||
        c.progress !== old.progress ||
        c.completedAt !== old.completedAt
      );
    });

    if (hasChanges) {
      saveChallenges(updated);
    }
  }, [activities, hydrated, challenges, saveChallenges]);

  // Add a new challenge
  const addChallenge = useCallback((challenge: Challenge) => {
    const updated = [...challenges, challenge];
    saveChallenges(updated);
  }, [challenges, saveChallenges]);

  // Update a challenge
  const updateChallenge = useCallback((id: string, updates: Partial<Challenge>) => {
    const updated = challenges.map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    saveChallenges(updated);
  }, [challenges, saveChallenges]);

  // Delete a challenge
  const deleteChallenge = useCallback((id: string) => {
    // Don't allow deleting default daily challenge
    const challenge = challenges.find(c => c.id === id);
    if (challenge?.type === 'daily' && challenge.id.startsWith('daily-')) {
      return;
    }
    const updated = challenges.filter(c => c.id !== id);
    saveChallenges(updated);
  }, [challenges, saveChallenges]);

  // Get progress for a specific challenge
  const getChallengeProgress = useCallback((challengeId: string): ChallengeProgress | null => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return null;
    return calculateChallengeProgress(challenge, activities);
  }, [challenges, activities]);

  // Check for newly completed challenges
  const checkCompletedChallenges = useCallback((): Challenge[] => {
    return challenges.filter(c => {
      const progress = calculateChallengeProgress(c, activities);
      return progress.isCompleted && c.status === 'active';
    });
  }, [challenges, activities]);

  const value = useMemo<ChallengeContextValue>(() => ({
    challenges,
    hydrated,
    addChallenge,
    updateChallenge,
    deleteChallenge,
    getChallengeProgress,
    checkCompletedChallenges
  }), [challenges, hydrated, addChallenge, updateChallenge, deleteChallenge, getChallengeProgress, checkCompletedChallenges]);

  return <ChallengeContext.Provider value={value}>{children}</ChallengeContext.Provider>;
}

export function useChallenges() {
  const ctx = useContext(ChallengeContext);
  if (!ctx) {
    throw new Error('useChallenges must be used within ChallengeProvider');
  }
  return ctx;
}

