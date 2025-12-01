'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/lib/settingsStore';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export function WelcomeToast() {
  const { user, isAuthenticated, isConfigured } = useAuth();
  const { settings, hydrated: settingsHydrated } = useSettings();
  const { lang } = useI18n();
  const isMobile = useIsMobile();
  const [show, setShow] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isConfigured || !settingsHydrated || !user) {
      setShow(false);
      setHasShown(false);
      return;
    }

    // Reset hasShown when user changes (new login)
    const currentUserId = user.uid;
    const lastUserId =
      typeof window !== 'undefined' ? localStorage.getItem('sporttrack_last_user_id') : null;

    // If user changed, reset everything
    if (lastUserId !== currentUserId) {
      setHasShown(false);
      setShow(false);
      setIsHiding(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sporttrack_last_user_id', currentUserId);
        localStorage.removeItem('sporttrack_last_login_time'); // Clear to allow showing welcome
      }
    }

    // If already shown for this user, don't show again
    if (hasShown && lastUserId === currentUserId) {
      return;
    }

    // Show welcome toast with animation after delay
    const showTimer = setTimeout(() => {
      setHasShown(true);
      setShow(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sporttrack_last_login_time', String(Date.now()));
      }
    }, 800); // Small delay after login

    return () => {
      clearTimeout(showTimer);
    };
  }, [isAuthenticated, isConfigured, settingsHydrated, user?.uid]);

  // Separate effect to handle auto-hide when show becomes true
  useEffect(() => {
    if (!show) {
      setIsHiding(false);
      return;
    }

    const hideTimer = setTimeout(() => {
      setIsHiding(true);
    }, 4000);

    const removeTimer = setTimeout(() => {
      setShow(false);
      setIsHiding(false);
    }, 4500); // 4000ms display + 500ms fade-out

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [show]);

  if (!show || !user) {
    return null;
  }

  const userName =
    settings?.name ||
    user.displayName ||
    user.email?.split('@')[0] ||
    (lang === 'tr' ? 'Kullanıcı' : 'User');
  const welcomeMessage =
    lang === 'tr' ? `Hoş geldiniz, ${userName}! 🎉` : `Welcome, ${userName}! 🎉`;

  const toastContent = (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] ${
        isHiding
          ? 'opacity-0 translate-y-[-20px] pointer-events-none'
          : show
            ? 'animate-slide-down-fade-in'
            : 'opacity-0 translate-y-[-20px] pointer-events-none'
      } transition-all duration-500 ease-out`}
      role="alert"
      aria-live="polite"
    >
      <div
        className={`${
          isMobile ? 'px-4 py-3 text-sm' : 'px-6 py-4 text-base'
        } glass-effect card-3d bg-gradient-to-r from-brand/95 via-brand-dark/95 to-brand/95 text-white rounded-xl shadow-2xl backdrop-blur-xl border-2 border-white/30 dark:border-white/20 animate-pulse-subtle hover:scale-[1.02] transition-all duration-300`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl animate-bounce">👋</span>
          <p className="font-bold">{welcomeMessage}</p>
        </div>
      </div>
    </div>
  );

  if (typeof window === 'undefined') {
    return null;
  }

  return createPortal(toastContent, document.body);
}
