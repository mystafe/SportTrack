'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useBadges } from '@/lib/badgeStore';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';
import { Confetti } from '@/components/Confetti';
import type { Badge } from '@/lib/badges';

export function BadgeUnlockNotification() {
  const { badges, checkNewBadges } = useBadges();
  const { lang } = useI18n();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { triggerHaptic } = useHapticFeedback();
  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([]);
  const [currentBadge, setCurrentBadge] = useState<Badge | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [shownBadgeIds, setShownBadgeIds] = useState<Set<string>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);

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
      setShowConfetti(true);
      // Trigger haptic feedback when badge appears
      triggerHaptic('success');

      // Hide confetti after animation
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
  }, [unlockedBadges, currentBadge, isVisible, triggerHaptic]);

  // Auto-hide timer - runs when badge is visible
  useEffect(() => {
    if (currentBadge && isVisible && !isExiting) {
      // Auto-hide after 5 seconds if not clicked
      const autoHideTimer = setTimeout(() => {
        handleDismiss();
      }, 5000);

      return () => clearTimeout(autoHideTimer);
    }
  }, [currentBadge, isVisible, isExiting, handleDismiss]);

  const handleBadgeClick = () => {
    handleDismiss();
    // Smooth page transition
    setTimeout(() => {
      router.push('/achievements');
    }, 150);
  };

  const handleBackdropClick = () => {
    // Close when clicking outside the badge
    handleDismiss();
  };

  const getRarityGradient = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 via-gray-300 to-gray-400 dark:from-gray-500 dark:via-gray-400 dark:to-gray-500';
      case 'rare':
        return 'from-blue-400 via-cyan-400 to-blue-500 dark:from-blue-500 dark:via-cyan-500 dark:to-blue-600';
      case 'epic':
        return 'from-purple-400 via-pink-400 to-purple-500 dark:from-purple-500 dark:via-pink-500 dark:to-purple-600';
      case 'legendary':
        return 'from-yellow-400 via-amber-400 to-orange-400 dark:from-yellow-500 dark:via-amber-500 dark:to-orange-500';
      default:
        return 'from-yellow-400 via-amber-400 to-orange-400 dark:from-yellow-500 dark:via-amber-500 dark:to-orange-500';
    }
  };

  const getRarityBorderColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-300 dark:border-gray-600';
      case 'rare':
        return 'border-blue-300 dark:border-blue-600';
      case 'epic':
        return 'border-purple-300 dark:border-purple-600';
      case 'legendary':
        return 'border-yellow-300 dark:border-yellow-400';
      default:
        return 'border-yellow-300 dark:border-yellow-400';
    }
  };

  const getConfettiColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common':
        return '#9CA3AF';
      case 'rare':
        return '#60A5FA';
      case 'epic':
        return '#A78BFA';
      case 'legendary':
        return '#FFD700';
      default:
        return '#FFD700';
    }
  };

  if (!currentBadge || !isVisible) return null;

  return (
    <>
      <Confetti active={showConfetti} color={getConfettiColor(currentBadge.rarity)} />
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto bg-black/30 dark:bg-black/50 backdrop-blur-sm`}
        onClick={handleBackdropClick}
      >
        <div
          className={`${isMobile ? 'px-4 py-3' : 'px-6 py-4'} rounded-2xl bg-gradient-to-br ${getRarityGradient(currentBadge.rarity)} shadow-2xl border-4 ${getRarityBorderColor(currentBadge.rarity)} cursor-pointer pointer-events-auto transform transition-all duration-300 ${isExiting ? 'opacity-0 scale-90' : 'opacity-100 scale-100'} animate-badge-unlock-center relative overflow-hidden`}
          onClick={(e) => {
            e.stopPropagation();
            handleBadgeClick();
          }}
        >
          {/* Glow effect based on rarity */}
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getRarityGradient(currentBadge.rarity)} opacity-50 blur-xl animate-pulse`}
            style={{
              animation:
                currentBadge.rarity === 'legendary'
                  ? 'legendary-glow 2s ease-in-out infinite'
                  : 'pulse 2s ease-in-out infinite',
            }}
          />

          {/* Content */}
          <div className="relative flex flex-col items-center gap-2 z-10">
            <div className={`${isMobile ? 'text-5xl' : 'text-6xl'} animate-badge-bounce relative`}>
              <span className="relative z-10">{currentBadge.icon}</span>
              {/* Icon glow */}
              <span
                className={`absolute inset-0 ${isMobile ? 'text-5xl' : 'text-6xl'} blur-md opacity-75 animate-pulse`}
                style={{
                  filter: 'blur(8px)',
                  animation: 'icon-glow 1.5s ease-in-out infinite',
                }}
              >
                {currentBadge.icon}
              </span>
            </div>
            <div
              className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-white text-center drop-shadow-lg`}
            >
              {lang === 'tr' ? 'Yeni Rozet Kazandın!' : 'New Badge Unlocked!'}
            </div>
            <div
              className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-white/95 text-center drop-shadow-md`}
            >
              {currentBadge.name[lang]}
            </div>
            {currentBadge.description && (
              <div
                className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-white/90 text-center max-w-xs drop-shadow-sm`}
              >
                {currentBadge.description[lang]}
              </div>
            )}
            <div
              className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-white/80 text-center mt-1 italic`}
            >
              {lang === 'tr' ? 'Tıklayarak rozetlerini gör' : 'Click to view your badges'}
            </div>
          </div>

          {/* Enhanced Sparkles */}
          {Array.from({ length: currentBadge.rarity === 'legendary' ? 20 : 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute badge-sparkle text-lg"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random() * 1}s`,
              }}
            >
              ✨
            </div>
          ))}

          {/* Rarity indicator */}
          <div
            className={`absolute top-2 right-2 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm ${isMobile ? 'text-[8px]' : 'text-xs'} font-bold text-white`}
          >
            {currentBadge.rarity === 'common'
              ? lang === 'tr'
                ? 'Yaygın'
                : 'Common'
              : currentBadge.rarity === 'rare'
                ? lang === 'tr'
                  ? 'Nadir'
                  : 'Rare'
                : currentBadge.rarity === 'epic'
                  ? lang === 'tr'
                    ? 'Efsanevi'
                    : 'Epic'
                  : lang === 'tr'
                    ? 'Efsane'
                    : 'Legendary'}
          </div>
        </div>
      </div>
    </>
  );
}
