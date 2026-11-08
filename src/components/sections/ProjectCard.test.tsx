import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';
import { projects } from '@/data/projects';

const cardGame = projects.find((project) => project.slug === '3d-card-game')!;
const thesis = projects.find((project) => project.slug === 'cockatiel-recognition')!;

describe('ProjectCard', () => {
  it('links the title to the case study and shows the summary and tags', () => {
    render(<ProjectCard project={cardGame} />);

    // next/link adds the trailing slash only in the real build, so the test sees /projects/3d-card-game.
    expect(screen.getByRole('link', { name: '3D Card Game' })).toHaveAttribute(
      'href',
      '/projects/3d-card-game',
    );
    expect(screen.getByText(cardGame.summary)).toBeInTheDocument();
    for (const tag of cardGame.tags) expect(screen.getByText(tag)).toBeInTheDocument();
  });

  it('shows the project year', () => {
    render(<ProjectCard project={cardGame} />);

    expect(screen.getByText(String(cardGame.year))).toBeInTheDocument();
  });

  it('links to the repository as an external link', () => {
    render(<ProjectCard project={cardGame} />);

    expect(screen.getByRole('link', { name: '3D Card Game repository' })).toHaveAttribute(
      'href',
      'https://github.com/saaquiteles/baccarat',
    );
  });

  it('links to both the repository and the published paper when a project has them', () => {
    render(<ProjectCard project={thesis} />);

    expect(screen.getByRole('link', { name: `${thesis.title} paper` })).toHaveAttribute(
      'href',
      'https://ebooks.iospress.nl/doi/10.3233/ATDE251126',
    );
    expect(screen.getByRole('link', { name: `${thesis.title} repository` })).toHaveAttribute(
      'href',
      'https://github.com/saaquiteles/thesis-project',
    );
  });

  it('carries one decorative tape strip hidden from assistive technology', () => {
    const { container } = render(<ProjectCard project={cardGame} />);

    const hidden = container.querySelectorAll('[aria-hidden="true"]');
    expect(hidden).toHaveLength(1);
    expect(hidden[0]).toBeEmptyDOMElement();
  });

  it('shows no repository or paper link when the project has neither', () => {
    render(<ProjectCard project={{ ...cardGame, links: undefined }} />);

    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link', { name: '3D Card Game' })).toBeInTheDocument();
  });

  it('renders a long title as one link', () => {
    const title = 'A Very Long Project Title '.repeat(8).trim();
    render(<ProjectCard project={{ ...cardGame, title }} />);

    expect(screen.getByRole('link', { name: title })).toBeInTheDocument();
  });

  it('shows no image when there is no cover', () => {
    render(<ProjectCard project={cardGame} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
