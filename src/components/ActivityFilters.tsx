'use client';

import { useState, useMemo, memo, useCallback } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useActivityDefinitions } from '@/lib/settingsStore';
import { getActivityLabel } from '@/lib/activityUtils';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { format, startOfDay, endOfDay, subDays, parseISO } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import { ActivityCategory } from '@/lib/activityConfig';

export type FilterState = {
  dateRange: 'all' | 'today' | 'week' | 'month' | 'custom';
  customStart?: string;
  customEnd?: string;
  activityType: string; // 'all' or activity key
  category: 'all' | 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';
  searchQuery: string;
  sortBy: 'date-desc' | 'date-asc' | 'points-desc' | 'points-asc';
};

export const ActivityFilters = memo(function ActivityFilters({
  filters,
  onFiltersChange,
}: {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}) {
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const { activities } = useActivities();
  const definitions = useActivityDefinitions();
  const dateLocale = lang === 'tr' ? tr : enUS;

  const uniqueActivityKeys = useMemo(() => {
    const keys = new Set(activities.map((a) => a.activityKey));
    return Array.from(keys);
  }, [activities]);

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange]
  );

  return (
    <div className="space-y-2.5 sm:space-y-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-2.5 sm:p-3 shadow-md hover:shadow-xl transition-shadow duration-300">
      <h3 className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-gray-950 dark:text-white`}>
        {t('filters.title')}
      </h3>

      {/* Date Range Filter */}
      <div className="space-y-1.5">
        <label
          className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold text-gray-800 dark:text-gray-200`}
        >
          {t('filters.dateRange')}
        </label>
        <div className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-5'} gap-1.5`}>
          {(['all', 'today', 'week', 'month', 'custom'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => updateFilter('dateRange', range)}
              className={`px-2 py-1 ${isMobile ? 'text-[10px]' : 'text-xs'} rounded-lg border-2 font-semibold transition-all duration-200 ${
                filters.dateRange === range
                  ? 'bg-gradient-to-r from-brand to-brand-dark text-white border-brand shadow-md'
                  : 'bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600'
              }`}
            >
              {t(`filters.dateRange.${range}`)}
            </button>
          ))}
        </div>
        {filters.dateRange === 'custom' && (
          <div className="grid grid-cols-2 gap-1.5 mt-1.5">
            <input
              type="date"
              value={filters.customStart || ''}
              onChange={(e) => updateFilter('customStart', e.target.value)}
              max={format(new Date(), 'yyyy-MM-dd')}
              className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-1.5 py-1 ${isMobile ? 'text-[10px]' : 'text-xs'} bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced`}
            />
            <input
              type="date"
              value={filters.customEnd || ''}
              onChange={(e) => updateFilter('customEnd', e.target.value)}
              max={format(new Date(), 'yyyy-MM-dd')}
              className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-1.5 py-1 ${isMobile ? 'text-[10px]' : 'text-xs'} bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced`}
            />
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-1.5">
        <label
          className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold text-gray-800 dark:text-gray-200`}
        >
          {t('filters.category')}
        </label>
        <select
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value as FilterState['category'])}
          className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-1.5 py-1 ${isMobile ? 'text-[10px]' : 'text-xs'} bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced`}
        >
          <option value="all">{t('filters.allCategories')}</option>
          <option value="cardio">{t('filters.category.cardio')}</option>
          <option value="strength">{t('filters.category.strength')}</option>
          <option value="flexibility">{t('filters.category.flexibility')}</option>
          <option value="sports">{t('filters.category.sports')}</option>
          <option value="other">{t('filters.category.other')}</option>
        </select>
      </div>

      {/* Activity Type Filter */}
      <div className="space-y-1.5">
        <label
          className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold text-gray-800 dark:text-gray-200`}
        >
          {t('filters.activityType')}
        </label>
        <select
          value={filters.activityType}
          onChange={(e) => updateFilter('activityType', e.target.value)}
          className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-1.5 py-1 ${isMobile ? 'text-[10px]' : 'text-xs'} bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced`}
        >
          <option value="all">{t('filters.allActivities')}</option>
          {uniqueActivityKeys.map((key) => {
            const def = definitions.find((d) => d.key === key);
            if (!def) return null;
            return (
              <option key={key} value={key}>
                {getActivityLabel(def, lang)}
              </option>
            );
          })}
        </select>
      </div>

      {/* Search */}
      <div className="space-y-1.5">
        <label
          className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold text-gray-800 dark:text-gray-200`}
        >
          {t('filters.search')}
        </label>
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => updateFilter('searchQuery', e.target.value)}
          placeholder={t('filters.searchPlaceholder')}
          className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-1.5 py-1 ${isMobile ? 'text-[10px]' : 'text-xs'} bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced`}
        />
      </div>

      {/* Sort */}
      <div className="space-y-1.5">
        <label
          className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold text-gray-800 dark:text-gray-200`}
        >
          {t('filters.sortBy')}
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => updateFilter('sortBy', e.target.value as FilterState['sortBy'])}
          className={`w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-1.5 py-1 ${isMobile ? 'text-[10px]' : 'text-xs'} bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 input-enhanced`}
        >
          <option value="date-desc">{t('filters.sort.dateDesc')}</option>
          <option value="date-asc">{t('filters.sort.dateAsc')}</option>
          <option value="points-desc">{t('filters.sort.pointsDesc')}</option>
          <option value="points-asc">{t('filters.sort.pointsAsc')}</option>
        </select>
      </div>

      {/* Clear Filters */}
      {(filters.dateRange !== 'all' ||
        filters.activityType !== 'all' ||
        filters.category !== 'all' ||
        filters.searchQuery) && (
        <button
          type="button"
          onClick={() =>
            onFiltersChange({
              dateRange: 'all',
              activityType: 'all',
              category: 'all',
              searchQuery: '',
              sortBy: 'date-desc',
            })
          }
          className={`w-full px-2 py-1 ${isMobile ? 'text-[10px]' : 'text-xs'} rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 font-semibold`}
        >
          {t('filters.clear')}
        </button>
      )}
    </div>
  );
});

export function useFilteredActivities(filters: FilterState) {
  const { activities } = useActivities();
  const { lang } = useI18n();

  return useMemo(() => {
    let filtered = [...activities];

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let start: Date;
      let end: Date = endOfDay(now);

      switch (filters.dateRange) {
        case 'today':
          start = startOfDay(now);
          break;
        case 'week':
          start = startOfDay(subDays(now, 6));
          break;
        case 'month':
          start = startOfDay(subDays(now, 29));
          break;
        case 'custom':
          if (filters.customStart && filters.customEnd) {
            start = startOfDay(new Date(filters.customStart));
            end = endOfDay(new Date(filters.customEnd));
          } else {
            return filtered;
          }
          break;
        default:
          return filtered;
      }

      filtered = filtered.filter((activity) => {
        const activityDate = parseISO(activity.performedAt);
        return activityDate >= start && activityDate <= end;
      });
    }

    // Activity type filter
    if (filters.activityType !== 'all') {
      filtered = filtered.filter((activity) => activity.activityKey === filters.activityType);
    }

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter((activity) => {
        const label = lang === 'tr' ? activity.label : activity.labelEn || activity.label;
        return (
          label.toLowerCase().includes(query) ||
          activity.note?.toLowerCase().includes(query) ||
          activity.activityKey.toLowerCase().includes(query)
        );
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-desc':
          return new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime();
        case 'date-asc':
          return new Date(a.performedAt).getTime() - new Date(b.performedAt).getTime();
        case 'points-desc':
          return b.points - a.points;
        case 'points-asc':
          return a.points - b.points;
        default:
          return 0;
      }
    });

    return filtered;
  }, [activities, filters, lang]);
}
