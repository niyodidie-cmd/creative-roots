import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { getCurrentUser } from '@lib/auth';

export async function GET() {
  const events = await prisma.event.findMany({ where: { status: 'PUBLISHED' }, orderBy: { date: 'asc' } });
  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const body = await request.json();
  const event = await prisma.event.create({
    data: {
      title: body.title,
      description: body.description,
      date: new Date(body.date),
      capacity: Number(body.capacity)
    }
  });

  return NextResponse.json({ success: true, event });
}
