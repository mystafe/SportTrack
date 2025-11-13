'use client';

import { FormEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';
import { useSettings, Mood } from '@/lib/settingsStore';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';
import { LIMITS } from '@/lib/constants';
import { DataExportImport } from '@/components/DataExportImport';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotificationSettings } from '@/components/NotificationSettings';
import { LevelDisplay } from '@/components/LevelDisplay';
import { AppleHealthImport } from '@/components/AppleHealthImport';
import { AppleHealthGuide } from '@/components/AppleHealthGuide';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export function SettingsDialog() {
  const { settings, hydrated, saveSettings } = useSettings();
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [showAppSettings, setShowAppSettings] = useState(false);
  const [name, setName] = useState<string>(settings?.name ?? '');
  const [dailyTarget, setDailyTarget] = useState<string>(
    String(settings?.dailyTarget ?? DEFAULT_DAILY_TARGET)
  );
  const [mood, setMood] = useState<Mood>(settings?.mood ?? null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (!settings || !settings.name || !settings.dailyTarget) {
      setOpen(true);
    }
  }, [hydrated, settings]);

  useEffect(() => {
    if (settings) {
      setName(settings.name);
      setDailyTarget(String(settings.dailyTarget));
      setMood(settings.mood ?? null);
    }
  }, [settings]);

  if (!hydrated) {
    return null;
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(t('settings.errors.nameRequired'));
      return;
    }
    const targetValue = Number(dailyTarget);
    if (!Number.isFinite(targetValue) || targetValue <= 0) {
      setError(t('settings.errors.targetPositive'));
      return;
    }
    if (targetValue < LIMITS.DAILY_TARGET_MIN || targetValue > LIMITS.DAILY_TARGET_MAX) {
      setError(t('settings.errors.targetRange'));
      return;
    }
    saveSettings({
      name: trimmedName,
      dailyTarget: Math.round(targetValue),
      customActivities: settings?.customActivities ?? [],
      mood: mood ?? undefined
    });
    setOpen(false);
    setError(null);
  }

  // Mobile: Show app settings dialog
  const appSettingsDialog = isMobile && showAppSettings ? (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 py-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowAppSettings(false);
        }
      }}
    >
      <div className="relative w-full max-w-md rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl p-4 sm:p-6 space-y-4 my-auto">
        <div>
          <h2 className="text-lg font-semibold">{t('settings.appSettings')}</h2>
          <p className="text-xs text-gray-500 mt-1">
            {t('settings.appSettingsSubtitle')}
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2">
              {t('data.export')} / {t('data.import')}
            </span>
            <DataExportImport />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2">
              {t('nav.main')}
            </span>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
          <div>
            <NotificationSettings />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2">
              {t('appleHealth.import')}
            </span>
            <div className="space-y-3">
              <AppleHealthImport />
              <AppleHealthGuide />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            className="px-3 py-2 text-xs rounded bg-brand text-white hover:bg-brand-dark shadow"
            onClick={() => setShowAppSettings(false)}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  ) : null;

  // Profile dialog
  const profileDialog = open ? (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 py-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && settings) {
          setOpen(false);
          setError(null);
          setName(settings.name);
          setDailyTarget(String(settings.dailyTarget));
        }
      }}
    >
      <div className="relative w-full max-w-md rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl p-4 sm:p-6 space-y-4 my-auto">
        <div>
          <h2 className="text-lg font-semibold">{t('settings.title')}</h2>
          <p className="text-xs text-gray-500 mt-1">
            {t('settings.subtitle')}
          </p>
        </div>
        <form className="space-y-4" onSubmit={submit}>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {t('settings.nameLabel')}
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900"
              placeholder={t('settings.namePlaceholder')}
              required
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {t('settings.goalLabel')}
            </span>
            <input
              type="number"
                    min={LIMITS.DAILY_TARGET_MIN}
                    max={LIMITS.DAILY_TARGET_MAX}
              step={100}
              value={dailyTarget}
              onChange={(e) => setDailyTarget(e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900"
              placeholder="10000"
              required
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {t('settings.moodLabel')}
            </span>
            <select
              value={mood || ''}
              onChange={(e) => setMood((e.target.value || null) as Mood)}
              className="w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900"
            >
              <option value="">{t('settings.moodNone')}</option>
              <option value="happy">{t('settings.moodHappy')}</option>
              <option value="cheerful">{t('settings.moodCheerful')}</option>
              <option value="sad">{t('settings.moodSad')}</option>
              <option value="unhappy">{t('settings.moodUnhappy')}</option>
              <option value="tired">{t('settings.moodTired')}</option>
            </select>
          </label>
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <LevelDisplay />
          </div>
          {error ? (
            <p className="text-xs text-red-500">{error}</p>
          ) : null}
          
          {/* Desktop: Export/Import, Language, Theme */}
          {!isMobile && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2">
                  {t('data.export')} / {t('data.import')}
                </span>
                <DataExportImport />
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2">
                  {t('nav.main')}
                </span>
                <div className="flex items-center gap-3">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-end gap-2 pt-2">
            {settings ? (
              <button
                type="button"
                className="px-3 py-2 text-xs rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  onClick={() => {
                    setOpen(false);
                    setError(null);
                    setName(settings.name);
                    setDailyTarget(String(settings.dailyTarget));
                  }}
              >
                {t('form.cancel')}
              </button>
            ) : null}
            <button
              type="submit"
              className="px-3 py-2 text-xs rounded bg-brand text-white hover:bg-brand-dark shadow"
            >
              {t('settings.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <>
      {isMobile ? (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="px-3 py-2 min-h-[44px] text-xs rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 active:scale-95 transition-all"
          >
            {settings?.name ? settings.name : t('settings.setProfile')}
          </button>
          <button
            type="button"
            onClick={() => setShowAppSettings(true)}
            className="px-3 py-2 min-h-[44px] min-w-[44px] text-base rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 active:scale-95 transition-all flex items-center justify-center"
            title={t('settings.appSettings')}
            aria-label={t('settings.appSettings')}
          >
            ⚙️
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          {settings?.name ? settings.name : t('settings.setProfile')}
        </button>
      )}
      {typeof window !== 'undefined' && profileDialog
        ? createPortal(profileDialog, document.body)
        : null}
      {typeof window !== 'undefined' && appSettingsDialog
        ? createPortal(appSettingsDialog, document.body)
        : null}
    </>
  );
}

