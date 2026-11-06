# ADR 0002: Self-host fonts with next/font

Status: Accepted by the human on 2026-10-27, with the recommended options. Raised by the styling story plan.

## Gap
`docs/spec.md` names no fonts. The design needs Bricolage Grotesque, Inter and JetBrains Mono.

## Proposal
Load all three with `next/font/google`. At build time it downloads the files and serves them from the site itself, so the static export has no runtime request to Google. Fonts are exposed as CSS variables and mapped to Tailwind theme tokens (`ST-05`).

## Why
Keeps the export self-contained and privacy-friendly, avoids layout shift, and all three are under the SIL Open Font Licence.

## Consequences
- No new dependency, but `next build` needs network access to Google Fonts, locally and in CI.
- Credit the three SIL OFL licences in the README only, not in the site.
- Vitest aliases `next/font/google` to a mock in a root file (`vitest.next-font-google.ts`), so tests run without network.
- Bricolage Grotesque loads its weight axis only (400 to 800), not `opsz` or `wdth`.
- Full flow when applied (touches the whole site).
