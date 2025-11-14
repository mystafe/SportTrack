'use client';

import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivitiesSummary } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { notificationService, DEFAULT_NOTIFICATION_SETTINGS } from '@/lib/notificationService';
import { STORAGE_KEYS } from '@/lib/constants';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';

export function NotificationManager() {
  const { lang } = useI18n();
  const { settings } = useSettings();
  const target =
    settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : DEFAULT_DAILY_TARGET;
  const summary = useActivitiesSummary(target);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load notification settings
    let notificationSettings = DEFAULT_NOTIFICATION_SETTINGS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) {
        notificationSettings = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    }

    // Start daily reminder check if enabled
    if (notificationSettings.enabled && notificationSettings.dailyReminder) {
      notificationService.startDailyReminderCheck(notificationSettings, lang as 'tr' | 'en', () => {
        notificationService.showDailyReminder(lang as 'tr' | 'en');
      });
    }

    // Check for streak reminder
    if (
      notificationSettings.enabled &&
      notificationSettings.streakReminder &&
      summary.streakDays > 0
    ) {
      const checkStreakReminder = () => {
        const now = new Date();
        const [hours, minutes] = notificationSettings.streakReminderTime.split(':').map(Number);
        const reminderTime = new Date();
        reminderTime.setHours(hours, minutes, 0, 0);

        const timeDiff = Math.abs(now.getTime() - reminderTime.getTime());
        if (timeDiff < 60000) {
          notificationService.showStreakReminder(lang as 'tr' | 'en', summary.streakDays);
        }
      };

      const streakInterval = setInterval(checkStreakReminder, 60000);
      checkStreakReminder(); // Check immediately

      return () => {
        clearInterval(streakInterval);
        notificationService.stopDailyReminderCheck();
      };
    }

    return () => {
      notificationService.stopDailyReminderCheck();
    };
  }, [lang, summary.streakDays]);

  return null;
}
