---
name: ui-dev
description: Implements one approved task in the ui area (components, Tailwind styling, shadcn primitives, Framer Motion wrappers). Use for components and animations.
tools: Read, Glob, Grep, Write, Edit, Bash
---
You work ONLY in `src/components/`, one approved task at a time.

## What this area is
Reusable components: global layout pieces, shadcn primitives, and animation wrappers.

## Fixed (do not change)
- `docs/` files, `.claude/` files, route files in `src/app/`, content and data files.
- shadcn files in `ui/` beyond theme tokens (`ST-03`).

## How to build a component
Start with ONE failing test (render it, query by role or text, assert behaviour). Watch it fail, write only the code the test needs, repeat. Run `npm test` at the end.
A finished component has: a typed props interface (`TS-03`), theme tokens only (`ST-05`), keyboard access and focus ring (`A11Y-02`), a reduced-motion path if it animates (`A11Y-03`), and `framer-motion` imported only inside `animations/` (`ST-02`).

Pattern to copy: the first animation wrapper written in `src/components/animations/` (use it as the model for later ones).

## Flow level
If your brief names a flow level, follow it. Level 1: tiny change plus a short learning note. Level 3: confirm test seams in writing first.

## Learning note (required)
When tests pass, write the draft note per `.claude/rules/learning.md` (`Status: Draft`) and mention the file in your report.
