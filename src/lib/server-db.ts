import { canUserAccessRecord } from "./server-security";

export interface ServerUserRecord {
  userId: string;
  email: string;
  username: string;
  creditBalanceHundredths: number;
  exchangeRateHundredthsPerMin: number;
  cardSkinId: string;
  cardLabel: string;
  uninstallProtectionEnabled: boolean;
  biometricWithdrawEnabled: boolean;
  motionDetectionEnabled: boolean;
  isPremium: boolean;
}

export interface ServerLedgerRecord {
  id: string;
  userId: string;
  type:
    | "starting_bonus"
    | "focus_earn"
    | "withdraw_spend"
    | "relock_refund"
    | "motion_penalty";
  amountHundredths: number;
  balanceAfterHundredths: number;
  description: string;
  idempotencyKey: string;
  createdAtIso: string;
}

const usersTable = new Map<string, ServerUserRecord>([
  [
    "user_demo_1",
    {
      userId: "user_demo_1",
      email: "student1@example.test",
      username: "focus_builder",
      creditBalanceHundredths: 1500,
      exchangeRateHundredthsPerMin: 100,
      cardSkinId: "metal-classic",
      cardLabel: "RECOVER CARD",
      uninstallProtectionEnabled: true,
      biometricWithdrawEnabled: false,
      motionDetectionEnabled: true,
      isPremium: false,
    },
  ],
  [
    "user_demo_2",
    {
      userId: "user_demo_2",
      email: "student2@example.test",
      username: "other_cardholder",
      creditBalanceHundredths: 4200,
      exchangeRateHundredthsPerMin: 100,
      cardSkinId: "weave-carbon",
      cardLabel: "DEEP WORK",
      uninstallProtectionEnabled: true,
      biometricWithdrawEnabled: true,
      motionDetectionEnabled: true,
      isPremium: true,
    },
  ],
]);

const ledgerTable: ServerLedgerRecord[] = [
  {
    id: "srv-tx-1",
    userId: "user_demo_1",
    type: "starting_bonus",
    amountHundredths: 1500,
    balanceAfterHundredths: 1500,
    description: "Initial Wallet Opening Deposit",
    idempotencyKey: "srv-seed-1",
    createdAtIso: "2026-10-24T09:00:00Z",
  },
  {
    id: "srv-tx-2",
    userId: "user_demo_2",
    type: "starting_bonus",
    amountHundredths: 4200,
    balanceAfterHundredths: 4200,
    description: "Second User Private Ledger Entry",
    idempotencyKey: "srv-seed-2",
    createdAtIso: "2026-10-24T09:00:00Z",
  },
];

const processedWebhookEvents = new Set<string>();

export function getServerProfileForUser(
  actorUserId: string,
  targetUserId: string
): ServerUserRecord | null {
  if (!canUserAccessRecord(actorUserId, targetUserId)) {
    return null;
  }
  return usersTable.get(targetUserId) ?? null;
}

export function getServerLedgerForUser(
  actorUserId: string,
  targetUserId: string
): ServerLedgerRecord[] {
  if (!canUserAccessRecord(actorUserId, targetUserId)) {
    return [];
  }
  return ledgerTable.filter((row) =>
    canUserAccessRecord(actorUserId, row.userId)
  );
}

export function recordServerLedgerMutation(
  actorUserId: string,
  entry: Omit<ServerLedgerRecord, "id" | "balanceAfterHundredths" | "createdAtIso">
): { ok: boolean; error?: string; record?: ServerLedgerRecord; duplicate?: boolean } {
  if (!canUserAccessRecord(actorUserId, entry.userId)) {
    return { ok: false, error: "Forbidden: cannot mutate another user's wallet" };
  }

  const existing = ledgerTable.find(
    (r) => r.idempotencyKey === entry.idempotencyKey
  );
  if (existing) {
    return { ok: true, record: existing, duplicate: true };
  }

  const profile = usersTable.get(entry.userId);
  if (!profile) {
    return { ok: false, error: "Profile not found" };
  }

  const nextBalance = profile.creditBalanceHundredths + entry.amountHundredths;
  if (nextBalance < 0) {
    return { ok: false, error: "Insufficient credit balance" };
  }

  profile.creditBalanceHundredths = nextBalance;
  const created: ServerLedgerRecord = {
    id: `srv-tx-${Date.now()}`,
    ...entry,
    balanceAfterHundredths: nextBalance,
    createdAtIso: new Date().toISOString(),
  };
  ledgerTable.unshift(created);
  return { ok: true, record: created, duplicate: false };
}

export function setUserPremiumStatus(userId: string, isPremium: boolean): boolean {
  const user = usersTable.get(userId);
  if (!user) return false;
  user.isPremium = isPremium;
  return true;
}

export function markWebhookEventProcessed(eventId: string): boolean {
  if (processedWebhookEvents.has(eventId)) {
    return false; // Already processed (idempotent)
  }
  processedWebhookEvents.add(eventId);
  return true;
}

export function deleteUserAccountCascade(
  actorUserId: string,
  targetUserId: string
): boolean {
  if (!canUserAccessRecord(actorUserId, targetUserId)) {
    return false;
  }
  usersTable.delete(targetUserId);
  for (let i = ledgerTable.length - 1; i >= 0; i--) {
    if (ledgerTable[i].userId === targetUserId) {
      ledgerTable.splice(i, 1);
    }
  }
  return true;
}
