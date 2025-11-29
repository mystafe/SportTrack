'use client';

import { useMemo, useState, lazy, Suspense } from 'react';
import { format, startOfDay, parseISO, eachDayOfInterval, subDays, isSameDay } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { useI18n } from '@/lib/i18n';
import { useActivities, useActivitiesSummary } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { DEFAULT_DAILY_TARGET } from '@/lib/activityConfig';
import { getActivityLabel, getActivityUnit } from '@/lib/activityUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { PageSkeleton } from '@/components/LoadingSkeleton';
import { ChartSkeleton } from '@/components/ChartSkeleton';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Accordion } from '@/components/ui/Accordion';
import {
  calculateWeeklyStats,
  calculateMonthlyStats,
  calculateConsistencyScore,
  calculateActivityDiversity,
  calculateProgressVelocity,
  getMostActiveDayType,
  getMostActiveHourRange,
  calculateStreakStats,
} from '@/lib/statisticsUtils';

// Lazy load chart components for better performance
const TrendChart = lazy(() =>
  import('@/components/charts/TrendChart').then((m) => ({ default: m.TrendChart }))
);
const ActivityBarChart = lazy(() =>
  import('@/components/charts/ActivityBarChart').then((m) => ({ default: m.ActivityBarChart }))
);
const ActivityPieChart = lazy(() =>
  import('@/components/charts/ActivityPieChart').then((m) => ({ default: m.ActivityPieChart }))
);
const ActivityHeatmap = lazy(() =>
  import('@/components/charts/ActivityHeatmap').then((m) => ({ default: m.default }))
);
const PersonalRecords = lazy(() =>
  import('@/components/PersonalRecords').then((m) => ({ default: m.PersonalRecords }))
);
const ActivityTimeAnalysis = lazy(() =>
  import('@/components/ActivityTimeAnalysis').then((m) => ({ default: m.ActivityTimeAnalysis }))
);
const PeriodComparison = lazy(() =>
  import('@/components/PeriodComparison').then((m) => ({ default: m.PeriodComparison }))
);
const DurationStats = lazy(() =>
  import('@/components/DurationStats').then((m) => ({ default: m.DurationStats }))
);
const ActivityTypeTrend = lazy(() =>
  import('@/components/ActivityTypeTrend').then((m) => ({ default: m.ActivityTypeTrend }))
);
const ActivityPerformanceAnalysis = lazy(() =>
  import('@/components/ActivityPerformance').then((m) => ({
    default: m.ActivityPerformanceAnalysis,
  }))
);
const WeeklySummary = lazy(() =>
  import('@/components/WeeklySummary').then((m) => ({ default: m.WeeklySummary }))
);
const ActivityComparison = lazy(() =>
  import('@/components/ActivityComparison').then((m) => ({ default: m.ActivityComparison }))
);
const ActivityTrendAnalysis = lazy(() =>
  import('@/components/ActivityTrendAnalysis').then((m) => ({ default: m.ActivityTrendAnalysis }))
);
const ActivityCategoryAnalysis = lazy(() =>
  import('@/components/ActivityCategoryAnalysis').then((m) => ({
    default: m.ActivityCategoryAnalysis,
  }))
);
const ActivityRecords = lazy(() =>
  import('@/components/ActivityRecords').then((m) => ({ default: m.ActivityRecords }))
);
const ActivityGoalsDashboard = lazy(() =>
  import('@/components/ActivityGoalsDashboard').then((m) => ({ default: m.ActivityGoalsDashboard }))
);
const ActivityCalendar = lazy(() =>
  import('@/components/ActivityCalendar').then((m) => ({ default: m.ActivityCalendar }))
);
const ActivityGoalsTimeline = lazy(() =>
  import('@/components/ActivityGoalsTimeline').then((m) => ({ default: m.ActivityGoalsTimeline }))
);
const ActivityPerformanceComparison = lazy(() =>
  import('@/components/ActivityPerformanceComparison').then((m) => ({
    default: m.ActivityPerformanceComparison,
  }))
);
const ActivityPerformanceSummary = lazy(() =>
  import('@/components/ActivityPerformanceSummary').then((m) => ({
    default: m.ActivityPerformanceSummary,
  }))
);
const ActivityPerformanceForecast = lazy(() =>
  import('@/components/ActivityPerformanceForecast').then((m) => ({
    default: m.ActivityPerformanceForecast,
  }))
);
const ActivityPerformanceReport = lazy(() =>
  import('@/components/ActivityPerformanceReport').then((m) => ({
    default: m.ActivityPerformanceReport,
  }))
);
const ActivityPerformanceHeatmap = lazy(() =>
  import('@/components/ActivityPerformanceHeatmap').then((m) => ({
    default: m.ActivityPerformanceHeatmap,
  }))
);
const ActivityPerformanceDistribution = lazy(() =>
  import('@/components/ActivityPerformanceDistribution').then((m) => ({
    default: m.ActivityPerformanceDistribution,
  }))
);
const ActivityPerformanceDashboard = lazy(() =>
  import('@/components/ActivityPerformanceDashboard').then((m) => ({
    default: m.ActivityPerformanceDashboard,
  }))
);
const ActivityComparisonMatrix = lazy(() =>
  import('@/components/ActivityComparisonMatrix').then((m) => ({
    default: m.ActivityComparisonMatrix,
  }))
);
const ActivityPerformanceRecommendations = lazy(() =>
  import('@/components/ActivityPerformanceRecommendations').then((m) => ({
    default: m.ActivityPerformanceRecommendations,
  }))
);

