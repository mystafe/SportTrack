'use client';

import { memo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const quickActions = [
  {
    id: 'add-activity',
    icon: '➕',
    label: { tr: 'Aktivite Ekle', en: 'Add Activity' },
    link: '/add',
    color: 'from-brand to-brand-dark',
  },
  {
    id: 'view-stats',
    icon: '📊',
    label: { tr: 'İstatistikler', en: 'Statistics' },
    link: '/stats',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'view-challenges',
    icon: '🎯',
    label: { tr: 'Hedefler', en: 'Challenges' },
    link: '/challenges',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'view-achievements',
    icon: '🏆',
    label: { tr: 'Rozetler', en: 'Achievements' },
    link: '/achievements',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    id: 'view-activities',
    icon: '📝',
    label: { tr: 'Aktiviteler', en: 'Activities' },
    link: '/activities',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'settings',
    icon: '⚙️',
    label: { tr: 'Ayarlar', en: 'Settings' },
    link: '#',
    color: 'from-gray-500 to-gray-600',
    onClick: true,
  },
];

export const QuickActions = memo(function QuickActions() {
  const { lang } = useI18n();
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleClick = (action: (typeof quickActions)[0]) => {
    if (action.onClick && action.id === 'settings') {
      // Trigger settings dialog - this would need to be connected to a context
      const event = new CustomEvent('open-settings');
      window.dispatchEvent(event);
    } else if (action.link !== '#') {
      router.push(action.link);
    }
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
      {quickActions.map((action) => (
        <button
          key={action.id}
          onClick={() => handleClick(action)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick(action);
            }
          }}
          className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${action.color} text-white p-3 sm:p-4 shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${isMobile ? 'touch-feedback mobile-press' : ''}`}
          aria-label={action.label[lang]}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover:from-white/20 group-hover:via-white/10 group-hover:to-white/20 transition-all duration-300 rounded-xl"></div>
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl"></div>
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="text-xl sm:text-2xl mb-1 group-hover:scale-110 group-hover:rotate-6 transition-all duration-200">
              {action.icon}
            </div>
            <div className="text-[10px] sm:text-xs font-semibold leading-tight">
              {action.label[lang]}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
});
