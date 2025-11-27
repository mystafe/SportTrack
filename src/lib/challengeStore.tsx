'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';
import { startOfDay, startOfWeek, startOfMonth, startOfYear, format, parseISO } from 'date-fns';
import { useActivities } from './activityStore';
import { useSettings } from './settingsStore';
import {
  Challenge,
  ChallengeProgress,
  calculateChallengeProgress,
  updateChallengeStatus,
  getDefaultDailyChallenge,
  getDefaultWeeklyChallenge,
  type ChallengeType,
} from './challenges';
import { PRESET_CHALLENGES, createChallengeFromPreset } from './presetChallenges';
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
  clearAllChallenges: () => void;
  reloadFromStorage: () => void;
};

const ChallengeContext = createContext<ChallengeContextValue | null>(null);

export function ChallengeProvider({ children }: { children: React.ReactNode }) {
  const { activities, hydrated: activitiesHydrated } = useActivities();
  const { settings, hydrated: settingsHydrated } = useSettings();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load challenges from localStorage and add preset challenges
  useEffect(() => {
    if (!activitiesHydrated || !settingsHydrated) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
      let loadedChallenges: Challenge[] = [];

      if (stored) {
        loadedChallenges = JSON.parse(stored) as Challenge[];

        // Remove duplicate IDs - keep the first occurrence of each ID
        const seenIds = new Set<string>();
        const uniqueChallenges: Challenge[] = [];
        for (const challenge of loadedChallenges) {
          if (!seenIds.has(challenge.id)) {
            seenIds.add(challenge.id);
            uniqueChallenges.push(challenge);
          } else {
            console.warn(`Removing duplicate challenge ID: ${challenge.id}`);
          }
        }
        loadedChallenges = uniqueChallenges;

        // COMPREHENSIVE CLEANUP: Remove all old/duplicate challenges
        const now = new Date();
        const todayStr = format(startOfDay(now), 'yyyy-MM-dd');
        const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
        const currentWeekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
        const currentMonthStart = startOfMonth(now);
        const currentMonthStartStr = format(currentMonthStart, 'yyyy-MM-dd');
        const currentYearStart = startOfYear(now);
        const currentYearStartStr = format(currentYearStart, 'yyyy');

        const idsToRemove = new Set<string>();

        // Keep only today's daily challenge
        const dailyChallenges = loadedChallenges.filter(
          (c) => c.type === 'daily' && c.id.startsWith('daily-')
        );
        const todayDaily = dailyChallenges.find((c) => c.startDate.startsWith(todayStr));
        dailyChallenges.forEach((c) => {
          if (c.id !== todayDaily?.id) {
            idsToRemove.add(c.id);
          }
        });

        // Keep only current week's weekly challenge
        const weeklyChallenges = loadedChallenges.filter(
          (c) => c.type === 'weekly' && c.id.startsWith('weekly-')
        );
        const currentWeekWeekly = weeklyChallenges.find((c) => {
          const challengeStart = parseISO(c.startDate);
          return (
            format(startOfWeek(challengeStart, { weekStartsOn: 1 }), 'yyyy-MM-dd') ===
            currentWeekStartStr
          );
        });
        weeklyChallenges.forEach((c) => {
          if (c.id !== currentWeekWeekly?.id) {
            idsToRemove.add(c.id);
          }
        });

        // Keep only current month's monthly challenge
        const monthlyChallenges = loadedChallenges.filter(
          (c) => c.type === 'monthly' && c.id.startsWith('monthly-')
        );
        const currentMonthMonthly = monthlyChallenges.find((c) => {
          const challengeStart = parseISO(c.startDate);
          return format(startOfMonth(challengeStart), 'yyyy-MM-dd') === currentMonthStartStr;
        });
        monthlyChallenges.forEach((c) => {
          if (c.id !== currentMonthMonthly?.id) {
            idsToRemove.add(c.id);
          }
        });

        // Keep only current year's yearly challenge
        const yearlyChallenges = loadedChallenges.filter(
          (c) => c.type === 'yearly' && c.id.startsWith('yearly-')
        );
        const currentYearYearly = yearlyChallenges.find((c) => {
          const challengeStart = parseISO(c.startDate);
          return format(startOfYear(challengeStart), 'yyyy') === currentYearStartStr;
        });
        yearlyChallenges.forEach((c) => {
          if (c.id !== currentYearYearly?.id) {
            idsToRemove.add(c.id);
          }
        });

        // Keep only ONE active preset challenge per preset ID
        // Each preset should have only one active challenge at a time
        const presetChallenges = loadedChallenges.filter((c) => c.id.startsWith('preset-'));
        const presetIdMap = new Map<string, Challenge>(); // preset base ID -> challenge

        presetChallenges.forEach((c) => {
          // Find the base preset ID by matching with PRESET_CHALLENGES
          // Challenge IDs are like: preset-weekly-super-1764256538720-1-abc123xyz
          // We need to match with preset ID: preset-weekly-super
          const matchingPreset = PRESET_CHALLENGES.find((p) => {
            // Check if challenge ID starts with preset ID followed by a dash or equals it
            return c.id.startsWith(p.id + '-') || c.id === p.id;
          });

          if (matchingPreset) {
            const existing = presetIdMap.get(matchingPreset.id);
            if (!existing) {
              // First occurrence of this preset
              presetIdMap.set(matchingPreset.id, c);
            } else {
              // Already have one, keep the active one or remove duplicates
              if (c.status === 'active' && existing.status !== 'active') {
                idsToRemove.add(existing.id);
                presetIdMap.set(matchingPreset.id, c);
              } else if (existing.status === 'active' && c.status !== 'active') {
                idsToRemove.add(c.id);
              } else {
                // Both same status, keep the first one, remove duplicates
                idsToRemove.add(c.id);
              }
            }
          } else {
            // Orphaned preset challenge (preset definition removed), remove it
            idsToRemove.add(c.id);
          }
        });

        // AGGRESSIVE CLEANUP: Remove ALL expired/completed challenges (not just preset)
        // Keep only active challenges
        loadedChallenges.forEach((c) => {
          if (c.status === 'expired' || c.status === 'completed' || c.status === 'failed') {
            idsToRemove.add(c.id);
          }
        });

        // Remove ALL preset challenges - user should add them manually from UI
        // This prevents thousands of preset challenges from cluttering the system
        loadedChallenges.forEach((c) => {
          if (c.id.startsWith('preset-')) {
            idsToRemove.add(c.id);
          }
        });

        // AGGRESSIVE: Remove duplicate custom challenges (same name + target)
        // Keep only the most recent one for each unique name+target combination
        const customChallenges = loadedChallenges.filter(
          (c) => c.type === 'custom' && !idsToRemove.has(c.id)
        );
        const customChallengeMap = new Map<string, Challenge>(); // key: name_tr-name_en-target -> challenge

        customChallenges.forEach((c) => {
          const key = `${c.name.tr}-${c.name.en}-${c.target}`;
          const existing = customChallengeMap.get(key);

          if (!existing) {
            customChallengeMap.set(key, c);
          } else {
            // Compare dates - keep the newer one
            const existingDate = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
            const currentDate = c.createdAt ? new Date(c.createdAt).getTime() : 0;

            if (currentDate > existingDate) {
              idsToRemove.add(existing.id);
              customChallengeMap.set(key, c);
            } else {
              idsToRemove.add(c.id);
            }
          }
        });

        // Limit custom challenges to max 20 (keep most recent)
        const uniqueCustomChallenges = Array.from(customChallengeMap.values()).sort((a, b) => {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        });

        if (uniqueCustomChallenges.length > 20) {
          uniqueCustomChallenges.slice(20).forEach((c) => {
            idsToRemove.add(c.id);
          });
        }

        // AGGRESSIVE: Remove duplicate challenges for other types (seasonal, activity_specific, time_based, streak_based)
        // Keep only one per unique name+target combination
        const otherChallenges = loadedChallenges.filter(
          (c) =>
            (c.type === 'seasonal' ||
              c.type === 'activity_specific' ||
              c.type === 'time_based' ||
              c.type === 'streak_based') &&
            !idsToRemove.has(c.id)
        );

        // Remove duplicates by name+target
        const otherChallengeMap = new Map<string, Challenge>();
        otherChallenges.forEach((c) => {
          const key = `${c.type}-${c.name.tr}-${c.name.en}-${c.target}`;
          const existing = otherChallengeMap.get(key);

          if (!existing) {
            otherChallengeMap.set(key, c);
          } else {
            // Keep the newer one
            const existingDate = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
            const currentDate = c.createdAt ? new Date(c.createdAt).getTime() : 0;

            if (currentDate > existingDate) {
              idsToRemove.add(existing.id);
              otherChallengeMap.set(key, c);
            } else {
              idsToRemove.add(c.id);
            }
          }
        });

        // Keep only active ones, limit to 30 total
        const uniqueOtherChallenges = Array.from(otherChallengeMap.values()).filter(
          (c) => c.status === 'active'
        );
        if (uniqueOtherChallenges.length > 30) {
          uniqueOtherChallenges
            .sort((a, b) => {
              const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return bDate - aDate;
            })
            .slice(30)
            .forEach((c) => {
              idsToRemove.add(c.id);
            });
        }

        // Remove all inactive other challenges
        Array.from(otherChallengeMap.values())
          .filter((c) => c.status !== 'active')
          .forEach((c) => {
            idsToRemove.add(c.id);
          });

        // Remove all identified challenges
        const beforeCount = loadedChallenges.length;
        loadedChallenges = loadedChallenges.filter((c) => !idsToRemove.has(c.id));
        const removedCount = beforeCount - loadedChallenges.length;

        if (removedCount > 0) {
          console.log(
            `🧹 Aggressive cleanup: Removed ${removedCount} challenges. Remaining: ${loadedChallenges.length} (Active: ${loadedChallenges.filter((c) => c.status === 'active').length})`
          );
        }
      }

      // Create default daily and weekly challenges if they don't exist
      const dailyTarget = settings?.dailyTarget ?? DEFAULT_DAILY_TARGET;
      const hasDaily = loadedChallenges.some(
        (c) => c.type === 'daily' && c.id.startsWith('daily-')
      );
      const hasWeekly = loadedChallenges.some(
        (c) => c.type === 'weekly' && c.id.startsWith('weekly-') && c.target === 50000
      );

      if (!hasDaily) {
        const defaultDaily = getDefaultDailyChallenge(dailyTarget);
        loadedChallenges.push(defaultDaily);
      }
      if (!hasWeekly) {
        const defaultWeekly = getDefaultWeeklyChallenge();
        loadedChallenges.push(defaultWeekly);
      }

      // Add preset challenges ONLY if they don't exist
      // Don't auto-create preset challenges - user should add them manually
      // This prevents thousands of preset challenges from being created
      const now = new Date();
      // Only add preset challenges that are explicitly missing (not expired/completed, but completely missing)
      PRESET_CHALLENGES.forEach((preset) => {
        // Check if any challenge with this preset ID exists (even expired/completed)
        const existingPreset = loadedChallenges.find((c) => {
          // Match preset ID prefix (e.g., preset-weekly-super-xxx matches preset-weekly-super)
          return c.id.startsWith(preset.id + '-') || c.id === preset.id;
        });

        // Only add if completely missing (not if expired/completed - user can re-add manually)
        if (!existingPreset) {
          // Don't auto-add preset challenges - let user add them manually from the UI
          // This prevents thousands of challenges from being created
        }
      });

      setChallenges(loadedChallenges);
    } catch (error) {
      console.error('Failed to load challenges:', error);
      // Create default challenges on error
      const dailyTarget = settings?.dailyTarget ?? DEFAULT_DAILY_TARGET;
      const defaultDaily = getDefaultDailyChallenge(dailyTarget);
      const defaultWeekly = getDefaultWeeklyChallenge();
      setChallenges([defaultDaily, defaultWeekly]);
    } finally {
      setHydrated(true);
    }
  }, [activitiesHydrated, settingsHydrated, settings?.dailyTarget]);

  // Save challenges to localStorage
  // Use a ref to track if we're already saving to prevent loops
  const isSavingRef = useRef(false);

  const saveChallenges = useCallback((newChallenges: Challenge[]) => {
    // Prevent concurrent saves
    if (isSavingRef.current) {
      return;
    }

    try {
      isSavingRef.current = true;

      // Only update state if challenges actually changed (quick comparison by length and IDs)
      const currentChallenges = challengesRef.current;
      const lengthChanged = currentChallenges.length !== newChallenges.length;
      const idsChanged =
        lengthChanged ||
        currentChallenges.some((c, i) => c.id !== newChallenges[i]?.id) ||
        newChallenges.some((c, i) => c.id !== currentChallenges[i]?.id);

      // Save to localStorage first
      localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(newChallenges));

      // Only update state if challenges actually changed
      if (idsChanged || lengthChanged) {
        // Use functional update to prevent stale closure issues
        setChallenges((prev) => {
          // Double-check if update is still needed
          if (
            prev.length !== newChallenges.length ||
            prev.some((c, i) => c.id !== newChallenges[i]?.id)
          ) {
            challengesRef.current = newChallenges;
            return newChallenges;
          }
          return prev;
        });
      } else {
        // Still update ref even if state doesn't change
        challengesRef.current = newChallenges;
      }

      // Update local last modified date
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('sporttrack_last_sync', new Date().toISOString());
        } catch (error) {
          console.error('Failed to save local last modified:', error);
        }
      }
    } catch (error) {
      console.error('Failed to save challenges:', error);
    } finally {
      // Reset flag after a short delay using requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        isSavingRef.current = false;
      });
    }
  }, []);

  // Update default daily challenge when daily target changes
  // Use refs to prevent infinite loops
  const lastDailyTargetRef = useRef<number | undefined>(undefined);
  const isUpdatingDailyTargetRef = useRef(false);

  useEffect(() => {
    if (!hydrated || !settings?.dailyTarget || isUpdatingDailyTargetRef.current) return;

    // Only update if daily target actually changed
    if (lastDailyTargetRef.current === settings.dailyTarget) {
      return;
    }
    lastDailyTargetRef.current = settings.dailyTarget;

    const currentChallenges = challengesRef.current;
    const defaultDaily = currentChallenges.find(
      (c) => c.type === 'daily' && c.id.startsWith('daily-')
    );

    if (defaultDaily && defaultDaily.target !== settings.dailyTarget) {
      isUpdatingDailyTargetRef.current = true;

      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const isToday = defaultDaily.startDate.startsWith(todayStr);

      if (isToday) {
        // Update today's challenge
        const updated = currentChallenges.map((c) =>
          c.id === defaultDaily.id ? { ...c, target: settings.dailyTarget } : c
        );
        challengesRef.current = updated;
        saveChallenges(updated);
      } else {
        // Create new daily challenge for today
        const newDaily = getDefaultDailyChallenge(settings.dailyTarget);
        const updated = currentChallenges.filter((c) => c.id !== defaultDaily.id);
        const finalChallenges = [...updated, newDaily];
        challengesRef.current = finalChallenges;
        saveChallenges(finalChallenges);
      }

      // Reset flag after a short delay
      setTimeout(() => {
        isUpdatingDailyTargetRef.current = false;
      }, 100);
    }
  }, [settings?.dailyTarget, hydrated, saveChallenges]);

  // Update challenge progress and status
  // Use refs to track previous values and prevent unnecessary updates
  const prevActivitiesRef = useRef<typeof activities>([]);
  const challengesRef = useRef<Challenge[]>(challenges);
  const isUpdatingRef = useRef(false);

  // Keep ref in sync with challenges state - only update if actually changed
  useEffect(() => {
    const currentRef = challengesRef.current;
    const currentKey = currentRef.map((c) => `${c.id}:${c.status}:${c.progress}`).join('|');
    const newKey = challenges.map((c) => `${c.id}:${c.status}:${c.progress}`).join('|');

    // Only update ref if challenges actually changed (not just reference)
    if (currentKey !== newKey || currentRef.length !== challenges.length) {
      challengesRef.current = challenges;
    }
  }, [challenges]);

  useEffect(() => {
    if (!hydrated || challengesRef.current.length === 0 || isUpdatingRef.current) {
      prevActivitiesRef.current = activities;
      return;
    }

    // Create a stable key for activities to detect actual changes
    const activitiesKey = activities.map((a) => `${a.id}:${a.points}:${a.performedAt}`).join('|');
    const prevActivitiesKey = prevActivitiesRef.current
      .map((a) => `${a.id}:${a.points}:${a.performedAt}`)
      .join('|');

    // Only update if activities actually changed (not just reference)
    const activitiesChanged = activitiesKey !== prevActivitiesKey;

    if (!activitiesChanged) {
      return; // No actual changes, skip update
    }

    // Prevent concurrent updates
    isUpdatingRef.current = true;

    const currentChallenges = challengesRef.current;

    // PERFORMANCE: Only update active challenges, skip expired/completed
    const activeChallenges = currentChallenges.filter((c) => c.status === 'active');
    const inactiveChallenges = currentChallenges.filter((c) => c.status !== 'active');

    // Update progress only for active challenges
    const updatedActive = activeChallenges.map((challenge) => {
      const progress = calculateChallengeProgress(challenge, activities);
      return updateChallengeStatus(challenge, progress);
    });

    // Combine updated active challenges with unchanged inactive ones
    const updated = [...updatedActive, ...inactiveChallenges];

    // Only update if something actually changed
    const hasChanges = updated.some((c, i) => {
      const old = currentChallenges[i];
      return (
        c.status !== old.status || c.progress !== old.progress || c.completedAt !== old.completedAt
      );
    });

    if (hasChanges) {
      // Update ref before saving to prevent loop
      challengesRef.current = updated;
      saveChallenges(updated);
    }

    // Update activities ref
    prevActivitiesRef.current = activities;

    // Reset update flag after a short delay to allow state to settle
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 0);
  }, [activities, hydrated, saveChallenges]);

  // Auto-renew expired challenges (daily, weekly, monthly, yearly)
  // Use refs to prevent infinite loops - only check periodically, not on every challenge change
  const lastAutoRenewCheckRef = useRef<number>(0);
  const AUTO_RENEW_CHECK_INTERVAL = 300000; // Check every 5 minutes (increased from 60s)
  const isAutoRenewingRef = useRef(false);

  useEffect(() => {
    if (!hydrated || isUpdatingRef.current || isAutoRenewingRef.current) return;

    const currentChallenges = challengesRef.current;
    if (currentChallenges.length === 0) return;

    // Throttle auto-renew checks to prevent excessive updates
    const nowTimestamp = Date.now();
    if (nowTimestamp - lastAutoRenewCheckRef.current < AUTO_RENEW_CHECK_INTERVAL) {
      return;
    }
    lastAutoRenewCheckRef.current = nowTimestamp;
    isAutoRenewingRef.current = true;

    const now = new Date();
    const today = startOfDay(now);
    const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
    const currentMonthStart = startOfMonth(now);
    const currentYearStart = startOfYear(now);

    let needsUpdate = false;
    let updatedChallenges = [...currentChallenges];

    // Check for expired daily challenge - only keep today's daily challenge
    const todayStr = format(today, 'yyyy-MM-dd');
    const dailyChallenges = updatedChallenges.filter(
      (c) => c.type === 'daily' && c.id.startsWith('daily-')
    );
    const todayDaily = dailyChallenges.find((c) => c.startDate.startsWith(todayStr));
    const oldDailyChallenges = dailyChallenges.filter((c) => !c.startDate.startsWith(todayStr));

    // Remove old daily challenges
    if (oldDailyChallenges.length > 0) {
      updatedChallenges = updatedChallenges.filter((c) => !oldDailyChallenges.includes(c));
      needsUpdate = true;
    }

    // Create today's daily challenge if it doesn't exist
    if (!todayDaily) {
      const dailyTarget = settings?.dailyTarget ?? DEFAULT_DAILY_TARGET;
      const newDaily = getDefaultDailyChallenge(dailyTarget);
      updatedChallenges.push(newDaily);
      needsUpdate = true;
    }

    // Check for expired weekly challenge - only keep current week's weekly challenge
    const currentWeekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
    const weeklyChallenges = updatedChallenges.filter(
      (c) => c.type === 'weekly' && c.id.startsWith('weekly-')
    );
    const currentWeekWeekly = weeklyChallenges.find((c) => {
      const challengeStart = parseISO(c.startDate);
      return (
        format(startOfWeek(challengeStart, { weekStartsOn: 1 }), 'yyyy-MM-dd') ===
        currentWeekStartStr
      );
    });
    const oldWeeklyChallenges = weeklyChallenges.filter((c) => {
      const challengeStart = parseISO(c.startDate);
      return (
        format(startOfWeek(challengeStart, { weekStartsOn: 1 }), 'yyyy-MM-dd') !==
        currentWeekStartStr
      );
    });

    // Remove old weekly challenges
    if (oldWeeklyChallenges.length > 0) {
      updatedChallenges = updatedChallenges.filter((c) => !oldWeeklyChallenges.includes(c));
      needsUpdate = true;
    }

    // Create current week's weekly challenge if it doesn't exist
    if (!currentWeekWeekly) {
      const newWeekly = getDefaultWeeklyChallenge();
      updatedChallenges.push(newWeekly);
      needsUpdate = true;
    }

    // Check for expired monthly challenge
    const expiredMonthly = updatedChallenges.find(
      (c) => c.type === 'monthly' && (c.status === 'expired' || c.status === 'completed')
    );
    const hasActiveMonthly = updatedChallenges.some(
      (c) => c.type === 'monthly' && c.status === 'active'
    );
    if (expiredMonthly && !hasActiveMonthly) {
      const { createMonthlyChallenge } = require('./challenges');
      const newMonthly = createMonthlyChallenge(
        { tr: 'Aylık Hedef', en: 'Monthly Goal' },
        200000,
        now
      );
      updatedChallenges.push(newMonthly);
      needsUpdate = true;
    }

    // Check for expired yearly challenge
    const expiredYearly = updatedChallenges.find(
      (c) => c.type === 'yearly' && (c.status === 'expired' || c.status === 'completed')
    );
    const hasActiveYearly = updatedChallenges.some(
      (c) => c.type === 'yearly' && c.status === 'active'
    );
    if (expiredYearly && !hasActiveYearly) {
      const { createYearlyChallenge } = require('./challenges');
      const newYearly = createYearlyChallenge(
        { tr: 'Yıllık Hedef', en: 'Yearly Goal' },
        2000000,
        now
      );
      updatedChallenges.push(newYearly);
      needsUpdate = true;
    }

    // DON'T auto-renew preset challenges
    // Preset challenges should be manually added by users, not auto-created
    // This prevents thousands of preset challenges from being created
    // Users can add preset challenges from the UI when they want them

    if (needsUpdate) {
      // Prevent concurrent updates
      isUpdatingRef.current = true;
      challengesRef.current = updatedChallenges;
      saveChallenges(updatedChallenges);
      // Reset update flags after a short delay
      setTimeout(() => {
        isUpdatingRef.current = false;
        isAutoRenewingRef.current = false;
      }, 100);
    } else {
      // Reset auto-renew flag even if no update needed
      isAutoRenewingRef.current = false;
    }
  }, [hydrated, settings?.dailyTarget, saveChallenges]);

  // Add a new challenge
  const addChallenge = useCallback(
    (challenge: Challenge) => {
      const updated = [...challenges, challenge];
      saveChallenges(updated);
    },
    [challenges, saveChallenges]
  );

  // Update a challenge
  const updateChallenge = useCallback(
    (id: string, updates: Partial<Challenge>) => {
      const updated = challenges.map((c) => (c.id === id ? { ...c, ...updates } : c));
      saveChallenges(updated);
    },
    [challenges, saveChallenges]
  );

  // Delete a challenge
  const deleteChallenge = useCallback(
    (id: string) => {
      // Don't allow deleting default daily challenge
      const challenge = challenges.find((c) => c.id === id);
      if (challenge?.type === 'daily' && challenge.id.startsWith('daily-')) {
        return;
      }
      const updated = challenges.filter((c) => c.id !== id);
      saveChallenges(updated);
    },
    [challenges, saveChallenges]
  );

  // Get progress for a specific challenge
  const getChallengeProgress = useCallback(
    (challengeId: string): ChallengeProgress | null => {
      const challenge = challenges.find((c) => c.id === challengeId);
      if (!challenge) return null;
      // PERFORMANCE: Skip calculation for expired/completed challenges
      if (challenge.status !== 'active') {
        return {
          current: challenge.progress,
          target: challenge.target,
          percentage: challenge.progress / challenge.target,
          isCompleted: challenge.status === 'completed',
        };
      }
      return calculateChallengeProgress(challenge, activities);
    },
    [challenges, activities]
  );

  // Check for newly completed challenges
  // PERFORMANCE: Only check active challenges
  const checkCompletedChallenges = useCallback((): Challenge[] => {
    const activeChallenges = challenges.filter((c) => c.status === 'active');
    return activeChallenges.filter((c) => {
      const progress = calculateChallengeProgress(c, activities);
      return progress.isCompleted;
    });
  }, [challenges, activities]);

  const clearAllChallenges = useCallback(() => {
    setChallenges([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CHALLENGES);
    }
  }, []);

  const reloadFromStorage = useCallback(() => {
    if (typeof window === 'undefined' || !activitiesHydrated || !settingsHydrated) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
      if (stored) {
        const parsed = JSON.parse(stored) as Challenge[];
        // Check if we need to add default weekly challenge
        const hasWeekly = parsed.some((c) => c.type === 'weekly' && c.id.startsWith('weekly-'));
        if (!hasWeekly) {
          const weeklyChallenge = getDefaultWeeklyChallenge();
          setChallenges([...parsed, weeklyChallenge]);
        } else {
          setChallenges(parsed);
        }
      } else {
        // Create default daily and weekly challenges
        const dailyTarget = settings?.dailyTarget ?? DEFAULT_DAILY_TARGET;
        const defaultDaily = getDefaultDailyChallenge(dailyTarget);
        const defaultWeekly = getDefaultWeeklyChallenge();
        setChallenges([defaultDaily, defaultWeekly]);
      }
    } catch (error) {
      console.error('Failed to load challenges:', error);
      // Create default challenges on error
      const dailyTarget = settings?.dailyTarget ?? DEFAULT_DAILY_TARGET;
      const defaultDaily = getDefaultDailyChallenge(dailyTarget);
      const defaultWeekly = getDefaultWeeklyChallenge();
      setChallenges([defaultDaily, defaultWeekly]);
    }
  }, [activitiesHydrated, settingsHydrated, settings?.dailyTarget]);

  const value = useMemo<ChallengeContextValue>(
    () => ({
      challenges,
      hydrated,
      addChallenge,
      updateChallenge,
      deleteChallenge,
      getChallengeProgress,
      checkCompletedChallenges,
      clearAllChallenges,
      reloadFromStorage,
    }),
    [
      challenges,
      hydrated,
      addChallenge,
      updateChallenge,
      deleteChallenge,
      getChallengeProgress,
      checkCompletedChallenges,
      clearAllChallenges,
      reloadFromStorage,
    ]
  );

  return <ChallengeContext.Provider value={value}>{children}</ChallengeContext.Provider>;
}

export function useChallenges() {
  const ctx = useContext(ChallengeContext);
  if (!ctx) {
    throw new Error('useChallenges must be used within ChallengeProvider');
  }
  return ctx;
}
