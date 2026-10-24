"use client";

import React, { useEffect } from "react";
import { BottomTabBar, NavTabId } from "@/components/primitives";
import { ScreenId, useWallet, WalletProvider } from "@/lib/wallet-store";
import {
  ARVaultScreen,
  FocusActiveScreen,
  FocusCompleteScreen,
  FocusSetupScreen,
  WalletHomeScreen,
  WithdrawScreen,
} from "./screens/WalletAndFocusScreens";
import {
  AndroidWidgetPreviewScreen,
  BlockListScreen,
  CardStudioScreen,
  LeaderboardScreen,
  OnboardingSurveyScreen,
  PaywallScreen,
  PermissionsSetupScreen,
  SystemSettingsScreen,
  TransactionsScreen,
} from "./screens/SecondaryAndSystemScreens";

const FULL_SCREEN_FLOWS: ScreenId[] = [
  "S01_ONBOARDING_SURVEY",
  "S02_PERMISSIONS",
  "S03_PAYWALL",
  "S06_FOCUS_ACTIVE",
  "S07_AR_VAULT",
  "S08_FOCUS_COMPLETE",
  "S09_WITHDRAW",
];

const QUERY_SCREEN_MAP: Record<string, ScreenId> = {
  S01: "S01_ONBOARDING_SURVEY",
  S02: "S02_PERMISSIONS",
  S03: "S03_PAYWALL",
  S04: "S04_WALLET_HOME",
  S05: "S05_FOCUS_SETUP",
  S06: "S06_FOCUS_ACTIVE",
  S07: "S07_AR_VAULT",
  S08: "S08_FOCUS_COMPLETE",
  S09: "S09_WITHDRAW",
  S10: "S10_BLOCK_LIST",
  S12: "S12_TRANSACTIONS",
  S13: "S13_CARD_STUDIO",
  S14: "S14_SYSTEM_SETTINGS",
  S15: "S15_LEADERBOARD",
  S16: "S16_WIDGET_PREVIEW",
};

function AppShellInner() {
  const { currentScreen, navigate, startFocusSession } = useWallet();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("screen")?.toUpperCase();
    if (requested && QUERY_SCREEN_MAP[requested]) {
      const target = QUERY_SCREEN_MAP[requested];
      if (target === "S06_FOCUS_ACTIVE") {
        startFocusSession(15 * 60, "screen_off");
      } else {
        navigate(target);
      }
    }
  }, [navigate, startFocusSession]);

  const activeTab: NavTabId =
    currentScreen === "S10_BLOCK_LIST"
      ? "blocks"
      : currentScreen === "S15_LEADERBOARD"
        ? "ranks"
        : currentScreen === "S14_SYSTEM_SETTINGS"
          ? "system"
          : "wallet";

  const handleSelectTab = (tab: NavTabId) => {
    if (tab === "wallet") navigate("S04_WALLET_HOME");
    if (tab === "blocks") navigate("S10_BLOCK_LIST");
    if (tab === "ranks") navigate("S15_LEADERBOARD");
    if (tab === "system") navigate("S14_SYSTEM_SETTINGS");
  };

  const showBottomNav = !FULL_SCREEN_FLOWS.includes(currentScreen);

  return (
    <div className="mx-auto max-w-[430px] min-h-screen bg-bg text-text flex flex-col justify-between border-x border-border shadow-pop">
      <main className="flex-1 overflow-y-auto">
        {currentScreen === "S01_ONBOARDING_SURVEY" && (
          <OnboardingSurveyScreen />
        )}
        {currentScreen === "S02_PERMISSIONS" && <PermissionsSetupScreen />}
        {currentScreen === "S03_PAYWALL" && <PaywallScreen />}
        {currentScreen === "S04_WALLET_HOME" && <WalletHomeScreen />}
        {currentScreen === "S05_FOCUS_SETUP" && <FocusSetupScreen />}
        {currentScreen === "S06_FOCUS_ACTIVE" && <FocusActiveScreen />}
        {currentScreen === "S07_AR_VAULT" && <ARVaultScreen />}
        {currentScreen === "S08_FOCUS_COMPLETE" && <FocusCompleteScreen />}
        {currentScreen === "S09_WITHDRAW" && <WithdrawScreen />}
        {currentScreen === "S10_BLOCK_LIST" && <BlockListScreen />}
        {currentScreen === "S12_TRANSACTIONS" && <TransactionsScreen />}
        {currentScreen === "S13_CARD_STUDIO" && <CardStudioScreen />}
        {currentScreen === "S14_SYSTEM_SETTINGS" && <SystemSettingsScreen />}
        {currentScreen === "S15_LEADERBOARD" && <LeaderboardScreen />}
        {currentScreen === "S16_WIDGET_PREVIEW" && (
          <AndroidWidgetPreviewScreen />
        )}
      </main>

      {showBottomNav && (
        <div className="sticky bottom-0 z-30">
          <BottomTabBar activeTab={activeTab} onSelectTab={handleSelectTab} />
        </div>
      )}
    </div>
  );
}

export function AppShell() {
  return (
    <WalletProvider>
      <AppShellInner />
    </WalletProvider>
  );
}
