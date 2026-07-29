'use client';

import { useState, useEffect } from 'react';
import { Package, DollarSign } from 'lucide-react';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/seller/orders').then(r => r.json()).then(setOrders);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-mono text-sm text-gray-600">#{item.order.id.slice(-6)}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.order.user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.listing.title}</td>
                <td className="px-6 py-4 font-bold text-gray-900">₦{item.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                    item.order.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    item.order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>{item.order.paymentStatus}</span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No orders received yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
