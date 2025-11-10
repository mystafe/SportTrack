import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  ACTIVITY_DEFINITIONS,
  ActivityKey,
  DAILY_TARGET_POINTS
} from '@/lib/activityConfig';
import { startOfDay, subDays } from 'date-fns';

export async function GET() {
  const now = new Date();
  const startToday = startOfDay(now);
  const startLastSeven = subDays(startToday, 6);
  const startForStreak = subDays(startToday, 30);

  const [totalAggregate, activitiesLastThirty] = await Promise.all([
    prisma.activity.aggregate({
      _sum: { points: true },
      _count: true
    }),
    prisma.activity.findMany({
      where: {
        performedAt: {
          gte: startForStreak
        }
      },
      orderBy: { performedAt: 'asc' }
    })
  ]);

  const totalPoints = totalAggregate._sum.points ?? 0;
  const totalActivities = totalAggregate._count;

  const pointsPerDay = new Map<string, number>();
  const breakdownTodayMap = new Map<ActivityKey, { amount: number; points: number }>();

  for (const activity of activitiesLastThirty) {
    const dayKey = startOfDay(activity.performedAt).toISOString();
    pointsPerDay.set(dayKey, (pointsPerDay.get(dayKey) ?? 0) + activity.points);

    if (activity.performedAt >= startToday) {
      const key = activity.activityKey as ActivityKey;
      const existing = breakdownTodayMap.get(key) ?? { amount: 0, points: 0 };
      existing.amount += activity.amount;
      existing.points += activity.points;
      breakdownTodayMap.set(key, existing);
    }
  }

  const todayPoints = pointsPerDay.get(startToday.toISOString()) ?? 0;

  const lastSevenDays = Array.from({ length: 7 }, (_, idx) => {
    const day = subDays(startToday, 6 - idx);
    const key = day.toISOString();
    return {
      date: day.toISOString(),
      points: pointsPerDay.get(key) ?? 0
    };
  });

  let streakDays = 0;
  for (let offset = 0; offset <= 30; offset += 1) {
    const day = subDays(startToday, offset);
    const key = day.toISOString();
    const dailyPoints = pointsPerDay.get(key) ?? 0;
    if (dailyPoints >= DAILY_TARGET_POINTS) {
      streakDays += 1;
    } else {
      break;
    }
  }

  const breakdownToday = Array.from(breakdownTodayMap.entries())
    .map(([key, value]) => ({
      key,
      label: ACTIVITY_DEFINITIONS[key].label,
      amount: value.amount,
      unit: ACTIVITY_DEFINITIONS[key].unit,
      points: value.points
    }))
    .sort((a, b) => b.points - a.points);

  return NextResponse.json({
    todayPoints,
    targetPoints: DAILY_TARGET_POINTS,
    totalPoints,
    totalActivities,
    streakDays,
    lastSevenDays,
    breakdownToday
  });
}

