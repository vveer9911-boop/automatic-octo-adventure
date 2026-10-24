"use client";

import React, { useState } from "react";
import {
  AppBlockRow,
  BottomTabBar,
  CARD_SKINS,
  CardSkinId,
  CircularIconButton,
  FocusCard,
  LeaderboardRow,
  NativeAdBannerCard,
  NavTabId,
  NumericKeypad,
  ProtectionToggleCard,
  TransactionLedgerRow,
} from "@/components/primitives";

export default function DesignSystemShowcasePage() {
  const [selectedSkin, setSelectedSkin] = useState<CardSkinId>("metal-classic");
  const [minutes, setMinutes] = useState<number>(15);
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [protectionOn, setProtectionOn] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<NavTabId>("wallet");

  return (
    <main className="mx-auto max-w-[430px] min-h-screen bg-bg text-text p-5 space-y-10 pb-28">
      <header className="space-y-1 border-b border-border pb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
          /replica-design • Primitives Showcase
        </p>
        <h1 className="text-2xl font-bold tracking-tight">
          Screen Time Wallet Design System
        </h1>
        <p className="text-sm text-text-muted">
          17/17 WCAG AA/AAA verified token pairs • Zero raw hex • Procedural card finishes
        </p>
      </header>

      {/* 1. FocusCard Hero + Gallery */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">1. FocusCard (Hero & 11 Skins)</h2>
        <FocusCard
          creditsHundredths={1500}
          exchangeRateHundredthsPerMin={100}
          label="LOCK IN CARD"
          skinId={selectedSkin}
        />
        <div className="flex gap-3 overflow-x-auto pb-2">
          {CARD_SKINS.map((skin) => (
            <FocusCard
              key={skin.id}
              creditsHundredths={1500}
              skinId={skin.id}
              label={skin.name}
              size="vertical-gallery"
              selected={selectedSkin === skin.id}
              onClick={() => setSelectedSkin(skin.id)}
            />
          ))}
        </div>
      </section>

      {/* 2. Free-Tier Native Ad Placements */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          2. NativeAdBannerCard (3 Balanced Free-Tier Slots)
        </h2>
        <div className="space-y-3">
          <p className="text-xs font-mono text-text-muted">
            Variant A: focus-top-pill (S06 Active Focus Top Slot)
          </p>
          <NativeAdBannerCard variant="focus-top-pill" />

          <p className="text-xs font-mono text-text-muted">
            Variant B: post-session-card (S08 Session Complete Summary)
          </p>
          <NativeAdBannerCard variant="post-session-card" />

          <p className="text-xs font-mono text-text-muted">
            Variant C: dashboard-compact (S04 Wallet Dashboard)
          </p>
          <NativeAdBannerCard variant="dashboard-compact" />
        </div>
      </section>

      {/* 3. CircularIconButtons */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">3. CircularIconButton</h2>
        <div className="flex items-center justify-around rounded-lg bg-surface border border-border p-4">
          <CircularIconButton
            icon="transactions"
            label="Transactions"
            size="lg"
            showLabelBelow
          />
          <CircularIconButton
            icon="withdraw"
            label="Withdraw"
            size="lg"
            showLabelBelow
          />
          <CircularIconButton
            icon="card-studio"
            label="Card Studio"
            size="lg"
            showLabelBelow
          />
        </div>
      </section>

      {/* 4. NumericKeypad & QuickDurationPills */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          4. NumericKeypad ({minutes} min selected)
        </h2>
        <div className="rounded-card bg-surface border border-border p-4">
          <NumericKeypad
            minutes={minutes}
            onSelectPreset={(m) => setMinutes(m)}
            onDigitPress={(d) =>
              setMinutes((prev) => Math.min(480, Number(`${prev}${d}`) || 1))
            }
            onBackspace={() =>
              setMinutes((prev) => Math.max(1, Math.floor(prev / 10)))
            }
          />
        </div>
      </section>

      {/* 5. AppBlockRow */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">5. AppBlockRow</h2>
        <AppBlockRow
          name="Instagram"
          packageOrDomain="com.instagram.android"
          category="social"
          isLocked={isLocked}
          onToggle={() => setIsLocked(!isLocked)}
        />
      </section>

      {/* 6. TransactionLedgerRow */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          6. TransactionLedgerRow (Bank Statement)
        </h2>
        <TransactionLedgerRow
          type="focus_earn"
          description="Focus Session (25m Screen-Off)"
          timestampLabel="Today, 14:20"
          amountHundredths={2500}
          balanceAfterHundredths={4000}
        />
        <TransactionLedgerRow
          type="withdraw_spend"
          description="Screen Time Withdrawal (15m)"
          timestampLabel="Today, 15:05"
          amountHundredths={-1500}
          balanceAfterHundredths={2500}
        />
        <TransactionLedgerRow
          type="relock_refund"
          description="Early Re-lock Refund (6m unused)"
          timestampLabel="Today, 15:14"
          amountHundredths={600}
          balanceAfterHundredths={3100}
        />
      </section>

      {/* 7. LeaderboardRow */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">7. LeaderboardRow</h2>
        <LeaderboardRow
          rank={1}
          username="malo"
          skinId="weave-carbon"
          focusedSeconds={70 * 3600}
        />
        <LeaderboardRow
          rank={2}
          username="tonkster"
          skinId="urban-sticker"
          focusedSeconds={53 * 3600 + 40 * 60}
          isCurrentUser
        />
      </section>

      {/* 8. ProtectionToggleCard */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">8. ProtectionToggleCard</h2>
        <ProtectionToggleCard
          title="Uninstall protection"
          subtitle="Stop apps being deleted while your blocks are on"
          footnote="While your blocks are on, Android Device Guard blocks app deletion until an active withdrawal unlocks your apps."
          enabled={protectionOn}
          onToggle={() => setProtectionOn(!protectionOn)}
        />
      </section>

      {/* 9. BottomTabBar */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">9. BottomTabBar</h2>
        <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
      </section>
    </main>
  );
}
