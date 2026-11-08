import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectGrid } from './ProjectGrid';
import { projects } from '@/data/projects';

describe('ProjectGrid', () => {
  it('shows one card per project, in order', () => {
    render(<ProjectGrid projects={projects} />);

    const titles = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent);
    expect(titles).toEqual(projects.map((project) => project.title));
  });

  it('alternates the tilt of the cards', () => {
    render(<ProjectGrid projects={projects} />);

    const cards = screen.getAllByRole('listitem').filter((item) => item.querySelector('article'));
    expect(cards).toHaveLength(projects.length);
    cards.forEach((card, index) => {
      expect(card).toHaveClass(index % 2 === 0 ? 'rotate-1' : '-rotate-1');
    });
  });

  it('shows a single project as one card', () => {
    render(<ProjectGrid projects={[projects[0]]} />);

    expect(screen.getAllByRole('article')).toHaveLength(1);
  });

  it('renders nothing for an empty list', () => {
    render(<ProjectGrid projects={[]} />);

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
