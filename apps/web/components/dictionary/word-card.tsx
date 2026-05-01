'use client';

import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { type WordEntry, LANG_COLOR, LANG_LABEL } from '@/lib/dictionary/mock-data';
import { cn } from '@/lib/utils';

export function WordCard({ word }: { word: WordEntry }) {
  return (
    <Link
      href={`/app/search?q=${encodeURIComponent(word.english)}`}
      className="group flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-md transition-all"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-foreground group-hover:text-primary transition-colors">
            {word.english}
          </span>
          <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-md border', LANG_COLOR.en)}>
            {LANG_LABEL.en}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {word.arabic} · {word.vietnamese}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-0.5 font-mono">{word.ipa}</p>
      </div>
      <div className={cn(
        'shrink-0 transition-colors',
        word.saved ? 'text-primary' : 'text-muted-foreground/40 group-hover:text-muted-foreground'
      )}>
        {word.saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
      </div>
    </Link>
  );
}
