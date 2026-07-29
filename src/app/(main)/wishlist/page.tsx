'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const res = await fetch('/api/wishlist');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  async function remove(id: string) {
    await fetch(`/api/wishlist?id=${id}`, { method: 'DELETE' });
    toast.success('Removed from wishlist');
    fetchItems();
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h1>
        <p className="text-gray-500 mb-6">Save cars you love to view them later.</p>
        <Link href="/cars" className="inline-flex items-center gap-2 text-red-600 font-medium hover:underline">
          Browse Cars <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist ({items.length})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden group border hover:shadow-md transition">
            <Link href={`/cars/${item.listing.id}`}>
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                {item.listing.images ? (
                  <img src={item.listing.images.split(',')[0]} alt={item.listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">No Image</div>
                )}
              </div>
            </Link>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <Link href={`/cars/${item.listing.id}`}>
                  <h3 className="font-bold text-lg text-gray-900 hover:text-red-600 transition">{item.listing.title}</h3>
                </Link>
                <button
                  onClick={() => remove(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-gray-500 text-sm mb-3">{item.listing.make} {item.listing.model} • {item.listing.year}</p>
              <div className="flex justify-between items-center">
                <span className="text-red-600 font-bold text-xl">₦{item.listing.price.toLocaleString()}</span>
                <Link href={`/cars/${item.listing.id}`} className="text-sm text-red-600 font-medium hover:underline flex items-center gap-1">
                  View <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
