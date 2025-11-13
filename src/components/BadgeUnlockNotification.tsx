'use client';

import { useEffect, useState } from 'react';
import { useBadges } from '@/lib/badgeStore';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import type { Badge } from '@/lib/badges';

export function BadgeUnlockNotification() {
  const { badges, checkNewBadges } = useBadges();
  const { lang } = useI18n();
  const isMobile = useIsMobile();
  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([]);
  const [currentBadge, setCurrentBadge] = useState<Badge | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const newBadges = checkNewBadges();
    if (newBadges.length > 0) {
      setUnlockedBadges(prev => [...prev, ...newBadges]);
    }
  }, [badges, checkNewBadges]);

  useEffect(() => {
    if (unlockedBadges.length > 0 && !currentBadge) {
      const nextBadge = unlockedBadges[0];
      setCurrentBadge(nextBadge);
      setIsVisible(true);
      
      // Hide after animation
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentBadge(null);
          setUnlockedBadges(prev => prev.slice(1));
        }, 500);
      }, 4000);
    }
  }, [unlockedBadges, currentBadge]);

  if (!currentBadge || !isVisible) return null;

  return (
    <div className={`fixed ${isMobile ? 'top-20' : 'top-24'} left-1/2 transform -translate-x-1/2 z-[100] badge-unlock-notification`}>
      <div className={`${isMobile ? 'px-4 py-3' : 'px-6 py-4'} rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 dark:from-yellow-500 dark:via-amber-500 dark:to-orange-500 shadow-2xl border-4 border-yellow-300 dark:border-yellow-400 animate-badge-unlock`}>
        <div className="flex flex-col items-center gap-2">
          <div className={`${isMobile ? 'text-5xl' : 'text-6xl'} animate-badge-bounce`}>
            {currentBadge.icon}
          </div>
          <div className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-white text-center`}>
            {lang === 'tr' ? 'Yeni Rozet Kazandın!' : 'New Badge Unlocked!'}
          </div>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-white/90 text-center`}>
            {currentBadge.name[lang]}
          </div>
          {currentBadge.description && (
            <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-white/80 text-center max-w-xs`}>
              {currentBadge.description[lang]}
            </div>
          )}
        </div>
        {/* Sparkles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute badge-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`
            }}
          >
            ✨
          </div>
        ))}
      </div>
    </div>
  );
}

