'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/lib/settingsStore';
import {
  notificationService,
  NotificationSettings as NotificationSettingsType,
  DEFAULT_NOTIFICATION_SETTINGS,
} from '@/lib/notificationService';
import { STORAGE_KEYS } from '@/lib/constants';
import { useToaster } from '@/components/Toaster';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export function NotificationSettings() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const { showToast } = useToaster();
  const isMobile = useIsMobile();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsType>(
    DEFAULT_NOTIFICATION_SETTINGS
  );
  const [permission, setPermission] = useState<'default' | 'granted' | 'denied'>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSupported('Notification' in window);
      setPermission(notificationService.getPermission());

      // Load saved settings
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
        if (saved) {
          setNotificationSettings(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Failed to load notification settings:', error);
      }
    }
  }, []);

  const saveSettings = (newSettings: NotificationSettingsType) => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(newSettings));
      setNotificationSettings(newSettings);

      // Start/stop reminder check based on settings
      if (newSettings.enabled && newSettings.dailyReminder) {
        notificationService.startDailyReminderCheck(newSettings, lang as 'tr' | 'en', () => {
          notificationService.showDailyReminder(lang as 'tr' | 'en');
        });
      } else {
        notificationService.stopDailyReminderCheck();
      }
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      showToast(t('notifications.saveFailed'), 'error');
    }
  };

  const handleRequestPermission = async () => {
    const newPermission = await notificationService.requestPermission();
    setPermission(newPermission);

    if (newPermission === 'granted') {
      showToast(t('notifications.permissionGranted'), 'success');
      saveSettings({ ...notificationSettings, enabled: true });
    } else {
      showToast(t('notifications.permissionDenied'), 'error');
    }
  };

  const updateSetting = <K extends keyof NotificationSettingsType>(
    key: K,
    value: NotificationSettingsType[K]
  ) => {
    const newSettings = { ...notificationSettings, [key]: value };
    saveSettings(newSettings);
  };

  if (!isSupported) {
    return (
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {t('notifications.notSupported')}
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'space-y-2' : 'space-y-2.5'}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div
            className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-gray-950 dark:text-white`}
          >
            {t('notifications.title')}
          </div>
          <div
            className={`${isMobile ? 'text-[9px]' : 'text-[10px] sm:text-xs'} font-medium text-gray-600 dark:text-gray-400 ${isMobile ? 'mt-0.5' : 'mt-1'}`}
          >
            {t('notifications.subtitle')}
          </div>
        </div>
        <button
          type="button"
          onClick={() => updateSetting('enabled', !notificationSettings.enabled)}
          className={`relative inline-flex ${isMobile ? 'h-5 w-9' : 'h-6 w-11'} items-center rounded-full transition-all duration-300 flex-shrink-0 ${
            notificationSettings.enabled
              ? 'bg-gradient-to-r from-brand to-brand-dark shadow-md'
              : 'bg-gray-300 dark:bg-gray-700'
          }`}
        >
          <span
            className={`inline-block ${isMobile ? 'h-3 w-3' : 'h-4 w-4'} transform rounded-full bg-white transition-transform ${
              notificationSettings.enabled
                ? isMobile
                  ? 'translate-x-5'
                  : 'translate-x-6'
                : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {permission !== 'granted' && (
        <button
          type="button"
          onClick={handleRequestPermission}
          className={`w-full ${isMobile ? 'px-2.5 py-1.5 text-[10px]' : 'px-3 py-2 text-xs sm:text-sm'} rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300`}
        >
          {t('notifications.requestPermission')}
        </button>
      )}

      {permission === 'granted' && notificationSettings.enabled && (
        <div
          className={`${isMobile ? 'space-y-2 pl-2 py-1.5' : 'space-y-2.5 pl-3 py-2'} border-l-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50/30 to-transparent dark:from-gray-800/30 dark:to-transparent rounded-r-lg`}
        >
          {/* Daily Reminder */}
          <div className={`${isMobile ? 'space-y-1.5' : 'space-y-2'}`}>
            <div className="flex items-center justify-between">
              <label
                className={`${isMobile ? 'text-[10px]' : 'text-xs sm:text-sm'} font-semibold text-gray-800 dark:text-gray-200`}
              >
                {t('notifications.dailyReminder')}
              </label>
              <button
                type="button"
                onClick={() => updateSetting('dailyReminder', !notificationSettings.dailyReminder)}
                className={`relative inline-flex ${isMobile ? 'h-4 w-7' : 'h-5 w-9'} items-center rounded-full transition-all duration-300 flex-shrink-0 ${
                  notificationSettings.dailyReminder
                    ? 'bg-gradient-to-r from-brand to-brand-dark shadow-md'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block ${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} transform rounded-full bg-white transition-transform ${
                    notificationSettings.dailyReminder
                      ? isMobile
                        ? 'translate-x-4'
                        : 'translate-x-5'
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {notificationSettings.dailyReminder && (
              <input
                type="time"
                value={notificationSettings.dailyReminderTime}
                onChange={(e) => updateSetting('dailyReminderTime', e.target.value)}
                className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg ${isMobile ? 'px-2 py-1 text-[10px]' : 'px-2 py-1 text-xs sm:text-sm'} bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced`}
              />
            )}
          </div>

          {/* Goal Completion */}
          <div className="flex items-center justify-between">
            <label
              className={`${isMobile ? 'text-[10px]' : 'text-xs sm:text-sm'} font-semibold text-gray-800 dark:text-gray-200`}
            >
              {t('notifications.goalCompletion')}
            </label>
            <button
              type="button"
              onClick={() => updateSetting('goalCompletion', !notificationSettings.goalCompletion)}
              className={`relative inline-flex ${isMobile ? 'h-4 w-7' : 'h-5 w-9'} items-center rounded-full transition-all duration-300 flex-shrink-0 ${
                notificationSettings.goalCompletion
                  ? 'bg-gradient-to-r from-brand to-brand-dark shadow-md'
                  : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block ${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} transform rounded-full bg-white transition-transform ${
                  notificationSettings.goalCompletion
                    ? isMobile
                      ? 'translate-x-4'
                      : 'translate-x-5'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Streak Reminder */}
          <div className={`${isMobile ? 'space-y-1.5' : 'space-y-2'}`}>
            <div className="flex items-center justify-between">
              <label
                className={`${isMobile ? 'text-[10px]' : 'text-xs sm:text-sm'} font-semibold text-gray-800 dark:text-gray-200`}
              >
                {t('notifications.streakReminder')}
              </label>
              <button
                type="button"
                onClick={() =>
                  updateSetting('streakReminder', !notificationSettings.streakReminder)
                }
                className={`relative inline-flex ${isMobile ? 'h-4 w-7' : 'h-5 w-9'} items-center rounded-full transition-all duration-300 flex-shrink-0 ${
                  notificationSettings.streakReminder
                    ? 'bg-gradient-to-r from-brand to-brand-dark shadow-md'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block ${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} transform rounded-full bg-white transition-transform ${
                    notificationSettings.streakReminder
                      ? isMobile
                        ? 'translate-x-4'
                        : 'translate-x-5'
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {notificationSettings.streakReminder && (
              <input
                type="time"
                value={notificationSettings.streakReminderTime}
                onChange={(e) => updateSetting('streakReminderTime', e.target.value)}
                className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg ${isMobile ? 'px-2 py-1 text-[10px]' : 'px-2 py-1 text-xs sm:text-sm'} bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced`}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
