'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useChallenges } from '@/lib/challengeStore';
import { useActivities } from '@/lib/activityStore';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';
import { Confetti } from '@/components/Confetti';
import { calculateChallengeProgress } from '@/lib/challenges';
import type { Challenge } from '@/lib/challenges';

export function ChallengeCompletionNotification() {
  const { challenges } = useChallenges();
  const { activities } = useActivities();
  const { lang } = useI18n();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { triggerHaptic } = useHapticFeedback();
  const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const shownChallengeIdsRef = useRef<Set<string>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const isInitializedRef = useRef<boolean>(false);

  // Initialize shownChallengeIdsRef from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitializedRef.current) {
      try {
        const stored = localStorage.getItem('sporttrack.shown_challenge_ids');
        const storedIds = stored ? (JSON.parse(stored) as string[]) : [];
        shownChallengeIdsRef.current = new Set(storedIds);
        isInitializedRef.current = true;
      } catch (error) {
        console.error('Failed to load shown challenge IDs:', error);
        isInitializedRef.current = true;
      }
    }
  }, []);

  // Save shownChallengeIdsRef to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitializedRef.current) {
      try {
        const idsArray = Array.from(shownChallengeIdsRef.current);
        localStorage.setItem('sporttrack.shown_challenge_ids', JSON.stringify(idsArray));
      } catch (error) {
        console.error('Failed to save shown challenge IDs:', error);
      }
    }
  }, [shownChallengeIdsRef.current.size]); // Trigger when size changes

  // Memoize completed challenges check to avoid infinite loops
  // Only check challenges that are newly completed (status === 'completed' with completedAt timestamp)
  // OR active challenges that just reached completion (progress.isCompleted && status === 'active')
  const completedChallengesList = useMemo(() => {
    return challenges.filter((c) => {
      // Challenge is newly completed if:
      // 1. Status is 'completed' and has completedAt timestamp (recently completed)
      // 2. OR status is 'active' but progress shows completion (just completed, status not yet updated)
      const progress = calculateChallengeProgress(c, activities);
      if (c.status === 'completed' && c.completedAt) {
        // Already marked as completed - check if recent (within last hour)
        const completedAt = new Date(c.completedAt);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return completedAt >= oneHourAgo;
      }
      // Active challenge that just reached completion
      return progress.isCompleted && c.status === 'active';
    });
  }, [challenges, activities]);

  // Track previous completed challenges to detect new ones
  const prevCompletedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Get IDs of currently completed challenges
    const currentCompletedIds = new Set(completedChallengesList.map((c) => c.id));
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago

    // Find newly completed challenges (in current but not in previous)
    // Also filter by completedAt timestamp - only show notifications for challenges completed recently (within last 1 hour)
    const newCompleted = completedChallengesList.filter((challenge) => {
      // Skip if already shown
      if (shownChallengeIdsRef.current.has(challenge.id)) {
        return false;
      }

      // Check if challenge was completed recently (within last 1 hour)
      if (challenge.completedAt) {
        const completedAt = new Date(challenge.completedAt);
        const isRecent = completedAt >= oneHourAgo;

        // Only show if recently completed AND not previously shown
        if (isRecent && !prevCompletedIdsRef.current.has(challenge.id)) {
          return true;
        }
        return false;
      }

      // If no completedAt timestamp, skip (shouldn't happen after migration)
      // This prevents old challenges without timestamps from showing notifications
      return false;
    });

    // Update the ref with current completed IDs
    prevCompletedIdsRef.current = currentCompletedIds;

    // Add new completed challenges to the queue
    if (newCompleted.length > 0) {
      setCompletedChallenges((prev) => {
        // Prevent duplicate additions
        const existingIds = new Set(prev.map((c) => c.id));
        const trulyNew = newCompleted.filter((c) => !existingIds.has(c.id));
        if (trulyNew.length === 0) return prev;
        return [...prev, ...trulyNew];
      });
      newCompleted.forEach((challenge) => {
        shownChallengeIdsRef.current.add(challenge.id);
      });
    }
  }, [completedChallengesList]);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setCurrentChallenge(null);
      setCompletedChallenges((prev) => prev.slice(1));
      setIsExiting(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (completedChallenges.length > 0 && !currentChallenge && !isVisible) {
      const nextChallenge = completedChallenges[0];
      setCurrentChallenge(nextChallenge);
      setIsVisible(true);
      setIsExiting(false);
      setShowConfetti(true);
      // Trigger haptic feedback when challenge appears
      triggerHaptic('success');

      // Hide confetti after animation
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
  }, [completedChallenges, currentChallenge, isVisible, triggerHaptic]);

  // Auto-hide timer - runs when challenge is visible
  useEffect(() => {
    if (currentChallenge && isVisible && !isExiting) {
      // Auto-hide after 5 seconds if not clicked
      const autoHideTimer = setTimeout(() => {
        handleDismiss();
      }, 5000);

      return () => clearTimeout(autoHideTimer);
    }
  }, [currentChallenge, isVisible, isExiting, handleDismiss]);

  const handleChallengeClick = () => {
    handleDismiss();
    // Smooth page transition
    setTimeout(() => {
      router.push('/challenges');
    }, 150);
  };

  const handleBackdropClick = () => {
    // Close when clicking outside the challenge
    handleDismiss();
  };

  const getChallengeTypeColor = (type: Challenge['type']) => {
    switch (type) {
      case 'daily':
        return {
          gradient:
            'from-green-400 via-emerald-400 to-teal-400 dark:from-green-500 dark:via-emerald-500 dark:to-teal-500',
          border: 'border-green-300 dark:border-green-600',
          confetti: '#10B981',
        };
      case 'weekly':
        return {
          gradient:
            'from-blue-400 via-indigo-400 to-purple-400 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500',
          border: 'border-blue-300 dark:border-blue-600',
          confetti: '#3B82F6',
        };
      case 'monthly':
        return {
          gradient:
            'from-purple-400 via-pink-400 to-rose-400 dark:from-purple-500 dark:via-pink-500 dark:to-rose-500',
          border: 'border-purple-300 dark:border-purple-600',
          confetti: '#A855F7',
        };
      case 'yearly':
        return {
          gradient:
            'from-yellow-400 via-amber-400 to-orange-400 dark:from-yellow-500 dark:via-amber-500 dark:to-orange-500',
          border: 'border-yellow-300 dark:border-yellow-400',
          confetti: '#F59E0B',
        };
      case 'seasonal':
        return {
          gradient:
            'from-cyan-400 via-blue-400 to-indigo-400 dark:from-cyan-500 dark:via-blue-500 dark:to-indigo-500',
          border: 'border-cyan-300 dark:border-cyan-600',
          confetti: '#06B6D4',
        };
      default:
        return {
          gradient:
            'from-indigo-400 via-purple-400 to-pink-400 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500',
          border: 'border-indigo-300 dark:border-indigo-600',
          confetti: '#6366F1',
        };
    }
  };

  if (!currentChallenge || !isVisible) return null;

  const colors = getChallengeTypeColor(currentChallenge.type);

  return (
    <>
      <Confetti active={showConfetti} color={colors.confetti} particleCount={60} />
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto bg-black/40 dark:bg-black/60 backdrop-blur-md`}
        onClick={handleBackdropClick}
      >
        <div
          className={`${isMobile ? 'px-4 py-3' : 'px-6 py-4'} rounded-2xl bg-gradient-to-br ${colors.gradient} shadow-2xl border-4 ${colors.border} cursor-pointer pointer-events-auto transform transition-all duration-300 ${isExiting ? 'opacity-0 scale-90' : 'opacity-100 scale-100'} animate-badge-unlock-center relative overflow-hidden max-w-md mx-4`}
          onClick={(e) => {
            e.stopPropagation();
            handleChallengeClick();
          }}
        >
          {/* Glow effect */}
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors.gradient} opacity-50 blur-xl animate-pulse`}
            style={{
              animation: 'legendary-glow 2s ease-in-out infinite',
            }}
          />

          {/* Content */}
          <div className="relative flex flex-col items-center gap-2 z-10">
            {/* Challenge Icon */}
            <div className={`${isMobile ? 'text-5xl' : 'text-6xl'} animate-badge-bounce relative`}>
              <span className="relative z-10">{currentChallenge.icon || '🎯'}</span>
              {/* Icon glow */}
              <span
                className={`absolute inset-0 ${isMobile ? 'text-5xl' : 'text-6xl'} blur-md opacity-75 animate-pulse`}
                style={{
                  filter: 'blur(8px)',
                  animation: 'icon-glow 1.5s ease-in-out infinite',
                }}
              >
                {currentChallenge.icon || '🎯'}
              </span>
            </div>

            {/* Success Message */}
            <div
              className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-white text-center drop-shadow-lg`}
            >
              {lang === 'tr'
                ? 'Mükemmel! Challenge Tamamlandı!'
                : 'Excellent! Challenge Completed!'}
            </div>

            {/* Challenge Name */}
            <div
              className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-white/95 text-center drop-shadow-md`}
            >
              {currentChallenge.name[lang]}
            </div>

            {/* Challenge Description */}
            {currentChallenge.description && (
              <div
                className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-white/90 text-center max-w-xs drop-shadow-sm`}
              >
                {currentChallenge.description[lang]}
              </div>
            )}

            {/* Progress Info */}
            <div className="mt-2 w-full">
              <div className="flex justify-between items-center mb-1">
                <span
                  className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-white/80 font-medium`}
                >
                  {lang === 'tr' ? 'Hedef:' : 'Target:'}
                </span>
                <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-white font-bold`}>
                  {currentChallenge.target.toLocaleString()} {lang === 'tr' ? 'puan' : 'points'}
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Click hint */}
            <div
              className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-white/80 text-center mt-1 italic`}
            >
              {lang === 'tr' ? "Tıklayarak challenge'ları gör" : 'Click to view challenges'}
            </div>
          </div>

          {/* Enhanced Sparkles */}
          {Array.from({ length: 15 }).map((_, i) => (
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

          {/* Challenge Type Indicator */}
          <div
            className={`absolute top-2 right-2 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm ${isMobile ? 'text-[8px]' : 'text-xs'} font-bold text-white`}
          >
            {currentChallenge.type === 'daily'
              ? lang === 'tr'
                ? 'Günlük'
                : 'Daily'
              : currentChallenge.type === 'weekly'
                ? lang === 'tr'
                  ? 'Haftalık'
                  : 'Weekly'
                : currentChallenge.type === 'monthly'
                  ? lang === 'tr'
                    ? 'Aylık'
                    : 'Monthly'
                  : currentChallenge.type === 'yearly'
                    ? lang === 'tr'
                      ? 'Yıllık'
                      : 'Yearly'
                    : currentChallenge.type === 'seasonal'
                      ? lang === 'tr'
                        ? 'Mevsimlik'
                        : 'Seasonal'
                      : lang === 'tr'
                        ? 'Özel'
                        : 'Custom'}
          </div>

          {/* Completion Checkmark */}
          <div className="absolute bottom-2 left-2">
            <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
