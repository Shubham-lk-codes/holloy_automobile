'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, Heart, Scale, SlidersHorizontal, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CarsPage() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    condition: '',
    search: searchParams.get('search') || '',
  });

  useEffect(() => {
    fetchCars();
  }, [filters]);

  async function fetchCars() {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const res = await fetch(`/api/cars?${params}`);
    const data = await res.json();
    setCars(data);
    setLoading(false);
  }

  async function addToWishlist(carId: string) {
    const res = await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId: carId }),
    });
    if (res.ok) toast.success('Added to wishlist!');
    else toast.error('Already in wishlist');
  }

  async function addToCompare(carId: string) {
    const res = await fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId: carId }),
    });
    if (res.ok) toast.success('Added to compare!');
    else toast.error((await res.json()).error || 'Error');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24 border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" /> Filters
              </h2>
              <button onClick={() => setShowFilters(false)} className="lg:hidden p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Search</label>
                <input type="text" placeholder="Search cars..." value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Make</label>
                <input type="text" placeholder="e.g. Toyota" value={filters.make}
                  onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Model</label>
                <input type="text" placeholder="e.g. Camry" value={filters.model}
                  onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Price Range</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" />
                  <input type="number" placeholder="Max" value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Location</label>
                <input type="text" placeholder="e.g. Lagos" value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Condition</label>
                <select value={filters.condition}
                  onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm bg-white">
                  <option value="">All Conditions</option>
                  <option value="NEW">New</option>
                  <option value="USED">Used</option>
                  <option value="CERTIFIED_PRE_OWNED">Certified Pre-Owned</option>
                </select>
              </div>
              <button
                onClick={() => setFilters({ make: '', model: '', minPrice: '', maxPrice: '', location: '', condition: '', search: '' })}
                className="w-full py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {loading ? 'Loading...' : `${cars.length} Cars Available`}
            </h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm"
            >
              <Filter className="h-4 w-4" /> Filters
            </button>
          </div>

          {cars.length === 0 && !loading ? (
            <div className="text-center py-20 bg-white rounded-xl border shadow-sm">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No cars found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cars.map((car) => (
                <div key={car.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border group">
                  <Link href={`/cars/${car.id}`}>
                    <div className="h-56 bg-gray-200 relative overflow-hidden">
                      {car.images ? (
                        <img src={car.images.split(',')[0]} alt={car.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">No Image</div>
                      )}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-800 text-xs font-bold px-2 py-1 rounded">
                        {car.year}
                      </div>
                    </div>
                  </Link>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <Link href={`/cars/${car.id}`}>
                        <h3 className="font-bold text-lg text-gray-900 hover:text-red-600 transition">{car.title}</h3>
                      </Link>
                      <div className="flex gap-1">
                        <button onClick={() => addToWishlist(car.id)} className="p-2 hover:bg-red-50 rounded-full transition" title="Add to Wishlist">
                          <Heart className="h-5 w-5 text-gray-400 hover:text-red-500" />
                        </button>
                        <button onClick={() => addToCompare(car.id)} className="p-2 hover:bg-blue-50 rounded-full transition" title="Add to Compare">
                          <Scale className="h-5 w-5 text-gray-400 hover:text-blue-500" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-3">{car.make} {car.model} • {car.location}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-red-600 font-bold text-xl">₦{car.price.toLocaleString()}</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        car.condition === 'NEW' ? 'bg-green-100 text-green-700' :
                        car.condition === 'USED' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {car.condition.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
