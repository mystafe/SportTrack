'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/lib/settingsStore';
import { useActivities } from '@/lib/activityStore';
import { OnboardingTour, type TourStep } from './OnboardingTour';
import { STORAGE_KEYS } from '@/lib/constants';

export function OnboardingManager() {
  const { t, lang } = useI18n();
  const { settings, hydrated: settingsHydrated } = useSettings();
  const { activities, hydrated: activitiesHydrated } = useActivities();
  const router = useRouter();
  const [showTour, setShowTour] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);

  useEffect(() => {
    if (!settingsHydrated || !activitiesHydrated) return;

    // Don't show onboarding if login popup is skipped (after logout)
    const skipLoginPopup =
      typeof window !== 'undefined' &&
      localStorage.getItem('sporttrack.skip_login_popup') === 'true';
    if (skipLoginPopup) {
      setHasCompletedOnboarding(true);
      setShowTour(false);
      return;
    }

    // Check if user has completed onboarding
    const completed = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    const isNewUser = !settings?.name || activities.length === 0;

    if (!completed && isNewUser) {
      setHasCompletedOnboarding(false);
      // Wait a bit for page to load
      setTimeout(() => {
        setShowTour(true);
      }, 1000);
    }
  }, [settingsHydrated, activitiesHydrated, settings, activities]);

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    setShowTour(false);
    setHasCompletedOnboarding(true);
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    setShowTour(false);
    setHasCompletedOnboarding(true);
  };

  // Function to reset onboarding (called from settings)
  const resetOnboarding = () => {
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    setHasCompletedOnboarding(false);
    setTimeout(() => {
      setShowTour(true);
    }, 500);
  };

  const getTourSteps = (): TourStep[] => {
    return [
      {
        id: 'welcome',
        target: 'body',
        title: lang === 'tr' ? 'Hoş Geldiniz! 👋' : 'Welcome! 👋',
        content:
          lang === 'tr'
            ? "SportTrack'e hoş geldiniz! Bu kısa turda size uygulamanın temel özelliklerini göstereceğiz."
            : "Welcome to SportTrack! In this short tour, we'll show you the basic features of the app.",
        position: 'center',
        action: () => {
          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
      },
      {
        id: 'add-activity',
        target: '[data-tour-id="add-activity"]',
        title: lang === 'tr' ? 'Aktivite Ekleme ➕' : 'Add Activity ➕',
        content:
          lang === 'tr'
            ? 'Bu butona tıklayarak yeni aktiviteler ekleyebilirsiniz. Aktivite türü, miktar ve not ekleyebilirsiniz.'
            : 'Click this button to add new activities. You can add activity type, amount, and notes.',
        position: 'bottom',
      },
      {
        id: 'stats',
        target: 'a[href="/stats"]',
        title: lang === 'tr' ? 'İstatistikler 📊' : 'Statistics 📊',
        content:
          lang === 'tr'
            ? 'Detaylı istatistiklerinizi, grafiklerinizi ve analizlerinizi buradan görüntüleyebilirsiniz.'
            : 'View your detailed statistics, charts, and analyses here.',
        position: 'bottom',
      },
      {
        id: 'activities',
        target: '[data-tour-id="activities"]',
        title: lang === 'tr' ? 'Aktiviteler 🏃' : 'Activities 🏃',
        content:
          lang === 'tr'
            ? 'Tüm aktivitelerinizi buradan görüntüleyebilir, düzenleyebilir ve filtreleyebilirsiniz.'
            : 'View, edit, and filter all your activities here.',
        position: 'bottom',
      },
      {
        id: 'achievements',
        target: 'a[href="/achievements"]',
        title: lang === 'tr' ? 'Başarımlar 🏆' : 'Achievements 🏆',
        content:
          lang === 'tr'
            ? 'Kazandığınız rozetleri ve başarımlarınızı buradan görüntüleyebilirsiniz.'
            : 'View your badges and achievements here.',
        position: 'bottom',
      },
      {
        id: 'challenges',
        target: 'a[href="/challenges"]',
        title: lang === 'tr' ? 'Hedefler 🎯' : 'Goals 🎯',
        content:
          lang === 'tr'
            ? 'Günlük, haftalık ve özel hedefler oluşturup takip edebilirsiniz.'
            : 'Create and track daily, weekly, and custom goals.',
        position: 'bottom',
      },
      {
        id: 'profile',
        target: '[data-tour-id="profile"]',
        title: lang === 'tr' ? 'Profil Ayarları 👤' : 'Profile Settings 👤',
        content:
          lang === 'tr'
            ? 'Buradan profil bilgilerinizi, günlük hedefinizi ve ruh halinizi ayarlayabilirsiniz.'
            : 'Here you can set your profile information, daily target, and mood.',
        position: 'bottom',
      },
      {
        id: 'complete',
        target: 'body',
        title: lang === 'tr' ? 'Hazırsınız! 🎉' : "You're Ready! 🎉",
        content:
          lang === 'tr'
            ? "Artık SportTrack'i kullanmaya başlayabilirsiniz! İyi antrenmanlar! 💪"
            : "You're now ready to use SportTrack! Happy training! 💪",
        position: 'center',
      },
    ];
  };

  if (!showTour || hasCompletedOnboarding) {
    return null;
  }

  return <OnboardingTour steps={getTourSteps()} onComplete={handleComplete} onSkip={handleSkip} />;
}
