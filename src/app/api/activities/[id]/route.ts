import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ActivityKey, calculatePoints } from '@/lib/activityConfig';
import { createActivitySchema } from '@/lib/validation';

type Params = {
  params: {
    id: string;
  };
};

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = params;

  await prisma.activity.delete({
    where: { id }
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, { params }: Params) {
  const json = await request.json();
  const parsed = createActivitySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { activityKey, amount, note, performedAt } = parsed.data;
  const points = calculatePoints(activityKey as ActivityKey, amount);

  const updated = await prisma.activity.update({
    where: { id: params.id },
    data: {
      activityKey,
      amount,
      note: note ?? null,
      performedAt: performedAt ? new Date(performedAt) : undefined,
      points
    }
  });

  return NextResponse.json(updated);
}

