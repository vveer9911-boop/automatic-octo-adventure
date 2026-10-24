# Test plan: Screen Time Wallet APK Clone

Build: v1.0.0  Date: 2026-10-24  Env: local (`http://localhost:3000`, 390x844 mobile viewport, seed data)

| case | flow | type | steps | expected | auto | result |
| --- | --- | --- | --- | --- | --- | --- |
| F01-H1 | Onboarding & First Block Setup | happy | Open `/?screen=S01`, answer habit quiz, advance to `S02` permissions, finish onboarding to `S04` | Wallet Home renders with `15 credits = 15m screen time`, 0 Axe a11y violations | e2e | pass |
| F01-E1 | Free-Tier Dashboard Ad & Removed Features Check | edge | Inspect `S04` Wallet Home as a free-tier user | `ad-dashboard-compact` is visible; removed `Spend Limit` and `Focus Score` do not appear anywhere | e2e | pass |
| F02-H1 | Earn Credits via Focus Session + Free-Tier Ads | happy | Tap `Start Focus Session` on `S04` -> `S05` -> `Begin Focus Session` -> `S06` -> fast-forward `+1m` -> `Finish & Deposit` -> `S08` -> `Back to Wallet` | Top `ad-focus-top-pill` replaces old coupon banner on `S06`; `ad-post-session-card` renders on `S08`; balance increases on `S04` | e2e | pass |
| F02-E1 | Screen-Off & AR Lock Box Vault Focus Modes | edge | Open `/?screen=S07`, seal phone in AR Vault -> transitions to `S06` active earning | AR Vault reticle seals and starts active focus timer cleanly | e2e | pass |
| F02-E2 | Accelerometer Motion Warning (1st shake) | edge | Start strict motion focus session on `S06`, trigger 1st motion spike | `motion-warning-banner` alert appears warning `(1/2)` without forfeiting session yet | e2e | pass |
| F02-N1 | Accelerometer Motion Forfeit (2nd shake) | negative | Trigger 2nd motion spike during strict motion focus session | Session forfeits immediately (`Session Forfeited (Phone Moved)`) and logs penalty in ledger | e2e | pass |
| F03-H1 | Withdraw Credits to Unlock Apps | happy | Open `S09`, pick `15m`, tap `Unlock Apps for 15 Minutes` | Balance deducts 15 credits, returns to `S04` with `active-unlock-banner` countdown | e2e | pass |
| F03-E1 | Early Re-lock & Pro-Rata Credit Refund | edge | While unlock countdown is active on `S04`, tap `Re-lock & Refund` | Unlock ends immediately, unused whole minutes are refunded to `FocusCard` balance, status toast shown | e2e | pass |
| F03-N1 | Reject Withdrawal Exceeding Credit Balance | negative | On `S09` with `15 credits` balance, select `2h` (`120m`) and tap confirm | Shows `Insufficient credits` alert error and blocks withdrawal | e2e | pass |
| F04-H1 | Block List & Android System Overlay Shield | happy | Open `S10` Block List, tap `Test App Shield` while unlocked time is `0m` | Full-screen `app-shield-overlay` blocks access with `Withdraw Credits to Unlock` & `Close App` actions | e2e | pass |
| F04-N1 | Uninstall Protection Guard While Blocks Are Locked | negative | Open `S14` System Settings while apps are locked and no withdrawal is active, attempt to toggle off `Uninstall protection` | Blocks toggle-off and displays `uninstall-guard-alert` warning | e2e | pass |
| F05-H1 | Card Studio Customizer & Clean Bank Ledger | happy | Open `S13`, edit embossed card label to `DEEP SPRINT`, save -> open `S12` Transactions | Card displays `DEEP SPRINT` on `S04`; `S12` shows itemized ledger without Focus Score | e2e | pass |
| F06-H1 | Weekly Leaderboard & Pro Ad-Free Upgrade | happy | Open `S15` Ranks (`#939 Global rank`), then open `S03` Paywall and tap `Unlock Ad-Free Pro Now` | `S15` renders leaderboard with mini `FocusCard` badges; upgrading on `S03` removes all free-tier ads on `S04`/`S06`/`S08` | e2e | pass |
| SEC-N1 | Multi-User Authorization Isolation (`403`) | negative | `GET /api/wallet?userId=user_demo_1` as `user_demo_2` | Server returns `403 Forbidden` and empty `transactions: []` | e2e | pass |
| SEC-E1 | Idempotent Withdrawal & Signed Stripe Webhook | edge | POST same `idempotencyKey` twice to `/api/wallet`; POST forged `stripe-signature` to `/api/webhooks/stripe` | Second POST returns `duplicate: true` with no double debit; forged webhook returns `400` | e2e | pass |
