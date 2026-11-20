import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/data/projects', () => ({
  projects: [],
}));

import Home from './page';

describe('Home page with no projects', () => {
  it('renders neither the Projects section nor its heading', () => {
    render(<Home />);

    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Projects' })).not.toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });
});
