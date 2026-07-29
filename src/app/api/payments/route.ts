import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { orderId, method } = await req.json();

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const payment = await prisma.payment.create({
    data: {
      orderId,
      amount: order.totalAmount,
      method,
      status: 'COMPLETED',
      transactionId: `TXN_${Date.now()}`,
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: 'COMPLETED', status: 'CONFIRMED' },
  });

  return NextResponse.json(payment);
}
