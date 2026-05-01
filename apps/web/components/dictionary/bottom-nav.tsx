'use client';

import { Home, Search, Bookmark, Settings } from 'lucide-react';
import { usePathname, Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/app',           icon: Home,     label: 'Home' },
  { href: '/app/search',    icon: Search,   label: 'Search' },
  { href: '/app/saved',     icon: Bookmark, label: 'Saved' },
  { href: '/app/settings',  icon: Settings, label: 'Settings' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-card border-t border-border flex items-center">
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || (href !== '/app' && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors',
              active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className={cn('w-5 h-5', active && 'stroke-[2.5]')} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
