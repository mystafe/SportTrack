'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/lib/settingsStore';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';

export function SettingsDialog() {
  const { settings, hydrated, saveSettings } = useSettings();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string>(settings?.name ?? '');
  const [dailyTarget, setDailyTarget] = useState<number>(
    settings?.dailyTarget ?? DEFAULT_DAILY_TARGET
  );
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
      setDailyTarget(settings.dailyTarget);
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
    if (!Number.isFinite(dailyTarget) || dailyTarget <= 0) {
      setError(t('settings.errors.targetPositive'));
      return;
    }
    saveSettings({
      name: trimmedName,
      dailyTarget: Math.round(dailyTarget),
      customActivities: settings?.customActivities ?? []
    });
    setOpen(false);
    setError(null);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
      >
        {settings?.name ? settings.name : t('settings.setProfile')}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl p-6 space-y-4">
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
                  min={100}
                  step={100}
                  value={dailyTarget}
                  onChange={(e) => setDailyTarget(Number(e.target.value))}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900"
                  placeholder="10000"
                  required
                />
              </label>
              {error ? (
                <p className="text-xs text-red-500">{error}</p>
              ) : null}
              <div className="flex items-center justify-end gap-2 pt-2">
                {settings ? (
                  <button
                    type="button"
                    className="px-3 py-2 text-xs rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                    onClick={() => {
                      setOpen(false);
                      setError(null);
                      setName(settings.name);
                      setDailyTarget(settings.dailyTarget);
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
      ) : null}
    </>
  );
}

