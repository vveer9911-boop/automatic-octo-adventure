# Recon map: Regrind: Screen Time Wallet (iOS -> Android APK Clone)

Scope: Full Screen Time Wallet economy + Balanced Free-Tier Ad Placements + Social + Hardware/Sensor extras (Focus Card Wallet, Focus Sessions, Screen-Off Earning, Accelerometer Motion Detection, Camera/AR Lock Box, Top Focus-Session Ad Banner, Post-Focus Completion Ad Card, Dashboard Native Ad Slot, Credit Withdrawals with Biometrics & Early Re-lock Refund, App/Category/Website Block List & Android Shield Overlay, Uninstall Protection, Exchange Rate, Card Customizer Studio, Bank-style Transaction History, Friends & Global Leaderboards, Android Home Widget & Ongoing Foreground Notification). *Explicitly excluded per user direction: Focus Score, Daily Spend Limit, and Scratch Coupons.*
For: Niche consumer Android APK product (students, developers, and ADHD/focus-seekers — bringing an iOS-only screen-time wallet to Android with ad-supported free tier)
Date: 2026-10-24

## Sources

| # | source | URL | notes |
| --- | --- | --- | --- |
| 1 | App Store listing (IN/US) | https://apps.apple.com/in/app/regrind-screen-time-wallet/id6756532108 | Full feature list, v3.1.0 release notes (1-minute minimum withdrawal), onboarding stats, 7 reference screenshots saved in `replica/screens/appstore_1.png` to `appstore_7.png` |
| 2 | iTunes Lookup API metadata | https://itunes.apple.com/lookup?id=6756532108&country=in | Bundle ID `com.limit.screentime`, PlotPilot Ltd, v3.1.0, 4.29 avg rating, languages EN/FR/DE/IT/ES |
| 3 | Marketing site | https://www.regrind.app | Core positioning ("Your focus pays for your screen time", "Your bank for screen time control"), 1:1 credit-to-minute default exchange, early re-lock refunds, anti-cheat rules |
| 4 | Privacy policy | https://www.plotpilot.ai/products/regrind/privacy | Local on-device app usage/blocking data vs. authenticated profile data for Friends & Leaderboards |
| 5 | Standard EULA | https://www.apple.com/legal/internet-services/itunes/dev/stdeula/ | Terms of use for the original iOS app |

## Core loop

Distracting apps and websites stay locked by default; users complete timed focus sessions (with screen-off tracking, accelerometer motion detection, or an AR lock box) to earn Credits onto their Focus Card, then withdraw those Credits at a custom exchange rate to unlock screen time for fixed durations before apps automatically re-lock. Free users see three balanced, non-intrusive ad placements (top pill during focus sessions, post-session summary card, and a compact dashboard native card), which are removed on Premium.

## Screens

