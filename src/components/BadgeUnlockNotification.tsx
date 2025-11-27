'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useBadges } from '@/lib/badgeStore';
import { useActivities } from '@/lib/activityStore';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';
import { Confetti } from '@/components/Confetti';
import type { Badge } from '@/lib/badges';

export function BadgeUnlockNotification() {
  const { badges, checkNewBadges, markBadgeAsShown } = useBadges();
  const { activities } = useActivities();
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
  const prevActivitiesLengthRef = useRef<number>(0);
  const isInitializedRef = useRef<boolean>(false);

  // Initialize shownBadgeIds from localStorage on mount and from badges with shown: true
  useEffect(() => {
    if (typeof window !== 'undefined' && badges.length > 0 && !isInitializedRef.current) {
      try {
        const stored = localStorage.getItem('sporttrack.shown_badge_ids');
        const storedIds = stored ? (JSON.parse(stored) as string[]) : [];

        // Also add badges that are marked as shown: true
        const shownBadgeIdsFromBadges = badges
          .filter((badge) => badge.shown === true)
          .map((badge) => badge.id);

        // Combine both sources and remove duplicates
        const allShownIds = Array.from(new Set([...storedIds, ...shownBadgeIdsFromBadges]));

        // Only update if there are changes
        if (allShownIds.length > 0) {
          setShownBadgeIds(new Set(allShownIds));
          localStorage.setItem('sporttrack.shown_badge_ids', JSON.stringify(allShownIds));
        }

        // Mark as initialized
        isInitializedRef.current = true;
        prevActivitiesLengthRef.current = activities.length;
      } catch (error) {
        console.error('Failed to load shown badge IDs:', error);
      }
    }
  }, [badges, activities.length]);

  useEffect(() => {
    // Skip badge notifications in these scenarios:
    // 1. Dummy data is being loaded
    // 2. Data is being imported
    // 3. User just logged in (initial data sync)
    const shouldSuppressBadges =
      typeof window !== 'undefined' &&
      (localStorage.getItem('sporttrack.dummy_data_loading') === 'true' ||
        localStorage.getItem('sporttrack.data_importing') === 'true' ||
        localStorage.getItem('sporttrack.is_new_login') === 'true');

    if (shouldSuppressBadges) {
      return;
    }

    // Don't check for badges if we haven't initialized yet
    if (!isInitializedRef.current) {
      return;
    }

    // Only check for badges if activities actually increased (new activity added)
    // This prevents checking on page refresh when badges are loaded from localStorage
    const currentActivitiesLength = activities.length;
    const hasNewActivity = currentActivitiesLength > prevActivitiesLengthRef.current;

    if (!hasNewActivity) {
      // Update ref but don't check for badges
      prevActivitiesLengthRef.current = currentActivitiesLength;
      return;
    }

    // Update ref before checking
    prevActivitiesLengthRef.current = currentActivitiesLength;

    // Check for new badges - only truly new badges will be returned
    const newBadges = checkNewBadges();
    if (newBadges.length > 0) {
      // Only add badges that haven't been shown yet
      // Check both the badge's shown flag and our local shownBadgeIds set
      const unseenBadges = newBadges.filter(
        (badge) => badge.shown !== true && !shownBadgeIds.has(badge.id)
      );
      if (unseenBadges.length > 0) {
        setUnlockedBadges((prev) => [...prev, ...unseenBadges]);
        const newShownIds = new Set(shownBadgeIds);
        unseenBadges.forEach((badge) => newShownIds.add(badge.id));
        setShownBadgeIds(newShownIds);

        // Save to localStorage
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(
              'sporttrack.shown_badge_ids',
              JSON.stringify(Array.from(newShownIds))
            );
          } catch (error) {
            console.error('Failed to save shown badge IDs:', error);
          }
        }
      }
    }
  }, [activities.length, checkNewBadges, shownBadgeIds]);

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

      // Mark badge as shown when notification appears
      markBadgeAsShown(nextBadge.id);

      // Also update local shownBadgeIds set and save to localStorage
      setShownBadgeIds((prev) => {
        const newSet = new Set(prev);
        newSet.add(nextBadge.id);
        // Save to localStorage
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('sporttrack.shown_badge_ids', JSON.stringify(Array.from(newSet)));
          } catch (error) {
            console.error('Failed to save shown badge IDs:', error);
          }
        }
        return newSet;
      });

      // Trigger haptic feedback when badge appears
      triggerHaptic('success');

      // Hide confetti after animation
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
  }, [unlockedBadges, currentBadge, isVisible, triggerHaptic, markBadgeAsShown]);

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
