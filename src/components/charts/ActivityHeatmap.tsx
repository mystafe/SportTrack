'use client';

import { useMemo } from 'react';
import {
  format,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  startOfDay,
  parseISO,
  isSameDay,
} from 'date-fns';
import { useI18n } from '@/lib/i18n';
import { ActivityRecord } from '@/lib/activityStore';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

type ActivityHeatmapProps = {
  activities: ActivityRecord[];
  target: number;
};

export default function ActivityHeatmap({ activities, target }: ActivityHeatmapProps) {
  const { lang } = useI18n();
  const isMobile = useIsMobile();

  const yearData = useMemo(() => {
    const today = new Date();
    const yearStart = startOfYear(today);
    const yearEnd = endOfYear(today);
    const allYearDays = eachDayOfInterval({ start: yearStart, end: yearEnd });

    const pointsMap = new Map<string, number>();
    for (const activity of activities) {
      const date = startOfDay(parseISO(activity.performedAt));
      const key = format(date, 'yyyy-MM-dd');
      pointsMap.set(key, (pointsMap.get(key) || 0) + activity.points);
    }

    return allYearDays.map((day) => {
      const key = format(day, 'yyyy-MM-dd');
      const points = pointsMap.get(key) || 0;
      const intensity =
        points >= target
          ? 4
          : points >= target * 0.75
            ? 3
            : points >= target * 0.5
              ? 2
              : points > 0
                ? 1
                : 0;

      return {
        date: day,
        key,
        points,
        intensity,
      };
    });
  }, [activities, target]);

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 4:
        return 'bg-green-600 dark:bg-green-500'; // Goal achieved
      case 3:
        return 'bg-green-400 dark:bg-green-600'; // 75%+
      case 2:
        return 'bg-yellow-400 dark:bg-yellow-600'; // 50%+
      case 1:
        return 'bg-gray-300 dark:bg-gray-600'; // Some activity
      default:
        return 'bg-gray-100 dark:bg-gray-800'; // No activity
    }
  };

  // Group by weeks
  const weeks = useMemo(() => {
    const weekGroups: Array<typeof yearData> = [];
    let currentWeek: typeof yearData = [];

    for (const day of yearData) {
      const dayOfWeek = day.date.getDay();
      currentWeek.push(day);

      if (dayOfWeek === 6 || day === yearData[yearData.length - 1]) {
        // Saturday or last day
        weekGroups.push([...currentWeek]);
        currentWeek = [];
      }
    }

    return weekGroups;
  }, [yearData]);

  if (yearData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        {lang === 'tr' ? 'Yeterli veri yok' : 'Not enough data'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div
          className={`grid ${isMobile ? 'grid-cols-7' : 'grid-cols-[repeat(53,minmax(0,1fr))]'} gap-1`}
        >
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={day.key}
                  className={`w-3 h-3 ${getIntensityColor(day.intensity)} rounded-sm transition-all hover:scale-125 hover:z-10`}
                  title={`${format(day.date, 'MMM d, yyyy')}: ${day.points} ${lang === 'tr' ? 'puan' : 'points'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
        <span>{lang === 'tr' ? 'Daha az' : 'Less'}</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm" />
          <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-sm" />
          <div className="w-3 h-3 bg-yellow-400 dark:bg-yellow-600 rounded-sm" />
          <div className="w-3 h-3 bg-green-400 dark:bg-green-600 rounded-sm" />
          <div className="w-3 h-3 bg-green-600 dark:bg-green-500 rounded-sm" />
        </div>
        <span>{lang === 'tr' ? 'Daha fazla' : 'More'}</span>
      </div>
    </div>
  );
}
