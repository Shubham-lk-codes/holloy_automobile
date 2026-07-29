'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    const res = await fetch('/api/notifications');
    if (res.ok) {
      setNotifications(await res.json());
    }
    setLoading(false);
  }

  async function markAllRead() {
    await fetch('/api/notifications', { method: 'PATCH' });
    toast.success('All notifications marked as read');
    fetchNotifications();
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 text-sm text-red-600 font-medium hover:underline"
          >
            <Check className="h-4 w-4" /> Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border shadow-sm">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className={`p-5 rounded-xl border transition ${n.read ? 'bg-white' : 'bg-red-50 border-red-100'}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${n.read ? 'bg-gray-100' : 'bg-red-100'}`}>
                  <Bell className={`h-5 w-5 ${n.read ? 'text-gray-400' : 'text-red-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{n.message}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
                {!n.read && <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
