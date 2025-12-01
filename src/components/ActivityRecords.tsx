'use client';

import { useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useActivityDefinitions } from '@/lib/settingsStore';
import { getActivityLabel, getActivityUnit } from '@/lib/activityUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import { parseISO, startOfDay, format } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';

interface ActivityRecordStats {
  activityKey: string;
  label: string;
  labelEn?: string;
  icon: string;
  unit: string;
  unitEn?: string;
  bestPoints: { value: number; date: Date } | null;
  bestAmount: { value: number; date: Date } | null;
  totalCount: number;
  totalPoints: number;
  averagePoints: number;
  averageAmount: number;
  firstPerformed: Date | null;
  lastPerformed: Date | null;
}

export function ActivityRecords() {
  const { t, lang } = useI18n();
  const { activities } = useActivities();
  const activityDefinitions = useActivityDefinitions();
  const isMobile = useIsMobile();
  const dateLocale = lang === 'tr' ? tr : enUS;

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );

  const activityRecords = useMemo(() => {
    const recordsMap = new Map<string, ActivityRecordStats>();

    activities.forEach((activity) => {
      const key = activity.activityKey;
      let record = recordsMap.get(key);

      if (!record) {
        const definition = activityDefinitions.find((d) => d.key === key);
        record = {
          activityKey: key,
          label: activity.label,
          labelEn: activity.labelEn,
          icon: activity.icon,
          unit: activity.unit,
          unitEn: activity.unitEn,
          bestPoints: null,
          bestAmount: null,
          totalCount: 0,
          totalPoints: 0,
          averagePoints: 0,
          averageAmount: 0,
          firstPerformed: null,
          lastPerformed: null,
        };
        recordsMap.set(key, record);
      }

      record.totalCount += 1;
      record.totalPoints += activity.points;

      const activityDate = parseISO(activity.performedAt);

      // Update best points
      if (!record.bestPoints || activity.points > record.bestPoints.value) {
        record.bestPoints = { value: activity.points, date: activityDate };
      }

      // Update best amount
      if (!record.bestAmount || activity.amount > record.bestAmount.value) {
        record.bestAmount = { value: activity.amount, date: activityDate };
      }

      // Update first/last performed
      if (!record.firstPerformed || activityDate < record.firstPerformed) {
        record.firstPerformed = activityDate;
      }
      if (!record.lastPerformed || activityDate > record.lastPerformed) {
        record.lastPerformed = activityDate;
      }
    });

    // Calculate averages
    recordsMap.forEach((record) => {
      record.averagePoints = record.totalCount > 0 ? record.totalPoints / record.totalCount : 0;
      record.averageAmount =
        record.totalCount > 0
          ? activities
              .filter((a) => a.activityKey === record.activityKey)
              .reduce((sum, a) => sum + a.amount, 0) / record.totalCount
          : 0;
    });

    return Array.from(recordsMap.values())
      .filter((r) => r.totalCount > 0)
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }, [activities, activityDefinitions]);

  if (activityRecords.length === 0) {
    return null;
  }

  return (
    <Card
      variant="default"
      size="md"
      hoverable
      className="card-entrance glass-effect card-3d"
      header={
        <div className="flex items-center gap-2">
          <span className="text-xl icon-bounce">🏆</span>
          <h2 className="text-lg sm:text-xl font-bold shimmer-text text-gray-950 dark:text-white">
            {lang === 'tr' ? 'Aktivite Rekorları' : 'Activity Records'}
          </h2>
        </div>
      }
    >
      <div className="space-y-4">
        {activityRecords.slice(0, 10).map((record) => (
          <div
            key={record.activityKey}
            className="p-4 rounded-xl border-2 border-white/30 dark:border-gray-700/50 glass-effect bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 card-3d"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl flex-shrink-0 icon-bounce">{record.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold shimmer-text text-gray-950 dark:text-white mb-1">
                  {lang === 'tr' ? record.label : record.labelEn || record.label}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {record.totalCount} {lang === 'tr' ? 'toplam aktivite' : 'total activities'} •{' '}
                  {numberFormatter.format(record.totalPoints)}{' '}
                  {lang === 'tr' ? 'toplam puan' : 'total points'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {record.bestPoints && (
                <div className="p-2 rounded-xl glass-effect bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg hover:scale-[1.05] transition-all duration-200">
                  <p className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-medium">
                    {lang === 'tr' ? 'En Yüksek Puan' : 'Best Points'}
                  </p>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400 pulse-glow">
                    {numberFormatter.format(record.bestPoints.value)}
                  </p>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">
                    {format(record.bestPoints.date, 'dd MMM yyyy', { locale: dateLocale })}
                  </p>
                </div>
              )}

              {record.bestAmount && (
                <div className="p-2 rounded-xl glass-effect bg-green-50/80 dark:bg-green-900/30 backdrop-blur-sm border border-green-200/50 dark:border-green-800/50 hover:shadow-lg hover:scale-[1.05] transition-all duration-200">
                  <p className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-medium">
                    {lang === 'tr' ? 'En Yüksek Miktar' : 'Best Amount'}
                  </p>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400 pulse-glow">
                    {numberFormatter.format(Math.round(record.bestAmount.value))}{' '}
                    {lang === 'tr' ? record.unit : record.unitEn || record.unit}
                  </p>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">
                    {format(record.bestAmount.date, 'dd MMM yyyy', { locale: dateLocale })}
                  </p>
                </div>
              )}

              <div className="p-2 rounded-xl glass-effect bg-purple-50/80 dark:bg-purple-900/30 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 hover:shadow-lg hover:scale-[1.05] transition-all duration-200">
                <p className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  {lang === 'tr' ? 'Ortalama Puan' : 'Avg Points'}
                </p>
                <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  {numberFormatter.format(Math.round(record.averagePoints))}
                </p>
              </div>

              <div className="p-2 rounded-xl glass-effect bg-orange-50/80 dark:bg-orange-900/30 backdrop-blur-sm border border-orange-200/50 dark:border-orange-800/50 hover:shadow-lg hover:scale-[1.05] transition-all duration-200">
                <p className="text-xs text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  {lang === 'tr' ? 'Ortalama Miktar' : 'Avg Amount'}
                </p>
                <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  {numberFormatter.format(Math.round(record.averageAmount))}{' '}
                  {lang === 'tr' ? record.unit : record.unitEn || record.unit}
                </p>
              </div>
            </div>

            {(record.firstPerformed || record.lastPerformed) && (
              <div className="mt-3 pt-3 border-t border-white/20 dark:border-gray-700/50 flex items-center justify-between text-xs flex-wrap gap-2">
                {record.firstPerformed && (
                  <div className="glass-effect bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/20 dark:border-gray-700/30">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {lang === 'tr' ? 'İlk Yapılan' : 'First Performed'}:
                    </span>{' '}
                    <span className="font-bold text-gray-950 dark:text-white">
                      {format(record.firstPerformed, 'dd MMM yyyy', { locale: dateLocale })}
                    </span>
                  </div>
                )}
                {record.lastPerformed && (
                  <div className="glass-effect bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/20 dark:border-gray-700/30">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {lang === 'tr' ? 'Son Yapılan' : 'Last Performed'}:
                    </span>{' '}
                    <span className="font-bold text-gray-950 dark:text-white">
                      {format(record.lastPerformed, 'dd MMM yyyy', { locale: dateLocale })}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
