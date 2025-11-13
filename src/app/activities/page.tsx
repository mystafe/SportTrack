'use client';

import { ActivityForm } from '@/components/ActivityForm';
import { ActivityFilters, useFilteredActivities } from '@/components/ActivityFilters';
import { ManageActivitiesDialog } from '@/components/ManageActivitiesDialog';
import type { FilterState } from '@/components/ActivityFilters';
import { useMemo, useState } from 'react';
import { format, startOfDay } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useI18n } from '@/lib/i18n';
import { ActivityRecord, useActivities } from '@/lib/activityStore';
import { getActivityLabel, getActivityUnit } from '@/lib/activityUtils';
import { useToaster } from '@/components/Toaster';
import { ActivityListSkeleton } from '@/components/LoadingSkeleton';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import Link from 'next/link';

function formatDuration(seconds: number, lang: 'tr' | 'en'): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

export default function ActivitiesPage() {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl sm:text-3xl font-bold flex items-center gap-2 ${isMobile ? 'title-entrance' : ''}`}>
          <span className={`text-2xl sm:text-3xl ${isMobile ? 'emoji-celebrate' : 'emoji-bounce'}`}>📝</span>
          <span className="text-gray-950 dark:text-white">{t('nav.activities')}</span>
        </h1>
        <div className="flex items-center gap-2">
          <Link
            href="/add"
            className={`px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand text-xs sm:text-sm font-semibold shadow-md hover:shadow-xl transition-all duration-300 ${isMobile ? 'touch-feedback mobile-press bounce-in-mobile' : 'btn-enhanced scale-on-interact'} active:scale-95`}
            aria-label={t('actions.addActivity')}
          >
            {t('actions.addActivity')}
          </Link>
          <ManageActivitiesDialog />
        </div>
      </div>
      <ActivitiesClient />
    </div>
  );
}

function ActivitiesClient() {
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const { activities, deleteActivity, hydrated } = useActivities();
  const { showToast } = useToaster();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; activity: ActivityRecord } | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'all',
    activityType: 'all',
    category: 'all',
    searchQuery: '',
    sortBy: 'date-desc'
  });
  const filteredActivities = useFilteredActivities(filters);

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );
  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
    [lang]
  );
  const dateLocale = lang === 'tr' ? tr : enUS;
  const todayKey = useMemo(() => startOfDay(new Date()).toISOString(), []);

  const editing = useMemo(
    () => (editingId ? activities.find((activity) => activity.id === editingId) ?? null : null),
    [activities, editingId]
  );

  const groups = useMemo(() => {
    const grouped = new Map<string, ActivityRecord[]>();
    for (const activity of filteredActivities) {
      const key = startOfDay(new Date(activity.performedAt)).toISOString();
      grouped.set(key, [...(grouped.get(key) ?? []), activity]);
    }
    return Array.from(grouped.entries())
      .map(([day, acts]) => ({
        day,
        acts: acts.sort(
          (a, b) => +new Date(b.performedAt) - +new Date(a.performedAt)
        )
      }))
      .sort((a, b) => +new Date(b.day) - +new Date(a.day));
  }, [filteredActivities]);

  const filteredStats = useMemo(() => {
    const totalPoints = filteredActivities.reduce((sum, a) => sum + a.points, 0);
    const totalCount = filteredActivities.length;
    return { totalPoints, totalCount };
  }, [filteredActivities]);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Compact Filters */}
      <ActivityFilters filters={filters} onFiltersChange={setFilters} />

      {/* Compact Filtered Stats Summary */}
      {(filters.dateRange !== 'all' || filters.activityType !== 'all' || filters.category !== 'all' || filters.searchQuery) && (
        <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 px-3 py-2 shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {t('filters.results')}
            </span>
            <div className="text-gray-700 dark:text-gray-200 font-semibold">
              {filteredStats.totalCount} {t('filters.activities')} · {numberFormatter.format(filteredStats.totalPoints)} {t('list.pointsUnit')}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm font-medium px-1">
          <span>{t('list.records')}</span>
          {filteredActivities.length !== activities.length && (
            <span className="text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 font-medium">
              {filteredActivities.length} / {activities.length}
            </span>
          )}
        </div>
        <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          {filteredActivities.length === 0 ? (
            <div className="p-6 text-center text-xs sm:text-sm text-gray-700 dark:text-gray-200 font-medium">
              {t('filters.noResults')}
            </div>
          ) : editing ? (
            <div className="border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-gray-800 dark:text-gray-200">
                <span>{t('list.editingTitle')}</span>
                <button
                  className="text-xs underline-offset-2 hover:underline"
                  onClick={() => setEditingId(null)}
                >
                  {t('form.cancel')}
                </button>
              </div>
              <div className="px-3 pb-3">
                <ActivityForm
                  initial={{
                    id: editing.id,
                    activityKey: editing.activityKey,
                    label: editing.label,
                    labelEn: editing.labelEn,
                    icon: editing.icon,
                    unit: editing.unit,
                    unitEn: editing.unitEn,
                    multiplier: editing.multiplier,
                    amount: editing.amount,
                    note: editing.note ?? '',
                    performedAt: editing.performedAt
                  }}
                  onSaved={() => {
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            </div>
          ) : null}
          <ConfirmDialog
            open={!!deleteConfirm}
            title={t('list.deleteConfirmTitle')}
            message={deleteConfirm ? t('list.deleteConfirmMessage', {
              activity: getActivityLabel(deleteConfirm.activity, lang)
            }) : ''}
            variant="danger"
            confirmLabel={t('list.delete')}
            onConfirm={() => {
              if (deleteConfirm) {
                deleteActivity(deleteConfirm.id);
                showToast(t('toast.activityDeleted'), 'success');
                if (editingId === deleteConfirm.id) {
                  setEditingId(null);
                }
                setDeleteConfirm(null);
              }
            }}
            onCancel={() => setDeleteConfirm(null)}
          />
          {!hydrated ? (
            <div className="p-3 space-y-2">
              <div className="h-5 w-32 rounded skeleton" />
              <div className="h-10 rounded skeleton" />
              <div className="h-10 rounded skeleton" />
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="p-4 text-xs sm:text-sm text-gray-700 dark:text-gray-200 font-medium">{t('filters.noResults')}</div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {groups.map(({ day, acts }, groupIndex) => (
                <div key={day}>
                  <div className="sticky top-0 z-10 bg-gradient-to-r from-white/95 via-gray-50/95 to-white/95 dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 backdrop-blur-sm px-3 py-2 text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
                    {format(new Date(day), 'd MMMM EEEE', { locale: dateLocale })}
                  </div>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                    {acts.map((activity) => {
                      const isToday =
                        startOfDay(new Date(activity.performedAt)).toISOString() === todayKey;
                      return (
                        <li
                          key={activity.id}
                          className={`stagger-item ${isMobile ? 'touch-feedback mobile-card-lift slide-in-bottom-mobile' : 'ripple-effect magnetic-hover'} gpu-accelerated group px-2.5 py-2 flex items-start justify-between gap-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-900/30`}
                          style={{ animationDelay: `${(groupIndex * 0.1) + (acts.indexOf(activity) * 0.05)}s` }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className={`${isMobile ? 'text-sm' : 'text-base'} font-bold flex items-center gap-1.5 flex-wrap`}>
                              <span className={`text-lg ${isMobile ? 'emoji-celebrate' : 'emoji-bounce'}`}>{activity.icon}</span>
                              <span className="truncate text-gray-950 dark:text-gray-100">{getActivityLabel(activity, lang)}</span>
                              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-brand/15 via-brand/10 to-brand/15 dark:from-brand/20 dark:via-brand/15 dark:to-brand/20 text-brand dark:text-brand-light px-2 py-0.5 text-xs sm:text-sm font-bold whitespace-nowrap border border-brand/20 dark:border-brand/30">
                                {`${numberFormatter.format(activity.points)} ${t('list.pointsUnit')}`}
                              </span>
                            </div>
                            <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 mt-1 font-semibold`}>
                              {timeFormatter.format(new Date(activity.performedAt))} • {activity.amount}{' '}
                              {getActivityUnit(activity, lang)} • {activity.multiplier}x
                              {activity.duration && activity.duration > 0 ? (
                                <> • {formatDuration(activity.duration, lang)}</>
                              ) : null}
                            </div>
                            {activity.note ? (
                              <div className={`${isMobile ? 'text-xs' : 'text-sm'} mt-1.5 text-gray-700 dark:text-gray-300 line-clamp-2 font-medium`}>{activity.note}</div>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex-shrink-0">
                            <button
                              className="text-brand hover:text-brand-dark dark:hover:text-brand-light font-semibold hover:underline transition-all duration-200 hover:scale-110 active:scale-95 whitespace-nowrap"
                              onClick={() => setEditingId(activity.id)}
                            >
                              {t('list.edit')}
                            </button>
                            <button
                              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold hover:underline disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100 whitespace-nowrap"
                              disabled={!isToday}
                              title={!isToday ? t('list.deleteDisabled') : undefined}
                              onClick={() => {
                                if (!isToday) return;
                                setDeleteConfirm({ id: activity.id, activity });
                              }}
                            >
                              {t('list.delete')}
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
