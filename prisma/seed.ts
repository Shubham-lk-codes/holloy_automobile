import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hashPassword('admin123');
  await prisma.user.upsert({
    where: { email: 'admin@hallooyi.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@hallooyi.com',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+2348000000001',
    },
  });

  const sellerPassword = await hashPassword('seller123');
  const seller = await prisma.user.upsert({
    where: { email: 'seller@hallooyi.com' },
    update: {},
    create: {
      name: 'Demo Seller',
      email: 'seller@hallooyi.com',
      password: sellerPassword,
      role: 'SELLER',
      phone: '+2348000000002',
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'sedan' }, update: {}, create: { name: 'Sedan', slug: 'sedan', description: 'Comfortable family sedans' } }),
    prisma.category.upsert({ where: { slug: 'suv' }, update: {}, create: { name: 'SUV', slug: 'suv', description: 'Sport Utility Vehicles' } }),
    prisma.category.upsert({ where: { slug: 'truck' }, update: {}, create: { name: 'Truck', slug: 'truck', description: 'Heavy duty trucks' } }),
    prisma.category.upsert({ where: { slug: 'electric' }, update: {}, create: { name: 'Electric', slug: 'electric', description: 'EVs and hybrids' } }),
    prisma.category.upsert({ where: { slug: 'hatchback' }, update: {}, create: { name: 'Hatchback', slug: 'hatchback', description: 'Compact hatchbacks' } }),
    prisma.category.upsert({ where: { slug: 'luxury' }, update: {}, create: { name: 'Luxury', slug: 'luxury', description: 'Premium luxury cars' } }),
  ]);

  await prisma.carListing.createMany({
    data: [
      {
        title: '2023 Toyota Camry XSE',
        make: 'Toyota',
        model: 'Camry',
        year: 2023,
        price: 18500000,
        condition: 'NEW',
        location: 'Lagos',
        description: 'Brand new Toyota Camry with leather seats, sunroof, and advanced safety features. Full manufacturer warranty included.',
        images: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800',
        status: 'APPROVED',
        featured: true,
        sellerId: seller.id,
        categoryId: categories[0].id,
      },
      {
        title: '2021 Lexus RX 350',
        make: 'Lexus',
        model: 'RX 350',
        year: 2021,
        price: 28000000,
        condition: 'USED',
        location: 'Abuja',
        description: 'Well maintained Lexus RX with full service history. Low mileage, premium sound system, and panoramic roof.',
        images: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        status: 'APPROVED',
        featured: true,
        sellerId: seller.id,
        categoryId: categories[1].id,
      },
      {
        title: '2024 Tesla Model 3',
        make: 'Tesla',
        model: 'Model 3',
        year: 2024,
        price: 35000000,
        condition: 'NEW',
        location: 'Lagos',
        description: 'Latest Tesla Model 3 with full self-driving capability. Long range battery, white interior, autopilot.',
        images: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
        status: 'APPROVED',
        featured: true,
        sellerId: seller.id,
        categoryId: categories[3].id,
      },
      {
        title: '2022 Mercedes-Benz C300',
        make: 'Mercedes-Benz',
        model: 'C300',
        year: 2022,
        price: 22000000,
        condition: 'CERTIFIED_PRE_OWNED',
        location: 'Port Harcourt',
        description: 'Certified pre-owned Mercedes C300. AMG line package, ambient lighting, Burmester sound.',
        images: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
        status: 'APPROVED',
        featured: false,
        sellerId: seller.id,
        categoryId: categories[5].id,
      },
      {
        title: '2020 Ford F-150 Raptor',
        make: 'Ford',
        model: 'F-150 Raptor',
        year: 2020,
        price: 32000000,
        condition: 'USED',
        location: 'Kano',
        description: 'Rugged Ford F-150 Raptor. Off-road package, lifted suspension, Fox shocks.',
        images: 'https://images.unsplash.com/photo-1551830820-330a71b99659?w=800',
        status: 'APPROVED',
        featured: false,
        sellerId: seller.id,
        categoryId: categories[2].id,
      },
      {
        title: '2023 Honda Civic Type R',
        make: 'Honda',
        model: 'Civic Type R',
        year: 2023,
        price: 15000000,
        condition: 'NEW',
        location: 'Lagos',
        description: 'High-performance Civic Type R. Turbocharged engine, sport seats, track-ready.',
        images: 'https://images.unsplash.com/photo-1605816988066-b0a77f2a2e9e?w=800',
        status: 'APPROVED',
        featured: true,
        sellerId: seller.id,
        categoryId: categories[4].id,
      },
    ],
  });

  console.log('Seed completed successfully!');
  console.log('Admin login: admin@hallooyi.com / admin123');
  console.log('Seller login: seller@hallooyi.com / seller123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
