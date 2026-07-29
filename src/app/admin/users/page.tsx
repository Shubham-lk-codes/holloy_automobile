'use client';

import { useState, useEffect } from 'react';
import { Users, User, Shield, Car, Crown } from 'lucide-react';

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  phone: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(setUsers);
  }, []);

  const roleConfig: any = {
    ADMIN: { icon: Crown, color: 'text-red-600', bg: 'bg-red-100' },
    MODERATOR: { icon: Shield, color: 'text-purple-600', bg: 'bg-purple-100' },
    SELLER: { icon: Car, color: 'text-blue-600', bg: 'bg-blue-100' },
    CUSTOMER: { icon: User, color: 'text-gray-600', bg: 'bg-gray-100' },
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Users</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => {
              const config = roleConfig[user.role] || roleConfig.CUSTOMER;
              const RoleIcon = config.icon;
              return (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name || 'Unnamed'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg}`}>
                      <RoleIcon className={`h-3.5 w-3.5 ${config.color}`} />
                      <span className={`text-xs font-semibold ${config.color}`}>{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
