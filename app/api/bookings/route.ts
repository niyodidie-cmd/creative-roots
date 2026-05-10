import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { bookingSchema } from '@utils/validators';
import { sendBookingNotification } from '@services/email';

export async function POST(request: Request) {
  const data = await request.json();
  const parse = bookingSchema.safeParse(data);
  if (!parse.success || parse.data.trap) {
    return NextResponse.json({ error: 'Invalid booking request.' }, { status: 422 });
  }

  const booking = await prisma.booking.create({
    data: {
      name: parse.data.name,
      email: parse.data.email,
      service: parse.data.service,
      message: parse.data.message,
      status: 'PENDING'
    }
  });

  await sendBookingNotification(booking);
  return NextResponse.json({ success: true, booking });
}

export async function GET() {
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ bookings });
}
