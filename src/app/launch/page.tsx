"use client";

import React from "react";
import Link from "next/link";
import {
  Check,
  Clock,
  Lock,
  RefreshCcw,
  Shield,
  Smartphone,
  Timer,
  VolumeX,
} from "lucide-react";
import { FocusCard, RecoverIcon, RecoverLogo } from "@/components/primitives";

export default function LaunchLandingPage() {
  const features = [
    {
      title: "1-Minute Micro-Withdrawals & Instant Refunds",
      description:
        "Need 60 seconds to reply to a friend? Spend 1 Credit for 1 minute instead of burning a 15-minute block. Done early? Tap Re-lock & Refund to return unused whole minutes straight to your card.",
      Icon: RefreshCcw,
      badge: "Fix #1 • Micro-Spend",
    },
    {
      title: "True Screen-Off Background Sessions",
      description:
        "Lock your phone and set it face-down. Our Android Foreground Service keeps counting your focus Credits with your screen completely off—saving battery and eliminating desk glare.",
      Icon: Smartphone,
      badge: "Fix #2 • Battery Safe",
    },
    {
      title: "Open-Ended Stopwatch Mode (∞ Open)",
      description:
        "Entering deep study or coding flow without knowing how long it will take? Count up with no preset limit and bank your exact elapsed minutes whenever you finish.",
      Icon: Timer,
      badge: "Fix #3 • Flow State",
    },
    {
      title: "Silent Haptic Completion Toggle",
      description:
        "Study with headphones on without a jarring timer chime cutting off your playlist. Switch completion alerts to subtle haptic-only vibration.",
      Icon: VolumeX,
      badge: "Fix #4 • Audio Safe",
    },
    {
      title: "Hardware-Enforced Anti-Cheat",
      description:
        "Optional accelerometer motion guard forfeits strict sessions if the phone is picked up. Pair with the AR Lock Box Vault, biometric withdrawals, and Android Device Guard uninstall protection.",
      Icon: Shield,
      badge: "Hardware Guard",
    },
    {
      title: "11 Custom Card Finishes & Bank Ledger",
      description:
        "Emboss your personal goal on Brushed Metal, Circuit, Weave, and Urban cards, and audit every earned credit and withdrawal in a clean double-entry statement.",
      Icon: Lock,
      badge: "Card Studio",
    },
  ];

  const faqs = [
    {
      q: "Does Recover upload my Android app usage history to a server?",
      a: "No. Android UsageStatsManager checks and app block rules execute locally on your device. We never upload which apps or websites you open.",
    },
    {
      q: "What happens if I unlock 15 minutes and finish checking in 2 minutes?",
      a: "Tap 'Re-lock & Refund' on the wallet banner. Recover immediately re-arms the Android App Shield and refunds the remaining 13 unused whole minutes back to your card balance.",
    },
    {
      q: "Will my focus session stop if I lock my phone screen or play music?",
      a: "No. Screen-Off mode runs inside an Android Foreground Service so you can lock your phone completely, and the Silent (Haptic Only) toggle ensures your music never pauses or ducks.",
    },
    {
      q: "Why are there 3 native ads on the free plan instead of a 7-day hard paywall?",
      a: "We want students and daily focusers to use the full wallet for free forever. Three calm, dark-themed native ad slots (top focus pill, post-session card, and compact dashboard card) fund the free tier. Upgrading to Recover Pro removes all ads immediately.",
    },
    {
      q: "How do I cancel Recover Pro?",
      a: "Open Recover Guard → Account, Billing & Privacy and tap Cancel Subscription for one-click cancellation with zero retention hoops.",
    },
  ];

  return (
    <div
      data-testid="screen-launch-landing"
      className="min-h-screen bg-bg text-text"
    >
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" aria-label="Recover Home">
            <RecoverLogo
              iconClassName="h-6 w-8 text-accent"
              wordmarkClassName="h-4 w-auto text-text"
            />
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-text-muted">
            <a href="#how-it-works" className="hover:text-text">
              How It Works
            </a>
            <a href="#features" className="hover:text-text">
              Features
            </a>
            <a href="#pricing" className="hover:text-text">
              Pricing
            </a>
            <Link
              href="/"
              className="rounded-pill bg-accent px-4 py-2 text-xs font-semibold text-on-accent"
            >
              Open Wallet
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 space-y-20">
        {/* 1. HERO */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-4">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-2 rounded-pill bg-surface border border-border px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest text-accent">
              <RecoverIcon className="h-3.5 w-5" /> Android APK & Web • Screen
              Time Wallet
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-text leading-tight">
              Earn your screen time on Android. Lock your phone, study in peace,
              spend by the minute.
            </h1>
            <p className="text-base sm:text-lg text-text-muted leading-relaxed">
              Distracting apps stay locked by default. Bank Credits onto your
              metallic Recover Card with your screen off, and withdraw as little
              as 1 minute when you only need to reply to a friend.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/"
                data-testid="btn-launch-open-wallet"
                className="rounded-pill bg-accent px-6 py-3.5 text-base font-semibold text-on-accent shadow-surface"
              >
                Open Recover Wallet
              </Link>
              <Link
                href="/?screen=S13"
                className="rounded-pill bg-surface border border-border px-5 py-3.5 text-sm font-semibold text-text hover:border-border-input"
              >
                Explore Card Studio
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-sheet bg-surface border border-border p-5 shadow-pop space-y-4">
              <FocusCard
                creditsHundredths={1500}
                exchangeRateHundredthsPerMin={100}
                label="RECOVER CARD"
                skinId="metal-classic"
              />
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="rounded-md bg-surface-elevated border border-border p-2.5">
                  <p className="font-mono text-xs text-accent font-bold">1m</p>
                  <p className="text-[11px] text-text-muted">Min Withdraw</p>
                </div>
                <div className="rounded-md bg-surface-elevated border border-border p-2.5">
                  <p className="font-mono text-xs text-success font-bold">
                    ∞ Open
                  </p>
                  <p className="text-[11px] text-text-muted">Stopwatch Mode</p>
                </div>
                <div className="rounded-md bg-surface-elevated border border-border p-2.5">
                  <p className="font-mono text-xs text-focus-glow font-bold">
                    Screen-Off
                  </p>
                  <p className="text-[11px] text-text-muted">Foreground Sync</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. THE PROBLEM */}
        <section className="space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-focus-glow">
              The Problem
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text">
              Why standard app timers and rigid wallets break down in real life
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-card bg-surface border border-border p-6 space-y-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-pill bg-surface-elevated border border-border">
                <Clock className="h-5 w-5 text-danger" />
              </div>
              <h3 className="text-lg font-bold text-text">
                1. Forced 15-minute minimums waste your hard-earned balance
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Most blockers force you to spend 15 minutes at a time just to
                answer a single message or check a link a friend sent. You
                either burn 15 credits on a 45-second check or stay on the feed
                because the clock is already paid for.
              </p>
            </div>
            <div className="rounded-card bg-surface border border-border p-6 space-y-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-pill bg-surface-elevated border border-border">
                <Smartphone className="h-5 w-5 text-warning" />
              </div>
              <h3 className="text-lg font-bold text-text">
                2. Glowing screens that stop counting when you lock your phone
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Keeping your display awake on your desk just to keep a focus
                timer alive drains your battery and pulls your eyes back to your
                phone. And when you are in deep study flow, guessing a fixed
                countdown length upfront gets in the way.
              </p>
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS */}
        <section id="how-it-works" className="space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              How It Works
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text">
              Three steps to turn focus into spendable attention currency
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Lock Distracting Apps",
                body: "Select the social, video, and game feeds that drain your day. Android's System Overlay Shield blocks them whenever your unlocked time is 0m.",
              },
              {
                step: "02",
                title: "Bank Focus Credits",
                body: "Start a fixed timer or an open-ended ∞ Stopwatch and lock your phone screen. Every focused minute deposits +1.00 Credit onto your Recover Card.",
              },
              {
                step: "03",
                title: "Spend by the Minute",
                body: "Withdraw 1m, 5m, or 15m when you want a break. Done checking early? Tap Re-lock & Refund to return unused whole minutes back to your card.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-card bg-surface border border-border p-6 space-y-3"
              >
                <span className="font-mono text-sm font-bold text-accent">
                  STEP {item.step}
                </span>
                <h3 className="text-lg font-bold text-text">{item.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. FEATURES (LEADING WITH THE FIXES) */}
        <section id="features" className="space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              Built Around Real User Fixes
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text">
              Every annoyance fixed. Zero gamified bloat.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ title, description, Icon, badge }) => (
              <div
                key={title}
                className="rounded-card bg-surface border border-border p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-pill bg-surface-elevated border border-border flex items-center justify-center">
                      <Icon className="h-4 w-4 text-accent" />
                    </div>
                    <span className="rounded-pill bg-surface-elevated border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase text-text-muted">
                      {badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-text">{title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. PRICING */}
        <section id="pricing" className="space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              Transparent Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text">
              Free forever with calm native ads, or upgrade to Recover Pro
            </h2>
            <p className="text-sm text-text-muted">
              One-click cancellation in settings. No forced trial traps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1: Daily Focuser */}
            <div className="rounded-card bg-surface border border-border p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="font-mono text-xs uppercase text-text-muted">
                  Daily Focuser
                </span>
                <p className="text-3xl font-bold text-text">$0</p>
                <p className="text-xs text-text-muted">
                  Free forever • Supported by 3 non-intrusive dark native ad
                  slots
                </p>
                <ul className="space-y-2 pt-3 text-xs text-text">
                  {[
                    "Unlimited Focus Sessions & ∞ Open Stopwatch",
                    "Screen-Off Background Sessions",
                    "1-Minute Withdrawals & Early Re-Lock Refunds",
                    "Silent Haptic Completion Toggle",
                    "7 Metallic, Circuit, Weave & Urban Card Skins",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-success shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/"
                className="w-full rounded-pill bg-surface-elevated border border-border py-3 text-center text-xs font-semibold text-text hover:border-border-input"
              >
                Start on Free Plan
              </Link>
            </div>

            {/* Tier 2: Recover Pro */}
            <div className="rounded-card bg-surface-elevated border-2 border-accent p-6 flex flex-col justify-between space-y-6 shadow-card">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase text-accent font-semibold">
                    Recover Pro
                  </span>
                  <span className="rounded-pill bg-accent px-2.5 py-0.5 font-mono text-[10px] font-bold text-on-accent">
                    SAVE 48% ANNUALLY
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-text">$24.99</p>
                  <span className="text-xs text-text-muted">
                    / year ($2.08/mo) or $3.99/mo
                  </span>
                </div>
                <p className="text-xs text-text-muted">
                  For deep students & developers who want zero ads and hardware
                  guards
                </p>
                <ul className="space-y-2 pt-3 text-xs text-text">
                  {[
                    "Removes all 3 ad placements immediately",
                    "Unlock all 11 Card Studio finishes",
                    "Custom Credit-to-Minute exchange rates (0.5x to 5x)",
                    "AR Lock Box Vault & Strict Accelerometer Guard",
                    "Android Device Guard uninstall protection",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-accent shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/?screen=S03"
                className="w-full rounded-pill bg-accent py-3 text-center text-xs font-semibold text-on-accent"
              >
                Upgrade to Recover Pro
              </Link>
            </div>

            {/* Tier 3: Founding Cardholder */}
            <div className="rounded-card bg-surface border border-border p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="font-mono text-xs uppercase text-warning">
                  Founding Cardholder
                </span>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-text">$39.99</p>
                  <span className="text-xs text-text-muted">one-time</span>
                </div>
                <p className="text-xs text-text-muted">
                  Pay once, own Recover Pro forever with zero recurring bills
                </p>
                <ul className="space-y-2 pt-3 text-xs text-text">
                  {[
                    "Permanent lifetime Ad-Free Recover Pro access",
                    "All current & future Card Studio collections",
                    "All hardware anti-cheat & biometric locks",
                    "Founding Cardholder emblem on leaderboards",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-warning shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/?screen=S03"
                className="w-full rounded-pill bg-surface-elevated border border-border py-3 text-center text-xs font-semibold text-text hover:border-border-input"
              >
                Claim Lifetime Vault Pass
              </Link>
            </div>
          </div>
        </section>

        {/* 6. FAQ */}
        <section className="space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text">
              Common questions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map(({ q, a }) => (
              <div
                key={q}
                className="rounded-card bg-surface border border-border p-5 space-y-2"
              >
                <h3 className="text-sm font-bold text-text">{q}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. FINAL CTA */}
        <section className="rounded-sheet bg-surface-elevated border border-border p-8 text-center space-y-4">
          <RecoverIcon className="mx-auto h-8 w-11 text-accent" />
          <h2 className="text-2xl sm:text-3xl font-bold text-text">
            Stop trusting soft app limits. Start banking your attention.
          </h2>
          <p className="text-sm text-text-muted max-w-md mx-auto">
            Open your Recover Card in 30 seconds and take back control of your
            daily screen time.
          </p>
          <div className="pt-2">
            <Link
              href="/?screen=S01"
              className="inline-flex rounded-pill bg-accent px-8 py-3.5 text-base font-semibold text-on-accent shadow-surface"
            >
              Activate Your Recover Card
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-6 text-center text-xs text-text-muted space-y-2">
        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="hover:text-text">
            Wallet App
          </Link>
          <Link href="/design" className="hover:text-text">
            Design System
          </Link>
          <Link href="/privacy" className="hover:text-text">
            Privacy Policy & Terms
          </Link>
        </div>
        <p>© 2026 Recover (recoverwallet.vercel.app). All rights reserved.</p>
      </footer>
    </div>
  );
}
