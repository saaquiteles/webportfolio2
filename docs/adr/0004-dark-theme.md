# ADR 0004: Dark theme for the Lab Notebook

Status: Proposed (the human decides). Requirement R-10 is "should have".

## Gap
The approved palette is light only.

## Options
1. **Skip dark mode for v1.** Ship the notebook look only. Simplest, and the paper metaphor is part of the identity.
2. **"Night notebook":** a dark blueprint-paper variant (deep navy or charcoal paper, chalk-like ink, tomato and blue brightened to keep AA contrast). Follows the system setting with a manual toggle.

## Recommendation
Option 1 for v1, then option 2 after the pages exist. Dark colours must be chosen and contrast-checked, not auto-inverted.

## Consequences
Because colours are theme tokens (`ST-05`), adding dark later means redefining token values, not editing components.
