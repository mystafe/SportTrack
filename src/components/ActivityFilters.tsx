'use client';

import { useState, useMemo } from 'react';
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

export function ActivityFilters({
  filters,
  onFiltersChange
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
    const keys = new Set(activities.map(a => a.activityKey));
    return Array.from(keys);
  }, [activities]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-card">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {t('filters.title')}
      </h3>

      {/* Date Range Filter */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {t('filters.dateRange')}
        </label>
        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-5'} gap-2`}>
          {(['all', 'today', 'week', 'month', 'custom'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => updateFilter('dateRange', range)}
              className={`px-3 py-2 text-xs rounded border transition-colors ${
                filters.dateRange === range
                  ? 'bg-brand text-white border-brand'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {t(`filters.dateRange.${range}`)}
            </button>
          ))}
        </div>
        {filters.dateRange === 'custom' && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <input
              type="date"
              value={filters.customStart || ''}
              onChange={(e) => updateFilter('customStart', e.target.value)}
              max={format(new Date(), 'yyyy-MM-dd')}
              className="w-full border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 text-xs bg-white dark:bg-gray-900"
            />
            <input
              type="date"
              value={filters.customEnd || ''}
              onChange={(e) => updateFilter('customEnd', e.target.value)}
              max={format(new Date(), 'yyyy-MM-dd')}
              className="w-full border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 text-xs bg-white dark:bg-gray-900"
            />
          </div>
        )}
      </div>

      {/* Activity Type Filter */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {t('filters.activityType')}
        </label>
        <select
          value={filters.activityType}
          onChange={(e) => updateFilter('activityType', e.target.value)}
          className="w-full border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 text-xs bg-white dark:bg-gray-900"
        >
          <option value="all">{t('filters.allActivities')}</option>
          {uniqueActivityKeys.map((key) => {
            const def = definitions.find(d => d.key === key);
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
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {t('filters.search')}
        </label>
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => updateFilter('searchQuery', e.target.value)}
          placeholder={t('filters.searchPlaceholder')}
          className="w-full border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 text-xs bg-white dark:bg-gray-900"
        />
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {t('filters.sortBy')}
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => updateFilter('sortBy', e.target.value as FilterState['sortBy'])}
          className="w-full border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 text-xs bg-white dark:bg-gray-900"
        >
          <option value="date-desc">{t('filters.sort.dateDesc')}</option>
          <option value="date-asc">{t('filters.sort.dateAsc')}</option>
          <option value="points-desc">{t('filters.sort.pointsDesc')}</option>
          <option value="points-asc">{t('filters.sort.pointsAsc')}</option>
        </select>
      </div>

            {/* Clear Filters */}
            {(filters.dateRange !== 'all' || filters.activityType !== 'all' || filters.category !== 'all' || filters.searchQuery) && (
              <button
                type="button"
                onClick={() => onFiltersChange({
                  dateRange: 'all',
                  activityType: 'all',
                  category: 'all',
                  searchQuery: '',
                  sortBy: 'date-desc'
                })}
                className="w-full px-3 py-2 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t('filters.clear')}
              </button>
            )}
    </div>
  );
}

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

      filtered = filtered.filter(activity => {
        const activityDate = parseISO(activity.performedAt);
        return activityDate >= start && activityDate <= end;
      });
    }

    // Activity type filter
    if (filters.activityType !== 'all') {
      filtered = filtered.filter(activity => activity.activityKey === filters.activityType);
    }

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(activity => {
        const label = lang === 'tr' ? activity.label : (activity.labelEn || activity.label);
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

