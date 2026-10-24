import { NextRequest, NextResponse } from "next/server";
import { setUserPremiumStatus } from "@/lib/server-db";
import { buildTransactionalEmail } from "@/lib/server-security";

export async function POST(req: NextRequest) {
  const actorUserId =
    req.headers.get("x-user-id") ||
    req.cookies.get("stw_session_uid")?.value ||
    "user_demo_1";

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const action = body.action;

    if (action === "checkout") {
      const plan = body.plan === "monthly" ? "monthly" : "annual";
      return NextResponse.json({
        ok: true,
        mode: "test",
        plan,
        checkoutUrl: `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/?screen=S04&upgraded=1`,
      });
    }

    if (action === "cancel_one_click") {
      setUserPremiumStatus(actorUserId, false);
      const emailNotice = buildTransactionalEmail(
        "subscription_cancelled",
        "student1@example.test",
        {}
      );
      return NextResponse.json({
        ok: true,
        cancelled: true,
        isPremium: false,
        emailDispatched: emailNotice.subject,
      });
    }

    return NextResponse.json({ error: "Unsupported billing action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Invalid billing request" }, { status: 400 });
  }
}
