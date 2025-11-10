'use client';

import { useEffect, useMemo, useState } from 'react';
import { ActivityDefinition, ActivityKey } from '@/lib/activityConfig';
import { useI18n } from '@/lib/i18n';
import { ActivityRecord, useActivities } from '@/lib/activityStore';
import { useActivityDefinitions } from '@/lib/settingsStore';

function toLocalInputValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

type ActivityFormInitial = Pick<
  ActivityRecord,
  | 'id'
  | 'activityKey'
  | 'label'
  | 'icon'
  | 'unit'
  | 'multiplier'
  | 'amount'
  | 'performedAt'
  | 'note'
  | 'isCustom'
>;

type ActivityFormProps = {
  onCreated?: () => void;
  onSaved?: () => void;
  onCancel?: () => void;
  initial?: ActivityFormInitial | null;
};

function asDefinitionFromRecord(record: ActivityFormInitial): ActivityDefinition {
  return {
    key: record.activityKey,
    label: record.label ?? record.activityKey,
    icon: record.icon ?? '🏃',
    unit: record.unit ?? '',
    multiplier: record.multiplier ?? 1,
    defaultAmount: record.amount ?? 10,
    isCustom: record.isCustom ?? true
  };
}

export function ActivityForm({ onCreated, onSaved, onCancel, initial }: ActivityFormProps) {
  const baseDefinitions = useActivityDefinitions();
  const fallbackDefinition = initial ? asDefinitionFromRecord(initial) : undefined;
  const definitions: ActivityDefinition[] = useMemo(() => {
    if (!fallbackDefinition) return baseDefinitions;
    const exists = baseDefinitions.some((def) => def.key === fallbackDefinition.key);
    return exists ? baseDefinitions : [...baseDefinitions, fallbackDefinition];
  }, [baseDefinitions, fallbackDefinition]);

  const definitionMap = useMemo(
    () =>
      Object.fromEntries<ActivityDefinition>(
        definitions.map((definition) => [definition.key, definition])
      ),
    [definitions]
  );

  const { addActivity, updateActivity } = useActivities();
  const { t, lang } = useI18n();
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );

  const [activityKey, setActivityKey] = useState<ActivityKey>(
    initial?.activityKey ?? definitions[0]?.key ?? 'WALKING'
  );
  const [performedAt, setPerformedAt] = useState<string>(
    initial?.performedAt ? toLocalInputValue(new Date(initial.performedAt)) : ''
  );
  const [amount, setAmount] = useState<number>(
    initial?.amount ?? fallbackDefinition?.defaultAmount ?? definitions[0]?.defaultAmount ?? 10
  );
  const [note, setNote] = useState<string>(initial?.note ?? '');
  const [loading, setLoading] = useState(false);

  const definition =
    definitionMap[activityKey] ??
    fallbackDefinition ??
    definitions.find((def) => def.key === activityKey) ??
    definitions[0];

  if (!definition) {
    return null;
  }

  const pointsNumeric = Math.max(
    0,
    Math.round(amount * definition.multiplier)
  );
  const pointsDisplay = numberFormatter.format(pointsNumeric);
  const isEditing = Boolean(initial?.id);

  useEffect(() => {
    if (initial) {
      setActivityKey(initial.activityKey);
      setAmount(initial.amount);
      setNote(initial.note ?? '');
      setPerformedAt(toLocalInputValue(new Date(initial.performedAt)));
    } else {
      const first = definitions[0];
      setActivityKey(first?.key ?? 'WALKING');
      setAmount(first?.defaultAmount ?? 10);
      setNote('');
      setPerformedAt('');
    }
  }, [initial, definitions]);

  useEffect(() => {
    if (!initial && !performedAt) {
      setPerformedAt(toLocalInputValue(new Date()));
    }
  }, [initial, performedAt]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const performedAtISO = performedAt
      ? new Date(performedAt).toISOString()
      : new Date().toISOString();
    try {
      if (!definition) {
        throw new Error('Aktivite tanımı bulunamadı');
      }
      if (initial?.id) {
        updateActivity(initial.id, {
          definition,
          amount,
          note: note || undefined,
          performedAt: performedAtISO
        });
        onSaved?.();
        onCancel?.();
      } else {
        addActivity({
          definition,
          amount,
          note: note || undefined,
          performedAt: performedAtISO
        });
        setAmount(definition.defaultAmount);
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
          {definitions.map((def) => {
            const active = def.key === activityKey;
            return (
              <button
                type="button"
                key={def.key}
                onClick={() => {
                  setActivityKey(def.key);
                  setAmount((current) => {
                    if (isEditing && initial?.activityKey === def.key) {
                      return current;
                    }
                    return def.defaultAmount;
                  });
                }}
                className={`text-left rounded-lg border px-3 py-2 shadow-card transition ${
                  active
                    ? 'border-brand ring-2 ring-brand/30 bg-brand/5'
                    : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900'
                }`}
                aria-pressed={active}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xl">{def.icon}</div>
                  <div className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
                    {def.multiplier}x
                  </div>
                </div>
                <div className="mt-2 text-sm font-medium">{def.label}</div>
                <div className="text-xs text-gray-500">
                  {def.defaultAmount} {def.unit}
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
          <div className="text-sm text-gray-700">
            {t('form.amount')} ({definition?.unit ?? ''})
          </div>
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
          {definition?.description ? (
            <div className="text-xs text-gray-500">{definition.description}</div>
          ) : null}
        </label>
        <div className="space-y-1 flex flex-col justify-end">
          <div className="text-sm text-gray-700">{t('form.multiplier')}</div>
          <div className="text-lg font-semibold">{definition?.multiplier ?? 1}x</div>
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

