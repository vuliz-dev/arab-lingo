'use client';

import { useState, useEffect } from 'react';
import { Search, BookmarkX, Loader2 } from 'lucide-react';
import { WordCard } from '@/components/dictionary/word-card';
import { useAuth } from '@/components/auth/auth-provider';
import { fetchSavedWords, type SavedWord } from '@/lib/firebase/firestore';
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

export default function SavedPage() {
  const { user, loading: authLoading } = useAuth();
  const [words, setWords] = useState<SavedWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }

    fetchSavedWords(user.uid)
      .then(setWords)
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const filtered = words.filter((w) => {
    const q = filter.toLowerCase();
    return (
      !q ||
      w.english.toLowerCase().includes(q) ||
      w.arabic.includes(q) ||
      w.vietnamese.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Saved Words</h1>
        <p className="text-sm text-muted-foreground">
          {loading ? '…' : `${words.length} word${words.length !== 1 ? 's' : ''} saved`}
        </p>
      </div>

      {/* ── Filter ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-card border border-border rounded-2xl focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter saved words…"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
        />
      </div>

      {/* ── List ───────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((word) => (
            <WordCard key={word.slug} word={toWordEntry(word)} />
          ))}
        </div>
      ) : words.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center">
            <BookmarkX className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">No saved words yet</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Start searching and bookmark words you want to remember.
            </p>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground text-sm">No words match "{filter}"</p>
        </div>
      )}
    </div>
  );
}
