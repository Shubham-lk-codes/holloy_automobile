import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const comparisons = await prisma.comparison.findMany({
    where: { userId: session.user.id },
    include: { listing: { include: { category: true, reviews: true } } },
  });

  return NextResponse.json(comparisons);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { listingId } = await req.json();
  const count = await prisma.comparison.count({ where: { userId: session.user.id } });

  if (count >= 4) return NextResponse.json({ error: 'Maximum 4 cars allowed' }, { status: 400 });

  try {
    const item = await prisma.comparison.create({
      data: { userId: session.user.id, listingId },
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Already in comparison' }, { status: 400 });
  }
}

// export async function DELETE(req: NextRequest) {
//   const session = await getServerSession();
//   if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//   const { searchParams } = new URL(req.url);
//   const id = searchParams.get('id');

//   await prisma.comparison.deleteMany({
//     where: { id, userId: session.user.id },
//   });

//   return NextResponse.json({ success: true });
// }


export async function DELETE(req: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Wishlist item id is required" },
      { status: 400 }
    );
  }

  await prisma.wishlistItem.deleteMany({
    where: {
      id: id, // Now id is guaranteed to be a string (not null)
      userId: session.user.id,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Wishlist item removed successfully",
  });
}