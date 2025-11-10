'use client';

import { ActivityForm } from '@/components/ActivityForm';
import { ManageActivitiesDialog } from '@/components/ManageActivitiesDialog';
import { useMemo, useState } from 'react';
import { format, startOfDay } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useI18n } from '@/lib/i18n';
import { ActivityRecord, useActivities } from '@/lib/activityStore';
import { getActivityLabel, getActivityUnit } from '@/lib/activityUtils';
import { useToaster } from '@/components/Toaster';

export default function ActivitiesPage() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t('nav.activities')}</h1>
      <ActivitiesClient />
    </div>
  );
}

function ActivitiesClient() {
  const { t, lang } = useI18n();
  const { activities, deleteActivity, hydrated } = useActivities();
  const { showToast } = useToaster();
  const [editingId, setEditingId] = useState<string | null>(null);

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
    for (const activity of activities) {
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
  }, [activities]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>{t('list.newActivity')}</span>
          <ManageActivitiesDialog />
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-card">
          <ActivityForm />
        </div>
      </div>
      <div className="space-y-3">
        <div className="text-sm font-medium">{t('list.records')}</div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-card overflow-hidden">
          {editing ? (
            <div className="border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                <span>{t('list.editingTitle')}</span>
                <button
                  className="text-xs underline-offset-2 hover:underline"
                  onClick={() => setEditingId(null)}
                >
                  {t('form.cancel')}
                </button>
              </div>
              <div className="px-4 pb-4">
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
          {!hydrated ? (
            <div className="p-4 space-y-3">
              <div className="h-6 w-40 rounded skeleton" />
              <div className="h-12 rounded skeleton" />
              <div className="h-12 rounded skeleton" />
              <div className="h-12 rounded skeleton" />
            </div>
          ) : activities.length === 0 ? (
            <div className="p-4 text-sm text-gray-600 dark:text-gray-400">{t('list.empty')}</div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {groups.map(({ day, acts }) => (
                <div key={day}>
                  <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                    {format(new Date(day), 'd MMMM EEEE', { locale: dateLocale })}
                  </div>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                    {acts.map((activity) => {
                      const isToday =
                        startOfDay(new Date(activity.performedAt)).toISOString() === todayKey;
                      return (
                        <li
                          key={activity.id}
                          className="group p-3 flex items-start justify-between gap-3 rounded transition hover:bg-gray-50 dark:hover:bg-gray-900/30"
                        >
                          <div>
                            <div className="text-sm font-medium flex items-center gap-2 flex-wrap">
                              <span className="text-lg">{activity.icon}</span>
                              <span>{getActivityLabel(activity, lang)}</span>
                              <span className="inline-flex items-center rounded-full bg-brand/10 text-brand px-2 py-0.5 text-xs font-medium">
                                {`${numberFormatter.format(activity.points)} ${t('list.pointsUnit')}`}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {timeFormatter.format(new Date(activity.performedAt))} • {activity.amount}{' '}
                              {getActivityUnit(activity, lang)} • {activity.multiplier}x
                            </div>
                            {activity.note ? (
                              <div className="text-sm mt-1 text-gray-700 dark:text-gray-300">{activity.note}</div>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-2 text-xs opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                            <button
                              className="text-brand hover:underline"
                              onClick={() => setEditingId(activity.id)}
                            >
                              {t('list.edit')}
                            </button>
                            <button
                              className="text-red-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                              disabled={!isToday}
                              title={!isToday ? t('list.deleteDisabled') : undefined}
                              onClick={async () => {
                                if (!isToday) return;
                                if (!confirm(t('list.deleteConfirm'))) return;
                                deleteActivity(activity.id);
                                showToast(t('toast.activityDeleted'), 'success');
                                if (editingId === activity.id) {
                                  setEditingId(null);
                                }
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
