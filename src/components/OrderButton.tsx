'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, CreditCard, Banknote, Smartphone, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function OrderButton({ carId, price, title }: { carId: string; price: number; title: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('card');
  const [success, setSuccess] = useState(false);

  async function placeOrder() {
    if (!session) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ listingId: carId, quantity: 1, price }],
          paymentMethod: method,
        }),
      });

      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.error);

      const paymentRes = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, method }),
      });

      if (paymentRes.ok) {
        setSuccess(true);
        toast.success('Order placed successfully!');
        setTimeout(() => router.push('/orders'), 1500);
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
        <p className="text-green-700 font-semibold">Order Confirmed!</p>
        <p className="text-sm text-gray-500">Redirecting to your orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${method === 'card' ? 'border-red-500 bg-red-50' : 'hover:bg-gray-50'}`}>
          <input type="radio" name="payment" value="card" checked={method === 'card'} onChange={() => setMethod('card')} className="accent-red-600" />
          <CreditCard className="h-5 w-5 text-gray-600" />
          <span className="font-medium">Credit/Debit Card</span>
        </label>
        <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${method === 'bank' ? 'border-red-500 bg-red-50' : 'hover:bg-gray-50'}`}>
          <input type="radio" name="payment" value="bank" checked={method === 'bank'} onChange={() => setMethod('bank')} className="accent-red-600" />
          <Banknote className="h-5 w-5 text-gray-600" />
          <span className="font-medium">Bank Transfer</span>
        </label>
        <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${method === 'mobile' ? 'border-red-500 bg-red-50' : 'hover:bg-gray-50'}`}>
          <input type="radio" name="payment" value="mobile" checked={method === 'mobile'} onChange={() => setMethod('mobile')} className="accent-red-600" />
          <Smartphone className="h-5 w-5 text-gray-600" />
          <span className="font-medium">Mobile Money</span>
        </label>
      </div>

      <button
        onClick={placeOrder}
        disabled={loading}
        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
      >
        <ShoppingCart className="h-5 w-5" />
        {loading ? 'Processing...' : `Buy Now - ₦${price.toLocaleString()}`}
      </button>
      <p className="text-xs text-gray-400 text-center">Secure payment powered by Hallooyi</p>
    </div>
  );
}
