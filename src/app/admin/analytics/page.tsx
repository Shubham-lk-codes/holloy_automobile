'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Eye, ShoppingCart, DollarSign } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/dashboard').then(r => r.json()).then(setStats);
  }, []);

  if (!stats) {
    return <div className="text-center py-20 text-gray-500">Loading analytics...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics & Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: TrendingUp, color: 'bg-blue-500' },
          { label: 'Total Listings', value: stats.totalListings, icon: Eye, color: 'bg-green-500' },
          { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-purple-500' },
          { label: 'Total Revenue', value: `₦${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-red-500' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition">
              <div className={`${card.color} p-3 rounded-xl w-fit mb-4`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-gray-500 text-sm">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 border text-center">
        <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Detailed Analytics</h2>
        <p className="text-gray-500 max-w-md mx-auto">Advanced charts and reports will be available here. Connect to a charting library like Recharts or Chart.js for full visualization.</p>
      </div>
    </div>
  );
}
