import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { resetPasswordSchema } from '@utils/validators';
import { hash } from 'bcrypt';

export async function POST(request: Request) {
  const data = await request.json();
  const parse = resetPasswordSchema.safeParse(data);
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 422 });
  }

  const record = await prisma.verificationToken.findUnique({ where: { token: parse.data.token } });
  if (!record || record.type !== 'PASSWORD_RESET' || record.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Token invalid or expired.' }, { status: 400 });
  }

  const passwordHash = await hash(parse.data.password, 12);
  await prisma.user.update({ where: { id: record.userId }, data: { password: passwordHash, isVerified: true } });
  await prisma.verificationToken.delete({ where: { id: record.id } });

  return NextResponse.json({ success: true });
}
