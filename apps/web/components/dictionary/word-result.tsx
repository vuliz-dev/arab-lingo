'use client';

import { useState, useEffect } from 'react';
import { Volume2, Bookmark, BookmarkCheck, Copy, Check, ExternalLink } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { type WordEntry, type Language, LANG_COLOR, LANG_LABEL } from '@/lib/dictionary/mock-data';
import { useAuth } from '@/components/auth/auth-provider';
import { saveWord, unsaveWord, isWordSaved } from '@/lib/firebase/firestore';
import { cn } from '@/lib/utils';

type Props = { word: WordEntry };

const TABS: { id: Language; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'ar', label: 'العربية' },
  { id: 'vi', label: 'Tiếng Việt' },
];

export function WordResult({ word }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Language>('en');
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [playing, setPlaying] = useState(false);

  const activeTranslation = word.translations.find((t) => t.language === activeTab);

  // Sync saved state from Firestore when user or word changes
  useEffect(() => {
    if (!user) { setSaved(false); return; }
    isWordSaved(user.uid, word.slug).then(setSaved);
  }, [user, word.slug]);

  async function handleSave() {
    if (!user) {
      router.push('/sign-in');
      return;
    }
    setSaveLoading(true);
    try {
      if (saved) {
        await unsaveWord(user.uid, word.slug);
        setSaved(false);
      } else {
        await saveWord(user.uid, {
          id: word.id,
          slug: word.slug,
          arabic: word.arabic,
          english: word.english,
          vietnamese: word.vietnamese,
          ipa: word.ipa,
          savedAt: Date.now(),
        });
        setSaved(true);
      }
    } finally {
      setSaveLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(word.arabic).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function handleListen() {
    if (!word.audioUrl || playing) return;
    const audio = new Audio(word.audioUrl);
    setPlaying(true);
    audio.play().catch(() => {});
    audio.onended = () => setPlaying(false);
    audio.onerror = () => setPlaying(false);
  }

  return (
    <div className="space-y-8">
      {/* ── Hero header ─────────────────────────────────── */}
      <div className="space-y-4">
        {/* Language badges + root */}
        <div className="flex items-center gap-2 flex-wrap">
          {word.translations.map((t) => (
            <span
              key={t.language}
              className={cn(
                'text-xs font-semibold px-2.5 py-1 rounded-full border',
                LANG_COLOR[t.language]
              )}
            >
              {LANG_LABEL[t.language]}
            </span>
          ))}
          {word.root && (
            <span className="text-xs text-muted-foreground font-mono border border-border px-2.5 py-1 rounded-full">
              root: <span className="text-foreground font-semibold" dir="rtl">{word.root}</span>
            </span>
          )}
        </div>

        {/* Arabic large display */}
        <div
          className="text-6xl md:text-7xl font-bold text-foreground leading-none"
          dir="rtl"
          style={{ fontFamily: 'serif' }}
        >
          {word.arabic}
        </div>

        {/* Singular / Plural badges */}
        {word.arabicPlural && (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">sg</span>
              <span dir="rtl" className="font-semibold text-foreground" style={{ fontFamily: 'serif' }}>
                {word.arabic}
              </span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">pl</span>
              <span dir="rtl" className="font-semibold text-foreground" style={{ fontFamily: 'serif' }}>
                {word.arabicPlural}
              </span>
            </div>
          </div>
        )}

        {/* English + Vietnamese */}
        <div className="space-y-1">
          <p className="text-2xl md:text-3xl font-semibold text-foreground">{word.english}</p>
          <p className="text-lg text-muted-foreground">{word.vietnamese}</p>
        </div>

        {/* IPA + actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {word.ipa && (
            <span className="font-mono text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-xl">
              {word.ipa}
            </span>
          )}
          <button
            onClick={handleListen}
            disabled={!word.audioUrl || playing}
            className={cn(
              'flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl border transition-colors',
              word.audioUrl
                ? 'text-muted-foreground hover:text-primary border-transparent hover:bg-primary/5 hover:border-primary/20'
                : 'text-muted-foreground/40 border-transparent cursor-default'
            )}
          >
            <Volume2 className={cn('w-4 h-4', playing && 'text-primary animate-pulse')} />
            {playing ? 'Playing…' : 'Listen'}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-xl hover:bg-muted"
          >
            {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleSave}
            disabled={saveLoading}
            className={cn(
              'flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl transition-all border',
              saved
                ? 'text-primary border-primary/20 bg-primary/5'
                : 'text-muted-foreground border-transparent hover:bg-muted'
            )}
          >
            {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* ── Language tabs ────────────────────────────────── */}
      <div className="flex gap-1 p-1 bg-muted rounded-2xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Meanings ─────────────────────────────────────── */}
      {activeTranslation && (
        <div className="space-y-6">
          {/* Arabic romanization — only show Latin-script IPA */}
          {activeTab === 'ar' && activeTranslation.ipa && !/[؀-ۿ]/.test(activeTranslation.ipa) && (
            <span className="inline-block font-mono text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-xl">
              {activeTranslation.ipa}
            </span>
          )}

          {activeTranslation.meanings.map((meaning, mi) => (
            <div key={mi} className="space-y-4">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary border border-primary/20 bg-primary/5 px-3 py-1 rounded-full">
                {meaning.partOfSpeech}
              </span>

              <div className="space-y-5">
                {meaning.definitions.map((def, di) => (
                  <div key={di} className="space-y-3">
                    <div className="flex gap-3">
                      <span className="text-primary font-bold text-sm mt-0.5 shrink-0">
                        {mi + 1}.{di + 1}
                      </span>
                      <p
                        className="text-foreground leading-relaxed"
                        dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                      >
                        {def.text}
                      </p>
                    </div>

                    {def.example && (
                      <div className="ml-6 bg-muted/50 border-l-2 border-primary/30 pl-4 py-3 rounded-r-xl space-y-1.5">
                        <p
                          className="text-sm text-foreground italic"
                          dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                        >
                          "{def.example}"
                        </p>
                        {def.exampleTranslation && (
                          <p className="text-xs text-muted-foreground">{def.exampleTranslation}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Per-meaning synonyms when on EN tab */}
              {activeTab === 'en' && meaning.synonyms && meaning.synonyms.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs text-muted-foreground self-center">also:</span>
                  {meaning.synonyms.slice(0, 5).map((s) => (
                    <span key={s} className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Synonyms ─────────────────────────────────────── */}
      {(() => {
        const syns = [...new Set(activeTab === 'en'
          ? word.synonyms
          : (activeTranslation?.meanings[0]?.synonyms ?? []))];
        const label = activeTab === 'ar' ? 'مترادفات' : activeTab === 'vi' ? 'Từ đồng nghĩa' : 'Synonyms';
        if (!syns.length) return null;
        return (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
              dir={activeTab === 'ar' ? 'rtl' : 'ltr'}>{label}</h3>
            <div className="flex flex-wrap gap-2">
              {syns.map((s) => (
                <span key={s}
                  dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                  className="px-3 py-1.5 text-sm bg-muted hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/20 rounded-full cursor-pointer transition-colors">
                  {s}
                </span>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── Antonyms ─────────────────────────────────────── */}
      {(() => {
        const ants = [...new Set(activeTab === 'en'
          ? word.antonyms
          : (activeTranslation?.meanings[0]?.antonyms ?? []))];
        const label = activeTab === 'ar' ? 'متضادات' : activeTab === 'vi' ? 'Từ trái nghĩa' : 'Antonyms';
        if (!ants.length) return null;
        return (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
              dir={activeTab === 'ar' ? 'rtl' : 'ltr'}>{label}</h3>
            <div className="flex flex-wrap gap-2">
              {ants.map((a) => (
                <span key={a}
                  dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                  className="px-3 py-1.5 text-sm bg-muted hover:bg-red-50 hover:text-red-700 border border-border hover:border-red-200 rounded-full cursor-pointer transition-colors dark:hover:bg-red-950/30 dark:hover:text-red-300 dark:hover:border-red-800">
                  {a}
                </span>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── References ───────────────────────────────────── */}
      {word.references && word.references.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            References
          </h3>
          <div className="flex flex-wrap gap-2">
            {word.references.map((ref) => (
              <a
                key={ref.title}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-primary bg-muted hover:bg-primary/5 border border-border hover:border-primary/20 rounded-full transition-colors"
              >
                {ref.title}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
