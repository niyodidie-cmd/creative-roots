import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { prisma } from '@lib/prisma';
import { registerSchema } from '@utils/validators';
import { sendVerificationEmail } from '@services/email';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  const data = await request.json();
  const parse = registerSchema.safeParse(data);
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid registration data.' }, { status: 422 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email: parse.data.email } });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists.' }, { status: 409 });
  }

  const passwordHash = await hash(parse.data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: parse.data.name,
      email: parse.data.email,
      password: passwordHash
    }
  });

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
  await prisma.verificationToken.create({
    data: {
      token,
      type: 'EMAIL_VERIFICATION',
      expiresAt,
      userId: user.id
    }
  });

  await sendVerificationEmail(user.email, user.name, token);
  return NextResponse.json({ success: true });
}
