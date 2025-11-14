import { ActivityRecord } from '@/lib/activityStore';
import { CustomActivityDefinition } from '@/lib/settingsStore';
import { startOfDay, subDays } from 'date-fns';

/**
 * Mock activity data generator
 */
export function createMockActivity(overrides?: Partial<ActivityRecord>): ActivityRecord {
  const now = new Date();
  return {
    id: `test-activity-${Math.random().toString(36).slice(2)}`,
    activityKey: 'walking',
    label: 'Yürüme',
    labelEn: 'Walking',
    icon: '🚶',
    unit: 'adım',
    unitEn: 'steps',
    multiplier: 1,
    amount: 1000,
    points: 1000,
    performedAt: now.toISOString(),
    note: null,
    description: 'Test activity',
    descriptionEn: 'Test activity',
    isCustom: false,
    category: 'cardio',
    ...overrides,
  };
}

/**
 * Create multiple mock activities
 */
export function createMockActivities(count: number, daysAgo: number = 0): ActivityRecord[] {
  const activities: ActivityRecord[] = [];
  const baseDate = subDays(new Date(), daysAgo);

  for (let i = 0; i < count; i++) {
    const date = new Date(baseDate);
    date.setHours(10 + i, 0, 0, 0);

    activities.push(
      createMockActivity({
        performedAt: date.toISOString(),
        amount: 1000 + i * 100,
        points: 1000 + i * 100,
      })
    );
  }

  return activities;
}

/**
 * Mock custom activity definition
 */
export function createMockCustomActivity(
  overrides?: Partial<CustomActivityDefinition>
): CustomActivityDefinition {
  return {
    id: `custom-${Math.random().toString(36).slice(2)}`,
    label: 'Test Activity',
    labelEn: 'Test Activity',
    icon: '🏃',
    unit: 'km',
    unitEn: 'km',
    multiplier: 2,
    defaultAmount: 5,
    description: 'Test description',
    descriptionEn: 'Test description',
    ...overrides,
  };
}

/**
 * Mock settings data
 */
export function createMockSettings() {
  return {
    name: 'Test User',
    dailyTarget: 10000,
    customActivities: [] as CustomActivityDefinition[],
    mood: null as 'happy' | 'sad' | 'neutral' | 'energetic' | 'tired' | null,
  };
}

/**
 * Wait for async updates
 */
export function waitForAsync() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Mock date helper
 */
export function mockDate(date: Date | string) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  jest.useFakeTimers();
  jest.setSystemTime(dateObj);

  return () => {
    jest.useRealTimers();
  };
}

/**
 * Get today's start date
 */
export function getTodayStart() {
  return startOfDay(new Date());
}
