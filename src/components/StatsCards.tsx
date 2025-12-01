'use client';

import { useMemo, useState, useEffect, useRef, memo } from 'react';
import { format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useI18n } from '@/lib/i18n';
import { useActivitiesSummary, useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { getActivityLabel, getActivityUnit } from '@/lib/activityUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';
import { useAnimatedCounter } from '@/lib/hooks/useAnimatedCounter';
import { StatsCardSkeleton } from '@/components/LoadingSkeleton';
import { notificationService } from '@/lib/notificationService';
import { trackEvent } from '@/lib/analytics';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShareButton } from '@/components/ShareButton';

export const StatsCards = memo(function StatsCards() {
  const { t, lang } = useI18n();
  const { settings, hydrated: settingsHydrated } = useSettings();
  const { hydrated: activitiesHydrated, activities } = useActivities();
  const dailyTarget =
    settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : 10_000;
  const summary = useActivitiesSummary(dailyTarget);
  const isLoading = !settingsHydrated || !activitiesHydrated;
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );
  const dateLocale = lang === 'tr' ? tr : enUS;
  const isMobile = useIsMobile();
  const { triggerHaptic } = useHapticFeedback();
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [breakdownOpen, setBreakdownOpen] = useState(true);
  const [lastSevenOpen, setLastSevenOpen] = useState(true);

  // Animated counters
  const todayPointsCounter = useAnimatedCounter(summary.todayPoints, {
    duration: 1200,
    easing: 'easeOut',
    formatter: (val) => numberFormatter.format(Math.round(val)),
  });
  const totalPointsCounter = useAnimatedCounter(summary.totalPoints, {
    duration: 1200,
    easing: 'easeOut',
    formatter: (val) => numberFormatter.format(Math.round(val)),
  });
  const streakCounter = useAnimatedCounter(summary.streakDays, {
    duration: 800,
    easing: 'easeOut',
  });
  const averageCounter = useAnimatedCounter(
    Math.round(summary.totalPoints / Math.max(1, summary.totalActivities)),
    {
      duration: 1000,
      easing: 'easeOut',
      formatter: (val) => numberFormatter.format(Math.round(val)),
    }
  );

  const renderSectionHeader = (
    id: 'breakdown' | 'lastSeven',
    title: string,
    isOpen: boolean,
    setIsOpen: (open: boolean) => void
  ) => {
    return (
      <Button
        type="button"
        variant="ghost"
        size={isMobile ? 'md' : 'sm'}
        className={`flex w-full items-center justify-between ${isMobile ? 'text-sm' : 'text-xs'} font-bold text-gray-900 dark:text-white mb-2 transition-all duration-200 hover:text-brand ${isMobile ? 'p-2 min-h-[44px]' : 'p-0 h-auto'}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`stats-section-${id}`}
      >
        <span className="font-bold">{title}</span>
        <span
          className="ml-2 text-base font-bold transition-transform duration-300 ease-in-out text-brand dark:text-brand-light"
          aria-hidden
          style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
        >
          ▼
        </span>
      </Button>
    );
  };

  const pct =
    summary.targetPoints > 0
      ? Math.min(100, Math.round((summary.todayPoints / summary.targetPoints) * 100))
      : 0;

  const isGoalCompleted = summary.todayPoints >= summary.targetPoints;
  const [wasCompleted, setWasCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGoalAnimation, setShowGoalAnimation] = useState(false);
  const notificationSentRef = useRef(false);
  const previousPctRef = useRef(pct);
  const milestoneHapticsRef = useRef<Set<number>>(new Set());

  // Haptic feedback for progress milestones
  useEffect(() => {
    if (pct !== previousPctRef.current) {
      const milestones = [25, 50, 75, 100];
      const crossedMilestone = milestones.find(
        (m) => pct >= m && previousPctRef.current < m && !milestoneHapticsRef.current.has(m)
      );

      if (crossedMilestone) {
        milestoneHapticsRef.current.add(crossedMilestone);
        if (crossedMilestone === 100) {
          triggerHaptic('success');
        } else {
          triggerHaptic('medium');
        }
      }

      previousPctRef.current = pct;
    }
  }, [pct, triggerHaptic]);

  useEffect(() => {
    if (isGoalCompleted && !wasCompleted) {
      setWasCompleted(true);
      setShowConfetti(true);
      setShowGoalAnimation(true);
      triggerHaptic('success'); // Haptic feedback for goal completion

      // Track analytics
      trackEvent('goal_completed', {
        points: summary.todayPoints,
        target: summary.targetPoints,
        date: new Date().toISOString(),
      });

      // Send notification for goal completion
      if (!notificationSentRef.current && notificationService.canNotify()) {
        notificationService.showGoalCompletion(lang as 'tr' | 'en', summary.todayPoints);
        notificationSentRef.current = true;
      }

      const confettiTimer = setTimeout(() => setShowConfetti(false), 3000);
      const animationTimer = setTimeout(() => setShowGoalAnimation(false), 10000);
      return () => {
        clearTimeout(confettiTimer);
        clearTimeout(animationTimer);
      };
    } else if (!isGoalCompleted) {
      setWasCompleted(false);
      setShowGoalAnimation(false);
      notificationSentRef.current = false;
      milestoneHapticsRef.current.clear(); // Reset milestone haptics when goal resets
    }
  }, [isGoalCompleted, wasCompleted, summary.todayPoints, lang, triggerHaptic]);

  const renderOverviewHeader = () => {
    const shareData = {
      type: 'stats' as const,
      title: lang === 'tr' ? 'İstatistiklerim' : 'My Statistics',
      subtitle:
        lang === 'tr'
          ? 'SportTrack ile takip ettiğim aktiviteler'
          : 'Activities tracked with SportTrack',
      stats: [
        {
          label: lang === 'tr' ? 'Bugünkü Puan' : 'Today Points',
          value: summary.todayPoints,
          icon: '📊',
        },
        {
          label: lang === 'tr' ? 'Toplam Puan' : 'Total Points',
          value: summary.totalPoints,
          icon: '⭐',
        },
        {
          label: lang === 'tr' ? 'Seri' : 'Streak',
          value: summary.streakDays,
          icon: '🔥',
        },
      ],
      theme: (typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light') as 'light' | 'dark',
    };

    return (
      <div className="flex items-center justify-between gap-2 mb-2">
        <Button
          type="button"
          variant="ghost"
          size={isMobile ? 'md' : 'sm'}
          className={`flex flex-1 items-center justify-between ${isMobile ? 'text-sm' : 'text-xs'} font-semibold text-gray-900 dark:text-white transition-all duration-200 hover:text-brand ${isMobile ? 'p-2 min-h-[44px]' : 'p-0 h-auto'}`}
          onClick={() => setOverviewOpen(!overviewOpen)}
          aria-expanded={overviewOpen}
          aria-controls="stats-overview"
        >
          <span className="font-bold">{t('stats.overview') || 'Overview'}</span>
          <span
            className="ml-2 text-base font-bold transition-transform duration-300 ease-in-out text-brand dark:text-brand-light"
            aria-hidden
            style={{ transform: overviewOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
          >
            ▼
          </span>
        </Button>
        <ShareButton
          type="stats"
          data={shareData}
          variant="icon"
          size={isMobile ? 'md' : 'sm'}
          className="flex-shrink-0"
        />
      </div>
    );
  };

  return (
    <div>
      {showConfetti && (
        <>
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                background: ['#10b981', '#34d399', '#059669', '#6ee7b7', '#a7f3d0'][
                  Math.floor(Math.random() * 5)
                ],
                width: `${Math.random() * 8 + 6}px`,
                height: `${Math.random() * 8 + 6}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </>
      )}

      {/* Overview Section */}
      <Card
        variant="default"
        size="sm"
        hoverable
        className="card-entrance glass-effect card-3d"
        header={renderOverviewHeader()}
      >
        {overviewOpen && (
          <div
            id="stats-overview"
            className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'} ${isMobile ? 'gap-3' : 'gap-3'}`}
          >
            <div
              className={`stagger-item card-entrance glass-effect ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} rounded-xl border-2 border-white/20 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl ${isMobile ? 'p-4 space-y-2' : 'p-4 space-y-2'} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] magnetic-hover tilt-3d gpu-accelerated card-3d ${showGoalAnimation ? 'goal-completed border-emerald-500 dark:border-emerald-400/50 ring-2 ring-emerald-500/20 dark:ring-emerald-400/20 pulse-glow' : ''}`}
            >
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 dark:text-gray-200`}
              >
                {t('stats.todayPoints')}
              </div>
              <div
                className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-brand dark:text-brand-light transition-all duration-300 ${showGoalAnimation ? 'points-value text-emerald-600 dark:text-emerald-400 number-count-mobile' : ''} ${isMobile ? 'number-count-mobile' : ''}`}
              >
                {todayPointsCounter.displayValue}
              </div>
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 font-medium`}
              >
                {t('stats.target')}: {numberFormatter.format(summary.targetPoints)}
                {isGoalCompleted && (
                  <span className="ml-1 text-green-600 dark:text-green-400 font-semibold">
                    ✓ {t('stats.goalCompleted')}
                  </span>
                )}
              </div>
              <div
                className={`${isMobile ? 'h-3.5' : 'h-2.5'} bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative shadow-inner progress-glow`}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={t('stats.progressLabel', {
                  current: summary.todayPoints,
                  target: summary.targetPoints,
                })}
              >
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${isMobile ? 'progress-fill-mobile' : 'progress-fill'} ${showGoalAnimation ? 'progress-bar bg-gradient-to-r from-green-500 via-green-400 to-green-500 animate-gradient' : 'bg-gradient-to-r from-brand via-brand-light to-brand-dark animate-gradient'} shadow-sm ${pct >= 100 ? 'pulse-glow' : ''}`}
                  style={{ width: `${pct}%` }}
                />
                {showGoalAnimation && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-success rounded-full" />
                    <div className="absolute inset-0 shimmer rounded-full" />
                  </>
                )}
                {!showGoalAnimation && pct > 0 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-progress-shimmer rounded-full" />
                )}
              </div>
            </div>
            <div
              className={`stagger-item card-entrance glass-effect ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} rounded-xl border-2 border-white/20 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl ${isMobile ? 'p-4 space-y-2' : 'p-4 space-y-2'} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] magnetic-hover tilt-3d gpu-accelerated card-3d`}
              role="region"
              aria-label={t('stats.totalPoints')}
            >
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 dark:text-gray-200`}
              >
                {t('stats.totalPoints')}
              </div>
              <div
                className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold transition-all duration-300 text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : ''}`}
                aria-label={`${t('stats.totalPoints')}: ${numberFormatter.format(summary.totalPoints)}`}
              >
                {totalPointsCounter.displayValue}
              </div>
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 font-semibold`}
              >
                {t('stats.totalActivities', { count: summary.totalActivities })}
              </div>
            </div>
            <div
              className={`stagger-item card-entrance glass-effect ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} rounded-xl border-2 border-white/20 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl ${isMobile ? 'p-4 space-y-2' : 'p-4 space-y-2'} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] magnetic-hover tilt-3d gpu-accelerated card-3d`}
              role="region"
              aria-label={t('stats.streak')}
            >
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 dark:text-gray-200`}
              >
                {t('stats.streak')}
              </div>
              <div
                className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-brand dark:text-brand-light transition-all duration-300 ${isMobile ? 'number-count-mobile' : ''}`}
                aria-label={`${t('stats.streak')}: ${summary.streakDays} ${t('stats.streakDesc')}`}
              >
                {streakCounter.displayValue}
              </div>
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 font-semibold`}
              >
                {t('stats.streakDesc')}
              </div>
            </div>
            <div
              className={`stagger-item card-entrance glass-effect ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} rounded-xl border-2 border-white/20 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl ${isMobile ? 'p-4 space-y-2' : 'p-4 space-y-2'} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] magnetic-hover tilt-3d gpu-accelerated card-3d`}
            >
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 dark:text-gray-200`}
              >
                {t('stats.averageDaily')}
              </div>
              <div
                className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold transition-all duration-300 text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : ''}`}
              >
                {averageCounter.displayValue}
              </div>
              <div
                className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 font-semibold`}
              >
                {t('stats.perActivity')}
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className={`grid grid-cols-1 lg:grid-cols-2 ${isMobile ? 'gap-4' : 'gap-3'} mt-4`}>
        <Card
          variant="default"
          size="sm"
          hoverable
          className="card-entrance glass-effect card-3d slide-in-left magnetic-hover gpu-accelerated"
          header={renderSectionHeader(
            'breakdown',
            t('stats.breakdownToday'),
            breakdownOpen,
            setBreakdownOpen
          )}
        >
          {breakdownOpen && (
            <div id="stats-section-breakdown">
              {summary.breakdownToday.length === 0 ? (
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {t('stats.noActivityToday')}
                </div>
              ) : (
                <ul className={isMobile ? 'space-y-2.5' : 'space-y-2'}>
                  {summary.breakdownToday.map((item) => (
                    <li
                      key={item.key}
                      className={`flex items-center justify-between gap-3 border-2 rounded-lg glass-effect ${isMobile ? 'px-3 py-3' : 'px-3 py-2.5'} border-white/20 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl transition-all duration-200 hover:scale-[1.01] hover:shadow-md`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-xl">{item.icon}</div>
                        <div>
                          <div className="text-sm font-bold text-gray-950 dark:text-gray-100">
                            {getActivityLabel(item, lang)}
                          </div>
                          <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {item.amount} {getActivityUnit(item, lang)}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-brand dark:text-brand-light">
                        +{numberFormatter.format(item.points)} {t('list.pointsUnit')}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Card>
        <Card
          variant="default"
          size="sm"
          hoverable
          className="hover-lift transition-smooth"
          header={renderSectionHeader(
            'lastSeven',
            t('stats.lastSeven'),
            lastSevenOpen,
            setLastSevenOpen
          )}
        >
          {lastSevenOpen && (
            <div id="stats-section-lastSeven">
              {summary.lastSevenDays.length === 0 ? (
                <div className="text-sm text-gray-700 dark:text-gray-300">{t('stats.noData')}</div>
              ) : (
                <ul className={isMobile ? 'space-y-2' : 'space-y-2'}>
                  {summary.lastSevenDays.map((day) => (
                    <li
                      key={day.date}
                      className={`flex items-center justify-between gap-2 border-2 rounded-lg glass-effect ${isMobile ? 'px-3 py-2' : 'px-3 py-2'} border-white/20 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl transition-all duration-200 hover:scale-[1.01] hover:shadow-md`}
                    >
                      <div
                        className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-gray-950 dark:text-gray-100 truncate`}
                      >
                        {format(new Date(day.date), isMobile ? 'd MMM EEE' : 'd MMMM EEEE', {
                          locale: dateLocale,
                        })}
                      </div>
                      <div
                        className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-gray-950 dark:text-gray-100 flex-shrink-0`}
                      >
                        {numberFormatter.format(day.points)} /{' '}
                        {numberFormatter.format(summary.targetPoints)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
});
