import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createActivitySchema } from '@/lib/validation';
import { calculatePoints } from '@/lib/activityConfig';

export async function GET() {
  const activities = await prisma.activity.findMany({
    orderBy: { performedAt: 'desc' }
  });
  return NextResponse.json(activities);
}

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = createActivitySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Geçersiz veri', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { activityKey, amount, performedAt, note } = parsed.data;
  const points = calculatePoints(activityKey, amount);

  const activity = await prisma.activity.create({
    data: {
      activityKey,
      amount,
      points,
      performedAt: performedAt ? new Date(performedAt) : undefined,
      note
    }
  });

  return NextResponse.json(activity, { status: 201 });
}

