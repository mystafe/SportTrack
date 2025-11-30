'use client';

import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/lib/settingsStore';
import { PullToRefresh } from '@/components/PullToRefresh';

// Lazy load StatsCards and StatsHighlights for better performance
const StatsCards = lazy(() =>
  import('@/components/StatsCards').then((m) => ({ default: m.StatsCards }))
);
const StatsHighlights = lazy(() =>
  import('@/components/StatsHighlights').then((m) => ({ default: m.StatsHighlights }))
);
import { QuickAdd } from '@/components/QuickAdd';
import { ActivityTemplates } from '@/components/ActivityTemplates';
import { ActivitySuggestions } from '@/components/ActivitySuggestions';
import { DailySummary } from '@/components/DailySummary';
import { ActivityGoals } from '@/components/ActivityGoals';
import { useActivitiesSummary, useActivities } from '@/lib/activityStore';
import { getMotivationalMessage, type MotivationalMessage } from '@/lib/motivationalMessages';
import { startOfDay, isSameDay } from 'date-fns';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Accordion } from '@/components/ui/Accordion';
import { QuickStats } from '@/components/QuickStats';
import { RecentActivities } from '@/components/RecentActivities';
import { DashboardWidgets } from '@/components/DashboardWidgets';
import { QuickActions } from '@/components/QuickActions';
import { StreakVisualization } from '@/components/StreakVisualization';

// Lazy load heavy components for better performance
const DailySummaryLazy = lazy(() =>
  import('@/components/DailySummary').then((m) => ({ default: m.DailySummary }))
);
const ActivityGoalsLazy = lazy(() =>
  import('@/components/ActivityGoals').then((m) => ({ default: m.ActivityGoals }))
);
const QuickAddLazy = lazy(() =>
  import('@/components/QuickAdd').then((m) => ({ default: m.QuickAdd }))
);
const ActivitySuggestionsLazy = lazy(() =>
  import('@/components/ActivitySuggestions').then((m) => ({ default: m.ActivitySuggestions }))
);
const ActivityTemplatesLazy = lazy(() =>
  import('@/components/ActivityTemplates').then((m) => ({ default: m.ActivityTemplates }))
);

