'use client';

import { useState, lazy, Suspense } from 'react';
import { useI18n } from '@/lib/i18n';
import { useChallenges } from '@/lib/challengeStore';
import { Challenge, ChallengeType } from '@/lib/challenges';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PageSkeleton, ChallengeCardSkeleton } from '@/components/LoadingSkeleton';

// Lazy load challenge components
const ChallengeCard = lazy(() =>
  import('@/components/ChallengeCard').then((m) => ({ default: m.ChallengeCard }))
);
const ChallengeDialog = lazy(() =>
  import('@/components/ChallengeDialog').then((m) => ({ default: m.ChallengeDialog }))
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
      <div className="container py-6 sm:py-8">
        <PageSkeleton />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <ChallengeCardSkeleton key={i} />
          ))}
        </div>
      </div>
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
    <div className="container py-6 sm:py-8 page-transition">
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
        <button
          type="button"
          onClick={handleAddChallenge}
          className={`px-4 py-2 bg-gradient-to-r from-brand to-brand-dark text-white rounded-lg hover:from-brand-dark hover:to-brand font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-xl ${isMobile ? 'touch-feedback mobile-press bounce-in-mobile' : 'btn-enhanced scale-on-interact'}`}
        >
          + {t('challenges.addChallenge')}
        </button>
      </div>

      {challenges.length === 0 ? (
        <div className="card-entrance text-center py-16 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 shadow-md hover:shadow-xl transition-shadow duration-300">
          <div
            className={`${isMobile ? 'text-5xl' : 'text-6xl'} mb-4 ${isMobile ? 'emoji-celebrate' : 'emoji-bounce'}`}
          >
            🎯
          </div>
          <p
            className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-950 dark:text-gray-100 mb-2`}
          >
            {t('challenges.noChallenges')}
          </p>
          <p
            className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600 dark:text-gray-400 mb-6`}
          >
            {lang === 'tr'
              ? 'İlk hedefini oluştur ve başarıya ulaş!'
              : 'Create your first goal and achieve success!'}
          </p>
          <button
            type="button"
            onClick={handleAddChallenge}
            className={`px-6 py-3 bg-gradient-to-r from-brand to-brand-dark text-white rounded-lg hover:from-brand-dark hover:to-brand font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-xl ${isMobile ? 'touch-feedback mobile-press bounce-in-mobile' : 'btn-enhanced scale-on-interact'}`}
          >
            + {t('challenges.addChallenge')}
          </button>
        </div>
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
    </div>
  );
}
