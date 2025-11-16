'use client';

import { FormEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/lib/settingsStore';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useAuth } from '@/hooks/useAuth';
import { STORAGE_KEYS } from '@/lib/constants';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

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

    // Don't show if login popup is skipped (after logout)
    const skipLoginPopup =
      typeof window !== 'undefined' &&
      localStorage.getItem('sporttrack.skip_login_popup') === 'true';
    if (skipLoginPopup) {
      setOpen(false);
      return;
    }

    const onboardingCompleted =
      typeof window !== 'undefined' &&
      localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED) === 'true';
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
      className={`fixed inset-0 z-[10001] flex ${isMobile ? 'items-end' : 'items-center justify-center'} bg-black/50 ${isMobile ? '' : 'backdrop-blur-sm'} px-4 py-4 overflow-y-auto safe-top safe-bottom safe-left safe-right`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          // Don't allow closing by clicking outside - user must enter name
        }
      }}
    >
      <Card
        variant="default"
        size="md"
        className={`relative w-full ${isMobile ? 'max-w-full rounded-t-xl' : 'max-w-md rounded-xl'} ${isMobile ? '' : 'my-auto'} ${isMobile ? 'slide-up-bottom' : 'animate-scale-in'} max-h-[90vh] overflow-y-auto`}
        header={
          <>
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
          </>
        }
      >
        {/* Form */}
        <form className="space-y-3" onSubmit={submit} autoComplete="off">
          <Input
            type="text"
            label={t('settings.nameLabel')}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            placeholder={lang === 'tr' ? 'İsminiz' : 'Your name'}
            error={error || undefined}
            autoFocus
            autoComplete="off"
            data-form-type="other"
            size={isMobile ? 'sm' : 'md'}
          />

          {/* Action Button */}
          <div className="pt-2">
            <Button type="submit" variant="primary" size={isMobile ? 'sm' : 'md'} fullWidth>
              {t('settings.save') || 'Save'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  ) : null;

  return (
    <>{typeof window !== 'undefined' && dialog ? createPortal(dialog, document.body) : null}</>
  );
}
