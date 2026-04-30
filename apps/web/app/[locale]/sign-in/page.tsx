'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, BookOpen, Mic, Globe } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { signInWithGoogle } from '@/lib/firebase/auth';

const FEATURES = [
  { icon: BookOpen, label: 'Deep word meanings & roots' },
  { icon: Mic,      label: 'Audio pronunciation' },
  { icon: Globe,    label: 'Cultural context & phrasebook' },
];

export default function SignInPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  async function handleGoogleSignIn() {
    setError(null);
    setIsPending(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError('Sign in failed. Please try again.');
      console.error(err);
    } finally {
      setIsPending(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left brand panel ──────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative bg-primary flex-col justify-between p-12 overflow-hidden">

        {/* Decorative Arabic letters */}
        <div
          aria-hidden
          className="pointer-events-none select-none absolute -top-8 -right-6 text-[22rem] font-bold text-white/[0.06] leading-none"
          dir="rtl"
          style={{ fontFamily: 'serif' }}
        >
          ع
        </div>
        <div
          aria-hidden
          className="pointer-events-none select-none absolute bottom-0 -left-4 text-[16rem] font-bold text-white/[0.06] leading-none"
          dir="rtl"
          style={{ fontFamily: 'serif' }}
        >
          ب
        </div>
        <div
          aria-hidden
          className="pointer-events-none select-none absolute top-1/2 right-12 -translate-y-1/2 text-[9rem] font-bold text-white/[0.06] leading-none"
          dir="rtl"
          style={{ fontFamily: 'serif' }}
        >
          ر
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <img src="/arab-lingo-logo.svg" alt="ArabLingo" className="w-10 h-10" />
          <span className="text-2xl font-bold text-white">ArabLingo</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-1.5 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Start your journey today
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.15]">
              Master Arabic
              <br />
              <span className="text-white/75">the way it</span>
              <br />
              was meant to be.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-sm">
              Deep meanings, cultural context, and real-world usage — all in one place.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/85 text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Arabic display word */}
        <div className="relative z-10">
          <div className="inline-block bg-white/10 border border-white/20 rounded-2xl px-6 py-4">
            <div className="text-5xl font-bold text-white" dir="rtl" style={{ fontFamily: 'serif' }}>
              أَهْلًا
            </div>
            <div className="text-white/60 text-xs mt-1 font-mono tracking-wider">ahlan · welcome</div>
          </div>
        </div>
      </div>

      {/* ── Right sign-in panel ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-background">

        {/* Mobile logo bar */}
        <div className="lg:hidden flex items-center gap-2 px-6 py-5 border-b border-border">
          <img src="/arab-lingo-logo.svg" alt="ArabLingo" className="w-7 h-7" />
          <span className="text-lg font-bold text-foreground">ArabLingo</span>
        </div>

        {/* Form centered vertically */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm space-y-8">

            {/* Heading */}
            <div className="space-y-2 text-center">
              <div
                aria-hidden
                className="text-5xl font-bold text-primary/10 leading-none select-none mb-4"
                dir="rtl"
                style={{ fontFamily: 'serif' }}
              >
                مرحبًا
              </div>
              <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
              <p className="text-muted-foreground text-sm">
                Sign in to continue learning Arabic
              </p>
            </div>

            {/* Google button */}
            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-3 rounded-2xl border-2 border-border bg-card hover:bg-muted px-5 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-primary/30 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground border-t-primary animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                {isPending ? 'Signing in…' : 'Continue with Google'}
              </button>

              {error && (
                <p className="text-center text-sm text-destructive">{error}</p>
              )}
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-3 text-xs text-muted-foreground">
                  More sign-in options coming soon
                </span>
              </div>
            </div>

            {/* Coming soon pills */}
            <div className="flex gap-2 justify-center">
              {['Facebook', 'Apple', 'Email'].map((method) => (
                <span
                  key={method}
                  className="px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground bg-muted/50"
                >
                  {method}
                </span>
              ))}
            </div>

            {/* Terms */}
            <p className="text-center text-xs text-muted-foreground leading-relaxed">
              By signing in, you agree to our{' '}
              <a href="#" className="underline underline-offset-2 hover:text-foreground transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="underline underline-offset-2 hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ArabLingo · Learn Arabic Deeper
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
    </svg>
  );
}
