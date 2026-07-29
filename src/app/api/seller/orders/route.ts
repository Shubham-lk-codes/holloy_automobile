import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession();
  if (!session?.user || !['SELLER', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const orders = await prisma.orderItem.findMany({
    where: { listing: { sellerId: session.user.id } },
    include: {
      order: { include: { user: { select: { name: true, email: true } }, payment: true } },
      listing: { select: { title: true, images: true } },
    },
    orderBy: { order: { createdAt: 'desc' } },
  });

  return NextResponse.json(orders);
}
