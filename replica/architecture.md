# Architecture: Screen Time Wallet APK (a clean-room rebuild of Regrind's core features)

## Stack

| layer | choice | why |
| --- | --- | --- |
| mobile APK runtime | Capacitor 6 (`@capacitor/android`) + Next.js (App Router, static/hybrid bundle) + TypeScript | Packages a single TypeScript codebase into a native Android `.apk` with Kotlin bridges while running identically in Chromium for Playwright E2E and `imgdiff.py` layout verification |
| styling | Tailwind CSS + CSS Custom Properties (`tokens.css` from `replica-design`) | Zero raw hex values in components; allows instant theme and rebrand swaps in `replica-brand` |
| native Android bridges | Custom Kotlin Capacitor plugin (`ScreenTimeWalletPlugin`) wrapping `UsageStatsManager`, `SYSTEM_ALERT_WINDOW` / `AccessibilityService`, `DevicePolicyManager`, `SensorManager`, `BiometricPrompt`, and `AppWidgetProvider` | Provides real Android app usage detection, full-screen lock shield overlays, uninstall protection, accelerometer motion detection, fingerprint unlock, and home widgets (with browser simulation fallbacks for local E2E testing) |
| database | Postgres on Supabase (cloud sync + leaderboards) + local SQLite/IndexedDB mirror | Keeps block rules and credit ledger instant and offline-capable on the device while syncing ranks, friends, and backups to Postgres |
| ORM / query layer | Typed repository layer + Supabase JS client (SQL migrations in `replica/schema.sql`) | One clean data interface shared by offline local storage and Supabase Postgres |
| auth | Supabase Auth (Anonymous device session + optional Email / Google sign-in for Leaderboards) | Lets users start blocking and earning immediately without forced sign-up, then link an account for Global/Friends Ranks |
| ads (free tier) | Google AdMob (`@capacitor-community/admob`) + Dark Native Ad Card renderer (`NativeAdBannerCard`) | Serves the 3 balanced free-tier ad slots (`focus_top_pill` on `S06`, `post_session_card` on `S08`, `dashboard_native` on `S04`) and hides them automatically when `is_premium = true` |
| payments | Stripe Checkout / Billing (Web & APK link) + Google Play Billing hook | Handles one-click upgrade to Premium (removes ads + unlocks AR Vault, strict motion mode, and pro card finishes) |
| email | Resend | Transactional emails for account verification, weekly focus statements, and password resets |
| jobs | Supabase pg_cron / Vercel Cron + Android Foreground Service (`FocusTimerService`) | Foreground service keeps focus and unlock timers ticking when the screen is off; weekly cron resets the global leaderboard every Monday 00:00 UTC |
| hosting & APK build | Gradle (`./gradlew assembleRelease`) / GitHub Actions APK artifact + Vercel (web preview & API) | Produces a signed installable `.apk` alongside a live hosted web/API endpoint |

## Schema

Tables: **8** (`wallet_profiles`, `block_rules`, `focus_sessions`, `unlock_sessions`, `ledger_transactions`, `ad_impressions`, `weekly_rank_entries`, `friendships`).
Access rules: **Postgres Row Level Security (RLS)** enabled on all 8 tables (`auth.uid() = user_id`), with public read only on `weekly_rank_entries` for the leaderboard.

