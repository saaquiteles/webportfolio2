import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { PageShell } from './PageShell';

describe('PageShell', () => {
  it('renders one main landmark with the skip-link id around its children', () => {
    render(
      <PageShell>
        <h1>Hello</h1>
      </PageShell>,
    );

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'main-content');
    expect(within(main).getByRole('heading', { name: 'Hello' })).toBeInTheDocument();
  });
});
