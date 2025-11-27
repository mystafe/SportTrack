/**
 * Activity Reminders System
 * Allows users to set reminders for specific activities
 */

import { ActivityKey } from './activityConfig';
import { STORAGE_KEYS } from './constants';

export interface ActivityReminder {
  id: string;
  activityKey: ActivityKey;
  label: string;
  labelEn?: string;
  icon: string;
  enabled: boolean;
  time: string; // HH:mm format
  daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  message?: { tr: string; en: string };
  createdAt: string; // ISO string
}

export function getActivityReminders(): ActivityReminder[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITY_REMINDERS);
    if (!stored) return [];
    return JSON.parse(stored) as ActivityReminder[];
  } catch (error) {
    console.error('Failed to load activity reminders:', error);
    return [];
  }
}

export function saveActivityReminders(reminders: ActivityReminder[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_REMINDERS, JSON.stringify(reminders));
  } catch (error) {
    console.error('Failed to save activity reminders:', error);
  }
}

export function addActivityReminder(
  reminder: Omit<ActivityReminder, 'id' | 'createdAt'>
): ActivityReminder {
  const reminders = getActivityReminders();
  const newReminder: ActivityReminder = {
    ...reminder,
    id: `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  reminders.push(newReminder);
  saveActivityReminders(reminders);
  return newReminder;
}

export function updateActivityReminder(
  id: string,
  updates: Partial<Omit<ActivityReminder, 'id' | 'createdAt'>>
): ActivityReminder | null {
  const reminders = getActivityReminders();
  const index = reminders.findIndex((r) => r.id === id);
  if (index === -1) return null;

  reminders[index] = { ...reminders[index], ...updates };
  saveActivityReminders(reminders);
  return reminders[index];
}

export function deleteActivityReminder(id: string): boolean {
  const reminders = getActivityReminders();
  const filtered = reminders.filter((r) => r.id !== id);
  if (filtered.length === reminders.length) return false;

  saveActivityReminders(filtered);
  return true;
}

export function toggleActivityReminder(id: string): ActivityReminder | null {
  const reminders = getActivityReminders();
  const reminder = reminders.find((r) => r.id === id);
  if (!reminder) return null;

  reminder.enabled = !reminder.enabled;
  saveActivityReminders(reminders);
  return reminder;
}

/**
 * Check if a reminder should fire now
 */
export function shouldFireReminder(reminder: ActivityReminder): boolean {
  if (!reminder.enabled) return false;

  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
  const [hours, minutes] = reminder.time.split(':').map(Number);

  // Check if today is in the reminder's days
  if (!reminder.daysOfWeek.includes(currentDay)) return false;

  // Check if current time matches reminder time (within 1 minute)
  const reminderTime = new Date();
  reminderTime.setHours(hours, minutes, 0, 0);

  const timeDiff = Math.abs(now.getTime() - reminderTime.getTime());
  return timeDiff < 60000; // Within 1 minute
}

/**
 * Get reminders that should fire now
 */
export function getActiveReminders(): ActivityReminder[] {
  const reminders = getActivityReminders();
  return reminders.filter((reminder) => shouldFireReminder(reminder));
}
