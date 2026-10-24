# Build Log (`replica/build-log.md`)

Generated and maintained by `/replica-build`.

| Screen ID | Screen Name | Date | Status | Notes / What Was Built |
| :--- | :--- | :--- | :--- | :--- |
| `Shell` | Mobile App Shell + Bottom Nav + Capacitor Bridge | 2026-10-24 | `done` | Built `AppShell.tsx`, `wallet-store.tsx`, `android-bridge.ts`, and `ScreenTimeWalletPlugin.kt`. Wired `tokens.css` with zero raw hex values. |
| `S01` | Onboarding Habit Survey & Pitch | 2026-10-24 | `done` | Built 2-question habit diagnostic and Focus-to-Earn explanation in `OnboardingSurveyScreen`. |
| `S02` | Android Permissions & Initial Block Setup | 2026-10-24 | `done` | Built permission toggles (`PACKAGE_USAGE_STATS`, `SYSTEM_ALERT_WINDOW`, `DeviceAdmin`) + initial app selector in `PermissionsSetupScreen`. |
| `S03` | Premium Paywall Sheet (`Remove Ads`) | 2026-10-24 | `done` | Built Free (ad-supported) vs. Pro (ad-free) comparison and instant upgrade toggle in `PaywallScreen`. |
| `S04` | Wallet Home (`Focus Wallet`) | 2026-10-24 | `done` | Built hero `FocusCard`, `Transactions` / `Withdraw` / `Card Studio` circular buttons (Spend Limit removed), active unlock countdown with `Re-lock & Refund`, and `dashboard-compact` free-tier ad slot. |
| `S05` | Focus Session Setup Sheet | 2026-10-24 | `done` | Built duration picker (`1m`–`60m`), credit payout calculator, and 4 verification modes (`Screen-Off`, `Motion Guard`, `AR Vault`, `Standard`). |
| `S06` | Active Focus Session (`Earning screen time...`) | 2026-10-24 | `done` | Built top `focus-top-pill` free-tier ad banner (replacing coupon banner), giant countdown timer, live-ticking `FocusCard`, accelerometer motion warnings, and monotonic clock tamper check. |
| `S07` | AR Lock Box Vault | 2026-10-24 | `done` | Built camera feed (`getUserMedia`) + 3D spatial vault sealing animation with fallback when camera permission is unavailable. |
| `S08` | Session Complete Summary & Post-Focus Ad | 2026-10-24 | `done` | Built session outcome summary (`+credits` deposited or motion/clock forfeit) + `post-session-card` free-tier ad placement. |
| `S09` | Withdraw Screen Time (`Withdraw`) | 2026-10-24 | `done` | Built 1-minute minimum withdrawal, quick duration pills (`1m`–`2h`), 3x4 numeric keypad, balance validation, and biometric fingerprint modal. |
| `S10` | Block List & Android App Shield Overlay | 2026-10-24 | `done` | Built category filters, custom domain blocker input, app lock switches, and full-screen Android System Overlay Shield when unlocked time is `0m`. |
| `S11` | *(Skipped)* Daily Spending Limit | 2026-10-24 | `skip` | Explicitly skipped per user request. |
| `S12` | Bank-Statement Transaction History | 2026-10-24 | `done` | Built `All` / `Earned` / `Spent` filter tabs, summary header, and chronological ledger rows without Focus Score. |
| `S13` | Card Studio (`Design Your Card`) | 2026-10-24 | `done` | Built 11 procedural CSS/SVG card skins across `Circuit`, `Weave`, `Urban`, and `Metal` collections + embossed goal label editor. |
| `S14` | System & Anti-Cheat Settings | 2026-10-24 | `done` | Built hero card banner, Uninstall Protection toggle (locked while blocks are active without an unlock), Biometric toggle, Motion Guard toggle, and Exchange Rate selector. |
| `S15` | Weekly Global & Friends Leaderboard | 2026-10-24 | `done` | Built `Global` / `Friends` tabs, Weekly Tournament summary card (`#939 Global rank`), ranked rows with mini `FocusCard` badges, and `Add Friend` sheet. |
| `S16` | Android Home Widget & Ongoing Notification | 2026-10-24 | `done` | Built interactive 4x2 Android Home Screen Widget preview and Foreground Service Lock-Screen Notification with quick `Re-lock Now & Refund`. |
