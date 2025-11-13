'use client';

import { useEffect, useMemo, useState } from 'react';
import { ActivityDefinition, ActivityKey } from '@/lib/activityConfig';
import { useI18n } from '@/lib/i18n';
import { ActivityRecord, useActivities } from '@/lib/activityStore';
import { useActivityDefinitions, useSettings } from '@/lib/settingsStore';
import { getActivityLabel, getActivityUnit, getActivityDescription } from '@/lib/activityUtils';
import { useToaster } from '@/components/Toaster';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useBadges } from '@/lib/badgeStore';
import { useLevel } from '@/lib/levelStore';
import { useChallenges } from '@/lib/challengeStore';
import { notificationService } from '@/lib/notificationService';
import { ActivityTimer } from '@/components/ActivityTimer';

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
  | 'labelEn'
  | 'icon'
  | 'unit'
  | 'unitEn'
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
    labelEn: record.labelEn,
    icon: record.icon ?? '🏃',
    unit: record.unit ?? '',
    unitEn: record.unitEn,
    multiplier: record.multiplier ?? 1,
    defaultAmount: record.amount ?? 10,
    isCustom: record.isCustom ?? true
  };
}

export function ActivityForm({ onCreated, onSaved, onCancel, initial }: ActivityFormProps) {
  const isMobile = useIsMobile();
  const baseDefinitions = useActivityDefinitions();
  const fallbackDefinition = initial ? asDefinitionFromRecord(initial) : undefined;
  const mergedDefinitions: ActivityDefinition[] = useMemo(() => {
    if (!fallbackDefinition) return baseDefinitions;
    const exists = baseDefinitions.some((def) => def.key === fallbackDefinition.key);
    return exists ? baseDefinitions : [...baseDefinitions, fallbackDefinition];
  }, [baseDefinitions, fallbackDefinition]);

  const definitions = useMemo(() => {
    const seen = new Set<ActivityKey>();
    const unique: ActivityDefinition[] = [];
    for (const definition of mergedDefinitions) {
      if (seen.has(definition.key)) continue;
      seen.add(definition.key);
      unique.push(definition);
    }
    return unique;
  }, [mergedDefinitions]);

  const definitionMap = useMemo(
    () =>
      Object.fromEntries<ActivityDefinition>(
        definitions.map((definition) => [definition.key, definition])
      ),
    [definitions]
  );

  const { addActivity, updateActivity } = useActivities();
  const { t, lang } = useI18n();
  const { showToast } = useToaster();
  const { checkNewBadges } = useBadges();
  const { checkLevelUp: checkLevelUpCallback } = useLevel();
  const { checkCompletedChallenges } = useChallenges();
  const { settings } = useSettings();
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
  const [amount, setAmount] = useState<string>(
    initial?.amount ? String(initial.amount) : String(fallbackDefinition?.defaultAmount ?? definitions[0]?.defaultAmount ?? 10)
  );
  const [note, setNote] = useState<string>(initial?.note ?? '');
  const [duration, setDuration] = useState<number>(initial?.duration ?? 0);
  const [loading, setLoading] = useState(false);

  const definition =
    definitionMap[activityKey] ??
    fallbackDefinition ??
    definitions.find((def) => def.key === activityKey) ??
    definitions[0];

  if (!definition) {
    return null;
  }

  const amountNumeric = Number(amount) || 0;
  const pointsNumeric = Math.max(
    0,
    Math.round(amountNumeric * definition.multiplier)
  );
  const pointsDisplay = numberFormatter.format(pointsNumeric);
  const isEditing = Boolean(initial?.id);

  useEffect(() => {
    if (initial) {
      setActivityKey(initial.activityKey);
      setAmount(String(initial.amount));
      setNote(initial.note ?? '');
      setPerformedAt(toLocalInputValue(new Date(initial.performedAt)));
    } else {
      const first = definitions[0];
      setActivityKey(first?.key ?? 'WALKING');
      setAmount(String(first?.defaultAmount ?? 10));
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
      const amountValue = Number(amount) || 0;
      if (amountValue <= 0) {
        throw new Error('Miktar 0\'dan büyük olmalıdır');
      }
      if (initial?.id) {
        updateActivity(initial.id, {
          definition,
          amount: amountValue,
          note: note || undefined,
          performedAt: performedAtISO,
          duration: duration > 0 ? duration : undefined
        });
        showToast(t('toast.activityUpdated'), 'success');
        onSaved?.();
        onCancel?.();
      } else {
        addActivity({
          definition,
          amount: amountValue,
          note: note || undefined,
          performedAt: performedAtISO,
          duration: duration > 0 ? duration : undefined
        });
        showToast(t('toast.activityAdded'), 'success');
        
        // Check for new badges and level up
        setTimeout(() => {
          const newBadges = checkNewBadges();
          if (newBadges.length > 0) {
            newBadges.forEach(badge => {
              showToast(`${badge.icon} ${badge.name[lang]}`, 'success');
              // Show notification for badge unlock
              notificationService.showBadgeUnlocked(lang as 'tr' | 'en', badge.name[lang], badge.icon);
            });
          }
          
          // Check for level up
          const newLevel = checkLevelUpCallback();
          if (newLevel) {
            showToast(`${t('level.levelUp')} ${t('level.level')} ${newLevel}! 🎉`, 'success');
            notificationService.showLevelUp(lang as 'tr' | 'en', newLevel);
          }
          
          // Check for completed challenges
          const completedChallenges = checkCompletedChallenges();
          if (completedChallenges.length > 0) {
            completedChallenges.forEach(challenge => {
              showToast(
                `${challenge.icon || '🎯'} ${t('challenges.completedMessage', { name: challenge.name[lang] })}`,
                'success'
              );
              notificationService.showChallengeCompleted(lang as 'tr' | 'en', challenge.name[lang], challenge.icon || '🎯');
            });
          }
        }, 500);
        
        setAmount(String(definition.defaultAmount));
        setNote('');
        setDuration(0);
        setPerformedAt(toLocalInputValue(new Date()));
        onCreated?.();
        // Redirect to home page after toast notification
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        }, 2000);
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
                    return String(def.defaultAmount);
                  });
                }}
                className={`text-left rounded-lg border px-3 py-2 shadow-card transition-all duration-200 ${
                  active
                    ? 'border-brand ring-2 ring-brand/30 bg-brand/5 scale-105'
                    : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900 hover:scale-102 hover:shadow-md'
                }`}
                aria-pressed={active}
                aria-label={t('form.selectActivityLabel', { activity: getActivityLabel(def, lang) })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActivityKey(def.key);
                    setAmount(String(def.defaultAmount));
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xl">{def.icon}</div>
                  <div className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
                    {def.multiplier}x
                  </div>
                </div>
                <div className="mt-2 text-sm font-medium">{getActivityLabel(def, lang)}</div>
                <div className="text-xs text-gray-500">
                  {def.defaultAmount} {getActivityUnit(def, lang)}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="space-y-1 min-w-0 max-w-full">
          <div className="text-sm text-gray-700">{t('form.datetime')}</div>
          <input
            type="datetime-local"
            value={performedAt}
            onChange={(e) => setPerformedAt(e.target.value)}
            className="w-full border rounded-lg px-3 py-3 min-h-[44px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 min-w-0 max-w-full text-sm"
            required
          />
        </label>
      </div>
      <div className="space-y-3">
        <label className="space-y-1 block">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {t('form.amount')} ({getActivityUnit(definition, lang)})
          </div>
          <input
            type="number"
            min={1}
            step={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded-lg px-3 py-3 min-h-[44px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-sm"
            required
            aria-label={`${t('form.amount')} (${getActivityUnit(definition, lang)})`}
            aria-describedby={getActivityDescription(definition, lang) ? 'amount-description' : undefined}
          />
          {getActivityDescription(definition, lang) ? (
            <div id="amount-description" className="text-xs text-gray-500 dark:text-gray-400" role="note">
              {getActivityDescription(definition, lang)}
            </div>
          ) : null}
          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
            <span>{definition.multiplier}x</span>
            <span>·</span>
            <span>{t('form.points')}: {pointsDisplay}</span>
          </div>
        </label>
      </div>
      {!isEditing && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <ActivityTimer
            onDurationChange={setDuration}
            initialDuration={duration}
          />
        </div>
      )}
      <label className="space-y-1 block">
        <div className="text-sm text-gray-700">{t('form.noteOptional')}</div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border rounded-lg px-3 py-3 min-h-[88px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-sm"
          rows={3}
          placeholder={t('form.notePlaceholder')}
          aria-label={t('form.noteOptional')}
        />
      </label>
      <div className={`flex items-center gap-2 ${isMobile && !isEditing ? 'flex-col' : ''}`}>
        <button
          type="submit"
          disabled={loading}
          className={`${isMobile && !isEditing ? 'w-full' : ''} px-4 py-3 min-h-[44px] rounded-lg bg-brand text-white hover:bg-brand-dark text-sm font-medium disabled:opacity-50 shadow transition-all duration-200 active:scale-95 disabled:hover:scale-100`}
          aria-label={loading ? t('form.loading') : isEditing ? t('form.save') : t('form.add')}
          aria-busy={loading}
        >
          {loading ? '...' : isEditing ? t('form.save') : t('form.add')}
        </button>
        {isEditing ? (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 min-h-[44px] rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200 active:scale-95"
          >
            {t('form.cancel')}
          </button>
        ) : null}
      </div>
    </form>
  );
}

