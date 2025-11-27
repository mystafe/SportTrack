'use client';

import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  startOfDay,
} from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useActivityDefinitions } from '@/lib/activityStore';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function ActivityCalendar() {
  const { lang } = useI18n();
  const { activities, hydrated } = useActivities();
  const definitions = useActivityDefinitions();
  const isMobile = useIsMobile();
  const dateLocale = lang === 'tr' ? tr : enUS;

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = useMemo(() => {
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [calendarStart, calendarEnd]);

  const activitiesByDate = useMemo(() => {
    const map = new Map<string, Array<{ icon: string; label: string; points: number }>>();

    activities.forEach((activity) => {
      const date = startOfDay(parseISO(activity.performedAt));
      const key = format(date, 'yyyy-MM-dd');
      const definition = definitions.find((d) => d.key === activity.activityKey);

      if (!map.has(key)) {
        map.set(key, []);
      }

      const dayActivities = map.get(key)!;
      const activityLabel = definition
        ? lang === 'tr'
          ? definition.label
          : definition.labelEn || definition.label
        : activity.activityKey;
      const existing = dayActivities.find((a) => a.label === activityLabel);

      if (existing) {
        existing.points += activity.points;
      } else {
        dayActivities.push({
          icon: definition?.icon || '🏃',
          label: activityLabel,
          points: activity.points,
        });
      }
    });

    return map;
  }, [activities, definitions, lang]);

  const getDayActivities = (date: Date) => {
    const key = format(date, 'yyyy-MM-dd');
    return activitiesByDate.get(key) || [];
  };

  const getDayTotalPoints = (date: Date) => {
    const dayActivities = getDayActivities(date);
    return dayActivities.reduce((sum, a) => sum + a.points, 0);
  };

  const weekDays = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    if (lang === 'tr') {
      return ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    }
    return days;
  }, [lang]);

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  if (!hydrated) {
    return null;
  }

  return (
    <Card
      variant="default"
      size="md"
      hoverable
      className="card-entrance"
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📅</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white">
              {format(currentMonth, 'MMMM yyyy', { locale: dateLocale })}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousMonth}
              className="p-1.5 min-w-[32px] min-h-[32px]"
              aria-label={lang === 'tr' ? 'Önceki ay' : 'Previous month'}
            >
              ←
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToday}
              className="px-2 py-1 text-xs"
              aria-label={lang === 'tr' ? 'Bugün' : 'Today'}
            >
              {lang === 'tr' ? 'Bugün' : 'Today'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              className="p-1.5 min-w-[32px] min-h-[32px]"
              aria-label={lang === 'tr' ? 'Sonraki ay' : 'Next month'}
            >
              →
            </Button>
          </div>
        </div>
      }
    >
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className={`text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2 ${
                  isMobile ? 'px-1' : 'px-2'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const dayActivities = getDayActivities(day);
              const totalPoints = getDayTotalPoints(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={index}
                  className={`min-h-[60px] sm:min-h-[80px] p-1 rounded-lg border-2 transition-all duration-200 ${
                    isCurrentMonth
                      ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 opacity-50'
                  } ${isToday ? 'ring-2 ring-brand ring-offset-2 dark:ring-offset-gray-900' : ''} ${
                    dayActivities.length > 0
                      ? 'hover:shadow-md hover:scale-[1.02] cursor-pointer'
                      : ''
                  }`}
                >
                  <div className="flex flex-col h-full">
                    {/* Date number */}
                    <div
                      className={`text-xs font-semibold mb-1 ${
                        isCurrentMonth
                          ? isToday
                            ? 'text-brand'
                            : 'text-gray-950 dark:text-white'
                          : 'text-gray-400 dark:text-gray-600'
                      }`}
                    >
                      {format(day, 'd')}
                    </div>

                    {/* Activities */}
                    <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
                      {dayActivities.slice(0, isMobile ? 2 : 3).map((activity, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 text-[10px] sm:text-xs bg-gray-100 dark:bg-gray-700 rounded px-1 py-0.5 truncate"
                          title={`${activity.label}: ${activity.points} ${lang === 'tr' ? 'puan' : 'points'}`}
                        >
                          <span className="flex-shrink-0">{activity.icon}</span>
                          <span className="truncate flex-1 min-w-0">{activity.label}</span>
                          <span className="flex-shrink-0 font-semibold text-brand">
                            {activity.points}
                          </span>
                        </div>
                      ))}
                      {dayActivities.length > (isMobile ? 2 : 3) && (
                        <div className="text-[9px] text-gray-500 dark:text-gray-400 text-center py-0.5">
                          +{dayActivities.length - (isMobile ? 2 : 3)}{' '}
                          {lang === 'tr' ? 'daha' : 'more'}
                        </div>
                      )}
                    </div>

                    {/* Total points */}
                    {totalPoints > 0 && (
                      <div className="mt-auto pt-1 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-[10px] font-bold text-brand text-center">
                          {totalPoints} {lang === 'tr' ? 'puan' : 'pts'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded border-2 border-brand" />
            <span>{lang === 'tr' ? 'Bugün' : 'Today'}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-gray-200 dark:bg-gray-700" />
            <span>{lang === 'tr' ? 'Aktivite var' : 'Has activity'}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600" />
            <span>{lang === 'tr' ? 'Boş gün' : 'Empty day'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
