'use client';

import { ActivityForm } from '@/components/ActivityForm';
import { ActivityFilters, useFilteredActivities } from '@/components/ActivityFilters';
import { ManageActivitiesDialog } from '@/components/ManageActivitiesDialog';
import type { FilterState } from '@/components/ActivityFilters';
import { useMemo, useState, useEffect } from 'react';
import { format, startOfDay } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useI18n } from '@/lib/i18n';
import { ActivityRecord, useActivities } from '@/lib/activityStore';
import { getActivityLabel, getActivityUnit } from '@/lib/activityUtils';
import { useSettings } from '@/lib/settingsStore';
import { useToaster } from '@/components/Toaster';
import { ActivityListSkeleton } from '@/components/LoadingSkeleton';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { ActivityCard } from '@/components/ActivityCard';
import { PullToRefresh } from '@/components/PullToRefresh';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/EmptyState';
import { useRouter } from 'next/navigation';
import { useUIState } from '@/lib/uiState';
import { Accordion } from '@/components/ui/Accordion';
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const ActivityFiltersLazy = lazy(() =>
  import('@/components/ActivityFilters').then((m) => ({ default: m.ActivityFilters }))
);

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
  const router = useRouter();
  return (
    <main className="space-y-4 sm:space-y-5" role="main" aria-label={t('nav.activities')}>
      <div className="flex items-center justify-between">
        <h1
          className={`text-2xl sm:text-3xl font-bold flex items-center gap-2 ${isMobile ? 'title-entrance' : ''}`}
        >
          <span className={`text-2xl sm:text-3xl ${isMobile ? 'emoji-celebrate' : 'emoji-bounce'}`}>
            📝
          </span>
          <span className="text-gray-950 dark:text-white">{t('nav.activities')}</span>
        </h1>
        <div className="flex items-center gap-2">
          {!isMobile && (
            <Link
              href="/add"
              className={`px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand text-xs sm:text-sm font-semibold shadow-md hover:shadow-xl transition-all duration-300 btn-enhanced scale-on-interact active:scale-95`}
              aria-label={t('actions.addActivity')}
            >
              {t('actions.addActivity')}
            </Link>
          )}
          <ManageActivitiesDialog />
        </div>
      </div>
      <ActivitiesClient />
    </main>
  );
}

