"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Fingerprint,
  Lock,
  Play,
  RefreshCcw,
  ShieldAlert,
  Smartphone,
  Sparkles,
  VolumeX,
} from "lucide-react";
import {
  CircularIconButton,
  FocusCard,
  NativeAdBannerCard,
  NumericKeypad,
  RecoverLogo,
} from "@/components/primitives";
import { FocusMode, useWallet } from "@/lib/wallet-store";
import { subscribeAccelerometerMotion } from "@/lib/android-bridge";

/* ============================================================================
 * S04: Wallet Home Screen (Ref: appstore_1.png)
 * ========================================================================== */
export function WalletHomeScreen() {
  const {
    creditBalanceHundredths,
    exchangeRateHundredthsPerMin,
    cardSkinId,
    cardLabel,
    blockRules,
    activeUnlock,
    navigate,
    relockEarlyWithRefund,
  } = useWallet();

  const lockedCount = blockRules.filter((r) => r.isActive).length;

  const [refundToast, setRefundToast] = useState<string | null>(null);

  const handleEarlyRelock = () => {
    const refunded = relockEarlyWithRefund();
    if (refunded > 0) {
      setRefundToast(
        `Apps re-locked early. +${(refunded / 100).toFixed(
          2
        )} unused credits refunded to your card.`
      );
    }
  };

  const formatCountdown = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div
      data-testid="screen-S04-wallet"
      className="flex flex-col justify-between min-h-[calc(100vh-68px)] p-5 space-y-5"
    >
      {/* Top Header matching appstore_1.png */}
      <header className="flex items-center justify-between pt-1">
        <CircularIconButton
          icon="settings"
          label="System Settings"
          onClick={() => navigate("S14_SYSTEM_SETTINGS")}
        />
        <div className="text-center">
          <h1
            aria-label="Recover Wallet"
            className="inline-flex items-center gap-2 text-base font-semibold tracking-tight text-text"
          >
            <RecoverLogo
              iconClassName="h-5 w-7 text-accent"
              wordmarkClassName="h-3.5 w-auto text-text"
            />
          </h1>
        </div>
        <CircularIconButton
          icon="card-studio"
          label="Customize Card"
          onClick={() => navigate("S13_CARD_STUDIO")}
        />
      </header>

      {/* Refund confirmation banner */}
      {refundToast && (
        <div
          role="status"
          className="rounded-md bg-surface-elevated border border-border p-3 text-xs text-success flex items-center justify-between gap-2"
        >
          <span>{refundToast}</span>
          <button
            type="button"
            onClick={() => setRefundToast(null)}
            className="text-text-muted hover:text-text font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Active Unlock Countdown Banner + Early Re-Lock Refund */}
      {activeUnlock && (
        <section
          aria-label="Active Screen Time Unlock"
          data-testid="active-unlock-banner"
          className="rounded-lg bg-surface-elevated border border-border-input p-4 shadow-surface space-y-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-success">
                Apps Temporarily Unlocked
              </p>
              <p className="text-lg font-bold font-mono text-text mt-0.5">
                {formatCountdown(activeUnlock.remainingSeconds)} remaining
              </p>
            </div>
            <button
              type="button"
              data-testid="btn-early-relock"
              onClick={handleEarlyRelock}
              className="rounded-pill bg-accent px-3.5 py-2 text-xs font-semibold text-on-accent flex items-center gap-1.5"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Re-lock & Refund
            </button>
          </div>
          <p className="text-xs text-text-muted">
            Done scrolling early? Lock your apps now to refund unused whole
            minutes back to your Focus Card.
          </p>
        </section>
      )}

      {/* Center Hero Focus Card */}
      <section className="my-auto py-1">
        <FocusCard
          creditsHundredths={creditBalanceHundredths}
          exchangeRateHundredthsPerMin={exchangeRateHundredthsPerMin}
          label={cardLabel}
          skinId={cardSkinId}
          onClick={() => navigate("S13_CARD_STUDIO")}
        />
      </section>

      {/* 3 Circular Action Buttons (Transactions, Withdraw, Card Studio — Spend Limit removed) */}
      <section
        aria-label="Wallet Quick Actions"
        className="flex items-center justify-around py-1"
      >
        <CircularIconButton
          icon="transactions"
          label="Transactions"
          size="lg"
          showLabelBelow
          onClick={() => navigate("S12_TRANSACTIONS")}
        />
        <CircularIconButton
          icon="withdraw"
          label="Withdraw"
          size="lg"
          showLabelBelow
          onClick={() => navigate("S09_WITHDRAW")}
        />
        <CircularIconButton
          icon="card-studio"
          label="Card Studio"
          size="lg"
          showLabelBelow
          onClick={() => navigate("S13_CARD_STUDIO")}
        />
      </section>

      {/* Primary CTA: Start Focus Session */}
      <div className="space-y-2">
        <button
          type="button"
          data-testid="btn-start-focus-setup"
          onClick={() => navigate("S05_FOCUS_SETUP")}
          className="w-full rounded-pill bg-accent py-3.5 px-6 text-base font-semibold text-on-accent shadow-surface flex items-center justify-center gap-2 transition-transform duration-fast active:scale-[0.99]"
        >
          <Play className="h-4 w-4 fill-current" />
          Start Focus Session
        </button>
        <div className="flex items-center justify-between px-1 text-xs text-text-muted">
          <button
            type="button"
            onClick={() => navigate("S01_ONBOARDING_SURVEY")}
            className="hover:text-text underline"
          >
            Setup Guide
          </button>
          <button
            type="button"
            onClick={() => navigate("S16_WIDGET_PREVIEW")}
            className="hover:text-text underline"
          >
            Android Widget & Notification
          </button>
        </div>
      </div>

      {/* Live App Blocker Guard Summary Card */}
      <section
        aria-label="App Blocker Status"
        className="rounded-lg bg-surface border border-border p-3.5 shadow-surface flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-pill bg-surface-elevated border border-border flex items-center justify-center shrink-0">
            <Lock className="h-4 w-4 text-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-text">
              {activeUnlock
                ? `Apps Temporarily Unlocked (${formatCountdown(activeUnlock.remainingSeconds)})`
                : `${lockedCount} Apps & Domains Locked by Recover`}
            </p>
            <p className="text-[11px] text-text-muted truncate">
              {activeUnlock
                ? "Tap Re-lock & Refund above when done early."
                : "Withdraw Credits to unlock apps by the minute."}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("S10_BLOCK_LIST")}
          className="rounded-pill bg-surface-elevated border border-border px-3 py-1.5 text-xs font-semibold text-text hover:border-border-input shrink-0"
        >
          Block List
        </button>
      </section>
    </div>
  );
}

