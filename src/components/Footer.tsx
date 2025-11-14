'use client';

import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export function Footer() {
  const { t } = useI18n();
  const isMobile = useIsMobile();

  // Add margin-bottom to account for QuoteTicker height
  // QuoteTicker: py-3.5 (mobile) or py-4.5 (desktop) + text height + safe-bottom
  // Approximate: ~55-65px mobile, ~65-75px desktop
  const marginBottom = isMobile ? 'mb-20' : 'mb-24';

  return (
    <footer
      className={`container py-10 ${marginBottom} safe-bottom text-sm text-gray-500 dark:text-gray-400 flex flex-row items-center justify-between gap-2`}
    >
      <span className="font-medium">
        © {new Date().getFullYear()} SportTrack · {t('footer.byName')}
      </span>
      <span className="font-semibold">
        v0.17.8 <span className="uppercase tracking-wide">beta</span>
      </span>
    </footer>
  );
}
