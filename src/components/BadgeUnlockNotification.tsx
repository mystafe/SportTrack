'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useBadges } from '@/lib/badgeStore';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import type { Badge } from '@/lib/badges';

export function BadgeUnlockNotification() {
  const { badges, checkNewBadges } = useBadges();
  const { lang } = useI18n();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([]);
  const [currentBadge, setCurrentBadge] = useState<Badge | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [shownBadgeIds, setShownBadgeIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newBadges = checkNewBadges();
    if (newBadges.length > 0) {
      // Only add badges that haven't been shown yet
      const unseenBadges = newBadges.filter((badge) => !shownBadgeIds.has(badge.id));
      if (unseenBadges.length > 0) {
        setUnlockedBadges((prev) => [...prev, ...unseenBadges]);
        setShownBadgeIds((prev) => {
          const newSet = new Set(prev);
          unseenBadges.forEach((badge) => newSet.add(badge.id));
          return newSet;
        });
      }
    }
  }, [badges, checkNewBadges, shownBadgeIds]);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setCurrentBadge(null);
      setUnlockedBadges((prev) => prev.slice(1));
      setIsExiting(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (unlockedBadges.length > 0 && !currentBadge && !isVisible) {
      const nextBadge = unlockedBadges[0];
      setCurrentBadge(nextBadge);
      setIsVisible(true);
      setIsExiting(false);

      // Auto-hide after 5 seconds if not clicked
      const autoHideTimer = setTimeout(() => {
        handleDismiss();
      }, 5000);

      return () => clearTimeout(autoHideTimer);
    }
  }, [unlockedBadges, currentBadge, isVisible, handleDismiss]);

  const handleClick = () => {
    handleDismiss();
    // Smooth page transition
    setTimeout(() => {
      router.push('/achievements');
    }, 150);
  };

  if (!currentBadge || !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-none`}
      onClick={handleClick}
    >
      <div
        className={`${isMobile ? 'px-4 py-3' : 'px-6 py-4'} rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 dark:from-yellow-500 dark:via-amber-500 dark:to-orange-500 shadow-2xl border-4 border-yellow-300 dark:border-yellow-400 cursor-pointer pointer-events-auto transform transition-all duration-300 ${isExiting ? 'opacity-0 scale-90' : 'opacity-100 scale-100'} animate-badge-unlock-center`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-2">
          <div className={`${isMobile ? 'text-5xl' : 'text-6xl'} animate-badge-bounce`}>
            {currentBadge.icon}
          </div>
          <div className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-white text-center`}>
            {lang === 'tr' ? 'Yeni Rozet Kazandın!' : 'New Badge Unlocked!'}
          </div>
          <div
            className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-white/90 text-center`}
          >
            {currentBadge.name[lang]}
          </div>
          {currentBadge.description && (
            <div
              className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-white/80 text-center max-w-xs`}
            >
              {currentBadge.description[lang]}
            </div>
          )}
          <div
            className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-white/70 text-center mt-1 italic`}
          >
            {lang === 'tr' ? 'Tıklayarak rozetlerini gör' : 'Click to view your badges'}
          </div>
        </div>
        {/* Sparkles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute badge-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>
    </div>
  );
}
