import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound, { metadata } from './not-found';

describe('Not found page', () => {
  it('has one h1, one main with the skip-link target and a link home', () => {
    render(<NotFound />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
    expect(screen.getByRole('link', { name: 'Back to Home' })).toHaveAttribute('href', '/');
  });

  it('sets the page title to Page not found', () => {
    expect(metadata.title).toBe('Page not found');
  });
});
