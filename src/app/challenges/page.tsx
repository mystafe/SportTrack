'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useChallenges } from '@/lib/challengeStore';
import { Challenge, ChallengeType } from '@/lib/challenges';
import { ChallengeCard } from '@/components/ChallengeCard';
import { ChallengeDialog } from '@/components/ChallengeDialog';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export default function ChallengesPage() {
  const { challenges, hydrated, addChallenge, updateChallenge, deleteChallenge } = useChallenges();
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const [showDialog, setShowDialog] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [deletingChallenge, setDeletingChallenge] = useState<Challenge | null>(null);

  if (!hydrated) {
    return (
      <div className="container py-8">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  const activeChallenges = challenges.filter(c => c.status === 'active');
  const completedChallenges = challenges.filter(c => c.status === 'completed');
  const expiredChallenges = challenges.filter(c => c.status === 'expired' || c.status === 'failed');

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
    <div className="container py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('challenges.title')}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('challenges.subtitle')}
        </p>
      </div>

      <div className="mb-6">
        <button
          type="button"
          onClick={handleAddChallenge}
          className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
        >
          + {t('challenges.addChallenge')}
        </button>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">{t('challenges.noChallenges')}</p>
          <button
            type="button"
            onClick={handleAddChallenge}
            className="text-brand hover:underline"
          >
            {t('challenges.createFirst')}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {activeChallenges.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('challenges.active')}
              </h2>
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} gap-4`}>
                {activeChallenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onEdit={() => handleEditChallenge(challenge)}
                    onDelete={() => handleDeleteChallenge(challenge)}
                  />
                ))}
              </div>
            </div>
          )}

          {completedChallenges.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('challenges.completed')}
              </h2>
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} gap-4`}>
                {completedChallenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onEdit={() => handleEditChallenge(challenge)}
                    onDelete={() => handleDeleteChallenge(challenge)}
                  />
                ))}
              </div>
            </div>
          )}

          {expiredChallenges.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('challenges.expired')}
              </h2>
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} gap-4`}>
                {expiredChallenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onEdit={() => handleEditChallenge(challenge)}
                    onDelete={() => handleDeleteChallenge(challenge)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <ChallengeDialog
        open={showDialog}
        challenge={editingChallenge}
        onClose={() => {
          setShowDialog(false);
          setEditingChallenge(null);
        }}
        onSave={handleSaveChallenge}
      />

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

