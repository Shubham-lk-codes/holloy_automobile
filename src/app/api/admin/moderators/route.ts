import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const moderators = await prisma.user.findMany({
    where: { role: 'MODERATOR' },
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
  });

  return NextResponse.json(moderators);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { name, email, phone, password } = await req.json();
  const hashed = await hashPassword(password);

  const moderator = await prisma.user.create({
    data: { name, email, phone, password: hashed, role: 'MODERATOR' },
  });

  return NextResponse.json(moderator, { status: 201 });
}
