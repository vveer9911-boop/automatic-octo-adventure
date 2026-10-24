# Launch Plan — Recover (`/replica-launch`)

- **Target Live Subdomain**: `https://recoverwallet.vercel.app`
- **Target Android Package**: `app.recoverwallet.android`

---

## 1. Pre-Launch Checklist: Waitlist, Closed APK Track & Telemetry

1. **Waitlist & Android Closed Testing Track**:
   - Google Play requires personal developer accounts to run a **14-day closed test with at least 12 opted-in testers** before production Play Store release.
   - Distribute the signed Capacitor Android APK (`app-release.apk`) directly via `https://recoverwallet.vercel.app/launch` for immediate sideloading while onboarding the first 20 beta testers into the Google Play Closed Testing track.
2. **Privacy-Safe Error Tracking & Telemetry**:
   - Configure Vercel Web Analytics + Sentry boundary reporting (scrubbing all PII and never logging local package names from `UsageStatsManager`).
   - Verify `/api/webhooks/stripe` and `/api/wallet` 5xx alert notifications before posting publicly.
3. **Store Assets & Review Notes Prepared**:
   - **App Icon**: [`public/brand/app-icon-1024.png`](file:///c:/Users/DELL/Downloads/anti%20gravity/replica/public/brand/app-icon-1024.png) (`1024×1024` RGB, no alpha).
   - **Screenshots**: Captured from [`replica/clone-screens/`](file:///c:/Users/DELL/Downloads/anti%20gravity/replica/replica/clone-screens) (`S04`, `S06`, `S09`, `S13`, `S14`, `S15`) highlighting the fixes in the first 3 frames (1-minute withdrawal keypad, Screen-Off + Open-Ended Stopwatch focus mode, and custom Recover Card Studio).
   - **Privacy Policy URL**: `https://recoverwallet.vercel.app/privacy`
   - **App Review Demo Account**: `student1@example.test` (pre-seeded with `15.00 credits` so store reviewers can immediately test 1-minute withdrawals, early re-lock refunds, and Card Studio without waiting 15 minutes).

---

## 2. Communities Where Unhappy Screen-Time Blocker Users Talk

Based on our research in [`replica/feedback.md`](file:///c:/Users/DELL/Downloads/anti%20gravity/replica/replica/feedback.md) and [`replica/fixes.md`](file:///c:/Users/DELL/Downloads/anti%20gravity/replica/replica/fixes.md):

1. **Reddit Communities**:
   - `r/nosurf` — Threads comparing Android app blockers where users complain about bypassing soft timers and battery drain from screen-on timers.
   - `r/ADHD` & `r/ADHD_Programmers` — Discussions on time-blindness, open-ended flow states (why fixed Pomodoro alarms break hyperfocus), and micro-rewards.
   - `r/getdisciplined` & `r/studytips` — Students looking for Android alternatives to iOS-only screen-time wallets.
   - `r/androidapps` — Weekly "Show Off Saturday" / new utility app threads.
2. **Hacker News (`Show HN`)**:
   - Developers who care about local-first Android privacy (`UsageStatsManager` staying on-device), double-entry integer credit ledgers, and non-predatory pricing (`$0` free tier + optional `$39.99` lifetime).

---

## 3. Launch Posts (Leading with the Fixes, Zero Mention of Original Name)

### A. Hacker News (`Show HN`) Draft
- **Title**: `Show HN: Recover – A screen-time credit wallet for Android (bank focus with screen off, spend by the minute)`
- **Body**:
  > Hi HN,
  >
  > Standard screen-time timers never worked for me because tapping "Ignore for 15 minutes" takes zero effort when you're tired. I liked the idea of a screen-time wallet where you earn credits by focusing and spend them to unlock distracting apps, but existing options were either iOS-only, forced you to keep your screen unlocked while focusing, or made you spend a 15-minute minimum just to reply to a single message.
  >
  > So I built **Recover** (`https://recoverwallet.vercel.app`):
  > - **Screen-off focus sessions**: Runs in an Android foreground service so you can lock your phone, save battery, and still earn 1 credit per focused minute.
  > - **Open-ended stopwatch mode (`∞ Open`)**: If you're in flow and don't want a fixed timer cutting you off, count up and bank your exact elapsed minutes when you finish.
  > - **1-minute micro-withdrawals + instant early refunds**: Unlock apps for 1 minute to answer a text, or tap "Re-lock & Refund" early to return unused whole minutes to your card.
  > - **Silent haptic completion**: Vibrates without interrupting your music or audio stream.
  > - **On-device privacy**: App detection (`UsageStatsManager`) runs locally on Android and is never uploaded.
  >
  > The core wallet is free (supported by 3 non-intrusive dark native ad slots), with an optional Pro upgrade (`$3.99/mo`, `$24.99/yr`, or `$39.99` lifetime). You can try the interactive web wallet and Card Studio directly at `https://recoverwallet.vercel.app`. Would love your feedback on the credit economy and anti-cheat guards!

### B. Product Hunt Launch Draft
- **Tagline**: `Turn focus into spendable screen time—by the single minute.`
- **First Comment (Maker Note)**:
  > Hey Product Hunt! 👋
  >
  > We built **Recover** for students, developers, and anyone who has ever tapped "Ignore Limit" on a standard app blocker.
  >
  > Instead of soft daily limits, Recover gives you a metallic credit card for your attention. Distracting apps stay locked at `0m`. Every minute you focus deposits Credits onto your card—and we built it around the 4 fixes users asked for most:
  > 1. **Lock your screen while focusing** (no glowing screen draining your battery).
  > 2. **Open-ended stopwatch mode** (`∞ Open`) for deep study blocks without a preset countdown.
  > 3. **1-minute micro-withdrawals & early re-lock refunds** so you never waste 15 credits on a 60-second reply.
  > 4. **Silent haptic completion** so a timer chime never interrupts your study playlist.

---

## 4. Finding & Talking to the First 10 Users by Hand

1. **Users 1–4 (Android Students in `r/studytips` & `r/getdisciplined`)**:
   - Reply to recent posts asking for Android equivalents of iOS focus wallets. Offer a personal Founding Cardholder lifetime unlock in exchange for a 15-minute screen-share onboarding session.
2. **Users 5–7 (Developers & Music-Listening Study Users in `r/ADHD_Programmers`)**:
   - Reach out to commenters who complained about Pomodoro alarms breaking hyperfocus and music playback; ask them to test the **`∞ Open` Stopwatch** + **Silent Haptic Completion** flow for 3 days.
3. **Users 8–10 (Short-Check Social Users in `r/nosurf`)**:
   - Invite users trying to cut Instagram/TikTok Reels who still need 1-minute DM replies to test the **1m Withdrawal + Re-lock & Refund** loop and report whether the `1 cr = 1 min` default exchange rate feels too loose or just right.
