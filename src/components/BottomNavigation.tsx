'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { memo, useMemo } from 'react';

export const BottomNavigation = memo(function BottomNavigation() {
  const pathname = usePathname();
  const { t } = useI18n();
  const isMobile = useIsMobile();

  // Memoize navItems BEFORE any conditional returns (Rules of Hooks)
  const navItems = useMemo(
    () => [
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
    ],
    [t]
  );

  // Only show on mobile - AFTER all hooks
  if (!isMobile) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-white via-white to-white/95 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900/95 backdrop-blur-xl border-t border-gray-200/80 dark:border-gray-700/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] safe-bottom"
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
      <div className="container mx-auto px-1 safe-left safe-right">
        <div className="flex items-center justify-around h-12 safe-bottom">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={`
                  flex flex-col items-center justify-center gap-0
                  min-w-[44px] min-h-[44px] px-1.5 py-1
                  rounded-lg transition-all duration-200 ease-out
                  ${
                    isActive
                      ? 'bg-gradient-to-br from-brand/20 via-brand/15 to-brand/10 dark:from-brand/30 dark:via-brand/25 dark:to-brand/20 text-brand dark:text-brand-light shadow-md shadow-brand/20 dark:shadow-brand/30'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                  ${isActive ? 'scale-105' : 'scale-100'}
                  active:scale-95
                  hover:bg-gray-100/80 dark:hover:bg-gray-800/80
                  relative
                `}
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  pointerEvents: 'auto',
                  userSelect: 'none',
                }}
                aria-label={item.ariaLabel}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand dark:bg-brand-light rounded-full animate-pulse" />
                )}
                <span
                  className={`text-lg ${isActive ? 'drop-shadow-md' : ''} transition-all duration-200 ease-out`}
                  aria-hidden="true"
                  style={{
                    filter: isActive ? 'drop-shadow(0 1px 2px rgba(14, 165, 233, 0.3))' : 'none',
                  }}
                >
                  {item.icon}
                </span>
                <span
                  className={`text-[8px] font-semibold leading-tight tracking-tight ${isActive ? 'opacity-100' : 'opacity-60'} transition-opacity duration-200`}
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
});
