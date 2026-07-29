'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Car, Heart, Scale, Bell, User, LogOut, Menu, X, ShoppingBag } from 'lucide-react';

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Car className="h-8 w-8 text-red-600" />
            <span className="text-xl font-bold text-gray-900">HALLOOYI</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/cars" className="text-gray-700 hover:text-red-600 font-medium transition">Browse Cars</Link>
            <Link href="/compare" className="text-gray-700 hover:text-red-600 font-medium flex items-center gap-1 transition">
              <Scale className="h-4 w-4" /> Compare
            </Link>
            <Link href="/wishlist" className="text-gray-700 hover:text-red-600 font-medium flex items-center gap-1 transition">
              <Heart className="h-4 w-4" /> Wishlist
            </Link>

            {session ? (
              <>
                <Link href="/notifications" className="text-gray-700 hover:text-red-600 transition relative">
                  <Bell className="h-5 w-5" />
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition">
                    <User className="h-5 w-5" />
                    <span className="font-medium text-sm">{session.user.name || 'Account'}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl py-2 hidden group-hover:block border z-50">
                    {session.user.role === 'ADMIN' && (
                      <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Admin Panel</Link>
                    )}
                    {session.user.role === 'MODERATOR' && (
                      <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Moderator Panel</Link>
                    )}
                    {session.user.role === 'SELLER' && (
                      <Link href="/seller/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Seller Dashboard</Link>
                    )}
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" /> My Orders
                    </Link>
                    <button onClick={() => signOut()} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-gray-700 hover:text-red-600 font-medium transition">Sign In</Link>
                <Link href="/register" className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 font-medium transition">Get Started</Link>
              </div>
            )}
          </div>

          <button className="md:hidden flex items-center" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-2 shadow-lg">
          <Link href="/cars" className="block py-2 text-gray-700 font-medium">Browse Cars</Link>
          <Link href="/compare" className="block py-2 text-gray-700 font-medium">Compare</Link>
          <Link href="/wishlist" className="block py-2 text-gray-700 font-medium">Wishlist</Link>
          {session ? (
            <>
              {session.user.role === 'ADMIN' && <Link href="/admin/dashboard" className="block py-2 text-gray-700 font-medium">Admin Panel</Link>}
              {session.user.role === 'SELLER' && <Link href="/seller/dashboard" className="block py-2 text-gray-700 font-medium">Seller Dashboard</Link>}
              <Link href="/orders" className="block py-2 text-gray-700 font-medium">My Orders</Link>
              <button onClick={() => signOut()} className="block py-2 text-red-600 font-medium w-full text-left">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 text-gray-700 font-medium">Sign In</Link>
              <Link href="/register" className="block py-2 text-red-600 font-medium">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
