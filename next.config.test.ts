// @vitest-environment node
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';
import { afterEach, describe, expect, it, vi } from 'vitest';

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

async function loadConfig(): Promise<NextConfig> {
  vi.resetModules();
  const loaded: { default: NextConfig } = await import('./next.config.mjs');
  return loaded.default;
}

// Windows paths can differ in drive-letter case and trailing slashes
function normalise(p: string): string {
  return path.resolve(p).replace(/[\\/]+$/, '').toLowerCase();
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('next.config.mjs', () => {
  it('exports statically with no base path by default', async () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', undefined);
    const config = await loadConfig();
    expect(config.output).toBe('export');
    expect(config.trailingSlash).toBe(true);
    expect(config.images?.unoptimized).toBe(true);
    expect(config.basePath).toBeUndefined();
    expect(config.assetPrefix).toBeUndefined();
  });

  it('uses NEXT_PUBLIC_BASE_PATH for basePath and assetPrefix', async () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/portfolio');
    const config = await loadConfig();
    expect(config.basePath).toBe('/portfolio');
    expect(config.assetPrefix).toBe('/portfolio');
  });

  it('treats an empty NEXT_PUBLIC_BASE_PATH as no base path', async () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '');
    const config = await loadConfig();
    expect(config.basePath).toBeUndefined();
    expect(config.assetPrefix).toBeUndefined();
  });

  it('pins the Turbopack root to the repo root', async () => {
    const config = await loadConfig();
    expect(config.turbopack?.root).toBeDefined();
    expect(normalise(config.turbopack?.root ?? '')).toBe(normalise(repoRoot));
  });
});

describe('public/.nojekyll', () => {
  it('exists and is empty', () => {
    const file = path.join(repoRoot, 'public', '.nojekyll');
    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBe(0);
  });
});
