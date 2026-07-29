import { MessageSquare } from 'lucide-react';

export default function SellerMessagesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>
      <div className="bg-white rounded-xl shadow-sm p-12 border text-center">
        <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Messages Coming Soon</h2>
        <p className="text-gray-500 max-w-md mx-auto">Real-time messaging between buyers and sellers will be available in the next update.</p>
      </div>
    </div>
  );
}
