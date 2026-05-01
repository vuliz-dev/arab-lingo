'use client';

import { useState, useEffect } from 'react';
import { Clock, Sparkles, Loader2 } from 'lucide-react';
import { SearchBar } from '@/components/dictionary/search-bar';
import { WordCard } from '@/components/dictionary/word-card';
import { useAuth } from '@/components/auth/auth-provider';
import { fetchSavedWords, type SavedWord } from '@/lib/firebase/firestore';
import { getRecentSearches } from '@/lib/dictionary/recent-searches';
import { Link } from '@/i18n/navigation';
import type { WordEntry } from '@/lib/dictionary/mock-data';

function toWordEntry(w: SavedWord): WordEntry {
  return {
    id: w.id,
    slug: w.slug,
    arabic: w.arabic,
    english: w.english,
    vietnamese: w.vietnamese,
    ipa: w.ipa,
    translations: [],
    synonyms: [],
    antonyms: [],
    saved: true,
  };
}

export default function AppHomePage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] ?? 'there';

  const [recents, setRecents] = useState<string[]>([]);
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);

  useEffect(() => {
    setRecents(getRecentSearches());
  }, []);

  useEffect(() => {
    if (!user) { setSavedWords([]); return; }
    setSavedLoading(true);
    fetchSavedWords(user.uid)
      .then((words) => setSavedWords(words.slice(0, 3)))
      .finally(() => setSavedLoading(false));
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-12">

      {/* ── Greeting ───────────────────────────────────────── */}
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Good day,</p>
        <h1 className="text-2xl font-bold text-foreground">
          Hello, {firstName} 👋
        </h1>
      </div>

      {/* ── Hero Search ────────────────────────────────────── */}
      <div className="space-y-4">
        <SearchBar variant="hero" />

        {recents.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Clock className="w-3 h-3" />
              Recent:
            </div>
            {recents.map((s) => (
              <Link
                key={s}
                href={`/app/search?q=${encodeURIComponent(s)}`}
                className="text-xs px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/20 rounded-full transition-colors"
                dir="auto"
              >
                {s}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Word of the Day ────────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary rounded-3xl p-6 md:p-8">
        <div
          aria-hidden
          className="pointer-events-none select-none absolute -right-4 -top-4 text-[10rem] font-bold text-white/[0.07] leading-none"
          dir="rtl"
          style={{ fontFamily: 'serif' }}
        >
          ع
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white/70" />
            <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              Word of the Day
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-5xl font-bold text-white" dir="rtl" style={{ fontFamily: 'serif' }}>
              عِلْم
            </div>
            <p className="text-white/80 font-mono text-sm">/ʕilm/</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xl font-semibold text-white">Knowledge</p>
            <p className="text-white/70 text-sm">Kiến thức</p>
          </div>
          <p className="text-white/65 text-sm leading-relaxed max-w-sm">
            "اطلب العلم من المهد إلى اللحد" — Seek knowledge from the cradle to the grave.
          </p>
          <Link
            href="/app/search?q=knowledge"
            className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors border border-white/20"
          >
            Explore word
          </Link>
        </div>
      </section>

      {/* ── Saved Words preview ────────────────────────────── */}
      {user && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Your Saved Words</h2>
            <Link
              href="/app/saved"
              className="text-xs text-primary hover:underline font-medium"
            >
              View all
            </Link>
          </div>
          {savedLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : savedWords.length > 0 ? (
            <div className="space-y-2">
              {savedWords.map((word) => (
                <WordCard key={word.slug} word={toWordEntry(word)} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4">
              No saved words yet. Search and bookmark words to see them here.
            </p>
          )}
        </section>
      )}

    </div>
  );
}
