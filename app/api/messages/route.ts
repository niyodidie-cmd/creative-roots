import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { contactSchema } from '@utils/validators';
import { sendContactNotification } from '@services/email';

export async function POST(request: Request) {
  const data = await request.json();
  const parse = contactSchema.safeParse(data);
  if (!parse.success || parse.data.trap) {
    return NextResponse.json({ error: 'Invalid message data.' }, { status: 422 });
  }

  const message = await prisma.message.create({
    data: {
      name: parse.data.name,
      email: parse.data.email,
      subject: parse.data.subject,
      message: parse.data.message,
      status: 'NEW'
    }
  });

  await sendContactNotification(parse.data);
  return NextResponse.json({ success: true, message });
}

export async function GET() {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ messages });
}
