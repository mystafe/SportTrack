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
  BASE_ACTIVITY_MAP,
  DEFAULT_DAILY_TARGET
} from '@/lib/activityConfig';

import { STORAGE_KEYS } from '@/lib/constants';

const STORAGE_KEY = STORAGE_KEYS.SETTINGS;

export type CustomActivityDefinition = {
  id: ActivityKey;
  label: string;
  labelEn?: string;
  icon: string;
  multiplier: number;
  unit: string;
  unitEn?: string;
  defaultAmount: number;
  description?: string;
  descriptionEn?: string;
};

export type Mood = 'happy' | 'cheerful' | 'sad' | 'unhappy' | 'tired' | null;

export type UserSettings = {
  name: string;
  dailyTarget: number;
  customActivities: CustomActivityDefinition[];
  mood?: Mood;
};

function dedupeCustomActivities(
  list?: CustomActivityDefinition[]
): CustomActivityDefinition[] {
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  const result: CustomActivityDefinition[] = [];
  for (const activity of list) {
    if (!activity || typeof activity.id !== 'string') continue;
    if (seen.has(activity.id)) continue;
    seen.add(activity.id);
    result.push(activity);
  }
  return result;
}

type SettingsContextValue = {
  settings: UserSettings | null;
  hydrated: boolean;
  saveSettings: (settings: UserSettings) => void;
  addCustomActivity: (activity: CustomActivityDefinition) => void;
  updateCustomActivity: (
    id: ActivityKey,
    updates: Partial<CustomActivityDefinition>
  ) => void;
  removeCustomActivity: (id: ActivityKey) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<UserSettings>;
        if (
          parsed &&
          typeof parsed.name === 'string' &&
          parsed.name.trim() &&
          typeof parsed.dailyTarget === 'number' &&
          Number.isFinite(parsed.dailyTarget) &&
          parsed.dailyTarget > 0
        ) {
          setSettings({
            name: parsed.name,
            dailyTarget: parsed.dailyTarget,
            customActivities: dedupeCustomActivities(parsed.customActivities as CustomActivityDefinition[])
          });
        }
      }
    } catch (error) {
      console.error('Failed to read settings', error);
    } finally {
      setHydrated(true);
    }
  }, []);

  const persist = useCallback((next: UserSettings) => {
    const normalized: UserSettings = {
      ...next,
      customActivities: dedupeCustomActivities(next.customActivities)
    };
    setSettings(normalized);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
  }, []);

  const saveSettings = useCallback(
    (next: UserSettings) =>
      persist({
        ...next,
        customActivities:
          next.customActivities ??
          dedupeCustomActivities(settings?.customActivities)
      }),
    [persist, settings]
  );

  const addCustomActivity = useCallback(
    (activity: CustomActivityDefinition) => {
      setSettings((prev) => {
        const base: UserSettings = prev ?? {
          name: '',
          dailyTarget: DEFAULT_DAILY_TARGET,
          customActivities: []
        };
        const next: UserSettings = {
          ...base,
          customActivities: [activity, ...base.customActivities.filter((existing) => existing.id !== activity.id)]
        };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const updateCustomActivity = useCallback(
    (id: ActivityKey, updates: Partial<CustomActivityDefinition>) => {
      setSettings((prev) => {
        if (!prev) return prev;
        const next: UserSettings = {
          ...prev,
          customActivities: prev.customActivities.map((activity) =>
            activity.id === id ? { ...activity, ...updates } : activity
          )
        };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const removeCustomActivity = useCallback(
    (id: ActivityKey) => {
      setSettings((prev) => {
        if (!prev) return prev;
        const next: UserSettings = {
          ...prev,
          customActivities: prev.customActivities.filter((activity) => activity.id !== id)
        };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      hydrated,
      saveSettings,
      addCustomActivity,
      updateCustomActivity,
      removeCustomActivity
    }),
    [settings, hydrated, saveSettings, addCustomActivity, updateCustomActivity, removeCustomActivity]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}

export function useActivityDefinitions(): ActivityDefinition[] {
  const { settings } = useSettings();
  return useMemo(() => {
    const custom = dedupeCustomActivities(settings?.customActivities);
    const ordered = new Map<ActivityKey, ActivityDefinition>();

    for (const definition of BASE_ACTIVITY_DEFINITIONS) {
      ordered.set(definition.key, definition);
    }

    for (const activity of custom) {
      ordered.set(activity.id, {
        ...activity,
        key: activity.id,
        isCustom: true
      });
    }

    return Array.from(ordered.values());
  }, [settings]);
}

export function findActivityDefinition(
  key: ActivityKey,
  settings: UserSettings | null
): ActivityDefinition | undefined {
  const custom = settings?.customActivities?.find((activity) => activity.id === key);
  if (custom) {
    return {
      ...custom,
      key: custom.id,
      isCustom: true
    };
  }
  return BASE_ACTIVITY_MAP[key];
}

