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
            <div className="space-y-1">
              {groups.map(({ day, acts }, groupIndex) => (
                <div key={day} className="space-y-1">
                  <div className="sticky top-0 z-10 date-header-entrance bg-gradient-to-r from-brand/10 via-brand/5 to-brand/10 dark:from-brand/20 dark:via-brand/10 dark:to-brand/20 backdrop-blur-md px-4 py-2.5 text-xs sm:text-sm font-bold text-gray-900 dark:text-white border-b-2 border-brand/30 dark:border-brand/40 rounded-t-xl shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-brand dark:text-brand-light">📅</span>
                      <span className="drop-shadow-sm">{format(new Date(day), 'd MMMM EEEE', { locale: dateLocale })}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 px-1 pb-2">
                    {acts.map((activity, actIndex) => {
                      const isToday =
                        startOfDay(new Date(activity.performedAt)).toISOString() === todayKey;
                      return (
                        <li
                          key={activity.id}
                          className={`activity-card-entrance activity-card-shimmer activity-card-hover activity-ripple gpu-accelerated group relative rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900/80 dark:via-gray-800/50 dark:to-gray-900/80 px-4 py-3 shadow-md hover:shadow-2xl transition-all duration-300 ${isToday ? 'ring-2 ring-brand/30 dark:ring-brand/40' : ''}`}
                          style={{ animationDelay: `${(groupIndex * 0.1) + (actIndex * 0.05)}s` }}
                        >
                          {/* Gradient overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-brand/5 dark:from-brand/10 dark:via-transparent dark:to-brand/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
                          
                          <div className="relative z-10 flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className={`${isMobile ? 'text-base' : 'text-lg'} font-extrabold flex items-center gap-2 flex-wrap mb-2`}>
                                <span className={`text-2xl sm:text-3xl activity-icon-float ${isMobile ? 'emoji-celebrate' : 'emoji-bounce'}`}>{activity.icon}</span>
                                <span className="truncate text-gray-950 dark:text-white drop-shadow-sm">{getActivityLabel(activity, lang)}</span>
                                <span className="inline-flex items-center rounded-full points-badge-animated bg-gradient-to-r from-brand via-brand-dark to-brand text-white px-3 py-1 text-xs sm:text-sm font-extrabold whitespace-nowrap border-2 border-white/20 dark:border-white/10 shadow-lg">
                                  <span className="drop-shadow-md">✨</span>
                                  <span className="ml-1.5">{numberFormatter.format(activity.points)}</span>
                                  <span className="ml-1 text-[10px] opacity-90">{t('list.pointsUnit')}</span>
                                </span>
                              </div>
                              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-300 mt-1.5 font-semibold flex items-center gap-2 flex-wrap`}>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100/50 dark:bg-gray-800/50">
                                  <span>🕐</span>
                                  <span>{timeFormatter.format(new Date(activity.performedAt))}</span>
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100/50 dark:bg-gray-800/50">
                                  <span>📊</span>
                                  <span>{activity.amount} {getActivityUnit(activity, lang)}</span>
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 font-bold">
                                  <span>⚡</span>
                                  <span>{activity.multiplier}x</span>
                                </span>
                                {activity.duration && activity.duration > 0 ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                    <span>⏱️</span>
                                    <span>{formatDuration(activity.duration, lang)}</span>
                                  </span>
                                ) : null}
                              </div>
                              {activity.note ? (
                                <div className={`${isMobile ? 'text-xs' : 'text-sm'} mt-2.5 px-3 py-2 rounded-lg bg-gray-50/80 dark:bg-gray-800/50 border-l-4 border-brand/50 text-gray-700 dark:text-gray-300 line-clamp-2 font-medium italic`}>
                                  "{activity.note}"
                                </div>
                              ) : null}
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 flex-shrink-0">
                              <button
                                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-bold shadow-md hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 whitespace-nowrap"
                                onClick={() => setEditingId(activity.id)}
                              >
                                ✏️ {t('list.edit')}
                              </button>
                              <button
                                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold shadow-md hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 active:scale-95 disabled:hover:scale-100 whitespace-nowrap"
                                disabled={!isToday}
                                title={!isToday ? t('list.deleteDisabled') : undefined}
                                onClick={() => {
                                  if (!isToday) return;
                                  setDeleteConfirm({ id: activity.id, activity });
                                }}
                              >
                                🗑️ {t('list.delete')}
                              </button>
                            </div>
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
