'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Scale, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface Comparison {
  id: string;
  listing: {
    id: string;
    title: string;
    make: string;
    model: string;
    year: number;
    price: number;
    condition: string;
    location: string;
    category: { name: string };
  };
}

export default function ComparePage() {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparisons();
  }, []);

  async function fetchComparisons() {
    const res = await fetch('/api/compare');
    if (res.ok) {
      setComparisons(await res.json());
    }
    setLoading(false);
  }

  async function remove(id: string) {
    await fetch(`/api/compare?id=${id}`, { method: 'DELETE' });
    toast.success('Removed from comparison');
    fetchComparisons();
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>;
  }

  if (comparisons.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Scale className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No Cars to Compare</h1>
        <p className="text-gray-500 mb-6">Add up to 4 cars to compare side by side.</p>
        <Link href="/cars" className="inline-flex items-center gap-2 text-red-600 font-medium hover:underline">
          Browse Cars <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const specs = [
    { key: 'make', label: 'Make' },
    { key: 'model', label: 'Model' },
    { key: 'year', label: 'Year' },
    { key: 'price', label: 'Price' },
    { key: 'condition', label: 'Condition' },
    { key: 'location', label: 'Location' },
    { key: 'category', label: 'Category' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Compare Cars</h1>
      <div className="overflow-x-auto pb-4">
        <table className="w-full bg-white rounded-xl shadow-sm border min-w-[800px]">
          <thead>
            <tr>
              <th className="px-6 py-4 text-left bg-gray-50 border-b w-32">Feature</th>
              {comparisons.map((c) => (
                <th key={c.id} className="px-6 py-4 text-center bg-gray-50 border-b min-w-[200px]">
                  <div className="relative inline-block">
                    <button
                      onClick={() => remove(c.id)}
                      className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <Link href={`/cars/${c.listing.id}`} className="font-bold text-gray-900 hover:text-red-600 transition block max-w-[180px]">
                      {c.listing.title}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {specs.map((spec) => (
              <tr key={spec.key} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-500 text-sm">{spec.label}</td>
                {comparisons.map((c) => (
                  <td key={c.id} className="px-6 py-4 text-center text-gray-900 font-medium">
                    {spec.key === 'price' ? `₦${(c.listing as any)[spec.key].toLocaleString()}` :
                     spec.key === 'category' ? c.listing.category.name :
                     spec.key === 'condition' ? (c.listing as any)[spec.key].replace('_', ' ') :
                     (c.listing as any)[spec.key]}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="px-6 py-4"></td>
              {comparisons.map((c) => (
                <td key={c.id} className="px-6 py-4 text-center">
                  <Link
                    href={`/cars/${c.listing.id}`}
                    className="inline-block bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition shadow-sm"
                  >
                    View Details
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
