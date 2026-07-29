'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const res = await fetch('/api/admin/categories');
    if (res.ok) setCategories(await res.json());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success('Category created');
      setForm({ name: '', slug: '', description: '' });
      setShowForm(false);
      fetchCategories();
    } else {
      toast.error('Failed to create category');
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm('Delete this category?')) return;
    await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
    toast.success('Category deleted');
    fetchCategories();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 flex items-center gap-2 transition shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Category Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
            <input
              type="text"
              placeholder="Slug (e.g. sedan)"
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition">Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-red-500" /> {cat.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-mono">{cat.slug}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{cat.description || '-'}</td>
                <td className="px-6 py-4">
                  <button onClick={() => deleteCategory(cat.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No categories found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