export default function HomePage() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const { activities } = useActivities();
  const isMobile = useIsMobile();
  const dailyTarget =
    settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : 10_000;
  const summary = useActivitiesSummary(dailyTarget);
  const hasName = settings?.name;
  const greeting = hasName
    ? t('header.greeting', { name: settings!.name })
    : t('header.overviewTitle');

  // Motivational message based on progress - client-side only to avoid hydration mismatch
  const todayActivities = useMemo(() => {
    const today = startOfDay(new Date());
    return activities.filter((activity) =>
      isSameDay(startOfDay(new Date(activity.performedAt)), today)
    );
  }, [activities]);

  // Memoize progress calculation to prevent unnecessary re-renders
  const progress = useMemo(() => {
    return dailyTarget > 0
      ? Math.min(100, Math.round((summary.todayPoints / dailyTarget) * 100))
      : 0;
  }, [dailyTarget, summary.todayPoints]);

  const [mounted, setMounted] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState<MotivationalMessage | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize todayActivities length to prevent unnecessary re-renders
  const todayActivitiesLength = useMemo(() => todayActivities.length, [todayActivities]);

  useEffect(() => {
    if (mounted) {
      const message = getMotivationalMessage(
        progress,
        todayActivitiesLength > 0,
        settings?.mood ?? null
      );
      setMotivationalMessage(message);
    }
  }, [mounted, progress, todayActivitiesLength, settings?.mood]);

  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    if (motivationalMessage && mounted) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000); // Show for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [motivationalMessage, mounted]);

  const handleRefresh = async () => {
    window.location.reload();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div
        className="space-y-4 sm:space-y-6 w-full"
        role="main"
        aria-label={t('header.overviewTitle')}
      >
        {/* Hero Section with Gradient Background */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-brand via-brand-dark to-purple-600 dark:from-brand dark:via-brand-dark dark:to-purple-700 p-6 sm:p-8 shadow-2xl hero-entrance">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px] animate-pulse-slow"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 hero-title-animation">
                  {greeting}
                </h1>
                <p className="text-base sm:text-lg text-white/90 font-medium leading-relaxed hero-subtitle-animation">
                  {t('header.overviewSubtitle')}
                </p>
              </div>
              {!isMobile && (
                <Link
                  href="/add"
                  className="px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30 btn-enhanced ripple-effect scale-on-interact mt-1"
                  aria-label={t('actions.addActivity')}
                  data-tour-id="add-activity"
                >
                  {t('actions.addActivity')}
                </Link>
              )}
            </div>

            {/* Progress Bar with Smooth Animation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-white">
                <span className="text-sm sm:text-base font-semibold">
                  {lang === 'tr' ? 'Günlük Hedef' : 'Daily Goal'}
                </span>
                <span className="text-sm sm:text-base font-bold">
                  {summary.todayPoints.toLocaleString()} / {dailyTarget.toLocaleString()}{' '}
                  {lang === 'tr' ? 'puan' : 'points'}
                </span>
              </div>
              <div className="relative h-4 sm:h-5 bg-white/20 dark:bg-white/10 rounded-full overflow-hidden shadow-inner">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-white via-white/90 to-white rounded-full progress-bar-fill shadow-lg"
                  style={{
                    width: `${progress}%`,
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  {/* Progress percentage text - inside progress fill */}
                  {progress > 15 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs sm:text-sm font-bold text-gray-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
                        {progress}%
                      </span>
                    </div>
                  )}
                </div>
                {/* Progress percentage text - outside progress fill (for low progress) */}
                {progress <= 15 && progress > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                      {progress}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Message - Enhanced Design */}
        {motivationalMessage && showMessage && (
          <div
            className={`motivational-card glow-border rounded-xl border-2 border-brand/40 dark:border-brand/50 p-5 sm:p-6 shadow-2xl ${isMobile ? 'motivational-entrance slide-in-bottom-mobile' : 'animate-slide-in-right'} transition-all duration-500 overflow-hidden relative ${showMessage ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
          >
            {/* Decorative elements */}
            <div className="pattern-overlay"></div>
            <div className="quote-shimmer"></div>

            <div className="flex items-center gap-4 relative z-50">
              <span
                className={`text-3xl sm:text-4xl ${isMobile ? 'emoji-celebrate' : 'emoji-bounce'} flex-shrink-0`}
              >
                {motivationalMessage.emoji}
              </span>
              <p
                className="text-sm sm:text-base md:text-lg font-bold text-gray-950 dark:text-white flex-1 leading-relaxed"
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}
              >
                {lang === 'tr' ? motivationalMessage.tr : motivationalMessage.en}
              </p>
            </div>

            {/* Decorative sparkles */}
            <div className="sparkle sparkle-enhanced"></div>
            <div className="sparkle sparkle-enhanced"></div>
          </div>
        )}

        {/* Quick Actions - Always Visible */}
        <Accordion
          title={lang === 'tr' ? 'Hızlı Erişim' : 'Quick Access'}
          icon="🚀"
          defaultOpen={true}
          variant="compact"
          className="card-entrance"
        >
          <QuickActions />
        </Accordion>

        {/* Dashboard Widgets - Always Visible */}
        <Accordion
          title={lang === 'tr' ? 'Dashboard Widgets' : 'Dashboard Widgets'}
          icon="📱"
          defaultOpen={true}
          variant="compact"
          className="card-entrance"
        >
          <DashboardWidgets />
        </Accordion>

        {/* Quick Stats - Always Visible */}
        <Accordion
          title={lang === 'tr' ? 'Hızlı İstatistikler' : 'Quick Stats'}
          icon="⚡"
          defaultOpen={true}
          variant="compact"
          className="card-entrance"
        >
          <QuickStats />
        </Accordion>

        {/* Streak Visualization - Always Visible */}
        <StreakVisualization />

        {/* Stats Cards and Highlights Side by Side - Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="lg:col-span-1">
            <Accordion
              title={lang === 'tr' ? 'Detaylı İstatistikler' : 'Detailed Statistics'}
              icon="📊"
              defaultOpen={true}
              className="card-entrance"
            >
              <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
                <StatsCards />
              </Suspense>
            </Accordion>
          </div>
          <div className="lg:col-span-1">
            <Accordion
              title={lang === 'tr' ? 'Öne Çıkanlar' : 'Highlights'}
              icon="⭐"
              defaultOpen={true}
              className="card-entrance"
            >
              <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
                <StatsHighlights />
              </Suspense>
            </Accordion>
          </div>
        </div>

        {/* Recent Activities - Accordion */}
        <Accordion
          title={lang === 'tr' ? 'Son Aktiviteler' : 'Recent Activities'}
          icon="🕐"
          defaultOpen={true}
          variant="compact"
          className="card-entrance"
        >
          <RecentActivities />
        </Accordion>

        {/* Daily Summary - Accordion */}
        <Accordion
          title={lang === 'tr' ? 'Günlük Özet' : 'Daily Summary'}
          icon="📅"
          defaultOpen={true}
          className="card-entrance"
        >
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <DailySummaryLazy />
          </Suspense>
        </Accordion>

        {/* Activity Goals - Accordion */}
        <Accordion
          title={lang === 'tr' ? 'Aktivite Hedefleri' : 'Activity Goals'}
          icon="🎯"
          defaultOpen={true}
          className="card-entrance"
        >
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <ActivityGoalsLazy />
          </Suspense>
        </Accordion>

        {/* Quick Actions Section - Accordion */}
        <div className="space-y-4 sm:space-y-5">
          <Accordion
            title={lang === 'tr' ? 'Hızlı Ekleme' : 'Quick Add'}
            icon="⚡"
            defaultOpen={true}
            variant="compact"
            className="card-entrance"
          >
            <Suspense fallback={<div className="h-24 skeleton rounded-lg" />}>
              <QuickAddLazy />
            </Suspense>
          </Accordion>

          <Accordion
            title={lang === 'tr' ? 'Aktivite Önerileri' : 'Activity Suggestions'}
            icon="💡"
            defaultOpen={true}
            variant="compact"
            className="card-entrance"
          >
            <Suspense fallback={<div className="h-24 skeleton rounded-lg" />}>
              <ActivitySuggestionsLazy />
            </Suspense>
          </Accordion>

          <Accordion
            title={lang === 'tr' ? 'Aktivite Şablonları' : 'Activity Templates'}
            icon="📋"
            defaultOpen={true}
            variant="compact"
            className="card-entrance"
          >
            <Suspense fallback={<div className="h-24 skeleton rounded-lg" />}>
              <ActivityTemplatesLazy />
            </Suspense>
          </Accordion>
        </div>
      </div>
    </PullToRefresh>
  );
}
