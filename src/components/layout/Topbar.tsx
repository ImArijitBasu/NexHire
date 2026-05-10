'use client';

import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export function Topbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userInitial = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-border hover:border-primary transition-colors bg-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
              {userInitial}
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg bg-popover border shadow-lg ring-1 ring-foreground/10 z-50 animate-in fade-in-0 zoom-in-95 duration-100">
              <div className="p-3 border-b">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground mt-1">{user?.email}</p>
                <p className="text-xs leading-none text-primary mt-1 font-medium capitalize">{user?.role.toLowerCase()}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={() => { setDropdownOpen(false); router.push(`/dashboard/${user?.role.toLowerCase()}/profile`); }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                >
                  <UserCircle className="h-4 w-4" />
                  Profile
                </button>
              </div>
              <div className="border-t p-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
