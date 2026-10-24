"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CardSkinId } from "@/components/primitives";
import {
  AndroidPermissionStatus,
  detectClockTamper,
  MonotonicClockSample,
  sampleClock,
} from "./android-bridge";

export type ScreenId =
  | "S01_ONBOARDING_SURVEY"
  | "S02_PERMISSIONS"
  | "S03_PAYWALL"
  | "S04_WALLET_HOME"
  | "S05_FOCUS_SETUP"
  | "S06_FOCUS_ACTIVE"
  | "S07_AR_VAULT"
  | "S08_FOCUS_COMPLETE"
  | "S09_WITHDRAW"
  | "S10_BLOCK_LIST"
  | "S12_TRANSACTIONS"
  | "S13_CARD_STUDIO"
  | "S14_SYSTEM_SETTINGS"
  | "S15_LEADERBOARD"
  | "S16_WIDGET_PREVIEW";

export type FocusMode =
  | "standard"
  | "screen_off"
  | "motion_strict"
  | "ar_vault";

export interface BlockRuleItem {
  id: string;
  targetType: "app" | "category" | "domain";
  packageOrDomain: string;
  displayName: string;
  category: "social" | "games" | "video" | "messaging" | "browsers" | "other";
  isActive: boolean;
}

export interface LedgerEntry {
  id: string;
  type:
    | "starting_bonus"
    | "focus_earn"
    | "withdraw_spend"
    | "relock_refund"
    | "motion_penalty";
  description: string;
  timestampLabel: string;
  createdAtIso: string;
  amountHundredths: number;
  balanceAfterHundredths: number;
  idempotencyKey: string;
}

export interface ActiveFocusSession {
  id: string;
  mode: FocusMode;
  plannedDurationSec: number;
  elapsedSec: number;
  liveEarnedHundredths: number;
  motionWarnings: number;
  screenOffActive: boolean;
  arVaultLocked: boolean;
  startClockSample: MonotonicClockSample;
  status:
    | "active"
    | "completed"
    | "forfeited_motion"
    | "forfeited_clock_tamper"
    | "cancelled";
}

export interface ActiveUnlockSession {
  id: string;
  requestedMinutes: number;
  remainingSeconds: number;
  creditsSpentHundredths: number;
  exchangeRateHundredthsPerMin: number;
  startedAtIso: string;
}

export interface RankCompetitor {
  rank: number;
  username: string;
  skinId: CardSkinId;
  focusedSeconds: number;
  isFriend: boolean;
  isCurrentUser?: boolean;
}

export interface GoogleMockUser {
  name: string;
  email: string;
  handle: string;
}

export interface WalletState {
  currentScreen: ScreenId;
  onboardingCompleted: boolean;
  username: string;
  googleUser: GoogleMockUser | null;
  creditBalanceHundredths: number;
  exchangeRateHundredthsPerMin: number;
  cardSkinId: CardSkinId;
  cardLabel: string;
  uninstallProtectionEnabled: boolean;
  biometricWithdrawEnabled: boolean;
  motionDetectionEnabled: boolean;
  motionSensitivity: "low" | "medium" | "high";
  isPremium: boolean;
  permissions: AndroidPermissionStatus;
  blockRules: BlockRuleItem[];
  ledger: LedgerEntry[];
  activeFocus: ActiveFocusSession | null;
  lastCompletedFocus: {
    durationSec: number;
    earnedHundredths: number;
    mode: FocusMode;
    status: "completed" | "forfeited_motion" | "forfeited_clock_tamper";
  } | null;
  activeUnlock: ActiveUnlockSession | null;
  shieldTriggeredApp: BlockRuleItem | null;
  competitors: RankCompetitor[];
  adImpressionsCount: number;
}

