import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession();
  if (!session?.user || !['SELLER', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const listings = await prisma.carListing.findMany({
    where: { sellerId: session.user.id },
    include: {
      category: true,
      _count: { select: { orders: true, wishlistedBy: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(listings);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user || !['SELLER', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const listing = await prisma.carListing.create({
    data: {
      ...body,
      sellerId: session.user.id,
      status: 'PENDING',
    },
  });

  return NextResponse.json(listing, { status: 201 });
}
