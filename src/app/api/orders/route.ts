import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { items, paymentMethod } = body;

  const totalAmount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      totalAmount,
      paymentMethod,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      items: {
        create: items.map((item: any) => ({
          listingId: item.listingId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: { items: { include: { listing: true } }, user: true },
  });

  await prisma.notification.create({
    data: {
      userId: session.user.id,
      title: 'Order Placed',
      message: `Your order #${order.id.slice(-6)} has been placed successfully.`,
    },
  });

  if (order.user.email) {
    await sendEmail(
      order.user.email,
      'Order Confirmation - Hallooyi Automobile',
      `<h1>Thank you for your order!</h1><p>Order #${order.id.slice(-6)}</p><p>Total: ₦${totalAmount.toLocaleString()}</p>`
    );
  }

  return NextResponse.json(order, { status: 201 });
}

export async function GET() {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const where = session.user.role === 'ADMIN' || session.user.role === 'MODERATOR' 
    ? {} 
    : { userId: session.user.id };

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: { include: { listing: { select: { title: true, images: true } } } },
      user: { select: { name: true, email: true } },
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(orders);
}
