import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { listingId, rating, comment } = await req.json();

  const review = await prisma.review.create({
    data: {
      userId: session.user.id,
      listingId,
      rating,
      comment,
    },
  });

  return NextResponse.json(review, { status: 201 });
}