Key integrity constraints in [`replica/schema.sql`](file:///c:/Users/DELL/Downloads/anti%20gravity/replica/replica/schema.sql):
- **No floating-point drift**: Credits are stored as integer hundredths (`credit_balance_hundredths integer`, where `1500` = `15.00` credits) with `check (credit_balance_hundredths >= 0)`. Money is stored as `premium_plan_price_cents integer` + ISO `premium_plan_currency text`.
- **No double active sessions**: Partial unique indexes `idx_focus_sessions_one_active_per_user` and `idx_unlock_sessions_one_active_per_user` (`where status = 'active'`) guarantee a user can never run two focus sessions or two withdrawals simultaneously.
- **Idempotent ledger**: `ledger_transactions.idempotency_key text unique` prevents network retries from crediting a completed focus session twice or debiting a withdrawal twice.
- **UTC timestamps**: Every timestamp uses `timestamptz` stored in UTC.

```sql
-- Full DDL, indexes, triggers, and RLS policies are in replica/schema.sql
```

## API

### Flow F01: Onboarding & First Block Setup (`S01 -> S02 -> S03 -> S04`)

| method path | does | who | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `POST /api/onboarding/complete` | Creates `wallet_profiles` row, seeds initial `15.00` starting bonus in `ledger_transactions`, and saves initial `block_rules` | authenticated / device user | `{ surveyAnswers, selectedApps[], exchangeRateHundredths }` | `{ profile, blockRules, ledgerEntry }` | F01 |
| `POST /api/native/permissions` | Checks or requests Android `PACKAGE_USAGE_STATS`, `SYSTEM_ALERT_WINDOW`, and Notification permissions | local native bridge | `{ permissionType }` | `{ usageGranted, overlayGranted, notificationsGranted }` | F01 |
| `GET /api/paywall/plans` | Lists Free (ad-supported) vs. Premium (ad-free + strict modes) plans | any user | `{}` | `{ plans[] }` | F01 |

### Flow F02: Earn Credits via Focus Session + Free-Tier Ads (`S04 -> S05 -> S07 -> S06 -> S08 -> S04`)

| method path | does | who | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `POST /api/focus/start` | Starts a new `focus_sessions` row (`status='active'`), starts Android Foreground Service & accelerometer listener | owner (`user_id`) | `{ plannedDurationSec, mode }` | `{ session }` | F02 |
| `POST /api/focus/heartbeat` | Updates elapsed focus seconds, validates monotonic clock delta, and records motion warnings | owner (`user_id`) | `{ sessionId, elapsedSec, monotonicDeltaMs, motionPeakG }` | `{ session, liveCreditsHundredths, status }` | F02 |
| `POST /api/focus/complete` | Marks session `completed` (or `forfeited_motion`), writes `focus_earn` to `ledger_transactions`, increments `credit_balance_hundredths`, and updates `weekly_rank_entries` | owner (`user_id`) | `{ sessionId, actualDurationSec, idempotencyKey }` | `{ session, newBalanceHundredths, ledgerEntry }` | F02 |
| `POST /api/ads/impression` | Logs free-tier ad impression or click (`focus_top_pill` on `S06`, `post_session_card` on `S08`, `dashboard_native` on `S04`); returns `skip: true` for Premium users | owner (`user_id`) | `{ placement, adUnitId, focusSessionId?, clicked? }` | `{ recorded, showAd }` | F02 |

### Flow F03: Withdraw Credits to Unlock Apps & Early Re-lock (`S04 / S10 -> S09 -> S04`)

| method path | does | who | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `POST /api/withdraw/start` | Atomically verifies biometric flag & sufficient `credit_balance_hundredths`, debits credits (`withdraw_spend`), creates `unlock_sessions` (`requested_minutes >= 1`), and lifts Android app shield | owner (`user_id`) | `{ requestedMinutes, biometricVerified, idempotencyKey }` | `{ unlockSession, newBalanceHundredths, expiresAt }` | F03 |
| `POST /api/withdraw/relock` | Ends active `unlock_sessions` early (`relocked_early`), calculates unused whole/fractional minutes, refunds pro-rata credits (`relock_refund`), and re-engages Android app shield | owner (`user_id`) | `{ unlockSessionId, idempotencyKey }` | `{ refundedHundredths, newBalanceHundredths, unlockSession }` | F03 |
| `POST /api/withdraw/expire` | Marks expired `unlock_sessions` as `expired` and immediately re-enables the Android app lock shield | owner / background timer | `{ unlockSessionId }` | `{ unlockSession, shieldLocked: true }` | F03 |

### Flow F04: Configure Economy, Block List & Anti-Cheat Protections (`S04 -> S10 / S14`)

| method path | does | who | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `GET /api/blocks` | Lists all configured app, category, and domain `block_rules` plus current lock shield state | owner (`user_id`) | `{}` | `{ rules[], isUnlockedNow, activeUnlockExpiresAt }` | F04 |
| `PUT /api/blocks` | Adds, toggles, or removes app/category/domain `block_rules` (blocked if attempting to weaken rules during an active strict lock without withdrawing) | owner (`user_id`) | `{ targetType, packageOrDomain, displayName, category, isActive }` | `{ rule }` | F04 |
| `PATCH /api/settings/system` | Updates `exchange_rate_hundredths_per_min`, `uninstall_protection_enabled`, `biometric_withdraw_enabled`, and `motion_sensitivity` | owner (`user_id`) | `{ exchangeRateHundredths?, uninstallProtection?, biometricWithdraw?, motionSensitivity? }` | `{ profile }` | F04 |

### Flow F05: Customize Focus Card & Inspect Bank Ledger (`S04 -> S13 / S12`)

| method path | does | who | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `PATCH /api/wallet/card` | Updates `card_skin_id` (`Circuit`, `Weave`, `Urban`, `Metal`) and embossed `card_label` on `wallet_profiles` and `weekly_rank_entries` | owner (`user_id`) | `{ cardSkinId, cardLabel }` | `{ profile }` | F05 |
| `GET /api/wallet/transactions` | Returns paginated bank-statement `ledger_transactions` filtered by `all`, `earned`, or `spent` | owner (`user_id`) | `{ filter?: 'all' \| 'earned' \| 'spent', limit?, cursor? }` | `{ transactions[], totalEarnedHundredths, totalSpentHundredths }` | F05 |

### Flow F06: Global & Friends Weekly Leaderboard (`S04 -> S15`)

| method path | does | who | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `GET /api/ranks/weekly` | Returns top 100 global card holders or accepted friends for the current ISO week, caller's rank, and countdown to Monday 00:00 UTC reset | authenticated / guest user | `{ scope: 'global' \| 'friends' }` | `{ entries[], myRank, myFocusedSeconds, resetsInSeconds, weekRangeLabel }` | F06 |
| `POST /api/friends/add` | Sends or accepts a friend connection by username | authenticated user | `{ targetUsername }` | `{ friendship, friendProfile }` | F06 |
| `DELETE /api/account` | Permanently deletes user account and cascades all 8 tables (Google Play & GDPR requirement) | owner (`user_id`) | `{ confirm: true }` | `{ deleted: true }` | F06 |

Webhooks in:
- `POST /api/webhooks/stripe` — Verifies `stripe-signature`, handles `checkout.session.completed` and `customer.subscription.deleted`, sets `wallet_profiles.is_premium` (`true` removes all 3 ad placements and unlocks pro skins/modes).

Jobs:
- `weekly-leaderboard-reset` (`0 0 * * 1` — every Monday 00:00 UTC): Archives previous week's `weekly_rank_entries` snapshot and initializes the new week window.
- `expire-active-unlocks` (every 15 seconds on-device foreground service + server reconciliation on request): Transitions any `unlock_sessions` where `now() >= expires_at` to `expired` and raises the Android lock shield.

## The parts that bite

- **Time zones and daylight saving**: All timestamps (`started_at`, `expires_at`, `created_at`) are stored in UTC (`timestamptz`), while the weekly leaderboard resets on a fixed UTC boundary (Monday `00:00:00Z`) and durations (`planned_duration_sec`, `requested_minutes`) are computed from elapsed monotonic seconds so DST jumps never grant free unlock hours or erase focus sessions.
- **Idempotency**: Every credit mutation (`focus/complete`, `withdraw/start`, `withdraw/relock`, Stripe webhook) requires a unique `idempotency_key` in `ledger_transactions`; duplicate requests return the existing transaction without double-crediting or double-charging.
- **Race conditions**: Double-tapping "Withdraw" or starting two focus sessions in two tabs/activities is blocked at the database level by partial unique indexes (`where status = 'active'`) and atomic `update wallet_profiles set credit_balance_hundredths = credit_balance_hundredths - $cost where user_id = $uid and credit_balance_hundredths >= $cost`.
- **Monotonic clock tampering**: Users trying to advance their phone's system clock by 1 hour during a focus session are caught by comparing `Date.now()` delta against monotonic `performance.now()` / Android `SystemClock.elapsedRealtime()`; a drift > 120 seconds forfeits the session (`forfeited_clock_tamper`).
- **Ad placement balance & layout stability**: The 3 free-tier ad slots (`focus_top_pill` on `S06`, `post_session_card` on `S08`, `dashboard_native` on `S04`) reserve fixed-height containers (`min-h-[64px]` / `min-h-[96px]`) so ad loading never causes layout shift (CLS) or accidental taps on the `Give Up` or `Withdraw` buttons.
- **Android background kills & offline mode**: Active focus and unlock timers persist their state locally and run inside an Android Foreground Service notification (`S16`) so locking the screen (`Screen-Off Sessions`) or losing Wi-Fi never loses earned credits.
- **Uninstall protection lockout safety**: Android Device Admin / Accessibility protection (`S14`) automatically lifts while an active withdrawal has apps unlocked (`status = 'active'`) and provides an emergency recovery reset so a user never bricks their own phone.
- **Account & data deletion**: `DELETE /api/account` cascades across all 8 tables via `on delete cascade` and clears local device storage to satisfy Google Play Store Data Safety and GDPR rules.

## Build order

1. **Milestone 1 — Vertical Slice (The Core Wallet Loop + Free-Tier Ad Slots)**:
   - **Screens**: `S04` (Wallet Home with Focus Card + Dashboard Native Ad), `S05` (Focus Setup), `S06` (Active Focus Session with Top Native Ad Pill + live credit counter), `S08` (Session Complete Summary + Post-Focus Ad Card), `S09` (Withdraw Screen Time with 1m+ keypad & Early Re-lock Refund).
   - **Tables**: `wallet_profiles`, `focus_sessions`, `unlock_sessions`, `ledger_transactions`, `ad_impressions`.
   - **Routes**: `/api/focus/start`, `/api/focus/complete`, `/api/withdraw/start`, `/api/withdraw/relock`, `/api/ads/impression`.
2. **Milestone 2 — Remaining Must-Haves (Onboarding, Block List & Shield Overlay, Bank Ledger)**:
   - **Screens**: `S01` (Onboarding Survey), `S02` (Android Permissions & Initial Block Setup), `S10` (Block List & Full-Screen App Shield Overlay), `S12` (Itemized Bank-Statement Transaction History without Focus Score).
   - **Tables**: `block_rules`.
   - **Routes**: `/api/onboarding/complete`, `/api/native/permissions`, `/api/blocks`, `/api/wallet/transactions`.
3. **Milestone 3 — Should-Haves (Card Studio, Anti-Cheat Sensors, System Settings, Leaderboards)**:
   - **Screens**: `S13` (Card Customizer Studio: `Weave`, `Urban`, `Circuit`, `Metal` + custom label), `S14` (`Regrind System`: Uninstall Protection, Exchange Rate, Biometric Withdrawal Security, Accelerometer Motion Detection), `S15` (`Regrind Ranks`: Global & Friends Weekly Leaderboard).
   - **Tables**: `weekly_rank_entries`, `friendships`.
   - **Routes**: `/api/wallet/card`, `/api/settings/system`, `/api/ranks/weekly`, `/api/friends/add`.
4. **Milestone 4 — Could-Haves & APK Packaging (AR Lock Box, Paywall, Widget & Ongoing Notification)**:
   - **Screens**: `S03` (Premium Paywall removing ads & unlocking pro features), `S07` (Camera/AR Lock Box Vault), `S16` (Android Home Widget & Foreground Service Ongoing Notification) + Capacitor Android project (`android/`) ready for APK build.
   - **Routes**: `/api/paywall/plans`, `/api/webhooks/stripe`, `/api/account`.
5. **Milestone 5 — Fixes from `/replica-entrepreneur`**:
   - Improvements derived from real user complaints in public reviews once `/replica-entrepreneur` runs.
