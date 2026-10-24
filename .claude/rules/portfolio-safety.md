# Portfolio safety
- Never publish personal data (phone, home address, ID numbers, photos of other people) without the human's explicit approval in this session.
- Never invent facts about the human: jobs, dates, results, quotes, testimonials. Use `TODO(human)` placeholders.
- Never use third-party content (images, fonts, code) without checking its licence and noting the credit.
- Always keep the site buildable as a static export: no server-only features (`SE-01`).
- Always honour reduced motion and keyboard access (`A11Y-02`, `A11Y-03`).
- Changes to `next.config.mjs`, `basePath` or the deploy workflow can take the live site down: Level 3, with a named rollback.
- Never hardcode secrets. Use environment variables; never read real `.env` files.
- When requirements are unclear or conflict, stop and ask instead of guessing.