const INITIAL_BLOCK_RULES: BlockRuleItem[] = [
  {
    id: "br-1",
    targetType: "app",
    packageOrDomain: "com.instagram.android",
    displayName: "Instagram",
    category: "social",
    isActive: true,
  },
  {
    id: "br-2",
    targetType: "app",
    packageOrDomain: "com.zhiliaoapp.musically",
    displayName: "TikTok",
    category: "video",
    isActive: true,
  },
  {
    id: "br-3",
    targetType: "app",
    packageOrDomain: "com.twitter.android",
    displayName: "X (Twitter)",
    category: "social",
    isActive: true,
  },
  {
    id: "br-4",
    targetType: "app",
    packageOrDomain: "com.google.android.youtube",
    displayName: "YouTube Shorts",
    category: "video",
    isActive: true,
  },
  {
    id: "br-5",
    targetType: "app",
    packageOrDomain: "com.reddit.frontpage",
    displayName: "Reddit",
    category: "social",
    isActive: true,
  },
  {
    id: "br-6",
    targetType: "category",
    packageOrDomain: "category.games",
    displayName: "All Mobile Games",
    category: "games",
    isActive: false,
  },
  {
    id: "br-7",
    targetType: "domain",
    packageOrDomain: "news.ycombinator.com",
    displayName: "news.ycombinator.com",
    category: "browsers",
    isActive: true,
  },
];

const INITIAL_LEDGER: LedgerEntry[] = [
  {
    id: "tx-seed-1",
    type: "starting_bonus",
    description: "Initial Wallet Opening Deposit",
    timestampLabel: "Yesterday, 09:00",
    createdAtIso: "2026-10-23T09:00:00Z",
    amountHundredths: 1000,
    balanceAfterHundredths: 1000,
    idempotencyKey: "seed-opening-deposit",
  },
  {
    id: "tx-seed-2",
    type: "focus_earn",
    description: "Focus Session (20m Screen-Off)",
    timestampLabel: "Yesterday, 18:30",
    createdAtIso: "2026-10-23T18:30:00Z",
    amountHundredths: 2000,
    balanceAfterHundredths: 3000,
    idempotencyKey: "seed-focus-20m",
  },
  {
    id: "tx-seed-3",
    type: "withdraw_spend",
    description: "Screen Time Withdrawal (15m)",
    timestampLabel: "Today, 11:15",
    createdAtIso: "2026-10-24T11:15:00Z",
    amountHundredths: -1500,
    balanceAfterHundredths: 1500,
    idempotencyKey: "seed-withdraw-15m",
  },
];

const INITIAL_COMPETITORS: RankCompetitor[] = [
  {
    rank: 1,
    username: "kairo_dev",
    skinId: "weave-carbon",
    focusedSeconds: 68 * 3600 + 20 * 60,
    isFriend: true,
  },
  {
    rank: 2,
    username: "sana_med",
    skinId: "urban-sticker",
    focusedSeconds: 52 * 3600 + 45 * 60,
    isFriend: true,
  },
  {
    rank: 3,
    username: "lucas_ml",
    skinId: "circuit-silver",
    focusedSeconds: 44 * 3600 + 15 * 60,
    isFriend: false,
  },
  {
    rank: 4,
    username: "priya_cs",
    skinId: "metal-obsidian",
    focusedSeconds: 39 * 3600 + 10 * 60,
    isFriend: true,
  },
  {
    rank: 5,
    username: "marco_eth",
    skinId: "circuit-dark",
    focusedSeconds: 36 * 3600 + 30 * 60,
    isFriend: false,
  },
  {
    rank: 6,
    username: "nina_arch",
    skinId: "weave-cobalt",
    focusedSeconds: 35 * 3600 + 40 * 60,
    isFriend: false,
  },
  {
    rank: 7,
    username: "devon_sys",
    skinId: "weave-carbon",
    focusedSeconds: 33 * 3600 + 50 * 60,
    isFriend: false,
  },
];

