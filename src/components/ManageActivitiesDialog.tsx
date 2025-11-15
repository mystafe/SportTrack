'use client';

import { FormEvent, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';
import { CustomActivityDefinition, useSettings, useActivityDefinitions } from '@/lib/settingsStore';
import { ActivityDefinition } from '@/lib/activityConfig';
import { useActivities } from '@/lib/activityStore';
import { getActivityLabel, getActivityUnit } from '@/lib/activityUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `custom-${Date.now()}`
  );
}

type FormState = {
  id: string;
  label: string;
  labelEn: string;
  icon: string;
  unit: string;
  unitEn: string;
  multiplier: number;
  defaultAmount: string;
  description: string;
  descriptionEn: string;
};

const INITIAL_FORM: FormState = {
  id: '',
  label: '',
  labelEn: '',
  icon: '',
  unit: '',
  unitEn: '',
  multiplier: 1,
  defaultAmount: '10',
  description: '',
  descriptionEn: '',
};

export function ManageActivitiesDialog() {
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const { settings, addCustomActivity, updateCustomActivity, removeCustomActivity } = useSettings();
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

  function handleEdit(activity: CustomActivityDefinition | ActivityDefinition) {
    const activityId = 'id' in activity ? activity.id : activity.key;
    setEditingId(activityId);
    setForm({
      id: activityId,
      label: activity.label,
      labelEn: activity.labelEn ?? '',
      icon: activity.icon,
      unit: activity.unit,
      unitEn: activity.unitEn ?? '',
      multiplier: activity.multiplier,
      defaultAmount: String(activity.defaultAmount),
      description: activity.description ?? '',
      descriptionEn: activity.descriptionEn ?? '',
    });
    setOpen(true);
  }

  function handleDelete(id: string) {
    // Prevent deletion of base/default activities
    const isBaseActivity = baseDefinitions.some((def) => def.key === id);
    if (isBaseActivity) {
      alert(t('activities.custom.errors.cannotDeleteBase'));
      return;
    }
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
    const defaultAmountValue = Number(form.defaultAmount);
    if (!Number.isFinite(defaultAmountValue) || defaultAmountValue <= 0) {
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

    // Use first language value if second language is empty
    const labelEn = form.labelEn.trim() || trimmedLabel;
    const unitEn = form.unitEn.trim() || form.unit.trim();
    const descriptionEn = form.descriptionEn.trim() || form.description.trim() || undefined;

    const payload: CustomActivityDefinition = {
      id,
      label: trimmedLabel,
      labelEn: labelEn !== trimmedLabel ? labelEn : undefined,
      icon: form.icon,
      unit: form.unit.trim(),
      unitEn: unitEn !== form.unit.trim() ? unitEn : undefined,
      multiplier: Math.round(form.multiplier * 10) / 10,
      defaultAmount: Math.round(defaultAmountValue),
      description: form.description.trim() || undefined,
      descriptionEn: descriptionEn,
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
        className={`px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 dark:from-purple-600 dark:via-purple-700 dark:to-indigo-700 text-white hover:from-purple-600 hover:via-indigo-600 hover:to-purple-600 dark:hover:from-purple-700 dark:hover:via-indigo-700 dark:hover:to-purple-700 text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 ${isMobile ? 'touch-feedback mobile-press bounce-in-mobile' : 'btn-enhanced scale-on-interact'} active:scale-95 flex items-center gap-1.5`}
        aria-label={t('activities.custom.manageButton')}
      >
        <span className="text-sm">⚙️</span>
        <span>{t('activities.custom.manageButton')}</span>
      </button>
      {open
        ? createPortal(
            <div
              className={`fixed inset-0 z-[9999] flex ${isMobile ? 'items-end' : 'items-center justify-center'} bg-black/50 ${isMobile ? '' : 'backdrop-blur-sm'} px-3 sm:px-4 py-4 overflow-y-auto animate-fade-in`}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  closeDialog();
                }
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="manage-activities-title"
            >
              <div
                className={`w-full ${isMobile ? 'max-w-full rounded-t-xl' : 'max-w-3xl rounded-xl'} border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 shadow-2xl hover:shadow-3xl transition-shadow duration-300 ${isMobile ? 'max-h-[90vh]' : 'max-h-[85vh]'} overflow-y-auto animate-scale-in`}
              >
                <div className="flex items-start justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b-2 border-gray-200 dark:border-gray-700">
                  <div>
                    <h2
                      id="manage-activities-title"
                      className="text-sm sm:text-base font-bold text-gray-950 dark:text-white"
                    >
                      {t('activities.custom.title')}
                    </h2>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mt-0.5">
                      {t('activities.custom.subtitle')}
                    </p>
                  </div>
                  <button
                    className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 text-lg sm:text-xl flex-shrink-0 ml-2"
                    onClick={closeDialog}
                    aria-label={t('form.cancel')}
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 px-3 sm:px-4 py-3">
                  <form className="space-y-3" onSubmit={submit}>
                    {/* Activity Name - Turkish and English side by side */}
                    <div
                      className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'} gap-2`}
                    >
                      <div>
                        <label
                          className={`block ${isMobile ? 'text-[10px]' : 'text-xs'} font-medium text-gray-600 dark:text-gray-300 mb-1 whitespace-nowrap`}
                        >
                          {t('activities.custom.fields.label')}{' '}
                          <span className="text-[7px] font-normal">
                            ({lang === 'tr' ? 'TR' : 'EN'})
                          </span>
                        </label>
                        <input
                          type="text"
                          value={lang === 'tr' ? form.label : form.labelEn}
                          onChange={(e) => {
                            if (lang === 'tr') {
                              setForm((prev) => ({ ...prev, label: e.target.value }));
                            } else {
                              setForm((prev) => ({ ...prev, labelEn: e.target.value }));
                            }
                          }}
                          className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg ${isMobile ? 'px-1.5 py-1 text-[11px]' : 'px-2.5 py-1.5 text-sm'} bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced`}
                          placeholder={
                            lang === 'tr'
                              ? t('activities.custom.placeholders.label')
                              : 'e.g. Swimming'
                          }
                          required
                        />
                        {/* TR alanı için hint - Türkçe */}
                        {lang === 'en' &&
                          form.label.trim() === '' &&
                          form.labelEn.trim() !== '' && (
                            <p className="text-[10px] text-gray-500 -mt-1">
                              Boş bırakılırsa Türkçe adı kullanılacak.
                            </p>
                          )}
                      </div>
                      <div>
                        <label
                          className={`block ${isMobile ? 'text-[10px]' : 'text-xs'} font-medium text-gray-600 dark:text-gray-300 mb-1 whitespace-nowrap`}
                        >
                          {t('activities.custom.fields.label')}{' '}
                          <span className="text-[7px] font-normal">
                            ({lang === 'tr' ? 'EN' : 'TR'} -{' '}
                            {t('activities.custom.fields.optional')})
                          </span>
                        </label>
                        <input
                          type="text"
                          value={lang === 'tr' ? form.labelEn : form.label}
                          onChange={(e) => {
                            if (lang === 'tr') {
                              setForm((prev) => ({ ...prev, labelEn: e.target.value }));
                            } else {
                              setForm((prev) => ({ ...prev, label: e.target.value }));
                            }
                          }}
                          className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg ${isMobile ? 'px-1.5 py-1 text-[11px]' : 'px-2.5 py-1.5 text-sm'} bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced`}
                          placeholder={lang === 'tr' ? 'e.g. Swimming' : 'Örn. Yüzme'}
                        />
                        {/* EN alanı için hint - İngilizce */}
                        {lang === 'tr' &&
                          form.labelEn.trim() === '' &&
                          form.label.trim() !== '' && (
                            <p className="text-[10px] text-gray-500 -mt-1">
                              If left empty, the Turkish name will be used.
                            </p>
                          )}
                      </div>
                    </div>

                    {/* Emoji, Multiplier, DefaultAmount in one row */}
                    <div className="grid grid-cols-3 gap-2">
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                        {t('activities.custom.fields.icon')}
                        <input
                          type="text"
                          maxLength={4}
                          value={form.icon}
                          onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
                          className="mt-1 w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-sm bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced"
                          placeholder="🏊"
                          required
                        />
                      </label>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                        {t('activities.custom.fields.multiplier')}
                        <input
                          type="number"
                          min={0.1}
                          step={0.1}
                          value={form.multiplier}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              multiplier: Number(e.target.value),
                            }))
                          }
                          className="mt-1 w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-sm bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced"
                          required
                        />
                      </label>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                        {t('activities.custom.fields.defaultAmount')}
                        <input
                          type="number"
                          min={1}
                          step={1}
                          value={form.defaultAmount}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              defaultAmount: e.target.value,
                            }))
                          }
                          className="mt-1 w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-sm bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced"
                          required
                        />
                      </label>
                    </div>

                    {/* Unit - Turkish and English side by side */}
                    <div
                      className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'} gap-2`}
                    >
                      <div>
                        <label
                          className={`block ${isMobile ? 'text-[10px]' : 'text-xs'} font-medium text-gray-600 dark:text-gray-300 mb-1 whitespace-nowrap`}
                        >
                          {t('activities.custom.fields.unit')}{' '}
                          <span className="text-[7px] font-normal">
                            ({lang === 'tr' ? 'TR' : 'EN'})
                          </span>
                        </label>
                        <input
                          type="text"
                          value={lang === 'tr' ? form.unit : form.unitEn}
                          onChange={(e) => {
                            if (lang === 'tr') {
                              setForm((prev) => ({ ...prev, unit: e.target.value }));
                            } else {
                              setForm((prev) => ({ ...prev, unitEn: e.target.value }));
                            }
                          }}
                          className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg ${isMobile ? 'px-1.5 py-1 text-[11px]' : 'px-2.5 py-1.5 text-sm'} bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced`}
                          placeholder={
                            lang === 'tr'
                              ? t('activities.custom.placeholders.unit')
                              : 'e.g. minutes'
                          }
                          required
                        />
                        {/* TR alanı için hint - Türkçe */}
                        {lang === 'en' && form.unit.trim() === '' && form.unitEn.trim() !== '' && (
                          <p className="text-[10px] text-gray-500 -mt-1">
                            Boş bırakılırsa Türkçe birimi kullanılacak.
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          className={`block ${isMobile ? 'text-[10px]' : 'text-xs'} font-medium text-gray-600 dark:text-gray-300 mb-1 whitespace-nowrap`}
                        >
                          {t('activities.custom.fields.unit')}{' '}
                          <span className="text-[7px] font-normal">
                            ({lang === 'tr' ? 'EN' : 'TR'} -{' '}
                            {t('activities.custom.fields.optional')})
                          </span>
                        </label>
                        <input
                          type="text"
                          value={lang === 'tr' ? form.unitEn : form.unit}
                          onChange={(e) => {
                            if (lang === 'tr') {
                              setForm((prev) => ({ ...prev, unitEn: e.target.value }));
                            } else {
                              setForm((prev) => ({ ...prev, unit: e.target.value }));
                            }
                          }}
                          className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg ${isMobile ? 'px-1.5 py-1 text-[11px]' : 'px-2.5 py-1.5 text-sm'} bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced`}
                          placeholder={lang === 'tr' ? 'e.g. minutes' : 'Örn. dakika'}
                        />
                        {/* EN alanı için hint - İngilizce */}
                        {lang === 'tr' && form.unitEn.trim() === '' && form.unit.trim() !== '' && (
                          <p className="text-[10px] text-gray-500 -mt-1">
                            If left empty, the Turkish unit will be used.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Description - Turkish and English side by side */}
                    <div
                      className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'} gap-2`}
                    >
                      <div>
                        <label
                          className={`block ${isMobile ? 'text-[10px]' : 'text-xs'} font-medium text-gray-600 dark:text-gray-300 mb-1 whitespace-nowrap`}
                        >
                          {t('activities.custom.fields.description')}{' '}
                          <span className="text-[7px] font-normal">
                            ({lang === 'tr' ? 'TR' : 'EN'})
                          </span>
                        </label>
                        <textarea
                          value={lang === 'tr' ? form.description : form.descriptionEn}
                          onChange={(e) => {
                            if (lang === 'tr') {
                              setForm((prev) => ({ ...prev, description: e.target.value }));
                            } else {
                              setForm((prev) => ({ ...prev, descriptionEn: e.target.value }));
                            }
                          }}
                          rows={isMobile ? 1 : 2}
                          className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg ${isMobile ? 'px-1.5 py-1 text-[11px]' : 'px-2.5 py-1.5 text-sm'} bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced resize-none`}
                          placeholder={
                            lang === 'tr'
                              ? t('activities.custom.placeholders.description')
                              : t('activities.custom.placeholders.descriptionEn')
                          }
                        />
                      </div>
                      <div>
                        <label
                          className={`block ${isMobile ? 'text-[10px]' : 'text-xs'} font-medium text-gray-600 dark:text-gray-300 mb-1 whitespace-nowrap`}
                        >
                          {t('activities.custom.fields.description')}{' '}
                          <span className="text-[7px] font-normal">
                            ({lang === 'tr' ? 'EN' : 'TR'} -{' '}
                            {t('activities.custom.fields.optional')})
                          </span>
                        </label>
                        <textarea
                          value={lang === 'tr' ? form.descriptionEn : form.description}
                          onChange={(e) => {
                            if (lang === 'tr') {
                              setForm((prev) => ({ ...prev, descriptionEn: e.target.value }));
                            } else {
                              setForm((prev) => ({ ...prev, description: e.target.value }));
                            }
                          }}
                          rows={isMobile ? 1 : 2}
                          className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg ${isMobile ? 'px-1.5 py-1 text-[11px]' : 'px-2.5 py-1.5 text-sm'} bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced resize-none`}
                          placeholder={
                            lang === 'tr'
                              ? t('activities.custom.placeholders.descriptionEn')
                              : 'Açıklama girin'
                          }
                        />
                      </div>
                    </div>
                    {(() => {
                      const isTr = lang === 'tr';
                      const trDesc = form.description.trim();
                      const enDesc = form.descriptionEn.trim();
                      const showHint = isTr
                        ? enDesc === '' && trDesc !== ''
                        : trDesc === '' && enDesc !== '';
                      return showHint ? (
                        <p className="text-[10px] text-gray-500 -mt-1">
                          {t('activities.custom.fields.descriptionHint')}
                        </p>
                      ) : null;
                    })()}
                    {error ? <p className="text-xs text-red-500">{error}</p> : null}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={closeDialog}
                        className="px-2.5 py-1.5 text-xs rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 font-semibold"
                      >
                        {t('form.cancel')}
                      </button>
                      <button
                        type="submit"
                        className="px-2.5 py-1.5 text-xs rounded-lg bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-semibold shadow-md hover:shadow-xl transition-all duration-300"
                      >
                        {isEditing ? t('activities.custom.save') : t('activities.custom.add')}
                      </button>
                    </div>
                  </form>
                  <div className="space-y-2.5">
                    <section className="space-y-1.5">
                      <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {t('activities.custom.customList')}
                      </h3>
                      {customActivities.length === 0 ? (
                        <p className="text-[10px] sm:text-xs text-gray-500 border border-dashed border-gray-200 dark:border-gray-700 rounded px-2 py-3">
                          {t('activities.custom.empty')}
                        </p>
                      ) : (
                        <ul className="space-y-1.5">
                          {customActivities.map((activity) => (
                            <li
                              key={activity.id}
                              className="border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800/50 px-2 py-1.5 flex items-center justify-between gap-2 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700/50 dark:hover:to-gray-700/30 transition-all duration-200"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5 truncate text-gray-950 dark:text-gray-100">
                                  {activity.icon && <span>{activity.icon}</span>}
                                  <span className="truncate">
                                    {getActivityLabel(activity, lang)}
                                  </span>
                                </div>
                                <div className="text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400">
                                  {activity.multiplier}x • {activity.defaultAmount}{' '}
                                  {getActivityUnit(activity, lang)}
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs flex-shrink-0">
                                <button
                                  className="text-brand dark:text-brand-light hover:text-brand-dark dark:hover:text-brand font-semibold hover:underline px-1 transition-all duration-200"
                                  onClick={() => handleEdit(activity)}
                                >
                                  {t('activities.custom.edit')}
                                </button>
                                <button
                                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold hover:underline px-1 transition-all duration-200"
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
                    <section className="space-y-1.5">
                      <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {t('activities.custom.baseList')}
                      </h3>
                      <ul className="space-y-1.5 max-h-40 sm:max-h-48 overflow-auto pr-1">
                        {baseDefinitions.map((activity: ActivityDefinition) => (
                          <li
                            key={activity.key}
                            className="border border-dashed border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                                {activity.icon && <span>{activity.icon}</span>}
                                <span>{getActivityLabel(activity, lang)}</span>
                              </div>
                              <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                                {activity.multiplier}x • {activity.defaultAmount}{' '}
                                {getActivityUnit(activity, lang)}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs flex-shrink-0">
                              <button
                                className="text-brand hover:underline px-1"
                                onClick={() => handleEdit(activity)}
                              >
                                {t('activities.custom.edit')}
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