export default function StatsPage() {
  const { t, lang } = useI18n();
  const { activities, hydrated } = useActivities();
  const { settings } = useSettings();
  const target =
    settings?.dailyTarget && settings.dailyTarget > 0 ? settings.dailyTarget : DEFAULT_DAILY_TARGET;
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
    const daysMap = new Map<
      string,
      { date: Date; points: number; activities: typeof activities }
    >();

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
          activities: [activity],
        });
      }
    }

    return Array.from(daysMap.values()).sort((a, b) => b.date.getTime() - a.date.getTime());
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
    const completedDays = allDays.filter((day) => day.points >= target).length;
    return Math.round((completedDays / allDays.length) * 100);
  }, [allDays, target]);

  // Calculate advanced statistics
  const weeklyStats = useMemo(
    () => calculateWeeklyStats(activities, target, 4),
    [activities, target]
  );
  const monthlyStats = useMemo(
    () => calculateMonthlyStats(activities, target, 6),
    [activities, target]
  );
  const consistencyScore = useMemo(
    () => calculateConsistencyScore(activities, target),
    [activities, target]
  );
  const activityDiversity = useMemo(() => calculateActivityDiversity(activities), [activities]);
  const progressVelocity = useMemo(() => calculateProgressVelocity(activities, 30), [activities]);
  const mostActiveDayType = useMemo(() => getMostActiveDayType(activities), [activities]);
  const mostActiveHour = useMemo(() => getMostActiveHourRange(activities), [activities]);
  const streakStats = useMemo(() => calculateStreakStats(activities, target), [activities, target]);

  // Activity breakdown by type
  const activityBreakdown = useMemo(() => {
    const breakdown = new Map<
      string,
      {
        label: string;
        icon: string;
        count: number;
        totalPoints: number;
        totalAmount: number;
        unit: string;
      }
    >();

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
          unit: getActivityUnit(activity, lang),
        });
      }
    }

    return Array.from(breakdown.values()).sort((a, b) => b.totalPoints - a.totalPoints);
  }, [activities, lang]);

  // Selected day activities
  const selectedDayActivities = useMemo(() => {
    if (!selectedDate) return [];
    const selected = startOfDay(parseISO(selectedDate + 'T00:00:00'));
    return activities
      .filter((activity) => isSameDay(startOfDay(parseISO(activity.performedAt)), selected))
      .sort((a, b) => parseISO(b.performedAt).getTime() - parseISO(a.performedAt).getTime());
  }, [selectedDate, activities]);

  const selectedDayData = useMemo(() => {
    if (!selectedDate) return null;
    const selected = startOfDay(parseISO(selectedDate + 'T00:00:00'));
    return allDays.find((day) => isSameDay(day.date, selected));
  }, [selectedDate, allDays]);

  if (!hydrated) {
    return (
      <main className="space-y-4 sm:space-y-6" role="main" aria-label={t('nav.stats')}>
        <PageSkeleton />
        <div
          className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'} ${isMobile ? 'gap-2' : 'gap-4'}`}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 skeleton"
            >
              <div className="h-4 w-24 rounded skeleton mb-3" />
              <div className="h-8 w-32 rounded skeleton" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main
      className="space-y-4 sm:space-y-6 page-transition"
      role="main"
      aria-label={t('nav.stats')}
    >
      <h1
        className={`stats-title ${isMobile ? 'title-entrance' : ''} text-2xl sm:text-3xl font-bold flex items-center gap-2`}
      >
        <span
          className={`text-2xl sm:text-3xl icon-rotate ${isMobile ? 'icon-wiggle-mobile' : 'emoji-bounce'}`}
        >
          📊
        </span>
        <span className="text-gray-950 dark:text-white">{t('nav.stats')}</span>
      </h1>

      {/* Summary Cards */}
      <div
        className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'} ${isMobile ? 'gap-2' : 'gap-4'}`}
      >
        <Card
          variant="default"
          size="sm"
          hoverable
          className={`stagger-item card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} stats-highlight-card gpu-accelerated`}
        >
          <div
            className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold text-gray-700 dark:text-gray-300 mb-1`}
          >
            {t('stats.detailed.totalActivities')}
          </div>
          <div
            className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : 'number-transition'}`}
          >
            {numberFormatter.format(activities.length)}
          </div>
        </Card>

        <Card
          variant="default"
          size="sm"
          hoverable
          className={`stagger-item card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} stats-highlight-card gpu-accelerated`}
        >
          <div
            className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold text-gray-700 dark:text-gray-300 mb-1`}
          >
            {t('stats.detailed.totalSessions')}
          </div>
          <div
            className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : 'number-transition'}`}
          >
            {numberFormatter.format(allDays.length)}
          </div>
        </Card>

        <Card
          variant="default"
          size="sm"
          hoverable
          className={`stagger-item card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} stats-highlight-card gpu-accelerated`}
        >
          <div
            className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold text-gray-700 dark:text-gray-300 mb-1`}
          >
            {t('stats.detailed.averagePerDay')}
          </div>
          <div
            className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : 'number-transition'}`}
          >
            {allDays.length > 0
              ? numberFormatter.format(
                  Math.round(allDays.reduce((sum, day) => sum + day.points, 0) / allDays.length)
                )
              : '0'}{' '}
            {t('list.pointsUnit')}
          </div>
        </Card>

        <Card
          variant="default"
          size="sm"
          hoverable
          className={`stagger-item card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} stats-highlight-card gpu-accelerated`}
        >
          <div
            className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold text-gray-700 dark:text-gray-300 mb-1`}
          >
            {t('stats.detailed.bestStreak')}
          </div>
          <div
            className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : 'number-transition'}`}
          >
            {bestStreak}{' '}
            {bestStreak === 1 ? t('stats.highlight.sessions') : t('stats.highlight.sessions')}
          </div>
        </Card>
      </div>

      {/* Advanced Statistics Row */}
      <div
        className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'} ${isMobile ? 'gap-2' : 'gap-4'}`}
      >
        {/* Weekly Average */}
        <Card
          variant="default"
          size="sm"
          hoverable
          className={`stagger-item card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} stats-highlight-card gpu-accelerated`}
        >
          <div
            className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold text-gray-700 dark:text-gray-300 mb-1`}
          >
            {t('stats.detailed.weeklyAverage')}
          </div>
          <div
            className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : 'number-transition'}`}
          >
            {weeklyStats.length > 0
              ? numberFormatter.format(
                  Math.round(weeklyStats[weeklyStats.length - 1].averagePerDay)
                )
              : '0'}{' '}
            {t('list.pointsUnit')}
          </div>
        </Card>

        {/* Monthly Average */}
        <Card
          variant="default"
          size="sm"
          hoverable
          className={`stagger-item card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} stats-highlight-card gpu-accelerated`}
        >
          <div
            className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold text-gray-700 dark:text-gray-300 mb-1`}
          >
            {t('stats.detailed.monthlyAverage')}
          </div>
          <div
            className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : 'number-transition'}`}
          >
            {monthlyStats.length > 0
              ? numberFormatter.format(
                  Math.round(monthlyStats[monthlyStats.length - 1].averagePerDay)
                )
              : '0'}{' '}
            {t('list.pointsUnit')}
          </div>
        </Card>

        {/* Consistency Score */}
        <Card
          variant="default"
          size="sm"
          hoverable
          className={`stagger-item card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} stats-highlight-card gpu-accelerated`}
        >
          <div
            className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold text-gray-700 dark:text-gray-300 mb-1`}
          >
            {t('stats.detailed.consistencyScore')}
          </div>
          <div
            className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : 'number-transition'}`}
          >
            {consistencyScore.score}/100
          </div>
        </Card>

        {/* Activity Diversity */}
        <Card
          variant="default"
          size="sm"
          hoverable
          className={`stagger-item card-entrance ${isMobile ? 'mobile-card-lift touch-feedback bounce-in-mobile' : ''} stats-highlight-card gpu-accelerated`}
        >
          <div
            className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold text-gray-700 dark:text-gray-300 mb-1`}
          >
            {t('stats.detailed.activityDiversity')}
          </div>
          <div
            className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-950 dark:text-gray-100 ${isMobile ? 'number-count-mobile' : 'number-transition'}`}
          >
            {activityDiversity.score}/100
          </div>
        </Card>
      </div>

      {/* Activity Breakdown */}
      <Card
        variant="default"
        size="md"
        hoverable
        className="chart-container card-entrance slide-in-left magnetic-hover gpu-accelerated"
        header={
          <h2 className="text-lg font-bold text-gray-950 dark:text-white">
            {t('stats.detailed.activityBreakdown')}
          </h2>
        }
      >
        {activityBreakdown.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('stats.detailed.noActivities')}
          </p>
        ) : (
          <div className="space-y-3">
            {activityBreakdown.map((activity) => (
              <div
                key={activity.label}
                className="flex items-center justify-between p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-800/50 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700/50 dark:hover:to-gray-700/30 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-2xl ${isMobile ? 'emoji-celebrate' : 'emoji-bounce'}`}>
                    {activity.icon}
                  </span>
                  <div>
                    <div className="font-bold text-gray-950 dark:text-gray-100">
                      {activity.label}
                    </div>
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {activity.count}{' '}
                      {activity.count === 1
                        ? t('stats.highlight.sessions')
                        : t('stats.highlight.sessions')}{' '}
                      • {numberFormatter.format(activity.totalAmount)} {activity.unit}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-950 dark:text-gray-100">
                    {numberFormatter.format(activity.totalPoints)} {t('list.pointsUnit')}
                  </div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    {Math.round((activity.totalPoints / summary.totalPoints) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Trend Chart - Accordion */}
      <Accordion
        title={t('stats.detailed.trendChart')}
        icon="📈"
        defaultOpen={true}
        className="card-entrance"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {([7, 30, 90] as const).map((days) => (
              <Button
                key={days}
                type="button"
                variant={trendDays === days ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setTrendDays(days)}
              >
                {days} {lang === 'tr' ? 'gün' : 'days'}
              </Button>
            ))}
          </div>
        </div>
        <Suspense fallback={<ChartSkeleton />}>
          <TrendChart activities={activities} target={target} days={trendDays} />
        </Suspense>
      </Accordion>

      {/* Charts Row - Accordion */}
      <Accordion
        title={lang === 'tr' ? 'Aktivite Grafikleri' : 'Activity Charts'}
        icon="📊"
        defaultOpen={true}
        className="card-entrance"
      >
        <div
          className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-4 sm:gap-6`}
        >
          {/* Bar Chart */}
          <div className="chart-container card-entrance slide-in-left rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300 magnetic-hover gpu-accelerated">
            <h2 className="text-lg font-bold text-gray-950 dark:text-white mb-4">
              {t('stats.detailed.activityComparison')}
            </h2>
            <Suspense fallback={<ChartSkeleton />}>
              <ActivityBarChart activities={activities} />
            </Suspense>
          </div>

          {/* Pie Chart */}
          <div className="chart-container card-entrance slide-in-right rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow duration-300 magnetic-hover gpu-accelerated">
            <h2 className="text-lg font-bold text-gray-950 dark:text-white mb-4">
              {t('stats.detailed.activityDistribution')}
            </h2>
            <Suspense fallback={<ChartSkeleton />}>
              <ActivityPieChart activities={activities} />
            </Suspense>
          </div>
        </div>
      </Accordion>

      {/* Heatmap - Accordion */}
      <Accordion
        title={t('stats.detailed.activityHeatmap')}
        icon="🔥"
        defaultOpen={false}
        className="card-entrance"
      >
        <Suspense fallback={<ChartSkeleton />}>
          <ActivityHeatmap activities={activities} target={target} />
        </Suspense>
      </Accordion>

      {/* Daily Statistics - Accordion */}
      <Accordion
        title={t('stats.detailed.dailyStats')}
        icon="📅"
        defaultOpen={false}
        className="card-entrance"
      >
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
                  {numberFormatter.format(selectedDayData.points)} /{' '}
                  {numberFormatter.format(target)} {t('list.pointsUnit')}
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round((selectedDayData.points / target) * 100)}%{' '}
                  {t('stats.highlight.complete')}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">{t('stats.detailed.totalActivities')}</div>
                <div className="text-lg font-semibold">{selectedDayData.activities.length}</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-2">
                {t('stats.detailed.activitiesOnDay')}
              </div>
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
                      {numberFormatter.format(activity.amount)} {getActivityUnit(activity, lang)} •{' '}
                      {numberFormatter.format(activity.points)} {t('list.pointsUnit')}
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
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('stats.detailed.noActivities')}
            </p>
          ) : (
            <div className="space-y-2">
              {allDays.map((day) => {
                const dayKey = format(day.date, 'yyyy-MM-dd');
                const isSelected = selectedDate === dayKey;
                const isCompleted = day.points >= target;

                return (
                  <Button
                    key={dayKey}
                    type="button"
                    variant={isSelected ? 'primary' : 'outline'}
                    className="w-full flex items-center justify-between p-3 text-left h-auto"
                    onClick={() => setSelectedDate(isSelected ? null : dayKey)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      />
                      <div>
                        <div className="font-medium">
                          {format(day.date, 'd MMMM yyyy, EEEE', { locale: dateLocale })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {day.activities.length}{' '}
                          {day.activities.length === 1
                            ? t('stats.highlight.sessions')
                            : t('stats.highlight.sessions')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-semibold ${isCompleted ? 'text-green-600 dark:text-green-400' : ''}`}
                      >
                        {numberFormatter.format(day.points)} / {numberFormatter.format(target)}{' '}
                        {t('list.pointsUnit')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round((day.points / target) * 100)}%
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </Accordion>

      {/* Completion Rate - Accordion */}
      <Accordion
        title={t('stats.detailed.completionRate')}
        icon="✅"
        defaultOpen={false}
        className="card-entrance"
      >
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand transition-all duration-500 progress-bar-fill"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
          <div className="text-2xl font-bold">{completionRate}%</div>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {allDays.filter((day) => day.points >= target).length} / {allDays.length}{' '}
          {t('stats.detailed.totalSessions')}
        </div>
      </Accordion>

      {/* Advanced Metrics Section - Accordion */}
      <Accordion
        title={lang === 'tr' ? 'Gelişmiş Metrikler' : 'Advanced Metrics'}
        icon="📈"
        defaultOpen={false}
        className="card-entrance"
      >
        <div
          className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-4 sm:gap-6`}
        >
          {/* Consistency Score Details */}
          <Card
            variant="default"
            size="md"
            hoverable
            className="chart-container card-entrance slide-in-left gpu-accelerated"
            header={
              <h2 className="text-lg font-bold text-gray-950 dark:text-white">
                {t('stats.detailed.consistencyScore')}
              </h2>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('stats.detailed.regularity')}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500 progress-bar-fill"
                      style={{ width: `${consistencyScore.factors.regularity}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">
                    {consistencyScore.factors.regularity}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('stats.detailed.frequency')}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-500 progress-bar-fill"
                      style={{ width: `${consistencyScore.factors.frequency}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">
                    {consistencyScore.factors.frequency}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('stats.detailed.progression')}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all duration-500 progress-bar-fill"
                      style={{ width: `${consistencyScore.factors.progression}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">
                    {consistencyScore.factors.progression}%
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-900 dark:text-white">
                    {t('stats.detailed.consistencyScore')}
                  </span>
                  <span className="text-2xl font-bold text-brand">
                    {consistencyScore.score}/100
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Activity Diversity Details */}
          <Card
            variant="default"
            size="md"
            hoverable
            className="chart-container card-entrance slide-in-right gpu-accelerated"
            header={
              <h2 className="text-lg font-bold text-gray-950 dark:text-white">
                {t('stats.detailed.activityDiversity')}
              </h2>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('stats.detailed.uniqueActivities')}
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {activityDiversity.uniqueActivities}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('stats.detailed.totalActivities')}
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {activityDiversity.totalActivities}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('stats.detailed.diversityRatio')}
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {(activityDiversity.diversityRatio * 100).toFixed(1)}%
                </span>
              </div>
              <div className="pt-2 border-t-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-900 dark:text-white">
                    {t('stats.detailed.activityDiversity')}
                  </span>
                  <span className="text-2xl font-bold text-brand">
                    {activityDiversity.score}/100
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Progress Velocity */}
          <Card
            variant="default"
            size="md"
            hoverable
            className="chart-container card-entrance slide-in-left gpu-accelerated"
            header={
              <h2 className="text-lg font-bold text-gray-950 dark:text-white">
                {t('stats.detailed.progressVelocity')}
              </h2>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {lang === 'tr' ? 'Son 30 Gün Ortalama' : 'Last 30 Days Average'}
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {numberFormatter.format(Math.round(progressVelocity.currentAverage))}{' '}
                  {t('list.pointsUnit')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {lang === 'tr' ? 'Önceki 30 Gün Ortalama' : 'Previous 30 Days Average'}
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {numberFormatter.format(Math.round(progressVelocity.previousAverage))}{' '}
                  {t('list.pointsUnit')}
                </span>
              </div>
              <div className="pt-2 border-t-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-900 dark:text-white">
                    {progressVelocity.trend === 'up'
                      ? t('stats.detailed.trendUp')
                      : progressVelocity.trend === 'down'
                        ? t('stats.detailed.trendDown')
                        : t('stats.detailed.trendStable')}
                  </span>
                  <span
                    className={`text-2xl font-bold ${
                      progressVelocity.velocity > 0
                        ? 'text-green-600 dark:text-green-400'
                        : progressVelocity.velocity < 0
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {progressVelocity.velocity > 0 ? '+' : ''}
                    {progressVelocity.velocity.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Most Active Day Type */}
          <Card
            variant="default"
            size="md"
            hoverable
            className="chart-container card-entrance slide-in-right gpu-accelerated"
            header={
              <h2 className="text-lg font-bold text-gray-950 dark:text-white">
                {t('stats.detailed.mostActiveDayType')}
              </h2>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-700">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('stats.detailed.weekday')}
                </span>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {numberFormatter.format(mostActiveDayType.weekday.average)}{' '}
                    {t('list.pointsUnit')}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {mostActiveDayType.weekday.count} {t('stats.highlight.sessions')}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-200 dark:border-green-700">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('stats.detailed.weekend')}
                </span>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {numberFormatter.format(mostActiveDayType.weekend.average)}{' '}
                    {t('list.pointsUnit')}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {mostActiveDayType.weekend.count} {t('stats.highlight.sessions')}
                  </div>
                </div>
              </div>
              {mostActiveDayType.mostActive !== 'equal' && (
                <div className="pt-2 border-t-2 border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {lang === 'tr' ? 'En Aktif:' : 'Most Active:'}{' '}
                    </span>
                    <span className="text-base font-bold text-brand">
                      {mostActiveDayType.mostActive === 'weekday'
                        ? t('stats.detailed.weekday')
                        : t('stats.detailed.weekend')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Streak Statistics */}
          <Card
            variant="default"
            size="md"
            hoverable
            className="chart-container card-entrance slide-in-left gpu-accelerated"
            header={
              <h2 className="text-lg font-bold text-gray-950 dark:text-white">
                {t('stats.detailed.streakStats')}
              </h2>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('stats.detailed.currentStreak')}
                </span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {streakStats.currentStreak} {t('stats.highlight.sessions')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('stats.detailed.longestStreak')}
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {streakStats.longestStreak} {t('stats.highlight.sessions')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('stats.detailed.averageStreak')}
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {streakStats.averageStreak} {t('stats.highlight.sessions')}
                </span>
              </div>
              <div className="pt-2 border-t-2 border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {lang === 'tr'
                    ? `${streakStats.streakHistory.length} seri kaydedildi`
                    : `${streakStats.streakHistory.length} streaks recorded`}
                </div>
              </div>
            </div>
          </Card>

          {/* Most Active Hour */}
          <Card
            variant="default"
            size="md"
            hoverable
            className="chart-container card-entrance slide-in-right gpu-accelerated"
            header={
              <h2 className="text-lg font-bold text-gray-950 dark:text-white">
                {t('stats.detailed.mostActiveHour')}
              </h2>
            }
          >
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-brand mb-2">
                  {mostActiveHour.hour}:00 - {mostActiveHour.hour + 1}:00
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {mostActiveHour.count} {lang === 'tr' ? 'aktivite' : 'activities'} (
                  {mostActiveHour.percentage}%)
                </div>
              </div>
              <div className="pt-2 border-t-2 border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {lang === 'tr'
                    ? '24 saatlik dağılım grafiği aşağıda gösterilmiştir'
                    : '24-hour distribution chart shown below'}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Accordion>

      {/* Personal Records - Accordion */}
      <Accordion
        title={lang === 'tr' ? 'Kişisel Rekorlar' : 'Personal Records'}
        icon="🏆"
        defaultOpen={false}
        className="card-entrance"
      >
        <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
          <PersonalRecords />
        </Suspense>
      </Accordion>

      {/* Time & Period Analysis - Accordion */}
      <Accordion
        title={lang === 'tr' ? 'Zaman ve Dönem Analizi' : 'Time & Period Analysis'}
        icon="⏰"
        defaultOpen={false}
        className="card-entrance"
      >
        <div className="space-y-4">
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <ActivityTimeAnalysis activities={activities} />
          </Suspense>
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <PeriodComparison />
          </Suspense>
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <DurationStats />
          </Suspense>
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <ActivityTypeTrend />
          </Suspense>
        </div>
      </Accordion>

      {/* Activity Analysis - Accordion */}
      <Accordion
        title={lang === 'tr' ? 'Aktivite Analizi' : 'Activity Analysis'}
        icon="🔍"
        defaultOpen={false}
        className="card-entrance"
      >
        <div className="space-y-4">
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <ActivityPerformanceAnalysis />
          </Suspense>
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <ActivityComparison />
          </Suspense>
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <ActivityTrendAnalysis />
          </Suspense>
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <ActivityRecords />
          </Suspense>
        </div>
      </Accordion>

      {/* Activity Category Analysis - Accordion */}
      <Accordion
        title={t('stats.detailed.activityDistribution')}
        icon="📊"
        defaultOpen={true}
        className="card-entrance"
      >
        <Suspense fallback={<ChartSkeleton />}>
          <ActivityCategoryAnalysis />
        </Suspense>
      </Accordion>

      {/* Goals & Calendar - Accordion */}
      <Accordion
        title={lang === 'tr' ? 'Hedefler ve Takvim' : 'Goals & Calendar'}
        icon="🎯"
        defaultOpen={false}
        className="card-entrance"
      >
        <div className="space-y-4">
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <ActivityGoalsDashboard />
          </Suspense>
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <ActivityCalendar />
          </Suspense>
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <ActivityGoalsTimeline />
          </Suspense>
        </div>
      </Accordion>

      {/* Performance Insights - Accordion */}
      <Accordion
        title={lang === 'tr' ? 'Performans İçgörüleri' : 'Performance Insights'}
        icon="💡"
        defaultOpen={false}
        className="card-entrance"
      >
        <div className="space-y-4">
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <WeeklySummary />
          </Suspense>
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <ActivityPerformanceComparison />
          </Suspense>
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <ActivityPerformanceSummary />
          </Suspense>
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <ActivityPerformanceForecast />
          </Suspense>
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <ActivityPerformanceReport />
          </Suspense>
        </div>
      </Accordion>

      {/* Performance Visualization - Accordion */}
      <Accordion
        title={lang === 'tr' ? 'Performans Görselleştirme' : 'Performance Visualization'}
        icon="📊"
        defaultOpen={false}
        className="card-entrance"
      >
        <div className="space-y-4">
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <ActivityPerformanceHeatmap />
          </Suspense>
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <ActivityPerformanceDistribution />
          </Suspense>
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <ActivityPerformanceDashboard />
          </Suspense>
          <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
            <ActivityComparisonMatrix />
          </Suspense>
        </div>
      </Accordion>

      {/* Recommendations - Accordion */}
      <Accordion
        title={lang === 'tr' ? 'Öneriler' : 'Recommendations'}
        icon="💡"
        defaultOpen={false}
        className="card-entrance"
      >
        <Suspense fallback={<div className="h-32 skeleton rounded-lg" />}>
          <ActivityPerformanceRecommendations />
        </Suspense>
      </Accordion>
    </main>
  );
}
