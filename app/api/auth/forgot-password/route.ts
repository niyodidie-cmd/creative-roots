import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { forgotPasswordSchema } from '@utils/validators';
import { sendResetPasswordEmail } from '@services/email';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  const data = await request.json();
  const parse = forgotPasswordSchema.safeParse(data);
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid email.' }, { status: 422 });
  }

  const user = await prisma.user.findUnique({ where: { email: parse.data.email } });
  if (!user || !user.isVerified) {
    return NextResponse.json({ success: true });
  }

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 2);
  await prisma.verificationToken.create({
    data: {
      token,
      type: 'PASSWORD_RESET',
      expiresAt,
      userId: user.id
    }
  });

  await sendResetPasswordEmail(user.email, user.name, token);
  return NextResponse.json({ success: true });
}
