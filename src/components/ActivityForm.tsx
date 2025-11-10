'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ACTIVITY_DEFINITIONS,
  ActivityKey,
  calculatePoints,
  listActivities
} from '@/lib/activityConfig';
import { useI18n } from '@/lib/i18n';

function toLocalInputValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

type ActivityFormInitial = {
  id?: string;
  activityKey: ActivityKey;
  amount: number;
  performedAt: string;
  note?: string | null;
};

type ActivityFormProps = {
  onCreated?: () => void;
  onSaved?: () => void;
  onCancel?: () => void;
  initial?: ActivityFormInitial | null;
};

export function ActivityForm({ onCreated, onSaved, onCancel, initial }: ActivityFormProps) {
  const activities = useMemo(() => listActivities(), []);
  const { t, lang } = useI18n();
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );
  const [activityKey, setActivityKey] = useState<ActivityKey>(
    initial?.activityKey ?? 'WALKING'
  );
  const [performedAt, setPerformedAt] = useState<string>(
    initial?.performedAt ? toLocalInputValue(new Date(initial.performedAt)) : ''
  );
  const [amount, setAmount] = useState<number>(
    initial?.amount ?? ACTIVITY_DEFINITIONS.WALKING.defaultAmount
  );
  const [note, setNote] = useState<string>(initial?.note ?? '');
  const [loading, setLoading] = useState(false);

  const definition = ACTIVITY_DEFINITIONS[activityKey];
  const points = calculatePoints(activityKey, Number.isFinite(amount) ? amount : 0);
  const pointsDisplay = numberFormatter.format(points);
  const isEditing = Boolean(initial?.id);

  useEffect(() => {
    if (initial) {
      setActivityKey(initial.activityKey);
      setAmount(initial.amount);
      setNote(initial.note ?? '');
      setPerformedAt(toLocalInputValue(new Date(initial.performedAt)));
    } else {
      setActivityKey('WALKING');
      setAmount(ACTIVITY_DEFINITIONS.WALKING.defaultAmount);
      setNote('');
      setPerformedAt('');
    }
  }, [initial]);

  useEffect(() => {
    if (!initial && !performedAt) {
      setPerformedAt(toLocalInputValue(new Date()));
    }
  }, [initial, performedAt]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      activityKey,
      amount,
      note: note || undefined,
      performedAt: performedAt ? new Date(performedAt).toISOString() : undefined
    };
    try {
      if (initial?.id) {
        await fetch(`/api/activities/${initial.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        onSaved?.();
        onCancel?.();
      } else {
        await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        setAmount(ACTIVITY_DEFINITIONS[activityKey].defaultAmount);
        setNote('');
        setPerformedAt(toLocalInputValue(new Date()));
        onCreated?.();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="space-y-2">
        <div className="text-sm text-gray-700 dark:text-gray-200">{t('form.selectActivity')}</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {activities.map((a) => {
            const active = a.key === activityKey;
            return (
              <button
                type="button"
                key={a.key}
                onClick={() => {
                  setActivityKey(a.key);
                  setAmount((current) => {
                    if (isEditing && initial?.activityKey === a.key) {
                      return current;
                    }
                    return ACTIVITY_DEFINITIONS[a.key].defaultAmount;
                  });
                }}
                className={`text-left rounded-lg border px-3 py-2 shadow-card transition
                ${active ? 'border-brand ring-2 ring-brand/30 bg-brand/5' : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900'}
                `}
                aria-pressed={active}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xl">{a.icon}</div>
                  <div className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
                    {a.multiplier}x
                  </div>
                </div>
                <div className="mt-2 text-sm font-medium">{a.label}</div>
                <div className="text-xs text-gray-500">
                  {a.defaultAmount} {a.unit}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="space-y-1">
          <div className="text-sm text-gray-700">{t('form.datetime')}</div>
          <input
            type="datetime-local"
            value={performedAt}
            onChange={(e) => setPerformedAt(e.target.value)}
            className="w-full border rounded px-2 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
            required
          />
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="space-y-1">
          <div className="text-sm text-gray-700">{t('form.amount')} ({definition.unit})</div>
          <input
            type="number"
            min={1}
            step={1}
            value={amount}
            onChange={(e) => {
              const next = Number(e.target.value);
              setAmount(Number.isNaN(next) ? 1 : Math.max(1, next));
            }}
            className="w-full border rounded px-2 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
            required
          />
          {definition.description ? (
            <div className="text-xs text-gray-500">{definition.description}</div>
          ) : null}
        </label>
        <div className="space-y-1 flex flex-col justify-end">
          <div className="text-sm text-gray-700">{t('form.multiplier')}</div>
          <div className="text-lg font-semibold">{definition.multiplier}x</div>
        </div>
        <div className="space-y-1 flex flex-col justify-end">
          <div className="text-sm text-gray-700">{t('form.points')}</div>
          <div className="text-lg font-semibold text-brand">{pointsDisplay}</div>
        </div>
      </div>
      <label className="space-y-1 block">
        <div className="text-sm text-gray-700">{t('form.noteOptional')}</div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border rounded px-2 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
          rows={3}
          placeholder={t('form.notePlaceholder')}
        />
      </label>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-2 rounded bg-brand text-white hover:bg-brand-dark text-sm disabled:opacity-50 shadow"
        >
          {loading ? '...' : isEditing ? t('form.save') : t('form.add')}
        </button>
        {isEditing ? (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 rounded border border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            {t('form.cancel')}
          </button>
        ) : null}
      </div>
    </form>
  );
}
