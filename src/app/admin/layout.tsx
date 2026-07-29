import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session?.user || !['ADMIN', 'MODERATOR'].includes(session.user.role)) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar role={session.user.role} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
