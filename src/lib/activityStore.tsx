'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  ActivityDefinition,
  ActivityKey,
  BASE_ACTIVITY_DEFINITIONS,
  BASE_ACTIVITY_MAP
} from '@/lib/activityConfig';
import { startOfDay, subDays } from 'date-fns';
import { STORAGE_KEYS, TIMEOUTS } from '@/lib/constants';
import { useDebounce } from '@/lib/hooks/useDebounce';

const STORAGE_KEY = STORAGE_KEYS.ACTIVITIES;

export type ActivityRecord = {
  id: string;
  activityKey: ActivityKey;
  label: string;
  labelEn?: string;
  icon: string;
  unit: string;
  unitEn?: string;
  multiplier: number;
  amount: number;
  points: number;
  performedAt: string;
  note?: string | null;
  description?: string;
  descriptionEn?: string;
  isCustom?: boolean;
  category?: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';
  duration?: number; // Duration in seconds
};

type AddActivityInput = {
  definition: ActivityDefinition;
  amount: number;
  performedAt?: string;
  note?: string | null;
  duration?: number; // Duration in seconds
};

type UpdateActivityInput = AddActivityInput;

type ActivitiesContextValue = {
  activities: ActivityRecord[];
  hydrated: boolean;
  storageError: string | null;
  clearStorageError: () => void;
  addActivity: (input: AddActivityInput) => ActivityRecord;
  updateActivity: (id: string, input: UpdateActivityInput) => ActivityRecord | null;
  deleteActivity: (id: string) => void;
};

const ActivitiesContext = createContext<ActivitiesContextValue | null>(null);

const BASE_DEFINITION_MAP = BASE_ACTIVITY_MAP;

function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

function computePoints(multiplier: number, amount: number) {
  return Math.max(0, Math.round(amount * multiplier));
}

function buildRecord(
  definition: ActivityDefinition,
  amount: number,
  performedAt?: string,
  note?: string | null,
  duration?: number
): ActivityRecord {
  const iso = performedAt ? new Date(performedAt).toISOString() : new Date().toISOString();
  const multiplier = definition.multiplier;
  return {
    id: generateId(),
    activityKey: definition.key,
    label: definition.label,
    labelEn: definition.labelEn,
    icon: definition.icon,
    unit: definition.unit,
    unitEn: definition.unitEn,
    multiplier,
    amount,
    points: computePoints(multiplier, amount),
    performedAt: iso,
    note: note ?? null,
    description: definition.description,
    descriptionEn: definition.descriptionEn,
    isCustom: definition.isCustom ?? false,
    duration: duration && duration > 0 ? duration : undefined
  };
}

function normalizeRecord(record: Partial<ActivityRecord>): ActivityRecord {
  const fallback = BASE_DEFINITION_MAP[record.activityKey ?? ''];
  const multiplier =
    typeof record.multiplier === 'number'
      ? record.multiplier
      : fallback?.multiplier ?? 1;
  const amount = record.amount ?? 0;

  return {
    id: record.id ?? generateId(),
    activityKey: record.activityKey ?? fallback?.key ?? 'CUSTOM',
    label: record.label ?? fallback?.label ?? record.activityKey ?? 'Bilinmeyen Aktivite',
    labelEn: record.labelEn ?? fallback?.labelEn,
    icon: record.icon ?? fallback?.icon ?? '🏃',
    unit: record.unit ?? fallback?.unit ?? '',
    unitEn: record.unitEn ?? fallback?.unitEn,
    multiplier,
    amount,
    points:
      typeof record.points === 'number'
        ? record.points
        : computePoints(multiplier, amount),
    performedAt: record.performedAt ?? new Date().toISOString(),
    note: record.note ?? null,
    description: record.description ?? fallback?.description,
    descriptionEn: record.descriptionEn ?? fallback?.descriptionEn,
    isCustom: record.isCustom ?? !fallback
  };
}

