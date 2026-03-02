'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  FileText,
  Mic,
  Trophy,
  Video,
  Images,
  BookOpen,
  FolderOpen,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Blog Posts', href: '/admin/posts', icon: FileText },
  { label: 'Speeches', href: '/admin/speeches', icon: Mic },
  { label: 'Awards', href: '/admin/awards', icon: Trophy },
  { label: 'Videos', href: '/admin/videos', icon: Video },
  { label: 'Gallery', href: '/admin/gallery', icon: Images },
  { label: 'Media', href: '/admin/media', icon: FolderOpen },
  { label: 'Publications', href: '/admin/publications', icon: BookOpen },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  function isActive(href: string): boolean {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  async function handleLogout() {
    setLoggingOut(true);
    await signOut({ callbackUrl: '/admin/login' });
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#000f2b]">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-[#9dca00]/20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-heading text-sm font-black tracking-tight">AM</span>
          </div>
          <div>
            <div className="text-white text-sm font-bold leading-tight">Ashok Mahajan</div>
            <div className="text-primary text-[11px] font-medium">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-black text-white font-semibold'
                    : 'text-[#c8d8e8] hover:bg-[#9dca00]/15 hover:text-white'
                )}
              >
                <Icon size={16} className="flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[#9dca00]/20 flex-shrink-0">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium',
            'border border-red-500/30 text-red-400 transition-all duration-150',
            'hover:bg-red-500/10 hover:border-red-500/50',
            loggingOut && 'opacity-60 cursor-not-allowed'
          )}
        >
          <LogOut size={16} className="flex-shrink-0" />
          <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
        className="admin-hamburger hidden fixed top-3 left-3 z-[1100] bg-[#000f2b] rounded-lg p-2 flex-col gap-1.5"
      >
        {mobileOpen ? (
          <X size={20} className="text-primary" />
        ) : (
          <Menu size={20} className="text-primary" />
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="admin-overlay hidden fixed inset-0 bg-black/50 z-[999]"
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className="admin-sidebar-desktop w-60 min-h-screen bg-[#000f2b] flex-shrink-0 sticky top-0 h-screen overflow-y-auto"
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'admin-sidebar-mobile hidden fixed top-0 left-0 w-60 h-screen bg-[#000f2b] z-[1000] overflow-y-auto',
          'transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-sidebar-mobile { display: block !important; }
          .admin-hamburger { display: flex !important; }
          .admin-overlay { display: block !important; }
        }
      `}</style>
    </>
  );
}
