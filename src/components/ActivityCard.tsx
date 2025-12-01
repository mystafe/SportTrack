'use client';

import { useMemo, useState, useCallback, memo } from 'react';
import { startOfDay } from 'date-fns';
import { useI18n } from '@/lib/i18n';
import { ActivityRecord } from '@/lib/activityStore';
import { getActivityLabel, getActivityUnit } from '@/lib/activityUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';
import { useLongPress } from '@/lib/hooks/useLongPress';
import { LongPressMenu, LongPressMenuItem } from '@/components/LongPressMenu';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

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
  density?: 'compact' | 'comfortable';
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

export const ActivityCard = memo(function ActivityCard({
  activity,
  isToday,
  numberFormatter,
  timeFormatter,
  lang,
  onEdit,
  onDelete,
  animationDelay,
  density = 'comfortable',
}: ActivityCardProps) {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { triggerHaptic } = useHapticFeedback();
  const [longPressMenu, setLongPressMenu] = useState<{ x: number; y: number } | null>(null);

  // Long press handler
  const handleLongPress = useCallback(
    (e: TouchEvent | MouseEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      triggerHaptic('selection');
      setLongPressMenu({ x: clientX, y: clientY });
    },
    [triggerHaptic]
  );

  const longPressHandlers = useLongPress({
    onLongPress: handleLongPress,
    delay: 500,
    threshold: 10,
  });

  return (
    <>
      <li
        {...longPressHandlers}
        className={`activity-card-entrance activity-card-shimmer activity-card-hover activity-ripple gpu-accelerated group relative card-3d ${density === 'compact' ? 'rounded-xl' : 'rounded-2xl'} ${isToday ? (density === 'compact' ? 'ring-2' : 'ring-4') + ' ring-brand/40 dark:ring-brand/50 shadow-xl pulse-glow' : 'shadow-lg'} border-2 ${isToday ? 'border-brand/50 dark:border-brand/60' : 'border-gray-300/60 dark:border-gray-600/60'} bg-gradient-to-br ${isToday ? 'from-brand/10 via-white to-brand/5 dark:from-brand/20 dark:via-gray-900 dark:to-brand/10' : 'from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'} ${
          density === 'compact'
            ? isMobile
              ? 'px-3 py-2'
              : 'px-3 py-2'
            : isMobile
              ? 'px-5 py-4'
              : 'px-5 py-4'
        } hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 overflow-hidden`}
        style={{ animationDelay }}
        role="article"
        aria-label={`${getActivityLabel(activity, lang)}, ${numberFormatter.format(activity.amount)} ${getActivityUnit(activity, lang)}, ${numberFormatter.format(activity.points)} ${t('list.pointsUnit')}, ${timeFormatter.format(new Date(activity.performedAt))}${isToday ? `, ${lang === 'tr' ? 'Bugün' : 'Today'}` : ''}`}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-brand/5 dark:from-brand/20 dark:via-transparent dark:to-brand/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>

        {/* Enhanced shine effect */}
        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-50 transition-opacity duration-1000 rounded-2xl pointer-events-none"></div>

        <div className="relative z-10">
          {/* Header Row - Compact Layout */}
          <div
            className={`flex items-center justify-between gap-2 ${density === 'compact' ? 'mb-1.5' : 'mb-3'}`}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className={`relative flex-shrink-0 ${density === 'compact' ? (isMobile ? 'text-2xl' : 'text-2xl') : isMobile ? 'text-3xl' : 'text-4xl'} ${density === 'compact' ? '' : isMobile ? 'emoji-celebrate' : 'emoji-bounce'} icon-bounce`}
              >
                {activity.icon}
                {isToday && density !== 'compact' && (
                  <span className="absolute -top-1 -right-1 text-xs float-enhanced">⭐</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    className={`${density === 'compact' ? (isMobile ? 'text-sm' : 'text-base') : isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-950 dark:text-white truncate`}
                  >
                    {getActivityLabel(activity, lang)}
                  </h3>
                  {isToday && density === 'compact' && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-400 border border-green-500/30 flex-shrink-0">
                      {lang === 'tr' ? 'Bugün' : 'Today'}
                    </span>
                  )}
                  <Badge
                    variant="primary"
                    size={density === 'compact' ? 'sm' : isMobile ? 'sm' : 'md'}
                    className={`points-badge-animated ${density === 'compact' ? 'shadow-md' : 'shadow-xl'}`}
                  >
                    <span className={density === 'compact' ? 'text-xs' : 'text-sm'}>✨</span>
                    <span
                      className={`${density === 'compact' ? 'ml-1 text-xs' : 'ml-2'} font-black`}
                    >
                      {numberFormatter.format(activity.points)}
                    </span>
                    <span
                      className={`${density === 'compact' ? 'ml-1 text-[9px]' : isMobile ? 'text-xs' : 'text-[10px]'} opacity-95 font-bold`}
                    >
                      {t('list.pointsUnit')}
                    </span>
                  </Badge>
                </div>
              </div>
            </div>
            {isToday && density !== 'compact' && (
              <span
                className={`px-2 py-1 rounded-lg bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-400 ${isMobile ? 'text-xs' : 'text-[10px]'} font-bold uppercase tracking-wide border border-green-500/30 flex-shrink-0 pulse-glow`}
              >
                {lang === 'tr' ? 'Bugün' : 'Today'}
              </span>
            )}
          </div>

          {/* Details Row - Compact Inline Layout with Action Buttons */}
          <div
            className={`${density === 'compact' ? (isMobile ? 'text-[10px]' : 'text-xs') : isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400 ${density === 'compact' ? 'mb-1.5' : 'mb-3'} font-medium flex items-center justify-between gap-1.5 flex-wrap`}
          >
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <span className={density === 'compact' ? 'text-xs' : 'text-sm'}>🕐</span>
                <span>{timeFormatter.format(new Date(activity.performedAt))}</span>
              </span>
              <span className="text-gray-400 dark:text-gray-600">•</span>
              <span className="inline-flex items-center gap-1">
                <span className={density === 'compact' ? 'text-xs' : 'text-sm'}>📊</span>
                <span className="font-semibold">{activity.amount}</span>
                <span>{getActivityUnit(activity, lang)}</span>
              </span>
              {activity.multiplier > 1 && (
                <>
                  <span className="text-gray-400 dark:text-gray-600">•</span>
                  <span className="inline-flex items-center gap-1">
                    <span className={density === 'compact' ? 'text-xs' : 'text-sm'}>⚡</span>
                    <span className="font-semibold">{activity.multiplier}x</span>
                  </span>
                </>
              )}
              {activity.duration && activity.duration > 0 && (
                <>
                  <span className="text-gray-400 dark:text-gray-600">•</span>
                  <span className="inline-flex items-center gap-1">
                    <span className={density === 'compact' ? 'text-xs' : 'text-sm'}>⏱️</span>
                    <span className="font-semibold">{formatDuration(activity.duration, lang)}</span>
                  </span>
                </>
              )}
            </div>
            {/* Action Buttons - Very Small, Inline */}
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button
                onClick={() => onEdit(activity.id)}
                className={`flex items-center justify-center ${density === 'compact' ? 'w-4 h-4' : 'w-5 h-5'} rounded ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} bg-brand/10 dark:bg-brand/20 hover:bg-brand/20 dark:hover:bg-brand/30 text-brand dark:text-brand-light transition-all duration-200 active:scale-95`}
                aria-label={`${t('list.edit')} ${getActivityLabel(activity, lang)}`}
                title={t('list.edit')}
              >
                <span className={`${density === 'compact' ? 'text-[8px]' : 'text-[10px]'}`}>
                  ✏️
                </span>
              </button>
              <button
                onClick={() => {
                  if (!isToday) return;
                  onDelete(activity.id, activity);
                }}
                disabled={!isToday}
                className={`flex items-center justify-center ${density === 'compact' ? 'w-4 h-4' : 'w-5 h-5'} rounded ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} ${isToday ? 'bg-red-500/10 dark:bg-red-500/20 hover:bg-red-500/20 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400' : 'bg-gray-200/50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-600 cursor-not-allowed'} transition-all duration-200 active:scale-95`}
                aria-label={
                  !isToday
                    ? t('list.deleteDisabled')
                    : `${t('list.delete')} ${getActivityLabel(activity, lang)}`
                }
                aria-disabled={!isToday}
                title={!isToday ? t('list.deleteDisabled') : t('list.delete')}
              >
                <span className={`${density === 'compact' ? 'text-[8px]' : 'text-[10px]'}`}>
                  🗑️
                </span>
              </button>
            </div>
          </div>

          {/* Note */}
          {activity.note && (
            <div
              className={`${density === 'compact' ? (isMobile ? 'text-[10px]' : 'text-xs') : isMobile ? 'text-xs' : 'text-sm'} ${density === 'compact' ? 'mb-0' : 'mb-0'} ${density === 'compact' ? 'px-2 py-1' : 'px-4 py-2.5'} rounded-lg bg-gradient-to-r from-gray-100/90 to-gray-50/90 dark:from-gray-800/80 dark:to-gray-700/80 border-l-2 border-brand/60 dark:border-brand/70 text-gray-700 dark:text-gray-300 ${density === 'compact' ? 'line-clamp-1' : 'line-clamp-2'} font-medium italic`}
            >
              <span className="text-brand dark:text-brand-light mr-1">"</span>
              {activity.note}
              <span className="text-brand dark:text-brand-light ml-1">"</span>
            </div>
          )}
        </div>
      </li>

      {/* Long Press Context Menu */}
      {longPressMenu && (
        <LongPressMenu
          isOpen={!!longPressMenu}
          position={longPressMenu}
          onClose={() => setLongPressMenu(null)}
        >
          <LongPressMenuItem
            icon="✏️"
            label={t('list.edit')}
            onClick={() => {
              setLongPressMenu(null);
              onEdit(activity.id);
            }}
          />
          <LongPressMenuItem
            icon="🗑️"
            label={t('list.delete')}
            variant="danger"
            disabled={!isToday}
            onClick={() => {
              if (isToday) {
                setLongPressMenu(null);
                onDelete(activity.id, activity);
              }
            }}
          />
          {!isToday && (
            <div
              className={`px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700`}
            >
              {t('list.deleteDisabled')}
            </div>
          )}
        </LongPressMenu>
      )}
    </>
  );
});
