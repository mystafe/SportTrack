'use client';

import { useMemo, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useActivityDefinitions } from '@/lib/settingsStore';
import { getActivityLabel, getActivityUnit } from '@/lib/activityUtils';
import { useToaster } from '@/components/Toaster';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { ActivityDefinition } from '@/lib/activityConfig';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export function QuickAdd() {
  const { t, lang } = useI18n();
  const { addActivity } = useActivities();
  const { showToast } = useToaster();
  const isMobile = useIsMobile();
  const definitions = useActivityDefinitions();
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [confirmActivity, setConfirmActivity] = useState<ActivityDefinition | null>(null);

  const { activities } = useActivities();

  // Get most used activities (top 6)
  const mostUsedActivities = useMemo(() => {
    const activityCounts = new Map<string, { definition: ActivityDefinition; count: number }>();
    
    // Count activities by key
    activities.forEach(activity => {
      const existing = activityCounts.get(activity.activityKey);
      if (existing) {
        existing.count++;
      } else {
        const def = definitions.find(d => d.key === activity.activityKey);
        if (def) {
          activityCounts.set(activity.activityKey, { definition: def, count: 1 });
        }
      }
    });

    // If no activities yet, show default activities
    if (activityCounts.size === 0) {
      return definitions.slice(0, 6).map(def => ({ definition: def, count: 0 }));
    }

    return Array.from(activityCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [definitions, activities]);

  const handleQuickAddClick = (definition: ActivityDefinition) => {
    setConfirmActivity(definition);
  };

  const handleConfirmAdd = async () => {
    if (!confirmActivity || isAdding) return;
    
    setIsAdding(confirmActivity.key);
    try {
      const record = addActivity({
        definition: confirmActivity,
        amount: confirmActivity.defaultAmount,
        performedAt: new Date().toISOString()
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
  };

  const handleCancelAdd = () => {
    setConfirmActivity(null);
  };

  if (mostUsedActivities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900 dark:text-white`}>
          {t('quickAdd.title')}
        </h3>
        <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-500 dark:text-gray-400`}>
          {t('quickAdd.subtitle')}
        </span>
      </div>
      <div className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-6'} gap-3 sm:gap-4`}>
        {mostUsedActivities.map(({ definition }) => {
          const isAddingThis = isAdding === definition.key;
          return (
            <button
              key={definition.key}
              type="button"
              onClick={() => handleQuickAddClick(definition)}
              disabled={isAddingThis}
              className={`
                relative flex flex-col items-center justify-center gap-2
                p-4 sm:p-5 rounded-xl border-2
                transition-all duration-300
                min-h-[90px] sm:min-h-[110px]
                backdrop-blur-sm
                ${
                  isAddingThis
                    ? 'border-brand dark:border-brand/60 bg-gradient-to-br from-brand/20 to-brand/10 dark:from-brand/25 dark:to-brand/15 cursor-wait shadow-lg shadow-brand/20 dark:shadow-brand/30'
                    : 'border-gray-200 dark:border-gray-700/50 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/80 dark:to-gray-800/80 hover:border-brand dark:hover:border-brand/60 hover:bg-brand/5 dark:hover:bg-brand/10 hover:shadow-lg hover:shadow-brand/10 dark:hover:shadow-brand/20 hover:scale-105 active:scale-95'
                }
                disabled:opacity-50 disabled:cursor-not-allowed group
              `}
              aria-label={t('quickAdd.addActivity', { activity: getActivityLabel(definition, lang) })}
            >
              <div className="text-3xl sm:text-4xl transform group-hover:scale-110 transition-transform duration-300">
                {definition.icon}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-center text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand transition-colors">
                {getActivityLabel(definition, lang)}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 font-medium">
                {definition.defaultAmount} {getActivityUnit(definition, lang)}
              </div>
              {isAddingThis && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 rounded-xl backdrop-blur-sm">
                  <div className="animate-spin rounded-full h-8 w-8 border-3 border-brand border-t-transparent"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <ConfirmDialog
        open={!!confirmActivity}
        title={t('quickAdd.confirmTitle')}
        message={
          confirmActivity
            ? t('quickAdd.confirmMessage', {
                activity: getActivityLabel(confirmActivity, lang),
                amount: String(confirmActivity.defaultAmount),
                unit: getActivityUnit(confirmActivity, lang),
                points: String(confirmActivity.defaultAmount * confirmActivity.multiplier)
              })
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
}

