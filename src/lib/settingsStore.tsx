'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityDefinition,
  ActivityKey,
  BASE_ACTIVITY_DEFINITIONS,
  BASE_ACTIVITY_MAP,
  DEFAULT_DAILY_TARGET,
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
export type ListDensity = 'compact' | 'comfortable';

export type BaseActivityOverride = {
  key: ActivityKey;
  label?: string;
  labelEn?: string;
  icon?: string;
  multiplier?: number;
  unit?: string;
  unitEn?: string;
  defaultAmount?: number;
  description?: string;
  descriptionEn?: string;
};

export type UserSettings = {
  name: string;
  dailyTarget: number;
  customActivities: CustomActivityDefinition[];
  baseActivityOverrides?: BaseActivityOverride[];
  mood?: Mood;
  listDensity?: ListDensity;
  reduceAnimations?: boolean;
};

function dedupeCustomActivities(list?: CustomActivityDefinition[]): CustomActivityDefinition[] {
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
  updateCustomActivity: (id: ActivityKey, updates: Partial<CustomActivityDefinition>) => void;
  removeCustomActivity: (id: ActivityKey) => void;
  updateBaseActivity: (key: ActivityKey, updates: Partial<BaseActivityOverride>) => void;
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
            customActivities: dedupeCustomActivities(
              parsed.customActivities as CustomActivityDefinition[]
            ),
            baseActivityOverrides: parsed.baseActivityOverrides ?? [],
            mood: parsed.mood ?? undefined,
            listDensity:
              parsed.listDensity === 'compact' || parsed.listDensity === 'comfortable'
                ? parsed.listDensity
                : 'compact', // Default to compact
            reduceAnimations: parsed.reduceAnimations ?? false,
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
      customActivities: dedupeCustomActivities(next.customActivities),
    };
    setSettings(normalized);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

      // Update local last modified date
      try {
        localStorage.setItem('sporttrack_last_sync', new Date().toISOString());
      } catch (error) {
        console.error('Failed to save local last modified:', error);
      }
    }
  }, []);

  const saveSettings = useCallback(
    (next: UserSettings) =>
      persist({
        ...next,
        customActivities:
          next.customActivities ?? dedupeCustomActivities(settings?.customActivities),
      }),
    [persist, settings]
  );

  const addCustomActivity = useCallback(
    (activity: CustomActivityDefinition) => {
      setSettings((prev) => {
        const base: UserSettings = prev ?? {
          name: '',
          dailyTarget: DEFAULT_DAILY_TARGET,
          customActivities: [],
        };
        const next: UserSettings = {
          ...base,
          customActivities: [
            activity,
            ...base.customActivities.filter((existing) => existing.id !== activity.id),
          ],
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
          ),
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
          customActivities: prev.customActivities.filter((activity) => activity.id !== id),
        };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const updateBaseActivity = useCallback(
    (key: ActivityKey, updates: Partial<BaseActivityOverride>) => {
      setSettings((prev) => {
        if (!prev) return prev;
        const overrides = prev.baseActivityOverrides ?? [];
        const existingIndex = overrides.findIndex((override) => override.key === key);

        // Remove 'key' from updates if present (it's already set)
        const { key: _, ...cleanUpdates } = updates as BaseActivityOverride;

        let newOverrides: BaseActivityOverride[];
        if (existingIndex >= 0) {
          // Update existing override
          newOverrides = overrides.map((override, index) =>
            index === existingIndex ? { ...override, ...cleanUpdates } : override
          );
        } else {
          // Add new override
          newOverrides = [...overrides, { key, ...cleanUpdates }];
        }

        const next: UserSettings = {
          ...prev,
          baseActivityOverrides: newOverrides,
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
      removeCustomActivity,
      updateBaseActivity,
    }),
    [
      settings,
      hydrated,
      saveSettings,
      addCustomActivity,
      updateCustomActivity,
      removeCustomActivity,
      updateBaseActivity,
    ]
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
    const overrides = settings?.baseActivityOverrides ?? [];
    const overrideMap = new Map<ActivityKey, BaseActivityOverride>();

    for (const override of overrides) {
      overrideMap.set(override.key, override);
    }

    const ordered = new Map<ActivityKey, ActivityDefinition>();

    // Apply base activities with overrides
    for (const definition of BASE_ACTIVITY_DEFINITIONS) {
      const override = overrideMap.get(definition.key);
      if (override) {
        // Merge base definition with override
        ordered.set(definition.key, {
          ...definition,
          ...override,
        });
      } else {
        ordered.set(definition.key, definition);
      }
    }

    // Add custom activities (these override base activities if same key)
    for (const activity of custom) {
      ordered.set(activity.id, {
        ...activity,
        key: activity.id,
        isCustom: true,
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
      isCustom: true,
    };
  }

  const base = BASE_ACTIVITY_MAP[key];
  if (!base) return undefined;

  // Apply base activity overrides if any
  const override = settings?.baseActivityOverrides?.find((o) => o.key === key);
  if (override) {
    return {
      ...base,
      ...override,
    };
  }

  return base;
}
