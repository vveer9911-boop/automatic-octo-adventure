# Landing Page Specification — Recover (`/replica-launch`)

Built live in the application at [`src/app/launch/page.tsx`](file:///c:/Users/DELL/Downloads/anti%20gravity/replica/src/app/launch/page.tsx) (`/launch`).
All copy uses the **Recover** brand voice (*Kinetic, not preachy; Fintech-crisp, not gamified; Accountable, not punitive*) and tokens from [`replica/design/tokens.css`](file:///c:/Users/DELL/Downloads/anti%20gravity/replica/replica/design/tokens.css) (`17 pairs, 0 failing AA`).

> **Strict Integrity Compliance**: Zero fake testimonials, zero invented user counts or star ratings, zero reviewer quotes repurposed as marketing blurbs, and zero mention of the original app's name.

---

## Section 1: Hero
- **Eyebrow Badge**: `RECOVER FOR ANDROID & WEB • SCREEN TIME CREDIT WALLET`
- **Headline**: **Earn your screen time on Android. Lock your phone, study in peace, spend by the minute.**
- **Subhead**: Distracting apps stay locked by default. Bank Credits on your metallic Recover Card with your screen off, and withdraw as little as 1 minute when you only need to reply to a friend.
- **Primary Button**: **Open Recover Wallet** (`href="/"`) + Secondary Link: **View Interactive Card Studio** (`href="/?screen=S13"`)
- **Product Visual**: Real interactive `<FocusCard />` component displaying the **Recover** 3-wing `R` icon, `RECOVER` wordmark, `15 credits = 15m screen time`, and laser-etched EMV chip.

---

## Section 2: The Problem (Paraphrased from Top 2 User Pain Themes)
- **Heading**: **Why standard app timers and rigid wallets break down in real life**
- **Problem 1 — Forced 15-Minute Minimums Waste Your Balance**:
  Most blockers force you to unlock 15 minutes at a time just to answer a single text or check a link a friend sent. You either burn 15 hard-earned minutes on a 45-second reply or end up doomscrolling because the timer is already running.
- **Problem 2 — Glowing Screens That Stop Counting When You Lock Your Phone**:
  Keeping your display awake on your desk just to keep a focus timer alive drains your battery and pulls your eyes back to your phone. And if you study in open-ended flow, guessing a fixed countdown length before you start adds unnecessary friction.

---

## Section 3: How It Works (3 Steps from the Core Flow)
1. **1. Lock Your Distracting Feeds**: Choose the social, video, and gaming apps that drain your day. Android's System Overlay Shield blocks them whenever your unlocked time is `0m`.
2. **2. Bank Focus Credits (Screen-Off or Stopwatch)**: Run a fixed timer or an open-ended `∞ Open` stopwatch with your phone screen locked. Every focused minute deposits `+1.00 Credit` straight onto your Recover Card.
3. **3. Spend by the Minute & Refund What You Don't Use**: Withdraw `1m`, `5m`, or `15m` from your card balance. Finished checking early? Tap **Re-lock & Refund** to credit unused whole minutes back to your card.

---

## Section 4: Features (Leading with the Fixes from `replica/fixes.md`)
1. **1-Minute Micro-Withdrawals & Early Refunds**: Spend a single Credit for a 60-second check, and reclaim unused whole minutes with one tap.
2. **True Screen-Off Background Sessions**: Lock your phone and put it face-down—our Android Foreground Service tallies your Credits without draining your OLED battery.
3. **Open-Ended Stopwatch Mode (`∞ Open`)**: Start working without guessing a duration upfront. Tap **Finish & Bank Credits** whenever your deep-work block naturally ends.
4. **Silent Haptic Completion Toggle**: Finish a focus session with a clean wrist/phone vibration that never interrupts your study music or headphones.
5. **Hardware-Enforced Anti-Cheat**: Optional accelerometer motion guard (picking up the phone forfeits the session), AR Lock Box camera vault, biometric fingerprint withdrawals, and Android Device Guard uninstall protection.
6. **11 Custom Card Finishes & Double-Entry Statement**: Customize your embossed goal label across Brushed Metal, Circuit, Weave, and Urban finishes, and audit every credit in a chronological bank statement.

---

## Section 5: Pricing (3 Transparent Tiers)
- **Daily Focuser (`$0 Forever`)**: Full wallet, 1-minute withdrawals, screen-off sessions, open-ended stopwatch, 7 card skins, supported by 3 calm dark native ad slots.
- **Recover Pro (`$3.99/mo` or `$24.99/yr`)**: Removes all 3 ad placements, unlocks all 11 card finishes, custom exchange rates (`0.5x`–`5x`), AR Lock Box Vault, and Device Guard uninstall protection.
- **Founding Cardholder (`$39.99 One-Time`)**: Lifetime unlock of all Recover Pro features with zero recurring bills.

---

## Section 6: FAQ (Real Objections)
- **Does Recover upload my app usage history to a server?**
  No. Android `UsageStatsManager` checks and app block rules execute locally on your device. Only your encrypted credit balance, ledger, and optional leaderboard handle sync when signed in.
- **What happens if I unlock 15 minutes of Instagram and close it after 2 minutes?**
  Tap **Re-lock & Refund** on the home screen banner. Recover immediately re-arms the app shield and refunds the remaining 13 unused whole minutes back to your card balance.
- **Will the focus timer stop if I lock my phone screen or listen to music?**
  No. Screen-Off mode runs inside an Android Foreground Service so you can lock your phone completely, and the **Silent (Haptic Only)** completion toggle ensures your music never pauses or ducks when a session finishes.
- **Why are there 3 small native ads on the free plan?**
  Instead of locking the app behind a forced 7-day trial paywall, three dark-themed native ad slots (top focus pill, post-session summary, and compact dashboard card) keep the core wallet free forever. Upgrading to Recover Pro removes all ads instantly.
- **How do I cancel Recover Pro?**
  Tap **Cancel Subscription** inside **Recover Guard → Account, Billing & Privacy** for one-click cancellation at the end of your current period.

---

## Section 7: Final Call to Action
- **Headline**: **Stop trusting soft app limits. Start banking your attention.**
- **Primary Button**: **Activate Your Recover Card** (`href="/?screen=S01"`)
