import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { SellerSidebar } from '@/components/SellerSidebar';

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session?.user || !['SELLER', 'ADMIN'].includes(session.user.role)) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SellerSidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
