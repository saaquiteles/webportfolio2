# ADR 0019: Bring the spec's stack and the design-token wording in line with the code

Status: Accepted by the human on 2026-10-27. The human pastes the spec and glossary lines. Raised by the styling story plan.

## Gap
`docs/spec.md` lists "Tailwind CSS, shadcn/ui + Radix, Framer Motion" as the stack. Tailwind is v4 and CSS-first (ADR 0005), fonts are self-hosted with `next/font/google` (ADR 0002), and shadcn/ui, Radix and Framer Motion are not installed yet. The glossary's "Design token" row says "once wired up", which is no longer true after the styling story.

## Proposal
Say what is true today and what is planned. The human edits `docs/spec.md` and `docs/glossary.md`; the agent does not.

## Why
A spec that lists tools that are not installed misleads the next reader and the next review.

## Consequences
Lines for the human to paste:
- `docs/spec.md`, Stack section, replace the line with: `Next.js (App Router) with \`output: 'export'\`, TypeScript (strict), Tailwind CSS v4 (CSS-first: theme tokens in \`src/app/globals.css\`, no \`tailwind.config.ts\`; ADR 0005), fonts self-hosted with \`next/font/google\` (ADR 0002), MDX via Velite (see \`docs/adr/0001-content-layer.md\`), Vitest + Testing Library, GitHub Actions + Pages. Planned, not installed yet: shadcn/ui + Radix (when a component needs them) and Framer Motion (the motion story, ADR 0003).`
- `docs/glossary.md`, the Design token row, replace with: `| Design token | A named colour, font or spacing value defined once in the Tailwind theme (\`src/app/globals.css\`) and reused everywhere. | magic value, hard-coded colour |`
- `docs/spec.md` Folder layout: add `src/components/global/` entries for `PageShell` and `NavLink` only if the human wants individual components listed; the folder is already listed.
