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

  it('shows the project year', () => {
    render(<ProjectCard project={buriccat} />);

    expect(screen.getByText(String(buriccat.year))).toBeInTheDocument();
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

  it('carries one decorative tape strip hidden from assistive technology', () => {
    const { container } = render(<ProjectCard project={buriccat} />);

    const hidden = container.querySelectorAll('[aria-hidden="true"]');
    expect(hidden).toHaveLength(1);
    expect(hidden[0]).toBeEmptyDOMElement();
  });

  it('shows no repository or paper link when the project has neither', () => {
    render(<ProjectCard project={{ ...buriccat, links: undefined }} />);

    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Buriccat' })).toBeInTheDocument();
  });

  it('renders a long title as one link', () => {
    const title = 'A Very Long Project Title '.repeat(8).trim();
    render(<ProjectCard project={{ ...buriccat, title }} />);

    expect(screen.getByRole('link', { name: title })).toBeInTheDocument();
  });

  it('shows no image when there is no cover', () => {
    render(<ProjectCard project={buriccat} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
