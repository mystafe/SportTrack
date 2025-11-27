'use client';

import { useMemo, memo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useActivityDefinitions } from '@/lib/activityStore';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export const RecentActivities = memo(function RecentActivities() {
  const { lang } = useI18n();
  const { activities, hydrated } = useActivities();
  const definitions = useActivityDefinitions();
  const dateLocale = lang === 'tr' ? tr : enUS;
  const isMobile = useIsMobile();

  const recentActivities = useMemo(() => {
    if (!hydrated || activities.length === 0) return [];
    return activities
      .slice(0, 5)
      .map((activity) => {
        if (!activity?.performedAt) return null;
        try {
          const definition = definitions.find((d) => d.key === activity.activityKey);
          const activityDate = parseISO(activity.performedAt);
          let dateLabel: string;

          if (isToday(activityDate)) {
            dateLabel = lang === 'tr' ? 'Bugün' : 'Today';
          } else if (isYesterday(activityDate)) {
            dateLabel = lang === 'tr' ? 'Dün' : 'Yesterday';
          } else {
            dateLabel = format(activityDate, 'd MMM', { locale: dateLocale });
          }

          return {
            ...activity,
            definition,
            dateLabel,
            timeLabel: format(activityDate, 'HH:mm', { locale: dateLocale }),
          };
        } catch (error) {
          console.warn('Failed to parse activity date:', error, activity);
          return null;
        }
      })
      .filter((activity): activity is NonNullable<typeof activity> => activity !== null);
  }, [activities, hydrated, definitions, lang, dateLocale]);

  if (!hydrated || recentActivities.length === 0) {
    return null;
  }

  const numberFormatter = new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US');

  return (
    <div className={isMobile ? 'space-y-3' : 'space-y-2'}>
      {recentActivities.map((activity, index) => (
        <Link
          key={activity.id}
          href="/activities"
          className={`block ${isMobile ? 'p-4 min-h-[64px]' : 'p-3'} rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand/50 dark:hover:border-brand/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group stagger-item ${isMobile ? 'touch-feedback active:scale-[0.98]' : ''}`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-xl sm:text-2xl flex-shrink-0">
                {activity.definition?.icon || activity.icon || '🏃'}
              </span>
              <div className="flex-1 min-w-0">
                <div
                  className={`font-semibold ${isMobile ? 'text-base' : 'text-sm'} text-gray-950 dark:text-white truncate`}
                >
                  {activity.definition
                    ? lang === 'tr'
                      ? activity.definition.label
                      : activity.definition.labelEn || activity.definition.label
                    : activity.label}
                </div>
                <div
                  className={`${isMobile ? 'text-sm' : 'text-xs'} text-gray-600 dark:text-gray-400 mt-0.5`}
                >
                  {activity.dateLabel} {activity.timeLabel}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="text-right">
                <div className="text-sm font-bold text-brand">
                  {numberFormatter.format(activity.points)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {numberFormatter.format(activity.amount)}{' '}
                  {activity.definition
                    ? lang === 'tr'
                      ? activity.definition.unit
                      : activity.definition.unitEn || activity.definition.unit
                    : activity.unit}
                </div>
              </div>
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-brand transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Link>
      ))}
      <Link
        href="/activities"
        className="block text-center py-2 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
      >
        {lang === 'tr' ? 'Tümünü Gör →' : 'View All →'}
      </Link>
    </div>
  );
});
