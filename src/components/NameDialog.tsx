'use client';

import { FormEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/lib/settingsStore';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useAuth } from '@/hooks/useAuth';

export function NameDialog() {
  const { settings, hydrated, saveSettings } = useSettings();
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;

    // If user logs in, immediately close and hide this dialog
    if (isAuthenticated) {
      setOpen(false);
      return; // Don't show for authenticated users
    }

    const onboardingCompleted =
      typeof window !== 'undefined' && localStorage.getItem('onboarding_completed') === 'true';
    const nameDialogShown =
      typeof window !== 'undefined' && localStorage.getItem('name_dialog_shown') === 'true';

    // Show dialog if onboarding is completed, user is not authenticated, and name is not set
    if (
      onboardingCompleted &&
      !nameDialogShown &&
      !isAuthenticated &&
      (!settings?.name || settings.name.trim() === '')
    ) {
      setTimeout(() => {
        setOpen(true);
      }, 500);
    } else {
      // If conditions are not met, ensure dialog is closed
      setOpen(false);
    }
  }, [hydrated, isAuthenticated, settings]);

  // Never render if authenticated or if hydrated and name exists
  if (!hydrated || isAuthenticated) {
    return null;
  }

  // Don't render if name is already set
  if (settings?.name && settings.name.trim() !== '') {
    return null;
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(lang === 'tr' ? 'Lütfen bir isim girin' : 'Please enter a name');
      return;
    }
    saveSettings({
      name: trimmedName,
      dailyTarget: settings?.dailyTarget ?? 10000,
      customActivities: settings?.customActivities ?? [],
      mood: settings?.mood,
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('name_dialog_shown', 'true');
    }
    setOpen(false);
    setError(null);
  }

  const dialog = open ? (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 px-4 py-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          // Don't allow closing by clicking outside - user must enter name
        }
      }}
    >
      <div className="relative w-full max-w-md rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 shadow-2xl hover:shadow-3xl transition-shadow duration-300 p-5 sm:p-6 my-auto">
        {/* Header */}
        <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
          <h2
            className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-950 dark:text-white flex items-center gap-2`}
          >
            <span>👋</span>
            {lang === 'tr' ? 'Bize Kendinizden Bahsedin' : 'Tell Us About You'}
          </h2>
          <p
            className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 dark:text-gray-400 mt-0.5`}
          >
            {lang === 'tr'
              ? 'Kişiselleştirilmiş bir deneyim için isminizi girin'
              : 'Enter your name for a personalized experience'}
          </p>
        </div>

        {/* Form */}
        <form className="space-y-3" onSubmit={submit} autoComplete="off">
          <label className="block space-y-1.5">
            <span
              className={`${isMobile ? 'text-[11px]' : 'text-xs'} font-semibold text-gray-700 dark:text-gray-300`}
            >
              {t('settings.nameLabel')}
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg ${isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2.5 text-base'} bg-white dark:bg-gray-800 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all`}
              placeholder={lang === 'tr' ? 'İsminiz' : 'Your name'}
              autoFocus
              autoComplete="off"
              data-form-type="other"
            />
          </label>

          {error ? (
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-500 font-medium`}>
              {error}
            </p>
          ) : null}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full px-4 py-2.5 ${isMobile ? 'text-sm' : 'text-base'} rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300`}
            >
              {t('settings.save') || 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <>{typeof window !== 'undefined' && dialog ? createPortal(dialog, document.body) : null}</>
  );
}
