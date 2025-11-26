'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/lib/settingsStore';
import {
  Challenge,
  ChallengeType,
  createDailyChallenge,
  createWeeklyChallenge,
  createMonthlyChallenge,
  createYearlyChallenge,
  createSeasonalChallenge,
  createActivitySpecificChallenge,
  createTimeBasedChallenge,
  createStreakBasedChallenge,
  createCustomChallenge,
} from '@/lib/challenges';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

interface ChallengeDialogProps {
  open: boolean;
  challenge: Challenge | null;
  onClose: () => void;
  onSave: (challenge: Challenge) => void;
}

function toLocalInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function ChallengeDialog({ open, challenge, onClose, onSave }: ChallengeDialogProps) {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const isMobile = useIsMobile();
  const [type, setType] = useState<ChallengeType>('daily');
  const [nameTr, setNameTr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descriptionTr, setDescriptionTr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [target, setTarget] = useState('');
  const [startDate, setStartDate] = useState(toLocalInputValue(new Date()));
  const [endDate, setEndDate] = useState(toLocalInputValue(new Date()));
  const [icon, setIcon] = useState('🎯');

  useEffect(() => {
    if (challenge) {
      setType(challenge.type);
      setNameTr(challenge.name.tr);
      setNameEn(challenge.name.en);
      setDescriptionTr(challenge.description.tr);
      setDescriptionEn(challenge.description.en);
      setTarget(String(challenge.target));
      setStartDate(toLocalInputValue(new Date(challenge.startDate)));
      if (challenge.endDate) {
        setEndDate(toLocalInputValue(new Date(challenge.endDate)));
      }
      setIcon(challenge.icon || '🎯');
    } else {
      // Reset form
      setType('daily');
      setNameTr('');
      setNameEn('');
      setDescriptionTr('');
      setDescriptionEn('');
      setTarget(String(settings?.dailyTarget ?? 10000));
      setStartDate(toLocalInputValue(new Date()));
      setEndDate(toLocalInputValue(new Date()));
      setIcon('🎯');
    }
  }, [challenge, settings?.dailyTarget]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const targetValue = Number(target);
    if (!targetValue || targetValue <= 0) {
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    let newChallenge: Challenge;

    switch (type) {
      case 'daily':
        newChallenge = createDailyChallenge(
          { tr: nameTr || t('challenges.daily'), en: nameEn || 'Daily' },
          targetValue,
          start,
          icon
        );
        break;
      case 'weekly':
        newChallenge = createWeeklyChallenge(
          { tr: nameTr || t('challenges.weekly'), en: nameEn || 'Weekly' },
          targetValue,
          start,
          icon
        );
        break;
      case 'monthly':
        newChallenge = createMonthlyChallenge(
          { tr: nameTr || t('challenges.monthly'), en: nameEn || 'Monthly' },
          targetValue,
          start,
          icon
        );
        break;
      case 'yearly':
        newChallenge = createYearlyChallenge(
          { tr: nameTr || t('challenges.yearly'), en: nameEn || 'Yearly' },
          targetValue,
          start,
          icon
        );
        break;
      case 'seasonal':
        newChallenge = createSeasonalChallenge(
          { tr: nameTr || t('challenges.seasonal'), en: nameEn || 'Seasonal' },
          targetValue,
          start,
          icon
        );
        break;
      case 'activity_specific':
        newChallenge = createActivitySpecificChallenge(
          { tr: nameTr || t('challenges.activity_specific'), en: nameEn || 'Activity Specific' },
          { tr: descriptionTr || '', en: descriptionEn || '' },
          targetValue,
          'custom', // Activity key - would need to be selected from UI
          start,
          end,
          icon
        );
        break;
      case 'time_based':
        newChallenge = createTimeBasedChallenge(
          { tr: nameTr || t('challenges.time_based'), en: nameEn || 'Time Based' },
          { tr: descriptionTr || '', en: descriptionEn || '' },
          targetValue,
          6, // Start hour - would need to be selected from UI
          9, // End hour - would need to be selected from UI
          start,
          end,
          icon
        );
        break;
      case 'streak_based':
        newChallenge = createStreakBasedChallenge(
          { tr: nameTr || t('challenges.streak_based'), en: nameEn || 'Streak Based' },
          { tr: descriptionTr || '', en: descriptionEn || '' },
          targetValue, // For streak challenges, target is number of days
          start,
          undefined, // endDate - will be calculated automatically
          icon
        );
        break;
      case 'custom':
        if (!nameTr && !nameEn) {
          return;
        }
        newChallenge = createCustomChallenge(
          { tr: nameTr, en: nameEn },
          { tr: descriptionTr, en: descriptionEn },
          targetValue,
          start,
          end,
          icon
        );
        break;
    }

    onSave(newChallenge);
  };

  const dialog = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 py-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`relative w-full ${isMobile ? 'max-w-full' : 'max-w-md'} rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 shadow-2xl hover:shadow-3xl transition-shadow duration-300 p-4 sm:p-6 space-y-4 my-auto`}
      >
        <div>
          <h2 className="text-lg font-bold text-gray-950 dark:text-white">
            {challenge ? t('challenges.editChallenge') : t('challenges.addChallenge')}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label={`${t('challenges.daily')} / ${t('challenges.weekly')} / ${t('challenges.monthly')} / ${t('challenges.yearly')} / ${t('challenges.seasonal')} / ${t('challenges.activity_specific')} / ${t('challenges.time_based')} / ${t('challenges.streak_based')} / ${t('challenges.custom')}`}
            value={type}
            onChange={(e) => setType(e.target.value as ChallengeType)}
            size={isMobile ? 'sm' : 'md'}
            options={[
              { value: 'daily', label: t('challenges.daily') },
              { value: 'weekly', label: t('challenges.weekly') },
              { value: 'monthly', label: t('challenges.monthly') },
              { value: 'yearly', label: t('challenges.yearly') },
              { value: 'seasonal', label: t('challenges.seasonal') },
              { value: 'activity_specific', label: t('challenges.activity_specific') },
              { value: 'time_based', label: t('challenges.time_based') },
              { value: 'streak_based', label: t('challenges.streak_based') },
              { value: 'custom', label: t('challenges.custom') },
            ]}
          />

          {type === 'custom' && (
            <>
              <Input
                type="text"
                label={`${t('challenges.name')} (TR)`}
                value={nameTr}
                onChange={(e) => setNameTr(e.target.value)}
                required
                size={isMobile ? 'sm' : 'md'}
              />
              <Input
                type="text"
                label={`${t('challenges.name')} (EN)`}
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                required
                size={isMobile ? 'sm' : 'md'}
              />
              <Textarea
                label={`${t('challenges.description')} (TR)`}
                value={descriptionTr}
                onChange={(e) => setDescriptionTr(e.target.value)}
                rows={2}
                size={isMobile ? 'sm' : 'md'}
              />
              <Textarea
                label={`${t('challenges.description')} (EN)`}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                rows={2}
                size={isMobile ? 'sm' : 'md'}
              />
            </>
          )}

          <Input
            type="number"
            label={t('challenges.targetPoints')}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            min="1"
            required
            size={isMobile ? 'sm' : 'md'}
          />

          {type === 'custom' && (
            <>
              <Input
                type="date"
                label={t('challenges.startDate')}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                size={isMobile ? 'sm' : 'md'}
              />
              <Input
                type="date"
                label={t('challenges.endDate')}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                size={isMobile ? 'sm' : 'md'}
              />
            </>
          )}

          <Input
            type="text"
            label="Emoji/Icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="🎯"
            size={isMobile ? 'sm' : 'md'}
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size={isMobile ? 'sm' : 'md'} onClick={onClose}>
              {t('challenges.cancel')}
            </Button>
            <Button type="submit" variant="primary" size={isMobile ? 'sm' : 'md'}>
              {t('challenges.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(dialog, document.body) : null;
}
