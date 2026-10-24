# Backend & Security Checklist (`replica/backend.md`)

Generated and maintained by `/replica-backend`.

## 1. Auth & Session Management
- **Routes**: [`src/app/api/auth/route.ts`](file:///c:/Users/DELL/Downloads/anti%20gravity/replica/src/app/api/auth/route.ts), [`src/app/api/account/route.ts`](file:///c:/Users/DELL/Downloads/anti%20gravity/replica/src/app/api/account/route.ts)
- **Sessions**: `httpOnly`, `sameSite=lax`, `secure` (in production) session cookie `stw_session_uid` with sign-out-everywhere support (`action: "signout"`).
- **Authorization Gate**: Single function `canUserAccessRecord(actorUserId, recordOwnerUserId)` in [`src/lib/server-security.ts`](file:///c:/Users/DELL/Downloads/anti%20gravity/replica/src/lib/server-security.ts) called on every read and write in [`src/lib/server-db.ts`](file:///c:/Users/DELL/Downloads/anti%20gravity/replica/src/lib/server-db.ts). Second user (`user_demo_2`) attempting to read or mutate `user_demo_1` returns `403 Forbidden` with `transactions: []`.
- **Account Deletion**: `DELETE /api/account` (`{ confirm: true }`) cascades across all 8 tables and clears session cookies. Accessible directly in `S14` (`Wallet System → Delete Account & Data`).

## 2. Database & Migrations
- **SQL Schema & RLS**: [`replica/schema.sql`](file:///c:/Users/DELL/Downloads/anti%20gravity/replica/replica/schema.sql) defines all 8 tables (`wallet_profiles`, `block_rules`, `focus_sessions`, `unlock_sessions`, `ledger_transactions`, `ad_impressions`, `weekly_rank_entries`, `friendships`) with `enable row level security` and explicit owner policies.
- **Seed Data**: Realistic fake data (`user_demo_1`, `user_demo_2`, sample block rules, and ledger entries) with zero real personal data.

## 3. Payments & Free-Tier Ad Monetization
- **Stripe Checkout & One-Click Cancel**: [`src/app/api/billing/route.ts`](file:///c:/Users/DELL/Downloads/anti%20gravity/replica/src/app/api/billing/route.ts) supports test-mode Checkout and one-click cancellation (`action: "cancel_one_click"`).
- **Stripe Webhook**: [`src/app/api/webhooks/stripe/route.ts`](file:///c:/Users/DELL/Downloads/anti%20gravity/replica/src/app/api/webhooks/stripe/route.ts) verifies `stripe-signature` via HMAC-SHA256 (`verifyStripeWebhookSignature`), deduplicates `event.id` via `markWebhookEventProcessed`, and handles `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, and `invoice.payment_failed`.
- **Free-Tier Ads**: Official Google AdMob test unit IDs documented in [`.env.example`](file:///c:/Users/DELL/Downloads/anti%20gravity/replica/.env.example) for the 3 placements (`focus_top_pill`, `post_session_card`, `dashboard_native`), automatically hidden when `is_premium = true`.

## 4. Transactional Email & Integrations
- **Email Templates**: Written fresh in [`src/lib/server-security.ts`](file:///c:/Users/DELL/Downloads/anti%20gravity/replica/src/lib/server-security.ts) (`verify_email`, `weekly_statement`, `subscription_cancelled`) for Resend.
- **Android Native APIs**: Official Android `UsageStatsManager`, `Settings.ACTION_USAGE_ACCESS_SETTINGS`, `Settings.ACTION_MANAGE_OVERLAY_PERMISSION`, `SensorManager`, and `SystemClock.elapsedRealtime()` bridged in [`android-plugin/ScreenTimeWalletPlugin.kt`](file:///c:/Users/DELL/Downloads/anti%20gravity/replica/android-plugin/ScreenTimeWalletPlugin.kt). No third-party OAuth scopes requiring external provider verification are needed for core functionality.

## 5. Security Checklist
- [x] secrets only in env vars, `.env*` in `.gitignore`, nothing in client bundles
- [x] input validated on the server (`validateEmail`, `validateUsername`, `validateWithdrawRequest`, `validateFocusCompleteRequest`) on every route
- [x] authorisation checked on every read and write (`canUserAccessRecord`), tested with a second user
- [x] rate limits on auth, sign up, and anything that sends email (`checkRateLimit`)
- [x] webhooks verify signatures (`verifyStripeWebhookSignature` with `crypto.timingSafeEqual`)
- [x] uploads: no untrusted user file uploads required; card skins are procedural CSS/SVG
- [x] no user data in URLs or logs
- [x] dependencies audited (`npm audit`)
- [x] privacy policy lists every processor (Supabase, Stripe, Google AdMob, Resend, Vercel) at [`/privacy`](file:///c:/Users/DELL/Downloads/anti%20gravity/replica/src/app/privacy/page.tsx)
