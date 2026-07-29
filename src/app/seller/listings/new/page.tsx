'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function NewListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    condition: 'NEW',
    location: '',
    description: '',
    images: '',
    categoryId: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/seller/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        year: parseInt(form.year as any),
        price: parseFloat(form.price),
      }),
    });

    if (res.ok) {
      toast.success('Listing submitted for approval!');
      router.push('/seller/listings');
    } else {
      toast.error('Failed to create listing');
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/seller/listings" className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Car</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 border max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="e.g. 2023 Toyota Camry XSE" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
            <input type="text" required value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="e.g. Toyota" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
            <input type="text" required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="e.g. Camry" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <input type="number" required value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price (₦)</label>
            <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="18500000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
            <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white">
              <option value="NEW">New</option>
              <option value="USED">Used</option>
              <option value="CERTIFIED_PRE_OWNED">Certified Pre-Owned</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input type="text" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="e.g. Lagos" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category ID</label>
            <input type="text" required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="Enter category ID (check admin panel)" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input type="text" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="https://example.com/image.jpg" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea rows={4} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none" placeholder="Describe the car in detail..." />
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <button type="submit" disabled={loading} className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2 shadow-lg">
            <Plus className="h-4 w-4" /> {loading ? 'Submitting...' : 'Submit Listing'}
          </button>
          <Link href="/seller/listings" className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-50 transition">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
