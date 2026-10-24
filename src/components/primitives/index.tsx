"use client";

import React from "react";
import {
  ArrowDown,
  ArrowLeft,
  Clock,
  CreditCard,
  Lock,
  MoreHorizontal,
  Palette,
  Settings,
  Shield,
  Sparkles,
  Trophy,
  Unlock,
  UserPlus,
  X,
  Delete,
  Megaphone,
} from "lucide-react";

export type CardSkinId =
  | "metal-classic"
  | "metal-obsidian"
  | "circuit-dark"
  | "circuit-silver"
  | "circuit-stripe"
  | "weave-carbon"
  | "weave-cobalt"
  | "weave-crimson"
  | "urban-gold"
  | "urban-sticker"
  | "urban-graffiti";

export const CARD_SKINS: {
  id: CardSkinId;
  name: string;
  collection: "Circuit" | "Weave" | "Urban" | "Metal";
  proOnly?: boolean;
}[] = [
  { id: "metal-classic", name: "Brushed Platinum", collection: "Metal" },
  { id: "metal-obsidian", name: "Obsidian Matte", collection: "Metal" },
  { id: "circuit-dark", name: "Trace Carbon", collection: "Circuit" },
  { id: "circuit-silver", name: "Silicon Die", collection: "Circuit" },
  { id: "circuit-stripe", name: "Bus Hazard", collection: "Circuit" },
  { id: "weave-carbon", name: "Graphite Twill", collection: "Weave" },
  { id: "weave-cobalt", name: "Cobalt Thread", collection: "Weave" },
  { id: "weave-crimson", name: "Crimson Warp", collection: "Weave" },
  { id: "urban-gold", name: "Bullion Stamp", collection: "Urban" },
  { id: "urban-sticker", name: "Attention Currency", collection: "Urban" },
  { id: "urban-graffiti", name: "Turf Tag", collection: "Urban" },
];

/* ============================================================================
 * 0. Recover Brand Mark & Wordmark (from user's uploaded icon & wordmark)
 * ========================================================================== */
export function RecoverIcon({
  className = "h-5 w-7",
  accentMiddleWing = false,
}: {
  className?: string;
  accentMiddleWing?: boolean;
}) {
  return (
    <svg
      viewBox="96 122 206 156"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {/* Top aerodynamic wing */}
      <path d="M106 132 H246 C271 132 289 149 291 170 H144 C133 170 124 164 118 154 L106 132 Z" />
      {/* Middle curved bowl wing */}
      <path
        d="M161 181 H292 C290 202 278 216 263 216 H192 C181 216 173 210 167 200 L161 181 Z"
        className={accentMiddleWing ? "text-accent" : undefined}
      />
      {/* Bottom diagonal R-leg blade */}
      <path d="M212 229 H268 L291 267 H249 C238 267 230 261 224 251 L212 229 Z" />
    </svg>
  );
}

