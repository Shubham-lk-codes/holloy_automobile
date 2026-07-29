'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Eye, Pencil, TrendingUp } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  price: number;
  status: string;
  views: number;
  _count: { orders: number; wishlistedBy: number };
}

export default function SellerListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    fetch('/api/seller/listings').then(r => r.json()).then(setListings);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
        <Link href="/seller/listings/new" className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 flex items-center gap-2 transition shadow-sm">
          <Plus className="h-4 w-4" /> Add Car
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {listings.map((listing) => (
              <tr key={listing.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">{listing.title}</td>
                <td className="px-6 py-4">₦{listing.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                    listing.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    listing.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>{listing.status}</span>
                </td>
                <td className="px-6 py-4 text-gray-500 flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {listing.views}</td>
                <td className="px-6 py-4 text-gray-500">{listing._count.orders}</td>
              </tr>
            ))}
            {listings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No listings yet. <Link href="/seller/listings/new" className="text-red-600 underline font-medium">Add your first car</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
