'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Package, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h1>
        <p className="text-gray-500">Start browsing and place your first order!</p>
      </div>
    );
  }

  const statusConfig: any = {
    PENDING: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    CONFIRMED: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
    PROCESSING: { icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
    DELIVERED: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    CANCELLED: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => {
          const config = statusConfig[order.status] || statusConfig.PENDING;
          const StatusIcon = config.icon;
          return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order #{order.id.slice(-6)}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bg}`}>
                  <StatusIcon className={`h-4 w-4 ${config.color}`} />
                  <span className={`text-sm font-semibold ${config.color}`}>{order.status}</span>
                </div>
              </div>
              <div className="space-y-3">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.listing.images ? (
                        <img src={item.listing.images.split(',')[0]} alt={item.listing.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.listing.title}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} × ₦{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Payment: <span className={`font-medium ${order.paymentStatus === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'}`}>{order.paymentStatus}</span></p>
                </div>
                <p className="text-lg font-bold text-gray-900">Total: ₦{order.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
