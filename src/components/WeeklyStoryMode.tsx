'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { useBadges } from '@/lib/badgeStore';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';
import { calculateWeeklyStats, calculateStreakStats } from '@/lib/statisticsUtils';
import { compareWeeks } from '@/lib/comparisonUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';
import { useAnimatedCounter } from '@/lib/hooks/useAnimatedCounter';
import { ShareButton } from '@/components/ShareButton';
import { startOfWeek, endOfWeek, format, startOfDay, parseISO } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { getActivityLabel } from '@/lib/activityUtils';

export interface WeeklyStoryModeProps {
  /**
   * Whether the story mode is open
   */
  isOpen: boolean;
  /**
   * Callback when story mode is closed
   */
  onClose: () => void;
  /**
   * Auto-play cards automatically
   * @default false
   */
  autoPlay?: boolean;
  /**
   * Auto-play delay in milliseconds
   * @default 3000
   */
  autoPlayDelay?: number;
}

type StoryCardType =
  | 'hero'
  | 'top-activities'
  | 'streak'
  | 'best-day'
  | 'comparison'
  | 'achievement'
  | 'share';

interface StoryCard {
  type: StoryCardType;
  id: string;
}

export function WeeklyStoryMode({
  isOpen,
  onClose,
  autoPlay = false,
  autoPlayDelay = 3000,
}: WeeklyStoryModeProps) {
  const { t, lang } = useI18n();
  const { activities } = useActivities();
  const { settings } = useSettings();
  const { badges } = useBadges();
  const isMobile = useIsMobile();
  const { triggerHaptic } = useHapticFeedback();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dateLocale = lang === 'tr' ? tr : enUS;

  const dailyTarget =
    settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : DEFAULT_DAILY_TARGET;

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );

  // Get current week stats
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  const weeklyStats = useMemo(
    () => calculateWeeklyStats(activities, dailyTarget, 4),
    [activities, dailyTarget]
  );
  const currentWeek = weeklyStats[weeklyStats.length - 1];

  const weekComparison = useMemo(
    () => compareWeeks(activities, dailyTarget),
    [activities, dailyTarget]
  );

  const currentWeekActivities = useMemo(() => {
    return activities.filter((activity) => {
      const activityDate = startOfDay(parseISO(activity.performedAt));
      return activityDate >= currentWeekStart && activityDate <= currentWeekEnd;
    });
  }, [activities, currentWeekStart, currentWeekEnd]);

  const topActivities = useMemo(() => {
    const activityMap = new Map<
      string,
      {
        label: string;
        icon: string;
        count: number;
        points: number;
      }
    >();

    currentWeekActivities.forEach((activity) => {
      const key = activity.activityKey;
      const existing = activityMap.get(key);

      if (existing) {
        existing.count += 1;
        existing.points += activity.points;
      } else {
        activityMap.set(key, {
          label: getActivityLabel(activity, lang),
          icon: activity.icon,
          count: 1,
          points: activity.points,
        });
      }
    });

    return Array.from(activityMap.values())
      .sort((a, b) => b.points - a.points)
      .slice(0, 3);
  }, [currentWeekActivities, lang]);

  const streakStats = useMemo(
    () => calculateStreakStats(activities, dailyTarget),
    [activities, dailyTarget]
  );

  // Find best day of the week
  const bestDay = useMemo<{ date: Date; points: number } | null>(() => {
    const dailyPoints = new Map<string, number>();
    currentWeekActivities.forEach((activity) => {
      const dateKey = startOfDay(parseISO(activity.performedAt)).toISOString().slice(0, 10);
      dailyPoints.set(dateKey, (dailyPoints.get(dateKey) || 0) + activity.points);
    });

    let best: { date: Date; points: number } | null = null;
    dailyPoints.forEach((points, dateKey) => {
      if (!best || points > best.points) {
        best = { date: new Date(dateKey), points };
      }
    });

    return best;
  }, [currentWeekActivities]);

  // Get recent badges (unlocked this week)
  const recentBadges = useMemo(() => {
    const weekStart = currentWeekStart.getTime();
    return badges
      .filter((badge) => {
        if (!badge.unlockedAt) return false;
        const unlockedTime =
          badge.unlockedAt instanceof Date
            ? badge.unlockedAt.getTime()
            : new Date(badge.unlockedAt).getTime();
        return unlockedTime >= weekStart;
      })
      .slice(0, 3);
  }, [badges, currentWeekStart]);

  // Build story cards
  const storyCards = useMemo<StoryCard[]>(() => {
    const cards: StoryCard[] = [{ type: 'hero', id: 'hero' }];

    if (topActivities.length > 0) {
      cards.push({ type: 'top-activities', id: 'top-activities' });
    }

    if (streakStats.currentStreak > 0) {
      cards.push({ type: 'streak', id: 'streak' });
    }

    if (bestDay) {
      cards.push({ type: 'best-day', id: 'best-day' });
    }

    if (weekComparison) {
      cards.push({ type: 'comparison', id: 'comparison' });
    }

    if (recentBadges.length > 0) {
      cards.push({ type: 'achievement', id: 'achievement' });
    }

    cards.push({ type: 'share', id: 'share' });

    return cards;
  }, [topActivities, streakStats, bestDay, weekComparison, recentBadges]);

  // Navigate to next card
  const goToNext = useCallback(() => {
    if (currentCardIndex < storyCards.length - 1) {
      setIsTransitioning(true);
      triggerHaptic('light');
      setTimeout(() => {
        setCurrentCardIndex((prev) => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      // Last card - close story mode
      onClose();
    }
  }, [currentCardIndex, storyCards.length, triggerHaptic, onClose]);

  // Navigate to previous card
  const goToPrevious = useCallback(() => {
    if (currentCardIndex > 0) {
      setIsTransitioning(true);
      triggerHaptic('light');
      setTimeout(() => {
        setCurrentCardIndex((prev) => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  }, [currentCardIndex, triggerHaptic]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToNext, goToPrevious, onClose]);

  // Auto-play
  useEffect(() => {
    if (!isOpen || !autoPlay || currentCardIndex >= storyCards.length - 1) {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      return;
    }

    autoPlayTimerRef.current = setTimeout(() => {
      goToNext();
    }, autoPlayDelay);

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [isOpen, autoPlay, currentCardIndex, storyCards.length, autoPlayDelay, goToNext]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setCurrentCardIndex(0);
      setIsTransitioning(false);
    }
  }, [isOpen]);

  // Swipe gesture handlers
  const handleSwipeLeft = useCallback(() => {
    goToNext();
  }, [goToNext]);

  const handleSwipeRight = useCallback(() => {
    goToPrevious();
  }, [goToPrevious]);

  if (!isOpen || !currentWeek) return null;

  const currentCard = storyCards[currentCardIndex];
  if (!currentCard) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/90 dark:bg-black/95 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden"
      style={{ touchAction: 'pan-y' }}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        const startX = touch.clientX;
        const startY = touch.clientY;

        const handleTouchMove = (moveEvent: TouchEvent) => {
          const moveTouch = moveEvent.touches[0];
          const deltaX = moveTouch.clientX - startX;
          const deltaY = moveTouch.clientY - startY;

          // Only handle horizontal swipes
          if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            moveEvent.preventDefault();
          }
        };

        const handleTouchEnd = (endEvent: TouchEvent) => {
          const endTouch = endEvent.changedTouches[0];
          const deltaX = endTouch.clientX - startX;
          const deltaY = endTouch.clientY - startY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (distance > 50) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
              if (deltaX > 0) {
                handleSwipeRight();
              } else {
                handleSwipeLeft();
              }
            }
          }

          document.removeEventListener('touchmove', handleTouchMove);
          document.removeEventListener('touchend', handleTouchEnd);
        };

        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
      }}
    >
      {/* Progress dots */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {storyCards.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentCardIndex
                ? 'bg-white w-8'
                : index < currentCardIndex
                  ? 'bg-white/50 w-1.5'
                  : 'bg-white/20 w-1.5'
            }`}
          />
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full glass-effect bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/10 hover:bg-white/30 dark:hover:bg-white/20 text-white transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label={lang === 'tr' ? 'Kapat' : 'Close'}
      >
        ✕
      </button>

      {/* Card content */}
      <div
        className={`flex-1 w-full flex items-center justify-center transition-opacity duration-300 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {renderCard(currentCard.type)}
      </div>

      {/* Navigation hints */}
      {!isMobile && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm">
          {lang === 'tr' ? '← → ile gezin' : 'Navigate with ← →'}
        </div>
      )}
    </div>
  );

  function renderCard(type: StoryCardType) {
    switch (type) {
      case 'hero':
        return <HeroCard />;
      case 'top-activities':
        return <TopActivitiesCard />;
      case 'streak':
        return <StreakCard />;
      case 'best-day':
        return <BestDayCard />;
      case 'comparison':
        return <ComparisonCard />;
      case 'achievement':
        return <AchievementCard />;
      case 'share':
        return <ShareCard />;
      default:
        return null;
    }
  }

  function HeroCard() {
    const totalPointsCounter = useAnimatedCounter(currentWeek.totalPoints, {
      duration: 1500,
      easing: 'easeOut',
      formatter: (val) => numberFormatter.format(Math.round(val)),
    });

    return (
      <div className="text-center px-6 max-w-md">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-4xl font-bold text-white mb-4">
          {lang === 'tr' ? 'Haftanın Özeti' : 'Your Week in Numbers'}
        </h1>
        <p className="text-xl text-white/80 mb-8">
          {format(currentWeekStart, 'd MMM', { locale: dateLocale })} -{' '}
          {format(currentWeekEnd, 'd MMM yyyy', { locale: dateLocale })}
        </p>
        <div className="text-7xl font-bold text-white mb-2">{totalPointsCounter.displayValue}</div>
        <p className="text-xl text-white/70">{lang === 'tr' ? 'toplam puan' : 'total points'}</p>
      </div>
    );
  }

  function TopActivitiesCard() {
    return (
      <div className="text-center px-6 max-w-md">
        <div className="text-6xl mb-6">🏆</div>
        <h2 className="text-3xl font-bold text-white mb-8">
          {lang === 'tr' ? 'En Çok Yapılan Aktiviteler' : 'Top Activities'}
        </h2>
        <div className="space-y-6">
          {topActivities.map((activity, index) => (
            <div key={activity.label} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{activity.icon}</span>
                <div className="text-left">
                  <div className="text-xl font-bold text-white">{activity.label}</div>
                  <div className="text-sm text-white/70">
                    {activity.count} {lang === 'tr' ? 'kez' : 'times'}
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">
                {numberFormatter.format(activity.points)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function StreakCard() {
    const streakCounter = useAnimatedCounter(streakStats.currentStreak, {
      duration: 1000,
      easing: 'easeOut',
    });

    return (
      <div className="text-center px-6 max-w-md">
        <div className="text-6xl mb-6">🔥</div>
        <h2 className="text-3xl font-bold text-white mb-4">
          {lang === 'tr' ? 'Mevcut Seri' : 'Current Streak'}
        </h2>
        <div className="text-8xl font-bold text-white mb-4">{streakCounter.displayValue}</div>
        <p className="text-xl text-white/70">
          {lang === 'tr' ? 'gün üst üste!' : 'days in a row!'}
        </p>
      </div>
    );
  }

  function BestDayCard() {
    if (!bestDay) return null;

    const pointsCounter = useAnimatedCounter(bestDay.points, {
      duration: 1200,
      easing: 'easeOut',
      formatter: (val) => numberFormatter.format(Math.round(val)),
    });

    return (
      <div className="text-center px-6 max-w-md">
        <div className="text-6xl mb-6">⭐</div>
        <h2 className="text-3xl font-bold text-white mb-4">
          {lang === 'tr' ? 'Haftanın En İyi Günü' : 'Best Day of the Week'}
        </h2>
        <p className="text-xl text-white/80 mb-6">
          {format(bestDay.date, 'EEEE, d MMMM', { locale: dateLocale })}
        </p>
        <div className="text-7xl font-bold text-white mb-2">{pointsCounter.displayValue}</div>
        <p className="text-xl text-white/70">{lang === 'tr' ? 'puan' : 'points'}</p>
      </div>
    );
  }

  function ComparisonCard() {
    if (!weekComparison) return null;

    const changePercent = weekComparison.change.pointsPercent;
    const isPositive = changePercent > 0;

    return (
      <div className="text-center px-6 max-w-md">
        <div className="text-6xl mb-6">{isPositive ? '📈' : '📉'}</div>
        <h2 className="text-3xl font-bold text-white mb-4">
          {lang === 'tr' ? 'Geçen Hafta ile Karşılaştırma' : 'vs Last Week'}
        </h2>
        <div
          className={`text-7xl font-bold mb-4 ${isPositive ? 'text-green-400' : 'text-red-400'}`}
        >
          {changePercent > 0 ? '+' : ''}
          {changePercent.toFixed(1)}%
        </div>
        <div className="space-y-3 text-white/80">
          <div>
            {lang === 'tr' ? 'Puan' : 'Points'}: {changePercent > 0 ? '+' : ''}
            {numberFormatter.format(weekComparison.change.points)}
          </div>
          <div>
            {lang === 'tr' ? 'Aktivite' : 'Activities'}: {changePercent > 0 ? '+' : ''}
            {weekComparison.change.activities}
          </div>
        </div>
      </div>
    );
  }

  function AchievementCard() {
    if (recentBadges.length === 0) return null;

    return (
      <div className="text-center px-6 max-w-md">
        <div className="text-6xl mb-6">🎖️</div>
        <h2 className="text-3xl font-bold text-white mb-8">
          {lang === 'tr' ? 'Bu Hafta Kazanılan Rozetler' : 'Badges Earned This Week'}
        </h2>
        <div className="space-y-6">
          {recentBadges.map((badge) => (
            <div key={badge.id} className="flex items-center justify-center gap-4">
              <span className="text-5xl">{badge.icon}</span>
              <div className="text-left">
                <div className="text-xl font-bold text-white">{badge.name[lang]}</div>
                <div className="text-sm text-white/70">{badge.description[lang]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function ShareCard() {
    return (
      <div className="text-center px-6 max-w-md">
        <div className="text-6xl mb-6">📤</div>
        <h2 className="text-3xl font-bold text-white mb-4">
          {lang === 'tr' ? 'Paylaş' : 'Share Your Week'}
        </h2>
        <p className="text-xl text-white/80 mb-8">
          {lang === 'tr'
            ? 'Haftanın özetini paylaş ve arkadaşlarını motive et!'
            : 'Share your week summary and motivate your friends!'}
        </p>
        <ShareButton
          type="stats"
          data={{
            type: 'stats',
            title: lang === 'tr' ? 'Haftanın Özeti' : 'Weekly Summary',
            subtitle: `${format(currentWeekStart, 'd MMM', { locale: dateLocale })} - ${format(currentWeekEnd, 'd MMM yyyy', { locale: dateLocale })}`,
            stats: [
              {
                label: lang === 'tr' ? 'Toplam Puan' : 'Total Points',
                value: currentWeek.totalPoints,
                icon: '⭐',
              },
              {
                label: lang === 'tr' ? 'Seri' : 'Streak',
                value: streakStats.currentStreak,
                icon: '🔥',
              },
              {
                label: lang === 'tr' ? 'Tamamlanan Gün' : 'Completed Days',
                value: `${currentWeek.completedDays}/7`,
                icon: '✅',
              },
            ],
            theme: 'dark',
          }}
          variant="full"
          size="lg"
          className="bg-white text-black hover:bg-gray-100"
        />
      </div>
    );
  }
}
