export function withBasePath(path: string): string {
  // Next inlines this exact form at build time; keep the dot access.
  const prefix = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/+$/, '');
  const rooted = path.startsWith('/') ? path : `/${path}`;
  return `${prefix}${rooted}`;
}
