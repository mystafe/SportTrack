'use client';

import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { useSettings, type Theme } from '@/lib/settingsStore';

export function ThemeToggle() {
  const { settings, saveSettings } = useSettings();
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    // Get theme from settings store, fallback to localStorage for backward compatibility
    const saved = settings?.theme || (localStorage.getItem(STORAGE_KEYS.THEME) as Theme | null);
    const themeToUse = saved || 'system';
    setTheme(themeToUse);
    applyTheme(themeToUse);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (themeToUse === 'system') {
        applyTheme('system');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }

    // Listen for theme changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.THEME || e.key === STORAGE_KEYS.SETTINGS) {
        const newTheme = (e.newValue as Theme) || 'system';
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [settings?.theme]);

  function applyTheme(next: Theme) {
    const root = document.documentElement;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = next === 'dark' || (next === 'system' && systemPrefersDark);
    root.classList.toggle('dark', isDark);
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }

  function update(next: Theme) {
    setTheme(next);
    applyTheme(next);

    // ALWAYS write to localStorage immediately for layout.tsx script
    localStorage.setItem(STORAGE_KEYS.THEME, next);

    // Trigger custom event for same-tab updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sporttrack:theme-changed'));
    }

    // ALWAYS save to settings store (even if settings is null, it will create default settings)
    // This ensures theme is saved to DB
    if (settings) {
      saveSettings({
        ...settings,
        theme: next,
      });
    } else {
      // If settings not loaded yet, create minimal settings with theme
      // This will be merged with full settings when they load
      try {
        const currentSettingsRaw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (currentSettingsRaw) {
          const currentSettings = JSON.parse(currentSettingsRaw);
          saveSettings({
            ...currentSettings,
            theme: next,
            name: currentSettings.name || '',
            dailyTarget: currentSettings.dailyTarget || 10000,
            customActivities: currentSettings.customActivities || [],
            baseActivityOverrides: currentSettings.baseActivityOverrides || [],
          });
        } else {
          // No settings exist yet, create minimal one with theme
          saveSettings({
            name: '',
            dailyTarget: 10000,
            customActivities: [],
            baseActivityOverrides: [],
            theme: next,
            language: 'tr',
          });
        }
      } catch (e) {
        // Settings parse failed, create minimal settings
        saveSettings({
          name: '',
          dailyTarget: 10000,
          customActivities: [],
          baseActivityOverrides: [],
          theme: next,
          language: 'tr',
        });
      }
    }
  }

  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg glass-effect card-3d border-2 border-white/20 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg p-0.5 flex-shrink-0">
      <Button
        type="button"
        variant={theme === 'light' ? 'primary' : 'ghost'}
        size="sm"
        className="px-0.5 py-0.5 text-[6px] sm:text-[7px] min-h-[16px] sm:min-h-[18px] hover:scale-110 active:scale-95"
        onClick={() => update('light')}
        aria-pressed={theme === 'light'}
        title="Light"
      >
        ☀️
      </Button>
      <Button
        type="button"
        variant={theme === 'system' ? 'primary' : 'ghost'}
        size="sm"
        className="px-0.5 py-0.5 text-[6px] sm:text-[7px] min-h-[16px] sm:min-h-[18px] hover:scale-110 active:scale-95"
        onClick={() => update('system')}
        aria-pressed={theme === 'system'}
        title="System"
      >
        🖥️
      </Button>
      <Button
        type="button"
        variant={theme === 'dark' ? 'primary' : 'ghost'}
        size="sm"
        className="px-0.5 py-0.5 text-[6px] sm:text-[7px] min-h-[16px] sm:min-h-[18px] hover:scale-110 active:scale-95"
        onClick={() => update('dark')}
        aria-pressed={theme === 'dark'}
        title="Dark"
      >
        🌙
      </Button>
    </div>
  );
}
