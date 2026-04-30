'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useAuth } from '@/components/auth/auth-provider';
import {
  BookOpen, Globe, Lightbulb, Mic, Bookmark, ArrowRight,
  Moon, Sun, Smartphone, Monitor, Star, Quote, Volume2,
  ChevronRight, Sparkles, Search,
} from 'lucide-react';

// ─── Phone Mockup ───────────────────────────────────────────────────────────

type DemoWord = {
  arabic: string;
  transliteration: string;
  meaning: string;
  tag: string;
  example: string;
  exampleTranslation: string;
};

type PhoneStage = 'typing' | 'searching' | 'revealed';

function PhoneMockup({ words, labels }: { words: DemoWord[]; labels: { audio: string; save: string; appName: string } }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [stage, setStage] = useState<PhoneStage>('typing');
  const [typedText, setTypedText] = useState('');

  const current = words[wordIndex]!;

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (stage === 'typing') {
      if (typedText.length < current.arabic.length) {
        t = setTimeout(() => setTypedText(current.arabic.slice(0, typedText.length + 1)), 130);
      } else {
        t = setTimeout(() => setStage('searching'), 500);
      }
    } else if (stage === 'searching') {
      t = setTimeout(() => setStage('revealed'), 900);
    } else {
      t = setTimeout(() => {
        setStage('typing');
        setTypedText('');
        setWordIndex((i) => (i + 1) % words.length);
      }, 3200);
    }
    return () => clearTimeout(t);
  }, [stage, typedText, current, words.length]);

  return (
    <div className="relative w-60 md:w-72">
      {/* Glow halo */}
      <div className="absolute inset-0 blur-3xl bg-primary/25 rounded-3xl scale-110" />

      {/* Phone shell */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 rounded-[2.5rem] p-[10px] shadow-2xl border border-white/10">
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-full z-10" />

        {/* Screen */}
        <div className="bg-primary rounded-[2.2rem] overflow-hidden" style={{ aspectRatio: '9/19.5' }}>
          <div className="h-full flex flex-col pt-8 px-4 pb-4">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/50 text-[10px] font-medium tracking-wide">{labels.appName}</span>
              <Volume2 className="w-3.5 h-3.5 text-white/50" />
            </div>

            {/* Search bar */}
            <div className="bg-white/20 rounded-xl px-3 py-2 flex items-center gap-2 mb-5">
              <Search className="w-3 h-3 text-white/60 shrink-0" />
              <span className="text-white text-sm flex-1 text-right" dir="rtl">
                {typedText}
                {stage === 'typing' && <span className="animate-pulse ml-0.5">|</span>}
              </span>
              {stage === 'searching' && (
                <div className="w-3 h-3 rounded-full border-2 border-white/50 border-t-transparent animate-spin shrink-0" />
              )}
            </div>

            {/* Result card */}
            <div
              className={`flex-1 flex flex-col transition-all duration-500 ${
                stage === 'revealed' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              <div className="text-center space-y-2 flex-1">
                <div className="text-[3.5rem] font-bold text-white leading-none mt-2" dir="rtl">
                  {current.arabic}
                </div>
                <div className="text-white/60 text-[10px] tracking-widest uppercase font-mono">
                  {current.transliteration}
                </div>
                <div className="text-white font-semibold text-sm">{current.meaning}</div>
                <div className="inline-block bg-white/20 text-white/80 text-[10px] px-2.5 py-0.5 rounded-full">
                  {current.tag}
                </div>

                <div className="bg-white/10 rounded-xl p-2.5 mt-2 space-y-1">
                  <p className="text-white text-xs text-right leading-relaxed" dir="rtl">
                    {current.example}
                  </p>
                  <p className="text-white/55 text-[10px]">{current.exampleTranslation}</p>
                </div>

                <div className="flex gap-2 justify-center pt-1">
                  <button className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] flex items-center gap-1">
                    <Volume2 className="w-2.5 h-2.5" /> {labels.audio}
                  </button>
                  <button className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] flex items-center gap-1">
                    <Bookmark className="w-2.5 h-2.5" /> {labels.save}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating chips */}
      <div className="hidden md:flex absolute -left-36 top-16 items-center gap-2 bg-card text-foreground px-4 py-2 rounded-full text-xs font-semibold shadow-xl border border-border whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
        Deep Meanings
      </div>
      <div className="hidden md:flex absolute -right-36 top-40 items-center gap-2 bg-card text-foreground px-4 py-2 rounded-full text-xs font-semibold shadow-xl border border-border whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
        Practical Examples
      </div>
      <div className="hidden md:flex absolute -right-40 bottom-20 items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs font-semibold shadow-xl whitespace-nowrap">
        <Volume2 className="w-3 h-3" />
        Audio Pronunciation
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function Home() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const tryWebHref = user ? '/app' : '/sign-in';

  const n = useTranslations('nav');
  const h = useTranslations('hero');
  const p = useTranslations('phone');
  const w = useTranslations('wotd');
  const f = useTranslations('features');
  const d = useTranslations('deepDive');
  const tm = useTranslations('testimonials');
  const c = useTranslations('cta');
  const ft = useTranslations('footer');

  // Build typed arrays from translation messages
  const phoneWords: DemoWord[] = (
    p.raw('words') as Array<{
      arabic: string;
      transliteration: string;
      meaning: string;
      tag: string;
      example: string;
      exampleTranslation: string;
    }>
  ).map((w) => ({
    arabic: w.arabic,
    transliteration: w.transliteration,
    meaning: w.meaning,
    tag: w.tag,
    example: w.example,
    exampleTranslation: w.exampleTranslation,
  }));

  const testimonialItems = (
    tm.raw('items') as Array<{ name: string; role: string; text: string }>
  );

  const FEATURE_CARDS = [
    { icon: Bookmark, title: f('save.title'), desc: f('save.desc'), deco: 'حفظ' },
    { icon: Globe,    title: f('discover.title'), desc: f('discover.desc'), deco: 'اكتشف' },
    { icon: Lightbulb, title: f('growth.title'), desc: f('growth.desc'), deco: 'نمو' },
  ];

  const DEEP_DIVE = [
    { icon: BookOpen, key: 'dictionary', arabic: 'قاموس', flip: false },
    { icon: Mic,      key: 'conversation', arabic: 'حوار', flip: true },
    { icon: Globe,    key: 'phrasebook', arabic: 'عبارات', flip: false },
    { icon: Lightbulb, key: 'culture',   arabic: 'ثقافة', flip: true },
  ] as const;

  return (
    <div className="bg-background overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-2">
          <img src="/arab-lingo-logo.svg" alt="ArabLingo" className="w-8 h-8 shrink-0" />
          <span className="text-xl font-bold text-foreground">ArabLingo</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
          <Button asChild variant="outline" className="hidden sm:inline-flex rounded-full border-2">
            <Link href={tryWebHref}>{n('tryWeb')}</Link>
          </Button>
          <Button variant="default" className="rounded-full">
            {n('downloadApp')}
          </Button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 md:px-12 pt-16 md:pt-24 pb-12 overflow-hidden">
        <div aria-hidden className="pointer-events-none select-none absolute -top-8 end-0 text-[22rem] font-bold text-primary/[0.04] leading-none" dir="rtl" style={{ fontFamily: 'serif' }}>ع</div>
        <div aria-hidden className="pointer-events-none select-none absolute bottom-0 -start-4 text-[18rem] font-bold text-primary/[0.04] leading-none" dir="rtl" style={{ fontFamily: 'serif' }}>ب</div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-8 items-center">
            <div className="space-y-8 text-center md:text-start">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                {h('badge')}
              </div>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                {h('headline1')}
                <br />
                <span className="text-primary">{h('headline2')}</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-md leading-relaxed mx-auto md:mx-0">
                {h('description')}
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center md:justify-start">
                <Button size="lg" className="rounded-full px-6 font-semibold">
                  <Smartphone className="w-4 h-4 me-2" />
                  {h('downloadAndroid')}
                  <span className="ms-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">{h('androidBadge')}</span>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-6 font-semibold border-2">
                  {h('appleWaitlist')}
                </Button>
                <Button asChild size="lg" variant="ghost" className="rounded-full px-6 font-semibold">
                  <Link href={tryWebHref}>
                    <Monitor className="w-4 h-4 me-2" />
                    {h('tryWeb')}
                  </Link>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">{h('subtext')}</p>
            </div>

            <div className="flex justify-center md:justify-end py-12">
              <PhoneMockup
                words={phoneWords}
                labels={{ audio: p('audio'), save: p('save'), appName: p('appName') }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Word of the Day ─────────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 md:px-12 py-16 md:py-24 bg-card overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none select-none absolute end-4 md:end-16 top-1/2 -translate-y-1/2 text-[14rem] md:text-[20rem] font-bold text-primary/[0.05] leading-none"
          dir="rtl"
          style={{ fontFamily: 'serif' }}
        >
          {w('arabic')}
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
            <div className="shrink-0">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                {w('label')}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-end gap-5 flex-wrap">
                <span className="text-6xl md:text-8xl font-bold text-foreground" dir="rtl" style={{ fontFamily: 'serif' }}>
                  {w('arabic')}
                </span>
                <div className="space-y-1 pb-2">
                  <div className="text-primary font-mono text-sm tracking-widest">{w('transliteration')}</div>
                  <div className="text-muted-foreground text-sm">{w('tag')}</div>
                </div>
              </div>

              <p className="text-2xl md:text-3xl font-semibold text-foreground">{w('meaning')}</p>

              <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 space-y-1 max-w-xl">
                <p className="text-foreground text-lg text-right leading-relaxed" dir="rtl">{w('example')}</p>
                <p className="text-muted-foreground text-sm">{w('exampleTranslation')}</p>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">{w('note')}</p>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{w('rootLabel')}</span>
                <span className="font-mono text-primary font-semibold text-sm" dir="rtl">{w('root')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three-up Feature Highlight ──────────────────────────────────────── */}
      <section className="px-4 sm:px-6 md:px-12 py-16 md:py-24 bg-background">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              {f('sectionTitle')}
              <br />
              <span className="text-primary">{f('sectionSubtitle')}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{f('sectionDesc')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURE_CARDS.map(({ icon: Icon, title, desc, deco }) => (
              <div
                key={title}
                className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/75 rounded-3xl p-8 text-primary-foreground space-y-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div aria-hidden className="pointer-events-none select-none absolute -end-3 -bottom-5 text-8xl font-bold text-white/10 leading-none" dir="rtl" style={{ fontFamily: 'serif' }}>
                  {deco}
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="text-sm text-primary-foreground/85 mt-2 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Deep-Dive ───────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 md:px-12 py-16 md:py-24 bg-card">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{d('title')}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{d('desc')}</p>
          </div>

          {DEEP_DIVE.map(({ icon: Icon, key, arabic, flip }) => (
            <div
              key={key}
              className={`flex flex-col ${flip ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center`}
            >
              <div className="shrink-0 relative w-full md:w-64 h-48 md:h-56 rounded-3xl bg-primary/8 flex items-center justify-center overflow-hidden">
                <div aria-hidden className="absolute inset-0 flex items-center justify-center text-[7rem] font-bold text-primary/10 leading-none" dir="rtl" style={{ fontFamily: 'serif' }}>
                  {arabic}
                </div>
                <div className="relative z-10 w-20 h-20 rounded-3xl bg-primary/15 flex items-center justify-center">
                  <Icon className="w-10 h-10 text-primary" />
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">{d(`${key}.badge`)}</span>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">{d(`${key}.title`)}</h3>
                <p className="text-muted-foreground leading-relaxed">{d(`${key}.desc`)}</p>
                <button className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all">
                  {d('learnMore')} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 md:px-12 py-16 md:py-24 bg-background overflow-hidden">
        <div aria-hidden className="pointer-events-none select-none absolute -start-8 top-0 text-[20rem] font-bold text-primary/[0.04] leading-none" dir="rtl" style={{ fontFamily: 'serif' }}>ش</div>

        <div className="max-w-5xl mx-auto relative z-10 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{tm('title')}</h2>
            <p className="text-muted-foreground">{tm('subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonialItems.map((t) => (
              <div key={t.name} className="bg-card border border-border rounded-3xl p-6 space-y-4 hover:shadow-lg transition-shadow">
                <Quote className="w-6 h-6 text-primary/40" />
                <p className="text-foreground leading-relaxed text-sm">"{t.text}"</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA Banner ────────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 md:px-12 py-20 md:py-32 bg-primary overflow-hidden">
        <div aria-hidden className="pointer-events-none select-none absolute inset-0 flex items-center justify-center text-[28rem] font-bold text-white/[0.04] leading-none" dir="rtl" style={{ fontFamily: 'serif' }}>ع</div>
        <div aria-hidden className="pointer-events-none select-none absolute -end-8 -bottom-8 text-[18rem] font-bold text-white/[0.04] leading-none" dir="rtl" style={{ fontFamily: 'serif' }}>ر</div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <h2 className="text-3xl md:text-6xl font-bold text-primary-foreground leading-tight">{c('title')}</h2>
          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto">{c('desc')}</p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
            <Button size="lg" className="rounded-full px-8 text-base font-semibold bg-white text-primary hover:bg-white/90">
              <Smartphone className="w-5 h-5 me-2" />
              {c('downloadAndroid')}
              <ArrowRight className="ms-2 w-4 h-4" />
            </Button>
            <Button size="lg" className="rounded-full px-8 text-base font-semibold bg-white/15 text-white hover:bg-white/25 border border-white/25">
              {c('appleWaitlist')}
            </Button>
            <Button asChild size="lg" className="rounded-full px-8 text-base font-semibold bg-white/15 text-white hover:bg-white/25 border border-white/25">
              <Link href={tryWebHref}>
                <Monitor className="w-5 h-5 me-2" />
                {c('tryWeb')}
              </Link>
            </Button>
          </div>

          <p className="text-primary-foreground/50 text-sm">{c('subtext')}</p>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="px-4 sm:px-6 md:px-12 py-12 bg-card border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-center gap-2">
              <img src="/arab-lingo-logo.svg" alt="ArabLingo" className="w-8 h-8" />
              <span className="text-lg font-bold text-foreground">ArabLingo</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">{ft('contact')}</a>
              <a href="#" className="hover:text-foreground transition-colors">{ft('terms')}</a>
              <a href="#" className="hover:text-foreground transition-colors">{ft('privacy')}</a>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground border-t border-border pt-8">
            <p>{ft('copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
