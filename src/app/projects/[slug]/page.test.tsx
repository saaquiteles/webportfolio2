import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { caseStudies } from '#site/content';
import Page, { generateStaticParams } from './page';

describe('Case study page', () => {
  it('generates one static page per case study', () => {
    const params = generateStaticParams();

    expect(params).toEqual(
      expect.arrayContaining([{ slug: 'buriccat' }, { slug: 'cockatiel-recognition' }]),
    );
    expect(params).toHaveLength(caseStudies.length);
  });

  it('shows the title as the only h1, a main landmark and the body text', async () => {
    render(await Page({ params: Promise.resolve({ slug: 'buriccat' }) }));

    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('Buriccat');
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText('A fun project to try out React Three Fiber.')).toBeInTheDocument();
  });

  it.each(caseStudies.map((study) => study.slug))('%s renders exactly one h1', async (slug) => {
    const { unmount } = render(await Page({ params: Promise.resolve({ slug }) }));

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    unmount();
  });

  it('shows the thesis with its paper link and names the co-authors', async () => {
    render(await Page({ params: Promise.resolve({ slug: 'cockatiel-recognition' }) }));

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'A Vision System That Tells Cockatiels Apart',
    );
    expect(screen.getByRole('link', { name: 'Read the published paper' })).toHaveAttribute(
      'href',
      'https://ebooks.iospress.nl/doi/10.3233/ATDE251126',
    );
    const credits = screen.getByRole('heading', { level: 2, name: 'Credits' });
    expect(credits).toBeInTheDocument();
    const main = within(screen.getByRole('main'));
    expect(main.getByText(/Darryl Angelo O\. Narvaez/)).toBeInTheDocument();
    expect(main.getByText(/Cyrel O\. Manlises/)).toBeInTheDocument();
    expect(main.getByText(/91\.17% accuracy/)).toBeInTheDocument();
  });

  it('does not render a page for an unknown slug', async () => {
    await expect(Page({ params: Promise.resolve({ slug: 'does-not-exist' }) })).rejects.toThrow(
      'NEXT_HTTP_ERROR_FALLBACK;404',
    );
  });
});
