'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useActivities } from '@/lib/activityStore';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';
import { Confetti } from '@/components/Confetti';
import {
  getActivityGoals,
  updateActivityGoalProgress,
  saveActivityGoals,
  type ActivityGoal,
} from '@/lib/activityGoals';

export function ActivityGoalCompletionNotification() {
  const { activities } = useActivities();
  const { lang } = useI18n();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { triggerHaptic } = useHapticFeedback();
  const [completedGoals, setCompletedGoals] = useState<ActivityGoal[]>([]);
  const [currentGoal, setCurrentGoal] = useState<ActivityGoal | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const shownGoalIdsRef = useRef<Set<string>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const loadedGoals = getActivityGoals();
    const updatedGoals = updateActivityGoalProgress(loadedGoals, activities);
    saveActivityGoals(updatedGoals);

    // Check for newly completed goals
    const newlyCompleted = updatedGoals.filter(
      (goal) => goal.isCompleted && !shownGoalIdsRef.current.has(goal.id)
    );

    if (newlyCompleted.length > 0) {
      setCompletedGoals((prev) => [...prev, ...newlyCompleted]);
      newlyCompleted.forEach((goal) => {
        shownGoalIdsRef.current.add(goal.id);
      });
    }
  }, [activities]);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setCurrentGoal(null);
      setCompletedGoals((prev) => prev.slice(1));
      setIsExiting(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (completedGoals.length > 0 && !currentGoal && !isVisible) {
      const nextGoal = completedGoals[0];
      setCurrentGoal(nextGoal);
      setIsVisible(true);
      setIsExiting(false);
      setShowConfetti(true);
      triggerHaptic('success');

      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
  }, [completedGoals, currentGoal, isVisible, triggerHaptic]);

  useEffect(() => {
    if (currentGoal && isVisible && !isExiting) {
      const autoHideTimer = setTimeout(() => {
        handleDismiss();
      }, 5000);

      return () => clearTimeout(autoHideTimer);
    }
  }, [currentGoal, isVisible, isExiting, handleDismiss]);

  const handleGoalClick = () => {
    handleDismiss();
    setTimeout(() => {
      router.push('/');
    }, 150);
  };

  const handleBackdropClick = () => {
    handleDismiss();
  };

  const getPeriodLabel = (period: ActivityGoal['period']) => {
    switch (period) {
      case 'daily':
        return lang === 'tr' ? 'Günlük' : 'Daily';
      case 'weekly':
        return lang === 'tr' ? 'Haftalık' : 'Weekly';
      case 'monthly':
        return lang === 'tr' ? 'Aylık' : 'Monthly';
    }
  };

  const getPeriodColor = (period: ActivityGoal['period']) => {
    switch (period) {
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
    }
  };

  if (!currentGoal || !isVisible) return null;

  const colors = getPeriodColor(currentGoal.period);

  return (
    <>
      <Confetti active={showConfetti} color={colors.confetti} particleCount={50} />
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto bg-black/30 dark:bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div
          className={`${isMobile ? 'px-4 py-3' : 'px-6 py-4'} rounded-2xl bg-gradient-to-br ${colors.gradient} shadow-2xl border-4 ${colors.border} cursor-pointer pointer-events-auto transform transition-all duration-300 ${isExiting ? 'opacity-0 scale-90' : 'opacity-100 scale-100'} animate-badge-unlock-center relative overflow-hidden max-w-md mx-4`}
          onClick={(e) => {
            e.stopPropagation();
            handleGoalClick();
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
            {/* Goal Icon */}
            <div className={`${isMobile ? 'text-5xl' : 'text-6xl'} animate-badge-bounce relative`}>
              <span className="relative z-10">{currentGoal.icon}</span>
              <span
                className={`absolute inset-0 ${isMobile ? 'text-5xl' : 'text-6xl'} blur-md opacity-75 animate-pulse`}
                style={{
                  filter: 'blur(8px)',
                  animation: 'icon-glow 1.5s ease-in-out infinite',
                }}
              >
                {currentGoal.icon}
              </span>
            </div>

            {/* Success Message */}
            <div
              className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-white text-center drop-shadow-lg`}
            >
              {lang === 'tr' ? '🎉 Hedef Tamamlandı!' : '🎉 Goal Completed!'}
            </div>

            {/* Goal Name */}
            <div
              className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-white/95 text-center drop-shadow-md`}
            >
              {lang === 'tr' ? currentGoal.label : currentGoal.labelEn || currentGoal.label}
            </div>

            {/* Goal Progress */}
            <div className="mt-2 w-full">
              <div className="flex justify-between items-center mb-1">
                <span
                  className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-white/80 font-medium`}
                >
                  {lang === 'tr' ? 'İlerleme:' : 'Progress:'}
                </span>
                <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-white font-bold`}>
                  {currentGoal.currentCount} / {currentGoal.targetCount}
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
              {lang === 'tr' ? 'Tıklayarak ana sayfaya dön' : 'Click to return to home'}
            </div>
          </div>

          {/* Sparkles */}
          {Array.from({ length: 12 }).map((_, i) => (
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

          {/* Period Indicator */}
          <div
            className={`absolute top-2 right-2 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm ${isMobile ? 'text-[8px]' : 'text-xs'} font-bold text-white`}
          >
            {getPeriodLabel(currentGoal.period)}
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
