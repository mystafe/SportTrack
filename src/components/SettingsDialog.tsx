'use client';

import { FormEvent, useEffect, useState, useRef } from 'react';
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
import { CloudSyncSettings } from '@/components/CloudSyncSettings';
import { useKeyboardShortcuts } from '@/components/KeyboardShortcuts';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useAuth } from '@/hooks/useAuth';
import { AuthDialog } from '@/components/AuthDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToaster } from '@/components/Toaster';

interface SettingsDialogProps {
  triggerButton?: React.ReactNode;
}

export function SettingsDialog({ triggerButton }: SettingsDialogProps = {}) {
  const { settings, hydrated, saveSettings } = useSettings();
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const keyboardShortcuts = useKeyboardShortcuts();
  const { isAuthenticated, isConfigured, user, logout } = useAuth();
  const { showToast } = useToaster();
  const [open, setOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);
  const [name, setName] = useState<string>(settings?.name ?? '');
  const [dailyTarget, setDailyTarget] = useState<string>(
    String(settings?.dailyTarget ?? DEFAULT_DAILY_TARGET)
  );
  const [mood, setMood] = useState<Mood>(settings?.mood ?? null);
  const [error, setError] = useState<string | null>(null);
  const hasSyncedNameRef = useRef(false);

  useEffect(() => {
    if (settings) {
      setName(settings.name || '');
      setDailyTarget(String(settings.dailyTarget));
      setMood(settings.mood ?? null);
    }
  }, [settings]);

  // Update name when user logs in - sync Firebase displayName to settings (only once)
  useEffect(() => {
    if (isAuthenticated && user?.displayName && !hasSyncedNameRef.current) {
      // If Firebase has displayName and settings doesn't have it or is different, sync it
      if (!settings?.name || settings.name !== user.displayName) {
        hasSyncedNameRef.current = true;
        saveSettings({
          name: user.displayName,
          dailyTarget: settings?.dailyTarget ?? DEFAULT_DAILY_TARGET,
          customActivities: settings?.customActivities ?? [],
          mood: settings?.mood,
        });
      }
    }
    // Reset ref and clear name when user logs out
    if (!isAuthenticated) {
      hasSyncedNameRef.current = false;
      // Clear name from settings when user logs out
      if (settings?.name && settings.name.trim() !== '') {
        saveSettings({
          name: '',
          dailyTarget: settings.dailyTarget,
          customActivities: settings.customActivities,
          mood: settings.mood,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.displayName]);

  if (!hydrated) {
    return null;
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName && !isAuthenticated) {
      setError(lang === 'tr' ? 'Lütfen bir isim girin' : 'Please enter a name');
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
      name: trimmedName || (isAuthenticated && user?.displayName ? user.displayName : ''),
      dailyTarget: Math.round(targetValue),
      customActivities: settings?.customActivities ?? [],
      mood: mood ?? undefined,
    });
    setOpen(false);
    setError(null);
  }

  const handleLoginClick = () => {
    setOpen(false); // Close settings dialog first
    setError(null);
    // Wait for settings dialog to fully close before opening auth dialog
    // Increased timeout to ensure Settings Dialog backdrop is removed
    setTimeout(() => {
      setShowAuthDialog(true); // Then open auth dialog
    }, 300);
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Clear name from settings when user logs out
      saveSettings({
        name: '',
        dailyTarget: settings?.dailyTarget ?? 10000,
        customActivities: settings?.customActivities ?? [],
        mood: settings?.mood,
      });
      // Clear all localStorage cache
      if (typeof window !== 'undefined') {
        // Clear all SportTrack related localStorage items
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('sporttrack.') || key === 'theme' || key === 'lang') {
            localStorage.removeItem(key);
          }
        });
      }
      showToast(
        lang === 'tr' ? 'Çıkış yapıldı ve önbellek temizlendi' : 'Logged out and cache cleared',
        'success'
      );
    } catch (error) {
      showToast(lang === 'tr' ? 'Çıkış hatası' : 'Logout error', 'error');
    }
  };

  const handleClearData = () => {
    setShowClearDataDialog(true);
  };

  const confirmClearData = () => {
    try {
      // Clear all localStorage data
      if (typeof window !== 'undefined') {
        Object.keys(localStorage).forEach((key) => {
          if (
            key.startsWith('sporttrack.') ||
            key === 'theme' ||
            key === 'lang' ||
            key === 'onboarding_completed' ||
            key === 'name_dialog_shown'
          ) {
            localStorage.removeItem(key);
          }
        });
      }
      setShowClearDataDialog(false);
      setOpen(false);
      showToast(
        lang === 'tr'
          ? 'Tüm veriler temizlendi. Sayfa yenileniyor...'
          : 'All data cleared. Refreshing page...',
        'success'
      );
      // Reload page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      showToast(lang === 'tr' ? 'Veri temizleme hatası' : 'Error clearing data', 'error');
    }
  };

  // Settings dialog - Different content for authenticated vs non-authenticated users
  const settingsDialog =
    open && !showAuthDialog ? (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-4 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget && settings) {
            setOpen(false);
            setError(null);
            setName(settings.name || '');
            setDailyTarget(String(settings.dailyTarget));
          }
        }}
      >
        <div
          className={`relative w-full ${isMobile ? 'max-w-full' : 'max-w-lg'} rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 shadow-2xl hover:shadow-3xl transition-shadow duration-300 ${isMobile ? 'p-2.5' : 'p-4 sm:p-5'} my-auto max-h-[90vh] overflow-y-auto`}
        >
          {/* Header */}
          <div
            className={`${isMobile ? 'mb-2.5 pb-2' : 'mb-3 pb-2.5'} border-b border-gray-200 dark:border-gray-700`}
          >
            <h2
              className={`${isMobile ? 'text-xs' : 'text-sm sm:text-base'} font-bold text-gray-950 dark:text-white flex items-center gap-1.5`}
            >
              <span className={isMobile ? 'text-sm' : 'text-base'}>⚙️</span>
              {isAuthenticated ? (lang === 'tr' ? 'Ayarlar' : 'Settings') : t('settings.title')}
            </h2>
            {!isMobile && (
              <p
                className={`text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mt-0.5`}
              >
                {isAuthenticated
                  ? lang === 'tr'
                    ? 'Hesap ayarlarınızı ve uygulama tercihlerinizi yönetin.'
                    : 'Manage your account settings and app preferences.'
                  : t('settings.subtitle')}
              </p>
            )}
          </div>

          {/* Form */}
          <form
            className={isMobile ? 'space-y-1.5' : 'space-y-2.5'}
            onSubmit={submit}
            autoComplete="off"
          >
            {!isAuthenticated ? (
              <>
                {/* Non-authenticated users: Login options + Name + Daily Goal + Emotion */}

                {/* Login Section */}
                {isConfigured && (
                  <div
                    className={`${isMobile ? 'mb-3 pb-3' : 'mb-4 pb-4'} border-b border-gray-200 dark:border-gray-700`}
                  >
                    <button
                      type="button"
                      onClick={handleLoginClick}
                      className={`w-full ${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-sm sm:text-base'} rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300`}
                    >
                      {t('nav.login') || 'Login'} / {t('auth.signUp') || 'Sign Up'}
                    </button>
                  </div>
                )}

                {/* Name Field */}
                <label className={`block ${isMobile ? 'space-y-1' : 'space-y-1.5'}`}>
                  <span
                    className={`${isMobile ? 'text-[10px]' : 'text-[11px] sm:text-xs'} font-semibold text-gray-700 dark:text-gray-300`}
                  >
                    {t('settings.nameLabel')}
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg ${isMobile ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm sm:px-4 sm:py-2.5 sm:text-base'} bg-white dark:bg-gray-800 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all`}
                    placeholder={lang === 'tr' ? 'İsminiz' : 'Your name'}
                    autoComplete="off"
                    data-form-type="other"
                  />
                </label>

                {/* Daily Goal and Emotion/Feeling - Same Row */}
                <div
                  className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} ${isMobile ? 'gap-1.5' : 'gap-2'}`}
                >
                  <label className={`block ${isMobile ? 'space-y-0.5' : 'space-y-1'}`}>
                    <span
                      className={`${isMobile ? 'text-[9px]' : 'text-[10px] sm:text-xs'} font-semibold text-gray-700 dark:text-gray-300`}
                    >
                      {t('settings.goalLabel')}
                    </span>
                    <input
                      type="number"
                      min={LIMITS.DAILY_TARGET_MIN}
                      max={LIMITS.DAILY_TARGET_MAX}
                      step={100}
                      value={dailyTarget}
                      onChange={(e) => setDailyTarget(e.target.value)}
                      className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg ${isMobile ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm'} bg-white dark:bg-gray-800 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all`}
                      placeholder="10000"
                      autoComplete="off"
                      data-form-type="other"
                    />
                  </label>

                  <label className={`block ${isMobile ? 'space-y-0.5' : 'space-y-1'}`}>
                    <span
                      className={`${isMobile ? 'text-[9px]' : 'text-[10px] sm:text-xs'} font-semibold text-gray-700 dark:text-gray-300`}
                    >
                      {t('settings.moodLabel')}
                    </span>
                    <select
                      value={mood || ''}
                      onChange={(e) => setMood((e.target.value || null) as Mood)}
                      className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg ${isMobile ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm'} bg-white dark:bg-gray-800 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all`}
                      autoComplete="off"
                      data-form-type="other"
                    >
                      <option value="">{t('settings.moodNone')}</option>
                      <option value="happy">{t('settings.moodHappy')}</option>
                      <option value="cheerful">{t('settings.moodCheerful')}</option>
                      <option value="sad">{t('settings.moodSad')}</option>
                      <option value="unhappy">{t('settings.moodUnhappy')}</option>
                      <option value="tired">{t('settings.moodTired')}</option>
                    </select>
                  </label>
                </div>

                {/* Export/Import */}
                <div
                  className={`${isMobile ? 'pt-1.5' : 'pt-2'} border-t border-gray-200 dark:border-gray-700`}
                >
                  <span
                    className={`${isMobile ? 'text-[9px]' : 'text-[10px] sm:text-xs'} font-medium text-gray-600 dark:text-gray-300 block ${isMobile ? 'mb-1.5' : 'mb-2'}`}
                  >
                    {t('data.export')} / {t('data.import')}
                  </span>
                  <DataExportImport />
                </div>

                {/* Language & Theme */}
                <div
                  className={`${isMobile ? 'pt-1.5' : 'pt-2'} border-t border-gray-200 dark:border-gray-700`}
                >
                  <span
                    className={`${isMobile ? 'text-[9px]' : 'text-[10px] sm:text-xs'} font-medium text-gray-600 dark:text-gray-300 block ${isMobile ? 'mb-1.5' : 'mb-2'}`}
                  >
                    {t('nav.main')}
                  </span>
                  <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'}`}>
                    <LanguageToggle />
                    <ThemeToggle />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Authenticated users: Full settings (no name field, but show user info) */}

                {/* User Info Display */}
                {(user?.displayName || settings?.name) && (
                  <div
                    className={`${isMobile ? 'mb-2 pb-1.5' : 'mb-2.5 pb-2'} border-b border-gray-200 dark:border-gray-700`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={isMobile ? 'text-sm' : 'text-base'}>👤</span>
                      <span
                        className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-900 dark:text-white truncate`}
                      >
                        {user?.displayName || settings?.name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Daily Goal and Emotion/Feeling - Same Row */}
                <div
                  className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} ${isMobile ? 'gap-1.5' : 'gap-2'}`}
                >
                  <label className={`block ${isMobile ? 'space-y-0.5' : 'space-y-1'}`}>
                    <span
                      className={`${isMobile ? 'text-[9px]' : 'text-[10px] sm:text-xs'} font-semibold text-gray-700 dark:text-gray-300`}
                    >
                      {t('settings.goalLabel')}
                    </span>
                    <input
                      type="number"
                      min={LIMITS.DAILY_TARGET_MIN}
                      max={LIMITS.DAILY_TARGET_MAX}
                      step={100}
                      value={dailyTarget}
                      onChange={(e) => setDailyTarget(e.target.value)}
                      className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg ${isMobile ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm'} bg-white dark:bg-gray-800 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all`}
                      placeholder="10000"
                      autoComplete="off"
                      data-form-type="other"
                    />
                  </label>

                  <label className={`block ${isMobile ? 'space-y-0.5' : 'space-y-1'}`}>
                    <span
                      className={`${isMobile ? 'text-[9px]' : 'text-[10px] sm:text-xs'} font-semibold text-gray-700 dark:text-gray-300`}
                    >
                      {t('settings.moodLabel')}
                    </span>
                    <select
                      value={mood || ''}
                      onChange={(e) => setMood((e.target.value || null) as Mood)}
                      className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg ${isMobile ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm'} bg-white dark:bg-gray-800 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all`}
                      autoComplete="off"
                      data-form-type="other"
                    >
                      <option value="">{t('settings.moodNone')}</option>
                      <option value="happy">{t('settings.moodHappy')}</option>
                      <option value="cheerful">{t('settings.moodCheerful')}</option>
                      <option value="sad">{t('settings.moodSad')}</option>
                      <option value="unhappy">{t('settings.moodUnhappy')}</option>
                      <option value="tired">{t('settings.moodTired')}</option>
                    </select>
                  </label>
                </div>

                {/* Level Display */}
                <div
                  className={`${isMobile ? 'pt-1.5' : 'pt-2'} border-t border-gray-200 dark:border-gray-700`}
                >
                  <LevelDisplay />
                </div>

                {/* App Settings Section */}
                <div
                  className={`${isMobile ? 'pt-2 space-y-1.5' : 'pt-2.5 space-y-2.5'} border-t border-gray-200 dark:border-gray-700`}
                >
                  <div>
                    <span
                      className={`${isMobile ? 'text-[9px]' : 'text-[10px] sm:text-xs'} font-medium text-gray-600 dark:text-gray-300 block ${isMobile ? 'mb-1.5' : 'mb-2'}`}
                    >
                      {t('data.export')} / {t('data.import')}
                    </span>
                    <DataExportImport />
                  </div>

                  <div>
                    <span
                      className={`${isMobile ? 'text-[9px]' : 'text-[10px] sm:text-xs'} font-medium text-gray-600 dark:text-gray-300 block ${isMobile ? 'mb-1.5' : 'mb-2'}`}
                    >
                      {t('nav.main')}
                    </span>
                    <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'}`}>
                      <LanguageToggle />
                      <ThemeToggle />
                    </div>
                  </div>

                  <div>
                    <NotificationSettings />
                  </div>

                  <div>
                    <CloudSyncSettings />
                  </div>

                  {keyboardShortcuts && (
                    <div>
                      <span
                        className={`${isMobile ? 'text-[9px]' : 'text-[10px] sm:text-xs'} font-medium text-gray-600 dark:text-gray-300 block ${isMobile ? 'mb-1.5' : 'mb-2'}`}
                      >
                        {t('settings.keyboardShortcuts')}
                      </span>
                      {!isMobile && (
                        <p className={`text-xs text-gray-500 dark:text-gray-400 mb-2`}>
                          {t('settings.keyboardShortcutsHint')}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => keyboardShortcuts.showHelp()}
                        className={`w-full px-2 py-1 text-[10px] sm:text-xs rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 font-semibold`}
                      >
                        {t('settings.keyboardShortcuts')}
                      </button>
                    </div>
                  )}

                  {/* Sign Out, Clear All Data, Show Onboarding Tour - Same Row */}
                  {isAuthenticated && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className={`flex-1 px-2 py-1 text-[10px] sm:text-xs rounded-lg border-2 border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50 to-white dark:from-red-900/20 dark:to-red-900/10 hover:from-red-100 hover:to-red-50 dark:hover:from-red-800/30 transition-all duration-200 text-red-700 dark:text-red-400 font-semibold`}
                      >
                        {lang === 'tr' ? 'Çıkış Yap' : 'Sign Out'}
                      </button>
                      <button
                        type="button"
                        onClick={handleClearData}
                        className={`flex-1 px-2 py-1 text-[10px] sm:text-xs rounded-lg border-2 border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50 to-white dark:from-red-900/20 dark:to-red-900/10 hover:from-red-100 hover:to-red-50 dark:hover:from-red-800/30 transition-all duration-200 text-red-700 dark:text-red-400 font-semibold`}
                      >
                        🗑️ {t('settings.clearData')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof window !== 'undefined' && window.resetOnboarding) {
                            window.resetOnboarding();
                          }
                        }}
                        className={`px-2 py-1 text-[10px] sm:text-xs rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 text-gray-700 dark:text-gray-300 font-semibold flex-shrink-0`}
                        title={t('settings.showOnboarding') || 'Show Onboarding Tour'}
                      >
                        🎓
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {error ? (
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-500 font-medium`}>
                {error}
              </p>
            ) : null}

            {/* Action Buttons */}
            <div className={`${isMobile ? 'pt-2' : 'pt-3'} flex ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
              <button
                type="submit"
                className={`flex-1 ${isMobile ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-1.5 text-sm'} rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300`}
              >
                {t('settings.save') || 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setError(null);
                  if (settings) {
                    setName(settings.name || '');
                    setDailyTarget(String(settings.dailyTarget));
                  }
                }}
                className={`${isMobile ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-1.5 text-sm'} rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 font-semibold`}
              >
                {t('form.cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>
    ) : null;

  // For authenticated users: prioritize Firebase displayName
  // For non-authenticated users: use settings name or emoji
  const displayName =
    isAuthenticated && user?.displayName
      ? user.displayName
      : settings?.name && settings.name.trim() !== ''
        ? settings.name
        : '👤';

  return (
    <>
      {triggerButton ? (
        <div onClick={() => setOpen(true)} className="cursor-pointer">
          {triggerButton}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`${
            isMobile
              ? 'px-2.5 py-2 min-h-[36px] min-w-[44px] text-xs rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 active:scale-95 transition-all flex items-center justify-center flex-shrink-0 gap-1.5 overflow-hidden max-w-[140px] sm:max-w-none'
              : 'px-3 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center gap-2 max-w-[200px]'
          } truncate`}
          title={displayName}
          aria-label={displayName}
          data-tour-id="profile"
        >
          <span className={`${isMobile ? 'text-[10px] sm:text-xs' : 'text-xs'} truncate`}>
            {isMobile && typeof displayName === 'string' && displayName.length > 7
              ? displayName.substring(0, 7) + '...'
              : displayName}
          </span>
          <span className={`${isMobile ? 'text-xs' : 'text-xs'} flex-shrink-0`}>⚙️</span>
        </button>
      )}
      {typeof window !== 'undefined' && settingsDialog
        ? createPortal(settingsDialog, document.body)
        : null}
      {showAuthDialog && (
        <AuthDialog
          open={showAuthDialog}
          onClose={() => {
            setShowAuthDialog(false);
          }}
        />
      )}
      <ConfirmDialog
        open={showClearDataDialog}
        title={lang === 'tr' ? 'Tüm Verileri Temizle' : 'Clear All Data'}
        message={
          lang === 'tr'
            ? 'Bu işlem tüm aktivitelerinizi, rozetlerinizi, meydan okumalarınızı ve ayarlarınızı kalıcı olarak silecektir. Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?'
            : 'This will permanently delete all your activities, badges, challenges, and settings. This action cannot be undone. Are you sure you want to continue?'
        }
        confirmLabel={lang === 'tr' ? 'Evet, Temizle' : 'Yes, Clear'}
        cancelLabel={lang === 'tr' ? 'İptal' : 'Cancel'}
        onConfirm={confirmClearData}
        onCancel={() => setShowClearDataDialog(false)}
        variant="danger"
      />
    </>
  );
}
