'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { memo, useMemo } from 'react';
import { QuoteTicker } from '@/components/QuoteTicker';

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
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] flex flex-col shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] overflow-hidden"
      style={
        {
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          overscrollBehavior: 'none',
          WebkitOverscrollBehavior: 'none',
          touchAction: 'pan-x pan-up',
        } as React.CSSProperties
      }
    >
      <QuoteTicker position="static" />
      <nav
        className="w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t-2 border-gray-200 dark:border-gray-800 glass-effect"
        style={
          {
            height: 'auto',
            minHeight: 'auto',
            paddingBottom: 'calc(env(safe-area-inset-bottom, 20px) + 4px)', // Safe area + extra padding
            boxSizing: 'border-box',
            overscrollBehavior: 'none',
            WebkitOverscrollBehavior: 'none',
            touchAction: 'pan-x pan-up',
          } as React.CSSProperties
        }
        role="navigation"
        aria-label={t('nav.main')}
      >
        <div className="container mx-auto px-1 safe-left safe-right">
          <div className="flex items-center justify-around h-12">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={`
                  flex flex-col items-center justify-center gap-0 group
                  min-w-[44px] min-h-[44px] px-1.5 py-1
                  rounded-lg transition-all duration-300 ease-out
                  ${
                    isActive
                      ? 'bg-gradient-to-br from-brand/20 via-brand/15 to-brand/10 dark:from-brand/30 dark:via-brand/25 dark:to-brand/20 text-brand dark:text-brand-light shadow-md shadow-brand/20 dark:shadow-brand/30 pulse-glow'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                  ${isActive ? 'scale-105' : 'scale-100'}
                  active:scale-95
                  hover:bg-gray-100/80 dark:hover:bg-gray-800/80
                  relative overflow-hidden
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
                    <>
                      <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand dark:bg-brand-light rounded-full animate-pulse pulse-glow" />
                      <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-brand/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </>
                  )}
                  <span
                    className={`text-lg ${isActive ? 'drop-shadow-md icon-bounce' : ''} transition-all duration-200 ease-out relative z-10`}
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
    </div>
  );
});
