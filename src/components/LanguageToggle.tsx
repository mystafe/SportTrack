'use client';

import { useI18n, Language } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { useSettings } from '@/lib/settingsStore';
import { STORAGE_KEYS } from '@/lib/constants';

export function LanguageToggle() {
  const { lang, setLang } = useI18n();
  const { settings, saveSettings } = useSettings();
  const options: Array<{ code: Language; label: string }> = [
    { code: 'tr', label: 'TR' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <div className="inline-flex items-center gap-0.5 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-card p-0.5">
      {options.map((opt) => (
        <Button
          key={opt.code}
          type="button"
          variant={lang === opt.code ? 'primary' : 'ghost'}
          size="sm"
          className="px-1 py-0.5 text-[7px] sm:text-[9px] min-h-[20px] sm:min-h-[22px] hover:scale-110 active:scale-95"
          onClick={() => {
            setLang(opt.code);
            // ALWAYS save to settings store (even if settings is null, it will create default settings)
            // This ensures language is saved to DB
            if (settings) {
              saveSettings({
                ...settings,
                language: opt.code,
              });
            } else {
              // If settings not loaded yet, create minimal settings with language
              // This will be merged with full settings when they load
              try {
                const currentSettingsRaw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
                if (currentSettingsRaw) {
                  const currentSettings = JSON.parse(currentSettingsRaw);
                  saveSettings({
                    ...currentSettings,
                    language: opt.code,
                    name: currentSettings.name || '',
                    dailyTarget: currentSettings.dailyTarget || 10000,
                    customActivities: currentSettings.customActivities || [],
                    baseActivityOverrides: currentSettings.baseActivityOverrides || [],
                  });
                } else {
                  // No settings exist yet, create minimal one with language
                  saveSettings({
                    name: '',
                    dailyTarget: 10000,
                    customActivities: [],
                    baseActivityOverrides: [],
                    theme: 'system',
                    language: opt.code,
                  });
                }
              } catch (e) {
                // Settings parse failed, create minimal settings
                saveSettings({
                  name: '',
                  dailyTarget: 10000,
                  customActivities: [],
                  baseActivityOverrides: [],
                  theme: 'system',
                  language: opt.code,
                });
              }
            }
          }}
          aria-pressed={lang === opt.code}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
