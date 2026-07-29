'use client';

import { useState, useEffect } from 'react';
import { Package, CheckCircle, Clock, XCircle, Truck } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/orders').then(r => r.json()).then(setOrders);
  }, []);

  const statusConfig: any = {
    PENDING: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    CONFIRMED: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
    PROCESSING: { icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
    SHIPPED: { icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    DELIVERED: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    CANCELLED: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Orders</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => {
                const config = statusConfig[order.status] || statusConfig.PENDING;
                const StatusIcon = config.icon;
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-sm text-gray-600">#{order.id.slice(-6)}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{order.user.name}</p>
                      <p className="text-sm text-gray-500">{order.user.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.items.map((item: any, i: number) => (
                        <div key={i} className="truncate max-w-[200px]">{item.listing.title}</div>
                      ))}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">₦{order.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg} w-fit`}>
                        <StatusIcon className={`h-3.5 w-3.5 ${config.color}`} />
                        <span className={`text-xs font-semibold ${config.color}`}>{order.status}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
