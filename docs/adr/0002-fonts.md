# ADR 0002: Self-host fonts with next/font

Status: Proposed (the human decides)

## Gap
`docs/spec.md` names no fonts. The design needs Bricolage Grotesque, Inter and JetBrains Mono.

## Proposal
Load all three with `next/font/google`. At build time it downloads the files and serves them from the site itself, so the static export has no runtime request to Google. Fonts are exposed as CSS variables and mapped to Tailwind theme tokens (`ST-05`).

## Why
Keeps the export self-contained and privacy-friendly, avoids layout shift, and all three are under the SIL Open Font Licence.

## Consequences
New dependency-free but build-time network access to Google Fonts. Credit the licences in the site footer or a `/licenses` note. Full flow when applied (touches the whole site).
