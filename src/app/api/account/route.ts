import { NextRequest, NextResponse } from "next/server";
import { deleteUserAccountCascade } from "@/lib/server-db";

export async function DELETE(req: NextRequest) {
  const actorUserId =
    req.headers.get("x-user-id") ||
    req.cookies.get("stw_session_uid")?.value ||
    "user_demo_1";

  let targetUserId = actorUserId;
  try {
    const body = (await req.json()) as Record<string, unknown>;
    if (typeof body.userId === "string") {
      targetUserId = body.userId;
    }
    if (body.confirm !== true) {
      return NextResponse.json(
        { error: "Account deletion requires { confirm: true }" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Account deletion requires { confirm: true }" },
      { status: 400 }
    );
  }

  const deleted = deleteUserAccountCascade(actorUserId, targetUserId);
  if (!deleted) {
    return NextResponse.json(
      { error: "Forbidden: cannot delete another user's account" },
      { status: 403 }
    );
  }

  const res = NextResponse.json({
    ok: true,
    deletedUserId: targetUserId,
    cascadedTables: [
      "wallet_profiles",
      "block_rules",
      "focus_sessions",
      "unlock_sessions",
      "ledger_transactions",
      "ad_impressions",
      "weekly_rank_entries",
      "friendships",
    ],
  });
  res.cookies.delete("stw_session_uid");
  return res;
}
