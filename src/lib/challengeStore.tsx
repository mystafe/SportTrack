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
  getDefaultYearlyChallenge,
  createDailyChallenge,
  createWeeklyChallenge,
  createYearlyChallenge,
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

        // AGGRESSIVE: Keep only ONE preset challenge per preset ID (regardless of status)
        // Remove ALL duplicates - keep only the newest active one, or if none active, keep the newest
        // Also handle old preset challenges that don't have preset- prefix in ID
        const presetChallenges = loadedChallenges.filter((c) => {
          // Include challenges that start with preset- OR match preset by name/target/type
          if (c.id.startsWith('preset-')) {
            return true;
          }
          // Check if this might be a preset challenge by matching name/target/type
          return PRESET_CHALLENGES.some((p) => {
            const nameMatch =
              (p.name.tr === c.name.tr && p.name.en === c.name.en) ||
              p.name.tr === c.name.tr ||
              p.name.en === c.name.en;
            const targetMatch = p.target === c.target;
            const typeMatch = p.type === c.type;
            return nameMatch && targetMatch && typeMatch;
          });
        });

        const presetIdMap = new Map<string, Challenge>(); // preset base ID -> challenge

        presetChallenges.forEach((c) => {
          // Find the base preset ID by matching with PRESET_CHALLENGES
          // Challenge IDs are like: preset-weekly-super-1764256538720-1-abc123xyz
          // We need to match with preset ID: preset-weekly-super
          let matchingPreset = PRESET_CHALLENGES.find((p) => {
            // Check if challenge ID starts with preset ID followed by a dash or equals it
            return c.id.startsWith(p.id + '-') || c.id === p.id;
          });

          // If not found by ID, try matching by name/target/type (for old challenges)
          if (!matchingPreset) {
            matchingPreset = PRESET_CHALLENGES.find((p) => {
              const nameMatch =
                (p.name.tr === c.name.tr && p.name.en === c.name.en) ||
                p.name.tr === c.name.tr ||
                p.name.en === c.name.en;
              const targetMatch = p.target === c.target;
              const typeMatch = p.type === c.type;
              return nameMatch && targetMatch && typeMatch;
            });
          }

          if (matchingPreset) {
            const existing = presetIdMap.get(matchingPreset.id);
            if (!existing) {
              // First occurrence of this preset
              presetIdMap.set(matchingPreset.id, c);
            } else {
              // Already have one - decide which to keep based on status and date
              const cDate = new Date(c.createdAt || 0).getTime();
              const existingDate = new Date(existing.createdAt || 0).getTime();

              // Priority: active > inactive, then newer > older
              if (c.status === 'active' && existing.status !== 'active') {
                // Keep active one
                idsToRemove.add(existing.id);
                presetIdMap.set(matchingPreset.id, c);
              } else if (existing.status === 'active' && c.status !== 'active') {
                // Keep existing active one
                idsToRemove.add(c.id);
              } else {
                // Both same status - keep the newer one
                if (cDate > existingDate) {
                  idsToRemove.add(existing.id);
                  presetIdMap.set(matchingPreset.id, c);
                } else {
                  idsToRemove.add(c.id);
                }
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

        // Preset challenge cleanup is already handled above (lines 144-179)
        // Don't remove all preset challenges here - we want to keep active ones

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

        // AGGRESSIVE: Final duplicate check for preset challenges AFTER cleanup
        // This ensures we catch any duplicates that might have been missed in the first pass
        const presetChallengesAfterCleanup = loadedChallenges.filter((c) =>
          c.id.startsWith('preset-')
        );
        const presetIdMapAfterCleanup = new Map<string, Challenge>();
        const duplicateIdsToRemove = new Set<string>();

        presetChallengesAfterCleanup.forEach((c) => {
          const matchingPreset = PRESET_CHALLENGES.find(
            (p) => c.id.startsWith(p.id + '-') || c.id === p.id
          );

          if (matchingPreset) {
            const existing = presetIdMapAfterCleanup.get(matchingPreset.id);
            if (!existing) {
              presetIdMapAfterCleanup.set(matchingPreset.id, c);
            } else {
              // Duplicate found - decide which to keep
              const cDate = new Date(c.createdAt || 0).getTime();
              const existingDate = new Date(existing.createdAt || 0).getTime();

              // Priority: active > inactive, then newer > older
              if (c.status === 'active' && existing.status !== 'active') {
                duplicateIdsToRemove.add(existing.id);
                presetIdMapAfterCleanup.set(matchingPreset.id, c);
              } else if (existing.status === 'active' && c.status !== 'active') {
                duplicateIdsToRemove.add(c.id);
              } else {
                // Both same status - keep the newer one
                if (cDate > existingDate) {
                  duplicateIdsToRemove.add(existing.id);
                  presetIdMapAfterCleanup.set(matchingPreset.id, c);
                } else {
                  duplicateIdsToRemove.add(c.id);
                }
              }
            }
          }
        });

        // Remove duplicates found in second pass
        if (duplicateIdsToRemove.size > 0) {
          loadedChallenges = loadedChallenges.filter((c) => !duplicateIdsToRemove.has(c.id));
          console.log(
            `🧹 Second pass: Removed ${duplicateIdsToRemove.size} duplicate preset challenges`
          );
        }
      }

      // Ensure daily, weekly, and yearly challenges exist and auto-renew
      const dailyTarget = settings?.dailyTarget ?? DEFAULT_DAILY_TARGET;
      const now = new Date();
      const todayStr = format(startOfDay(now), 'yyyy-MM-dd');
      const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
      const currentWeekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
      const currentYearStart = startOfYear(now);
      const currentYearStr = format(currentYearStart, 'yyyy');

      // Check and create/renew daily challenge
      const existingDaily = loadedChallenges.find(
        (c) => c.type === 'daily' && c.id.startsWith('daily-') && c.startDate.startsWith(todayStr)
      );
      if (!existingDaily) {
        // Remove old daily challenges and create new one
        loadedChallenges = loadedChallenges.filter(
          (c) => !(c.type === 'daily' && c.id.startsWith('daily-'))
        );
        const newDaily = createDailyChallenge(
          { tr: 'Günlük Hedef', en: 'Daily Goal' },
          dailyTarget,
          now,
          '⭐'
        );
        loadedChallenges.push(newDaily);
      } else if (existingDaily.target !== dailyTarget) {
        // Update daily target if settings changed
        const updatedDaily = { ...existingDaily, target: dailyTarget };
        loadedChallenges = loadedChallenges.map((c) =>
          c.id === existingDaily.id ? updatedDaily : c
        );
      }

      // Check and create/renew weekly challenge
      // Weekly target = dailyTarget * 7
      const weeklyTarget = dailyTarget * 7;
      const existingWeekly = loadedChallenges.find((c) => {
        if (c.type === 'weekly' && c.id.startsWith('weekly-')) {
          const challengeStart = parseISO(c.startDate);
          return (
            format(startOfWeek(challengeStart, { weekStartsOn: 1 }), 'yyyy-MM-dd') ===
            currentWeekStartStr
          );
        }
        return false;
      });
      if (!existingWeekly) {
        // Remove old weekly challenges and create new one
        loadedChallenges = loadedChallenges.filter(
          (c) => !(c.type === 'weekly' && c.id.startsWith('weekly-'))
        );
        const newWeekly = createWeeklyChallenge(
          { tr: 'Haftalık Hedef', en: 'Weekly Goal' },
          weeklyTarget,
          now,
          '🔥'
        );
        loadedChallenges.push(newWeekly);
      } else if (existingWeekly.target !== weeklyTarget) {
        // Update weekly target if daily target changed
        const updatedWeekly = { ...existingWeekly, target: weeklyTarget };
        loadedChallenges = loadedChallenges.map((c) =>
          c.id === existingWeekly.id ? updatedWeekly : c
        );
      }

      // Check and create/renew yearly challenge
      // Yearly target = dailyTarget * 365
      const yearlyTarget = dailyTarget * 365;
      const existingYearly = loadedChallenges.find((c) => {
        if (c.type === 'yearly' && c.id.startsWith('yearly-')) {
          const challengeStart = parseISO(c.startDate);
          return format(startOfYear(challengeStart), 'yyyy') === currentYearStr;
        }
        return false;
      });
      if (!existingYearly) {
        // Remove old yearly challenges and create new one
        loadedChallenges = loadedChallenges.filter(
          (c) => !(c.type === 'yearly' && c.id.startsWith('yearly-'))
        );
        const newYearly = createYearlyChallenge(
          { tr: 'Yıllık Hedef', en: 'Yearly Goal' },
          yearlyTarget,
          now,
          '🗓️'
        );
        loadedChallenges.push(newYearly);
      } else if (existingYearly.target !== yearlyTarget) {
        // Update yearly target if daily target changed
        const updatedYearly = { ...existingYearly, target: yearlyTarget };
        loadedChallenges = loadedChallenges.map((c) =>
          c.id === existingYearly.id ? updatedYearly : c
        );
      }

      // Add preset challenges automatically if they don't exist as active challenges
      // IMPORTANT: Check against cleaned up challenges list (after removing duplicates)
      // Only add if they don't exist as active challenges
      // Use a Set to track which preset IDs already have active challenges (more efficient)
      const activePresetIds = new Set<string>();
      const allPresetIds = new Set<string>(); // Track ALL preset IDs (active or not) to prevent duplicates

      loadedChallenges.forEach((c) => {
        if (c.id.startsWith('preset-')) {
          // Find matching preset base ID
          const matchingPreset = PRESET_CHALLENGES.find(
            (p) => c.id.startsWith(p.id + '-') || c.id === p.id
          );
          if (matchingPreset) {
            allPresetIds.add(matchingPreset.id);
            if (c.status === 'active') {
              activePresetIds.add(matchingPreset.id);
            }
          }
        }
      });

      PRESET_CHALLENGES.forEach((preset) => {
        // Only add if no preset challenge exists for this preset ID (active or not)
        // This prevents duplicates even if status is not active
        if (!allPresetIds.has(preset.id)) {
          const presetChallenge = createChallengeFromPreset(preset, now);
          // Ensure status is active
          presetChallenge.status = 'active';
          loadedChallenges.push(presetChallenge);
          // Track that we added this preset
          allPresetIds.add(preset.id);
        }
      });

      // Migrate existing challenges without category to have categories
      loadedChallenges = loadedChallenges.map((challenge) => {
        // If challenge already has category, keep it
        if (challenge.category) {
          return challenge;
        }

        // Assign category based on challenge type and ID
        let category:
          | 'motivation'
          | 'achievement'
          | 'consistency'
          | 'milestone'
          | 'special'
          | 'custom'
          | undefined;

        if (challenge.id.startsWith('preset-')) {
          // Get category from preset
          const preset = PRESET_CHALLENGES.find(
            (p) => challenge.id.startsWith(p.id + '-') || challenge.id === p.id
          );
          category = preset ? preset.category : undefined;
        } else if (
          challenge.id.startsWith('daily-') ||
          challenge.id.startsWith('weekly-') ||
          challenge.id.startsWith('monthly-')
        ) {
          category = 'consistency';
        } else if (challenge.id.startsWith('yearly-')) {
          category = 'milestone';
        } else if (challenge.type === 'seasonal') {
          category = 'milestone';
        } else if (challenge.type === 'streak_based') {
          category = 'consistency';
        } else if (challenge.type === 'time_based') {
          category = 'motivation';
        } else if (challenge.type === 'activity_specific') {
          category = 'achievement';
        } else if (challenge.type === 'custom') {
          category = 'custom';
        }

        return {
          ...challenge,
          category,
        };
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

    // Use current challenges state instead of ref to ensure we have the latest
    setChallenges((currentChallenges) => {
      const today = new Date();
      const todayStr = format(startOfDay(today), 'yyyy-MM-dd');

      // Find today's daily challenge
      const defaultDaily = currentChallenges.find(
        (c) => c.type === 'daily' && c.id.startsWith('daily-') && c.startDate.startsWith(todayStr)
      );

      if (defaultDaily && defaultDaily.target !== settings.dailyTarget) {
        isUpdatingDailyTargetRef.current = true;

        // Update today's challenge target
        const updated = currentChallenges.map((c) =>
          c.id === defaultDaily.id ? { ...c, target: settings.dailyTarget } : c
        );
        challengesRef.current = updated;

        // Save asynchronously
        setTimeout(() => {
          saveChallenges(updated);
          isUpdatingDailyTargetRef.current = false;
        }, 100);

        return updated;
      } else if (!defaultDaily) {
        // No daily challenge for today, create one
        isUpdatingDailyTargetRef.current = true;
        const newDaily = getDefaultDailyChallenge(settings.dailyTarget);
        const updated = [...currentChallenges, newDaily];
        challengesRef.current = updated;

        // Save asynchronously
        setTimeout(() => {
          saveChallenges(updated);
          isUpdatingDailyTargetRef.current = false;
        }, 100);

        return updated;
      }

      return currentChallenges;
    });
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

  // Auto-renew recurring goals (daily, weekly, yearly) when period ends
  // Check periodically and create new goals when period ends
  useEffect(() => {
    if (!hydrated || !activitiesHydrated || !settingsHydrated) return;

    const checkAndRenewGoals = () => {
      if (isUpdatingRef.current) return;

      const currentChallenges = challengesRef.current;
      const now = new Date();
      const todayStr = format(startOfDay(now), 'yyyy-MM-dd');
      const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
      const currentWeekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
      const currentYearStart = startOfYear(now);
      const currentYearStr = format(currentYearStart, 'yyyy');
      const dailyTarget = settings?.dailyTarget ?? DEFAULT_DAILY_TARGET;

      let needsUpdate = false;
      let updatedChallenges = [...currentChallenges];

      // Check daily goal - renew if expired or missing
      const dailyGoal = updatedChallenges.find(
        (c) => c.type === 'daily' && c.id.startsWith('daily-')
      );
      const dailyStartDate = dailyGoal ? parseISO(dailyGoal.startDate) : null;
      const isDailyExpired =
        !dailyGoal ||
        (dailyStartDate && format(startOfDay(dailyStartDate), 'yyyy-MM-dd') !== todayStr);

      if (isDailyExpired) {
        // Remove old daily goals
        updatedChallenges = updatedChallenges.filter(
          (c) => !(c.type === 'daily' && c.id.startsWith('daily-'))
        );
        // Create new daily goal
        const newDaily = createDailyChallenge(
          { tr: 'Günlük Hedef', en: 'Daily Goal' },
          dailyTarget,
          now,
          '⭐'
        );
        updatedChallenges.push(newDaily);
        needsUpdate = true;
      }

      // Check weekly goal - renew if expired or missing
      const weeklyGoal = updatedChallenges.find(
        (c) => c.type === 'weekly' && c.id.startsWith('weekly-')
      );
      const weeklyStartDate = weeklyGoal ? parseISO(weeklyGoal.startDate) : null;
      const weeklyStartStr = weeklyStartDate
        ? format(startOfWeek(weeklyStartDate, { weekStartsOn: 1 }), 'yyyy-MM-dd')
        : '';
      const isWeeklyExpired = !weeklyGoal || weeklyStartStr !== currentWeekStartStr;

      if (isWeeklyExpired) {
        // Remove old weekly goals
        updatedChallenges = updatedChallenges.filter(
          (c) => !(c.type === 'weekly' && c.id.startsWith('weekly-'))
        );
        // Create new weekly goal
        const newWeekly = createWeeklyChallenge(
          { tr: 'Haftalık Hedef', en: 'Weekly Goal' },
          50000,
          now,
          '🔥'
        );
        updatedChallenges.push(newWeekly);
        needsUpdate = true;
      }

      // Check yearly goal - renew if expired or missing
      const yearlyGoal = updatedChallenges.find(
        (c) => c.type === 'yearly' && c.id.startsWith('yearly-')
      );
      const yearlyStartDate = yearlyGoal ? parseISO(yearlyGoal.startDate) : null;
      const yearlyStartStr = yearlyStartDate ? format(startOfYear(yearlyStartDate), 'yyyy') : '';
      const isYearlyExpired = !yearlyGoal || yearlyStartStr !== currentYearStr;

      if (isYearlyExpired) {
        // Remove old yearly goals
        updatedChallenges = updatedChallenges.filter(
          (c) => !(c.type === 'yearly' && c.id.startsWith('yearly-'))
        );
        // Create new yearly goal
        const newYearly = createYearlyChallenge(
          { tr: 'Yıllık Hedef', en: 'Yearly Goal' },
          1000000,
          now,
          '🗓️'
        );
        updatedChallenges.push(newYearly);
        needsUpdate = true;
      }

      if (needsUpdate) {
        isUpdatingRef.current = true;
        challengesRef.current = updatedChallenges;
        saveChallenges(updatedChallenges);
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
      }
    };

    // Check immediately
    checkAndRenewGoals();

    // Check every minute to catch day/week/year transitions
    const interval = setInterval(checkAndRenewGoals, 60000);

    return () => clearInterval(interval);
  }, [hydrated, activitiesHydrated, settingsHydrated, settings?.dailyTarget, saveChallenges]);

  // Add a new challenge
  const addChallenge = useCallback(
    (challenge: Challenge) => {
      // Ensure challenge has category and is active
      const challengeWithCategory: Challenge = {
        ...challenge,
        status: 'active', // Ensure new challenges are active
        category:
          challenge.category ||
          (() => {
            // Assign category if missing
            if (challenge.type === 'custom') return 'custom';
            if (challenge.id.startsWith('preset-')) {
              const preset = PRESET_CHALLENGES.find(
                (p) => challenge.id.startsWith(p.id + '-') || challenge.id === p.id
              );
              return preset ? preset.category : 'custom';
            }
            if (
              challenge.id.startsWith('daily-') ||
              challenge.id.startsWith('weekly-') ||
              challenge.id.startsWith('monthly-')
            )
              return 'consistency';
            if (challenge.id.startsWith('yearly-')) return 'milestone';
            if (challenge.type === 'seasonal') return 'milestone';
            if (challenge.type === 'streak_based') return 'consistency';
            if (challenge.type === 'time_based') return 'motivation';
            if (challenge.type === 'activity_specific') return 'achievement';
            return 'custom';
          })(),
      };

      const currentChallenges = challengesRef.current;
      const updated = [...currentChallenges, challengeWithCategory];
      challengesRef.current = updated;

      // Update state immediately for UI responsiveness
      setChallenges(updated);

      // Save to localStorage
      saveChallenges(updated);
    },
    [saveChallenges]
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
