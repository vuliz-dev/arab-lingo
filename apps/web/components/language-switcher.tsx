'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const LOCALE_LABELS: Record<Locale, { label: string; flag: string }> = {
  en: { label: 'English', flag: '🇬🇧' },
  vi: { label: 'Tiếng Việt', flag: '🇻🇳' },
  ar: { label: 'العربية', flag: '🇸🇦' },
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function switchLocale(next: Locale) {
    router.replace(pathname, { locale: next });
    setOpen(false);
  }

  const current = LOCALE_LABELS[locale];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-transparent hover:border-border"
        aria-label="Switch language"
        aria-expanded={open}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{current.flag} {current.label}</span>
        <span className="sm:hidden">{current.flag}</span>
      </button>

      {open && (
        <div className="absolute end-0 mt-2 w-44 rounded-2xl bg-card border border-border shadow-xl py-1 z-50">
          {routing.locales.map((loc) => {
            const item = LOCALE_LABELS[loc];
            const isActive = loc === locale;
            return (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-start ${
                  isActive
                    ? 'text-primary font-semibold bg-primary/5'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <span className="text-base">{item.flag}</span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="ms-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
