'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import {
  PRESET_CHALLENGES,
  createChallengeFromPreset,
  PresetChallenge,
} from '@/lib/presetChallenges';
import { useChallenges } from '@/lib/challengeStore';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';
import { useToaster } from '@/components/Toaster';

export function PresetChallenges() {
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const { addChallenge } = useChallenges();
  const { triggerHaptic } = useHapticFeedback();
  const { showToast } = useToaster();
  const [selectedCategory, setSelectedCategory] = useState<PresetChallenge['category'] | 'all'>(
    'all'
  );

  const categories: Array<{
    id: PresetChallenge['category'] | 'all';
    label: { tr: string; en: string };
    icon: string;
  }> = [
    { id: 'all', label: { tr: 'Tümü', en: 'All' }, icon: '📋' },
    { id: 'motivation', label: { tr: 'Motivasyon', en: 'Motivation' }, icon: '🚀' },
    { id: 'achievement', label: { tr: 'Başarı', en: 'Achievement' }, icon: '🏆' },
    { id: 'consistency', label: { tr: 'Tutarlılık', en: 'Consistency' }, icon: '🔥' },
    { id: 'milestone', label: { tr: 'Kilometre Taşı', en: 'Milestone' }, icon: '🎯' },
    { id: 'special', label: { tr: 'Özel', en: 'Special' }, icon: '⭐' },
  ];

  const filteredPresets =
    selectedCategory === 'all'
      ? PRESET_CHALLENGES
      : PRESET_CHALLENGES.filter((preset) => preset.category === selectedCategory);

  const handleAddPreset = (preset: PresetChallenge) => {
    try {
      const challenge = createChallengeFromPreset(preset);
      addChallenge(challenge);
      triggerHaptic('success');
      showToast(
        lang === 'tr' ? `${preset.name.tr} eklendi!` : `${preset.name.en} added!`,
        'success'
      );
    } catch (error) {
      console.error('Failed to add preset challenge:', error);
      triggerHaptic('error');
      showToast(lang === 'tr' ? 'Hedef eklenirken hata oluştu' : 'Error adding challenge', 'error');
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-950 dark:text-white mb-3">
          {lang === 'tr' ? 'Hazır Hedefler' : 'Preset Challenges'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {lang === 'tr'
            ? 'Hızlıca ekleyebileceğiniz hazır hedef şablonları'
            : 'Ready-to-use challenge templates you can quickly add'}
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedCategory(category.id);
                triggerHaptic('light');
              }}
              icon={category.icon}
            >
              {category.label[lang]}
            </Button>
          ))}
        </div>
      </div>

      {/* Preset Challenges Grid */}
      <div
        className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-4`}
      >
        {filteredPresets.map((preset) => (
          <Card
            key={preset.id}
            variant="default"
            size="md"
            hoverable
            clickable={false}
            className="chart-container card-entrance gpu-accelerated"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">{preset.icon}</span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-1">
                  {preset.name[lang]}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {preset.description[lang]}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {lang === 'tr' ? 'Hedef' : 'Target'}
                    </div>
                    <div className="text-lg font-bold text-brand">
                      {preset.target.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}{' '}
                      {lang === 'tr' ? 'puan' : 'points'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {lang === 'tr' ? 'Tip' : 'Type'}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t(`challenges.${preset.type}`)}
                    </div>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => handleAddPreset(preset)}
                  icon="➕"
                >
                  {lang === 'tr' ? 'Ekle' : 'Add'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
