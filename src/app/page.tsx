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
import { getRandomQuote } from '@/lib/quotes';
import { getMotivationalMessage } from '@/lib/motivationalMessages';
import { startOfDay, isSameDay } from 'date-fns';

export default function HomePage() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const { activities } = useActivities();
  const dailyTarget = settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : 10_000;
  const summary = useActivitiesSummary(dailyTarget);
  const hasName = settings?.name;
  const greeting = hasName
    ? t('header.greeting', { name: settings!.name })
    : t('header.overviewTitle');
  
  // Random quote on mount
  const [quote] = useState(() => getRandomQuote());
  
  // Motivational message based on progress
  const todayActivities = useMemo(() => {
    const today = startOfDay(new Date());
    return activities.filter(activity => 
      isSameDay(startOfDay(new Date(activity.performedAt)), today)
    );
  }, [activities]);
  
  const progress = dailyTarget > 0 
    ? Math.min(100, Math.round((summary.todayPoints / dailyTarget) * 100))
    : 0;
  
  const motivationalMessage = useMemo(() => 
    getMotivationalMessage(progress, todayActivities.length > 0, settings?.mood ?? null),
    [progress, todayActivities.length, settings?.mood]
  );
  
  const [showMessage, setShowMessage] = useState(true);
  
  useEffect(() => {
    if (motivationalMessage) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000); // Show for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [motivationalMessage]);
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">{greeting}</h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {t('header.overviewSubtitle')}
          </p>
        </div>
        <Link
          href="/add"
          className="px-3 py-2 rounded bg-brand text-white hover:bg-brand-dark text-xs sm:text-sm shadow self-start sm:self-auto transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
          aria-label={t('actions.addActivity')}
        >
          {t('actions.addActivity')}
        </Link>
      </div>
      
      {/* Motivational Quote */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gradient-to-r from-brand/10 to-brand/5 dark:from-brand/20 dark:to-brand/10 p-4 shadow-card animate-fade-in">
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 italic text-center">
          "{lang === 'tr' ? quote.tr : quote.en}"
        </p>
      </div>
      
      {/* Motivational Message */}
      {motivationalMessage && showMessage && (
        <div className={`rounded-lg border-2 border-brand/30 dark:border-brand/50 bg-brand/5 dark:bg-brand/10 p-4 shadow-lg animate-slide-in-right transition-all duration-500 ${showMessage ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{motivationalMessage.emoji}</span>
            <p className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-100 flex-1">
              {lang === 'tr' ? motivationalMessage.tr : motivationalMessage.en}
            </p>
          </div>
        </div>
      )}
      
      <StatsCards />
      <QuickAdd />
      <StatsHighlights />
      <ActivityTemplates />
    </div>
  );
}
