'use client';

import { ActivityForm } from '@/components/ActivityForm';
import { ACTIVITY_DEFINITIONS, ActivityKey } from '@/lib/activityConfig';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format, startOfDay } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useI18n } from '@/lib/i18n';

type Activity = {
  id: string;
  activityKey: ActivityKey;
  amount: number;
  points: number;
  performedAt: string;
  note?: string | null;
};

type ActivityResponse = Omit<Activity, 'activityKey'> & { activityKey: string };

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
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Activity | null>(null);

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

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/activities', { cache: 'no-store' });
      const data: ActivityResponse[] = await res.json();
      setItems(
        data.map((item) => ({
          ...item,
          activityKey: item.activityKey as ActivityKey
        }))
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const groups = useMemo(() => {
    const grouped = new Map<string, Activity[]>();
    for (const activity of items) {
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
  }, [items]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="text-sm font-medium">{t('list.newActivity')}</div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-card">
          <ActivityForm onCreated={load} />
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
                  onClick={() => setEditing(null)}
                >
                  {t('form.cancel')}
                </button>
              </div>
              <div className="px-4 pb-4">
                <ActivityForm
                  initial={{
                    id: editing.id,
                    activityKey: editing.activityKey,
                    amount: editing.amount,
                    note: editing.note ?? '',
                    performedAt: editing.performedAt
                  }}
                  onSaved={load}
                  onCancel={() => setEditing(null)}
                />
              </div>
            </div>
          ) : null}
          {loading ? (
            <div className="p-4 space-y-3">
              <div className="h-6 w-40 rounded skeleton" />
              <div className="h-12 rounded skeleton" />
              <div className="h-12 rounded skeleton" />
              <div className="h-12 rounded skeleton" />
            </div>
          ) : items.length === 0 ? (
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
                      const def = ACTIVITY_DEFINITIONS[activity.activityKey];
                      if (!def) return null;
                      return (
                        <li key={activity.id} className="p-3 flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium flex items-center gap-2 flex-wrap">
                              <span className="text-lg">{def.icon}</span>
                              <span>{def.label}</span>
                              <span className="inline-flex items-center rounded-full bg-brand/10 text-brand px-2 py-0.5 text-xs font-medium">
                                {`${numberFormatter.format(activity.points)} ${t('list.pointsUnit')}`}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {timeFormatter.format(new Date(activity.performedAt))} •{' '}
                              {activity.amount} {def.unit} • {def.multiplier}x
                            </div>
                            {activity.note ? (
                              <div className="text-sm mt-1 text-gray-700 dark:text-gray-300">{activity.note}</div>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <button
                              className="text-brand hover:underline"
                              onClick={() => setEditing(activity)}
                            >
                              {t('list.edit')}
                            </button>
                            <button
                              className="text-red-600 hover:underline"
                              onClick={async () => {
                                if (!confirm(t('list.deleteConfirm'))) return;
                                await fetch(`/api/activities/${activity.id}`, { method: 'DELETE' });
                                load();
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
