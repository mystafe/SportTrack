'use client';

import { useMemo } from 'react';
import { startOfDay } from 'date-fns';
import { useI18n } from '@/lib/i18n';
import { ActivityRecord } from '@/lib/activityStore';
import { getActivityLabel, getActivityUnit } from '@/lib/activityUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useSwipeGesture } from '@/lib/hooks/useSwipeGesture';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';

interface ActivityCardProps {
  activity: ActivityRecord;
  isToday: boolean;
  todayKey: string;
  numberFormatter: Intl.NumberFormat;
  timeFormatter: Intl.DateTimeFormat;
  lang: 'tr' | 'en';
  onEdit: (id: string) => void;
  onDelete: (id: string, activity: ActivityRecord) => void;
  animationDelay?: string;
}

function formatDuration(seconds: number, lang: 'tr' | 'en'): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

export function ActivityCard({
  activity,
  isToday,
  numberFormatter,
  timeFormatter,
  lang,
  onEdit,
  onDelete,
  animationDelay,
}: ActivityCardProps) {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { triggerHaptic } = useHapticFeedback();

  // Swipe gesture handlers
  const swipeHandlers = useSwipeGesture(
    {
      onSwipeLeft: () => {
        if (isToday) {
          triggerHaptic('warning');
          onDelete(activity.id, activity);
        }
      },
      onSwipeRight: () => {
        if (isToday) {
          triggerHaptic('selection');
          onEdit(activity.id);
        }
      },
    },
    { threshold: 50, preventDefault: true }
  );

  return (
    <li
      {...(isMobile ? swipeHandlers.touchHandlers : {})}
      className={`activity-card-entrance activity-card-shimmer activity-card-hover activity-ripple gpu-accelerated group relative rounded-2xl ${isToday ? 'ring-4 ring-brand/40 dark:ring-brand/50 shadow-2xl' : 'shadow-xl'} border-2 ${isToday ? 'border-brand/50 dark:border-brand/60' : 'border-gray-300/60 dark:border-gray-600/60'} bg-gradient-to-br ${isToday ? 'from-brand/10 via-white to-brand/5 dark:from-brand/20 dark:via-gray-900 dark:to-brand/10' : 'from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'} ${isMobile ? 'px-4 py-3' : 'px-5 py-4'} hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 overflow-hidden ${swipeHandlers.isSwiping ? 'cursor-grabbing scale-[0.98]' : ''}`}
      style={{ animationDelay }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-brand/5 dark:from-brand/20 dark:via-transparent dark:to-brand/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl pointer-events-none"></div>

      {/* Swipe hint indicator (mobile only) */}
      {isMobile && isToday && (
        <div className="absolute top-2 right-2 text-xs text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
          {lang === 'tr' ? '← Sil | Düzenle →' : '← Delete | Edit →'}
        </div>
      )}

      <div className="relative z-10">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className={`relative ${isMobile ? 'text-3xl' : 'text-4xl'} activity-icon-float ${isMobile ? 'emoji-celebrate' : 'emoji-bounce'}`}
            >
              {activity.icon}
              {isToday && (
                <span className="absolute -top-1 -right-1 text-xs animate-pulse">⭐</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`${isMobile ? 'text-lg' : 'text-xl'} font-black text-gray-950 dark:text-white mb-1 drop-shadow-sm truncate`}
              >
                {getActivityLabel(activity, lang)}
              </h3>
              <div className="inline-flex items-center rounded-full points-badge-animated bg-gradient-to-r from-brand via-brand-dark to-brand text-white px-3 py-1 text-xs sm:text-sm font-black whitespace-nowrap border-2 border-white/30 dark:border-white/20 shadow-xl">
                <span className="text-sm drop-shadow-md">✨</span>
                <span className="ml-2 font-black">{numberFormatter.format(activity.points)}</span>
                <span className="ml-1.5 text-[10px] opacity-95 font-bold">
                  {t('list.pointsUnit')}
                </span>
              </div>
            </div>
          </div>
          {isToday && (
            <span className="px-2 py-1 rounded-lg bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wide border border-green-500/30">
              {lang === 'tr' ? 'Bugün' : 'Today'}
            </span>
          )}
        </div>

        {/* Details Row */}
        <div
          className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 mb-3 font-bold flex items-center gap-2 flex-wrap`}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100/80 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50">
            <span className="text-base">🕐</span>
            <span>{timeFormatter.format(new Date(activity.performedAt))}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-700/50">
            <span className="text-base">📊</span>
            <span className="font-black">{activity.amount}</span>
            <span>{getActivityUnit(activity, lang)}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-800 dark:text-purple-300 border border-purple-300/50 dark:border-purple-700/50">
            <span className="text-base">⚡</span>
            <span className="font-black">{activity.multiplier}x</span>
          </div>
          {activity.duration && activity.duration > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-100/80 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300 border border-cyan-200/50 dark:border-cyan-700/50">
              <span className="text-base">⏱️</span>
              <span className="font-black">{formatDuration(activity.duration, lang)}</span>
            </div>
          )}
        </div>

        {/* Note */}
        {activity.note && (
          <div
            className={`${isMobile ? 'text-xs' : 'text-sm'} mb-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gray-100/90 to-gray-50/90 dark:from-gray-800/80 dark:to-gray-700/80 border-l-4 border-brand/60 dark:border-brand/70 text-gray-800 dark:text-gray-200 line-clamp-2 font-semibold italic shadow-inner`}
          >
            <span className="text-brand dark:text-brand-light mr-1">"</span>
            {activity.note}
            <span className="text-brand dark:text-brand-light ml-1">"</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300">
          <button
            className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand font-black text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            onClick={() => onEdit(activity.id)}
          >
            <span className="text-base">✏️</span>
            <span>{t('list.edit')}</span>
          </button>
          <button
            className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black text-xs sm:text-sm shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95 disabled:hover:scale-100 flex items-center justify-center gap-2"
            disabled={!isToday}
            title={!isToday ? t('list.deleteDisabled') : undefined}
            onClick={() => {
              if (!isToday) return;
              onDelete(activity.id, activity);
            }}
          >
            <span className="text-base">🗑️</span>
            <span>{t('list.delete')}</span>
          </button>
        </div>
      </div>
    </li>
  );
}
