import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Admin - Ashok Mahajan CMS',
  description: 'Admin panel for Ashok Mahajan website',
};

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-40">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-medium text-heading">Ashok Mahajan CMS</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-heading transition-colors"
            >
              <ExternalLink size={14} />
              <span>View Site</span>
            </Link>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-heading text-xs font-bold">AM</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
