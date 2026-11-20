import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/data/projects', () => ({
  projects: [
    { slug: 'first', title: 'First One', summary: 'A summary.', year: 2025, tags: ['Tag'], featured: false },
    { slug: 'second', title: 'Second One', summary: 'Another summary.', year: 2024, tags: ['Tag'], featured: true },
  ],
}));

import Home from './page';

describe('Home page with a mix of featured and other projects', () => {
  it('shows every project in data order, each with a Pick up button', () => {
    render(<Home />);

    const titles = screen.getAllByRole('heading', { level: 2 }).filter((heading) => heading.closest('article'));
    expect(titles.map((heading) => heading.textContent)).toEqual(['First One', 'Second One']);
    expect(screen.getAllByRole('button', { name: /^Pick up/ })).toHaveLength(2);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });
});
