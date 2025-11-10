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
  ACTIVITY_DEFINITIONS,
  ActivityKey,
  calculatePoints,
  DAILY_TARGET_POINTS
} from '@/lib/activityConfig';
import { startOfDay, subDays } from 'date-fns';

const STORAGE_KEY = 'sporttrack.activities.v1';

export type ActivityRecord = {
  id: string;
  activityKey: ActivityKey;
  amount: number;
  points: number;
  performedAt: string;
  note?: string | null;
};

type AddActivityInput = {
  activityKey: ActivityKey;
  amount: number;
  performedAt?: string;
  note?: string | null;
};

type UpdateActivityInput = {
  activityKey: ActivityKey;
  amount: number;
  performedAt?: string;
  note?: string | null;
};

type ActivitiesContextValue = {
  activities: ActivityRecord[];
  hydrated: boolean;
  addActivity: (input: AddActivityInput) => ActivityRecord;
  updateActivity: (id: string, input: UpdateActivityInput) => ActivityRecord | null;
  deleteActivity: (id: string) => void;
};

const ActivitiesContext = createContext<ActivitiesContextValue | null>(null);

function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export function ActivitiesProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ActivityRecord[];
        setActivities(parsed);
      } catch (err) {
        console.error('Failed to parse activities from storage', err);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }, [activities, hydrated]);

  const addActivity = useCallback(
    (input: AddActivityInput) => {
      const performedAt = input.performedAt
        ? new Date(input.performedAt).toISOString()
        : new Date().toISOString();
      const points = calculatePoints(input.activityKey, input.amount);
      const record: ActivityRecord = {
        id: generateId(),
        activityKey: input.activityKey,
        amount: input.amount,
        points,
        performedAt,
        note: input.note ?? null
      };
      setActivities((prev) => [record, ...prev]);
      return record;
    },
    []
  );

  const updateActivity = useCallback(
    (id: string, input: UpdateActivityInput) => {
      let updatedRecord: ActivityRecord | null = null;
      setActivities((prev) =>
        prev.map((record) => {
          if (record.id !== id) {
            return record;
          }
          const performedAt = input.performedAt
            ? new Date(input.performedAt).toISOString()
            : record.performedAt;
          const next: ActivityRecord = {
            ...record,
            activityKey: input.activityKey,
            amount: input.amount,
            note: input.note ?? null,
            performedAt,
            points: calculatePoints(input.activityKey, input.amount)
          };
          updatedRecord = next;
          return next;
        })
      );
      return updatedRecord;
    },
    []
  );

  const deleteActivity = useCallback((id: string) => {
    setActivities((prev) => prev.filter((record) => record.id !== id));
  }, []);

  const value = useMemo<ActivitiesContextValue>(
    () => ({
      activities,
      hydrated,
      addActivity,
      updateActivity,
      deleteActivity
    }),
    [activities, hydrated, addActivity, updateActivity, deleteActivity]
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
    amount: number;
    unit: string;
    points: number;
  }>;
};

export function computeSummary(
  activities: ActivityRecord[],
  now: Date = new Date()
): ActivitiesSummary {
  const startToday = startOfDay(now);
  const startForStreak = subDays(startToday, 30);

  const pointsPerDay = new Map<string, number>();
  const breakdownTodayMap = new Map<ActivityKey, { amount: number; points: number }>();

  for (const activity of activities) {
    const performedAt = new Date(activity.performedAt);
    if (Number.isNaN(performedAt.valueOf())) {
      continue;
    }
    const dayKey = startOfDay(performedAt).toISOString();
    pointsPerDay.set(dayKey, (pointsPerDay.get(dayKey) ?? 0) + activity.points);

    if (performedAt >= startToday) {
      const key = activity.activityKey;
      const existing = breakdownTodayMap.get(key) ?? { amount: 0, points: 0 };
      existing.amount += activity.amount;
      existing.points += activity.points;
      breakdownTodayMap.set(key, existing);
    }
  }

  const todayPoints = pointsPerDay.get(startToday.toISOString()) ?? 0;
  const lastSevenDays = Array.from({ length: 7 }, (_, idx) => {
    const day = subDays(startToday, 6 - idx);
    const key = day.toISOString();
    return {
      date: day.toISOString(),
      points: pointsPerDay.get(key) ?? 0
    };
  });

  let streakDays = 0;
  for (let offset = 0; offset < 30; offset += 1) {
    const day = subDays(startToday, offset);
    if (day < startForStreak) {
      break;
    }
    const key = day.toISOString();
    const dailyPoints = pointsPerDay.get(key) ?? 0;
    if (dailyPoints >= DAILY_TARGET_POINTS) {
      streakDays += 1;
    } else {
      break;
    }
  }

  const breakdownToday = Array.from(breakdownTodayMap.entries())
    .map(([key, value]) => ({
      key,
      label: ACTIVITY_DEFINITIONS[key].label,
      amount: value.amount,
      unit: ACTIVITY_DEFINITIONS[key].unit,
      points: value.points
    }))
    .sort((a, b) => b.points - a.points);

  const totalPoints = activities.reduce((sum, activity) => sum + activity.points, 0);

  return {
    todayPoints,
    targetPoints: DAILY_TARGET_POINTS,
    totalPoints,
    totalActivities: activities.length,
    streakDays,
    lastSevenDays,
    breakdownToday
  };
}

export function useActivitiesSummary() {
  const { activities } = useActivities();
  return useMemo(() => computeSummary(activities), [activities]);
}

