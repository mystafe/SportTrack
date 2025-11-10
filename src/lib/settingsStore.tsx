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

const STORAGE_KEY = 'sporttrack.settings.v1';

export type CustomActivityDefinition = {
  id: ActivityKey;
  label: string;
  icon: string;
  multiplier: number;
  unit: string;
  defaultAmount: number;
  description?: string;
};

export type UserSettings = {
  name: string;
  dailyTarget: number;
  customActivities: CustomActivityDefinition[];
};

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
            customActivities: Array.isArray(parsed.customActivities)
              ? parsed.customActivities
              : []
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
    setSettings(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }, []);

  const saveSettings = useCallback(
    (next: UserSettings) =>
      persist({
        ...next,
        customActivities: next.customActivities ?? settings?.customActivities ?? []
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
          customActivities: [activity, ...base.customActivities]
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
    const custom = settings?.customActivities ?? [];
    const customDefs: ActivityDefinition[] = custom.map((activity) => ({
      ...activity,
      key: activity.id,
      isCustom: true
    }));
    return [...BASE_ACTIVITY_DEFINITIONS, ...customDefs];
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

