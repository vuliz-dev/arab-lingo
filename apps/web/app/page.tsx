'use client';

import { Button } from '@/components/ui/button';
import { BookOpen, Globe, Lightbulb, Mic, Bookmark, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-2">
          <img src="/arab-lingo-logo.svg" alt="ArabLingo" className="w-8 h-8" />
          <span className="text-xl font-bold text-foreground">ArabLingo</span>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="rounded-full border-2 text-foreground hover:bg-muted"
          >
            Try Web Version
          </Button>
          <Button variant="default" className="rounded-full">
            Download App
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Real Meanings.
              <br />
              <span className="text-primary">Not Just Translation.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The complete Arabic dictionary for learners and native speakers. Get deep explanations, noun classes, practical examples, and cultural insights to truly master the language.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                variant="default"
                className="rounded-full px-8 py-6 text-base font-semibold"
              >
                Download for Android
                <span className="ml-2 text-xs bg-primary-foreground text-primary px-2 py-1 rounded-full">
                  7.0+
                </span>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-full px-8 py-6 text-base font-semibold border-2"
              >
                Apple Waiting List
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Preview Section */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center items-end">
            {/* Phone Mockup */}
            <div className="relative w-64 md:w-80 mb-8">
              {/* Glow effect */}
              <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-3xl" />
              
              {/* Phone frame */}
              <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl p-3 shadow-2xl border border-gray-700">
                <div className="bg-primary rounded-2xl overflow-hidden aspect-[9/19.5]">
                  <div className="h-full flex flex-col items-center justify-center p-6 space-y-4">
                    <div className="text-white text-center space-y-2">
                      <div className="text-4xl font-bold">محبة</div>
                      <div className="text-sm text-primary-foreground/80">love, affection</div>
                    </div>
                    <div className="w-full space-y-2 text-xs text-white/90">
                      <div className="flex gap-2 justify-center">
                        <button className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30">
                          Audio
                        </button>
                        <button className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature labels */}
              <div className="absolute -left-24 top-20 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                Deep Meanings
              </div>
              <div className="absolute -right-24 top-40 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                Practical Examples
              </div>
              <div className="absolute -bottom-8 -right-32 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                Audio Pronunciation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-card">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              A modern dictionary,
              <br />
              <span className="text-primary">for natives and learners</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ArabLingo delivers a precise, modern dictionary experience—bridging the gap between basic tools and true linguistic mastery for both natives and learners.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-primary-foreground space-y-4 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Save & History</h3>
              <p className="text-sm text-primary-foreground/90">
                Bookmark your favorite words and access complete search history to reinforce your learning.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-primary-foreground space-y-4 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Discover Vocabulary</h3>
              <p className="text-sm text-primary-foreground/90">
                Learn trending words and expand your vocabulary with curated collections organized by topic.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-primary-foreground space-y-4 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Continuous Growth</h3>
              <p className="text-sm text-primary-foreground/90">
                Access 500+ essential Arabic words, cultural insights, and phrases updated regularly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-background">
        <div className="max-w-5xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">
            Everything You Need
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature Item 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Dictionary Lookup</h3>
                <p className="text-muted-foreground mt-1">
                  Comprehensive word definitions with meanings in English, Vietnamese, and Arabic phonetic transcriptions.
                </p>
              </div>
            </div>

            {/* Feature Item 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Conversation Mode</h3>
                <p className="text-muted-foreground mt-1">
                  Interactive dialogue practice with realistic scenarios. Pick your role and learn natural exchanges.
                </p>
              </div>
            </div>

            {/* Feature Item 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Phrasebook</h3>
                <p className="text-muted-foreground mt-1">
                  Practical phrases organized by context: greetings, restaurants, shopping, emergencies, travel.
                </p>
              </div>
            </div>

            {/* Feature Item 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Culture Guide</h3>
                <p className="text-muted-foreground mt-1">
                  Learn cultural norms, etiquette, food traditions, and social practices for Arabic-speaking regions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-gradient-to-r from-primary to-primary/90">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground">
              Ready to dive into Arabic?
            </h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of learners and native speakers discovering the true depth of the Arabic language. Download ArabLingo today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="rounded-full px-8 py-6 text-base font-semibold bg-white text-primary hover:bg-white/90"
            >
              Download for Android
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg"
              className="rounded-full px-8 py-6 text-base font-semibold bg-white text-primary hover:bg-white/90"
            >
              Join Apple Waitlist
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-12 bg-card border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-8">
            <div className="flex items-center gap-2">
              <img src="/arab-lingo-logo.svg" alt="ArabLingo" className="w-8 h-8" />
              <span className="text-lg font-bold text-foreground">ArabLingo</span>
            </div>
            <div className="flex gap-6 md:gap-12 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground border-t border-border pt-8">
            <p>© 2024 ArabLingo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
