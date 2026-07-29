import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const make = searchParams.get('make');
  const model = searchParams.get('model');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const location = searchParams.get('location');
  const condition = searchParams.get('condition');
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  const where: any = { status: 'APPROVED' };

  if (make) where.make = { contains: make, mode: 'insensitive' };
  if (model) where.model = { contains: model, mode: 'insensitive' };
  if (location) where.location = { contains: location, mode: 'insensitive' };
  if (condition) where.condition = condition;
  if (category) where.category = { slug: category };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { make: { contains: search, mode: 'insensitive' } },
      { model: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  const cars = await prisma.carListing.findMany({
    where,
    include: {
      category: true,
      seller: { select: { id: true, name: true, email: true } },
      reviews: { select: { rating: true } },
      _count: { select: { wishlistedBy: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(cars);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const listing = await prisma.carListing.create({
    data: {
      ...body,
      status: 'PENDING',
    },
  });
  return NextResponse.json(listing, { status: 201 });
}
