'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/lib/settingsStore';
import { Challenge, ChallengeType, createDailyChallenge, createWeeklyChallenge, createMonthlyChallenge, createCustomChallenge } from '@/lib/challenges';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

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
      <div className={`relative w-full ${isMobile ? 'max-w-full' : 'max-w-md'} rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl p-4 sm:p-6 space-y-4 my-auto`}>
        <div>
          <h2 className="text-lg font-semibold">
            {challenge ? t('challenges.editChallenge') : t('challenges.addChallenge')}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2">
              {t('challenges.custom')} / {t('challenges.daily')} / {t('challenges.weekly')} / {t('challenges.monthly')}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ChallengeType)}
              className="w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900"
            >
              <option value="daily">{t('challenges.daily')}</option>
              <option value="weekly">{t('challenges.weekly')}</option>
              <option value="monthly">{t('challenges.monthly')}</option>
              <option value="custom">{t('challenges.custom')}</option>
            </select>
          </div>

          {type === 'custom' && (
            <>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2">
                  {t('challenges.name')} (TR)
                </label>
                <input
                  type="text"
                  value={nameTr}
                  onChange={(e) => setNameTr(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2">
                  {t('challenges.name')} (EN)
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2">
                  {t('challenges.description')} (TR)
                </label>
                <textarea
                  value={descriptionTr}
                  onChange={(e) => setDescriptionTr(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2">
                  {t('challenges.description')} (EN)
                </label>
                <textarea
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900"
                  rows={2}
                />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2">
              {t('challenges.targetPoints')}
            </label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900"
              min="1"
              required
            />
          </div>

          {type === 'custom' && (
            <>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2">
                  {t('challenges.startDate')}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2">
                  {t('challenges.endDate')}
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-2">
              Emoji/Icon
            </label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900"
              placeholder="🎯"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              {t('challenges.cancel')}
            </button>
            <button
              type="submit"
              className="px-3 py-2 text-xs rounded bg-brand text-white hover:bg-brand-dark shadow"
            >
              {t('challenges.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(dialog, document.body) : null;
}

