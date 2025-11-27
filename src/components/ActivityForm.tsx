'use client';

import { useEffect, useMemo, useState, memo } from 'react';
import { useRouter } from 'next/navigation';
import { ActivityDefinition, ActivityKey } from '@/lib/activityConfig';
import { useI18n } from '@/lib/i18n';
import { ActivityRecord, useActivities } from '@/lib/activityStore';
import { useActivityDefinitions, useSettings } from '@/lib/settingsStore';
import { getActivityLabel, getActivityUnit, getActivityDescription } from '@/lib/activityUtils';
import { useToaster } from '@/components/Toaster';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Accordion } from '@/components/ui/Accordion';
import { useBadges } from '@/lib/badgeStore';
import { useLevel } from '@/lib/levelStore';
import { useChallenges } from '@/lib/challengeStore';
import { notificationService } from '@/lib/notificationService';

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
  preselectedActivityKey?: ActivityKey;
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
    isCustom: record.isCustom ?? true,
  };
}

export const ActivityForm = memo(function ActivityForm({
  onCreated,
  onSaved,
  onCancel,
  initial,
  preselectedActivityKey,
}: ActivityFormProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { triggerHaptic } = useHapticFeedback();
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
    initial?.activityKey ?? preselectedActivityKey ?? definitions[0]?.key ?? 'WALKING'
  );
  const [performedAt, setPerformedAt] = useState<string>(
    initial?.performedAt ? toLocalInputValue(new Date(initial.performedAt)) : ''
  );
  const [amount, setAmount] = useState<string>(
    initial?.amount
      ? String(initial.amount)
      : String(fallbackDefinition?.defaultAmount ?? definitions[0]?.defaultAmount ?? 10)
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

  const amountNumeric = Number(amount) || 0;
  const pointsNumeric = Math.max(0, Math.round(amountNumeric * definition.multiplier));
  const pointsDisplay = numberFormatter.format(pointsNumeric);
  const isEditing = Boolean(initial?.id);

  useEffect(() => {
    if (initial) {
      setActivityKey(initial.activityKey);
      setAmount(String(initial.amount));
      setNote(initial.note ?? '');
      setPerformedAt(toLocalInputValue(new Date(initial.performedAt)));
    } else if (preselectedActivityKey && definitionMap[preselectedActivityKey]) {
      const preselected = definitionMap[preselectedActivityKey];
      setActivityKey(preselectedActivityKey);
      setAmount(String(preselected.defaultAmount ?? 10));
      setNote('');
      setPerformedAt(toLocalInputValue(new Date()));
    } else {
      const first = definitions[0];
      setActivityKey(first?.key ?? 'WALKING');
      setAmount(String(first?.defaultAmount ?? 10));
      setNote('');
      setPerformedAt('');
    }
  }, [initial, preselectedActivityKey, definitions, definitionMap]);

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
        const errorMsg =
          lang === 'tr' ? 'Lütfen bir aktivite seçin.' : 'Please select an activity.';
        showToast(errorMsg, 'error');
        setLoading(false);
        return;
      }
      const amountValue = Number(amount) || 0;
      if (amountValue <= 0) {
        const errorMsg =
          lang === 'tr'
            ? "Miktar 0'dan büyük bir sayı olmalıdır."
            : 'Amount must be a number greater than 0.';
        showToast(errorMsg, 'error');
        setLoading(false);
        return;
      }
      if (initial?.id) {
        updateActivity(initial.id, {
          definition,
          amount: amountValue,
          note: note || undefined,
          performedAt: performedAtISO,
        });
        showToast(t('toast.activityUpdated'), 'success');
        onSaved?.();
        onCancel?.();
      } else {
        triggerHaptic('success');
        addActivity({
          definition,
          amount: amountValue,
          note: note || undefined,
          performedAt: performedAtISO,
        });
        showToast(t('toast.activityAdded'), 'success');

        // Check for new badges and level up
        setTimeout(() => {
          const newBadges = checkNewBadges();
          if (newBadges.length > 0) {
            // Badge unlock notification will be shown by BadgeUnlockNotification component
            newBadges.forEach((badge) => {
              notificationService.showBadgeUnlocked(
                lang as 'tr' | 'en',
                badge.name[lang],
                badge.icon
              );
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
            completedChallenges.forEach((challenge) => {
              showToast(
                `${challenge.icon || '🎯'} ${t('challenges.completedMessage', { name: challenge.name[lang] })}`,
                'success'
              );
              notificationService.showChallengeCompleted(
                lang as 'tr' | 'en',
                challenge.name[lang],
                challenge.icon || '🎯'
              );
            });
          }

          // Navigate to homepage after adding activity
          router.push('/');
        }, 500);

        setAmount(String(definition.defaultAmount));
        setNote('');
        setPerformedAt(toLocalInputValue(new Date()));
        onCreated?.();
        // Only redirect if onCreated callback doesn't handle it
        if (!onCreated) {
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/';
            }
          }, 2000);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className={isMobile ? 'space-y-2' : 'space-y-3'}
      autoComplete="off"
      data-form-type="other"
      noValidate
    >
      {/* Activity Selection - Accordion */}
      <Accordion
        title={t('form.selectActivity')}
        icon="🏃"
        defaultOpen={true}
        variant="compact"
        className="card-entrance"
      >
        <div className={`grid grid-cols-3 sm:grid-cols-3 ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
          {definitions.map((def) => {
            const active = def.key === activityKey;
            return (
              <Button
                type="button"
                key={def.key}
                variant={active ? 'primary' : 'outline'}
                size={isMobile ? 'sm' : 'sm'}
                onClick={() => {
                  setActivityKey(def.key);
                  setAmount((current) => {
                    if (isEditing && initial?.activityKey === def.key) {
                      return current;
                    }
                    return String(def.defaultAmount);
                  });
                }}
                className={`activity-select-btn stagger-item ripple-effect magnetic-hover gpu-accelerated text-left ${isMobile ? 'rounded-lg' : 'rounded-xl'} ${isMobile ? 'px-1.5 py-1 min-h-[40px]' : 'px-2 py-1.5'} shadow-md hover:shadow-xl transition-all duration-300 ${
                  active
                    ? 'active ring-2 ring-brand/30 dark:ring-brand/20 scale-105'
                    : 'scale-on-interact'
                }`}
                aria-pressed={active}
                aria-label={t('form.selectActivityLabel', {
                  activity: getActivityLabel(def, lang),
                })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActivityKey(def.key);
                    setAmount(String(def.defaultAmount));
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`${isMobile ? 'text-sm' : 'text-base'} transition-transform duration-300 ${active ? 'activity-icon-pulse' : ''}`}
                  >
                    {def.icon}
                  </div>
                  <div
                    className={`${isMobile ? 'text-[10px] px-1 py-0.5' : 'text-xs px-1 py-0.5'} rounded-full bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 font-bold border border-gray-200 dark:border-gray-700`}
                  >
                    {def.multiplier}x
                  </div>
                </div>
                <div
                  className={`${isMobile ? 'mt-0.5' : 'mt-1'} ${isMobile ? 'text-xs' : 'text-xs'} font-bold transition-colors text-gray-950 dark:text-gray-100 leading-tight`}
                >
                  {getActivityLabel(def, lang)}
                </div>
                <div
                  className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-medium text-gray-600 dark:text-gray-400 leading-tight`}
                >
                  {def.defaultAmount} {getActivityUnit(def, lang)}
                </div>
              </Button>
            );
          })}
        </div>
      </Accordion>

      {/* Activity Details - Accordion */}
      <Accordion
        title={lang === 'tr' ? 'Aktivite Detayları' : 'Activity Details'}
        icon="📝"
        defaultOpen={true}
        variant="compact"
        className="card-entrance"
      >
        <div className={isMobile ? 'space-y-1.5' : 'space-y-2'}>
          {/* Amount Input */}
          <label className={`${isMobile ? 'space-y-0.5' : 'space-y-1'} block`}>
            <div
              className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 dark:text-gray-200`}
            >
              {t('form.amount')} ({getActivityUnit(definition, lang)})
            </div>
            <Input
              type="number"
              min={1}
              step={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              size={isMobile ? 'md' : 'md'}
              variant="default"
              fullWidth
              required
              autoComplete="off"
              data-form-type="other"
              data-lpignore="true"
              data-1p-ignore="true"
              aria-autocomplete="none"
              role="spinbutton"
              aria-label={`${t('form.amount')} (${getActivityUnit(definition, lang)})`}
              aria-describedby={
                getActivityDescription(definition, lang) ? 'amount-description' : undefined
              }
              name=""
              inputMode="decimal"
            />
          </label>

          {/* Description - Full Width */}
          {getActivityDescription(definition, lang) ? (
            <div
              id="amount-description"
              className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400 w-full`}
              role="note"
            >
              {getActivityDescription(definition, lang)}
            </div>
          ) : null}

          {/* Points Calculation - Full Width */}
          <div
            className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400 w-full flex items-center gap-2`}
          >
            <span>{definition.multiplier}x</span>
            <span>·</span>
            <span>
              {t('form.points')}: {pointsDisplay}
            </span>
          </div>

          {/* DateTime Input */}
          <label className={`${isMobile ? 'space-y-0.5' : 'space-y-1'} block`}>
            <div
              className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-800 dark:text-gray-200`}
            >
              {t('form.datetime')}
            </div>
            <input
              type="datetime-local"
              value={performedAt}
              onChange={(e) => setPerformedAt(e.target.value)}
              className={`input-enhanced w-full border-2 ${isMobile ? 'rounded-lg px-2.5 py-1.5 min-h-[40px] text-sm' : 'rounded-lg px-3 py-2 min-h-[40px] text-sm'} bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-200`}
              required
              autoComplete="off"
              data-form-type="other"
              data-lpignore="true"
              data-1p-ignore="true"
              aria-autocomplete="none"
              aria-label={t('form.datetime')}
              aria-required="true"
              name=""
              inputMode="none"
            />
          </label>
        </div>
      </Accordion>

      {/* Optional Note - Accordion */}
      <Accordion
        title={t('form.noteOptional')}
        icon="📄"
        defaultOpen={false}
        variant="compact"
        className="card-entrance"
      >
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onClick={(e) => {
            // Prevent form submission when clicking on textarea
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            // Prevent form submission when Enter is pressed in textarea
            // Allow Shift+Enter for new line
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onFocus={(e) => {
            // Prevent form submission when focusing on textarea
            e.stopPropagation();
          }}
          size={isMobile ? 'md' : 'md'}
          fullWidth
          rows={isMobile ? 2 : 2}
          placeholder={t('form.notePlaceholder')}
          aria-label={t('form.noteOptional')}
          autoComplete="off"
          data-form-type="other"
          data-lpignore="true"
          data-1p-ignore="true"
          aria-autocomplete="none"
          role="textbox"
          name="note"
        />
      </Accordion>

      {/* Submit Button */}
      <div
        className={`flex items-center ${isMobile ? 'gap-1.5' : 'gap-2'} ${isMobile && !isEditing ? 'flex-col' : ''} mt-1`}
      >
        <Button
          type="submit"
          variant="primary"
          size={isMobile ? 'sm' : 'md'}
          fullWidth={isMobile && !isEditing}
          disabled={loading}
          loading={loading}
          className="card-entrance"
          aria-label={loading ? t('form.loading') : isEditing ? t('form.save') : t('form.add')}
        >
          {isEditing ? t('form.save') : t('form.add')}
        </Button>
        {isEditing && (
          <Button
            type="button"
            variant="secondary"
            size={isMobile ? 'sm' : 'md'}
            onClick={onCancel}
            aria-label={t('form.cancel')}
          >
            {t('form.cancel')}
          </Button>
        )}
      </div>
    </form>
  );
});
