import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { SiteHeader } from './SiteHeader';

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
});
