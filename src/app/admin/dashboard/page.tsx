import { prisma } from '@/lib/prisma';
import { Car, Users, ShoppingCart, DollarSign, AlertCircle, TrendingUp, Package, Eye } from 'lucide-react';

async function getStats() {
  const [totalUsers, totalListings, totalOrders, totalRevenue, pendingListings, recentOrders, topCars] = await Promise.all([
    prisma.user.count(),
    prisma.carListing.count(),
    prisma.order.count(),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
    prisma.carListing.count({ where: { status: 'PENDING' } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } }, items: { include: { listing: { select: { title: true } } } } },
    }),
    prisma.carListing.findMany({
      where: { status: 'APPROVED' },
      orderBy: { views: 'desc' },
      take: 5,
      select: { title: true, views: true, price: true },
    }),
  ]);

  return { totalUsers, totalListings, totalOrders, totalRevenue: totalRevenue._sum.amount || 0, pendingListings, recentOrders, topCars };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500', trend: '+12%' },
    { label: 'Total Listings', value: stats.totalListings, icon: Car, color: 'bg-green-500', trend: '+8%' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-purple-500', trend: '+24%' },
    { label: 'Revenue', value: `₦${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-red-500', trend: '+18%' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      {stats.pendingListings > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          <p className="text-yellow-800">
            <span className="font-bold">{stats.pendingListings}</span> listings are pending approval.{' '}
            <a href="/admin/listings" className="underline font-medium hover:text-yellow-900">Review now</a>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded-xl shadow-sm`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{card.trend}</span>
              </div>
              <p className="text-gray-500 text-sm">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Package className="h-5 w-5 text-gray-400" /> Recent Orders</h2>
            <a href="/admin/orders" className="text-sm text-red-600 hover:underline">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm text-gray-600">#{order.id.slice(-6)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{order.user.name}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">₦{order.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {stats.recentOrders.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Eye className="h-5 w-5 text-gray-400" /> Most Viewed Cars</h2>
            <a href="/admin/analytics" className="text-sm text-red-600 hover:underline">View Analytics</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.topCars.map((car) => (
                  <tr key={car.title} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{car.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">₦{car.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{car.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
