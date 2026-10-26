---
name: new-blog-post
description: Checklist for adding a blog post. Use when creating or editing a post.
---
1. Create `content/blog/<slug>.mdx` with `title`, `slug`, `summary`, `date`, `tags`, and `draft: true` until the human approves.
2. Images go in `public/`, with `alt` text.
3. Never invent claims or quotes; ask the human for the content.
4. Run `npm run check`; the build must pass and drafts must not appear in the output (`CT-02`).
