import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-[430px] min-h-screen bg-bg text-text p-6 space-y-6">
      <header className="space-y-2 border-b border-border pb-4">
        <Link
          href="/"
          className="text-xs font-mono text-focus-glow hover:underline"
        >
          ← Back to Recover
        </Link>
        <h1 className="text-2xl font-bold text-text">
          Recover — Privacy Policy & Terms of Service
        </h1>
        <p className="text-xs text-text-muted">
          Effective Date: October 24, 2026 • Domain: recoverwallet.vercel.app
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-text">
          1. On-Device Screen Time Privacy
        </h2>
        <p className="text-sm text-text-muted leading-relaxed">
          Your Android app usage detection (<code>UsageStatsManager</code>) and
          app block rules execute locally on your device. We never upload which
          specific apps or websites you open to our servers.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-text">
          2. Data Processors & Sub-processors
        </h2>
        <ul className="list-disc pl-5 text-sm text-text-muted space-y-1.5">
          <li>
            <strong className="text-text">Supabase (Postgres & Auth):</strong>{" "}
            Stores encrypted wallet balances, card finishes, and optional
            leaderboard handles.
          </li>
          <li>
            <strong className="text-text">Stripe & Google Play Billing:</strong>{" "}
            Processes Pro membership payments and one-click subscription
            cancellations. We never store raw payment card numbers.
          </li>
          <li>
            <strong className="text-text">Google AdMob (Free Tier Only):</strong>{" "}
            Serves the three non-intrusive native ad placements for free-tier
            users (disabled automatically for Pro subscribers).
          </li>
          <li>
            <strong className="text-text">Resend:</strong> Delivers
            transactional account verification and weekly focus statement
            emails.
          </li>
          <li>
            <strong className="text-text">Vercel:</strong> Hosts web API endpoints
            and static assets.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-text">
          3. Account & Data Deletion
        </h2>
        <p className="text-sm text-text-muted leading-relaxed">
          You can permanently delete your account and cascade-delete all synced
          wallet, ledger, and leaderboard records at any time from{" "}
          <strong className="text-text">Wallet System → Delete Account</strong>{" "}
          or via <code>DELETE /api/account</code>.
        </p>
      </section>
    </main>
  );
}
