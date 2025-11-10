'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useI18n } from '@/lib/i18n';
import { useActivitiesSummary } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { getActivityLabel, getActivityUnit } from '@/lib/activityUtils';

export function StatsCards() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const dailyTarget = settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : 10_000;
  const summary = useActivitiesSummary(dailyTarget);
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );
  const dateLocale = lang === 'tr' ? tr : enUS;
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileSection, setActiveMobileSection] = useState<'breakdown' | 'lastSeven'>('breakdown');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const query = window.matchMedia('(max-width: 767px)');
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
      if (!event.matches) {
        setActiveMobileSection('breakdown');
      }
    };
    setIsMobile(query.matches);
    if (!query.matches) {
      setActiveMobileSection('breakdown');
    }

    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', handleChange);
      return () => query.removeEventListener('change', handleChange);
    }

    query.addListener(handleChange);
    return () => query.removeListener(handleChange);
  }, []);

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
        className="flex w-full items-center justify-between text-sm text-gray-500 mb-3"
        onClick={() => setActiveMobileSection(id)}
        aria-expanded={isActive}
        aria-controls={`stats-section-${id}`}
        aria-label={t('stats.sectionToggle', { section: title })}
      >
        <span>{title}</span>
        <span className="ml-2 text-base transition-transform duration-200" aria-hidden>
          {isActive ? '\u2212' : '+'}
        </span>
      </button>
    );
  };

  const pct =
    summary.targetPoints > 0
      ? Math.min(100, Math.round((summary.todayPoints / summary.targetPoints) * 100))
      : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2 shadow-card">
          <div className="text-sm text-gray-500">{t('stats.todayPoints')}</div>
          <div className="text-3xl font-semibold text-brand">
            {numberFormatter.format(summary.todayPoints)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {t('stats.target')}: {numberFormatter.format(summary.targetPoints)}
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-brand to-brand-dark rounded"
              style={{ width: `${pct}%` }}
              aria-hidden
            />
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2 shadow-card">
          <div className="text-sm text-gray-500">{t('stats.totalPoints')}</div>
          <div className="text-3xl font-semibold">
            {numberFormatter.format(summary.totalPoints)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{t('stats.totalActivities', { count: summary.totalActivities })}</div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2 shadow-card">
          <div className="text-sm text-gray-500">{t('stats.streak')}</div>
          <div className="text-3xl font-semibold">{summary.streakDays}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{t('stats.streakDesc')}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-card">
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
                      className="flex items-center justify-between gap-3 border rounded px-3 py-2 border-gray-200 dark:border-gray-800"
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
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-card">
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
                      className="flex items-center justify-between gap-3 border rounded px-3 py-2 border-gray-200 dark:border-gray-800"
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
