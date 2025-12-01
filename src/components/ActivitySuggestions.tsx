'use client';

import { useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities, useActivitiesSummary } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';
import {
  getActivitySuggestions,
  getSuggestionPriorityColor,
  type ActivitySuggestion,
} from '@/lib/activitySuggestions';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function ActivitySuggestions() {
  const { t, lang } = useI18n();
  const { activities } = useActivities();
  const { settings } = useSettings();
  const router = useRouter();
  const isMobile = useIsMobile();
  const dailyTarget =
    settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : DEFAULT_DAILY_TARGET;
  const summary = useActivitiesSummary(dailyTarget);

  const suggestions = useMemo(
    () => getActivitySuggestions(activities, dailyTarget, summary.todayPoints),
    [activities, dailyTarget, summary.todayPoints]
  );

  if (suggestions.length === 0) {
    return null;
  }

  const handleSuggestionClick = (suggestion: ActivitySuggestion) => {
    // Navigate to add page with pre-filled activity
    const params = new URLSearchParams({
      activity: suggestion.activity.key,
    });
    router.push(`/add?${params.toString()}`);
  };

  return (
    <Card
      variant="default"
      size="md"
      hoverable
      className="card-entrance"
      header={
        <div className="flex items-center gap-2">
          <span className="text-xl">💡</span>
          <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
            {lang === 'tr' ? 'Aktivite Önerileri' : 'Activity Suggestions'}
          </h2>
        </div>
      }
    >
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={`${suggestion.activity.key}-${index}`}
            className={`rounded-lg glass-effect card-3d p-3 sm:p-4 backdrop-blur-xl transition-all duration-300 ${getSuggestionPriorityColor(suggestion.priority)} hover:shadow-lg ${isMobile ? 'touch-feedback active:scale-[0.98]' : 'hover:scale-[1.02]'}`}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl sm:text-4xl flex-shrink-0">{suggestion.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg sm:text-xl">{suggestion.activity.icon}</span>
                  <h3 className="text-sm sm:text-base font-bold text-gray-950 dark:text-white">
                    {lang === 'tr'
                      ? suggestion.activity.label
                      : suggestion.activity.labelEn || suggestion.activity.label}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {suggestion.reason[lang]}
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full sm:w-auto"
                >
                  {lang === 'tr' ? 'Hemen Ekle' : 'Add Now'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
