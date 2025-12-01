'use client';

import { useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';
import {
  generateShareImage,
  shareImage,
  type ShareImageData,
  type ShareImageFormat,
} from '@/lib/shareImageGenerator';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

export interface ShareButtonProps {
  /**
   * Type of content to share
   */
  type: 'stats' | 'badge' | 'streak' | 'achievement';
  /**
   * Data for the share image
   */
  data: ShareImageData;
  /**
   * Image format (default: 'general')
   */
  format?: ShareImageFormat;
  /**
   * Custom filename for download
   */
  filename?: string;
  /**
   * Show as icon button or full button
   */
  variant?: 'icon' | 'full';
  /**
   * Size of the button
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Additional className
   */
  className?: string;
}

export function ShareButton({
  type,
  data,
  format = 'general',
  filename,
  variant = 'full',
  size = 'md',
  className = '',
}: ShareButtonProps) {
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const { triggerHaptic } = useHapticFeedback();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = useCallback(async () => {
    if (isSharing) return;

    try {
      setIsSharing(true);
      triggerHaptic('light');

      // Generate share image
      const blob = await generateShareImage(data, format);

      // Share or download
      const defaultFilename = filename || `sporttrack-${type}-${Date.now()}.png`;
      await shareImage(blob, defaultFilename);

      // Track analytics
      trackEvent('share_action', {
        shareType: type,
        format,
      });

      triggerHaptic('success');
    } catch (error) {
      console.error('Failed to share image:', error);
      triggerHaptic('error');
    } finally {
      setIsSharing(false);
    }
  }, [data, format, filename, type, triggerHaptic, isSharing]);

  const shareLabel = lang === 'tr' ? 'Paylaş' : 'Share';
  const shareIcon = '📤';

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size={size}
        onClick={handleShare}
        disabled={isSharing}
        className={`${className} ${isMobile ? 'min-w-[44px] min-h-[44px]' : ''}`}
        aria-label={shareLabel}
        title={shareLabel}
      >
        <span className="text-lg">{shareIcon}</span>
        {isSharing && (
          <span className="ml-2 text-xs">{lang === 'tr' ? 'Paylaşılıyor...' : 'Sharing...'}</span>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      size={size}
      onClick={handleShare}
      disabled={isSharing}
      className={`${className} ${isMobile ? 'min-h-[44px]' : ''}`}
    >
      <span className="text-lg mr-2">{shareIcon}</span>
      {isSharing ? (lang === 'tr' ? 'Paylaşılıyor...' : 'Sharing...') : shareLabel}
    </Button>
  );
}
