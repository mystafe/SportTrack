'use client';

import { useState, lazy, Suspense, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useChallenges } from '@/lib/challengeStore';
import { Challenge, ChallengeType } from '@/lib/challenges';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PageSkeleton, ChallengeCardSkeleton } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/EmptyState';
import { Accordion } from '@/components/ui/Accordion';
import { PRESET_CHALLENGES } from '@/lib/presetChallenges';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';
import { useToaster } from '@/components/Toaster';
import { PullToRefresh } from '@/components/PullToRefresh';

// Lazy load challenge components
const ChallengeCard = lazy(() =>
  import('@/components/ChallengeCard').then((m) => ({ default: m.ChallengeCard }))
);
const ChallengeDialog = lazy(() =>
  import('@/components/ChallengeDialog').then((m) => ({ default: m.ChallengeDialog }))
);
const PresetChallenges = lazy(() =>
  import('@/components/PresetChallenges').then((m) => ({ default: m.PresetChallenges }))
);

type ChallengeCategory =
  | 'motivation'
  | 'achievement'
  | 'consistency'
  | 'milestone'
  | 'special'
  | 'custom'
  | 'all';

export default function ChallengesPage() {
  const { challenges, hydrated, addChallenge, updateChallenge, deleteChallenge } = useChallenges();
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const { triggerHaptic } = useHapticFeedback();
  const { showToast } = useToaster();
  const [showDialog, setShowDialog] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [deletingChallenge, setDeletingChallenge] = useState<Challenge | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<ChallengeCategory>('all');

  // Helper function to get category from challenge
  const getChallengeCategory = (challenge: Challenge): ChallengeCategory | null => {
    // First check if challenge has category field
    if (challenge.category) {
      return challenge.category as ChallengeCategory;
    }
    // Daily, weekly, yearly challenges should be visible in 'all' filter
    // They don't have a specific category, so return null (will be filtered out unless 'all' is selected)
    if (
      challenge.id.startsWith('daily-') ||
      challenge.id.startsWith('weekly-') ||
      challenge.id.startsWith('yearly-')
    ) {
      // These are default/system challenges, show them in 'all' filter
      return null; // null means show in 'all' filter only
    }
    // Fallback to preset lookup
    if (challenge.id.startsWith('preset-')) {
      const preset = PRESET_CHALLENGES.find(
        (p) => challenge.id.startsWith(p.id + '-') || challenge.id === p.id
      );
      return preset ? (preset.category as ChallengeCategory) : null;
    }
    // Check if it's a custom challenge
    if (!challenge.id.startsWith('preset-') && challenge.type === 'custom') {
      return 'custom';
    }
    return null;
  };

  // Check if challenge is custom (user-created, not auto-generated)
  const isCustomChallenge = (challenge: Challenge): boolean => {
    // Check if challenge has custom category (manually created)
    if (challenge.category === 'custom') {
      return true;
    }
    // Also check if it's a custom type and not auto-generated
    return (
      challenge.type === 'custom' &&
      !challenge.id.startsWith('preset-') &&
      !challenge.id.startsWith('daily-') &&
      !challenge.id.startsWith('weekly-') &&
      !challenge.id.startsWith('yearly-')
    );
  };

  // Memoize filtered challenges to prevent unnecessary re-renders
  // IMPORTANT: These hooks must be called before any conditional returns
  // Sort: custom challenges first, then others (by createdAt desc for custom, then others)
  const activeChallenges = useMemo(() => {
    const active = challenges.filter((c) => c.status === 'active');
    return active.sort((a, b) => {
      const aIsCustom = isCustomChallenge(a);
      const bIsCustom = isCustomChallenge(b);
      // Custom challenges first
      if (aIsCustom && !bIsCustom) return -1;
      if (!aIsCustom && bIsCustom) return 1;
      // Within custom challenges, newest first
      if (aIsCustom && bIsCustom) {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return bTime - aTime; // Descending (newest first)
      }
      // For non-custom, keep original order
      return 0;
    });
  }, [challenges]);

  // Filter active challenges by category (maintains sort order)
  const filteredActiveChallenges = useMemo(() => {
    if (activeCategoryFilter === 'all') return activeChallenges;
    return activeChallenges.filter((c) => {
      const category = getChallengeCategory(c);
      // If category is null (daily/weekly/yearly), don't show in filtered view
      // They will only appear in 'all' filter
      return category === activeCategoryFilter;
    });
  }, [activeChallenges, activeCategoryFilter]);

  const completedChallenges = useMemo(
    () => challenges.filter((c) => c.status === 'completed'),
    [challenges]
  );
  const expiredChallenges = useMemo(
    () => challenges.filter((c) => c.status === 'expired' || c.status === 'failed'),
    [challenges]
  );

  if (!hydrated) {
    return (
      <main className="container py-6 sm:py-8" role="main" aria-label={t('nav.challenges')}>
        <PageSkeleton />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <ChallengeCardSkeleton key={i} />
          ))}
        </div>
      </main>
    );
  }

  const handleAddChallenge = () => {
    setEditingChallenge(null);
    setShowDialog(true);
  };

  const handleEditChallenge = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setShowDialog(true);
  };

  const handleDeleteChallenge = (challenge: Challenge) => {
    setDeletingChallenge(challenge);
  };

  const handleConfirmDelete = () => {
    if (deletingChallenge) {
      deleteChallenge(deletingChallenge.id);
      setDeletingChallenge(null);
    }
  };

  const handleSaveChallenge = (challenge: Challenge) => {
    try {
      if (editingChallenge) {
        updateChallenge(editingChallenge.id, challenge);
        triggerHaptic('success');
        showToast(lang === 'tr' ? 'Hedef güncellendi!' : 'Challenge updated!', 'success');
      } else {
        addChallenge(challenge);
        triggerHaptic('success');
        // Small delay to ensure challenge is added before showing toast
        setTimeout(() => {
          showToast(lang === 'tr' ? 'Hedef eklendi!' : 'Challenge added!', 'success');
        }, 100);
      }
      setShowDialog(false);
      setEditingChallenge(null);
    } catch (error) {
      console.error('Failed to save challenge:', error);
      showToast(
        lang === 'tr' ? 'Hedef kaydedilirken hata oluştu' : 'Error saving challenge',
        'error'
      );
    }
  };

  const handleRefresh = async () => {
    window.location.reload();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <main
        className="container py-6 sm:py-8 page-transition"
        role="main"
        aria-label={t('nav.challenges')}
      >
        <div className="mb-6">
          <h1
            className={`text-2xl sm:text-3xl font-bold flex items-center gap-2 mb-2 ${isMobile ? 'title-entrance' : ''}`}
          >
            <span
              className={`text-2xl sm:text-3xl ${isMobile ? 'emoji-celebrate' : 'emoji-bounce'}`}
            >
              🎯
            </span>
            <span className="text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Hedefler' : 'Goals'}
            </span>
          </h1>
          <p className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('challenges.subtitle')}
          </p>
        </div>

        {/* Create New Challenge Button - No Accordion */}
        <div className="mb-6">
          <Button
            type="button"
            variant="primary"
            size={isMobile ? 'sm' : 'md'}
            onClick={handleAddChallenge}
            className={`card-entrance ${isMobile ? 'touch-feedback mobile-press bounce-in-mobile' : 'btn-enhanced scale-on-interact'}`}
            fullWidth
          >
            + {t('challenges.addChallenge')}
          </Button>
        </div>

        {challenges.length === 0 ? (
          <EmptyState
            variant="challenges"
            title={t('challenges.noChallenges')}
            description={
              lang === 'tr'
                ? 'İlk hedefini oluştur ve başarıya ulaş!'
                : 'Create your first goal and achieve success!'
            }
            action={{
              label: `+ ${t('challenges.addChallenge')}`,
              onClick: handleAddChallenge,
              variant: 'primary',
            }}
          />
        ) : (
          <div className="space-y-4">
            {/* Active Challenges - No Accordion */}
            {activeChallenges.length > 0 && (
              <div className="space-y-6">
                {/* Category Filter - Tüm Aktif Hedefler İçin */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    {
                      id: 'all' as ChallengeCategory,
                      label: { tr: 'Tümü', en: 'All' },
                      icon: '📋',
                    },
                    {
                      id: 'custom' as ChallengeCategory,
                      label: { tr: 'Özel', en: 'Custom' },
                      icon: '✨',
                    },
                    {
                      id: 'motivation' as ChallengeCategory,
                      label: { tr: 'Motivasyon', en: 'Motivation' },
                      icon: '🚀',
                    },
                    {
                      id: 'achievement' as ChallengeCategory,
                      label: { tr: 'Başarı', en: 'Achievement' },
                      icon: '🏆',
                    },
                    {
                      id: 'consistency' as ChallengeCategory,
                      label: { tr: 'Tutarlılık', en: 'Consistency' },
                      icon: '🔥',
                    },
                    {
                      id: 'milestone' as ChallengeCategory,
                      label: { tr: 'Kilometre Taşı', en: 'Milestone' },
                      icon: '🎯',
                    },
                    {
                      id: 'special' as ChallengeCategory,
                      label: { tr: 'Özel', en: 'Special' },
                      icon: '⭐',
                    },
                  ].map((category) => (
                    <Button
                      key={category.id}
                      variant={activeCategoryFilter === category.id ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setActiveCategoryFilter(category.id);
                        triggerHaptic('light');
                      }}
                      icon={category.icon}
                    >
                      {category.label[lang]}
                    </Button>
                  ))}
                </div>

                {/* Dynamic Section Title Based on Filter */}
                {filteredActiveChallenges.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-950 dark:text-white mb-3">
                      {activeCategoryFilter === 'all'
                        ? lang === 'tr'
                          ? 'Tüm Hedefler'
                          : 'All Targets'
                        : activeCategoryFilter === 'custom'
                          ? lang === 'tr'
                            ? 'Özel Hedefler'
                            : 'Custom Targets'
                          : activeCategoryFilter === 'motivation'
                            ? lang === 'tr'
                              ? 'Motivasyon Hedefleri'
                              : 'Motivation Targets'
                            : activeCategoryFilter === 'achievement'
                              ? lang === 'tr'
                                ? 'Başarı Hedefleri'
                                : 'Achievement Targets'
                              : activeCategoryFilter === 'consistency'
                                ? lang === 'tr'
                                  ? 'Tutarlılık Hedefleri'
                                  : 'Consistency Targets'
                                : activeCategoryFilter === 'milestone'
                                  ? lang === 'tr'
                                    ? 'Kilometre Taşı Hedefleri'
                                    : 'Milestone Targets'
                                  : activeCategoryFilter === 'special'
                                    ? lang === 'tr'
                                      ? 'Özel Hedefler'
                                      : 'Special Targets'
                                    : lang === 'tr'
                                      ? 'Hedefler'
                                      : 'Targets'}
                    </h3>
                    <div
                      className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} gap-4`}
                    >
                      {filteredActiveChallenges.map((challenge, index) => (
                        <Suspense
                          key={`${challenge.id}-${index}`}
                          fallback={<ChallengeCardSkeleton />}
                        >
                          <ChallengeCard
                            challenge={challenge}
                            onEdit={() => handleEditChallenge(challenge)}
                            onDelete={() => handleDeleteChallenge(challenge)}
                          />
                        </Suspense>
                      ))}
                    </div>
                  </div>
                ) : activeCategoryFilter !== 'all' ? (
                  <EmptyState
                    variant="challenges"
                    title={
                      lang === 'tr'
                        ? 'Bu kategoride hedef bulunamadı'
                        : 'No challenges in this category'
                    }
                    description={
                      lang === 'tr'
                        ? 'Farklı bir kategori seçin veya yeni hedef oluşturun'
                        : 'Select a different category or create a new challenge'
                    }
                  />
                ) : null}
              </div>
            )}

            {/* Preset Challenges - Accordion - HIDDEN: Preset challenges are now automatically active */}
            {/* Preset challenges are automatically added to active challenges, so no need for separate section */}

            {/* Completed Challenges - Accordion */}
            {completedChallenges.length > 0 && (
              <Accordion
                title={`${t('challenges.completed')} (${completedChallenges.length})`}
                icon="✅"
                defaultOpen={false}
                className="card-entrance"
              >
                <div
                  className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} gap-4`}
                >
                  {completedChallenges.map((challenge, index) => (
                    <Suspense key={`${challenge.id}-${index}`} fallback={<ChallengeCardSkeleton />}>
                      <ChallengeCard
                        challenge={challenge}
                        onEdit={() => handleEditChallenge(challenge)}
                        onDelete={() => handleDeleteChallenge(challenge)}
                      />
                    </Suspense>
                  ))}
                </div>
              </Accordion>
            )}

            {/* Expired Challenges - Accordion */}
            {expiredChallenges.length > 0 && (
              <Accordion
                title={`${t('challenges.expired')} (${expiredChallenges.length})`}
                icon="⏰"
                defaultOpen={false}
                className="card-entrance"
              >
                <div
                  className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} gap-4`}
                >
                  {expiredChallenges.map((challenge, index) => (
                    <Suspense key={`${challenge.id}-${index}`} fallback={<ChallengeCardSkeleton />}>
                      <ChallengeCard
                        challenge={challenge}
                        onEdit={() => handleEditChallenge(challenge)}
                        onDelete={() => handleDeleteChallenge(challenge)}
                      />
                    </Suspense>
                  ))}
                </div>
              </Accordion>
            )}
          </div>
        )}

        {showDialog && (
          <Suspense fallback={null}>
            <ChallengeDialog
              open={showDialog}
              challenge={editingChallenge}
              onClose={() => {
                setShowDialog(false);
                setEditingChallenge(null);
              }}
              onSave={handleSaveChallenge}
            />
          </Suspense>
        )}

        <ConfirmDialog
          open={!!deletingChallenge}
          title={t('challenges.deleteChallenge')}
          message={t('challenges.deleteConfirm')}
          variant="danger"
          confirmLabel={t('form.confirm')}
          cancelLabel={t('form.cancel')}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingChallenge(null)}
        />
      </main>
    </PullToRefresh>
  );
}
