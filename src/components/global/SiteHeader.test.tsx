import { describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { SiteHeader } from './SiteHeader';

const router = vi.hoisted(() => ({ pathname: '/' as string | null }));
vi.mock('next/navigation', () => ({ usePathname: () => router.pathname }));

function currentLinks(pathname: string | null): string[] {
  router.pathname = pathname;
  render(<SiteHeader />);
  return screen
    .getAllByRole('link')
    .filter((link) => link.getAttribute('aria-current') === 'page')
    .map((link) => link.textContent ?? '');
}

describe('SiteHeader', () => {
  it('has a banner landmark with a navigation named Main', () => {
    render(<SiteHeader />);

    const banner = screen.getByRole('banner');
    expect(within(banner).getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
  });

  // next/link adds the trailing slash from next.config.mjs only in the real build (the built
  // pages link to /about/ and /contact/), so the test environment sees the slashless form.
  it('links to Home, About, Projects and Contact', () => {
    render(<SiteHeader />);

    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    expect(within(nav).getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
    expect(within(nav).getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');
    expect(within(nav).getAllByRole('link')).toHaveLength(4);
  });

  it('marks only About as the current page on /about/ and on /about', () => {
    expect(currentLinks('/about/')).toEqual(['About']);
    cleanup();
    expect(currentLinks('/about')).toEqual(['About']);
  });

  it('marks only Home as the current page on /', () => {
    expect(currentLinks('/')).toEqual(['Home']);
  });

  it('marks Projects and Contact as current on their own pages', () => {
    expect(currentLinks('/projects/')).toEqual(['Projects']);
    cleanup();
    expect(currentLinks('/contact/')).toEqual(['Contact']);
  });

  it('marks no link as current when there is no router path', () => {
    expect(currentLinks(null)).toEqual([]);
  });

  it('marks no link as current on a case-study page', () => {
    expect(currentLinks('/projects/buriccat/')).toEqual([]);
  });
});
