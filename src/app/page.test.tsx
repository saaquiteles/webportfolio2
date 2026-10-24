import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home page', () => {
  it('shows exactly one level-1 heading', () => {
    render(<Home />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('marks the headline as a TODO(human) placeholder until the resume arrives', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('TODO(human)');
  });

  it('has a main landmark', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