export function ActivitiesProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const debouncedActivities = useDebounce(activities, TIMEOUTS.DEBOUNCE_DELAY);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<ActivityRecord>[];
        const normalized = parsed.map((record) => normalizeRecord(record));
        setActivities(normalized);
        setStorageError(null);
      } catch (error) {
        console.error('Failed to parse activities from storage', error);
        setStorageError('parse');
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(debouncedActivities));
      setStorageError(null);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        setStorageError('quota');
      } else {
        console.error('Failed to save activities to storage', error);
        setStorageError('save');
      }
    }
  }, [debouncedActivities, hydrated]);

  const addActivity = useCallback(
    (input: AddActivityInput) => {
      const record = buildRecord(
        input.definition,
        input.amount,
        input.performedAt,
        input.note,
        input.duration
      );
      setActivities((prev) => [record, ...prev]);
      return record;
    },
    []
  );

  const updateActivity = useCallback(
    (id: string, input: UpdateActivityInput) => {
      let updated: ActivityRecord | null = null;
      setActivities((prev) =>
        prev.map((record) => {
          if (record.id !== id) {
            return record;
          }
          const iso = input.performedAt
            ? new Date(input.performedAt).toISOString()
            : record.performedAt;
          const multiplier = input.definition.multiplier;
          updated = {
            ...record,
            activityKey: input.definition.key,
            label: input.definition.label,
            labelEn: input.definition.labelEn,
            icon: input.definition.icon,
            unit: input.definition.unit,
            unitEn: input.definition.unitEn,
            multiplier,
            amount: input.amount,
            performedAt: iso,
            note: input.note ?? null,
            points: computePoints(multiplier, input.amount),
            isCustom: input.definition.isCustom ?? false,
            duration: input.duration && input.duration > 0 ? input.duration : undefined
          };
          return updated;
        })
      );
      return updated;
    },
    []
  );

  const deleteActivity = useCallback((id: string) => {
    setActivities((prev) => prev.filter((record) => record.id !== id));
  }, []);

  const clearStorageError = useCallback(() => {
    setStorageError(null);
  }, []);

  const value = useMemo<ActivitiesContextValue>(
    () => ({
      activities,
      hydrated,
      storageError,
      clearStorageError,
      addActivity,
      updateActivity,
      deleteActivity
    }),
    [activities, hydrated, storageError, clearStorageError, addActivity, updateActivity, deleteActivity]
  );

  return (
    <ActivitiesContext.Provider value={value}>
      {children}
    </ActivitiesContext.Provider>
  );
}

export function useActivities() {
  const ctx = useContext(ActivitiesContext);
  if (!ctx) {
    throw new Error('useActivities must be used within ActivitiesProvider');
  }
  return ctx;
}

export type ActivitiesSummary = {
  todayPoints: number;
  targetPoints: number;
  totalPoints: number;
  totalActivities: number;
  streakDays: number;
  lastSevenDays: Array<{ date: string; points: number }>;
  breakdownToday: Array<{
    key: ActivityKey;
    label: string;
    labelEn?: string;
    icon: string;
    amount: number;
    unit: string;
    unitEn?: string;
    points: number;
  }>;
};

export function computeSummary(
  activities: ActivityRecord[],
  targetPoints: number,
  now: Date = new Date()
): ActivitiesSummary {
  const startToday = startOfDay(now);
  const startForStreak = subDays(startToday, 30);

  const pointsPerDay = new Map<string, number>();
    const breakdownTodayMap = new Map<
    ActivityKey,
    { label: string; labelEn?: string; icon: string; unit: string; unitEn?: string; amount: number; points: number }
  >();

  for (const activity of activities) {
    const performedAt = new Date(activity.performedAt);
    if (Number.isNaN(performedAt.valueOf())) continue;

    const dayKey = startOfDay(performedAt).toISOString();
    pointsPerDay.set(dayKey, (pointsPerDay.get(dayKey) ?? 0) + activity.points);

    if (performedAt >= startToday) {
      const bucket =
        breakdownTodayMap.get(activity.activityKey) ?? {
          label: activity.label,
          labelEn: activity.labelEn,
          icon: activity.icon,
          unit: activity.unit,
          unitEn: activity.unitEn,
          amount: 0,
          points: 0
        };
      bucket.amount += activity.amount;
      bucket.points += activity.points;
      breakdownTodayMap.set(activity.activityKey, bucket);
    }
  }

  const todayPoints = pointsPerDay.get(startToday.toISOString()) ?? 0;
  const lastSevenDays = Array.from({ length: 7 }, (_, idx) => {
    const day = subDays(startToday, 6 - idx);
    const key = day.toISOString();
    return {
      date: key,
      points: pointsPerDay.get(key) ?? 0
    };
  }).reverse();

  let streakDays = 0;
  for (let offset = 0; offset < 30; offset += 1) {
    const day = subDays(startToday, offset);
    if (day < startForStreak) break;
    const key = day.toISOString();
    const dailyPoints = pointsPerDay.get(key) ?? 0;
    if (dailyPoints >= targetPoints) {
      streakDays += 1;
    } else if (offset === 0) {
      continue;
    } else {
      break;
    }
  }

  const breakdownToday = Array.from(breakdownTodayMap.entries())
    .map(([key, value]) => ({
      key,
      label: value.label,
      labelEn: value.labelEn,
      icon: value.icon,
      amount: value.amount,
      unit: value.unit,
      unitEn: value.unitEn,
      points: value.points
    }))
    .sort((a, b) => b.points - a.points);

  const totalPoints = activities.reduce((sum, activity) => sum + activity.points, 0);

  return {
    todayPoints,
    targetPoints,
    totalPoints,
    totalActivities: activities.length,
    streakDays,
    lastSevenDays,
    breakdownToday
  };
}

export function useActivitiesSummary(targetPoints: number) {
  const { activities } = useActivities();
  return useMemo(
    () => computeSummary(activities, targetPoints),
    [activities, targetPoints]
  );
}

export function getBaseActivityDefinitions(): ActivityDefinition[] {
  return BASE_ACTIVITY_DEFINITIONS;
}

