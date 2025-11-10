'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import {
  CustomActivityDefinition,
  useSettings,
  useActivityDefinitions
} from '@/lib/settingsStore';
import { ActivityDefinition } from '@/lib/activityConfig';
import { useActivities } from '@/lib/activityStore';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `custom-${Date.now()}`;
}

type FormState = {
  id: string;
  label: string;
  icon: string;
  unit: string;
  multiplier: number;
  defaultAmount: number;
  description: string;
};

const INITIAL_FORM: FormState = {
  id: '',
  label: '',
  icon: '🏃',
  unit: '',
  multiplier: 1,
  defaultAmount: 10,
  description: ''
};

export function ManageActivitiesDialog() {
  const { t } = useI18n();
  const { settings, addCustomActivity, updateCustomActivity, removeCustomActivity } =
    useSettings();
  const { activities } = useActivities();
  const definitions = useActivityDefinitions();
  const customActivities = useMemo(() => {
    const seen = new Set<string>();
    return (settings?.customActivities ?? []).filter((activity) => {
      if (seen.has(activity.id)) return false;
      seen.add(activity.id);
      return true;
    });
  }, [settings?.customActivities]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);

  const usedActivityKeys = useMemo(
    () => new Set(activities.map((activity) => activity.activityKey)),
    [activities]
  );

  const baseDefinitions = useMemo(
    () => definitions.filter((definition) => !definition.isCustom),
    [definitions]
  );

  const isEditing = editingId !== null;

  function resetForm() {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setError(null);
  }

  function openDialog() {
    setOpen(true);
    resetForm();
  }

  function closeDialog() {
    setOpen(false);
    resetForm();
  }

  function handleEdit(activity: CustomActivityDefinition) {
    setEditingId(activity.id);
    setForm({
      id: activity.id,
      label: activity.label,
      icon: activity.icon,
      unit: activity.unit,
      multiplier: activity.multiplier,
      defaultAmount: activity.defaultAmount,
      description: activity.description ?? ''
    });
    setOpen(true);
  }

  function handleDelete(id: string) {
    if (usedActivityKeys.has(id)) {
      alert(t('activities.custom.errors.inUse'));
      return;
    }
    if (!confirm(t('activities.custom.confirmDelete'))) return;
    removeCustomActivity(id);
    if (editingId === id) {
      resetForm();
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const trimmedLabel = form.label.trim();
    if (!trimmedLabel) {
      setError(t('activities.custom.errors.label'));
      return;
    }
    if (!form.icon.trim()) {
      setError(t('activities.custom.errors.icon'));
      return;
    }
    if (!form.unit.trim()) {
      setError(t('activities.custom.errors.unit'));
      return;
    }
    if (!Number.isFinite(form.multiplier) || form.multiplier <= 0) {
      setError(t('activities.custom.errors.multiplier'));
      return;
    }
    if (!Number.isFinite(form.defaultAmount) || form.defaultAmount <= 0) {
      setError(t('activities.custom.errors.defaultAmount'));
      return;
    }

    const id = isEditing ? form.id : slugify(trimmedLabel);
    if (!isEditing) {
      const exists =
        definitions.some((def) => def.key === id) ||
        customActivities.some((activity) => activity.id === id);
      if (exists) {
        setError(t('activities.custom.errors.duplicate'));
        return;
      }
    }
    const payload: CustomActivityDefinition = {
      id,
      label: trimmedLabel,
      icon: form.icon,
      unit: form.unit.trim(),
      multiplier: Math.round(form.multiplier * 10) / 10,
      defaultAmount: Math.round(form.defaultAmount),
      description: form.description.trim() || undefined
    };

    if (isEditing) {
      updateCustomActivity(id, payload);
    } else {
      addCustomActivity(payload);
    }
    resetForm();
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="px-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
      >
        {t('activities.custom.manageButton')}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl">
            <div className="flex items-start justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="text-lg font-semibold">{t('activities.custom.title')}</h2>
                <p className="text-xs text-gray-500 mt-1">
                  {t('activities.custom.subtitle')}
                </p>
              </div>
              <button
                className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                onClick={closeDialog}
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-5 py-4">
              <form className="space-y-4" onSubmit={submit}>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                    {t('activities.custom.fields.label')}
                  </label>
                  <input
                    type="text"
                    value={form.label}
                    onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900"
                    placeholder={t('activities.custom.placeholders.label')}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                    {t('activities.custom.fields.icon')}
                    <input
                      type="text"
                      maxLength={4}
                      value={form.icon}
                      onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                      className="mt-1 w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900"
                      placeholder="🏊"
                      required
                    />
                  </label>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                    {t('activities.custom.fields.unit')}
                    <input
                      type="text"
                      value={form.unit}
                      onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
                      className="mt-1 w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900"
                      placeholder={t('activities.custom.placeholders.unit')}
                      required
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                    {t('activities.custom.fields.multiplier')}
                    <input
                      type="number"
                      min={0.1}
                      step={0.1}
                      value={form.multiplier}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          multiplier: Number(e.target.value)
                        }))
                      }
                      className="mt-1 w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900"
                      required
                    />
                  </label>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                    {t('activities.custom.fields.defaultAmount')}
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={form.defaultAmount}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          defaultAmount: Number(e.target.value)
                        }))
                      }
                      className="mt-1 w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900"
                      required
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                    {t('activities.custom.fields.description')}
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={3}
                    className="mt-1 w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900"
                    placeholder={t('activities.custom.placeholders.description')}
                  />
                </div>
                {error ? <p className="text-xs text-red-500">{error}</p> : null}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="px-3 py-2 text-xs rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    {t('form.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 text-xs rounded bg-brand text-white hover:bg-brand-dark shadow"
                  >
                    {isEditing ? t('activities.custom.save') : t('activities.custom.add')}
                  </button>
                </div>
              </form>
              <div className="space-y-4">
                <section className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t('activities.custom.customList')}
                  </h3>
                  {customActivities.length === 0 ? (
                    <p className="text-xs text-gray-500 border border-dashed border-gray-200 dark:border-gray-700 rounded px-3 py-4">
                      {t('activities.custom.empty')}
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {customActivities.map((activity) => (
                        <li
                          key={activity.id}
                          className="border border-gray-200 dark:border-gray-700 rounded px-3 py-2 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="text-sm font-medium flex items-center gap-2">
                              <span>{activity.icon}</span>
                              <span>{activity.label}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {activity.multiplier}x • {activity.defaultAmount} {activity.unit}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <button
                              className="text-brand hover:underline"
                              onClick={() => handleEdit(activity)}
                            >
                              {t('activities.custom.edit')}
                            </button>
                            <button
                              className="text-red-600 hover:underline"
                              onClick={() => handleDelete(activity.id)}
                            >
                              {t('activities.custom.remove')}
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
                <section className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t('activities.custom.baseList')}
                  </h3>
                  <ul className="space-y-2 max-h-48 overflow-auto pr-1">
                    {baseDefinitions.map((activity: ActivityDefinition) => (
                      <li
                        key={activity.key}
                        className="border border-dashed border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-xs text-gray-500"
                      >
                        <div className="font-medium text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2">
                          <span>{activity.icon}</span>
                          <span>{activity.label}</span>
                        </div>
                        <div>
                          {activity.multiplier}x • {activity.defaultAmount} {activity.unit}
                        </div>
                        {activity.description ? (
                          <div className="mt-1 text-[11px]">{activity.description}</div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

