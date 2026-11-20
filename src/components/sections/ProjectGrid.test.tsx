import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { ProjectGrid } from './ProjectGrid';
import { projects } from '@/data/projects';

const cardGame = projects.find((project) => project.slug === '3d-card-game')!;

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});

function pickUp(title: string) {
  const card = screen.getByRole('heading', { level: 2, name: title }).closest('article')!;
  const button = card.querySelector('button') as HTMLButtonElement;
  fireEvent.click(button);
  return button;
}

describe('ProjectGrid with pickup', () => {
  it('opens the project overlay with the card details when Pick up is pressed', () => {
    render(<ProjectGrid projects={projects} pickup />);

    fireEvent.click(screen.getAllByRole('button', { name: /^Pick up/ })[1]);

    const dialog = screen.getByRole('dialog', { name: cardGame.title });
    expect(dialog).toHaveTextContent(cardGame.summary);
    for (const tag of cardGame.tags) expect(dialog).toHaveTextContent(tag);
    expect(within(dialog).getByRole('link', { name: `${cardGame.title} repository` })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Read the full case study' })).toHaveAttribute(
      'href',
      '/projects/3d-card-game',
    );
  });

  it('keeps a long panel inside the viewport and scrolls it', () => {
    render(<ProjectGrid projects={projects} pickup />);

    fireEvent.click(screen.getAllByRole('button', { name: /^Pick up/ })[0]);

    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toMatch(/max-h-11\/12/);
    expect(dialog.className).toMatch(/overflow-y-auto/);
  });

  it('mounts no dialog until a card is picked up', () => {
    render(<ProjectGrid projects={projects} pickup />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('moves focus into the overlay on open', () => {
    render(<ProjectGrid projects={projects} pickup />);
    pickUp(cardGame.title);

    expect(screen.getByRole('button', { name: 'Put back' })).toHaveFocus();
  });

  it('closes on Escape and puts focus back on the Pick up button', () => {
    render(<ProjectGrid projects={projects} pickup />);
    const button = pickUp(cardGame.title);

    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it('closes with the Put back button and returns focus', () => {
    render(<ProjectGrid projects={projects} pickup />);
    const button = pickUp(cardGame.title);

    fireEvent.click(screen.getByRole('button', { name: 'Put back' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it('closes on a click on the backdrop but not on a click inside the panel', () => {
    render(<ProjectGrid projects={projects} pickup />);
    pickUp(cardGame.title);
    const dialog = screen.getByRole('dialog');

    fireEvent.click(within(dialog).getByText(cardGame.summary));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(dialog);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('resets and returns focus when the browser closes the dialog without a cancel event', () => {
    render(<ProjectGrid projects={projects} pickup />);
    const button = pickUp(cardGame.title);

    fireEvent(screen.getByRole('dialog'), new Event('close'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it('still opens, and closes, when the browser has no showModal', () => {
    Object.assign(HTMLDialogElement.prototype, { showModal: undefined, close: undefined });
    render(<ProjectGrid projects={projects} pickup />);
    const button = pickUp(cardGame.title);

    expect(screen.getByRole('dialog', { name: cardGame.title })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Put back' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it('shows no empty link row for a project without links', () => {
    render(<ProjectGrid projects={[{ ...cardGame, links: undefined }]} pickup />);
    pickUp(cardGame.title);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).queryByRole('link', { name: /repository|paper/ })).not.toBeInTheDocument();
    expect(within(dialog).getAllByRole('link')).toHaveLength(1);
  });

  it('adds no history entry and keeps the title link', () => {
    const push = vi.spyOn(window.history, 'pushState');
    render(<ProjectGrid projects={projects} pickup />);
    pickUp(cardGame.title);

    expect(push).not.toHaveBeenCalled();
    expect(screen.getAllByRole('link', { name: cardGame.title })[0]).toHaveAttribute(
      'href',
      '/projects/3d-card-game',
    );
    push.mockRestore();
  });

  it('is in the static HTML as a hidden button with no dialog', () => {
    const html = renderToString(<ProjectGrid projects={projects} pickup />);
    const container = document.createElement('div');
    container.innerHTML = html;

    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(projects.length);
    buttons.forEach((button) => expect(button).toHaveAttribute('hidden'));
    expect(container.querySelector('dialog')).toBeNull();
  });

  it('keeps the same DOM nodes when the page hydrates, and then shows the button', async () => {
    const grid = <ProjectGrid projects={projects} pickup />;
    const container = document.createElement('div');
    container.innerHTML = renderToString(grid);
    document.body.appendChild(container);
    const link = container.querySelector('a') as HTMLElement;
    const button = container.querySelector('button') as HTMLElement;

    let root!: ReturnType<typeof hydrateRoot>;
    try {
      await act(async () => {
        root = hydrateRoot(container, grid);
      });
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(container.querySelector('a')).toBe(link);
      expect(container.querySelector('button')).toBe(button);
      expect(button).not.toHaveAttribute('hidden');
    } finally {
      act(() => root?.unmount());
      container.remove();
    }
  });

  it('shows no Pick up button when the grid is not opted in', () => {
    render(<ProjectGrid projects={projects} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

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