function ActivitiesClient() {
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const router = useRouter();
  const { activities, deleteActivity, hydrated } = useActivities();
  const { settings } = useSettings();
  const { showToast } = useToaster();
  const { setHideFloatingAddButton } = useUIState();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    activity: ActivityRecord;
  } | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'all',
    activityType: 'all',
    category: 'all',
    searchQuery: '',
    sortBy: 'date-desc',
  });
  const filteredActivities = useFilteredActivities(filters);

  // Hide FloatingAddButton when editing or deleting
  useEffect(() => {
    setHideFloatingAddButton(editingId !== null || deleteConfirm !== null);
    return () => {
      setHideFloatingAddButton(false);
    };
  }, [editingId, deleteConfirm, setHideFloatingAddButton]);

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );
  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    [lang]
  );
  const dateLocale = lang === 'tr' ? tr : enUS;
  const todayKey = useMemo(() => startOfDay(new Date()).toISOString(), []);

  const editing = useMemo(
    () => (editingId ? (activities.find((activity) => activity.id === editingId) ?? null) : null),
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
        acts: acts.sort((a, b) => +new Date(b.performedAt) - +new Date(a.performedAt)),
      }))
      .sort((a, b) => +new Date(b.day) - +new Date(a.day));
  }, [filteredActivities]);

  const filteredStats = useMemo(() => {
    const totalPoints = filteredActivities.reduce((sum, a) => sum + a.points, 0);
    const totalCount = filteredActivities.length;
    return { totalPoints, totalCount };
  }, [filteredActivities]);

  const handleRefresh = async () => {
    // Refresh activities by reloading from localStorage
    window.location.reload();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh} className="space-y-3 sm:space-y-4">
      {/* Filters - Accordion */}
      <Accordion
        title={lang === 'tr' ? 'Filtreler ve Arama' : 'Filters & Search'}
        icon="🔍"
        defaultOpen={false}
        variant="compact"
        className="card-entrance"
      >
        <Suspense fallback={<div className="h-24 skeleton rounded-lg" />}>
          <ActivityFiltersLazy filters={filters} onFiltersChange={setFilters} />
        </Suspense>
      </Accordion>

      {/* Filtered Stats Summary - Accordion */}
      {(filters.dateRange !== 'all' ||
        filters.activityType !== 'all' ||
        filters.category !== 'all' ||
        filters.searchQuery) && (
        <Accordion
          title={lang === 'tr' ? 'Filtre Sonuçları' : 'Filter Results'}
          icon="📊"
          defaultOpen={true}
          variant="compact"
          className="card-entrance"
        >
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-brand/5 to-brand/10 dark:from-brand/10 dark:to-brand/20 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {t('filters.results')}
              </span>
              <div className="text-sm text-gray-700 dark:text-gray-200 font-bold">
                {filteredStats.totalCount} {t('filters.activities')} ·{' '}
                {numberFormatter.format(filteredStats.totalPoints)} {t('list.pointsUnit')}
              </div>
            </div>
          </div>
        </Accordion>
      )}

      {/* Activities List - Accordion */}
      <Accordion
        title={`${t('list.records')}${filteredActivities.length !== activities.length ? ` (${filteredActivities.length} / ${activities.length})` : ''}`}
        icon="📝"
        defaultOpen={true}
        className="card-entrance"
      >
        <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          {filteredActivities.length === 0 ? (
            <div className="p-12 text-center">
              <div
                className={`${isMobile ? 'text-5xl' : 'text-6xl'} mb-4 ${isMobile ? 'emoji-celebrate' : 'emoji-bounce'}`}
              >
                🔍
              </div>
              <p
                className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-950 dark:text-gray-100 mb-2`}
              >
                {t('filters.noResults')}
              </p>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400`}>
                {lang === 'tr'
                  ? 'Filtreleri değiştirerek tekrar deneyin.'
                  : 'Try changing the filters.'}
              </p>
            </div>
          ) : editing ? (
            <div className="border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-gray-800 dark:text-gray-200">
                <span>{t('list.editingTitle')}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs underline-offset-2 hover:underline h-auto p-0"
                  onClick={() => setEditingId(null)}
                >
                  {t('form.cancel')}
                </Button>
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
                    performedAt: editing.performedAt,
                  }}
                  onSaved={() => {
                    setEditingId(null);
                    // Redirect to home after edit
                    setTimeout(() => {
                      router.push('/');
                    }, 500);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            </div>
          ) : null}
          <ConfirmDialog
            open={!!deleteConfirm}
            title={t('list.deleteConfirmTitle')}
            message={
              deleteConfirm
                ? t('list.deleteConfirmMessage', {
                    activity: getActivityLabel(deleteConfirm.activity, lang),
                  })
                : ''
            }
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
                // Redirect to home after delete
                setTimeout(() => {
                  router.push('/');
                }, 500);
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
          ) : filteredActivities.length === 0 && activities.length === 0 ? (
            <EmptyState
              variant="activities"
              title={lang === 'tr' ? 'Henüz aktivite yok' : 'No activities yet'}
              description={
                lang === 'tr'
                  ? 'Fitness yolculuğunuza başlamak için ilk aktivitenizi ekleyin.'
                  : 'Add your first activity to start tracking your fitness journey.'
              }
              action={
                isMobile
                  ? undefined
                  : {
                      label: t('actions.addActivity'),
                      onClick: () => (window.location.href = '/add'),
                      variant: 'primary',
                    }
              }
            />
          ) : filteredActivities.length === 0 ? (
            <EmptyState
              variant="search"
              title={t('filters.noResults')}
              description={
                lang === 'tr'
                  ? 'Filtreleri değiştirerek tekrar deneyin.'
                  : 'Try changing the filters.'
              }
            />
          ) : (
            <div className={isMobile ? 'space-y-3' : 'space-y-2'}>
              {groups.map(({ day, acts }, groupIndex) => (
                <div key={day} className={isMobile ? 'space-y-2' : 'space-y-1'}>
                  <div className="sticky top-0 z-10 date-header-entrance bg-gradient-to-r from-brand/10 via-brand/5 to-brand/10 dark:from-brand/20 dark:via-brand/10 dark:to-brand/20 backdrop-blur-md px-4 py-2.5 text-xs sm:text-sm font-bold text-gray-900 dark:text-white border-b-2 border-brand/30 dark:border-brand/40 rounded-t-xl shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-brand dark:text-brand-light">📅</span>
                      <span className="drop-shadow-sm">
                        {format(new Date(day), 'd MMMM EEEE', { locale: dateLocale })}
                      </span>
                    </div>
                  </div>
                  <ul
                    className={`${(settings?.listDensity ?? 'compact') === 'compact' ? (isMobile ? 'space-y-2' : 'space-y-1') : isMobile ? 'space-y-3' : 'space-y-2'} ${isMobile ? 'px-0 pb-3' : 'px-1 pb-2'}`}
                  >
                    {acts.map((activity, actIndex) => {
                      const isToday =
                        startOfDay(new Date(activity.performedAt)).toISOString() === todayKey;
                      return (
                        <ActivityCard
                          key={activity.id}
                          activity={activity}
                          isToday={isToday}
                          todayKey={todayKey}
                          numberFormatter={numberFormatter}
                          timeFormatter={timeFormatter}
                          lang={lang}
                          onEdit={(id) => setEditingId(id)}
                          onDelete={(id, act) => setDeleteConfirm({ id, activity: act })}
                          animationDelay={`${groupIndex * 0.1 + actIndex * 0.05}s`}
                          density={settings?.listDensity ?? 'compact'}
                        />
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </Accordion>
    </PullToRefresh>
  );
}
