import Link from 'next/link';
import { Search, Shield, Truck, Headphones, Star, ChevronRight, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';

async function getFeaturedCars() {
  return prisma.carListing.findMany({
    where: { status: 'APPROVED', featured: true },
    include: { category: true, seller: { select: { name: true } } },
    take: 6,
  });
}

async function getCategories() {
  return prisma.category.findMany({ take: 8 });
}

export default async function HomePage() {
  const [featuredCars, categories] = await Promise.all([getFeaturedCars(), getCategories()]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect <span className="text-red-500">Drive</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Nigeria's most trusted platform for buying and selling premium vehicles. 
              Verified sellers, secure payments, nationwide delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cars" className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition flex items-center justify-center gap-2 shadow-xl">
                <Search className="h-5 w-5" /> Browse Cars
              </Link>
              <Link href="/register?seller=true" className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition text-center flex items-center justify-center gap-2">
                Sell Your Car <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/cars?category=${cat.slug}`} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition text-center group border hover:border-red-200">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🚗</div>
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Listings</h2>
            <Link href="/cars" className="text-red-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Verified Sellers</h3>
              <p className="text-gray-400">Every seller is vetted and verified for your safety and peace of mind.</p>
            </div>
            <div className="text-center p-6">
              <Truck className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Nationwide Delivery</h3>
              <p className="text-gray-400">We handle logistics to deliver your car anywhere in Nigeria.</p>
            </div>
            <div className="text-center p-6">
              <Headphones className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-400">Our dedicated team is always ready to assist you at every step.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Chinedu Okafor', text: 'Hallooyi made buying my first car incredibly easy. The process was smooth, secure, and the seller was verified.' },
              { name: 'Amina Bello', text: 'Sold my Toyota Camry within 3 days! The platform is intuitive and the admin team is very supportive.' },
              { name: 'Emeka Johnson', text: 'Best car marketplace in Nigeria. The comparison tool helped me find the perfect SUV for my family.' },
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{t.text}"</p>
                <p className="font-semibold text-gray-900">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function CarCard({ car }: { car: any }) {
  return (
    <Link href={`/cars/${car.id}`} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden group border">
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        {car.images ? (
          <img src={car.images.split(',')[0]} alt={car.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">No Image</div>
        )}
        <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
          {car.condition}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-1 truncate group-hover:text-red-600 transition">{car.title}</h3>
        <p className="text-gray-500 text-sm mb-3">{car.make} {car.model} • {car.year}</p>
        <div className="flex justify-between items-center">
          <span className="text-red-600 font-bold text-xl">₦{car.price.toLocaleString()}</span>
          <span className="text-gray-400 text-sm flex items-center gap-1">
            <span>📍</span> {car.location}
          </span>
        </div>
      </div>
    </Link>
  );
}