export function RecoverWordmark({
  className = "h-3.5 w-auto",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 285 41"
      fill="currentColor"
      aria-label="RECOVER"
      role="img"
      className={className}
    >
      {/* R (custom winged first R matching uploaded wordmark) */}
      <path d="M5 6 H33 C40 6 43 10 43 15.5 C43 20.5 39.5 23.5 34 24 L43 36 H31 L22.5 24 H17.5 C14.5 24 12.5 22.5 11 19.5 L9.5 17 H32 C34.5 17 35.5 16 35.5 14.5 C35.5 13 34.5 12 32 12 H14 C11 12 8.5 10.5 6.5 8 L5 6 Z" />
      {/* E */}
      <path d="M54 6 H80 V12 H61.5 V18 H78 V24 H61.5 V30 H80 V36 H54 V6 Z" />
      {/* C */}
      <path d="M99 6 H120 V12.5 H100.5 C98.5 12.5 97.5 13.5 97.5 15.5 V26.5 C97.5 28.5 98.5 29.5 100.5 29.5 H120 V36 H99 C93 36 90 33 90 27 V15 C90 9 93 6 99 6 Z" />
      {/* O */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M139 6 H153 C159 6 162 9 162 15 V27 C162 33 159 36 153 36 H139 C133 36 130 33 130 27 V15 C130 9 133 6 139 6 Z M137.5 15.5 C137.5 13.5 138.5 12.5 140.5 12.5 H151.5 C153.5 12.5 154.5 13.5 154.5 15.5 V26.5 C154.5 28.5 153.5 29.5 151.5 29.5 H140.5 C138.5 29.5 137.5 28.5 137.5 26.5 V15.5 Z"
      />
      {/* V */}
      <path d="M170 6 H178.5 L187.5 27.5 L196.5 6 H205 L191.5 36 H183.5 L170 6 Z" />
      {/* E */}
      <path d="M213 6 H240 V12 H220.5 V18 H237 V24 H220.5 V30 H240 V36 H213 V6 Z" />
      {/* R */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M249 6 H271 C276.5 6 279.5 9 279.5 14.5 C279.5 19.5 277 22.5 272.5 23.5 L280 36 H271.5 L264.5 24 H256.5 V36 H249 V6 Z M256.5 12 V18.5 H269.5 C271.5 18.5 272.5 17.5 272.5 15.25 C272.5 13 271.5 12 269.5 12 H256.5 Z"
      />
    </svg>
  );
}

export function RecoverLogo({
  iconClassName = "h-5 w-7",
  wordmarkClassName = "h-3.5 w-auto",
  accentMiddleWing = false,
}: {
  iconClassName?: string;
  wordmarkClassName?: string;
  accentMiddleWing?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <RecoverIcon
        className={iconClassName}
        accentMiddleWing={accentMiddleWing}
      />
      <RecoverWordmark className={wordmarkClassName} />
    </span>
  );
}

/* ============================================================================
 * 1. FocusCard
 * ========================================================================== */
export interface FocusCardProps {
  creditsHundredths: number;
  exchangeRateHundredthsPerMin?: number;
  label?: string;
  skinId?: CardSkinId;
  size?: "hero" | "vertical-gallery" | "mini-badge";
  liveTicking?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export function FocusCard({
  creditsHundredths,
  exchangeRateHundredthsPerMin = 100,
  label = "RECOVER CARD",
  skinId = "metal-classic",
  size = "hero",
  liveTicking = false,
  selected = false,
  onClick,
}: FocusCardProps) {
  const creditsValue = creditsHundredths / 100;
  const formattedCredits = liveTicking
    ? creditsValue.toFixed(2)
    : Number.isInteger(creditsValue)
      ? creditsValue.toFixed(0)
      : creditsValue.toFixed(2);
  const screenMinutes = Math.floor(
    creditsHundredths / Math.max(1, exchangeRateHundredthsPerMin)
  );

  if (size === "mini-badge") {
    return (
      <div
        className={`skin-${skinId} relative inline-flex h-7 w-11 shrink-0 items-center justify-between rounded-sm border border-border px-1.5 shadow-surface`}
        aria-hidden="true"
      >
        <RecoverIcon className="h-3 w-4 opacity-90" />
        <span className="h-2 w-2.5 rounded-[2px] border border-current opacity-60" />
      </div>
    );
  }

  if (size === "vertical-gallery") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Select ${skinId} card finish`}
        aria-pressed={selected}
        className={`skin-${skinId} relative flex h-48 w-32 shrink-0 flex-col justify-between rounded-lg border p-3 text-left shadow-surface transition-transform duration-base ease-replica active:scale-95 overflow-hidden ${
          selected ? "ring-2 ring-accent border-accent" : "border-border"
        }`}
      >
        <RecoverIcon className="pointer-events-none absolute -right-3 -bottom-2 h-16 w-20 opacity-10" />
        <div className="flex items-center justify-between w-full">
          <RecoverIcon className="h-4 w-5 opacity-95" />
          <span className="text-[10px] font-mono uppercase opacity-75">
            {skinId.split("-")[1]}
          </span>
        </div>
        <div className="my-auto flex justify-center">
          <div className="h-7 w-5 rounded-sm border border-current/45 flex items-center justify-center opacity-70">
            <RecoverIcon className="h-2.5 w-3.5 opacity-45" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="font-emboss text-[9px] tracking-widest uppercase truncate opacity-85">
            {label}
          </div>
          <RecoverWordmark className="h-2 w-auto opacity-70" />
        </div>
      </button>
    );
  }

  return (
    <div
      role="region"
      aria-label={`Recover Card Balance: ${formattedCredits} credits, equal to ${screenMinutes} minutes of screen time`}
      onClick={onClick}
      className={`skin-${skinId} relative w-full aspect-[1.586/1] rounded-card p-6 shadow-card border border-border flex flex-col justify-between overflow-hidden transition-transform duration-tilt ease-replica ${
        onClick ? "cursor-pointer active:scale-[0.99]" : ""
      }`}
    >
      {/* Subtle laser-etched Recover 3-wing R watermark in card metal */}
      <RecoverIcon className="pointer-events-none absolute -right-4 -bottom-4 h-28 w-36 opacity-[0.08]" />

      {/* Top row: Recover 3-wing R icon + RECOVER wordmark + optional live indicator */}
      <div className="relative z-10 flex items-center justify-between">
        <RecoverLogo
          iconClassName="h-5 w-7 opacity-95"
          wordmarkClassName="h-3.5 w-auto opacity-90"
        />
        {liveTicking ? (
          <span className="rounded-pill bg-surface/80 px-2.5 py-0.5 font-mono text-xs text-focus-glow border border-border">
            LIVE EARNING
          </span>
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-widest opacity-65">
            TIME WALLET
          </span>
        )}
      </div>

      {/* Middle row: Credits balance + screen time conversion + EMV chip with Recover mark */}
      <div className="relative z-10 flex items-end justify-between gap-4 my-auto pt-3">
        <div>
          <div
            className="flex items-baseline gap-1.5"
            aria-live={liveTicking ? "polite" : "off"}
          >
            <span className="font-sans text-4xl font-bold tracking-tight">
              {formattedCredits}
            </span>
            <span className="text-base font-semibold opacity-85">credits</span>
          </div>
          <p className="text-xs font-medium opacity-75 mt-0.5">
            = {screenMinutes}m screen time
          </p>
        </div>

        {/* Metallic EMV Chip with etched Recover R mark */}
        <div
          aria-hidden="true"
          className="h-9 w-12 rounded-sm border border-current/35 bg-card-metal/60 flex items-center justify-center shadow-inner"
        >
          <div className="h-5 w-8 border border-current/30 rounded-[2px] flex items-center justify-center">
            <RecoverIcon className="h-3 w-4 opacity-40" />
          </div>
        </div>
      </div>

      {/* Bottom row: Custom embossed label */}
      <div className="relative z-10 flex items-center justify-between pt-2">
        <span className="font-emboss text-xs font-semibold tracking-[0.16em] uppercase opacity-90 truncate max-w-[75%]">
          {label}
        </span>
        {skinId === "urban-sticker" ? (
          <span className="font-mono text-[10px] font-bold uppercase tracking-tight opacity-80">
            ATTENTION CURRENCY
          </span>
        ) : (
          <RecoverIcon className="h-3.5 w-5 opacity-55" />
        )}
      </div>
    </div>
  );
}

/* ============================================================================
 * 2. NativeAdBannerCard (Free-Tier Ad Placements on S04, S06, S08)
 * ========================================================================== */
export interface NativeAdBannerCardProps {
  variant: "focus-top-pill" | "post-session-card" | "dashboard-compact";
  isPremium?: boolean;
  onUpgradeClick?: () => void;
  onAdClick?: () => void;
}

const AD_CREATIVES = {
  "focus-top-pill": {
    sponsor: "CalmDesk Studio",
    headline: "Deep Work Mechanical Timer & Desk Mat",
    subline: "Sponsored • Built for distraction-free study blocks",
    cta: "View",
  },
  "post-session-card": {
    sponsor: "Readwise Reader",
    headline: "Turn saved articles into focused 10-minute reads",
    subline: "Sync highlights from PDFs, newsletters, and technical docs without social feeds.",
    cta: "Try Free",
  },
  "dashboard-compact": {
    sponsor: "Keychron Labs",
    headline: "Low-Profile Wireless Mechanical Keyboards",
    subline: "Engineered for long coding & study sessions",
    cta: "Explore",
  },
} as const;

export function NativeAdBannerCard(_props: NativeAdBannerCardProps) {
  // Ads and subscriptions disabled per user configuration
  return null;
}

export function GoogleMockSignUpButton({
  signedInEmail,
  onSignIn,
  onSignOut,
}: {
  signedInEmail?: string | null;
  onSignIn: () => void;
  onSignOut?: () => void;
}) {
  if (signedInEmail) {
    return (
      <div
        data-testid="google-mock-signed-in"
        className="w-full rounded-lg bg-surface-elevated border border-border px-4 py-3 flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-8 w-8 rounded-pill bg-accent text-on-accent font-mono text-xs font-bold flex items-center justify-center shrink-0">
            G
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-success">
              Signed in with Google (Mockup)
            </p>
            <p className="text-xs text-text-muted truncate">{signedInEmail}</p>
          </div>
        </div>
        {onSignOut && (
          <button
            type="button"
            data-testid="btn-google-mock-signout"
            onClick={onSignOut}
            className="rounded-pill bg-surface border border-border px-3 py-1 text-xs font-medium text-text-muted hover:text-text shrink-0"
          >
            Sign Out
          </button>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      data-testid="btn-google-mock-signup"
      onClick={onSignIn}
      className="w-full rounded-pill bg-text text-on-accent py-3.5 px-5 text-sm font-semibold shadow-surface flex items-center justify-center gap-3 transition-transform duration-fast active:scale-[0.99]"
    >
      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
        />
      </svg>
      <span>Continue with Google</span>
    </button>
  );
}

/* ============================================================================
 * 3. CircularIconButton
 * ========================================================================== */
export type IconKind =
  | "settings"
  | "back"
  | "close"
  | "more"
  | "add-friend"
  | "transactions"
  | "withdraw"
  | "card-studio"
  | "sparkles";

const ICON_MAP: Record<IconKind, React.ComponentType<{ className?: string }>> = {
  settings: Settings,
  back: ArrowLeft,
  close: X,
  more: MoreHorizontal,
  "add-friend": UserPlus,
  transactions: CreditCard,
  withdraw: ArrowDown,
  "card-studio": Palette,
  sparkles: Sparkles,
};

export interface CircularIconButtonProps {
  icon: IconKind;
  label: string;
  showLabelBelow?: boolean;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
}

export function CircularIconButton({
  icon,
  label,
  showLabelBelow = false,
  size = "md",
  onClick,
  disabled = false,
}: CircularIconButtonProps) {
  const IconComp = ICON_MAP[icon];
  const sizeClass =
    size === "sm"
      ? "h-9 w-9"
      : size === "lg"
        ? "h-14 w-14"
        : "h-11 w-11";

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <button
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        className={`${sizeClass} rounded-pill bg-surface-elevated border border-border text-text flex items-center justify-center transition-transform duration-fast ease-replica active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-input disabled:opacity-40`}
      >
        <IconComp className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
      </button>
      {showLabelBelow && (
        <span className="text-xs font-medium text-text-muted">{label}</span>
      )}
    </div>
  );
}

/* ============================================================================
 * 4. NumericKeypad & QuickDurationPills (S09 Withdraw)
 * ========================================================================== */
export interface NumericKeypadProps {
  minutes: number;
  onSelectPreset: (mins: number) => void;
  onDigitPress: (digit: string) => void;
  onBackspace: () => void;
}

const PRESET_DURATIONS = [
  { label: "1m", mins: 1 },
  { label: "5m", mins: 5 },
  { label: "15m", mins: 15 },
  { label: "30m", mins: 30 },
  { label: "1h", mins: 60 },
  { label: "2h", mins: 120 },
];

export function NumericKeypad({
  minutes,
  onSelectPreset,
  onDigitPress,
  onBackspace,
}: NumericKeypadProps) {
  return (
    <div className="w-full space-y-5">
      {/* Quick-select duration pills */}
      <div
        role="group"
        aria-label="Quick withdrawal durations"
        className="flex items-center justify-between gap-2 overflow-x-auto py-1"
      >
        {PRESET_DURATIONS.map((preset) => {
          const active = minutes === preset.mins;
          return (
            <button
              key={preset.mins}
              type="button"
              aria-pressed={active}
              onClick={() => onSelectPreset(preset.mins)}
              className={`min-w-[52px] rounded-pill px-3.5 py-2 text-sm font-semibold transition-colors duration-fast ${
                active
                  ? "bg-accent text-on-accent"
                  : "bg-surface-elevated text-text-muted border border-border hover:text-text"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* 3x4 numeric grid */}
      <div className="grid grid-cols-3 gap-2">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => onDigitPress(digit)}
            className="h-14 rounded-md text-2xl font-semibold text-text hover:bg-surface-elevated active:scale-95 transition-transform duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-input"
          >
            {digit}
          </button>
        ))}
        <div aria-hidden="true" />
        <button
          type="button"
          onClick={() => onDigitPress("0")}
          className="h-14 rounded-md text-2xl font-semibold text-text hover:bg-surface-elevated active:scale-95 transition-transform duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-input"
        >
          0
        </button>
        <button
          type="button"
          aria-label="Backspace"
          onClick={onBackspace}
          className="h-14 rounded-md flex items-center justify-center text-text hover:bg-surface-elevated active:scale-95 transition-transform duration-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-border-input"
        >
          <Delete className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
 * 5. AppBlockRow (S02, S10)
 * ========================================================================== */
