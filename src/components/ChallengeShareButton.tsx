'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Challenge } from '@/lib/challenges';
import { generateChallengeShareUrl } from '@/lib/challengeShare';
import { useSettings } from '@/lib/settingsStore';

interface ChallengeShareButtonProps {
  challenge: Challenge;
  variant?: 'icon' | 'button';
  className?: string;
}

export function ChallengeShareButton({
  challenge,
  variant = 'icon',
  className,
}: ChallengeShareButtonProps) {
  const { t, lang } = useI18n();
  const { triggerHaptic } = useHapticFeedback();
  const isMobile = useIsMobile();
  const { settings } = useSettings();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = useCallback(async () => {
    triggerHaptic('light');
    setIsSharing(true);

    try {
      const shareUrl = generateChallengeShareUrl(challenge);
      const shareText =
        lang === 'tr'
          ? `"${challenge.name.tr}" challenge'ına katıl! Hedef: ${challenge.target} puan.`
          : `Join the "${challenge.name.en}" challenge! Target: ${challenge.target} points.`;

      if (navigator.share && isMobile) {
        // Use Web Share API for mobile
        await navigator.share({
          title: challenge.name[lang],
          text: shareText,
          url: shareUrl,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);

        // Show success feedback
        if (lang === 'tr') {
          alert('Challenge linki kopyalandı!');
        } else {
          alert('Challenge link copied!');
        }
      }
    } catch (error) {
      console.error('Error sharing challenge:', error);
      // User might have cancelled the share dialog, so no error toast needed
    } finally {
      setIsSharing(false);
    }
  }, [challenge, lang, triggerHaptic, isMobile]);

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className={className}
        aria-label={t('actions.share')}
        disabled={isSharing}
      >
        {isSharing ? <span className="animate-spin">⚙️</span> : <span className="text-lg">📤</span>}
      </Button>
    );
  }

  return (
    <Button onClick={handleShare} className={className} disabled={isSharing}>
      {isSharing ? <span className="animate-spin mr-2">⚙️</span> : <span className="mr-2">📤</span>}
      {t('actions.share')}
    </Button>
  );
}
