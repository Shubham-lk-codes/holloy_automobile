'use client';

import { useState, useEffect } from 'react';
import { Check, X, Eye, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

interface Listing {
  id: string;
  title: string;
  make: string;
  price: number;
  status: string;
  seller: { name: string; email: string };
  category: { name: string };
  createdAt: string;
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    const res = await fetch('/api/admin/listings');
    const data = await res.json();
    setListings(data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch('/api/admin/listings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      toast.success(`Listing ${status.toLowerCase()}`);
      fetchListings();
    }
  }

  const filtered = filter === 'all' ? listings : listings.filter(l => l.status === filter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Listings</h1>
        <div className="flex gap-2">
          {['all', 'PENDING', 'APPROVED', 'REJECTED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                filter === f ? 'bg-red-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{listing.title}</p>
                      <p className="text-sm text-gray-500">{listing.make} • {listing.category.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{listing.seller.name}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">₦{listing.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                      listing.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      listing.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {listing.status === 'PENDING' && (
                        <>
                          <button onClick={() => updateStatus(listing.id, 'APPROVED')} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition" title="Approve">
                            <Check className="h-4 w-4" />
                          </button>
                          <button onClick={() => updateStatus(listing.id, 'REJECTED')} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition" title="Reject">
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <a href={`/cars/${listing.id}`} target="_blank" className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition" title="View">
                        <Eye className="h-4 w-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No listings found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
