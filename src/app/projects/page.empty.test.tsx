import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/data/projects', () => ({ projects: [] }));

import Projects from './page';

describe('Projects page with no projects', () => {
  it('shows only the heading and no cards', () => {
    render(<Projects />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Projects');
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryAllByRole('heading', { level: 2 })).toHaveLength(0);
  });
});
