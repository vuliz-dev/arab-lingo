'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Clock, X } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { getRecentSearches } from '@/lib/dictionary/recent-searches';
import { cn } from '@/lib/utils';

type Props = {
  variant?: 'hero' | 'compact';
  initialValue?: string;
};

export function SearchBar({ variant = 'hero', initialValue = '' }: Props) {
  const [query, setQuery] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const [recents, setRecents] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches when focused
  useEffect(() => {
    if (focused) setRecents(getRecentSearches());
  }, [focused]);

  const suggestions = query
    ? recents.filter((s) => s.toLowerCase().startsWith(query.toLowerCase()) && s !== query)
    : recents;

  function handleSubmit(value?: string) {
    const q = (value ?? query).trim();
    if (!q) return;
    router.push(`/app/search?q=${encodeURIComponent(q)}`);
    setFocused(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSubmit(suggestions[selectedIndex]);
      } else {
        handleSubmit();
      }
    } else if (e.key === 'Escape') {
      setFocused(false);
      inputRef.current?.blur();
    }
  }

  const isHero = variant === 'hero';
  const showDropdown = focused && suggestions.length > 0;

  return (
    <div className={cn('relative w-full', isHero ? 'max-w-2xl mx-auto' : 'max-w-full')}>
      <div
        className={cn(
          'flex items-center gap-3 bg-card border rounded-2xl transition-all',
          isHero ? 'px-5 py-4 shadow-sm' : 'px-4 py-2.5',
          focused
            ? 'border-primary ring-4 ring-primary/10 shadow-md'
            : 'border-border hover:border-primary/40 shadow-sm'
        )}
      >
        <Search
          className={cn(
            'shrink-0 text-muted-foreground',
            isHero ? 'w-5 h-5' : 'w-4 h-4'
          )}
        />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelectedIndex(-1); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="Search English, Arabic, Vietnamese…"
          className={cn(
            'flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground/60',
            isHero ? 'text-base' : 'text-sm'
          )}
          dir="auto"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Recent searches dropdown */}
      {showDropdown && (
        <div className="absolute top-full mt-2 inset-x-0 z-50 bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
          {suggestions.slice(0, 6).map((s, i) => (
            <button
              key={s}
              onMouseDown={() => handleSubmit(s)}
              className={cn(
                'w-full flex items-center gap-3 px-5 py-3 text-sm text-left transition-colors',
                i === selectedIndex
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span dir="auto">{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
