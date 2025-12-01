'use client';

import { useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';
import { generateSmartInsights } from '@/lib/smartInsights';
import { Card } from '@/components/ui/Card';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export function WeeklyInsights() {
  const { lang } = useI18n();
  const { activities } = useActivities();
  const { settings } = useSettings();
  const isMobile = useIsMobile();
  const dailyTarget =
    settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : DEFAULT_DAILY_TARGET;

  const insights = useMemo(
    () => generateSmartInsights(activities, dailyTarget, lang),
    [activities, dailyTarget, lang]
  );

  if (insights.length === 0) {
    return null;
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-800';
      case 'tip':
        return 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800';
      case 'suggestion':
        return 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800';
      case 'motivation':
        return 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800';
      default:
        return 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700';
    }
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
            {lang === 'tr' ? 'Akıllı Öneriler' : 'Smart Insights'}
          </h2>
        </div>
      }
    >
      <div className="space-y-3 sm:space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg glass-effect card-3d bg-gradient-to-r ${getInsightColor(insight.type)} border-2 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.01]`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl sm:text-3xl flex-shrink-0">{insight.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-gray-950 dark:text-white mb-1">
                  {insight.title[lang]}
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {insight.message[lang]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
