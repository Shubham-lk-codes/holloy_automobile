'use client';

import { useState, useEffect } from 'react';
import { Plus, Shield, Trash2, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

interface Moderator {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

export default function AdminModeratorsPage() {
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  useEffect(() => {
    fetchModerators();
  }, []);

  async function fetchModerators() {
    const res = await fetch('/api/admin/moderators');
    if (res.ok) setModerators(await res.json());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/moderators', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success('Moderator created');
      setForm({ name: '', email: '', phone: '', password: '' });
      setShowForm(false);
      fetchModerators();
    } else {
      toast.error('Failed to create moderator');
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Moderators</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 flex items-center gap-2 transition shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Moderator
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
            <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
            <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
            <input type="password" placeholder="Password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {moderators.map((mod) => (
              <tr key={mod.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-500" /> {mod.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{mod.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{mod.phone || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(mod.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {moderators.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No moderators found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
