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
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [breakdownOpen, setBreakdownOpen] = useState(true);
  const [lastSevenOpen, setLastSevenOpen] = useState(true);

  const renderSectionHeader = (
    id: 'breakdown' | 'lastSeven',
    title: string,
    isOpen: boolean,
    setIsOpen: (open: boolean) => void
  ) => {
    if (!isMobile) {
      return (
        <button
          type="button"
          className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 dark:text-white mb-3 transition-all duration-200 hover:text-brand"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={`stats-section-${id}`}
        >
          <span className="font-bold">{title}</span>
          <span className="ml-2 text-base transition-transform duration-300 ease-in-out" aria-hidden style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            {isOpen ? '\u2212' : '+'}
          </span>
        </button>
      );
    }
    const isActive = activeMobileSection === id;
    return (
      <button
        type="button"
        className="flex w-full items-center justify-between text-sm text-gray-800 dark:text-gray-200 font-semibold mb-3 transition-all duration-200 hover:text-gray-950 dark:hover:text-white"
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

  const renderOverviewHeader = () => {
    return (
      <button
        type="button"
        className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 dark:text-white mb-3 transition-all duration-200 hover:text-brand"
        onClick={() => setOverviewOpen(!overviewOpen)}
        aria-expanded={overviewOpen}
        aria-controls="stats-overview"
      >
        <span className="font-bold">{t('stats.overview') || 'Overview'}</span>
        <span className="ml-2 text-base transition-transform duration-300 ease-in-out" aria-hidden style={{ transform: overviewOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>
    );
  };

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
      
      {/* Overview Section */}
      <div className="card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 shadow-md hover:shadow-xl transition-shadow duration-300">
        {renderOverviewHeader()}
        {overviewOpen && (
          <div id="stats-overview" className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'} ${isMobile ? 'gap-2.5' : 'gap-4'}`}>
        <div className={`stagger-item card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'p-3 space-y-1.5' : 'p-4 space-y-2'} shadow-md hover:shadow-xl transition-shadow duration-300 magnetic-hover tilt-3d gpu-accelerated ${showGoalAnimation ? 'goal-completed border-emerald-500 dark:border-emerald-400/50 ring-2 ring-emerald-500/20 dark:ring-emerald-400/20 pulse-glow-mobile' : ''}`}>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 dark:text-gray-200`}>{t('stats.todayPoints')}</div>
          <div className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-brand dark:text-brand-light transition-all duration-300 ${showGoalAnimation ? 'points-value text-emerald-600 dark:text-emerald-400 number-count-mobile' : ''} ${isMobile ? 'number-count-mobile' : ''}`}>
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
        <div className={`stagger-item card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'p-3 space-y-1.5' : 'p-4 space-y-2'} shadow-md hover:shadow-xl transition-shadow duration-300 magnetic-hover tilt-3d gpu-accelerated`}>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 dark:text-gray-200`}>{t('stats.totalPoints')}</div>
          <div className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold transition-all duration-300 text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : ''}`}>
            {numberFormatter.format(summary.totalPoints)}
          </div>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 font-semibold`}>{t('stats.totalActivities', { count: summary.totalActivities })}</div>
        </div>
        <div className={`stagger-item card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'p-3 space-y-1.5' : 'p-4 space-y-2'} shadow-md hover:shadow-xl transition-shadow duration-300 magnetic-hover tilt-3d gpu-accelerated`}>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 dark:text-gray-200`}>{t('stats.streak')}</div>
          <div className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-brand dark:text-brand-light transition-all duration-300 ${isMobile ? 'number-count-mobile' : ''}`}>{summary.streakDays}</div>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 font-semibold`}>{t('stats.streakDesc')}</div>
        </div>
        <div className={`stagger-item card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'p-3 space-y-1.5' : 'p-4 space-y-2'} shadow-md hover:shadow-xl transition-shadow duration-300 magnetic-hover tilt-3d gpu-accelerated`}>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 dark:text-gray-200`}>{t('stats.averageDaily') || 'Average Daily'}</div>
          <div className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold transition-all duration-300 text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : ''}`}>
            {numberFormatter.format(Math.round(summary.totalPoints / Math.max(1, summary.totalActivities)))}
          </div>
          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 font-semibold`}>{t('stats.perActivity') || 'Per Activity'}</div>
        </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-entrance slide-in-left rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 shadow-md hover:shadow-xl transition-shadow duration-300 magnetic-hover gpu-accelerated">
          {renderSectionHeader('breakdown', t('stats.breakdownToday'), breakdownOpen, setBreakdownOpen)}
          {(isMobile ? activeMobileSection === 'breakdown' : breakdownOpen) && (
            <div id="stats-section-breakdown">
              {summary.breakdownToday.length === 0 ? (
                <div className="text-sm text-gray-700 dark:text-gray-300">{t('stats.noActivityToday')}</div>
              ) : (
                <ul className="space-y-2">
                  {summary.breakdownToday.map((item) => (
                    <li
                      key={item.key}
                      className="flex items-center justify-between gap-3 border-2 rounded-lg px-3 py-2.5 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 transition-all duration-200 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-700 hover:shadow-md "
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-xl">{item.icon}</div>
                        <div>
                          <div className="text-sm font-bold text-gray-950 dark:text-gray-100">{getActivityLabel(item, lang)}</div>
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
        </div>
        <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 shadow-md hover:shadow-xl transition-shadow duration-300 hover-lift transition-smooth">
          {renderSectionHeader('lastSeven', t('stats.lastSeven'), lastSevenOpen, setLastSevenOpen)}
          {(isMobile ? activeMobileSection === 'lastSeven' : lastSevenOpen) && (
            <div id="stats-section-lastSeven">
              {summary.lastSevenDays.length === 0 ? (
                <div className="text-sm text-gray-700 dark:text-gray-300">{t('stats.noData')}</div>
              ) : (
                <ul className="space-y-2">
                  {summary.lastSevenDays.map((day) => (
                    <li
                      key={day.date}
                      className="flex items-center justify-between gap-3 border-2 rounded-lg px-3 py-2.5 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 transition-all duration-200 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-700 hover:shadow-md "
                    >
                      <div className="text-sm font-bold text-gray-950 dark:text-gray-100">
                        {format(new Date(day.date), 'd MMMM EEEE', { locale: dateLocale })}
                      </div>
                      <div className="text-sm font-bold text-gray-950 dark:text-gray-100">
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
