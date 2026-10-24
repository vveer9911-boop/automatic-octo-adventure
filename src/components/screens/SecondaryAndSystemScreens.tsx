"use client";

import React, { useState } from "react";
import {
  Bell,
  Check,
  Crown,
  Globe,
  Lock,
  Plus,
  Shield,
  ShieldAlert,
  Sparkles,
  Trophy,
} from "lucide-react";
import {
  AppBlockRow,
  CARD_SKINS,
  CardSkinId,
  CircularIconButton,
  FocusCard,
  formatDurationHoursMins,
  GoogleMockSignUpButton,
  LeaderboardRow,
  ProtectionToggleCard,
  RecoverIcon,
  RecoverLogo,
  TransactionLedgerRow,
} from "@/components/primitives";
import { BlockRuleItem, useWallet } from "@/lib/wallet-store";

/* ============================================================================
 * S01: Onboarding Habit Survey & Google Sign-Up Only (Mockup)
 * ========================================================================== */
export function OnboardingSurveyScreen() {
  const { navigate, googleUser, signInWithGoogleMock, signOutGoogleMock } =
    useWallet();
  const [dailyHours, setDailyHours] = useState<string>("4–6 hours");
  const [triedLimits, setTriedLimits] = useState<string>(
    "Yes, I always tap 'Ignore Limit'"
  );

  return (
    <div
      data-testid="screen-S01-onboarding-survey"
      className="flex flex-col justify-between min-h-screen p-5 bg-bg space-y-6"
    >
      <header className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <RecoverLogo
            iconClassName="h-5 w-7 text-accent"
            wordmarkClassName="h-3.5 w-auto text-text"
          />
          <span className="font-mono text-xs uppercase tracking-widest text-focus-glow">
            Step 1 of 2 • Habit Audit
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text">
          Reclaim your hours. Spend attention on your terms.
        </h1>
        <p className="text-sm text-text-muted">
          Soft app timers fail because one tap dismisses them. With Recover,
          every minute on social feeds is backed by focused minutes you banked
          first.
        </p>
      </header>

      <section className="space-y-4 my-auto">
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-text-muted">
            1. Average daily phone screen time
          </label>
          <div className="grid grid-cols-2 gap-2">
            {["2–4 hours", "4–6 hours", "6–8 hours", "8+ hours"].map((opt) => (
              <button
                key={opt}
                type="button"
                aria-pressed={dailyHours === opt}
                onClick={() => setDailyHours(opt)}
                className={`rounded-md p-3 text-left text-sm font-medium border ${
                  dailyHours === opt
                    ? "bg-accent text-on-accent border-accent"
                    : "bg-surface text-text border-border"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-text-muted">
            2. Have you tried built-in app timers before?
          </label>
          <div className="space-y-2">
            {[
              "Yes, I always tap 'Ignore Limit'",
              "Yes, I delete the blocker when frustrated",
              "No, this is my first time wallet",
            ].map((opt) => (
              <button
                key={opt}
                type="button"
                aria-pressed={triedLimits === opt}
                onClick={() => setTriedLimits(opt)}
                className={`w-full rounded-md p-3 text-left text-sm font-medium border ${
                  triedLimits === opt
                    ? "bg-surface-elevated text-text border-border-input"
                    : "bg-surface text-text-muted border-border"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        {/* Google Sign-Up Only Mockup Section */}
        <div className="rounded-lg bg-surface border border-border p-3.5 space-y-2.5">
          <p className="text-xs font-mono uppercase tracking-wider text-text-muted">
            3. Account Sign-Up (Google Only • Mockup)
          </p>
          <GoogleMockSignUpButton
            signedInEmail={googleUser?.email ?? null}
            onSignIn={signInWithGoogleMock}
            onSignOut={signOutGoogleMock}
          />
        </div>
      </section>

      <button
        type="button"
        data-testid="btn-onboarding-next"
        onClick={() => {
          if (!googleUser) {
            signInWithGoogleMock();
          }
          navigate("S02_PERMISSIONS");
        }}
        className="w-full rounded-pill bg-accent py-3.5 text-base font-semibold text-on-accent"
      >
        Continue to Android Setup
      </button>
    </div>
  );
}

/* ============================================================================
 * S02: Android Permissions & Initial Block Setup
 * ========================================================================== */
export function PermissionsSetupScreen() {
  const {
    permissions,
    blockRules,
    grantPermission,
    toggleBlockRule,
    completeOnboarding,
  } = useWallet();

  const permRows: {
    key: keyof typeof permissions;
    title: string;
    desc: string;
  }[] = [
    {
      key: "usageStatsGranted",
      title: "Usage Access (PACKAGE_USAGE_STATS)",
      desc: "Detects when a locked app is opened in the foreground.",
    },
    {
      key: "overlayShieldGranted",
      title: "Display Over Other Apps (SYSTEM_ALERT_WINDOW)",
      desc: "Shows the Wallet Lock Shield when your unlocked time is 0m.",
    },
    {
      key: "deviceAdminGranted",
      title: "Device Guard (Uninstall Protection)",
      desc: "Prevents deleting apps while your block list is active.",
    },
  ];

  return (
    <div
      data-testid="screen-S02-permissions"
      className="flex flex-col justify-between min-h-screen p-5 bg-bg space-y-6"
    >
      <header className="space-y-1 pt-2">
        <span className="font-mono text-xs uppercase tracking-widest text-focus-glow">
          Step 2 of 2 • Android APK Permissions
        </span>
        <h1 className="text-xl font-bold text-text">
          Enable System Blocker & Pick Apps
        </h1>
        <p className="text-xs text-text-muted">
          Usage data stays on your Android device and is never uploaded.
        </p>
      </header>

      <section className="space-y-2.5">
        {permRows.map(({ key, title, desc }) => {
          const granted = permissions[key];
          return (
            <div
              key={key}
              className="rounded-lg bg-surface border border-border p-3.5 flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-sm font-semibold text-text">{title}</p>
                <p className="text-xs text-text-muted">{desc}</p>
              </div>
              <button
                type="button"
                onClick={() => grantPermission(key)}
                className={`rounded-pill px-3 py-1.5 text-xs font-semibold shrink-0 ${
                  granted
                    ? "bg-surface-elevated text-success border border-border"
                    : "bg-accent text-on-accent"
                }`}
              >
                {granted ? "Granted" : "Allow"}
              </button>
            </div>
          );
        })}
      </section>

      <section className="space-y-2 flex-1 overflow-y-auto">
        <h2 className="text-xs font-mono uppercase tracking-wider text-text-muted">
          Initial Locked Apps
        </h2>
        <div className="space-y-2">
          {blockRules.slice(0, 4).map((rule) => (
            <AppBlockRow
              key={rule.id}
              name={rule.displayName}
              packageOrDomain={rule.packageOrDomain}
              category={rule.category}
              isLocked={rule.isActive}
              onToggle={() => toggleBlockRule(rule.id)}
            />
          ))}
        </div>
      </section>

      <button
        type="button"
        data-testid="btn-finish-onboarding"
        onClick={() => completeOnboarding()}
        className="w-full rounded-pill bg-accent py-3.5 text-base font-semibold text-on-accent"
      >
        Activate My Recover Card
      </button>
    </div>
  );
}

/* ============================================================================
 * S03: Premium Paywall Sheet (Remove Ads + Pro Features)
 * ========================================================================== */
export function PaywallScreen() {
  const { isPremium, navigate, upgradeToPremium } = useWallet();
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">(
    "annual"
  );

  const benefits = [
    "Remove all ads (Top Focus Pill, Post-Session Card & Dashboard)",
    "Uninstall Protection via Android Device Guard",
    "AR Lock Box Vault & Strict Accelerometer Motion Guard",
    "Unlock all 11 Brushed Metal, Circuit, Weave & Urban Card Skins",
    "Custom Credit-to-Minute Exchange Rates (0.5x to 5x)",
  ];

  return (
    <div
      data-testid="screen-S03-paywall"
      className="flex flex-col justify-between min-h-screen p-5 bg-bg space-y-6"
    >
      <header className="flex items-center justify-between">
        <CircularIconButton
          icon="close"
          label="Close Paywall"
          onClick={() => navigate("S04_WALLET_HOME")}
        />
        <span className="font-mono text-xs uppercase tracking-widest text-warning flex items-center gap-1.5">
          <RecoverIcon className="h-3.5 w-5 text-accent" /> Recover Pro
        </span>
        <div className="w-11" aria-hidden="true" />
      </header>

      <section className="space-y-4 my-auto">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-text">
            Zero Ads. Unbreakable Discipline.
          </h1>
          <p className="text-sm text-text-muted">
            Upgrade to remove all free-tier ad placements and unlock hardware-level
            anti-cheat protections.
          </p>
        </div>

        <div className="rounded-card bg-surface border border-border p-4 space-y-3">
          {benefits.map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <div className="mt-0.5 h-5 w-5 rounded-pill bg-surface-elevated border border-border flex items-center justify-center shrink-0">
                <Check className="h-3 w-3 text-success" />
              </div>
              <p className="text-sm text-text">{item}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            aria-pressed={billingCycle === "annual"}
            onClick={() => setBillingCycle("annual")}
            className={`rounded-lg p-3.5 text-left border ${
              billingCycle === "annual"
                ? "bg-surface-elevated border-accent"
                : "bg-surface border-border"
            }`}
          >
            <p className="text-xs font-mono uppercase text-success">
              Save 48%
            </p>
            <p className="text-lg font-bold text-text mt-0.5">$24.99 / yr</p>
            <p className="text-xs text-text-muted">$2.08 per month</p>
          </button>

          <button
            type="button"
            aria-pressed={billingCycle === "monthly"}
            onClick={() => setBillingCycle("monthly")}
            className={`rounded-lg p-3.5 text-left border ${
              billingCycle === "monthly"
                ? "bg-surface-elevated border-accent"
                : "bg-surface border-border"
            }`}
          >
            <p className="text-xs font-mono uppercase text-text-muted">
              Flexible
            </p>
            <p className="text-lg font-bold text-text mt-0.5">$3.99 / mo</p>
            <p className="text-xs text-text-muted">Cancel in 1 click</p>
          </button>
        </div>
      </section>

      <div className="space-y-2.5">
        <button
          type="button"
          data-testid="btn-upgrade-premium"
          onClick={upgradeToPremium}
          className="w-full rounded-pill bg-accent py-3.5 text-base font-semibold text-on-accent"
        >
          {isPremium
            ? "Pro Active (Ad-Free Enabled)"
            : "Unlock Ad-Free Pro Now"}
        </button>
        <button
          type="button"
          onClick={() => navigate("S04_WALLET_HOME")}
          className="w-full py-2 text-xs font-medium text-text-muted hover:text-text"
        >
          Continue on Free Ad-Supported Plan
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
 * S10: Block List & Android Full-Screen App Shield Overlay
 * ========================================================================== */
export function BlockListScreen() {
  const {
    blockRules,
    activeUnlock,
    shieldTriggeredApp,
    creditBalanceHundredths,
    toggleBlockRule,
    addCustomDomainRule,
    triggerShieldForApp,
    navigate,
  } = useWallet();

  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [newDomain, setNewDomain] = useState<string>("");

  const filteredRules = blockRules.filter((r) =>
    categoryFilter === "all" ? true : r.category === categoryFilter
  );

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    addCustomDomainRule(newDomain);
    setNewDomain("");
  };

  const firstLockedRule: BlockRuleItem | undefined = blockRules.find(
    (r) => r.isActive
  );

  return (
    <div
      data-testid="screen-S10-blocks"
      className="flex flex-col min-h-[calc(100vh-68px)] p-5 space-y-5"
    >
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text">Block List</h1>
          <p className="text-xs text-text-muted">
            Selected apps & domains stay locked until you withdraw Credits.
          </p>
        </div>
        {firstLockedRule && !activeUnlock && (
          <button
            type="button"
            data-testid="btn-test-shield-overlay"
            onClick={() => triggerShieldForApp(firstLockedRule)}
            className="rounded-pill bg-surface-elevated border border-border px-3 py-1.5 text-xs font-semibold text-warning hover:text-text"
          >
            Test App Shield
          </button>
        )}
      </header>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["all", "social", "video", "games", "browsers"].map((cat) => (
          <button
            key={cat}
            type="button"
            aria-pressed={categoryFilter === cat}
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-pill px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider ${
              categoryFilter === cat
                ? "bg-accent text-on-accent"
                : "bg-surface text-text-muted border border-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add Website Domain Form */}
      <form onSubmit={handleAddDomain} className="flex gap-2">
        <label htmlFor="domain-input" className="sr-only">
          Add website domain to block
        </label>
        <input
          id="domain-input"
          type="text"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          placeholder="Add domain (e.g. twitch.tv)"
          className="flex-1 rounded-md bg-surface border border-border-input px-3.5 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="submit"
          aria-label="Add Domain"
          className="rounded-md bg-surface-elevated border border-border px-3.5 py-2 text-sm font-semibold text-text flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>

      {/* Rules List */}
      <section className="space-y-2.5 flex-1">
        {filteredRules.map((rule) => (
          <div key={rule.id} className="space-y-1">
            <AppBlockRow
              name={rule.displayName}
              packageOrDomain={rule.packageOrDomain}
              category={rule.category}
              isLocked={rule.isActive}
              isTemporarilyUnlocked={Boolean(activeUnlock)}
              onToggle={() => toggleBlockRule(rule.id)}
            />
            {rule.isActive && (
              <div className="flex justify-end px-1">
                <button
                  type="button"
                  onClick={() => {
                    if (!activeUnlock) {
                      triggerShieldForApp(rule);
                    }
                  }}
                  className="text-[11px] font-mono text-text-muted hover:text-accent underline"
                >
                  {activeUnlock
                    ? `Unlocked (${Math.ceil(activeUnlock.remainingSeconds / 60)}m left)`
                    : `Simulate opening ${rule.displayName} →`}
                </button>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Full-Screen Android App Shield Overlay when opening a locked app at 0m */}
      {shieldTriggeredApp && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${shieldTriggeredApp.displayName} is locked by Focus Wallet`}
          data-testid="app-shield-overlay"
          className="fixed inset-0 z-50 bg-bg/95 backdrop-blur-md flex flex-col items-center justify-between p-6 text-center"
        >
          <div className="pt-6">
            <span className="rounded-pill bg-surface-elevated border border-border px-3 py-1 font-mono text-xs text-danger">
              ANDROID SYSTEM OVERLAY SHIELD
            </span>
          </div>

          <div className="space-y-4 max-w-xs">
            <div className="mx-auto h-16 w-16 rounded-card bg-surface border border-border flex items-center justify-center shadow-card">
              <RecoverIcon className="h-8 w-10 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-text">
              {shieldTriggeredApp.displayName} is Locked by Recover
            </h2>
            <p className="text-sm text-text-muted">
              Your unlocked screen-time window is at 0m. Withdraw Credits from
              your Recover Card to open {shieldTriggeredApp.displayName}.
            </p>
            <p className="font-mono text-xs text-text-muted">
              Available Balance: {(creditBalanceHundredths / 100).toFixed(2)}{" "}
              credits
            </p>
          </div>

          <div className="w-full max-w-xs space-y-2.5 pb-4">
            <button
              type="button"
              data-testid="btn-shield-withdraw"
              onClick={() => {
                triggerShieldForApp(null);
                navigate("S09_WITHDRAW");
              }}
              className="w-full rounded-pill bg-accent py-3.5 text-sm font-semibold text-on-accent"
            >
              Withdraw Credits to Unlock
            </button>
            <button
              type="button"
              data-testid="btn-shield-dismiss"
              onClick={() => triggerShieldForApp(null)}
              className="w-full rounded-pill bg-surface border border-border py-3 text-sm font-semibold text-text-muted"
            >
              Close App & Stay Focused
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * S12: Bank-Statement Transaction History (No Focus Score per user request)
 * ========================================================================== */
export function TransactionsScreen() {
  const { ledger, creditBalanceHundredths, navigate } = useWallet();
  const [filter, setFilter] = useState<"all" | "earned" | "spent">("all");

  const filtered = ledger.filter((tx) => {
    if (filter === "earned") return tx.amountHundredths > 0;
    if (filter === "spent") return tx.amountHundredths < 0;
    return true;
  });

  const totalEarned = ledger
    .filter((t) => t.amountHundredths > 0)
    .reduce((acc, t) => acc + t.amountHundredths, 0);
  const totalSpent = ledger
    .filter((t) => t.amountHundredths < 0)
    .reduce((acc, t) => acc + Math.abs(t.amountHundredths), 0);

  return (
    <div
      data-testid="screen-S12-transactions"
      className="flex flex-col min-h-[calc(100vh-68px)] p-5 space-y-5"
    >
      <header className="flex items-center justify-between">
        <CircularIconButton
          icon="back"
          label="Back to Wallet"
          onClick={() => navigate("S04_WALLET_HOME")}
        />
        <h1 className="text-base font-semibold text-text">
          Transaction Statement
        </h1>
        <div className="w-11" aria-hidden="true" />
      </header>

      {/* Clean Bank Statement Summary Header (No Focus Score gauge) */}
      <section className="grid grid-cols-3 gap-2 rounded-card bg-surface border border-border p-4 text-center">
        <div>
          <p className="text-xs text-text-muted">Current Balance</p>
          <p className="font-mono text-base font-bold text-text mt-0.5">
            {(creditBalanceHundredths / 100).toFixed(2)} cr
          </p>
        </div>
        <div className="border-x border-border">
          <p className="text-xs text-text-muted">Total Earned</p>
          <p className="font-mono text-base font-bold text-success mt-0.5">
            +{(totalEarned / 100).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Total Spent</p>
          <p className="font-mono text-base font-bold text-text-muted mt-0.5">
            -{(totalSpent / 100).toFixed(2)}
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="grid grid-cols-3 gap-2 rounded-pill bg-surface p-1 border border-border">
        {(["all", "earned", "spent"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            aria-pressed={filter === tab}
            onClick={() => setFilter(tab)}
            className={`rounded-pill py-1.5 text-xs font-semibold uppercase tracking-wider ${
              filter === tab
                ? "bg-accent text-on-accent"
                : "text-text-muted hover:text-text"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Itemized Ledger */}
      <section className="space-y-2.5 flex-1">
        {filtered.length === 0 ? (
          <div className="rounded-lg bg-surface border border-border p-8 text-center text-sm text-text-muted">
            No transactions match this filter yet.
          </div>
        ) : (
          filtered.map((tx) => (
            <TransactionLedgerRow
              key={tx.id}
              type={tx.type}
              description={tx.description}
              timestampLabel={tx.timestampLabel}
              amountHundredths={tx.amountHundredths}
              balanceAfterHundredths={tx.balanceAfterHundredths}
            />
          ))
        )}
      </section>
    </div>
  );
}

/* ============================================================================
 * S13: Card Customizer Studio (Ref: appstore_6.png)
 * ========================================================================== */
export function CardStudioScreen() {
  const {
    creditBalanceHundredths,
    exchangeRateHundredthsPerMin,
    cardSkinId,
    cardLabel,
    updateCardStyle,
    navigate,
  } = useWallet();

  const [draftSkin, setDraftSkin] = useState<CardSkinId>(cardSkinId);
  const [draftLabel, setDraftLabel] = useState<string>(cardLabel);

  const collections: {
    name: "Circuit" | "Weave" | "Urban" | "Metal";
    description: string;
  }[] = [
    {
      name: "Circuit",
      description:
        "Precision-etched conductive pathways built for deep technical sprints.",
    },
    {
      name: "Weave",
      description:
        "Tightly interlaced colour-on-colour threads pulling in one direction.",
    },
    {
      name: "Urban",
      description:
        "Bold street finishes and stamped graphics to reclaim your attention.",
    },
    {
      name: "Metal",
      description:
        "Anodized brushed aluminum and obsidian matte reserves.",
    },
  ];

  const handleSave = () => {
    updateCardStyle(draftSkin, draftLabel);
    navigate("S04_WALLET_HOME");
  };

  return (
    <div
      data-testid="screen-S13-card-studio"
      className="flex flex-col min-h-[calc(100vh-68px)] p-5 space-y-6"
    >
      <header className="flex items-center justify-between">
        <CircularIconButton
          icon="back"
          label="Back to Wallet"
          onClick={() => navigate("S04_WALLET_HOME")}
        />
        <h1 className="text-base font-semibold text-text">Design Your Card</h1>
        <button
          type="button"
          data-testid="btn-save-card-design"
          onClick={handleSave}
          className="rounded-pill bg-accent px-4 py-1.5 text-xs font-semibold text-on-accent"
        >
          Save
        </button>
      </header>

      {/* Live Card Preview */}
      <FocusCard
        creditsHundredths={creditBalanceHundredths}
        exchangeRateHundredthsPerMin={exchangeRateHundredthsPerMin}
        label={draftLabel || "RECOVER CARD"}
        skinId={draftSkin}
      />

      {/* Embossed Card Label Editor */}
      <div className="space-y-1.5">
        <label
          htmlFor="card-label-input"
          className="block text-xs font-mono uppercase tracking-wider text-text-muted"
        >
          Embossed Card Goal Label (Max 20 chars)
        </label>
        <input
          id="card-label-input"
          type="text"
          maxLength={20}
          value={draftLabel}
          onChange={(e) => setDraftLabel(e.target.value.toUpperCase())}
          className="w-full rounded-md bg-surface border border-border-input px-3.5 py-2.5 font-emboss text-sm uppercase tracking-widest text-text focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Horizontal Carousels by Collection matching appstore_6.png */}
      <div className="space-y-6 pb-4">
        {collections.map((col) => {
          const skins = CARD_SKINS.filter((s) => s.collection === col.name);
          return (
            <section key={col.name} className="space-y-2">
              <div>
                <h2 className="text-base font-bold text-text">{col.name}</h2>
                <p className="text-xs text-text-muted">{col.description}</p>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {skins.map((skin) => (
                  <FocusCard
                    key={skin.id}
                    creditsHundredths={creditBalanceHundredths}
                    skinId={skin.id}
                    label={skin.name}
                    size="vertical-gallery"
                    selected={draftSkin === skin.id}
                    onClick={() => setDraftSkin(skin.id)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
 * S14: System & Anti-Cheat Settings (Ref: appstore_5.png)
 * ========================================================================== */
export function SystemSettingsScreen() {
  const {
    uninstallProtectionEnabled,
    biometricWithdrawEnabled,
    motionDetectionEnabled,
    exchangeRateHundredthsPerMin,
    creditBalanceHundredths,
    cardLabel,
    googleUser,
    signInWithGoogleMock,
    signOutGoogleMock,
    updateSystemSettings,
    navigate,
  } = useWallet();

  const [guardMessage, setGuardMessage] = useState<string | null>(null);

  const rates = [
    { label: "0.5 cr/m", val: 50 },
    { label: "1 cr/m", val: 100 },
    { label: "2 cr/m", val: 200 },
    { label: "5 cr/m", val: 500 },
  ];

  const handleUninstallToggle = () => {
    const res = updateSystemSettings({
      uninstallProtectionEnabled: !uninstallProtectionEnabled,
    });
    if (!res.ok && res.error) {
      setGuardMessage(res.error);
    } else {
      setGuardMessage(null);
    }
  };

  return (
    <div
      data-testid="screen-S14-system"
      className="flex flex-col min-h-[calc(100vh-68px)] p-5 space-y-6"
    >
      <header className="flex items-center justify-between">
        <CircularIconButton
          icon="back"
          label="Back to Wallet"
          onClick={() => navigate("S04_WALLET_HOME")}
        />
        <h1 className="inline-flex items-center gap-2 text-base font-semibold text-text">
          <RecoverIcon className="h-4 w-6 text-accent" />
          <span>Recover Guard</span>
        </h1>
        <div className="w-11" aria-hidden="true" />
      </header>

      {/* Hero Metallic Card Banner */}
      <section className="space-y-3 text-center">
        <FocusCard
          creditsHundredths={creditBalanceHundredths}
          exchangeRateHundredthsPerMin={exchangeRateHundredthsPerMin}
          label={cardLabel}
          skinId="metal-obsidian"
        />
        <div className="pt-2 space-y-1">
          <h2 className="text-2xl font-bold text-text">
            Hardened Vault Guard. Zero Loopholes.
          </h2>
          <p className="text-sm text-text-muted">
            Hardware-enforced rules that hold the line when late-night fatigue
            sets in.
          </p>
        </div>
      </section>

      {guardMessage && (
        <div
          role="alert"
          data-testid="uninstall-guard-alert"
          className="rounded-md bg-surface-elevated border border-warning p-3 text-xs text-warning flex items-start gap-2"
        >
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{guardMessage}</span>
        </div>
      )}

      {/* Uninstall Protection Card matching appstore_5.png */}
      <ProtectionToggleCard
        title="Uninstall protection"
        subtitle="Stop apps being deleted while your blocks are on"
        footnote="While your blocks are active, Android Device Guard blocks app deletion — this app included. Protection lifts while an active withdrawal has your apps unlocked."
        enabled={uninstallProtectionEnabled}
        onToggle={handleUninstallToggle}
      />

      {/* Biometric Withdrawal Security */}
      <ProtectionToggleCard
        title="Biometric withdrawal security"
        subtitle="Require fingerprint or face unlock before spending Credits"
        enabled={biometricWithdrawEnabled}
        onToggle={() =>
          updateSystemSettings({
            biometricWithdrawEnabled: !biometricWithdrawEnabled,
          })
        }
      />

      {/* Motion Detection & Sensitivity */}
      <ProtectionToggleCard
        title="Accelerometer motion guard"
        subtitle="Forfeit strict focus sessions if the phone is picked up"
        enabled={motionDetectionEnabled}
        onToggle={() =>
          updateSystemSettings({
            motionDetectionEnabled: !motionDetectionEnabled,
          })
        }
      />

      {/* Exchange Rate Selector */}
      <section className="rounded-lg bg-surface border border-border p-4 space-y-3">
        <div>
          <p className="text-base font-semibold text-text">
            Screen Time Exchange Rate
          </p>
          <p className="text-xs text-text-muted">
            Set how many Credits each minute of unlocked screen time costs.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {rates.map((r) => {
            const active = exchangeRateHundredthsPerMin === r.val;
            return (
              <button
                key={r.val}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  updateSystemSettings({
                    exchangeRateHundredthsPerMin: r.val,
                  })
                }
                className={`rounded-md py-2 text-xs font-semibold border ${
                  active
                    ? "bg-accent text-on-accent border-accent"
                    : "bg-surface-elevated text-text-muted border-border"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Account (Google Sign-Up Only Mockup) & Privacy */}
      <section className="rounded-lg bg-surface border border-border p-4 space-y-3">
        <p className="text-sm font-semibold text-text">
          Account (Google Sign-Up Mockup) & Privacy
        </p>
        <GoogleMockSignUpButton
          signedInEmail={googleUser?.email ?? null}
          onSignIn={signInWithGoogleMock}
          onSignOut={signOutGoogleMock}
        />
        <div className="flex flex-wrap gap-2 pt-1">
          <a
            href="/privacy"
            className="rounded-pill bg-surface-elevated border border-border px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text"
          >
            Privacy Policy
          </a>
          <button
            type="button"
            data-testid="btn-delete-account"
            onClick={() => {
              signOutGoogleMock();
              navigate("S01_ONBOARDING_SURVEY");
            }}
            className="rounded-pill bg-surface-elevated border border-border px-3 py-1.5 text-xs font-medium text-danger hover:border-danger"
          >
            Reset / Sign Out Mock Account
          </button>
        </div>
      </section>
    </div>
  );
}

/* ============================================================================
 * S15: Weekly Global & Friends Leaderboard (Ref: appstore_7.png)
 * ========================================================================== */
export function LeaderboardScreen() {
  const {
    competitors,
    username,
    cardSkinId,
    myFocusedSecondsThisWeek,
    navigate,
    addFriendByUsername,
  } = useWallet();

  const [scope, setScope] = useState<"global" | "friends">("global");
  const [friendModalOpen, setFriendModalOpen] = useState<boolean>(false);
  const [friendInput, setFriendInput] = useState<string>("");
  const [friendStatus, setFriendStatus] = useState<string | null>(null);

  const visibleEntries =
    scope === "friends"
      ? competitors.filter((c) => c.isFriend)
      : competitors;

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addFriendByUsername(friendInput);
    setFriendStatus(res.message);
    if (res.ok) {
      setFriendInput("");
      setScope("friends");
    }
  };

  return (
    <div
      data-testid="screen-S15-ranks"
      className="flex flex-col min-h-[calc(100vh-68px)] p-5 space-y-5"
    >
      {/* Top Bar matching appstore_7.png */}
      <header className="flex items-center justify-between pt-1">
        <CircularIconButton
          icon="settings"
          label="System Settings"
          onClick={() => navigate("S14_SYSTEM_SETTINGS")}
        />
        <div className="flex items-center gap-2 rounded-pill bg-surface border border-border p-1">
          <button
            type="button"
            aria-pressed={scope === "global"}
            onClick={() => setScope("global")}
            className={`rounded-pill px-3 py-1 text-xs font-semibold ${
              scope === "global"
                ? "bg-surface-elevated text-text"
                : "text-text-muted"
            }`}
          >
            Global
          </button>
          <button
            type="button"
            aria-pressed={scope === "friends"}
            onClick={() => setScope("friends")}
            className={`rounded-pill px-3 py-1 text-xs font-semibold ${
              scope === "friends"
                ? "bg-surface-elevated text-text"
                : "text-text-muted"
            }`}
          >
            Friends
          </button>
        </div>
        <CircularIconButton
          icon="add-friend"
          label="Add Friend"
          onClick={() => setFriendModalOpen(!friendModalOpen)}
        />
      </header>

      {/* Add Friend Inline Sheet */}
      {friendModalOpen && (
        <form
          onSubmit={handleAddFriend}
          data-testid="add-friend-modal"
          className="rounded-lg bg-surface-elevated border border-border-input p-4 space-y-3"
        >
          <p className="text-sm font-semibold text-text">
            Add Friend by Card Handle
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={friendInput}
              onChange={(e) => setFriendInput(e.target.value)}
              placeholder="Enter handle (e.g. alex_focus)"
              className="flex-1 rounded-md bg-surface border border-border px-3 py-2 text-sm text-text"
            />
            <button
              type="submit"
              className="rounded-md bg-accent px-4 py-2 text-xs font-semibold text-on-accent"
            >
              Add
            </button>
          </div>
          {friendStatus && (
            <p className="text-xs text-success">{friendStatus}</p>
          )}
        </form>
      )}

      {/* Weekly Tournament Summary Card matching appstore_7.png */}
      <section className="rounded-card bg-surface border border-border p-4 shadow-surface space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-pill bg-surface-elevated border border-border flex items-center justify-center">
            <Trophy className="h-5 w-5 text-text" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-text">
              Results • Top 100 card holders
            </h1>
            <p className="text-xs text-text-muted">Oct 19 – Oct 25</p>
          </div>
        </div>

        <div className="grid grid-cols-3 items-center text-center pt-1">
          <div className="text-left">
            <p className="text-xs text-text-muted">Resets in</p>
            <p className="font-mono text-base font-bold text-text">2d 3h</p>
          </div>
          <div>
            <p className="font-mono text-lg font-extrabold text-focus-glow">
              #939
            </p>
            <p className="text-xs text-text-muted">Global rank</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted">Time</p>
            <p className="font-mono text-base font-bold text-text">
              {formatDurationHoursMins(myFocusedSecondsThisWeek)}
            </p>
          </div>
        </div>
      </section>

      {/* Leaderboard Table Header & Rows */}
      <section className="space-y-2 flex-1">
        <div className="flex items-center justify-between px-3 text-xs font-medium text-text-muted">
          <div className="flex items-center gap-4">
            <span>Rank</span>
            <span>Card holder</span>
          </div>
          <span>Time</span>
        </div>

        <div className="space-y-2">
          {visibleEntries.map((entry, idx) => (
            <LeaderboardRow
              key={entry.username}
              rank={idx + 1}
              username={entry.username}
              skinId={entry.skinId}
              focusedSeconds={entry.focusedSeconds}
            />
          ))}
          <LeaderboardRow
            rank={scope === "friends" ? visibleEntries.length + 1 : 939}
            username={username}
            skinId={cardSkinId}
            focusedSeconds={myFocusedSecondsThisWeek}
            isCurrentUser
          />
        </div>
      </section>
    </div>
  );
}

/* ============================================================================
 * S16: Android Home Screen Widget & Ongoing Foreground Notification Preview
 * ========================================================================== */
export function AndroidWidgetPreviewScreen() {
  const {
    creditBalanceHundredths,
    exchangeRateHundredthsPerMin,
    cardSkinId,
    cardLabel,
    activeUnlock,
    navigate,
    relockEarlyWithRefund,
  } = useWallet();

  return (
    <div
      data-testid="screen-S16-widget"
      className="flex flex-col min-h-[calc(100vh-68px)] p-5 space-y-6"
    >
      <header className="flex items-center justify-between">
        <CircularIconButton
          icon="back"
          label="Back to Wallet"
          onClick={() => navigate("S04_WALLET_HOME")}
        />
        <h1 className="text-base font-semibold text-text">
          Android Widget & Notification
        </h1>
        <div className="w-11" aria-hidden="true" />
      </header>

      {/* 1. Android Home Screen AppWidget Preview */}
      <section className="space-y-2">
        <h2 className="text-xs font-mono uppercase tracking-wider text-text-muted">
          Android Home Screen Widget (4x2 AppWidgetProvider)
        </h2>
        <div className="rounded-card bg-surface border border-border p-4 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs text-text-muted uppercase">
                {cardLabel}
              </p>
              <p className="text-2xl font-bold text-text mt-0.5">
                {(creditBalanceHundredths / 100).toFixed(2)} credits
              </p>
              <p className="text-xs text-text-muted">
                ={" "}
                {Math.floor(
                  creditBalanceHundredths /
                    Math.max(1, exchangeRateHundredthsPerMin)
                )}
                m available screen time
              </p>
            </div>
            <FocusCard
              creditsHundredths={creditBalanceHundredths}
              skinId={cardSkinId}
              size="mini-badge"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => navigate("S05_FOCUS_SETUP")}
              className="rounded-pill bg-accent py-2 text-xs font-semibold text-on-accent"
            >
              + Earn Focus
            </button>
            <button
              type="button"
              onClick={() => navigate("S09_WITHDRAW")}
              className="rounded-pill bg-surface-elevated border border-border py-2 text-xs font-semibold text-text"
            >
              Withdraw Time
            </button>
          </div>
        </div>
      </section>

      {/* 2. Android Ongoing Foreground Service Notification */}
      <section className="space-y-2">
        <h2 className="text-xs font-mono uppercase tracking-wider text-text-muted">
          Android Lock-Screen Ongoing Notification
        </h2>
        <div className="rounded-lg bg-surface-elevated border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-focus-glow" />
              <span className="text-xs font-semibold text-text">
                Focus Wallet Foreground Service • Now
              </span>
            </div>
            <span className="font-mono text-xs text-success">
              {activeUnlock ? "UNLOCK ACTIVE" : "SHIELD ARMED"}
            </span>
          </div>
          <p className="text-sm text-text">
            {activeUnlock
              ? `${Math.ceil(
                  activeUnlock.remainingSeconds / 60
                )}m left before distracting apps automatically re-lock.`
              : "5 apps & domains locked. Start a focus session to earn Credits."}
          </p>
          {activeUnlock && (
            <button
              type="button"
              onClick={relockEarlyWithRefund}
              className="rounded-pill bg-surface border border-border px-3 py-1.5 text-xs font-semibold text-text"
            >
              Re-lock Now & Refund Credits
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
