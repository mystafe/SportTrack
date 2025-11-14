'use client';

import { useMemo, memo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';
import {
  calculatePersonalRecords,
  formatRecordValue,
  type PersonalRecord,
} from '@/lib/personalRecords';
import { format, parseISO } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export const PersonalRecords = memo(function PersonalRecords() {
  const { activities, hydrated } = useActivities();
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const dateLocale = lang === 'tr' ? tr : enUS;

  const dailyTarget =
    settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : DEFAULT_DAILY_TARGET;

  const records = useMemo(() => {
    if (!hydrated || activities.length === 0) return [];
    return calculatePersonalRecords(activities, dailyTarget);
  }, [activities, dailyTarget, hydrated]);

  // Group records by type
  const recordsByType = useMemo(() => {
    const grouped: Record<string, PersonalRecord[]> = {
      overall: [],
      activities: [],
    };

    for (const record of records) {
      if (record.activityKey) {
        grouped.activities.push(record);
      } else {
        grouped.overall.push(record);
      }
    }

    return grouped;
  }, [records]);

  if (!hydrated || records.length === 0) {
    return null;
  }

  return (
    <div className="spacing-lg">
      <div>
        <h2 className="text-heading-3 text-gray-900 dark:text-white mb-4">{t('records.title')}</h2>
        <p className="text-body text-gray-600 dark:text-gray-400 mb-4">{t('records.subtitle')}</p>
      </div>

      {recordsByType.overall.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t('records.overall')}
          </h3>
          <div
            className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} spacing-sm`}
          >
            {recordsByType.overall.map((record) => (
              <div
                key={record.id}
                className="card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{record.icon}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {record.label[lang]}
                      </h4>
                    </div>
                  </div>
                </div>
                <div
                  className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-brand dark:text-brand-light mb-1`}
                >
                  {formatRecordValue(record, lang)}
                </div>
                <div className="text-body-small text-gray-600 dark:text-gray-400">
                  {format(parseISO(record.date), 'dd MMM yyyy', { locale: dateLocale })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recordsByType.activities.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t('records.byActivity')}
          </h3>
          <div
            className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'} spacing-sm`}
          >
            {recordsByType.activities.map((record) => (
              <div
                key={record.id}
                className="card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{record.icon}</span>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 dark:text-white">
                        {record.label[lang]}
                      </h4>
                    </div>
                  </div>
                </div>
                <div
                  className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-brand dark:text-brand-light mb-1`}
                >
                  {formatRecordValue(record, lang)}
                </div>
                <div className="text-body-small text-gray-600 dark:text-gray-400">
                  {format(parseISO(record.date), 'dd MMM yyyy', { locale: dateLocale })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
