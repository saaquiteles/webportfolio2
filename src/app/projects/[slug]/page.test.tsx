import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page, { generateStaticParams } from './page';

describe('Case study page', () => {
  it('generates one static page per case study', () => {
    expect(generateStaticParams()).toEqual([{ slug: 'buriccat' }]);
  });

  it('shows the title as the only h1, a main landmark and the body text', async () => {
    render(await Page({ params: Promise.resolve({ slug: 'buriccat' }) }));

    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('Buriccat');
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText('A fun project to try out React Three Fiber.')).toBeInTheDocument();
  });

  it('does not render a page for an unknown slug', async () => {
    await expect(Page({ params: Promise.resolve({ slug: 'does-not-exist' }) })).rejects.toThrow(
      'NEXT_HTTP_ERROR_FALLBACK;404',
    );
  });
});
