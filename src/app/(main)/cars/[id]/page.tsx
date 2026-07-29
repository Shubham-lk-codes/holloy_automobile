import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Star, MapPin, Calendar, Gauge, User, Phone, Mail, Shield, Eye, Heart } from 'lucide-react';
import Link from 'next/link';
import { OrderButton } from '@/components/OrderButton';

export default async function CarDetailPage({ params }: { params: { id: string } }) {
  const car = await prisma.carListing.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      seller: { select: { id: true, name: true, email: true, phone: true } },
      reviews: { include: { user: { select: { name: true, image: true } } } },
      _count: { select: { wishlistedBy: true, comparisons: true } },
    },
  });

  if (!car) notFound();

  const avgRating = car.reviews.length > 0 
    ? car.reviews.reduce((sum, r) => sum + r.rating, 0) / car.reviews.length 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
            <div className="h-96 bg-gray-200 relative">
              {car.images ? (
                <img src={car.images.split(',')[0]} alt={car.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">No Image Available</div>
              )}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-gray-800">
                {car.condition.replace('_', ' ')}
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <div className="bg-black/60 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Eye className="h-4 w-4" /> {car.views} views
                </div>
                <div className="bg-black/60 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Heart className="h-4 w-4" /> {car._count.wishlistedBy}
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.title}</h1>
                  <div className="flex items-center gap-4 text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {car.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {car.year}</span>
                    <span className="flex items-center gap-1"><Gauge className="h-4 w-4" /> {car.category.name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-red-600">₦{car.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y bg-gray-50 rounded-lg">
                <div className="text-center p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Make</p>
                  <p className="font-bold text-gray-900">{car.make}</p>
                </div>
                <div className="text-center p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Model</p>
                  <p className="font-bold text-gray-900">{car.model}</p>
                </div>
                <div className="text-center p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Year</p>
                  <p className="font-bold text-gray-900">{car.year}</p>
                </div>
                <div className="text-center p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Category</p>
                  <p className="font-bold text-gray-900">{car.category.name}</p>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-bold mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">{car.description}</p>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h2 className="text-xl font-bold mb-4">Reviews ({car.reviews.length})</h2>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="font-semibold text-lg">{avgRating.toFixed(1)}</span>
              <span className="text-gray-400 text-sm">out of 5</span>
            </div>
            <div className="space-y-4">
              {car.reviews.map((review) => (
                <div key={review.id} className="border-b last:border-0 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="font-medium">{review.user.name}</span>
                    <div className="flex ml-auto">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
              {car.reviews.length === 0 && (
                <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" /> Seller Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{car.seller.name}</p>
                  <p className="text-xs text-gray-500">Verified Seller</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{car.seller.email}</span>
              </div>
              {car.seller.phone && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{car.seller.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border sticky top-24">
            <h3 className="font-bold text-lg mb-4">Interested in this car?</h3>
            <OrderButton carId={car.id} price={car.price} title={car.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