| ID | screen | route / how to reach | purpose | key components | states seen |
| --- | --- | --- | --- | --- | --- |
| S01 | Onboarding Survey & Value Pitch | `/onboarding/survey` (First launch) | Captures user's daily screen time habits (4+ hrs, doomscrolling, failed limits) and explains the Focus-to-Earn credit wallet | Progress bar, multi-choice habit cards, animated Focus Card preview, primary CTA button | empty, step-selected, completed |
| S02 | Android Permissions & Initial Block Setup | `/onboarding/permissions` (After S01) | Guides user through granting Android Usage Stats, Overlay/Accessibility blocker permission, and choosing initial locked apps | Permission status checklist cards, deep-link system settings buttons, app selector list, exchange rate preview | permission denied, partially granted, all granted, error |
| S03 | Premium Paywall Sheet | `/paywall` (After S02 or from Remove Ads / Pro features) | Presents Free (ad-supported) vs. Premium (ad-free, Uninstall Protection, AR Lock Box, Motion Detection, custom exchange rates, pro card skins) | Feature comparison list, Remove Ads highlight badge, plan selector pills, trial/unlock CTA, restore button | loading, filled, unlocked, error |
| S04 | Wallet Home (`Regrind Wallet`) | `/wallet` (Bottom Nav Tab 1 — ref `appstore_1.png`) | Main dashboard displaying the user's Focus Card, current Credit balance, equivalent screen time, quick actions, and a sleek native ad slot for free users | Top bar (Settings gear, title, Card Studio / Pro badge button), textured Focus Card with EMV chip & custom label, circular action buttons (`Transactions`, `Withdraw`, `Card Studio`), `Start Focus` CTA, Active Unlock banner, compact **Dashboard Native Ad Card** (free tier only) | zero balance (0 credits), positive balance (`15 credits = 15m`), active withdrawal countdown, free-tier ad visible vs. premium ad-free |
| S05 | Focus Session Setup Sheet | `/focus/setup` (Tap Start Focus on S04) | Configures focus duration and discipline mode before starting a session | Duration picker (15m, 25m, 45m, 60m, custom/open), Mode toggles (`Screen-Off`, `Motion Detection`, `AR Lock Box`), estimated credit payout | default, strict mode enabled, camera/sensor permission missing |
| S06 | Active Focus Session (`Earning screen time...`) | `/focus/active` (After S05 — ref `appstore_2.png`) | Counts down/up focus time, monitors device motion & screen-off state, streams earned fractional credits live, and shows top native ad pill for free users | **Top Native Ad Pill Banner** (in the exact top slot where "Your coupon is waiting..." was in `appstore_2.png`), large digital timer (`14:59`), status label (`Earning screen time...`), live-ticking Focus Card (`15.02 credits`), Give Up / Complete button | earning normal, motion warning shake alert, screen-off background earning, session failed/forfeited, ad loaded vs. premium hidden |
| S07 | AR Lock Box Vault | `/focus/ar-vault` (From S05 when AR mode selected) | Uses device camera + 3D/AR vault overlay to "lock" the phone in place before/during a focus session | Camera feed viewport, interactive 3D/AR metallic vault box reticle, "Tap to Lock Phone in Vault" trigger, lock animation | camera permission denied, scanning surface, vault locked, session active |
| S08 | Session Complete Summary & Post-Focus Ad | `/focus/complete` (When S06 timer finishes) | Celebrates earned credits deposited to the Focus Card and displays a post-session ad card for free users before returning to the dashboard | Earned credits summary (`+15.00 credits`), updated card balance preview, **Post-Focus Sponsored Ad Card / Interstitial Slot** (with clean dismiss or "Remove Ads" link), "Back to Wallet" CTA | session completed, ad displayed (free user), ad skipped (premium user) |
| S09 | Withdraw Screen Time (`Withdraw`) | `/withdraw` (Tap Withdraw on S04 — ref `appstore_3.png`) | Spends credits from balance to unlock blocked apps for a chosen duration (starting at 1 minute) | Close (`X`) & More (`...`) header with `Balance: 15 credits`, large minute readout (`15 min`), `Regrind Pay • 1 credit / minute` pill, quick-select pills (`1m`, `5m`, `15m`, `30m`, `1h`, `2h`, `4h`), custom numeric keypad (`0-9`, backspace), Biometric confirm trigger | valid duration, insufficient credits error, biometric prompt, active unlock with "Re-lock Early & Refund" state |
| S10 | Block List & App Shield Overlay | `/blocks` (Bottom Nav Tab 2 + Android System Overlay) | Selects which installed Android apps, categories, and website domains stay locked; renders full-screen lock shield when user opens a blocked app without active unlocked time | Search bar, Category chips (Social, Games, Video, Browsers), installed app rows with lock toggles, custom domain block list, full-screen Shield Overlay with "Locked by Wallet" + "Withdraw Time" button | empty block list, active blocks locked, temporary unlocked countdown, overlay triggered |
| S11 | *(Removed / Skipped)* Daily Spending Limit | `N/A` (Skipped per user request) | Previously capped daily unlocked minutes; intentionally removed to keep the credit wallet economy pure | N/A | skipped |
| S12 | Transaction History (`Transactions`) | `/wallet/transactions` (Tap Transactions on S04) | Itemizes every focus deposit, screen-time withdrawal, early re-lock refund, and motion penalty like a bank statement (without Focus Score) | Filter tabs (`All`, `Earned`, `Spent`), total earned/spent summary header, date-grouped ledger rows with `+` green / `-` neutral credit deltas | empty ledger, populated statement, filtered view |
| S13 | Card Customizer (`Design your card`) | `/wallet/card-studio` (Tap Focus Card or Customize on S04 — ref `appstore_6.png`) | Lets user customize their Focus Card's visual theme, finish, colourway, and embossed text label | Back button (`<`), horizontal skin carousels by collection (`Circuit`, `Weave`, `Urban`, `Brushed Metal`), live interactive card preview, custom label text input (`LOCK IN CARD`, `STUDY SEASON`, max 18 chars) | browsing skins, previewing locked skin, editing label, saved |
| S14 | System & Protection Settings (`Regrind System`) | `/settings/system` (Tap Settings gear on S04/S15 — ref `appstore_5.png`) | Configures anti-cheat protections and wallet economics | Hero card banner (`Set once. Stay focused.`), `Uninstall protection` toggle card, Exchange Rate selector (`0.5`, `1`, `2`, `5` credits/min), Biometric Withdrawal Security toggle, Motion Sensitivity selector, Account/Sign-in settings | protections off, protections active, locked during active block |
| S15 | Ranks & Friends Leaderboard (`Regrind Ranks`) | `/ranks` (Bottom Nav Tab 3 — ref `appstore_7.png`) | Weekly global and friends leaderboard ranking card holders by total focused time | Settings gear & Add Friend (`person+`) header, `Global` / `Friends` toggle, Weekly Tournament summary card (`Results • Top 100 card holders`, `Resets in 2d 3h`, `#Global rank` with laurel wreath, user's `Time`), ranked list rows (`#1`..`#100`) with mini custom Focus Card preview, username, and hours (`70h`, `53h 40m`) | signed out / local guest prompt, loading, Global leaderboard filled, Friends list empty/filled |
| S16 | Android Home Widget & Ongoing Notification | `system/widget-notification` (Android Home Screen & Notification Shade) | Displays Focus Card balance and active session/withdrawal timer directly on the Android Home Screen and Lock Screen notification shade | AppWidgetProvider card widget (Balance + Quick Focus / Withdraw buttons), Foreground Service ongoing notification with live countdown & "Re-lock Early" action | idle balance, active focus earning, active unlock countdown |

## Flows

```
F01 Onboarding & First Block Setup
    S01 -> S02 -> S03 -> S04
    happy path clicks: 7
    edge: user denies Android Usage Access or Overlay permission, user skips paywall (enters Free ad-supported tier), 0 apps selected

F02 Earn Credits via Focus Session (with Top Session Ad & Post-Session Ad for Free Users)
    S04 -> S05 -> (optional S07 AR Vault) -> S06 (Top Ad Pill shown for free users) -> S08 (Post-Session Ad shown for free users) -> S04
    happy path clicks: 5
    edge: user moves phone excessively with Motion Detection on (session forfeited), user locks screen (continues earning in background via foreground service), user cancels early, free user sees top focus ad & post-session ad while premium user sees zero ads

F03 Withdraw Credits to Unlock Apps & Early Re-lock Refund
    S04 (or S10 Shield Overlay) -> S09 -> Biometric Prompt -> S04 (Apps Unlocked) -> Early Re-lock or Auto-Expire
    happy path clicks: 4
    edge: withdraw 1m minimum, requested minutes exceed Credit balance, biometric auth fails, user taps "Re-lock Early" with 8m left (unused credits refunded to balance)

F04 Configure Economy & Anti-Cheat Protections (Exchange Rate, Uninstall Protection, Biometrics)
    S04 -> S14 (Uninstall Protection, Exchange Rate, Biometric Security) -> S04
    happy path clicks: 4
    edge: user tries to disable Uninstall Protection while blocks are locked

F05 Customize Focus Card & Inspect Bank Ledger
    S04 -> S13 (Select Weave/Urban skin + edit label) -> S04 -> S12 (Inspect Transactions)
    happy path clicks: 5
    edge: empty transaction history on day 1, long card label text truncation

F06 Compete on Global & Friends Weekly Leaderboard
    S04 -> S15 (Regrind Ranks) -> Toggle Global/Friends -> Add Friend modal
    happy path clicks: 4
    edge: offline/guest mode, weekly reset boundary (Sunday midnight UTC), friend code not found
```

## Components

| component | variants | states | used on |
| --- | --- | --- | --- |
| FocusCard | metallic, circuit, weave, urban (full-size & mini leaderboard badge) | default, live-ticking (2 decimal places), interactive tilt, locked-preview | S01, S04, S06, S13, S14, S15, S16 |
| NativeAdBannerCard | focus-top-pill (replaces coupon pill on S06), post-session-card (S08), dashboard-compact (S04) | loading, filled-ad, fallback-house-ad, hidden-for-premium | S04, S06, S08 |
| CircularIconButton | header-nav (gear, back, close, more, add-friend), action-bar (transactions, withdraw, card-studio) | default, pressed, disabled, active-badge | S04, S09, S13, S14, S15 |
| NumericKeypad | 3x4 grid (`1-9`, empty, `0`, backspace) + quick-duration pill bar (`1m`..`4h`) | default, key-pressed, limit-shake-error | S09 |
| AppBlockRow | app icon + title + category tag + lock switch | locked, unlocked-temporarily, excluded | S02, S10 |
| TransactionLedgerRow | icon + title + timestamp + credit delta (`+15.0` / `-15.0`) + running balance | deposit, withdrawal, refund, penalty | S12 |
| LeaderboardRow | rank number + mini FocusCard + username + formatted duration (`70h`, `53h 40m`) | top-3 highlight, current-user highlight, standard | S15 |
| ProtectionToggleCard | icon + title + subtitle + Android switch + footnote | off, on, locked-by-active-session | S14 |

## Inferred data model

```
WalletProfile      id, username, display_name, credit_balance (numeric 10,2),
                   exchange_rate_credits_per_min (numeric 5,2 default 1.0),
                   card_skin_id (text), card_label (text default 'LOCK IN CARD'),
                   uninstall_protection_enabled (bool), biometric_withdraw_enabled (bool),
                   motion_detection_enabled (bool), is_premium (bool default false), updated_at
                   evidence: S04 card balance & label, S09 exchange rate pill, S13 card studio, S14 system toggles
                   confidence: high

BlockRule          id, target_type ('app' | 'category' | 'domain'), package_or_domain (text),
                   display_name (text), category (text), is_active (bool), created_at
                   evidence: S02, S10, App Store description ("choose which apps, websites and whole categories stay locked")
                   confidence: high

FocusSession       id, user_id, mode ('standard' | 'screen_off' | 'motion_strict' | 'ar_vault'),
                   planned_duration_sec (int), actual_duration_sec (int),
                   status ('active' | 'completed' | 'forfeited_motion' | 'cancelled'),
                   credits_earned (numeric 10,2), started_at, ended_at
                   evidence: S05, S06 timer & 15.02 live credits, S07 AR Lock Box
                   confidence: high

UnlockSession      id, user_id, requested_minutes (int), credits_spent (numeric 10,2),
                   credits_refunded (numeric 10,2 default 0), status ('active' | 'expired' | 'relocked_early'),
                   started_at, expires_at, relocked_at
                   evidence: S09 Withdraw screen, v3.1.0 release notes (1m min withdrawal), website ("early re-lock refunds")
                   confidence: high

LedgerTransaction  id, user_id, type ('focus_earn' | 'withdraw_spend' | 'relock_refund' | 'motion_penalty' | 'starting_bonus'),
                   amount_credits (numeric 10,2), balance_after (numeric 10,2),
                   reference_id (uuid nullable), description (text), created_at
                   evidence: S04 Transactions button, S12 bank-statement history
                   confidence: high

AdImpression       id, user_id, placement ('focus_top_pill' | 'post_session_card' | 'dashboard_native'),
                   ad_network (text default 'admob'), clicked (bool default false), created_at
                   evidence: Custom free-tier monetization across S04, S06, and S08
                   confidence: high

WeeklyRankEntry    id, week_start_date (date), user_id, username, card_skin_id (text),
                   focused_seconds (int), global_rank (int), updated_at
                   evidence: S15 Regrind Ranks ("14 Sep - 20 Sep", "Resets in 2d 3h", "#939 Global rank", mini card + username + Time)
                   confidence: high

Friendship         id, user_id, friend_user_id, status ('pending' | 'accepted'), created_at
                   evidence: S15 Friends tab & Add Friend button
                   confidence: high
```

Relationships: `WalletProfile 1-n BlockRule`, `WalletProfile 1-n FocusSession`, `WalletProfile 1-n UnlockSession`, `WalletProfile 1-n LedgerTransaction`, `WalletProfile 1-n AdImpression`, `WalletProfile 1-n WeeklyRankEntry`, `WalletProfile n-n WalletProfile (via Friendship)`.

## Feature matrix

See `replica/features.csv`. Must (original): 11, Yours added (Ad placements): 3, Should: 6, Could: 5, Skip: 5 (including Daily Spend Limit, Scratch Coupons, and Focus Score).

## Out of scope (cannot or should not be cloned)

- **Removed per user product direction**:
  - **Focus Score** (removed to keep the credit wallet & bank ledger simple and direct)
  - **Daily Spend Limit & Radial Dial** (removed so users can spend whatever credits they earn)
  - **Scratch Coupons** (removed; the top focus-session banner and post-session screen now host the free-tier ad placements instead)
- **Apple's iOS-only `FamilyControls` / `ManagedSettings` / `DeviceActivity` APIs**: Replaced with Android's native `UsageStatsManager`, `AccessibilityService` / `SYSTEM_ALERT_WINDOW` app-shield overlay, and `DevicePolicyManager`.
- **Regrind's proprietary card artwork, brand logo, and existing user network**: Rebuilt clean-room with procedural SVG/Canvas card skins and our own backend.

## Size

Screens 15 active (`S11` skipped), flows 6, entities 8. Hard parts: Android native app blocking & foreground service lifecycle, accelerometer motion detection during focus, interactive camera/AR Lock Box vault, and native ad placements (`focus_top_pill`, `post_session_card`, `dashboard_native`). Size: M.
