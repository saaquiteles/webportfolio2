import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/data/projects', () => ({
  projects: [
    {
      slug: 'only-one',
      title: 'Only One',
      summary: 'A summary.',
      year: 2025,
      tags: ['Tag'],
      featured: true,
    },
    {
      slug: 'hidden',
      title: 'Hidden One',
      summary: 'Another summary.',
      year: 2024,
      tags: ['Tag'],
      featured: false,
    },
  ],
}));

import Home from './page';

describe('Home page with a single featured project', () => {
  it('shows one card and keeps one level-1 heading', () => {
    render(<Home />);

    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Only One' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Hidden One' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });
});
