'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Car, PlusCircle, ShoppingCart, LogOut, ChevronLeft, MessageSquare } from 'lucide-react';
import { signOut } from 'next-auth/react';

const links = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/seller/listings', label: 'My Listings', icon: Car },
  { href: '/seller/listings/new', label: 'Add New Car', icon: PlusCircle },
  { href: '/seller/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/seller/messages', label: 'Messages', icon: MessageSquare },
];

export function SellerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:text-red-400 transition">
          <ChevronLeft className="h-5 w-5" /> Seller Portal
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                active ? 'bg-red-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
