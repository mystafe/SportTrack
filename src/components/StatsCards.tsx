'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useI18n } from '@/lib/i18n';
import { useActivitiesSummary, useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { getActivityLabel, getActivityUnit } from '@/lib/activityUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { StatsCardSkeleton } from '@/components/LoadingSkeleton';
import { notificationService } from '@/lib/notificationService';

export function StatsCards() {
  const { t, lang } = useI18n();
  const { settings, hydrated: settingsHydrated } = useSettings();
  const { hydrated: activitiesHydrated } = useActivities();
  const dailyTarget = settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : 10_000;
  const summary = useActivitiesSummary(dailyTarget);
  const isLoading = !settingsHydrated || !activitiesHydrated;
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );
  const dateLocale = lang === 'tr' ? tr : enUS;
  const isMobile = useIsMobile();
  const [activeMobileSection, setActiveMobileSection] = useState<'breakdown' | 'lastSeven'>('breakdown');

  const renderSectionHeader = (
    id: 'breakdown' | 'lastSeven',
    title: string
  ) => {
    if (!isMobile) {
      return <div className="text-sm text-gray-500 mb-3">{title}</div>;
    }
    const isActive = activeMobileSection === id;
    return (
      <button
        type="button"
        className="flex w-full items-center justify-between text-sm text-gray-500 mb-3 transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
        onClick={() => setActiveMobileSection(id)}
        aria-expanded={isActive}
        aria-controls={`stats-section-${id}`}
        aria-label={t('stats.sectionToggle', { section: title })}
      >
        <span>{title}</span>
        <span className="ml-2 text-base transition-transform duration-300 ease-in-out" aria-hidden>
          {isActive ? '\u2212' : '+'}
        </span>
      </button>
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

  useEffect(() => {
    if (isGoalCompleted && !wasCompleted) {
      setWasCompleted(true);
      setShowConfetti(true);
      setShowGoalAnimation(true);
      
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
    }
  }, [isGoalCompleted, wasCompleted, summary.todayPoints, lang]);

  return (
    <div className="space-y-6">
      {showConfetti && (
        <>
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                background: ['#10b981', '#34d399', '#059669', '#6ee7b7', '#a7f3d0'][Math.floor(Math.random() * 5)],
                width: `${Math.random() * 8 + 6}px`,
                height: `${Math.random() * 8 + 6}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </>
      )}
      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'} ${isMobile ? 'gap-2.5' : 'gap-4'}`}>
        <div className={`stagger-item card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-900/80 backdrop-blur-sm ${isMobile ? 'p-3 space-y-1.5' : 'p-4 space-y-2'} shadow-card magnetic-hover tilt-3d gpu-accelerated ${showGoalAnimation ? 'goal-completed border-green-500 dark:border-green-400/50 ring-2 ring-green-500/20 dark:ring-green-400/20 pulse-glow-mobile' : ''}`}>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700 dark:text-gray-300`}>{t('stats.todayPoints')}</div>
          <div className={`${isMobile ? 'text-xl' : 'text-3xl'} font-semibold text-brand dark:text-brand-light transition-all duration-300 ${showGoalAnimation ? 'points-value text-green-600 dark:text-green-400 number-count-mobile' : ''} ${isMobile ? 'number-count-mobile' : ''}`}>
            {numberFormatter.format(summary.todayPoints)}
          </div>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 font-medium`}>
            {t('stats.target')}: {numberFormatter.format(summary.targetPoints)}
            {isGoalCompleted && (
              <span className="ml-1 text-green-600 dark:text-green-400 font-semibold">✓ {t('stats.goalCompleted')}</span>
            )}
          </div>
          <div className={`${isMobile ? 'h-2.5' : 'h-2'} bg-gray-200 dark:bg-gray-800 rounded overflow-hidden relative`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={t('stats.progressLabel', { current: summary.todayPoints, target: summary.targetPoints })}>
            <div
              className={`h-full rounded transition-all duration-500 ease-out animate-progress ${isMobile ? 'progress-fill-mobile' : ''} ${showGoalAnimation ? 'progress-bar' : 'bg-gradient-to-r from-brand to-brand-dark'}`}
              style={{ width: `${pct}%` }}
            />
            {showGoalAnimation && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-success" />
            )}
          </div>
        </div>
        <div className={`stagger-item card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-900/80 backdrop-blur-sm ${isMobile ? 'p-3 space-y-1.5' : 'p-4 space-y-2'} shadow-card magnetic-hover tilt-3d gpu-accelerated`}>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700 dark:text-gray-300`}>{t('stats.totalPoints')}</div>
          <div className={`${isMobile ? 'text-xl' : 'text-3xl'} font-semibold transition-all duration-300 text-gray-900 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : ''}`}>
            {numberFormatter.format(summary.totalPoints)}
          </div>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 font-medium`}>{t('stats.totalActivities', { count: summary.totalActivities })}</div>
        </div>
        <div className={`stagger-item card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-900/80 backdrop-blur-sm ${isMobile ? 'p-3 space-y-1.5' : 'p-4 space-y-2'} shadow-card magnetic-hover tilt-3d gpu-accelerated`}>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700 dark:text-gray-300`}>{t('stats.streak')}</div>
          <div className={`${isMobile ? 'text-xl' : 'text-3xl'} font-semibold text-brand dark:text-brand-light transition-all duration-300 ${isMobile ? 'number-count-mobile' : ''}`}>{summary.streakDays}</div>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 font-medium`}>{t('stats.streakDesc')}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-entrance slide-in-left rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-900/80 backdrop-blur-sm p-4 shadow-card magnetic-hover gpu-accelerated">
          {renderSectionHeader('breakdown', t('stats.breakdownToday'))}
          {(!isMobile || activeMobileSection === 'breakdown') && (
            <div id="stats-section-breakdown">
              {summary.breakdownToday.length === 0 ? (
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('stats.noActivityToday')}</div>
              ) : (
                <ul className="space-y-2">
                  {summary.breakdownToday.map((item) => (
                    <li
                      key={item.key}
                      className="flex items-center justify-between gap-3 border rounded-lg px-3 py-2 border-gray-200 dark:border-gray-700/50 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-sm backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-lg">{item.icon}</div>
                        <div>
                          <div className="text-sm font-medium">{getActivityLabel(item, lang)}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {item.amount} {getActivityUnit(item, lang)}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-brand">
                        +{numberFormatter.format(item.points)} {t('list.pointsUnit')}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-900/80 backdrop-blur-sm p-4 shadow-card hover-lift transition-smooth">
          {renderSectionHeader('lastSeven', t('stats.lastSeven'))}
          {(!isMobile || activeMobileSection === 'lastSeven') && (
            <div id="stats-section-lastSeven">
              {summary.lastSevenDays.length === 0 ? (
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('stats.noData')}</div>
              ) : (
                <ul className="space-y-2">
                  {summary.lastSevenDays.map((day) => (
                    <li
                      key={day.date}
                      className="flex items-center justify-between gap-3 border rounded-lg px-3 py-2 border-gray-200 dark:border-gray-700/50 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-sm backdrop-blur-sm"
                    >
                      <div className="text-sm font-medium">
                        {format(new Date(day.date), 'd MMMM EEEE', { locale: dateLocale })}
                      </div>
                      <div className="text-sm font-semibold">
                        {numberFormatter.format(day.points)} / {numberFormatter.format(summary.targetPoints)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
