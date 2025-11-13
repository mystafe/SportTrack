'use client';

import { useMemo, useState } from 'react';
import { format, startOfDay, parseISO, eachDayOfInterval, subDays, isSameDay } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useI18n } from '@/lib/i18n';
import { useActivities, useActivitiesSummary } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';
import { getActivityLabel, getActivityUnit } from '@/lib/activityUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { TrendChart } from '@/components/charts/TrendChart';
import { ActivityBarChart } from '@/components/charts/ActivityBarChart';
import { ActivityPieChart } from '@/components/charts/ActivityPieChart';
import { ActivityHeatmap } from '@/components/charts/ActivityHeatmap';
import { PersonalRecords } from '@/components/PersonalRecords';
import { ActivityTimeAnalysis } from '@/components/ActivityTimeAnalysis';
import { PeriodComparison } from '@/components/PeriodComparison';
import { DurationStats } from '@/components/DurationStats';
import { ActivityTypeTrend } from '@/components/ActivityTypeTrend';

export default function StatsPage() {
  const { t, lang } = useI18n();
  const { activities, hydrated } = useActivities();
  const { settings } = useSettings();
  const target = settings?.dailyTarget && settings.dailyTarget > 0
    ? settings.dailyTarget
    : DEFAULT_DAILY_TARGET;
  const summary = useActivitiesSummary(target);
  const dateLocale = lang === 'tr' ? tr : enUS;
  const isMobile = useIsMobile();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [trendDays, setTrendDays] = useState<7 | 30 | 90>(30);

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US'),
    [lang]
  );

  // Calculate all days with activities
  const allDays = useMemo(() => {
    if (activities.length === 0) return [];
    const daysMap = new Map<string, { date: Date; points: number; activities: typeof activities }>();
    
    for (const activity of activities) {
      const date = startOfDay(parseISO(activity.performedAt));
      const key = date.toISOString();
      const existing = daysMap.get(key);
      
      if (existing) {
        existing.points += activity.points;
        existing.activities.push(activity);
      } else {
        daysMap.set(key, {
          date,
          points: activity.points,
          activities: [activity]
        });
      }
    }
    
    return Array.from(daysMap.values())
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [activities]);

  // Calculate best streak
  const bestStreak = useMemo(() => {
    if (allDays.length === 0) return 0;
    const sortedDays = [...allDays].sort((a, b) => a.date.getTime() - b.date.getTime());
    let maxStreak = 0;
    let currentStreak = 0;
    
    for (const day of sortedDays) {
      if (day.points >= target) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return maxStreak;
  }, [allDays, target]);

  // Calculate completion rate
  const completionRate = useMemo(() => {
    if (allDays.length === 0) return 0;
    const completedDays = allDays.filter(day => day.points >= target).length;
    return Math.round((completedDays / allDays.length) * 100);
  }, [allDays, target]);

  // Activity breakdown by type
  const activityBreakdown = useMemo(() => {
    const breakdown = new Map<string, {
      label: string;
      icon: string;
      count: number;
      totalPoints: number;
      totalAmount: number;
      unit: string;
    }>();
    
    for (const activity of activities) {
      const key = activity.activityKey;
      const existing = breakdown.get(key);
      
      if (existing) {
        existing.count++;
        existing.totalPoints += activity.points;
        existing.totalAmount += activity.amount;
      } else {
        breakdown.set(key, {
          label: getActivityLabel(activity, lang),
          icon: activity.icon,
          count: 1,
          totalPoints: activity.points,
          totalAmount: activity.amount,
          unit: getActivityUnit(activity, lang)
        });
      }
    }
    
    return Array.from(breakdown.values())
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }, [activities, lang]);

  // Selected day activities
  const selectedDayActivities = useMemo(() => {
    if (!selectedDate) return [];
    const selected = startOfDay(parseISO(selectedDate + 'T00:00:00'));
    return activities.filter(activity =>
      isSameDay(startOfDay(parseISO(activity.performedAt)), selected)
    ).sort((a, b) => parseISO(b.performedAt).getTime() - parseISO(a.performedAt).getTime());
  }, [selectedDate, activities]);

  const selectedDayData = useMemo(() => {
    if (!selectedDate) return null;
    const selected = startOfDay(parseISO(selectedDate + 'T00:00:00'));
    return allDays.find(day => isSameDay(day.date, selected));
  }, [selectedDate, allDays]);

  if (!hydrated) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 page-transition">
        <h1 className={`stats-title ${isMobile ? 'title-entrance' : ''} text-2xl sm:text-3xl font-bold flex items-center gap-2`}>
        <span className={`text-2xl sm:text-3xl icon-rotate ${isMobile ? 'icon-wiggle-mobile' : 'emoji-bounce'}`}>📊</span>
        <span className="text-gray-950 dark:text-white">{t('nav.stats')}</span>
      </h1>

      {/* Summary Cards */}
            <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'} ${isMobile ? 'gap-2' : 'gap-4'}`}>
              <div className={`stagger-item card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} stats-highlight-card rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'p-2.5' : 'p-4'} shadow-md hover:shadow-xl transition-shadow duration-300 gpu-accelerated`}>
                <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold text-gray-700 dark:text-gray-300 mb-1`}>{t('stats.detailed.totalActivities')}</div>
                <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : 'number-transition'}`}>{numberFormatter.format(activities.length)}</div>
              </div>

              <div className={`stagger-item card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} stats-highlight-card rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'p-2.5' : 'p-4'} shadow-md hover:shadow-xl transition-shadow duration-300 gpu-accelerated`}>
                <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold text-gray-700 dark:text-gray-300 mb-1`}>{t('stats.detailed.totalSessions')}</div>
                <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : 'number-transition'}`}>{numberFormatter.format(allDays.length)}</div>
              </div>

              <div className={`stagger-item card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} stats-highlight-card rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'p-2.5' : 'p-4'} shadow-md hover:shadow-xl transition-shadow duration-300 gpu-accelerated`}>
                <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold text-gray-700 dark:text-gray-300 mb-1`}>{t('stats.detailed.averagePerDay')}</div>
                <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : 'number-transition'}`}>
                  {allDays.length > 0
                    ? numberFormatter.format(Math.round(allDays.reduce((sum, day) => sum + day.points, 0) / allDays.length))
                    : '0'} {t('list.pointsUnit')}
                </div>
              </div>

              <div className={`stagger-item card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} stats-highlight-card rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 ${isMobile ? 'p-2.5' : 'p-4'} shadow-md hover:shadow-xl transition-shadow duration-300 gpu-accelerated`}>
                <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold text-gray-700 dark:text-gray-300 mb-1`}>{t('stats.detailed.bestStreak')}</div>
                <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : 'number-transition'}`}>{bestStreak} {bestStreak === 1 ? t('stats.highlight.sessions') : t('stats.highlight.sessions')}</div>
              </div>
            </div>

      {/* Activity Breakdown */}
      <div className="chart-container card-entrance slide-in-left rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300 magnetic-hover gpu-accelerated">
        <h2 className="text-lg font-bold text-gray-950 dark:text-white mb-4">{t('stats.detailed.activityBreakdown')}</h2>
        {activityBreakdown.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('stats.detailed.noActivities')}</p>
        ) : (
          <div className="space-y-3">
            {activityBreakdown.map((activity) => (
              <div
                key={activity.label}
                className="flex items-center justify-between p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800/50 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700/50 dark:hover:to-gray-700/30 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-2xl ${isMobile ? 'emoji-celebrate' : 'emoji-bounce'}`}>{activity.icon}</span>
                  <div>
                    <div className="font-bold text-gray-950 dark:text-gray-100">{activity.label}</div>
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {activity.count} {activity.count === 1 ? t('stats.highlight.sessions') : t('stats.highlight.sessions')} • {numberFormatter.format(activity.totalAmount)} {activity.unit}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-950 dark:text-gray-100">{numberFormatter.format(activity.totalPoints)} {t('list.pointsUnit')}</div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    {Math.round((activity.totalPoints / summary.totalPoints) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trend Chart */}
      <div className="rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-950 dark:text-white">{t('stats.detailed.trendChart')}</h2>
          <div className="flex items-center gap-2">
            {([7, 30, 90] as const).map((days) => (
              <button
                key={days}
                onClick={() => setTrendDays(days)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 ${
                  trendDays === days
                    ? 'bg-gradient-to-r from-brand to-brand-dark text-white shadow-md'
                    : 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:shadow-md'
                }`}
              >
                {days} {lang === 'tr' ? 'gün' : 'days'}
              </button>
            ))}
          </div>
        </div>
        <TrendChart activities={activities} target={target} days={trendDays} />
      </div>

      {/* Charts Row */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-4 sm:gap-6`}>
        {/* Bar Chart */}
        <div className="chart-container card-entrance slide-in-left rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300 magnetic-hover gpu-accelerated">
          <h2 className="text-lg font-bold text-gray-950 dark:text-white mb-4">{t('stats.detailed.activityComparison')}</h2>
          <ActivityBarChart activities={activities} />
        </div>

        {/* Pie Chart */}
        <div className="chart-container card-entrance slide-in-right rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300 magnetic-hover gpu-accelerated">
          <h2 className="text-lg font-bold text-gray-950 dark:text-white mb-4">{t('stats.detailed.activityDistribution')}</h2>
          <ActivityPieChart activities={activities} />
        </div>
      </div>

      {/* Heatmap */}
      <div className="rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-lg font-bold text-gray-950 dark:text-white mb-4">{t('stats.detailed.activityHeatmap')}</h2>
        <ActivityHeatmap activities={activities} target={target} />
      </div>

      {/* Daily Statistics */}
      <div className="rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-lg font-bold text-gray-950 dark:text-white mb-4">{t('stats.detailed.dailyStats')}</h2>
        
        {/* Date Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{t('stats.detailed.selectDate')}</label>
          <input
            type="date"
            value={selectedDate || ''}
            onChange={(e) => setSelectedDate(e.target.value || null)}
            max={format(new Date(), 'yyyy-MM-dd')}
            className="w-full sm:w-auto border-2 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 focus:border-brand dark:focus:border-brand/60 focus:ring-2 focus:ring-brand/20 dark:focus:ring-brand/30 transition-all duration-200 input-enhanced"
          />
        </div>

        {/* Selected Day Details */}
        {selectedDate && selectedDayData && (
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800/50 dark:via-gray-800/30 dark:to-gray-800/50 border-2 border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-gray-950 dark:text-white mb-2">
              {format(selectedDayData.date, 'd MMMM yyyy, EEEE', { locale: dateLocale })}
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-gray-500">{t('stats.totalPoints')}</div>
                <div className="text-lg font-semibold">
                  {numberFormatter.format(selectedDayData.points)} / {numberFormatter.format(target)} {t('list.pointsUnit')}
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round((selectedDayData.points / target) * 100)}% {t('stats.highlight.complete')}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">{t('stats.detailed.totalActivities')}</div>
                <div className="text-lg font-semibold">{selectedDayData.activities.length}</div>
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 mb-2">{t('stats.detailed.activitiesOnDay')}</div>
              <div className="space-y-2">
                {selectedDayActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-2 rounded border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <span>{activity.icon}</span>
                      <span className="text-sm">{getActivityLabel(activity, lang)}</span>
                    </div>
                    <div className="text-sm font-medium">
                      {numberFormatter.format(activity.amount)} {getActivityUnit(activity, lang)} • {numberFormatter.format(activity.points)} {t('list.pointsUnit')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* All Days List */}
        <div className="max-h-[600px] overflow-y-auto">
          {allDays.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('stats.detailed.noActivities')}</p>
          ) : (
            <div className="space-y-2">
              {allDays.map((day) => {
                const dayKey = format(day.date, 'yyyy-MM-dd');
                const isSelected = selectedDate === dayKey;
                const isCompleted = day.points >= target;
                
                return (
                  <button
                    key={dayKey}
                    type="button"
                    onClick={() => setSelectedDate(isSelected ? null : dayKey)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                      isSelected
                        ? 'border-brand bg-gradient-to-r from-brand/15 via-brand/10 to-brand/15 dark:from-brand/25 dark:via-brand/20 dark:to-brand/25 shadow-md'
                        : 'border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-800/30 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700/50 dark:hover:to-gray-700/30 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                      <div>
                        <div className="font-medium">
                          {format(day.date, 'd MMMM yyyy, EEEE', { locale: dateLocale })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {day.activities.length} {day.activities.length === 1 ? t('stats.highlight.sessions') : t('stats.highlight.sessions')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${isCompleted ? 'text-green-600 dark:text-green-400' : ''}`}>
                        {numberFormatter.format(day.points)} / {numberFormatter.format(target)} {t('list.pointsUnit')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round((day.points / target) * 100)}%
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Completion Rate */}
      <div className="rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-lg font-bold text-gray-950 dark:text-white mb-4">{t('stats.detailed.completionRate')}</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
          <div className="text-2xl font-bold">{completionRate}%</div>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {allDays.filter(day => day.points >= target).length} / {allDays.length} {t('stats.detailed.totalSessions')}
        </div>
      </div>

      {/* Personal Records */}
      <PersonalRecords />

      {/* Activity Time Analysis */}
      <ActivityTimeAnalysis activities={activities} />

      {/* Period Comparison */}
      <PeriodComparison />

      {/* Duration Stats */}
      <DurationStats />

      {/* Activity Type Trend */}
      <ActivityTypeTrend />
    </div>
  );
}

