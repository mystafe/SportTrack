/**
 * Hook to check if Apple Health import reminder should be shown
 * Shows reminder if last import was more than 7 days ago
 */

'use client';

import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';

const REMINDER_INTERVAL_DAYS = 7; // Show reminder every 7 days
const REMINDER_DISMISSED_KEY = 'sporttrack.appleHealth.reminderDismissed';

export function useAppleHealthReminder() {
  const [shouldShowReminder, setShouldShowReminder] = useState(false);
  const [daysSinceLastImport, setDaysSinceLastImport] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if reminder was dismissed
    const dismissedUntil = localStorage.getItem(REMINDER_DISMISSED_KEY);
    if (dismissedUntil) {
      const dismissedTimestamp = parseInt(dismissedUntil, 10);
      if (Date.now() < dismissedTimestamp) {
        // Reminder is still dismissed
        setShouldShowReminder(false);
        return;
      } else {
        // Dismissal period expired, clear it
        localStorage.removeItem(REMINDER_DISMISSED_KEY);
      }
    }

    // Check last import date
    const lastImportStr = localStorage.getItem(STORAGE_KEYS.APPLE_HEALTH_LAST_IMPORT);
    if (!lastImportStr) {
      // Never imported, show reminder
      setShouldShowReminder(true);
      setDaysSinceLastImport(null);
      return;
    }

    const lastImportTimestamp = parseInt(lastImportStr, 10);
    const now = Date.now();
    const daysSince = Math.floor((now - lastImportTimestamp) / (1000 * 60 * 60 * 24));

    setDaysSinceLastImport(daysSince);

    if (daysSince >= REMINDER_INTERVAL_DAYS) {
      setShouldShowReminder(true);
    } else {
      setShouldShowReminder(false);
    }
  }, []);

  const dismissReminder = (days: number = 7) => {
    if (typeof window === 'undefined') return;
    // Dismiss for specified number of days
    const dismissUntil = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem(REMINDER_DISMISSED_KEY, dismissUntil.toString());
    setShouldShowReminder(false);
  };

  return {
    shouldShowReminder,
    daysSinceLastImport,
    dismissReminder,
  };
}
