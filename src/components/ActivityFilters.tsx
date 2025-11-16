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
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';

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
    <Card
      variant="default"
      size="md"
      hoverable
      className={`${isMobile ? 'space-y-1.5' : 'space-y-2.5 sm:space-y-3'}`}
      header={
        <h3
          className={`${isMobile ? 'text-[10px]' : 'text-sm'} font-bold text-gray-950 dark:text-white`}
        >
          {t('filters.title')}
        </h3>
      }
    >
      {/* Date Range Filter */}
      <div className={`${isMobile ? 'space-y-1' : 'space-y-1.5'}`}>
        <label
          className={`${isMobile ? 'text-[9px]' : 'text-xs'} font-semibold text-gray-800 dark:text-gray-200`}
        >
          {t('filters.dateRange')}
        </label>
        <div
          className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-5'} ${isMobile ? 'gap-1' : 'gap-1.5'}`}
        >
          {(['all', 'today', 'week', 'month', 'custom'] as const).map((range) => (
            <Button
              key={range}
              type="button"
              variant={filters.dateRange === range ? 'primary' : 'outline'}
              size="sm"
              onClick={() => updateFilter('dateRange', range)}
              className={`${isMobile ? 'px-1 py-0.5 text-[8px]' : 'px-2 py-1 text-xs'}`}
            >
              {t(`filters.dateRange.${range}`)}
            </Button>
          ))}
        </div>
        {filters.dateRange === 'custom' && (
          <div className={`grid grid-cols-2 ${isMobile ? 'gap-1 mt-1' : 'gap-1.5 mt-1.5'}`}>
            <Input
              type="date"
              value={filters.customStart || ''}
              onChange={(e) => updateFilter('customStart', e.target.value)}
              max={format(new Date(), 'yyyy-MM-dd')}
              size={isMobile ? 'sm' : 'sm'}
              className={`${isMobile ? 'px-1 py-0.5 text-[8px]' : 'px-1.5 py-1 text-xs'}`}
            />
            <Input
              type="date"
              value={filters.customEnd || ''}
              onChange={(e) => updateFilter('customEnd', e.target.value)}
              max={format(new Date(), 'yyyy-MM-dd')}
              size={isMobile ? 'sm' : 'sm'}
              className={`${isMobile ? 'px-1 py-0.5 text-[8px]' : 'px-1.5 py-1 text-xs'}`}
            />
          </div>
        )}
      </div>

      {/* Category Filter - Compact for mobile */}
      <div className={`${isMobile ? 'space-y-0.5' : 'space-y-1'}`}>
        <Select
          label={isMobile ? undefined : t('filters.category')}
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value as FilterState['category'])}
          size={isMobile ? 'sm' : 'sm'}
          options={[
            { value: 'all', label: t('filters.allCategories') },
            { value: 'cardio', label: t('filters.category.cardio') },
            { value: 'strength', label: t('filters.category.strength') },
            { value: 'flexibility', label: t('filters.category.flexibility') },
            { value: 'sports', label: t('filters.category.sports') },
            { value: 'other', label: t('filters.category.other') },
          ]}
          className={isMobile ? 'flex-1' : 'w-full'}
        />
      </div>

      {/* Activity Type Filter */}
      <div className={`${isMobile ? 'space-y-1' : 'space-y-1.5'}`}>
        <Select
          label={t('filters.activityType')}
          value={filters.activityType}
          onChange={(e) => updateFilter('activityType', e.target.value)}
          size={isMobile ? 'sm' : 'sm'}
          options={[
            { value: 'all', label: t('filters.allActivities') },
            ...(uniqueActivityKeys
              .map((key) => {
                const def = definitions.find((d) => d.key === key);
                if (!def) return null;
                return {
                  value: key,
                  label: getActivityLabel(def, lang),
                };
              })
              .filter(Boolean) as Array<{ value: string; label: string }>),
          ]}
          className="w-full"
        />
      </div>

      {/* Search */}
      <div className={`${isMobile ? 'space-y-1' : 'space-y-1.5'}`}>
        <Input
          type="text"
          label={t('filters.search')}
          value={filters.searchQuery}
          onChange={(e) => updateFilter('searchQuery', e.target.value)}
          placeholder={t('filters.searchPlaceholder')}
          size={isMobile ? 'sm' : 'sm'}
          className="w-full"
        />
      </div>

      {/* Sort */}
      <div className={`${isMobile ? 'space-y-1' : 'space-y-1.5'}`}>
        <Select
          label={t('filters.sortBy')}
          value={filters.sortBy}
          onChange={(e) => updateFilter('sortBy', e.target.value as FilterState['sortBy'])}
          size={isMobile ? 'sm' : 'sm'}
          options={[
            { value: 'date-desc', label: t('filters.sort.dateDesc') },
            { value: 'date-asc', label: t('filters.sort.dateAsc') },
            { value: 'points-desc', label: t('filters.sort.pointsDesc') },
            { value: 'points-asc', label: t('filters.sort.pointsAsc') },
          ]}
          className="w-full"
        />
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
          className={`w-full ${isMobile ? 'px-1.5 py-0.5 text-[8px]' : 'px-2 py-1 text-xs'} rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 font-semibold`}
        >
          {t('filters.clear')}
        </button>
      )}
    </Card>
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
