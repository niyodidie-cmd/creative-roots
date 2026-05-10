import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Verification token missing.' }, { status: 400 });
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token }
  });

  if (!record || record.type !== 'EMAIL_VERIFICATION' || record.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Verification token invalid or expired.' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { isVerified: true }
  });
  await prisma.verificationToken.delete({ where: { id: record.id } });

  return NextResponse.redirect(new URL('/auth/login?verified=true', request.url));
}