export interface AppBlockRowProps {
  name: string;
  packageOrDomain: string;
  category: string;
  isLocked: boolean;
  isTemporarilyUnlocked?: boolean;
  onToggle: () => void;
}

export function AppBlockRow({
  name,
  packageOrDomain,
  category,
  isLocked,
  isTemporarilyUnlocked = false,
  onToggle,
}: AppBlockRowProps) {
  return (
    <div className="flex items-center justify-between rounded-md bg-surface border border-border p-3.5">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 rounded-sm bg-surface-elevated border border-border flex items-center justify-center shrink-0">
          {isLocked && !isTemporarilyUnlocked ? (
            <Lock className="h-4 w-4 text-text" />
          ) : (
            <Unlock className="h-4 w-4 text-text-muted" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text truncate">{name}</p>
          <p className="text-xs text-text-muted truncate">
            {category.toUpperCase()} • {packageOrDomain}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={isLocked}
        aria-label={`Lock ${name}`}
        onClick={onToggle}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-pill border transition-colors duration-base ${
          isLocked
            ? "bg-accent border-accent"
            : "bg-surface-elevated border-border"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-pill transition-transform duration-base ${
            isLocked
              ? "translate-x-6 bg-on-accent"
              : "translate-x-1 bg-text-muted"
          }`}
        />
      </button>
    </div>
  );
}

/* ============================================================================
 * 6. TransactionLedgerRow (S12 Bank Statement History — no Focus Score)
 * ========================================================================== */
export interface TransactionLedgerRowProps {
  type:
    | "starting_bonus"
    | "focus_earn"
    | "withdraw_spend"
    | "relock_refund"
    | "motion_penalty";
  description: string;
  timestampLabel: string;
  amountHundredths: number;
  balanceAfterHundredths: number;
}

export function TransactionLedgerRow({
  type,
  description,
  timestampLabel,
  amountHundredths,
  balanceAfterHundredths,
}: TransactionLedgerRowProps) {
  const isPositive = amountHundredths > 0;
  const formattedDelta = `${isPositive ? "+" : ""}${(
    amountHundredths / 100
  ).toFixed(2)}`;
  const formattedBalance = (balanceAfterHundredths / 100).toFixed(2);

  return (
    <div className="flex items-center justify-between rounded-md bg-surface border border-border p-3.5">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-9 w-9 rounded-pill bg-surface-elevated border border-border flex items-center justify-center shrink-0">
          <Clock className="h-4 w-4 text-text-muted" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-text truncate">{description}</p>
          <p className="text-xs text-text-muted">{timestampLabel}</p>
        </div>
      </div>
      <div className="text-right shrink-0 pl-3">
        <p
          className={`font-mono text-sm font-semibold ${
            type === "motion_penalty"
              ? "text-danger"
              : isPositive
                ? "text-success"
                : "text-text"
          }`}
        >
          {formattedDelta} cr
        </p>
        <p className="font-mono text-xs text-text-muted">
          Bal: {formattedBalance}
        </p>
      </div>
    </div>
  );
}

/* ============================================================================
 * 7. LeaderboardRow (S15 Recover Ranks)
 * ========================================================================== */
export interface LeaderboardRowProps {
  rank: number;
  username: string;
  skinId: CardSkinId;
  focusedSeconds: number;
  isCurrentUser?: boolean;
}

export function formatDurationHoursMins(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
}

export function LeaderboardRow({
  rank,
  username,
  skinId,
  focusedSeconds,
  isCurrentUser = false,
}: LeaderboardRowProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-md px-3.5 py-3 border ${
        isCurrentUser
          ? "bg-surface-elevated border-border-input"
          : "bg-surface border-border"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-8 font-mono text-sm font-semibold text-text-muted">
          #{rank}
        </span>
        <FocusCard creditsHundredths={0} skinId={skinId} size="mini-badge" />
        <span className="text-sm font-semibold text-text truncate">
          {username}
          {isCurrentUser ? " (you)" : ""}
        </span>
      </div>
      <span className="font-mono text-sm font-medium text-text-muted shrink-0">
        {formatDurationHoursMins(focusedSeconds)}
      </span>
    </div>
  );
}

/* ============================================================================
 * 8. ProtectionToggleCard (S14 Recover System)
 * ========================================================================== */
export interface ProtectionToggleCardProps {
  title: string;
  subtitle: string;
  footnote?: string;
  enabled: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export function ProtectionToggleCard({
  title,
  subtitle,
  footnote,
  enabled,
  disabled = false,
  onToggle,
}: ProtectionToggleCardProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 rounded-lg bg-surface border border-border p-4 shadow-surface">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-8 w-8 rounded-pill bg-surface-elevated border border-border flex items-center justify-center shrink-0">
            <Shield className="h-4 w-4 text-text" />
          </div>
          <div>
            <p className="text-base font-semibold text-text">{title}</p>
            <p className="text-sm text-text-muted">{subtitle}</p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label={title}
          disabled={disabled}
          onClick={onToggle}
          className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-pill border transition-colors duration-base disabled:opacity-40 ${
            enabled
              ? "bg-focus-glow border-focus-glow"
              : "bg-surface-elevated border-border"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-pill transition-transform duration-base ${
              enabled
                ? "translate-x-6 bg-on-accent"
                : "translate-x-1 bg-text-muted"
            }`}
          />
        </button>
      </div>
      {footnote && (
        <p className="px-1 text-xs leading-relaxed text-text-muted">
          {footnote}
        </p>
      )}
    </div>
  );
}

/* ============================================================================
 * 9. BottomTabBar
 * ========================================================================== */
export type NavTabId = "wallet" | "blocks" | "ranks" | "system";

export interface BottomTabBarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
}

export function BottomTabBar({ activeTab, onSelectTab }: BottomTabBarProps) {
  const tabs: {
    id: NavTabId;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "wallet", label: "Wallet", Icon: CreditCard },
    { id: "blocks", label: "Block List", Icon: Lock },
    { id: "ranks", label: "Ranks", Icon: Trophy },
    { id: "system", label: "System", Icon: Shield },
  ];

  return (
    <nav
      aria-label="Primary"
      className="h-[68px] w-full bg-surface border-t border-border px-4 flex items-center justify-around"
    >
      {tabs.map(({ id, label, Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onSelectTab(id)}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-md transition-colors duration-fast ${
              active ? "text-text" : "text-text-muted hover:text-text"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
