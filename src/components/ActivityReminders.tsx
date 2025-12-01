'use client';

import { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivityDefinitions } from '@/lib/settingsStore';
import {
  getActivityReminders,
  addActivityReminder,
  updateActivityReminder,
  deleteActivityReminder,
  toggleActivityReminder,
  type ActivityReminder,
} from '@/lib/activityReminders';
import { ActivityKey } from '@/lib/activityConfig';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToaster } from '@/components/Toaster';
import { notificationService } from '@/lib/notificationService';

const DAYS_OF_WEEK = [
  { value: 0, tr: 'Pazar', en: 'Sunday', short: { tr: 'Pz', en: 'Su' } },
  { value: 1, tr: 'Pazartesi', en: 'Monday', short: { tr: 'Pt', en: 'Mo' } },
  { value: 2, tr: 'Salı', en: 'Tuesday', short: { tr: 'Sa', en: 'Tu' } },
  { value: 3, tr: 'Çarşamba', en: 'Wednesday', short: { tr: 'Ça', en: 'We' } },
  { value: 4, tr: 'Perşembe', en: 'Thursday', short: { tr: 'Pe', en: 'Th' } },
  { value: 5, tr: 'Cuma', en: 'Friday', short: { tr: 'Cu', en: 'Fr' } },
  { value: 6, tr: 'Cumartesi', en: 'Saturday', short: { tr: 'Ct', en: 'Sa' } },
];

export function ActivityReminders() {
  const { t, lang } = useI18n();
  const { showToast } = useToaster();
  const isMobile = useIsMobile();
  const activityDefinitions = useActivityDefinitions();
  const [reminders, setReminders] = useState<ActivityReminder[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityKey | ''>('');
  const [reminderTime, setReminderTime] = useState('18:00');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Weekdays by default

  useEffect(() => {
    setReminders(getActivityReminders());
  }, []);

  const handleAddReminder = async () => {
    if (!selectedActivity) {
      showToast(lang === 'tr' ? 'Lütfen bir aktivite seçin' : 'Please select an activity', 'error');
      return;
    }

    const activity = activityDefinitions.find((a) => a.key === selectedActivity);
    if (!activity) return;

    // Check notification permission
    const permission = await notificationService.requestPermission();
    if (permission !== 'granted') {
      showToast(
        lang === 'tr'
          ? 'Bildirim izni gerekli. Lütfen tarayıcı ayarlarından izin verin.'
          : 'Notification permission required. Please grant permission in browser settings.',
        'error'
      );
      return;
    }

    const newReminder = addActivityReminder({
      activityKey: selectedActivity,
      label: activity.label,
      labelEn: activity.labelEn,
      icon: activity.icon,
      enabled: true,
      time: reminderTime,
      daysOfWeek: selectedDays,
      message: {
        tr: `${activity.label} yapma zamanı! 💪`,
        en: `Time for ${activity.labelEn || activity.label}! 💪`,
      },
    });

    setReminders(getActivityReminders());
    setShowAddForm(false);
    setSelectedActivity('');
    setReminderTime('18:00');
    setSelectedDays([1, 2, 3, 4, 5]);

    showToast(lang === 'tr' ? 'Hatırlatıcı eklendi' : 'Reminder added', 'success');
  };

  const handleToggleReminder = (id: string) => {
    toggleActivityReminder(id);
    setReminders(getActivityReminders());
  };

  const handleDeleteReminder = (id: string) => {
    if (
      confirm(
        lang === 'tr'
          ? 'Hatırlatıcıyı silmek istediğinize emin misiniz?'
          : 'Are you sure you want to delete this reminder?'
      )
    ) {
      deleteActivityReminder(id);
      setReminders(getActivityReminders());
      showToast(lang === 'tr' ? 'Hatırlatıcı silindi' : 'Reminder deleted', 'success');
    }
  };

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Check reminders every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const activeReminders = reminders.filter((r) => {
        if (!r.enabled) return false;
        const now = new Date();
        const currentDay = now.getDay();
        const [hours, minutes] = r.time.split(':').map(Number);
        const reminderTime = new Date();
        reminderTime.setHours(hours, minutes, 0, 0);
        const timeDiff = Math.abs(now.getTime() - reminderTime.getTime());
        return r.daysOfWeek.includes(currentDay) && timeDiff < 60000;
      });

      activeReminders.forEach((reminder) => {
        const message = reminder.message?.[lang] || `${reminder.label} yapma zamanı! 💪`;
        notificationService.showNotification(message, {
          icon: '/icon-192.png',
          tag: `activity-reminder-${reminder.id}`,
          body:
            lang === 'tr'
              ? 'Aktivitenizi eklemeyi unutmayın!'
              : "Don't forget to add your activity!",
        });
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [reminders, lang]);

  return (
    <Card
      variant="default"
      size="md"
      hoverable
      className="card-entrance"
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⏰</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Aktivite Hatırlatıcıları' : 'Activity Reminders'}
            </h2>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? '✕' : '+'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Add Form */}
        {showAddForm && (
          <div className="p-4 rounded-lg glass-effect bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-white/20 dark:border-gray-700/50 hover:scale-[1.01] transition-all duration-300">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {lang === 'tr' ? 'Aktivite' : 'Activity'}
                </label>
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value as ActivityKey)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-950 dark:text-white"
                >
                  <option value="">{lang === 'tr' ? 'Seçin...' : 'Select...'}</option>
                  {activityDefinitions.map((activity) => (
                    <option key={activity.key} value={activity.key}>
                      {activity.icon}{' '}
                      {lang === 'tr' ? activity.label : activity.labelEn || activity.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {lang === 'tr' ? 'Saat' : 'Time'}
                </label>
                <Input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {lang === 'tr' ? 'Günler' : 'Days'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                        selectedDays.includes(day.value)
                          ? 'bg-brand text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {day.short[lang]}
                    </button>
                  ))}
                </div>
              </div>

              <Button variant="primary" size="sm" onClick={handleAddReminder} className="w-full">
                {lang === 'tr' ? 'Hatırlatıcı Ekle' : 'Add Reminder'}
              </Button>
            </div>
          </div>
        )}

        {/* Reminders List */}
        {reminders.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">⏰</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lang === 'tr'
                ? 'Henüz hatırlatıcı yok. Yeni bir hatırlatıcı ekleyin!'
                : 'No reminders yet. Add a new reminder!'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-3 rounded-lg glass-effect bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-white/20 dark:border-gray-700/50 hover:scale-[1.02] hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0">{reminder.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-950 dark:text-white">
                      {lang === 'tr' ? reminder.label : reminder.labelEn || reminder.label}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {reminder.time}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">•</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {reminder.daysOfWeek
                          .sort()
                          .map((d) => DAYS_OF_WEEK.find((day) => day.value === d)?.short[lang])
                          .join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleReminder(reminder.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      reminder.enabled
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {reminder.enabled
                      ? lang === 'tr'
                        ? 'Aktif'
                        : 'On'
                      : lang === 'tr'
                        ? 'Kapalı'
                        : 'Off'}
                  </button>
                  <button
                    onClick={() => handleDeleteReminder(reminder.id)}
                    className="px-2 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
