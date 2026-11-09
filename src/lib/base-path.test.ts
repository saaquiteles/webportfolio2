import { afterEach, describe, expect, it, vi } from 'vitest';
import { withBasePath } from './base-path';

describe('withBasePath', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('prefixes the path with NEXT_PUBLIC_BASE_PATH when it is set', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/webportfolio2');

    expect(withBasePath('/images/x.webp')).toBe('/webportfolio2/images/x.webp');
  });

  it('returns the path unchanged when the variable is unset', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', undefined);

    expect(withBasePath('/images/x.webp')).toBe('/images/x.webp');
  });

  it('returns the path unchanged when the variable is the empty string', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '');

    expect(withBasePath('/images/x.webp')).toBe('/images/x.webp');
  });

  it('never produces a double slash when the base path ends in a slash', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/webportfolio2/');

    expect(withBasePath('/images/x.webp')).toBe('/webportfolio2/images/x.webp');
  });

  it('treats a base path of just a slash as no prefix', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/');

    expect(withBasePath('/images/x.webp')).toBe('/images/x.webp');
  });

  it('adds the leading slash when the path has none, with and without a prefix', () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '/webportfolio2');
    expect(withBasePath('images/x.webp')).toBe('/webportfolio2/images/x.webp');

    vi.stubEnv('NEXT_PUBLIC_BASE_PATH', undefined);
    expect(withBasePath('images/x.webp')).toBe('/images/x.webp');
  });
});
