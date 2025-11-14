'use client';

import { format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';

export type NotificationPermission = 'default' | 'granted' | 'denied';

export interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  dailyReminderTime: string; // HH:mm format
  goalCompletion: boolean;
  streakReminder: boolean;
  streakReminderTime: string; // HH:mm format
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  dailyReminder: true,
  dailyReminderTime: '20:00',
  goalCompletion: true,
  streakReminder: true,
  streakReminderTime: '21:00',
};

export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';
  private checkInterval: NodeJS.Timeout | null = null;

  private constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission as NotificationPermission;
    }
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }

    if (this.permission === 'granted') {
      return 'granted';
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission as NotificationPermission;
      return this.permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  getPermission(): NotificationPermission {
    return this.permission;
  }

  canNotify(): boolean {
    return this.permission === 'granted';
  }

  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!this.canNotify()) {
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'sporttrack',
        requireInteraction: false,
        ...options,
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  async showDailyReminder(lang: 'tr' | 'en'): Promise<void> {
    if (!this.canNotify()) return;

    const messages = {
      tr: {
        title: 'Günlük Hedefin',
        body: 'Bugün hedefini tamamlamayı unutma! 💪',
      },
      en: {
        title: 'Daily Goal',
        body: "Don't forget to complete your goal today! 💪",
      },
    };

    await this.showNotification(messages[lang].title, {
      body: messages[lang].body,
      tag: 'daily-reminder',
    });
  }

  async showGoalCompletion(lang: 'tr' | 'en', points: number): Promise<void> {
    if (!this.canNotify()) return;

    const messages = {
      tr: {
        title: '🎉 Hedef Tamamlandı!',
        body: `Tebrikler! Bugün ${points.toLocaleString('tr-TR')} puan kazandın!`,
      },
      en: {
        title: '🎉 Goal Completed!',
        body: `Congratulations! You earned ${points.toLocaleString('en-US')} points today!`,
      },
    };

    await this.showNotification(messages[lang].title, {
      body: messages[lang].body,
      tag: 'goal-completion',
      requireInteraction: true,
    });
  }

  async showStreakReminder(lang: 'tr' | 'en', streakDays: number): Promise<void> {
    if (!this.canNotify()) return;

    const messages = {
      tr: {
        title: '🔥 Seri Devam Ediyor!',
        body: `${streakDays} günlük serin var! Bugün de hedefini tamamla!`,
      },
      en: {
        title: '🔥 Streak Continues!',
        body: `You have a ${streakDays}-day streak! Complete your goal today too!`,
      },
    };

    await this.showNotification(messages[lang].title, {
      body: messages[lang].body,
      tag: 'streak-reminder',
    });
  }

  async showBadgeUnlocked(lang: 'tr' | 'en', badgeName: string, badgeIcon: string): Promise<void> {
    if (!this.canNotify()) return;

    const messages = {
      tr: {
        title: `${badgeIcon} Yeni Rozet Kazandın!`,
        body: `${badgeName} rozetini kazandın!`,
      },
      en: {
        title: `${badgeIcon} New Badge Unlocked!`,
        body: `You earned the ${badgeName} badge!`,
      },
    };

    await this.showNotification(messages[lang].title, {
      body: messages[lang].body,
      tag: 'badge-unlocked',
      requireInteraction: true,
    });
  }

  async showLevelUp(lang: 'tr' | 'en', level: number): Promise<void> {
    if (!this.canNotify()) return;

    const messages = {
      tr: {
        title: '🎉 Seviye Atladın!',
        body: `Tebrikler! Seviye ${level}'e ulaştın!`,
      },
      en: {
        title: '🎉 Level Up!',
        body: `Congratulations! You reached level ${level}!`,
      },
    };

    await this.showNotification(messages[lang].title, {
      body: messages[lang].body,
      tag: 'level-up',
      requireInteraction: true,
    });
  }

  async showChallengeCompleted(
    lang: 'tr' | 'en',
    challengeName: string,
    icon: string
  ): Promise<void> {
    if (!this.canNotify()) return;

    const messages = {
      tr: {
        title: `${icon} Zorluk Tamamlandı!`,
        body: `Tebrikler! "${challengeName}" zorluğunu tamamladın!`,
      },
      en: {
        title: `${icon} Challenge Completed!`,
        body: `Congratulations! You completed the "${challengeName}" challenge!`,
      },
    };

    await this.showNotification(messages[lang].title, {
      body: messages[lang].body,
      tag: 'challenge-completed',
      requireInteraction: true,
    });
  }

  startDailyReminderCheck(
    settings: NotificationSettings,
    lang: 'tr' | 'en',
    checkCallback: () => void
  ): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    if (!settings.enabled || !settings.dailyReminder) {
      return;
    }

    // Check every minute
    this.checkInterval = setInterval(() => {
      const now = new Date();
      const [hours, minutes] = settings.dailyReminderTime.split(':').map(Number);
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);

      // Check if current time matches reminder time (within 1 minute)
      const timeDiff = Math.abs(now.getTime() - reminderTime.getTime());
      if (timeDiff < 60000) {
        checkCallback();
      }
    }, 60000);
  }

  stopDailyReminderCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

export const notificationService = NotificationService.getInstance();
