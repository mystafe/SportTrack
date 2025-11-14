/**
 * Tests for computeSummary utility function
 */

import { computeSummary } from '@/lib/activityStore';
import { ActivityRecord } from '@/lib/activityStore';
import { startOfDay, subDays } from 'date-fns';

describe('computeSummary', () => {
  const createMockActivity = (date: Date, points: number = 1000): ActivityRecord => ({
    id: `activity-${date.getTime()}`,
    activityKey: 'WALKING',
    label: 'Yürüme',
    icon: '🚶‍♂️',
    amount: 1000,
    points,
    performedAt: date.toISOString(),
  });

  const dailyTarget = 10000;

  it('should return zero summary for empty activities', () => {
    const summary = computeSummary([], dailyTarget);

    expect(summary.totalPoints).toBe(0);
    expect(summary.totalActivities).toBe(0);
    expect(summary.todayPoints).toBe(0);
    expect(summary.streakDays).toBe(0);
    expect(summary.lastSevenDays).toHaveLength(7);
  });

  it('should calculate today summary correctly', () => {
    const today = startOfDay(new Date());
    const activities: ActivityRecord[] = [
      createMockActivity(today, 5000),
      createMockActivity(today, 3000),
    ];

    const summary = computeSummary(activities, dailyTarget);

    expect(summary.todayPoints).toBe(8000);
    expect(summary.totalActivities).toBe(2);
    expect(summary.breakdownToday.length).toBeGreaterThan(0);
  });

  it('should calculate last seven days correctly', () => {
    const today = startOfDay(new Date());
    const activities: ActivityRecord[] = [];
    // Create activities for last 7 days
    for (let i = 0; i < 7; i++) {
      const date = subDays(today, i);
      activities.push(createMockActivity(date, 1000));
    }

    const summary = computeSummary(activities, dailyTarget);

    expect(summary.lastSevenDays).toHaveLength(7);
    const totalWeekPoints = summary.lastSevenDays.reduce((sum, day) => sum + day.points, 0);
    expect(totalWeekPoints).toBe(7000);
  });

  it('should calculate total summary correctly', () => {
    const today = startOfDay(new Date());
    const activities: ActivityRecord[] = [
      createMockActivity(today, 5000),
      createMockActivity(subDays(today, 10), 3000),
      createMockActivity(subDays(today, 50), 2000),
    ];

    const summary = computeSummary(activities, dailyTarget);

    expect(summary.totalPoints).toBe(10000);
    expect(summary.totalActivities).toBe(3);
  });

  it('should calculate streak days correctly', () => {
    const today = startOfDay(new Date());
    const activities: ActivityRecord[] = [];
    // Create activities for 5 consecutive days reaching daily goal
    for (let i = 0; i < 5; i++) {
      const date = subDays(today, i);
      activities.push(createMockActivity(date, dailyTarget));
    }

    const summary = computeSummary(activities, dailyTarget);

    expect(summary.streakDays).toBeGreaterThanOrEqual(5);
  });

  it('should calculate breakdown today correctly', () => {
    const today = startOfDay(new Date());
    const activities: ActivityRecord[] = [
      createMockActivity(today, 5000),
      createMockActivity(today, 3000),
    ];

    const summary = computeSummary(activities, dailyTarget);

    expect(summary.breakdownToday.length).toBeGreaterThan(0);
    const totalBreakdownPoints = summary.breakdownToday.reduce((sum, item) => sum + item.points, 0);
    expect(totalBreakdownPoints).toBe(8000);
  });

  it('should handle zero daily target', () => {
    const today = startOfDay(new Date());
    const activities: ActivityRecord[] = [createMockActivity(today, 1000)];

    const summary = computeSummary(activities, 0);

    expect(summary.targetPoints).toBe(0);
    expect(summary.todayPoints).toBe(1000);
  });
});
