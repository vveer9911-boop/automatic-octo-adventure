# Bug Report Log (`replica/bugs.md`)

Generated and maintained by `/replica-test`.

## Summary
- **Open S1 Bugs**: 0
- **Open S2 Bugs**: 0
- **Open S3 Bugs**: 0
- **Open S4 Bugs**: 0
- **Fixed Bugs**: 2 (`BUG-001`, `BUG-002`)

---

### BUG-001: Readonly `fontFamily` tuple in `tailwind.tokens.ts` caused `next build` type check failure

- Severity: S2
- Flow / case: Build / All flows (`F01`–`F06`)
- Screen: All (`tailwind.config.ts`)
- Build: initial `/replica-build` pass  Browser / device: Node v26.7.0 / Next.js 14.2.15 TypeScript compiler

Steps
1. Export `replicaTailwindTheme` with `as const` in `replica/design/tailwind.tokens.ts`.
2. Spread `...replicaTailwindTheme` into `tailwind.config.ts` `theme.extend` and run `npm run build`.

Expected: `next build` compiles with zero TypeScript errors.
Actual: TypeScript rejected `readonly ["var(--font-sans)"]` against Tailwind's mutable `string[]` type in `CustomThemeConfig`.
Evidence: `tailwind.config.ts:11:5 Type error: The type 'readonly ["var(--font-sans)"]' is 'readonly' and cannot be assigned to the mutable type 'string[]'`.
Suspected cause: `as const` assertion on the exported theme object froze the `fontFamily` array literals.
Status: fixed in `replica/design/tailwind.tokens.ts` (removed `as const` assertion; verified green `npm run build`).

---

### BUG-002: Missing `<h1>` landmark on `S06` Active Focus Session screen flagged by `@axe-core/playwright`

- Severity: S3
- Flow / case: `F02 / F02-H1`
- Screen: `S06` (`FocusActiveScreen`), `S07` (`ARVaultScreen`), `S15` (`LeaderboardScreen`)
- Build: v1.0.0  Browser / device: Playwright Chromium 156, 390x844px

Steps
1. Start a focus session from `S04 -> S05 -> S06`.
2. Run `new AxeBuilder({ page }).analyze()` on `S06`.

Expected: Zero Axe accessibility violations (`violations: []`).
Actual: Axe reported `page-has-heading-one` (`moderate`: "Ensure that the page, or at least one of its frames contains a level-one heading").
Evidence: Failing test `F02-H1 & F02-E1` in `e2e/wallet-flows.spec.ts:75`.
Suspected cause: The subtitle `Earning screen time...` on `S06` used a `<p>` tag instead of `<h1>`.
Status: fixed in `src/components/screens/WalletAndFocusScreens.tsx` and `src/components/screens/SecondaryAndSystemScreens.tsx` (promoted screen titles on `S06`, `S07`, and `S15` to `<h1>`; re-verified with `npx playwright test`).
