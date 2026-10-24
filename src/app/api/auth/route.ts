import { NextRequest, NextResponse } from "next/server";
import {
  buildTransactionalEmail,
  checkRateLimit,
  ValidationError,
  validateEmail,
  validateUsername,
} from "@/lib/server-security";

export async function POST(req: NextRequest) {
  const clientIp = req.headers.get("x-forwarded-for") || "local-ip";
  const rate = checkRateLimit("auth", clientIp, 10, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many auth attempts. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSec) },
      }
    );
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const action = body.action;

    if (action === "signout") {
      const res = NextResponse.json({ ok: true, signedOutEverywhere: true });
      res.cookies.delete("stw_session_uid");
      return res;
    }

    const email = validateEmail(body.email);
    const username = body.username
      ? validateUsername(body.username)
      : email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 20);

    const verificationEmail = buildTransactionalEmail("verify_email", email, {
      code: "482910",
    });

    const res = NextResponse.json({
      ok: true,
      user: {
        userId: "user_demo_1",
        email,
        username,
      },
      emailDispatched: {
        to: verificationEmail.to,
        subject: verificationEmail.subject,
      },
    });

    res.cookies.set("stw_session_uid", "user_demo_1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
