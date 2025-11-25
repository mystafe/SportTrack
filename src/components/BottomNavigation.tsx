'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';

export function BottomNavigation() {
  const pathname = usePathname();
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { triggerHaptic } = useHapticFeedback();

  // Only show on mobile
  if (!isMobile) return null;

  const navItems = [
    {
      href: '/',
      label: t('nav.home'),
      icon: '🏠',
      ariaLabel: t('nav.home'),
    },
    {
      href: '/activities',
      label: t('nav.activities'),
      icon: '🏃',
      ariaLabel: t('nav.activities'),
    },
    {
      href: '/stats',
      label: t('nav.stats'),
      icon: '📊',
      ariaLabel: t('nav.stats'),
    },
    {
      href: '/achievements',
      label: t('nav.achievements'),
      icon: '🏆',
      ariaLabel: t('nav.achievements'),
    },
    {
      href: '/challenges',
      label: t('nav.challenges'),
      icon: '🎯',
      ariaLabel: t('nav.challenges'),
    },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Don't prevent default - let Link handle navigation naturally
    triggerHaptic('selection');
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t-2 border-gray-200 dark:border-gray-700 safe-bottom"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        willChange: 'transform',
      }}
      role="navigation"
      aria-label={t('nav.main')}
    >
      <div className="container mx-auto px-2 safe-left safe-right">
        <div className="flex items-center justify-around h-16 safe-bottom">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`
                  flex flex-col items-center justify-center gap-1
                  min-w-[56px] min-h-[56px] px-3 py-2
                  rounded-xl transition-all duration-200
                  touch-feedback mobile-press
                  ${isActive ? 'bg-brand/10 dark:bg-brand/20 text-brand dark:text-brand-light' : 'text-gray-600 dark:text-gray-400'}
                  ${isActive ? 'scale-105' : 'scale-100'}
                  active:scale-95
                  hover:bg-gray-100 dark:hover:bg-gray-800
                `}
                style={{
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                }}
                aria-label={item.ariaLabel}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className={`text-2xl ${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-200`}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <span
                  className={`text-xs font-semibold leading-tight ${isActive ? 'opacity-100' : 'opacity-70'}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
