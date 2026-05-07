'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Briefcase, LayoutDashboard, User, FileText, Bookmark, BrainCircuit, Settings, Building, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const seekerLinks = [
    { name: 'Dashboard', href: '/dashboard/seeker', icon: LayoutDashboard },
    { name: 'My Profile', href: '/dashboard/seeker/profile', icon: User },
    { name: 'Applications', href: '/dashboard/seeker/applications', icon: FileText },
    { name: 'Saved Jobs', href: '/dashboard/seeker/saved-jobs', icon: Bookmark },
    { name: 'AI Tools', href: '/dashboard/seeker/ai-tools', icon: BrainCircuit },
  ];

  const employerLinks = [
    { name: 'Dashboard', href: '/dashboard/employer', icon: LayoutDashboard },
    { name: 'Company Profile', href: '/dashboard/employer/company', icon: Building },
    { name: 'Manage Jobs', href: '/dashboard/employer/jobs', icon: Briefcase },
    { name: 'Applicants', href: '/dashboard/employer/applications', icon: Users },
  ];

  const adminLinks = [
    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/dashboard/admin/users', icon: Users },
    { name: 'All Jobs', href: '/dashboard/admin/jobs', icon: Briefcase },
  ];

  let links = seekerLinks;
  if (user?.role === 'EMPLOYER') links = employerLinks;
  if (user?.role === 'ADMIN') links = adminLinks;

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-background flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/" className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">NexHire</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
