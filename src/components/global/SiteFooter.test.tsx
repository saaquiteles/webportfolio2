import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiteFooter } from './SiteFooter';

describe('SiteFooter', () => {
  it('is a contentinfo landmark holding only the name and the current year', () => {
    render(<SiteFooter />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveTextContent(`© ${new Date().getFullYear()} Sean Argie A. Quiteles`);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
