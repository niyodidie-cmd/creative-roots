import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { uploadMedia } from '@services/cloudinary';
import { getCurrentUser } from '@lib/auth';

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const body = await request.json();
  if (!body.image || !body.category) {
    return NextResponse.json({ error: 'Invalid media payload.' }, { status: 422 });
  }

  const upload = await uploadMedia(body.image, 'inkingi-media');
  const media = await prisma.media.create({
    data: {
      publicId: upload.publicId,
      imageUrl: upload.imageUrl,
      type: body.type === 'VIDEO' ? 'VIDEO' : 'IMAGE'
    }
  });

  await prisma.galleryItem.create({
    data: {
      imageUrl: upload.imageUrl,
      category: body.category
    }
  });

  return NextResponse.json({ success: true, media });
}
