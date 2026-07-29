import Link from 'next/link';
import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white text-xl font-bold mb-4">
              <Car className="h-6 w-6 text-red-500" /> HALLOOYI
            </Link>
            <p className="text-sm text-gray-400 mb-4">Nigeria's premier online car marketplace. Buy, sell, and compare vehicles with confidence.</p>
            <div className="flex gap-3">
              <Facebook className="h-5 w-5 hover:text-white cursor-pointer transition" />
              <Twitter className="h-5 w-5 hover:text-white cursor-pointer transition" />
              <Instagram className="h-5 w-5 hover:text-white cursor-pointer transition" />
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cars" className="hover:text-white transition">Browse Cars</Link></li>
              <li><Link href="/register?seller=true" className="hover:text-white transition">Sell Your Car</Link></li>
              <li><Link href="/compare" className="hover:text-white transition">Compare Cars</Link></li>
              <li><Link href="/wishlist" className="hover:text-white transition">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-red-500" /> support@hallooyi.com</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-red-500" /> +234 800 123 4567</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-red-500" /> Lagos, Nigeria</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          © 2026 Hallooyi Automobile. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
