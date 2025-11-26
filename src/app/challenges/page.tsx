'use client';

import { useState, lazy, Suspense } from 'react';
import { useI18n } from '@/lib/i18n';
import { useChallenges } from '@/lib/challengeStore';
import { Challenge, ChallengeType } from '@/lib/challenges';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PageSkeleton, ChallengeCardSkeleton } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/EmptyState';

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

export default function ChallengesPage() {
  const { challenges, hydrated, addChallenge, updateChallenge, deleteChallenge } = useChallenges();
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const [showDialog, setShowDialog] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [deletingChallenge, setDeletingChallenge] = useState<Challenge | null>(null);

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

  const activeChallenges = challenges.filter((c) => c.status === 'active');
  const completedChallenges = challenges.filter((c) => c.status === 'completed');
  const expiredChallenges = challenges.filter(
    (c) => c.status === 'expired' || c.status === 'failed'
  );

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
    if (editingChallenge) {
      updateChallenge(editingChallenge.id, challenge);
    } else {
      addChallenge(challenge);
    }
    setShowDialog(false);
    setEditingChallenge(null);
  };

  return (
    <main
      className="container py-6 sm:py-8 page-transition"
      role="main"
      aria-label={t('nav.challenges')}
    >
      <div className="mb-6">
        <h1
          className={`text-2xl sm:text-3xl font-bold flex items-center gap-2 mb-2 ${isMobile ? 'title-entrance' : ''}`}
        >
          <span className={`text-2xl sm:text-3xl ${isMobile ? 'emoji-celebrate' : 'emoji-bounce'}`}>
            🎯
          </span>
          <span className="text-gray-950 dark:text-white">{t('challenges.title')}</span>
        </h1>
        <p className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
          {t('challenges.subtitle')}
        </p>
      </div>

      <div className="mb-6">
        <Button
          type="button"
          variant="primary"
          size={isMobile ? 'sm' : 'md'}
          onClick={handleAddChallenge}
          className={`${isMobile ? 'touch-feedback mobile-press bounce-in-mobile' : 'btn-enhanced scale-on-interact'}`}
        >
          + {t('challenges.addChallenge')}
        </Button>
      </div>

      {/* Preset Challenges */}
      <Suspense fallback={<div className="h-32 skeleton rounded-lg mb-8" />}>
        <PresetChallenges />
      </Suspense>

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
        <div className="space-y-8">
          {activeChallenges.length > 0 && (
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white mb-4">
                {t('challenges.active')}
              </h2>
              <div
                className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} gap-4`}
              >
                {activeChallenges.map((challenge) => (
                  <Suspense key={challenge.id} fallback={<ChallengeCardSkeleton />}>
                    <ChallengeCard
                      challenge={challenge}
                      onEdit={() => handleEditChallenge(challenge)}
                      onDelete={() => handleDeleteChallenge(challenge)}
                    />
                  </Suspense>
                ))}
              </div>
            </div>
          )}

          {completedChallenges.length > 0 && (
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white mb-4">
                {t('challenges.completed')}
              </h2>
              <div
                className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} gap-4`}
              >
                {completedChallenges.map((challenge) => (
                  <Suspense key={challenge.id} fallback={<ChallengeCardSkeleton />}>
                    <ChallengeCard
                      challenge={challenge}
                      onEdit={() => handleEditChallenge(challenge)}
                      onDelete={() => handleDeleteChallenge(challenge)}
                    />
                  </Suspense>
                ))}
              </div>
            </div>
          )}

          {expiredChallenges.length > 0 && (
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white mb-4">
                {t('challenges.expired')}
              </h2>
              <div
                className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} gap-4`}
              >
                {expiredChallenges.map((challenge) => (
                  <Suspense key={challenge.id} fallback={<ChallengeCardSkeleton />}>
                    <ChallengeCard
                      challenge={challenge}
                      onEdit={() => handleEditChallenge(challenge)}
                      onDelete={() => handleDeleteChallenge(challenge)}
                    />
                  </Suspense>
                ))}
              </div>
            </div>
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
  );
}
