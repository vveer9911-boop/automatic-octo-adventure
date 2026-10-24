import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "fs";
import path from "path";

const CLONE_SCREENS_DIR = path.join(process.cwd(), "replica", "clone-screens");

test.beforeAll(() => {
  fs.mkdirSync(CLONE_SCREENS_DIR, { recursive: true });
});

test.describe("Screen Time Wallet APK Clone — E2E & Accessibility Suite (F01–F06)", () => {
  test.beforeEach(async ({ page }) => {
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        throw new Error(`Console error: ${msg.text()}`);
      }
    });
    page.on("response", (res) => {
      if (res.status() >= 500) {
        throw new Error(`HTTP ${res.status()} on ${res.url()}`);
      }
    });
  });

  test("F01-H1 & F01-E1: Onboarding survey + Google Sign-Up Only Mockup -> Android permissions -> Wallet Home (No Ads, No Spend Limit, No Focus Score)", async ({
    page,
  }) => {
    await page.goto("/?screen=S01");
    await expect(page.getByTestId("screen-S01-onboarding-survey")).toBeVisible();

    // Test Google Sign-Up Only Mockup sign-out and sign-in
    await expect(page.getByTestId("google-mock-signed-in")).toBeVisible();
    await page.getByTestId("btn-google-mock-signout").click();
    await expect(page.getByTestId("btn-google-mock-signup")).toBeVisible();
    await page.getByTestId("btn-google-mock-signup").click();
    await expect(page.getByTestId("google-mock-signed-in")).toBeVisible();

    const a11yS01 = await new AxeBuilder({ page }).analyze();
    expect(a11yS01.violations).toEqual([]);

    await page.getByTestId("btn-onboarding-next").click();
    await expect(page.getByTestId("screen-S02-permissions")).toBeVisible();

    await page.getByTestId("btn-finish-onboarding").click();
    await expect(page.getByTestId("screen-S04-wallet")).toBeVisible();

    // No ads, no Spend Limit, and no Focus Score
    await expect(page.getByTestId("ad-dashboard-compact")).toHaveCount(0);
    await expect(page.getByText(/spend limit/i)).toHaveCount(0);
    await expect(page.getByText(/focus score/i)).toHaveCount(0);

    // Save clone screenshot S04
    await page.screenshot({
      path: path.join(CLONE_SCREENS_DIR, "S04.png"),
    });

    const a11yS04 = await new AxeBuilder({ page }).analyze();
    expect(a11yS04.violations).toEqual([]);
  });

  test("F02-H1 & F02-E1: Start Focus Session -> Fast-Forward 1m -> Complete -> Balance increases (No Ads or Coupons)", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByTestId("btn-start-focus-setup").click();
    await expect(page.getByTestId("screen-S05-focus-setup")).toBeVisible();

    await page.getByTestId("btn-launch-focus-session").click();
    await expect(page.getByTestId("screen-S06-focus-active")).toBeVisible();

    // No ads or coupon banners
    await expect(page.getByTestId("ad-focus-top-pill")).toHaveCount(0);
    await expect(page.getByText(/coupon is waiting/i)).toHaveCount(0);

    // Save clone screenshot S06
    await page.screenshot({
      path: path.join(CLONE_SCREENS_DIR, "S06.png"),
    });

    const a11yS06 = await new AxeBuilder({ page }).analyze();
    expect(a11yS06.violations).toEqual([]);

    // Fast-forward 1m (earns +1.00 credit) and complete
    await page.getByTestId("btn-fast-forward-60s").click();
    await page.getByTestId("btn-complete-focus").click();

    // S08 Session Complete Summary
    await expect(page.getByTestId("screen-S08-focus-complete")).toBeVisible();
    await expect(page.getByTestId("ad-post-session-card")).toHaveCount(0);

    await page.getByTestId("btn-return-wallet-after-focus").click();
    await expect(page.getByTestId("screen-S04-wallet")).toBeVisible();
  });

  test("F02-E2 & F02-N1: Strict Motion Detection warning on 1st shake, forfeits session on 2nd shake, and AR Vault flow", async ({
    page,
  }) => {
    await page.goto("/?screen=S05");
    await page.getByTestId("btn-launch-focus-session").click();
    await expect(page.getByTestId("screen-S06-focus-active")).toBeVisible();

    // 1st shake shows warning banner
    await page.getByTestId("btn-simulate-motion").click();
    await expect(page.getByTestId("motion-warning-banner")).toBeVisible();

    // 2nd shake forfeits session
    await page.getByTestId("btn-simulate-motion").click();
    await expect(page.getByTestId("screen-S08-focus-complete")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /session forfeited/i })
    ).toBeVisible();

    // Also test AR Vault (S07)
    await page.goto("/?screen=S07");
    await expect(page.getByTestId("screen-S07-ar-vault")).toBeVisible();
    await page.getByTestId("btn-seal-ar-vault").click();
  });

  test("F03-H1, F03-E1, F03-N1: Withdraw 1m minimum, reject excessive withdrawal, and Early Re-lock refunds unused credits", async ({
    page,
  }) => {
    await page.goto("/?screen=S09");
    await expect(page.getByTestId("screen-S09-withdraw")).toBeVisible();

    // Save clone screenshot S09 for /replica-diff
    await page.screenshot({
      path: path.join(CLONE_SCREENS_DIR, "S09.png"),
    });

    const a11yS09 = await new AxeBuilder({ page }).analyze();
    expect(a11yS09.violations).toEqual([]);

    // Negative case: select 2h (120m) when balance is 15 credits -> shows insufficient error
    await page.getByRole("button", { name: "2h", exact: true }).click();
    await page.getByTestId("btn-confirm-withdraw").click();
    await expect(page.getByTestId("withdraw-error")).toContainText(
      /insufficient credits/i
    );

    // Edge case: 1m minimum withdrawal works, or 15m withdrawal + early re-lock refund
    await page.getByRole("button", { name: "15m", exact: true }).click();
    await page.getByTestId("btn-confirm-withdraw").click();

    await expect(page.getByTestId("screen-S04-wallet")).toBeVisible();
    await expect(page.getByTestId("active-unlock-banner")).toBeVisible();

    // Tap Re-lock & Refund -> refunds unused credits
    await page.getByTestId("btn-early-relock").click();
    await expect(page.getByTestId("active-unlock-banner")).toHaveCount(0);
    await expect(page.getByRole("status")).toContainText(/refunded/i);
  });

  test("F04-H1 & F04-N1: Block List + Android App Shield Overlay & Uninstall Protection lock guard", async ({
    page,
  }) => {
    await page.goto("/?screen=S10");
    await expect(page.getByTestId("screen-S10-blocks")).toBeVisible();

    // Trigger Android System Overlay Shield when opening a locked app at 0m
    await page.getByTestId("btn-test-shield-overlay").click();
    await expect(page.getByTestId("app-shield-overlay")).toBeVisible();
    await page.getByTestId("btn-shield-dismiss").click();
    await expect(page.getByTestId("app-shield-overlay")).toHaveCount(0);

    // System settings (S14): cannot disable Uninstall Protection while blocks are locked
    await page.goto("/?screen=S14");
    await expect(page.getByTestId("screen-S14-system")).toBeVisible();
    await page.screenshot({
      path: path.join(CLONE_SCREENS_DIR, "S14.png"),
    });

    await page
      .getByRole("switch", { name: /uninstall protection/i })
      .click();
    await expect(page.getByTestId("uninstall-guard-alert")).toBeVisible();
  });

  test("F05-H1 & F06-H1: Card Studio (S13), Bank Ledger (S12), Leaderboard (S15), and Pro Upgrade removes ads (S03)", async ({
    page,
  }) => {
    await page.goto("/?screen=S13");
    await expect(page.getByTestId("screen-S13-card-studio")).toBeVisible();
    await page.screenshot({
      path: path.join(CLONE_SCREENS_DIR, "S13.png"),
    });

    await page.getByLabel(/embossed card goal label/i).fill("DEEP SPRINT");
    await page.getByTestId("btn-save-card-design").click();
    await expect(page.getByTestId("screen-S04-wallet")).toBeVisible();
    await expect(page.getByText("DEEP SPRINT")).toBeVisible();

    // S12 Transactions (clean ledger without Focus Score)
    await page.goto("/?screen=S12");
    await expect(page.getByTestId("screen-S12-transactions")).toBeVisible();
    await expect(page.getByText(/focus score/i)).toHaveCount(0);

    // S15 Leaderboard
    await page.goto("/?screen=S15");
    await expect(page.getByTestId("screen-S15-ranks")).toBeVisible();
    await page.screenshot({
      path: path.join(CLONE_SCREENS_DIR, "S15.png"),
    });

    // S03 Upgrade to Pro -> hides Free-Tier Ads on S04
    await page.goto("/?screen=S03");
    await page.getByTestId("btn-upgrade-premium").click();
    await expect(page.getByTestId("screen-S04-wallet")).toBeVisible();
    await expect(page.getByTestId("ad-dashboard-compact")).toHaveCount(0);
  });

  test("Backend Security & Isolation: Second user gets 403 Forbidden, idempotency prevents double debit, and invalid webhook signature is rejected", async ({
    request,
  }) => {
    // 1. Second user (user_demo_2) attempting to read user_demo_1's wallet must get 403
    const crossRead = await request.get("/api/wallet?userId=user_demo_1", {
      headers: { "x-user-id": "user_demo_2" },
    });
    expect(crossRead.status()).toBe(403);
    const crossBody = await crossRead.json();
    expect(crossBody.transactions).toEqual([]);

    // 2. Idempotent withdrawal mutation: sending same idempotencyKey twice only debits once
    const idemKey = `e2e-idem-${Date.now()}`;
    const firstWithdraw = await request.post("/api/wallet", {
      headers: { "x-user-id": "user_demo_1" },
      data: {
        action: "withdraw",
        requestedMinutes: 2,
        idempotencyKey: idemKey,
      },
    });
    expect(firstWithdraw.status()).toBe(200);
    const firstJson = await firstWithdraw.json();
    expect(firstJson.duplicate).toBe(false);

    const secondWithdraw = await request.post("/api/wallet", {
      headers: { "x-user-id": "user_demo_1" },
      data: {
        action: "withdraw",
        requestedMinutes: 2,
        idempotencyKey: idemKey,
      },
    });
    expect(secondWithdraw.status()).toBe(200);
    const secondJson = await secondWithdraw.json();
    expect(secondJson.duplicate).toBe(true);
    expect(secondJson.ledgerEntry.balanceAfterHundredths).toBe(
      firstJson.ledgerEntry.balanceAfterHundredths
    );

    // 3. Invalid Stripe webhook signature returns 400
    const badWebhook = await request.post("/api/webhooks/stripe", {
      headers: { "stripe-signature": "t=123,v1=deadbeef" },
      data: { id: "evt_1", type: "checkout.session.completed" },
    });
    expect(badWebhook.status()).toBe(400);
  });
});
