import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const car = await prisma.carListing.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      seller: { select: { id: true, name: true, email: true, phone: true } },
      reviews: { include: { user: { select: { name: true, image: true } } } },
      _count: { select: { wishlistedBy: true, comparisons: true } },
    },
  });

  if (!car) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.carListing.update({
    where: { id: params.id },
    data: { views: { increment: 1 } },
  });

  return NextResponse.json(car);
}
