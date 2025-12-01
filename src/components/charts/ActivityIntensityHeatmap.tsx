'use client';

import { useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';
import { startOfDay, parseISO, format, eachDayOfInterval, subDays, getDay } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';

interface ActivityIntensityHeatmapProps {
  days?: number; // Number of days to show (default: 365)
}

export function ActivityIntensityHeatmap({ days = 365 }: ActivityIntensityHeatmapProps) {
  const { activities } = useActivities();
  const { settings } = useSettings();
  const { lang } = useI18n();
  const isMobile = useIsMobile();
  const dailyTarget =
    settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : DEFAULT_DAILY_TARGET;

  const heatmapData = useMemo(() => {
    const endDate = startOfDay(new Date());
    const startDate = subDays(endDate, days - 1);
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    // Group activities by date
    const dailyPoints = new Map<string, number>();
    activities.forEach((activity) => {
      const activityDate = startOfDay(parseISO(activity.performedAt));
      if (activityDate >= startDate && activityDate <= endDate) {
        const dateKey = format(activityDate, 'yyyy-MM-dd');
        dailyPoints.set(dateKey, (dailyPoints.get(dateKey) || 0) + activity.points);
      }
    });

    // Calculate intensity levels (0-4)
    const intensityLevels = dateRange.map((date) => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const points = dailyPoints.get(dateKey) || 0;
      const percentage = dailyTarget > 0 ? (points / dailyTarget) * 100 : 0;

      let intensity: number;
      if (percentage === 0) intensity = 0;
      else if (percentage < 25) intensity = 1;
      else if (percentage < 50) intensity = 2;
      else if (percentage < 100) intensity = 3;
      else intensity = 4;

      return {
        date,
        dateKey,
        points,
        intensity,
        percentage,
      };
    });

    // Group by weeks (for display) - GitHub style
    // Start from the first Sunday before or on the start date
    if (!intensityLevels || intensityLevels.length === 0) return [];

    const firstDate = intensityLevels[0]?.date;
    if (!firstDate) return [];

    const firstDayOfWeek = getDay(firstDate); // 0 = Sunday, 6 = Saturday

    const weeks: Array<Array<(typeof intensityLevels)[0] | null>> = [];
    let currentWeek: Array<(typeof intensityLevels)[0] | null> = [];

    // Add empty days at the beginning to align with Sunday
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    intensityLevels.forEach((day, index) => {
      if (day && day.date) {
        currentWeek.push(day);

        // If we have 7 days, start a new week
        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }

        // Last day - pad and push remaining week
        if (index === intensityLevels.length - 1 && currentWeek.length > 0) {
          while (currentWeek.length < 7) {
            currentWeek.push(null);
          }
          weeks.push(currentWeek);
        }
      }
    });

    return weeks;
  }, [activities, days, dailyTarget]);

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0:
        return 'bg-gray-100 dark:bg-gray-800';
      case 1:
        return 'bg-green-200 dark:bg-green-900/30';
      case 2:
        return 'bg-green-400 dark:bg-green-700';
      case 3:
        return 'bg-green-600 dark:bg-green-600';
      case 4:
        return 'bg-green-700 dark:bg-green-500';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  const getIntensityLabel = (intensity: number) => {
    switch (intensity) {
      case 0:
        return lang === 'tr' ? 'Aktivite yok' : 'No activity';
      case 1:
        return lang === 'tr' ? 'Düşük' : 'Low';
      case 2:
        return lang === 'tr' ? 'Orta' : 'Medium';
      case 3:
        return lang === 'tr' ? 'Yüksek' : 'High';
      case 4:
        return lang === 'tr' ? 'Mükemmel' : 'Excellent';
      default:
        return '';
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    let totalDays = 0;
    let activeDays = 0;
    let perfectDays = 0;
    let totalPoints = 0;

    if (heatmapData && heatmapData.length > 0) {
      heatmapData.forEach((week) => {
        if (week && Array.isArray(week)) {
          week.forEach((day) => {
            if (day && typeof day === 'object' && 'points' in day) {
              totalDays++;
              if (day.intensity > 0) activeDays++;
              if (day.intensity === 4) perfectDays++;
              totalPoints += day.points || 0;
            }
          });
        }
      });
    }

    return {
      totalDays,
      activeDays,
      perfectDays,
      totalPoints,
      activePercentage: totalDays > 0 ? (activeDays / totalDays) * 100 : 0,
      perfectPercentage: totalDays > 0 ? (perfectDays / totalDays) * 100 : 0,
      averagePoints: activeDays > 0 ? totalPoints / activeDays : 0,
    };
  }, [heatmapData]);

  return (
    <Card
      variant="default"
      size="md"
      hoverable
      className="card-entrance"
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {lang === 'tr' ? 'Aktivite Yoğunluk Haritası' : 'Activity Intensity Heatmap'}
            </h2>
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {days} {lang === 'tr' ? 'gün' : 'days'}
          </span>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {lang === 'tr' ? 'Aktif Günler' : 'Active Days'}
            </p>
            <p className="text-lg font-bold text-gray-950 dark:text-white">
              {stats.activeDays}/{stats.totalDays}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {stats.activePercentage.toFixed(1)}%
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {lang === 'tr' ? 'Mükemmel Günler' : 'Perfect Days'}
            </p>
            <p className="text-lg font-bold text-gray-950 dark:text-white">{stats.perfectDays}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {stats.perfectPercentage.toFixed(1)}%
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {lang === 'tr' ? 'Ortalama Puan' : 'Avg Points'}
            </p>
            <p className="text-lg font-bold text-gray-950 dark:text-white">
              {Math.round(stats.averagePoints)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {lang === 'tr' ? 'Toplam Puan' : 'Total Points'}
            </p>
            <p className="text-lg font-bold text-gray-950 dark:text-white">
              {(stats.totalPoints || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Heatmap */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="flex gap-1">
              {/* Day labels */}
              <div className="flex flex-col gap-1 pr-2">
                <div className="h-4"></div>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <div
                    key={day}
                    className={`h-3 sm:h-4 flex items-center text-xs text-gray-600 dark:text-gray-400 ${
                      index % 2 === 0 ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {lang === 'tr' ? ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'][index] : day}
                  </div>
                ))}
              </div>

              {/* Weeks */}
              <div className="flex gap-1 flex-1">
                {heatmapData.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {/* Week label (first week of month) */}
                    {weekIndex === 0 && (
                      <div className="h-4 text-xs text-gray-600 dark:text-gray-400"></div>
                    )}
                    {weekIndex > 0 &&
                      heatmapData[weekIndex - 1]?.length > 0 &&
                      week.length > 0 &&
                      week[0] &&
                      heatmapData[weekIndex - 1]?.[0] &&
                      format(week[0].date, 'd', { locale: lang === 'tr' ? tr : enUS }) <
                        format(heatmapData[weekIndex - 1][0]!.date, 'd', {
                          locale: lang === 'tr' ? tr : enUS,
                        }) && (
                        <div className="h-4 text-xs text-gray-600 dark:text-gray-400">
                          {format(week[0].date, 'MMM', { locale: lang === 'tr' ? tr : enUS })}
                        </div>
                      )}

                    {/* Days */}
                    {week.map((day, dayIndex) => {
                      if (!day) {
                        return (
                          <div
                            key={dayIndex}
                            className="w-3 sm:w-4 h-3 sm:h-4 rounded-sm bg-transparent"
                          />
                        );
                      }

                      return (
                        <div
                          key={day.dateKey}
                          className={`w-3 sm:w-4 h-3 sm:h-4 rounded-sm ${getIntensityColor(
                            day.intensity
                          )} transition-all duration-200 hover:scale-125 hover:z-10 relative group cursor-pointer`}
                          title={`${format(day.date, 'dd MMM yyyy', { locale: lang === 'tr' ? tr : enUS })}: ${(day.points || 0).toLocaleString()} ${lang === 'tr' ? 'puan' : 'points'} (${(day.percentage || 0).toFixed(0)}%)`}
                        >
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 transition-opacity">
                            {format(day.date, 'dd MMM yyyy', { locale: lang === 'tr' ? tr : enUS })}
                            <br />
                            {(day.points || 0).toLocaleString()} {lang === 'tr' ? 'puan' : 'points'}
                            <br />
                            {getIntensityLabel(day.intensity)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">
            {lang === 'tr' ? 'Daha az' : 'Less'}
          </span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
            <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/30" />
            <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
            <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-600" />
            <div className="w-3 h-3 rounded-sm bg-green-700 dark:bg-green-500" />
          </div>
          <span className="text-gray-600 dark:text-gray-400">
            {lang === 'tr' ? 'Daha fazla' : 'More'}
          </span>
        </div>
      </div>
    </Card>
  );
}
