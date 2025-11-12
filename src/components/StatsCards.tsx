'use client';

import { useMemo, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useI18n } from '@/lib/i18n';
import { useActivitiesSummary, useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { getActivityLabel, getActivityUnit } from '@/lib/activityUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { StatsCardSkeleton } from '@/components/LoadingSkeleton';

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

  useEffect(() => {
    if (isGoalCompleted && !wasCompleted) {
      setWasCompleted(true);
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    } else if (!isGoalCompleted) {
      setWasCompleted(false);
    }
  }, [isGoalCompleted, wasCompleted]);

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2 shadow-card hover-lift transition-smooth ${isGoalCompleted ? 'goal-completed border-green-500 dark:border-green-500' : ''}`}>
          <div className="text-sm text-gray-500">{t('stats.todayPoints')}</div>
          <div className={`text-3xl font-semibold text-brand transition-all duration-300 ${isGoalCompleted ? 'points-value text-green-600 dark:text-green-400' : ''}`}>
            {numberFormatter.format(summary.todayPoints)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {t('stats.target')}: {numberFormatter.format(summary.targetPoints)}
            {isGoalCompleted && (
              <span className="ml-2 text-green-600 dark:text-green-400 font-semibold">✓ {t('stats.goalCompleted')}</span>
            )}
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden relative" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={t('stats.progressLabel', { current: summary.todayPoints, target: summary.targetPoints })}>
            <div
              className={`h-2 rounded transition-all duration-500 ease-out animate-progress ${isGoalCompleted ? 'progress-bar' : 'bg-gradient-to-r from-brand to-brand-dark'}`}
              style={{ width: `${pct}%` }}
            />
            {isGoalCompleted && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-success" />
            )}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2 shadow-card hover-lift transition-smooth">
          <div className="text-sm text-gray-500">{t('stats.totalPoints')}</div>
          <div className="text-3xl font-semibold transition-all duration-300">
            {numberFormatter.format(summary.totalPoints)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{t('stats.totalActivities', { count: summary.totalActivities })}</div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2 shadow-card hover-lift transition-smooth">
          <div className="text-sm text-gray-500">{t('stats.streak')}</div>
          <div className="text-3xl font-semibold text-brand transition-all duration-300">{summary.streakDays}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{t('stats.streakDesc')}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-card hover-lift transition-smooth">
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
                      className="flex items-center justify-between gap-3 border rounded px-3 py-2 border-gray-200 dark:border-gray-800 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:shadow-sm"
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
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-card hover-lift transition-smooth">
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
                      className="flex items-center justify-between gap-3 border rounded px-3 py-2 border-gray-200 dark:border-gray-800 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:shadow-sm"
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