interface WalletContextValue extends WalletState {
  navigate: (screen: ScreenId) => void;
  completeOnboarding: (selectedAppIds?: string[]) => void;
  grantPermission: (key: keyof AndroidPermissionStatus) => void;
  startFocusSession: (plannedDurationSec: number, mode: FocusMode) => void;
  tickFocusSecond: (secondsDelta?: number) => void;
  toggleScreenOffSimulation: () => void;
  triggerMotionSpike: () => void;
  simulateClockTamper: () => void;
  completeFocusSession: () => void;
  cancelFocusSession: () => void;
  startWithdrawal: (requestedMinutes: number) => {
    ok: boolean;
    error?: string;
  };
  relockEarlyWithRefund: () => number;
  expireActiveUnlock: () => void;
  toggleBlockRule: (id: string) => void;
  addCustomDomainRule: (domain: string) => void;
  triggerShieldForApp: (app: BlockRuleItem | null) => void;
  updateCardStyle: (skinId: CardSkinId, label: string) => void;
  updateSystemSettings: (patch: {
    uninstallProtectionEnabled?: boolean;
    biometricWithdrawEnabled?: boolean;
    motionDetectionEnabled?: boolean;
    motionSensitivity?: "low" | "medium" | "high";
    exchangeRateHundredthsPerMin?: number;
  }) => { ok: boolean; error?: string };
  addFriendByUsername: (username: string) => { ok: boolean; message: string };
  upgradeToPremium: () => void;
  recordAdImpression: (
    placement: "focus_top_pill" | "post_session_card" | "dashboard_native"
  ) => void;
  signInWithGoogleMock: () => void;
  signOutGoogleMock: () => void;
  myFocusedSecondsThisWeek: number;
}

const WalletContext = createContext<WalletContextValue | null>(null);

