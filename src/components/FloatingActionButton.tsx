'use client';

import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';

export function FloatingActionButton() {
  const router = useRouter();
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { triggerHaptic } = useHapticFeedback();

  // Only show on mobile
  if (!isMobile) return null;

  const handleClick = () => {
    triggerHaptic('medium');
    router.push('/add');
  };

  return (
    <button
      onClick={handleClick}
      className="
        fixed right-4 z-40
        w-14 h-14 rounded-full
        bg-gradient-to-r from-brand to-brand-dark
        text-white shadow-2xl
        flex items-center justify-center
        text-2xl font-bold
        hover:from-brand-dark hover:to-brand
        active:scale-95
        transition-all duration-300
        touch-feedback mobile-press
        animate-bounce-subtle
      "
      style={{
        bottom: 'calc(80px + max(16px, env(safe-area-inset-bottom, 0px)))',
      }}
      aria-label={t('actions.addActivity')}
    >
      <span className="drop-shadow-lg">➕</span>
    </button>
  );
}
