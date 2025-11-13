'use client';

import { useState, useEffect, useMemo } from 'react';
import { StatsCards } from '@/components/StatsCards';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/lib/settingsStore';
import { StatsHighlights } from '@/components/StatsHighlights';
import { QuickAdd } from '@/components/QuickAdd';
import { ActivityTemplates } from '@/components/ActivityTemplates';
import { useActivitiesSummary, useActivities } from '@/lib/activityStore';
import { getMotivationalMessage, type MotivationalMessage } from '@/lib/motivationalMessages';
import { startOfDay, isSameDay } from 'date-fns';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export default function HomePage() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const { activities } = useActivities();
  const isMobile = useIsMobile();
  const dailyTarget = settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : 10_000;
  const summary = useActivitiesSummary(dailyTarget);
  const hasName = settings?.name;
  const greeting = hasName
    ? t('header.greeting', { name: settings!.name })
    : t('header.overviewTitle');
  
  
  // Motivational message based on progress - client-side only to avoid hydration mismatch
  const todayActivities = useMemo(() => {
    const today = startOfDay(new Date());
    return activities.filter(activity => 
      isSameDay(startOfDay(new Date(activity.performedAt)), today)
    );
  }, [activities]);
  
  const progress = dailyTarget > 0 
    ? Math.min(100, Math.round((summary.todayPoints / dailyTarget) * 100))
    : 0;
  
  const [motivationalMessage, setMotivationalMessage] = useState<MotivationalMessage | null>(null);
  
  useEffect(() => {
    if (mounted) {
      const message = getMotivationalMessage(progress, todayActivities.length > 0, settings?.mood ?? null);
      setMotivationalMessage(message);
    }
  }, [mounted, progress, todayActivities.length, settings?.mood]);
  
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
  
  return (
    <div className="space-y-4 sm:space-y-6 page-transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className={isMobile ? 'title-entrance' : ''}>
          <h1 className={`text-xl sm:text-2xl font-bold ${isMobile ? 'text-brand dark:text-brand-light' : 'text-gray-900 dark:text-white'}`}>{greeting}</h1>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 font-medium">
            {t('header.overviewSubtitle')}
          </p>
        </div>
        <Link
          href="/add"
          className={`px-3 py-2 rounded bg-brand text-white hover:bg-brand-dark text-xs sm:text-sm shadow self-start sm:self-auto btn-enhanced ${isMobile ? 'touch-feedback mobile-press bounce-in-mobile' : 'ripple-effect'} scale-on-interact`}
          aria-label={t('actions.addActivity')}
          data-tour-id="add-activity"
        >
          {t('actions.addActivity')}
        </Link>
      </div>
      
      {/* Motivational Message - Enhanced Design */}
      {motivationalMessage && showMessage && (
        <div className={`motivational-card glow-border rounded-xl border-2 border-brand/40 dark:border-brand/50 p-5 sm:p-6 shadow-2xl ${isMobile ? 'motivational-entrance slide-in-bottom-mobile' : 'animate-slide-in-right'} transition-all duration-500 overflow-hidden relative ${showMessage ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
          {/* Decorative elements */}
          <div className="pattern-overlay"></div>
          <div className="quote-shimmer"></div>
          
          <div className="flex items-center gap-4 relative z-50">
            <span className={`text-3xl sm:text-4xl ${isMobile ? 'emoji-celebrate' : 'emoji-bounce'} flex-shrink-0`}>{motivationalMessage.emoji}</span>
            <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white flex-1 leading-relaxed" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>
              {lang === 'tr' ? motivationalMessage.tr : motivationalMessage.en}
            </p>
          </div>
          
          {/* Decorative sparkles */}
          <div className="sparkle sparkle-enhanced"></div>
          <div className="sparkle sparkle-enhanced"></div>
        </div>
      )}
      
      {/* Stats Cards and Highlights Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="lg:col-span-1">
          <StatsCards />
        </div>
        <div className="lg:col-span-1">
          <StatsHighlights />
        </div>
      </div>
      
      <QuickAdd />
      <ActivityTemplates />
    </div>
  );
}
