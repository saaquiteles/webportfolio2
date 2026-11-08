import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Projects from './page';
import { projects } from '@/data/projects';

describe('Projects page', () => {
  it('has one level-1 heading "Projects" and a main landmark', () => {
    render(<Projects />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Projects');
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('shows one card per project, the thesis first', () => {
    render(<Projects />);

    const titles = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent);
    expect(titles).toEqual(projects.map((project) => project.title));
    expect(titles[0]).toBe('A Vision System That Tells Cockatiels Apart');
  });

  it('lists the cards in a grid and alternates their tilt', () => {
    render(<Projects />);

    const cards = screen.getAllByRole('listitem').filter((item) => item.querySelector('article'));
    expect(cards).toHaveLength(projects.length);
    cards.forEach((card, index) => {
      expect(card).toHaveClass(index % 2 === 0 ? 'rotate-1' : '-rotate-1');
    });
    expect(cards[0].parentElement).toHaveClass('grid', 'grid-cols-1');
  });
});