/* ============================================================================
 * S05: Focus Session Setup Sheet
 * ========================================================================== */
export function FocusSetupScreen() {
  const {
    exchangeRateHundredthsPerMin,
    motionDetectionEnabled,
    navigate,
    startFocusSession,
  } = useWallet();

  const [durationMins, setDurationMins] = useState<number>(15);
  const [isStopwatch, setIsStopwatch] = useState<boolean>(false);
  const [silentCompletion, setSilentCompletion] = useState<boolean>(true);
  const [mode, setMode] = useState<FocusMode>(
    motionDetectionEnabled ? "motion_strict" : "screen_off"
  );

  const durations = [1, 15, 25, 45, 60];
  const estimatedCredits = durationMins.toFixed(2);
  const unlockedMinutes = Math.floor(
    (durationMins * 100) / Math.max(1, exchangeRateHundredthsPerMin)
  );

  const modes: {
    id: FocusMode;
    title: string;
    subtitle: string;
    Icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: "screen_off",
      title: "Screen-Off Session",
      subtitle: "Keep earning Credits while your phone screen is locked.",
      Icon: VolumeX,
    },
    {
      id: "motion_strict",
      title: "Motion Detection Guard",
      subtitle: "Accelerometer monitors phone movement. Picking it up forfeits the session.",
      Icon: Smartphone,
    },
    {
      id: "ar_vault",
      title: "AR Lock Box Vault",
      subtitle: "Seal your phone inside an augmented-reality camera vault before focusing.",
      Icon: Camera,
    },
    {
      id: "standard",
      title: "Standard Focus Timer",
      subtitle: "Count down on-screen while blocked apps remain locked.",
      Icon: Lock,
    },
  ];

  return (
    <div
      data-testid="screen-S05-focus-setup"
      className="flex flex-col justify-between min-h-[calc(100vh-68px)] p-5 space-y-6"
    >
      <header className="flex items-center justify-between">
        <CircularIconButton
          icon="back"
          label="Back to Wallet"
          onClick={() => navigate("S04_WALLET_HOME")}
        />
        <h1 className="text-base font-semibold text-text">Configure Focus</h1>
        <div className="w-11" aria-hidden="true" />
      </header>

      {/* Duration selector */}
      <section className="space-y-3">
        <label className="block text-xs font-mono uppercase tracking-wider text-text-muted">
          Session Length
        </label>
        <div className="grid grid-cols-6 gap-1.5">
          {durations.map((m) => {
            const active = !isStopwatch && durationMins === m;
            return (
              <button
                key={m}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setIsStopwatch(false);
                  setDurationMins(m);
                }}
                className={`rounded-md py-3 text-sm font-semibold border transition-colors ${
                  active
                    ? "bg-accent text-on-accent border-accent"
                    : "bg-surface text-text-muted border-border hover:text-text"
                }`}
              >
                {m}m
              </button>
            );
          })}
          <button
            type="button"
            data-testid="btn-stopwatch-mode"
            aria-pressed={isStopwatch}
            onClick={() => {
              setIsStopwatch(true);
              setDurationMins(60);
            }}
            className={`rounded-md py-3 text-xs font-semibold border transition-colors ${
              isStopwatch
                ? "bg-accent text-on-accent border-accent"
                : "bg-surface text-text-muted border-border hover:text-text"
            }`}
          >
            ∞ Open
          </button>
        </div>
        <div className="rounded-lg bg-surface border border-border p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-text-muted">
              {isStopwatch ? "Open Stopwatch Rate" : "Estimated Payout"}
            </p>
            <p className="text-xl font-bold font-mono text-success">
              {isStopwatch ? "+1.00 cr / min" : `+${estimatedCredits} credits`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted">Completion Alert</p>
            <button
              type="button"
              onClick={() => setSilentCompletion(!silentCompletion)}
              className="text-xs font-semibold text-focus-glow underline mt-0.5"
            >
              {silentCompletion
                ? "Silent / Haptic Only (Music-Safe)"
                : "Standard Chime"}
            </button>
          </div>
        </div>
      </section>

      {/* Discipline Mode Picker */}
      <section className="space-y-3 flex-1">
        <label className="block text-xs font-mono uppercase tracking-wider text-text-muted">
          Verification Mode
        </label>
        <div className="space-y-2.5">
          {modes.map(({ id, title, subtitle, Icon }) => {
            const selected = mode === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                onClick={() => setMode(id)}
                className={`w-full text-left rounded-lg p-3.5 border transition-colors flex items-start gap-3 ${
                  selected
                    ? "bg-surface-elevated border-border-input"
                    : "bg-surface border-border"
                }`}
              >
                <div className="h-9 w-9 rounded-pill bg-surface-elevated border border-border flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 text-text" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text">{title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <button
        type="button"
        data-testid="btn-launch-focus-session"
        onClick={() => startFocusSession(durationMins * 60, mode)}
        className="w-full rounded-pill bg-accent py-3.5 px-6 text-base font-semibold text-on-accent shadow-surface"
      >
        {mode === "ar_vault"
          ? "Open AR Lock Box Vault"
          : `Begin ${durationMins}m Focus Session`}
      </button>
    </div>
  );
}

/* ============================================================================
 * S06: Active Focus Session Screen (Ref: appstore_2.png)
 * Top banner hosts the Free-Tier Native Ad Pill (replaces coupon banner)
 * ========================================================================== */
export function FocusActiveScreen() {
  const {
    activeFocus,
    creditBalanceHundredths,
    exchangeRateHundredthsPerMin,
    cardSkinId,
    cardLabel,
    isPremium,
    motionSensitivity,
    tickFocusSecond,
    toggleScreenOffSimulation,
    triggerMotionSpike,
    simulateClockTamper,
    completeFocusSession,
    cancelFocusSession,
    recordAdImpression,
  } = useWallet();

  // Hardware Accelerometer hook when in motion_strict mode
  useEffect(() => {
    if (!activeFocus || activeFocus.mode !== "motion_strict") return;
    return subscribeAccelerometerMotion(motionSensitivity, () => {
      triggerMotionSpike();
    });
  }, [activeFocus, motionSensitivity, triggerMotionSpike]);

  if (!activeFocus) {
    return null;
  }

  const remainingSec = Math.max(
    0,
    activeFocus.plannedDurationSec - activeFocus.elapsedSec
  );
  const mm = String(Math.floor(remainingSec / 60)).padStart(2, "0");
  const ss = String(remainingSec % 60).padStart(2, "0");
  const liveCardCredits =
    creditBalanceHundredths + activeFocus.liveEarnedHundredths;

  return (
    <div
      data-testid="screen-S06-focus-active"
      className="flex flex-col justify-between min-h-screen p-5 space-y-6 bg-bg"
    >
      {/* Top Slot: Free-Tier Native Ad Pill (Replaces "Your coupon is waiting..." from appstore_2.png) */}
      <div className="pt-2">
        <NativeAdBannerCard
          variant="focus-top-pill"
          isPremium={isPremium}
          onAdClick={() => recordAdImpression("focus_top_pill")}
        />
      </div>

      {/* Motion Detection Warning Alert */}
      {activeFocus.motionWarnings > 0 && (
        <div
          role="alert"
          data-testid="motion-warning-banner"
          className="rounded-md bg-surface-elevated border border-danger p-3 flex items-center gap-2.5 text-xs text-danger"
        >
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>
            Motion detected ({activeFocus.motionWarnings}/2). Keep your phone
            still or this session will be forfeited.
          </span>
        </div>
      )}

      {/* Center Giant Countdown Timer matching appstore_2.png ("14:59 / Earning screen time...") */}
      <section className="my-auto text-center space-y-2 py-6">
        <div
          data-testid="focus-timer-display"
          className="font-mono text-6xl font-bold tracking-tight text-text"
        >
          {mm}:{ss}
        </div>
        <h1 className="text-base font-medium text-text-muted">
          {activeFocus.screenOffActive
            ? "Screen-Off active • Earning in background..."
            : "Earning screen time..."}
        </h1>
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            data-testid="btn-fast-forward-60s"
            onClick={() => tickFocusSecond(60)}
            className="rounded-pill bg-surface-elevated border border-border px-3 py-1 text-xs font-mono text-text-muted hover:text-text"
          >
            +1m Fast-Forward
          </button>
          <button
            type="button"
            onClick={toggleScreenOffSimulation}
            className="rounded-pill bg-surface-elevated border border-border px-3 py-1 text-xs font-mono text-text-muted hover:text-text"
          >
            {activeFocus.screenOffActive ? "Wake Screen" : "Lock Screen"}
          </button>
          {activeFocus.mode === "motion_strict" && (
            <button
              type="button"
              data-testid="btn-simulate-motion"
              onClick={triggerMotionSpike}
              className="rounded-pill bg-surface-elevated border border-border px-3 py-1 text-xs font-mono text-warning hover:text-text"
            >
              Simulate Shake
            </button>
          )}
          <button
            type="button"
            data-testid="btn-simulate-clock-tamper"
            onClick={simulateClockTamper}
            className="rounded-pill bg-surface-elevated border border-border px-3 py-1 text-xs font-mono text-text-muted hover:text-danger"
          >
            Test Clock Jump
          </button>
        </div>
      </section>

      {/* Bottom Live-Ticking Focus Card matching appstore_2.png ("15.02 credits") */}
      <section className="space-y-4">
        <FocusCard
          creditsHundredths={liveCardCredits}
          exchangeRateHundredthsPerMin={exchangeRateHundredthsPerMin}
          label={cardLabel}
          skinId={cardSkinId === "metal-classic" ? "urban-sticker" : cardSkinId}
          liveTicking
        />

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={cancelFocusSession}
            className="rounded-pill bg-surface-elevated border border-border py-3 text-sm font-semibold text-text-muted hover:text-text"
          >
            Give Up
          </button>
          <button
            type="button"
            data-testid="btn-complete-focus"
            onClick={completeFocusSession}
            className="rounded-pill bg-accent py-3 text-sm font-semibold text-on-accent"
          >
            Finish & Deposit
          </button>
        </div>
      </section>
    </div>
  );
}

/* ============================================================================
 * S07: AR Lock Box Vault Screen
 * ========================================================================== */
export function ARVaultScreen() {
  const { navigate } = useWallet();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [vaultSealed, setVaultSealed] = useState<boolean>(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (
      typeof navigator !== "undefined" &&
      navigator.mediaDevices?.getUserMedia
    ) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((s) => {
          stream = s;
          setCameraActive(true);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          setCameraActive(false);
        });
    }
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleSealVault = () => {
    setVaultSealed(true);
    setTimeout(() => {
      navigate("S06_FOCUS_ACTIVE");
    }, 450);
  };

  return (
    <div
      data-testid="screen-S07-ar-vault"
      className="flex flex-col justify-between min-h-screen p-5 bg-bg space-y-6"
    >
      <header className="flex items-center justify-between">
        <CircularIconButton
          icon="close"
          label="Cancel AR Vault"
          onClick={() => navigate("S05_FOCUS_SETUP")}
        />
        <h1 className="font-mono text-xs uppercase tracking-widest text-focus-glow">
          AR Lock Box Vault
        </h1>
        <div className="w-11" aria-hidden="true" />
      </header>

      <div className="relative flex-1 rounded-card border border-border bg-surface overflow-hidden flex flex-col items-center justify-center p-6 text-center space-y-5">
        {cameraActive && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
        )}
        <div className="relative z-10 h-44 w-44 rounded-card border-2 border-focus-glow bg-surface-elevated/90 shadow-pop flex flex-col items-center justify-center p-4 space-y-2">
          <Lock className="h-10 w-10 text-focus-glow" />
          <p className="font-mono text-xs uppercase tracking-wider text-text">
            {vaultSealed ? "Vault Sealed" : "Align Desk Surface"}
          </p>
          <p className="text-[11px] text-text-muted">
            {cameraActive
              ? "Camera feed active"
              : "3D Spatial Vault Ready"}
          </p>
        </div>
        <p className="relative z-10 text-sm text-text-muted max-w-xs">
          Place your phone down inside the virtual vault frame to lock all
          distracting apps and begin earning Credits.
        </p>
      </div>

      <button
        type="button"
        data-testid="btn-seal-ar-vault"
        onClick={handleSealVault}
        className="w-full rounded-pill bg-accent py-3.5 text-base font-semibold text-on-accent"
      >
        Lock Phone in AR Vault
      </button>
    </div>
  );
}

/* ============================================================================
 * S08: Session Complete Summary & Post-Focus Ad Placement
 * (Replaces the scratch coupon modal with clean summary + Post-Session Ad)
 * ========================================================================== */
export function FocusCompleteScreen() {
  const {
    lastCompletedFocus,
    creditBalanceHundredths,
    exchangeRateHundredthsPerMin,
    cardSkinId,
    cardLabel,
    isPremium,
    navigate,
    recordAdImpression,
  } = useWallet();

  const status = lastCompletedFocus?.status ?? "completed";
  const earnedCredits = (
    (lastCompletedFocus?.earnedHundredths ?? 1500) / 100
  ).toFixed(2);
  const minsFocused = Math.max(
    1,
    Math.round((lastCompletedFocus?.durationSec ?? 900) / 60)
  );

  return (
    <div
      data-testid="screen-S08-focus-complete"
      className="flex flex-col justify-between min-h-screen p-5 bg-bg space-y-6"
    >
      <header className="pt-4 text-center space-y-2">
        <div className="mx-auto h-12 w-12 rounded-pill bg-surface-elevated border border-border flex items-center justify-center">
          {status === "completed" ? (
            <CheckCircle2 className="h-6 w-6 text-success" />
          ) : (
            <ShieldAlert className="h-6 w-6 text-danger" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-text">
          {status === "completed"
            ? `+${earnedCredits} Credits Earned`
            : status === "forfeited_clock_tamper"
              ? "Session Invalidated (Clock Tamper)"
              : "Session Forfeited (Phone Moved)"}
        </h1>
        <p className="text-sm text-text-muted">
          {status === "completed"
            ? `${minsFocused} minutes of focused time deposited straight to your card.`
            : "Keep your phone still and system clock unchanged to earn Credits."}
        </p>
      </header>

      {/* Updated Focus Card */}
      <FocusCard
        creditsHundredths={creditBalanceHundredths}
        exchangeRateHundredthsPerMin={exchangeRateHundredthsPerMin}
        label={cardLabel}
        skinId={cardSkinId}
      />

      {/* Free-Tier Post-Session Ad Placement (replaces the removed coupon scratch modal) */}
      <NativeAdBannerCard
        variant="post-session-card"
        isPremium={isPremium}
        onUpgradeClick={() => navigate("S03_PAYWALL")}
        onAdClick={() => recordAdImpression("post_session_card")}
      />

      <button
        type="button"
        data-testid="btn-return-wallet-after-focus"
        onClick={() => navigate("S04_WALLET_HOME")}
        className="w-full rounded-pill bg-accent py-3.5 text-base font-semibold text-on-accent"
      >
        Back to Wallet
      </button>
    </div>
  );
}

/* ============================================================================
 * S09: Withdraw Screen Time (Ref: appstore_3.png)
 * Supports 1-minute minimum withdrawals, quick pills, 0-9 keypad & Biometrics
 * ========================================================================== */
export function WithdrawScreen() {
  const {
    creditBalanceHundredths,
    exchangeRateHundredthsPerMin,
    cardSkinId,
    biometricWithdrawEnabled,
    navigate,
    startWithdrawal,
  } = useWallet();

  const [minutes, setMinutes] = useState<number>(15);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [biometricPromptOpen, setBiometricPromptOpen] =
    useState<boolean>(false);

  const balanceCredits = (creditBalanceHundredths / 100).toFixed(
    creditBalanceHundredths % 100 === 0 ? 0 : 2
  );
  const ratePerMin = (exchangeRateHundredthsPerMin / 100).toFixed(
    exchangeRateHundredthsPerMin % 100 === 0 ? 0 : 1
  );
  const requiredCredits = (
    (minutes * exchangeRateHundredthsPerMin) /
    100
  ).toFixed(2);

  const handleDigit = (digit: string) => {
    setErrorMsg(null);
    setMinutes((prev) => {
      const combined = Number(`${prev === 0 ? "" : prev}${digit}`);
      return Math.min(480, combined || 0);
    });
  };

  const handleBackspace = () => {
    setErrorMsg(null);
    setMinutes((prev) => Math.floor(prev / 10));
  };

  const executeWithdraw = () => {
    const res = startWithdrawal(minutes);
    if (!res.ok) {
      setErrorMsg(res.error ?? "Unable to withdraw.");
    }
    setBiometricPromptOpen(false);
  };

  const handleConfirmClick = () => {
    setErrorMsg(null);
    if (minutes < 1) {
      setErrorMsg("Minimum withdrawal is 1 minute.");
      return;
    }
    if (minutes * exchangeRateHundredthsPerMin > creditBalanceHundredths) {
      setErrorMsg(
        `Insufficient credits. Need ${requiredCredits} credits, balance is ${balanceCredits}.`
      );
      return;
    }
    if (biometricWithdrawEnabled) {
      setBiometricPromptOpen(true);
      return;
    }
    executeWithdraw();
  };

  return (
    <div
      data-testid="screen-S09-withdraw"
      className="flex flex-col justify-between min-h-screen p-5 bg-bg space-y-4"
    >
      {/* Top Header matching appstore_3.png */}
      <header className="flex items-center justify-between pt-1">
        <CircularIconButton
          icon="close"
          label="Close Withdraw"
          onClick={() => navigate("S04_WALLET_HOME")}
        />
        <div className="text-center">
          <h1 className="text-base font-semibold text-text">Withdraw</h1>
          <p
            data-testid="withdraw-balance-label"
            className="text-xs text-text-muted"
          >
            Balance: {balanceCredits} credits
          </p>
        </div>
        <CircularIconButton
          icon="more"
          label="Exchange Rate Settings"
          onClick={() => navigate("S14_SYSTEM_SETTINGS")}
        />
      </header>

      {/* Center Giant Minute Readout + Exchange Rate Pill matching appstore_3.png */}
      <section className="my-auto text-center space-y-3 py-4">
        <div className="inline-flex items-baseline gap-1.5">
          <span
            data-testid="withdraw-minutes-display"
            className="font-sans text-6xl font-bold tracking-tight text-text"
          >
            {minutes}
          </span>
          <span className="text-4xl font-semibold text-text-muted">min</span>
        </div>

        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-pill bg-surface border border-border px-3.5 py-1.5 text-xs text-text">
            <FocusCard
              creditsHundredths={creditBalanceHundredths}
              skinId={cardSkinId}
              size="mini-badge"
            />
            <span className="font-semibold">Recover Pay</span>
            <span className="text-text-muted">
              • {ratePerMin} credit / minute ({requiredCredits} cr)
            </span>
          </div>
        </div>

        {errorMsg && (
          <p
            role="alert"
            data-testid="withdraw-error"
            className="text-xs font-medium text-danger pt-1"
          >
            {errorMsg}
          </p>
        )}
      </section>

      {/* Biometric Verification Modal when enabled */}
      {biometricPromptOpen && (
        <div
          role="dialog"
          aria-label="Biometric Verification Required"
          data-testid="biometric-modal"
          className="rounded-card bg-surface-elevated border border-border-input p-4 space-y-3 text-center"
        >
          <Fingerprint className="mx-auto h-8 w-8 text-focus-glow" />
          <p className="text-sm font-semibold text-text">
            Confirm {minutes}m Withdrawal with Biometrics
          </p>
          <p className="text-xs text-text-muted">
            Verify your fingerprint or face unlock to spend {requiredCredits}{" "}
            credits.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setBiometricPromptOpen(false)}
              className="rounded-pill bg-surface border border-border py-2 text-xs font-semibold text-text-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              data-testid="btn-biometric-verify"
              onClick={executeWithdraw}
              className="rounded-pill bg-accent py-2 text-xs font-semibold text-on-accent"
            >
              Verify Fingerprint
            </button>
          </div>
        </div>
      )}

      {/* Quick Pills + Numeric Keypad + Withdraw Submit */}
      <section className="space-y-4">
        <NumericKeypad
          minutes={minutes}
          onSelectPreset={(m) => {
            setErrorMsg(null);
            setMinutes(m);
          }}
          onDigitPress={handleDigit}
          onBackspace={handleBackspace}
        />

        <button
          type="button"
          data-testid="btn-confirm-withdraw"
          onClick={handleConfirmClick}
          className="w-full rounded-pill bg-accent py-3.5 text-base font-semibold text-on-accent shadow-surface"
        >
          Unlock Apps for {minutes} {minutes === 1 ? "Minute" : "Minutes"}
        </button>
      </section>
    </div>
  );
}
