import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession();
  if (!session?.user || !['ADMIN', 'MODERATOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const [totalUsers, totalListings, totalOrders, totalRevenue, pendingListings] = await Promise.all([
    prisma.user.count(),
    prisma.carListing.count(),
    prisma.order.count(),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
    prisma.carListing.count({ where: { status: 'PENDING' } }),
  ]);

  return NextResponse.json({
    totalUsers,
    totalListings,
    totalOrders,
    totalRevenue: totalRevenue._sum.amount || 0,
    pendingListings,
  });
}
