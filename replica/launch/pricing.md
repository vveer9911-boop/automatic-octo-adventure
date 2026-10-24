# Pricing & Billing Specification — Recover (`/replica-launch`)

## 1. Category Pricing Benchmark (Read on `2026-10-24`)

| App | Platform | Free Tier | Monthly | Annual | Lifetime / One-Time | Source URL & Date Read |
| --- | --- | --- | --- | --- | --- | --- |
| **Original App** (`id6756532108`) | iOS only | Core timer + basic card; customization & anti-cheat gated | `$4.99 / mo` | `$29.99 / yr` | `$49.99` | [Apple App Store US listing](https://apps.apple.com/us/app/regrind-screen-time-wallet/id6756532108) (Read `2026-10-24`) |
| **Opal** | iOS, Android | Limited single daily session | `$19.99 / mo` | `$99.00 / yr` | `$399.00` | `https://www.opal.so/pricing` (Read `2026-10-24`) |
| **One Sec** | iOS, Android | 1 blocked app only | `$3.99 / mo` | `$19.99 / yr` | `$39.99` | `https://one-sec.app` (Read `2026-10-24`) |
| **ScreenZen** | iOS, Android | Donation-supported free tier | `$3.00 / mo` | `$25.00 / yr` | `$50.00` | `https://www.screenzen.co` (Read `2026-10-24`) |

---

## 2. What Reviewers Said About Price & Billing (`replica/feedback.md`)

From [`replica/feedback.md`](file:///c:/Users/DELL/Downloads/anti%20gravity/replica/replica/feedback.md) (`paywall_billing` theme: **7 reviews across 4 sources**, score `1.8`, avg `4.7★`):
- Users praised that core focus-to-earn mechanics worked without an upfront paywall (`app-store-us`, `2026-03-22`, `4★`; `app-store-de`, `2026-04-16`, `5★`).
- Users expressed frustration when basic card customization and extra block slots were locked behind recurring subscriptions (`app-store-us`, `2026-03-22`, `4★`: *"Only downside is that some customization features are locked behind pro, which is a bit annoying"*).

---

## 3. Recover Pricing Model (3 Tiers Named by Who They Are For)

Flat personal pricing (no per-seat complexity, no forced trial credit card traps):

| Tier | Who It Is For | Price | Included Features |
| --- | --- | --- | --- |
| **1. Daily Focuser** | Students & casual users who want a full screen-time wallet at `$0` | **`$0` forever** *(Supported by 3 non-intrusive dark native ad slots)* | • Unlimited focus sessions (Fixed countdown + `∞ Open` Stopwatch)<br>• Screen-Off background sessions<br>• 1-minute micro-withdrawals & early re-lock refunds<br>• Silent haptic completion toggle<br>• 7 free card skins (`Brushed Platinum`, `Obsidian Matte`, `Trace Carbon`, `Silicon Die`, `Graphite Twill`, `Cobalt Thread`, `Attention Currency`) + custom embossed card label<br>• 3 calm native ad placements (`focus-top-pill`, `post-session-card`, `dashboard-compact`) |
| **2. Recover Pro** | Deep students, developers & ADHD power users who want zero ads & hardware guards | **`$3.99 / month`** or **`$24.99 / year`** (`$2.08/mo` — ~5 months free) | • **Removes all 3 ad placements immediately**<br>• All 11 Card Studio skins (`Bus Hazard`, `Crimson Warp`, `Bullion Stamp`, `Turf Tag`)<br>• Custom Credit-to-Minute exchange rates (`0.5 cr/m` to `5 cr/m`)<br>• Hardware AR Lock Box Vault (`S07`) & strict Accelerometer Motion Guard<br>• Android Device Guard uninstall protection |
| **3. Founding Cardholder** | Users who hate recurring subscriptions | **`$39.99` one-time** | • Permanent lifetime unlock of all **Recover Pro** features & future card collections<br>• Founding Cardholder badge on weekly leaderboards |

---

## 4. Billing Complaint Fixes Built Into the Product

1. **Generous Free Tier Supported by 3 Calm Dark Native Ads**: Instead of crippling the app or forcing a 7-day hard paywall, free users get 7 card skins, custom embossed card labels, 1-minute withdrawals, screen-off sessions, and open-ended stopwatch sessions supported by 3 dark-themed native ad slots.
2. **One-Click Cancellation (`POST /api/billing`)**: Subscribers cancel in a single tap from **Recover Guard → Account, Billing & Privacy** (`cancel_at_period_end = true`) with zero retention mazes.
3. **Clear Renewal Reminder Emails**: Resend triggers an automated notice 7 days before annual renewal.

---

## 5. Stripe Products & Price Objects to Create

Create these 3 prices under a single Stripe Product (`prod_recover_pro` — **"Recover Pro Membership"**):

1. **`STRIPE_PRICE_PRO_MONTHLY`**:
   - Type: `recurring` (`interval: month`)
   - Amount: `399` (`$3.99 USD`)
   - Lookup Key: `recover_pro_monthly`
2. **`STRIPE_PRICE_PRO_ANNUAL`**:
   - Type: `recurring` (`interval: year`)
   - Amount: `2499` (`$24.99 USD`)
   - Lookup Key: `recover_pro_annual`
3. **`STRIPE_PRICE_PRO_LIFETIME`**:
   - Type: `one_time`
   - Amount: `3999` (`$39.99 USD`)
   - Lookup Key: `recover_pro_lifetime`
