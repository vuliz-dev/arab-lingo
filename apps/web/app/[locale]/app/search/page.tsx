'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { SearchBar } from '@/components/dictionary/search-bar';
import { WordResult } from '@/components/dictionary/word-result';
import { SkeletonWord } from '@/components/dictionary/skeleton-word';
import { type WordEntry } from '@/lib/dictionary/mock-data';
import { searchWord } from '@/lib/dictionary/api';
import { addRecentSearch } from '@/lib/dictionary/recent-searches';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<WordEntry | undefined>();
  const [error, setError] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      setResult(undefined);
      return;
    }

    setLoading(true);
    setResult(undefined);
    setError(false);

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    searchWord(query).then((data) => {
      if (ctrl.signal.aborted) return;
      if (data) addRecentSearch(query);
      setResult(data ?? undefined);
      setError(!data);
      setLoading(false);
    });

    return () => ctrl.abort();
  }, [query]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-8">

      {/* ── Sticky header ──────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link
          href="/app"
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <SearchBar variant="compact" initialValue={query} />
      </div>

      {/* ── Result ─────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden">
        {loading ? (
          <SkeletonWord />
        ) : result ? (
          <div className="p-6 md:p-8">
            <WordResult word={result} />
          </div>
        ) : (
          <div className="py-20 text-center space-y-3">
            <div className="text-5xl" dir="rtl" style={{ fontFamily: 'serif' }}>؟</div>
            <p className="font-semibold text-foreground">
              {error ? 'Could not fetch results' : `No results for "${query}"`}
            </p>
            <p className="text-sm text-muted-foreground">
              {error
                ? 'Check your connection and try again.'
                : 'Try searching in English, Arabic, or Vietnamese.'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
