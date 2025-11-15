'use client';

import { useMemo, useState, useCallback, memo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useActivityDefinitions } from '@/lib/settingsStore';
import { getActivityLabel, getActivityUnit } from '@/lib/activityUtils';
import { useToaster } from '@/components/Toaster';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { ActivityDefinition } from '@/lib/activityConfig';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { startOfDay, subDays, isSameDay } from 'date-fns';

export const QuickAdd = memo(function QuickAdd() {
  const [isOpen, setIsOpen] = useState(true);
  const { t, lang } = useI18n();
  const { addActivity } = useActivities();
  const { showToast } = useToaster();
  const isMobile = useIsMobile();
  const definitions = useActivityDefinitions();
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [confirmActivity, setConfirmActivity] = useState<ActivityDefinition | null>(null);

  const { activities } = useActivities();

  // Calculate most frequent amount for each activity based on recent history
  const getAverageAmount = useCallback(
    (activityKey: string): number | null => {
      const now = new Date();
      const today = startOfDay(now);
      const sevenDaysAgo = startOfDay(subDays(now, 7));

      // Filter activities for this activity key from last 7 days
      const recentActivities = activities.filter((activity) => {
        if (activity.activityKey !== activityKey) return false;
        const activityDate = new Date(activity.performedAt);
        return activityDate >= sevenDaysAgo && activityDate <= now;
      });

      if (recentActivities.length === 0) {
        return null; // No recent history, use default
      }

      // Get today's activities
      const todayActivities = recentActivities.filter((activity) => {
        const activityDate = new Date(activity.performedAt);
        return isSameDay(activityDate, today);
      });

      // Group similar amounts together (±5% tolerance for rounding)
      const groupAmounts = (amounts: number[]): Map<number, number> => {
        const groups = new Map<number, number>();

        for (const amount of amounts) {
          // Find existing group within 5% tolerance
          let foundGroup = false;
          for (const [groupKey] of groups) {
            const tolerance = Math.max(groupKey * 0.05, 10); // At least 10 units tolerance
            if (Math.abs(amount - groupKey) <= tolerance) {
              groups.set(groupKey, (groups.get(groupKey) || 0) + 1);
              foundGroup = true;
              break;
            }
          }

          if (!foundGroup) {
            groups.set(amount, 1);
          }
        }

        return groups;
      };

      // Count frequency of each amount (grouped by similarity)
      const allAmounts = recentActivities.map((a) => a.amount);
      const amountGroups = groupAmounts(allAmounts);

      // Find the most frequent amount group
      let mostFrequentAmount = 0;
      let maxFrequency = 0;
      for (const [amount, frequency] of amountGroups) {
        if (frequency > maxFrequency) {
          maxFrequency = frequency;
          mostFrequentAmount = amount;
        }
      }

      // If we have today's activities, check if today's amount matches the most frequent pattern
      if (todayActivities.length > 0) {
        const todayTotal = todayActivities.reduce((sum, activity) => sum + activity.amount, 0);
        const todayAverage = Math.round(todayTotal / todayActivities.length);

        // Check if today's average is close to the most frequent amount (±5%)
        const tolerance = Math.max(mostFrequentAmount * 0.05, 10);
        if (Math.abs(todayAverage - mostFrequentAmount) <= tolerance) {
          // Today's value matches the pattern, use today's average
          return todayAverage;
        }

        // If today's value is significantly different but we have multiple entries today,
        // prefer today's average (user might be changing their routine)
        if (todayActivities.length >= 2) {
          return todayAverage;
        }
      }

      // Use the most frequent amount from recent history
      // If multiple amounts have the same frequency, use the average of those amounts
      const topAmounts: number[] = [];
      for (const [amount, frequency] of amountGroups) {
        if (frequency === maxFrequency) {
          topAmounts.push(amount);
        }
      }

      if (topAmounts.length > 0) {
        const averageOfTop = Math.round(
          topAmounts.reduce((sum, amt) => sum + amt, 0) / topAmounts.length
        );
        return averageOfTop;
      }

      // Fallback: use simple average
      const totalAmount = recentActivities.reduce((sum, activity) => sum + activity.amount, 0);
      return Math.round(totalAmount / recentActivities.length);
    },
    [activities]
  );

  // Get most used activities (top 6) with their average amounts
  const mostUsedActivities = useMemo(() => {
    const activityCounts = new Map<string, { definition: ActivityDefinition; count: number }>();

    // Count activities by key
    activities.forEach((activity) => {
      const existing = activityCounts.get(activity.activityKey);
      if (existing) {
        existing.count++;
      } else {
        const def = definitions.find((d) => d.key === activity.activityKey);
        if (def) {
          activityCounts.set(activity.activityKey, { definition: def, count: 1 });
        }
      }
    });

    // If no activities yet, show default activities
    if (activityCounts.size === 0) {
      return definitions.slice(0, 6).map((def) => ({
        definition: def,
        count: 0,
        averageAmount: null,
      }));
    }

    return Array.from(activityCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
      .map((item) => ({
        ...item,
        averageAmount: getAverageAmount(item.definition.key),
      }));
  }, [definitions, activities, getAverageAmount]);

  const handleQuickAddClick = useCallback((definition: ActivityDefinition) => {
    setConfirmActivity(definition);
  }, []);

  const handleConfirmAdd = useCallback(async () => {
    if (!confirmActivity || isAdding) return;

    setIsAdding(confirmActivity.key);
    try {
      // Use average amount from recent history if available, otherwise use default
      const averageAmount = getAverageAmount(confirmActivity.key);
      const amountToUse = averageAmount ?? confirmActivity.defaultAmount;

      const record = addActivity({
        definition: confirmActivity,
        amount: amountToUse,
        performedAt: new Date().toISOString(),
      });

      showToast(
        `${confirmActivity.icon} ${getActivityLabel(confirmActivity, lang)} ${t('quickAdd.added')}`,
        'success'
      );
      setConfirmActivity(null);
    } catch (error) {
      console.error('Failed to add activity:', error);
      showToast(t('quickAdd.failed'), 'error');
    } finally {
      setIsAdding(null);
    }
  }, [confirmActivity, isAdding, addActivity, showToast, t, lang, getAverageAmount]);

  const handleCancelAdd = useCallback(() => {
    setConfirmActivity(null);
  }, []);

  if (mostUsedActivities.length === 0) {
    return null;
  }

  const renderHeader = () => {
    return (
      <button
        type="button"
        className="flex w-full items-center justify-between text-xs font-bold text-gray-900 dark:text-white mb-2 transition-all duration-200 hover:text-brand"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="quick-add"
      >
        <span className="font-bold">{t('quickAdd.title')}</span>
        <span
          className="ml-2 text-base font-bold transition-transform duration-300 ease-in-out text-brand dark:text-brand-light"
          aria-hidden
          style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
        >
          ▼
        </span>
      </button>
    );
  };

  return (
    <div className="card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-3 shadow-md hover:shadow-xl transition-shadow duration-300">
      {renderHeader()}
      {isOpen && (
        <div id="quick-add" className="space-y-2">
          <div
            className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-6'} gap-2 sm:gap-3`}
          >
            {mostUsedActivities.map(({ definition, averageAmount }) => {
              const isAddingThis = isAdding === definition.key;
              const displayAmount = averageAmount ?? definition.defaultAmount;
              return (
                <button
                  key={definition.key}
                  type="button"
                  onClick={() => handleQuickAddClick(definition)}
                  disabled={isAddingThis}
                  className={`
                stagger-item touch-feedback mobile-press mobile-card-lift fade-in-scale-mobile
                relative flex flex-col items-center justify-center gap-2
                p-4 sm:p-5 rounded-xl border-2
                transition-all duration-300
                min-h-[90px] sm:min-h-[110px] min-w-[90px] sm:min-w-[110px]
                touch-target
                gpu-accelerated
                ${
                  isAddingThis
                    ? 'border-brand dark:border-brand/60 bg-gradient-to-br from-brand/20 to-brand/10 dark:from-brand/25 dark:to-brand/15 cursor-wait shadow-lg shadow-brand/20 dark:shadow-brand/30 pulse-glow-mobile'
                    : 'border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 hover:border-brand dark:hover:border-brand/60 hover:bg-gradient-to-br hover:from-brand/5 hover:via-brand/3 hover:to-brand/5 dark:hover:from-brand/10 dark:hover:via-brand/8 dark:hover:to-brand/10 hover:shadow-xl hover:shadow-brand/20 dark:hover:shadow-brand/30 scale-on-interact'
                }
                disabled:opacity-50 disabled:cursor-not-allowed group
              `}
                  aria-label={t('quickAdd.addActivityLabel', {
                    activity: getActivityLabel(definition, lang),
                  })}
                  aria-busy={isAddingThis}
                  aria-disabled={isAddingThis}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (!isAddingThis) {
                        handleQuickAddClick(definition);
                      }
                    }
                  }}
                >
                  <div
                    className={`text-3xl sm:text-4xl transform group-hover:scale-110 transition-transform duration-300 ${isAddingThis ? 'icon-wiggle-mobile' : ''}`}
                  >
                    {definition.icon}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-center text-gray-950 dark:text-gray-100 line-clamp-2 group-hover:text-brand transition-colors">
                    {getActivityLabel(definition, lang)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-semibold">
                    {displayAmount} {getActivityUnit(definition, lang)}
                  </div>
                  {isAddingThis && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 rounded-xl ">
                      <div className="animate-spin rounded-full h-8 w-8 border-3 border-brand border-t-transparent"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmActivity}
        title={t('quickAdd.confirmTitle')}
        message={
          confirmActivity
            ? (() => {
                const averageAmount = getAverageAmount(confirmActivity.key);
                const amountToUse = averageAmount ?? confirmActivity.defaultAmount;
                return t('quickAdd.confirmMessage', {
                  activity: getActivityLabel(confirmActivity, lang),
                  amount: String(amountToUse),
                  unit: getActivityUnit(confirmActivity, lang),
                  points: String(Math.round(amountToUse * confirmActivity.multiplier)),
                });
              })()
            : ''
        }
        variant="default"
        confirmLabel={t('quickAdd.confirmAdd')}
        cancelLabel={t('form.cancel')}
        onConfirm={handleConfirmAdd}
        onCancel={handleCancelAdd}
      />
    </div>
  );
});
