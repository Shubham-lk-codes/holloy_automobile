import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { Car, Eye, ShoppingCart, TrendingUp, DollarSign, Package } from 'lucide-react';
import Link from 'next/link';

export default async function SellerDashboard() {
  const session = await getServerSession();
  const sellerId = session?.user?.id;

  const [totalListings, totalViews, totalOrders, totalRevenue, recentListings, recentOrders] = await Promise.all([
    prisma.carListing.count({ where: { sellerId } }),
    prisma.carListing.aggregate({ _sum: { views: true }, where: { sellerId } }),
    prisma.orderItem.count({ where: { listing: { sellerId } } }),
    prisma.orderItem.aggregate({
      _sum: { price: true },
      where: { listing: { sellerId }, order: { paymentStatus: 'COMPLETED' } },
    }),
    prisma.carListing.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { _count: { select: { orders: true } }, category: true },
    }),
    prisma.orderItem.findMany({
      where: { listing: { sellerId } },
      orderBy: { order: { createdAt: 'desc' } },
      take: 5,
      include: { order: { include: { user: { select: { name: true } } } }, listing: { select: { title: true } } },
    }),
  ]);

  const cards = [
    { label: 'My Listings', value: totalListings, icon: Car, color: 'bg-blue-500' },
    { label: 'Total Views', value: totalViews._sum.views || 0, icon: Eye, color: 'bg-purple-500' },
    { label: 'Orders Received', value: totalOrders, icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'Revenue', value: `₦${(totalRevenue._sum.price || 0).toLocaleString()}`, icon: DollarSign, color: 'bg-red-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Seller Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition">
              <div className={`${card.color} p-3 rounded-xl w-fit mb-4 shadow-sm`}>
                <Icon className="h-6 w-6 text-white" />
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
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Car className="h-5 w-5 text-gray-400" /> Recent Listings</h2>
            <Link href="/seller/listings/new" className="text-sm text-red-600 font-medium hover:underline">+ Add New</Link>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{listing.title}</td>
                  <td className="px-6 py-4 text-sm">₦{listing.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      listing.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      listing.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>{listing.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{listing.views}</td>
                </tr>
              ))}
              {recentListings.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No listings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Package className="h-5 w-5 text-gray-400" /> Recent Orders</h2>
            <Link href="/seller/orders" className="text-sm text-red-600 font-medium hover:underline">View All</Link>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.order.user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.listing.title}</td>
                  <td className="px-6 py-4 text-sm font-bold">₦{item.price.toLocaleString()}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
