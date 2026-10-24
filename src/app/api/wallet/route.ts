import { NextRequest, NextResponse } from "next/server";
import {
  getServerLedgerForUser,
  getServerProfileForUser,
  recordServerLedgerMutation,
} from "@/lib/server-db";
import {
  ValidationError,
  validateFocusCompleteRequest,
  validateWithdrawRequest,
} from "@/lib/server-security";

export async function GET(req: NextRequest) {
  const actorUserId =
    req.headers.get("x-user-id") ||
    req.cookies.get("stw_session_uid")?.value ||
    "user_demo_1";
  const requestedUserId =
    req.nextUrl.searchParams.get("userId") || actorUserId;

  const profile = getServerProfileForUser(actorUserId, requestedUserId);
  if (!profile) {
    return NextResponse.json(
      { error: "Forbidden: cannot read another user's wallet", transactions: [] },
      { status: 403 }
    );
  }

  const transactions = getServerLedgerForUser(actorUserId, requestedUserId);
  return NextResponse.json({
    status: "ok",
    wallet: profile,
    transactions,
  });
}

export async function POST(req: NextRequest) {
  try {
    const actorUserId =
      req.headers.get("x-user-id") ||
      req.cookies.get("stw_session_uid")?.value ||
      "user_demo_1";
    const body = (await req.json()) as Record<string, unknown>;
    const targetUserId =
      typeof body.userId === "string" ? body.userId : actorUserId;
    const action = body.action;

    if (action === "withdraw") {
      const validated = validateWithdrawRequest(body);
      const profile = getServerProfileForUser(actorUserId, targetUserId);
      if (!profile) {
        return NextResponse.json(
          { error: "Forbidden: unauthorized user access" },
          { status: 403 }
        );
      }

      const costHundredths =
        validated.requestedMinutes * profile.exchangeRateHundredthsPerMin;
      const res = recordServerLedgerMutation(actorUserId, {
        userId: targetUserId,
        type: "withdraw_spend",
        amountHundredths: -costHundredths,
        description: `Screen Time Withdrawal (${validated.requestedMinutes}m)`,
        idempotencyKey: validated.idempotencyKey,
      });

      if (!res.ok) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      return NextResponse.json({
        ok: true,
        duplicate: res.duplicate,
        requestedMinutes: validated.requestedMinutes,
        ledgerEntry: res.record,
      });
    }

    if (action === "focus_complete") {
      const validated = validateFocusCompleteRequest(body);
      const earnedHundredths = Math.round(
        (validated.actualDurationSec / 60) * 100
      );
      const res = recordServerLedgerMutation(actorUserId, {
        userId: targetUserId,
        type: "focus_earn",
        amountHundredths: earnedHundredths,
        description: `Focus Session (${Math.round(
          validated.actualDurationSec / 60
        )}m ${validated.mode})`,
        idempotencyKey: validated.idempotencyKey,
      });

      if (!res.ok) {
        return NextResponse.json({ error: res.error }, { status: 403 });
      }
      return NextResponse.json({
        ok: true,
        duplicate: res.duplicate,
        earnedHundredths,
        ledgerEntry: res.record,
      });
    }

    return NextResponse.json({ ok: true, action });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }
}
