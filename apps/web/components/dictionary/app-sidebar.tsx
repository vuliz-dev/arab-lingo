'use client';

import { Home, Bookmark, History, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { signOutUser } from '@/lib/firebase/auth';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/app',       icon: Home,     label: 'Home' },
  { href: '/app/saved', icon: Bookmark, label: 'Saved Words' },
  { href: '/app/history', icon: History, label: 'History' },
  { href: '/app/settings', icon: Settings, label: 'Settings' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-border bg-card">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <img src="/arab-lingo-logo.svg" alt="ArabLingo" className="w-8 h-8" />
        <span className="font-bold text-lg text-foreground">ArabLingo</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>

        {/* User */}
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                {user.displayName?.[0] ?? 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{user.displayName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
            <button
              onClick={signOutUser}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
