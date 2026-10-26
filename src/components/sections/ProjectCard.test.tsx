import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';
import { projects } from '@/data/projects';

const buriccat = projects.find((project) => project.slug === 'buriccat')!;
const thesis = projects.find((project) => project.slug === 'cockatiel-recognition')!;

describe('ProjectCard', () => {
  it('links the title to the case study and shows the summary and tags', () => {
    render(<ProjectCard project={buriccat} />);

    // next/link adds the trailing slash only in the real build, so the test sees /projects/buriccat.
    expect(screen.getByRole('link', { name: 'Buriccat' })).toHaveAttribute(
      'href',
      '/projects/buriccat',
    );
    expect(screen.getByText(buriccat.summary)).toBeInTheDocument();
    for (const tag of buriccat.tags) expect(screen.getByText(tag)).toBeInTheDocument();
  });

  it('links to the repository as an external link', () => {
    render(<ProjectCard project={buriccat} />);

    expect(screen.getByRole('link', { name: 'Buriccat repository' })).toHaveAttribute(
      'href',
      'https://github.com/saaquiteles/baccarat',
    );
  });

  it('links to the published paper when a project has one', () => {
    render(<ProjectCard project={thesis} />);

    expect(screen.getByRole('link', { name: `${thesis.title} paper` })).toHaveAttribute(
      'href',
      'https://ebooks.iospress.nl/doi/10.3233/ATDE251126',
    );
    expect(screen.queryByRole('link', { name: /repository/ })).not.toBeInTheDocument();
  });

  it('shows no image when there is no cover', () => {
    render(<ProjectCard project={buriccat} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