const STORAGE_KEY = "recover_wallet_state_v1";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [currentScreen, setCurrentScreen] =
    useState<ScreenId>("S04_WALLET_HOME");
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("recover_user");
  const [googleUser, setGoogleUser] = useState<GoogleMockUser | null>({
    name: "Recover Cardholder",
    email: "recover.user@gmail.com",
    handle: "recover_user",
  });
  const [creditBalanceHundredths, setCreditBalanceHundredths] =
    useState<number>(1500); // 15.00 credits
  const [exchangeRateHundredthsPerMin, setExchangeRateHundredthsPerMin] =
    useState<number>(100); // 1.00 credit / minute
  const [cardSkinId, setCardSkinId] = useState<CardSkinId>("metal-classic");
  const [cardLabel, setCardLabel] = useState<string>("RECOVER CARD");
  const [uninstallProtectionEnabled, setUninstallProtectionEnabled] =
    useState<boolean>(true);
  const [biometricWithdrawEnabled, setBiometricWithdrawEnabled] =
    useState<boolean>(false);
  const [motionDetectionEnabled, setMotionDetectionEnabled] =
    useState<boolean>(true);
  const [motionSensitivity, setMotionSensitivity] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [isPremium, setIsPremium] = useState<boolean>(true);
  const [permissions, setPermissions] = useState<AndroidPermissionStatus>({
    usageStatsGranted: true,
    overlayShieldGranted: true,
    notificationsGranted: true,
    deviceAdminGranted: true,
  });
  const [blockRules, setBlockRules] =
    useState<BlockRuleItem[]>(INITIAL_BLOCK_RULES);
  const [ledger, setLedger] = useState<LedgerEntry[]>(INITIAL_LEDGER);
  const [activeFocus, setActiveFocus] = useState<ActiveFocusSession | null>(
    null
  );
  const [lastCompletedFocus, setLastCompletedFocus] =
    useState<WalletState["lastCompletedFocus"]>(null);
  const [activeUnlock, setActiveUnlock] = useState<ActiveUnlockSession | null>(
    null
  );
  const [shieldTriggeredApp, setShieldTriggeredApp] =
    useState<BlockRuleItem | null>(null);
  const [competitors, setCompetitors] =
    useState<RankCompetitor[]>(INITIAL_COMPETITORS);
  const [adImpressionsCount, setAdImpressionsCount] = useState<number>(0);
  const [myFocusedSecondsThisWeek, setMyFocusedSecondsThisWeek] =
    useState<number>(70 * 60); // 1h 10m matching appstore_7.png

  const processedKeysRef = useRef<Set<string>>(new Set());

  const navigate = useCallback((screen: ScreenId) => {
    setCurrentScreen(screen);
  }, []);

  const completeOnboarding = useCallback((selectedAppIds?: string[]) => {
    if (selectedAppIds && selectedAppIds.length > 0) {
      setBlockRules((prev) =>
        prev.map((r) => ({
          ...r,
          isActive: selectedAppIds.includes(r.id),
        }))
      );
    }
    setOnboardingCompleted(true);
    setCurrentScreen("S04_WALLET_HOME");
  }, []);

  const grantPermission = useCallback((key: keyof AndroidPermissionStatus) => {
    setPermissions((prev) => ({ ...prev, [key]: true }));
  }, []);

  const startFocusSession = useCallback(
    (plannedDurationSec: number, mode: FocusMode) => {
      const newSession: ActiveFocusSession = {
        id: `focus-${Date.now()}`,
        mode,
        plannedDurationSec,
        elapsedSec: 0,
        liveEarnedHundredths: 0,
        motionWarnings: 0,
        screenOffActive: mode === "screen_off",
        arVaultLocked: mode === "ar_vault",
        startClockSample: sampleClock(),
        status: "active",
      };
      setActiveFocus(newSession);
      setCurrentScreen(
        mode === "ar_vault" ? "S07_AR_VAULT" : "S06_FOCUS_ACTIVE"
      );
    },
    []
  );

  const tickFocusSecond = useCallback((secondsDelta = 1) => {
    setActiveFocus((prev) => {
      if (!prev || prev.status !== "active") return prev;
      const nextElapsed = prev.elapsedSec + secondsDelta;
      // 1.00 credit (100 hundredths) per 60 seconds = 1.6667 hundredths/sec
      const nextEarned = Math.round((nextElapsed / 60) * 100);
      return {
        ...prev,
        elapsedSec: nextElapsed,
        liveEarnedHundredths: nextEarned,
      };
    });
  }, []);

  const toggleScreenOffSimulation = useCallback(() => {
    setActiveFocus((prev) =>
      prev ? { ...prev, screenOffActive: !prev.screenOffActive } : null
    );
  }, []);

  const triggerMotionSpike = useCallback(() => {
    setActiveFocus((prev) => {
      if (!prev || prev.status !== "active") return prev;
      const nextWarnings = prev.motionWarnings + 1;
      if (prev.mode === "motion_strict" && nextWarnings >= 2) {
        const key = `forfeit-${prev.id}`;
        if (!processedKeysRef.current.has(key)) {
          processedKeysRef.current.add(key);
          setLedger((old) => [
            {
              id: `tx-${Date.now()}`,
              type: "motion_penalty",
              description: "Focus Session Forfeited (Excessive Phone Motion)",
              timestampLabel: "Just now",
              createdAtIso: new Date().toISOString(),
              amountHundredths: -Math.min(50, creditBalanceHundredths),
              balanceAfterHundredths: Math.max(
                0,
                creditBalanceHundredths - 50
              ),
              idempotencyKey: key,
            },
            ...old,
          ]);
          setCreditBalanceHundredths((b) => Math.max(0, b - 50));
        }
        setLastCompletedFocus({
          durationSec: prev.elapsedSec,
          earnedHundredths: 0,
          mode: prev.mode,
          status: "forfeited_motion",
        });
        setCurrentScreen("S08_FOCUS_COMPLETE");
        return null;
      }
      return { ...prev, motionWarnings: nextWarnings };
    });
  }, [creditBalanceHundredths]);

  const simulateClockTamper = useCallback(() => {
    setActiveFocus((prev) => {
      if (!prev) return null;
      const tamperedSample: MonotonicClockSample = {
        wallTimeMs: prev.startClockSample.wallTimeMs + 3600 * 1000,
        monotonicMs: prev.startClockSample.monotonicMs + 5 * 1000,
      };
      const check = detectClockTamper(prev.startClockSample, tamperedSample);
      if (check.tampered) {
        setLastCompletedFocus({
          durationSec: prev.elapsedSec,
          earnedHundredths: 0,
          mode: prev.mode,
          status: "forfeited_clock_tamper",
        });
        setCurrentScreen("S08_FOCUS_COMPLETE");
        return null;
      }
      return prev;
    });
  }, []);

  const completeFocusSession = useCallback(() => {
    setActiveFocus((prev) => {
      if (!prev) return null;
      const effectiveSeconds = Math.max(60, prev.elapsedSec || prev.plannedDurationSec);
      const earnedHundredths = Math.max(
        100,
        Math.round((effectiveSeconds / 60) * 100)
      );
      const key = `complete-${prev.id}`;
      if (!processedKeysRef.current.has(key)) {
        processedKeysRef.current.add(key);
        const nextBalance = creditBalanceHundredths + earnedHundredths;
        setCreditBalanceHundredths(nextBalance);
        setMyFocusedSecondsThisWeek((s) => s + effectiveSeconds);
        const minsLabel = Math.round(effectiveSeconds / 60);
        setLedger((old) => [
          {
            id: `tx-${Date.now()}`,
            type: "focus_earn",
            description: `Focus Session (${minsLabel}m ${
              prev.mode === "screen_off"
                ? "Screen-Off"
                : prev.mode === "ar_vault"
                  ? "AR Vault"
                  : prev.mode === "motion_strict"
                    ? "Strict Motion"
                    : "Standard"
            })`,
            timestampLabel: "Just now",
            createdAtIso: new Date().toISOString(),
            amountHundredths: earnedHundredths,
            balanceAfterHundredths: nextBalance,
            idempotencyKey: key,
          },
          ...old,
        ]);
      }
      setLastCompletedFocus({
        durationSec: effectiveSeconds,
        earnedHundredths,
        mode: prev.mode,
        status: "completed",
      });
      setCurrentScreen("S08_FOCUS_COMPLETE");
      return null;
    });
  }, [creditBalanceHundredths]);

  const cancelFocusSession = useCallback(() => {
    setActiveFocus(null);
    setCurrentScreen("S04_WALLET_HOME");
  }, []);

  const startWithdrawal = useCallback(
    (requestedMinutes: number) => {
      if (requestedMinutes < 1) {
        return { ok: false, error: "Minimum withdrawal is 1 minute." };
      }
      const costHundredths = requestedMinutes * exchangeRateHundredthsPerMin;
      if (costHundredths > creditBalanceHundredths) {
        return {
          ok: false,
          error: `Insufficient credits. Need ${(costHundredths / 100).toFixed(
            2
          )} credits, have ${(creditBalanceHundredths / 100).toFixed(2)}.`,
        };
      }
      const nextBalance = creditBalanceHundredths - costHundredths;
      const unlockId = `unlock-${Date.now()}`;
      setCreditBalanceHundredths(nextBalance);
      setActiveUnlock({
        id: unlockId,
        requestedMinutes,
        remainingSeconds: requestedMinutes * 60,
        creditsSpentHundredths: costHundredths,
        exchangeRateHundredthsPerMin,
        startedAtIso: new Date().toISOString(),
      });
      setShieldTriggeredApp(null);
      setLedger((old) => [
        {
          id: `tx-${Date.now()}`,
          type: "withdraw_spend",
          description: `Screen Time Withdrawal (${requestedMinutes}m)`,
          timestampLabel: "Just now",
          createdAtIso: new Date().toISOString(),
          amountHundredths: -costHundredths,
          balanceAfterHundredths: nextBalance,
          idempotencyKey: unlockId,
        },
        ...old,
      ]);
      setCurrentScreen("S04_WALLET_HOME");
      return { ok: true };
    },
    [creditBalanceHundredths, exchangeRateHundredthsPerMin]
  );

  const relockEarlyWithRefund = useCallback(() => {
    if (!activeUnlock) return 0;
    const unusedWholeMinutes = Math.max(
      1,
      Math.floor(activeUnlock.remainingSeconds / 60)
    );
    const refundHundredths = Math.min(
      activeUnlock.creditsSpentHundredths,
      unusedWholeMinutes * activeUnlock.exchangeRateHundredthsPerMin
    );
    const nextBalance = creditBalanceHundredths + refundHundredths;
    setCreditBalanceHundredths(nextBalance);
    setLedger((old) => [
      {
        id: `tx-refund-${Date.now()}`,
        type: "relock_refund",
        description: `Early Re-lock Refund (${unusedWholeMinutes}m unused)`,
        timestampLabel: "Just now",
        createdAtIso: new Date().toISOString(),
        amountHundredths: refundHundredths,
        balanceAfterHundredths: nextBalance,
        idempotencyKey: `refund-${activeUnlock.id}`,
      },
      ...old,
    ]);
    setActiveUnlock(null);
    return refundHundredths;
  }, [activeUnlock, creditBalanceHundredths]);

  const expireActiveUnlock = useCallback(() => {
    setActiveUnlock(null);
  }, []);

  // Live timer intervals for activeFocus and activeUnlock
  useEffect(() => {
    if (!activeFocus || activeFocus.status !== "active") return;
    const interval = setInterval(() => {
      tickFocusSecond(1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeFocus, tickFocusSecond]);

  useEffect(() => {
    if (!activeUnlock) return;
    const interval = setInterval(() => {
      setActiveUnlock((prev) => {
        if (!prev) return null;
        if (prev.remainingSeconds <= 1) {
          return null;
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeUnlock]);

  const toggleBlockRule = useCallback((id: string) => {
    setBlockRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  }, []);

  const addCustomDomainRule = useCallback((domain: string) => {
    const cleaned = domain.trim().toLowerCase();
    if (!cleaned) return;
    setBlockRules((prev) => [
      {
        id: `br-${Date.now()}`,
        targetType: "domain",
        packageOrDomain: cleaned,
        displayName: cleaned,
        category: "browsers",
        isActive: true,
      },
      ...prev,
    ]);
  }, []);

  const triggerShieldForApp = useCallback((app: BlockRuleItem | null) => {
    setShieldTriggeredApp(app);
  }, []);

  const updateCardStyle = useCallback((skinId: CardSkinId, label: string) => {
    setCardSkinId(skinId);
    setCardLabel(label.trim().slice(0, 20) || "LOCK IN CARD");
  }, []);

  const updateSystemSettings = useCallback(
    (patch: {
      uninstallProtectionEnabled?: boolean;
      biometricWithdrawEnabled?: boolean;
      motionDetectionEnabled?: boolean;
      motionSensitivity?: "low" | "medium" | "high";
      exchangeRateHundredthsPerMin?: number;
    }) => {
      const anyActiveBlocks = blockRules.some((r) => r.isActive);
      if (
        patch.uninstallProtectionEnabled === false &&
        uninstallProtectionEnabled &&
        anyActiveBlocks &&
        !activeUnlock
      ) {
        return {
          ok: false,
          error:
            "Uninstall protection cannot be turned off while apps are locked. Withdraw screen time first to lift protection.",
        };
      }
      if (typeof patch.uninstallProtectionEnabled === "boolean") {
        setUninstallProtectionEnabled(patch.uninstallProtectionEnabled);
      }
      if (typeof patch.biometricWithdrawEnabled === "boolean") {
        setBiometricWithdrawEnabled(patch.biometricWithdrawEnabled);
      }
      if (typeof patch.motionDetectionEnabled === "boolean") {
        setMotionDetectionEnabled(patch.motionDetectionEnabled);
      }
      if (patch.motionSensitivity) {
        setMotionSensitivity(patch.motionSensitivity);
      }
      if (typeof patch.exchangeRateHundredthsPerMin === "number") {
        setExchangeRateHundredthsPerMin(patch.exchangeRateHundredthsPerMin);
      }
      return { ok: true };
    },
    [activeUnlock, blockRules, uninstallProtectionEnabled]
  );

  const addFriendByUsername = useCallback((target: string) => {
    const clean = target.trim();
    if (!clean || clean.length < 3) {
      return { ok: false, message: "Enter a valid username (3+ characters)." };
    }
    setCompetitors((prev) => {
      const existing = prev.find(
        (c) => c.username.toLowerCase() === clean.toLowerCase()
      );
      if (existing) {
        return prev.map((c) =>
          c.username.toLowerCase() === clean.toLowerCase()
            ? { ...c, isFriend: true }
            : c
        );
      }
      const added: RankCompetitor = {
        rank: prev.length + 1,
        username: clean,
        skinId: "weave-cobalt",
        focusedSeconds: 18 * 3600 + 25 * 60,
        isFriend: true,
      };
      return [...prev, added];
    });
    return { ok: true, message: `Added @${clean} to your Friends leaderboard.` };
  }, []);

  const upgradeToPremium = useCallback(() => {
    setIsPremium(true);
    setCurrentScreen("S04_WALLET_HOME");
  }, []);

  const recordAdImpression = useCallback(() => {
    setAdImpressionsCount((c) => c + 1);
  }, []);

  const signInWithGoogleMock = useCallback(() => {
    const mockProfile: GoogleMockUser = {
      name: "Recover Cardholder",
      email: "recover.user@gmail.com",
      handle: "recover_user",
    };
    setGoogleUser(mockProfile);
    setUsername(mockProfile.handle);
  }, []);

  const signOutGoogleMock = useCallback(() => {
    setGoogleUser(null);
  }, []);

  // Hydrate persisted state from localStorage on client mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed.creditBalanceHundredths === "number") {
        setCreditBalanceHundredths(parsed.creditBalanceHundredths);
      }
      if (typeof parsed.exchangeRateHundredthsPerMin === "number") {
        setExchangeRateHundredthsPerMin(parsed.exchangeRateHundredthsPerMin);
      }
      if (parsed.cardSkinId) {
        setCardSkinId(parsed.cardSkinId);
      }
      if (typeof parsed.cardLabel === "string") {
        setCardLabel(parsed.cardLabel);
      }
      if (Array.isArray(parsed.blockRules) && parsed.blockRules.length > 0) {
        setBlockRules(parsed.blockRules);
      }
      if (Array.isArray(parsed.ledger) && parsed.ledger.length > 0) {
        setLedger(parsed.ledger);
      }
      if ("googleUser" in parsed) {
        setGoogleUser(parsed.googleUser);
      }
    } catch {
      // Ignore malformed storage
    }
  }, []);

  // Persist key wallet state changes to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          creditBalanceHundredths,
          exchangeRateHundredthsPerMin,
          cardSkinId,
          cardLabel,
          blockRules,
          ledger,
          googleUser,
        })
      );
    } catch {
      // Ignore quota errors
    }
  }, [
    creditBalanceHundredths,
    exchangeRateHundredthsPerMin,
    cardSkinId,
    cardLabel,
    blockRules,
    ledger,
    googleUser,
  ]);

  const value = useMemo<WalletContextValue>(
    () => ({
      currentScreen,
      onboardingCompleted,
      username,
      googleUser,
      creditBalanceHundredths,
      exchangeRateHundredthsPerMin,
      cardSkinId,
      cardLabel,
      uninstallProtectionEnabled,
      biometricWithdrawEnabled,
      motionDetectionEnabled,
      motionSensitivity,
      isPremium,
      permissions,
      blockRules,
      ledger,
      activeFocus,
      lastCompletedFocus,
      activeUnlock,
      shieldTriggeredApp,
      competitors,
      adImpressionsCount,
      myFocusedSecondsThisWeek,
      navigate,
      completeOnboarding,
      grantPermission,
      startFocusSession,
      tickFocusSecond,
      toggleScreenOffSimulation,
      triggerMotionSpike,
      simulateClockTamper,
      completeFocusSession,
      cancelFocusSession,
      startWithdrawal,
      relockEarlyWithRefund,
      expireActiveUnlock,
      toggleBlockRule,
      addCustomDomainRule,
      triggerShieldForApp,
      updateCardStyle,
      updateSystemSettings,
      addFriendByUsername,
      upgradeToPremium,
      recordAdImpression,
      signInWithGoogleMock,
      signOutGoogleMock,
    }),
    [
      currentScreen,
      onboardingCompleted,
      username,
      googleUser,
      creditBalanceHundredths,
      exchangeRateHundredthsPerMin,
      cardSkinId,
      cardLabel,
      uninstallProtectionEnabled,
      biometricWithdrawEnabled,
      motionDetectionEnabled,
      motionSensitivity,
      isPremium,
      permissions,
      blockRules,
      ledger,
      activeFocus,
      lastCompletedFocus,
      activeUnlock,
      shieldTriggeredApp,
      competitors,
      adImpressionsCount,
      myFocusedSecondsThisWeek,
      navigate,
      completeOnboarding,
      grantPermission,
      startFocusSession,
      tickFocusSecond,
      toggleScreenOffSimulation,
      triggerMotionSpike,
      simulateClockTamper,
      completeFocusSession,
      cancelFocusSession,
      startWithdrawal,
      relockEarlyWithRefund,
      expireActiveUnlock,
      toggleBlockRule,
      addCustomDomainRule,
      triggerShieldForApp,
      updateCardStyle,
      updateSystemSettings,
      addFriendByUsername,
      upgradeToPremium,
      recordAdImpression,
      signInWithGoogleMock,
      signOutGoogleMock,
    ]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used inside WalletProvider");
  }
  return ctx;
}
