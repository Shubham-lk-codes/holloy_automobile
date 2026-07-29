import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user || !['ADMIN', 'MODERATOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { name, slug, description } = await req.json();
  const category = await prisma.category.create({
    data: { name, slug, description },
  });
  return NextResponse.json(category, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await prisma.category.delete({ where: { id: id! } });
  return NextResponse.json({ success: true });
}
