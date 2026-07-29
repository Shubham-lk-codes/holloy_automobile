import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession();
  if (!session?.user || !['ADMIN', 'MODERATOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const listings = await prisma.carListing.findMany({
    include: {
      category: true,
      seller: { select: { name: true, email: true } },
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(listings);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user || !['ADMIN', 'MODERATOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id, status } = await req.json();

  const listing = await prisma.carListing.update({
    where: { id },
    data: { status },
  });

  await prisma.notification.create({
    data: {
      userId: listing.sellerId,
      title: 'Listing Update',
      message: `Your listing "${listing.title}" has been ${status.toLowerCase()}.`,
    },
  });

  return NextResponse.json(listing);
}
