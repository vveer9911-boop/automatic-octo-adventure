import crypto from "crypto";

/**
 * Single authorization gate required by /replica-backend:
 * Answers "can this user read or write this record?"
 */
export function canUserAccessRecord(
  actorUserId: string | null | undefined,
  recordOwnerUserId: string | null | undefined
): boolean {
  if (!actorUserId || !recordOwnerUserId) return false;
  return actorUserId === recordOwnerUserId;
}

/**
 * Sliding-window in-memory rate limiter for auth, sign-up, and email routes.
 */
const rateBuckets = new Map<string, number[]>();

export function checkRateLimit(
  namespace: string,
  identifier: string,
  maxRequests = 10,
  windowMs = 60_000
): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const key = `${namespace}:${identifier}`;
  const now = Date.now();
  const timestamps = (rateBuckets.get(key) ?? []).filter(
    (t) => now - t < windowMs
  );

  if (timestamps.length >= maxRequests) {
    const oldest = timestamps[0] ?? now;
    const retryAfterSec = Math.max(
      1,
      Math.ceil((windowMs - (now - oldest)) / 1000)
    );
    rateBuckets.set(key, timestamps);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  timestamps.push(now);
  rateBuckets.set(key, timestamps);
  return {
    allowed: true,
    remaining: maxRequests - timestamps.length,
    retryAfterSec: 0,
  };
}

/**
 * Server-side input validators (strict schema checks on every route).
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function validateEmail(email: unknown): string {
  if (typeof email !== "string") {
    throw new ValidationError("Email is required");
  }
  const clean = email.trim().toLowerCase();
  if (
    clean.length < 5 ||
    clean.length > 120 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)
  ) {
    throw new ValidationError("Invalid email address format");
  }
  return clean;
}

export function validateUsername(username: unknown): string {
  if (typeof username !== "string") {
    throw new ValidationError("Username is required");
  }
  const clean = username.trim();
  if (clean.length < 3 || clean.length > 24 || !/^[a-zA-Z0-9_]+$/.test(clean)) {
    throw new ValidationError(
      "Username must be 3–24 characters (letters, numbers, underscores)"
    );
  }
  return clean;
}

export function validateWithdrawRequest(body: Record<string, unknown>) {
  const requestedMinutes = Number(body.requestedMinutes);
  if (
    !Number.isInteger(requestedMinutes) ||
    requestedMinutes < 1 ||
    requestedMinutes > 480
  ) {
    throw new ValidationError(
      "requestedMinutes must be an integer between 1 and 480"
    );
  }
  const idempotencyKey =
    typeof body.idempotencyKey === "string" && body.idempotencyKey.trim()
      ? body.idempotencyKey.trim()
      : `withdraw-${Date.now()}`;

  return {
    requestedMinutes,
    biometricVerified: Boolean(body.biometricVerified),
    idempotencyKey,
  };
}

export function validateFocusCompleteRequest(body: Record<string, unknown>) {
  const actualDurationSec = Number(body.actualDurationSec);
  if (
    !Number.isFinite(actualDurationSec) ||
    actualDurationSec < 60 ||
    actualDurationSec > 28800
  ) {
    throw new ValidationError(
      "actualDurationSec must be between 60 and 28800 seconds"
    );
  }
  const mode = typeof body.mode === "string" ? body.mode : "standard";
  if (!["standard", "screen_off", "motion_strict", "ar_vault"].includes(mode)) {
    throw new ValidationError("Invalid focus mode");
  }
  const idempotencyKey =
    typeof body.idempotencyKey === "string" && body.idempotencyKey.trim()
      ? body.idempotencyKey.trim()
      : `focus-${Date.now()}`;

  return {
    actualDurationSec: Math.round(actualDurationSec),
    mode,
    idempotencyKey,
  };
}

/**
 * Verifies Stripe webhook HMAC-SHA256 signature (`t=...,v1=...`).
 */
export function verifyStripeWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  webhookSecret: string
): boolean {
  if (!signatureHeader || !webhookSecret) return false;
  const parts = signatureHeader.split(",");
  const timestampPart = parts.find((p) => p.startsWith("t="));
  const v1Part = parts.find((p) => p.startsWith("v1="));
  if (!timestampPart || !v1Part) return false;

  const timestamp = timestampPart.slice(2);
  const expectedSig = v1Part.slice(3);
  const signedPayload = `${timestamp}.${rawBody}`;
  const computed = crypto
    .createHmac("sha256", webhookSecret)
    .update(signedPayload, "utf8")
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(computed, "hex"),
      Buffer.from(expectedSig, "hex")
    );
  } catch {
    return false;
  }
}

/**
 * Freshly written transactional email templates for Resend.
 */
export function buildTransactionalEmail(
  kind: "verify_email" | "weekly_statement" | "subscription_cancelled",
  recipientEmail: string,
  data: Record<string, string | number>
) {
  if (kind === "verify_email") {
    return {
      to: recipientEmail,
      subject: "Verify your Screen Time Wallet account",
      text: `Welcome to Screen Time Wallet. Confirm your email using code: ${data.code ?? "000000"}.`,
    };
  }
  if (kind === "subscription_cancelled") {
    return {
      to: recipientEmail,
      subject: "Your Pro membership has been cancelled",
      text: "Your subscription was cancelled in one click. You will never be billed again unless you choose to re-subscribe.",
    };
  }
  return {
    to: recipientEmail,
    subject: "Your Weekly Focus Card Statement",
    text: `This week you focused for ${data.focusedMinutes ?? 0} minutes and earned ${data.earnedCredits ?? 0} credits.`,
  };
}
