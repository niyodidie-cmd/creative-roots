import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { newsletterSchema } from '@utils/validators';
import { sendMail } from '@services/email';

export async function POST(request: Request) {
  const data = await request.json();
  const parse = newsletterSchema.safeParse(data);
  if (!parse.success || parse.data.trap) {
    return NextResponse.json({ error: 'Invalid newsletter subscription.' }, { status: 422 });
  }

  // For simplicity, store as a message with subject 'Newsletter Subscription'
  const message = await prisma.message.create({
    data: {
      name: parse.data.name,
      email: parse.data.email,
      subject: 'Newsletter Subscription',
      message: 'User subscribed to newsletter.',
      status: 'NEW'
    }
  });

  await sendMail(
    'New newsletter subscription',
    `<h1>Newsletter subscription</h1><p><strong>Name:</strong> ${parse.data.name}</p><p><strong>Email:</strong> ${parse.data.email}</p>`,
    process.env.ADMIN_NOTIFICATION_EMAIL || 'niyodidie@gmail.com'
  );

  await sendMail(
    'Welcome to INKINGI newsletter',
    `<h1>Welcome to INKINGI</h1><p>Hi ${parse.data.name},</p><p>Thank you for subscribing to our newsletter. You'll receive updates on our creative programs and events.</p>`,
    parse.data.email
  );

  return NextResponse.json({ success: true, message });
}