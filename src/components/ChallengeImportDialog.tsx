'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { useChallenges } from '@/lib/challengeStore';
import { Button } from '@/components/ui/Button';
import { extractChallengeFromUrl, createChallengeFromShare } from '@/lib/challengeShare';
import { Challenge } from '@/lib/challenges';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';

interface ChallengeImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport?: (challenge: Challenge) => void;
}

export function ChallengeImportDialog({ open, onClose, onImport }: ChallengeImportDialogProps) {
  const { t, lang } = useI18n();
  const { addChallenge } = useChallenges();
  const { triggerHaptic } = useHapticFeedback();
  const [shareableChallenge, setShareableChallenge] = useState<ReturnType<
    typeof extractChallengeFromUrl
  > | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    if (open) {
      const challenge = extractChallengeFromUrl();
      setShareableChallenge(challenge);
    }
  }, [open]);

  const handleImport = async () => {
    if (!shareableChallenge) return;

    triggerHaptic('success');
    setIsImporting(true);

    try {
      const challenge = createChallengeFromShare(shareableChallenge);
      addChallenge(challenge);
      onImport?.(challenge);

      // Clear URL parameter
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('import');
        window.history.replaceState({}, '', url.toString());
      }

      onClose();
    } catch (error) {
      console.error('Failed to import challenge:', error);
      triggerHaptic('error');
    } finally {
      setIsImporting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-md">
      <div className="glass-effect card-3d bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border-2 border-white/20 dark:border-gray-700/50">
        <h2 className="text-2xl font-bold text-gray-950 dark:text-white mb-4">
          {lang === 'tr' ? 'Challenge İçe Aktar' : 'Import Challenge'}
        </h2>

        {shareableChallenge ? (
          <>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {lang === 'tr' ? 'Challenge Adı' : 'Challenge Name'}
                </p>
                <p className="text-lg font-bold text-gray-950 dark:text-white">
                  {shareableChallenge.name[lang]}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {lang === 'tr' ? 'Açıklama' : 'Description'}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {shareableChallenge.description[lang]}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {lang === 'tr' ? 'Hedef' : 'Target'}
                </p>
                <p className="text-lg font-bold text-gray-950 dark:text-white">
                  {shareableChallenge.target.toLocaleString()} {lang === 'tr' ? 'puan' : 'points'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1" disabled={isImporting}>
                {lang === 'tr' ? 'İptal' : 'Cancel'}
              </Button>
              <Button onClick={handleImport} className="flex-1" disabled={isImporting}>
                {isImporting
                  ? lang === 'tr'
                    ? 'İçe Aktarılıyor...'
                    : 'Importing...'
                  : lang === 'tr'
                    ? 'İçe Aktar'
                    : 'Import'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {lang === 'tr'
                ? 'Geçersiz challenge linki. Lütfen geçerli bir link kullanın.'
                : 'Invalid challenge link. Please use a valid link.'}
            </p>
            <Button onClick={onClose} className="w-full">
              {lang === 'tr' ? 'Kapat' : 'Close'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
