import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { ProjectGrid } from '@/components/sections/ProjectGrid';
import { projects } from '@/data/projects';
import { useReducedMotion } from './useReducedMotion';

vi.mock('./useReducedMotion', () => ({ useReducedMotion: vi.fn() }));

const grid = projects.slice(0, 3);

function mockMedia({ reduced, finePointer }: { reduced: boolean; finePointer: boolean }) {
  vi.mocked(useReducedMotion).mockReturnValue(reduced);
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: finePointer,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

function box(left: number, top: number, width = 200, height = 100) {
  return () =>
    ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top }) as DOMRect;
}

function cardWrappers() {
  return screen.getAllByRole('article').map((article) => article.parentElement as HTMLElement);
}

function placeCards(boxes: Array<ReturnType<typeof box>>) {
  cardWrappers().forEach((wrapper, index) => {
    wrapper.getBoundingClientRect = boxes[index];
  });
}

const inARow = [box(0, 0), box(300, 0), box(600, 0)];

function shift(wrapper: HTMLElement) {
  const x = /translateX\((-?[\d.]+)px\)/.exec(wrapper.style.transform);
  const y = /translateY\((-?[\d.]+)px\)/.exec(wrapper.style.transform);
  return { x: x ? Number(x[1]) : 0, y: y ? Number(y[1]) : 0 };
}

function liftCard(wrapper: HTMLElement) {
  fireEvent.pointerMove(wrapper, { clientX: 100, clientY: 50 });
}

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Neighbours make room', () => {
  it('moves the neighbouring cards away from the lifted card, by at most 6 px', async () => {
    mockMedia({ reduced: false, finePointer: true });
    render(<ProjectGrid projects={grid} pickup />);
    placeCards(inARow);
    const [left, middle, right] = cardWrappers();

    liftCard(middle);

    await waitFor(() => expect(shift(left).x).toBeLessThan(-1));
    await waitFor(() => expect(shift(right).x).toBeGreaterThan(1));
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(Math.abs(shift(left).x)).toBeLessThanOrEqual(6.1);
    expect(Math.abs(shift(right).x)).toBeLessThanOrEqual(6.1);
    expect(shift(left).y).toBeCloseTo(0, 1);
    expect(shift(middle).x).toBeCloseTo(0, 1);
    expect(shift(middle).y).toBeCloseTo(0, 1);
  });

  it('moves neighbours up and down in a single column', async () => {
    mockMedia({ reduced: false, finePointer: true });
    render(<ProjectGrid projects={grid} pickup />);
    placeCards([box(0, 0), box(0, 200), box(0, 400)]);
    const [top, middle, bottom] = cardWrappers();

    liftCard(middle);

    await waitFor(() => expect(shift(top).y).toBeLessThan(-1));
    await waitFor(() => expect(shift(bottom).y).toBeGreaterThan(1));
    expect(shift(top).x).toBeCloseTo(0, 1);
  });

  it('drifts every card back to rest when the pointer leaves', async () => {
    mockMedia({ reduced: false, finePointer: true });
    render(<ProjectGrid projects={grid} pickup />);
    placeCards(inARow);
    const [left, middle, right] = cardWrappers();

    liftCard(middle);
    await waitFor(() => expect(shift(left).x).toBeLessThan(-1));
    fireEvent.pointerLeave(middle);

    await waitFor(() => expect(shift(left).x).toBeCloseTo(0, 1));
    await waitFor(() => expect(shift(right).x).toBeCloseTo(0, 1));
  });

  it('makes room on keyboard focus and settles on blur', async () => {
    mockMedia({ reduced: false, finePointer: true });
    render(<ProjectGrid projects={grid} pickup />);
    placeCards(inARow);
    const [left, , right] = cardWrappers();
    const button = screen.getByRole('button', { name: `Pick up ${grid[1].title}` });

    fireEvent.focus(button);
    await waitFor(() => expect(shift(left).x).toBeLessThan(-1));
    await waitFor(() => expect(shift(right).x).toBeGreaterThan(1));

    fireEvent.blur(button);
    await waitFor(() => expect(shift(left).x).toBeCloseTo(0, 1));
    await waitFor(() => expect(shift(right).x).toBeCloseTo(0, 1));
  });

  it('leaves no card offset when the lift passes quickly from one card to the next', async () => {
    mockMedia({ reduced: false, finePointer: true });
    render(<ProjectGrid projects={grid} pickup />);
    placeCards(inARow);
    const [left, middle, right] = cardWrappers();

    liftCard(left);
    liftCard(middle);
    fireEvent.pointerLeave(left);
    await waitFor(() => expect(shift(right).x).toBeGreaterThan(1));
    liftCard(right);
    fireEvent.pointerLeave(middle);
    fireEvent.pointerLeave(right);

    await waitFor(() => {
      for (const card of [left, middle, right]) {
        expect(shift(card).x).toBeCloseTo(0, 1);
        expect(shift(card).y).toBeCloseTo(0, 1);
      }
    });
  });

  it('moves nothing for reduced motion', async () => {
    mockMedia({ reduced: true, finePointer: true });
    render(<ProjectGrid projects={grid} pickup />);
    placeCards(inARow);
    const [left, middle, right] = cardWrappers();

    liftCard(middle);
    fireEvent.focus(screen.getByRole('button', { name: `Pick up ${grid[1].title}` }));

    await new Promise((resolve) => setTimeout(resolve, 300));
    for (const card of [left, right]) expect(card.style.transform).toBe('');
  });

  it('moves nothing on a touch screen', async () => {
    mockMedia({ reduced: false, finePointer: false });
    render(<ProjectGrid projects={grid} pickup />);
    placeCards(inARow);
    const [left, middle, right] = cardWrappers();

    liftCard(middle);
    fireEvent.focus(screen.getByRole('button', { name: `Pick up ${grid[1].title}` }));

    await new Promise((resolve) => setTimeout(resolve, 300));
    for (const card of [left, right]) expect(card.style.transform).toBe('');
  });

  it('returns the cards to rest at once when reduced motion is switched on', async () => {
    mockMedia({ reduced: false, finePointer: true });
    const view = render(<ProjectGrid projects={grid} pickup />);
    placeCards(inARow);
    const [left, middle] = cardWrappers();

    liftCard(middle);
    await waitFor(() => expect(shift(left).x).toBeLessThan(-1));
    vi.mocked(useReducedMotion).mockReturnValue(true);
    view.rerender(<ProjectGrid projects={grid} pickup />);

    expect(left.style.transform).toBe('');
    expect(middle.style.transform).toBe('');
  });

  it('makes room again when motion is allowed again while the pointer is still on the lifted card', async () => {
    mockMedia({ reduced: false, finePointer: true });
    const view = render(<ProjectGrid projects={grid} pickup />);
    placeCards(inARow);
    const [left, middle, right] = cardWrappers();

    liftCard(middle);
    await waitFor(() => expect(shift(left).x).toBeLessThan(-1));
    vi.mocked(useReducedMotion).mockReturnValue(true);
    view.rerender(<ProjectGrid projects={grid} pickup />);
    vi.mocked(useReducedMotion).mockReturnValue(false);
    view.rerender(<ProjectGrid projects={grid} pickup />);
    liftCard(middle);

    await waitFor(() => expect(shift(left).x).toBeLessThan(-1));
    await waitFor(() => expect(shift(right).x).toBeGreaterThan(1));
  });

  it('does not move a card whose box has no size, or any card when there is no layout', async () => {
    mockMedia({ reduced: false, finePointer: true });
    render(<ProjectGrid projects={grid} pickup />);
    placeCards([box(0, 0, 0, 0), box(300, 0), box(600, 0)]);
    const [empty, middle, right] = cardWrappers();

    liftCard(middle);

    await waitFor(() => expect(shift(right).x).toBeGreaterThan(1));
    expect(shift(empty).x).toBeCloseTo(0, 1);
    expect(shift(empty).y).toBeCloseTo(0, 1);
    cleanup();

    render(<ProjectGrid projects={grid} pickup />);
    const [noLayoutLeft, noLayoutMiddle] = cardWrappers();
    liftCard(noLayoutMiddle);
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(shift(noLayoutLeft).x).toBeCloseTo(0, 1);
    expect(shift(noLayoutLeft).y).toBeCloseTo(0, 1);
  });

  it('pauses while the project overlay is open and is at rest after it closes', async () => {
    mockMedia({ reduced: false, finePointer: true });
    render(<ProjectGrid projects={grid} pickup />);
    placeCards(inARow);
    const [left, middle, right] = cardWrappers();
    const button = screen.getByRole('button', { name: `Pick up ${grid[1].title}` });

    fireEvent.focus(button);
    await waitFor(() => expect(shift(left).x).toBeLessThan(-1));
    fireEvent.click(button);
    await waitFor(() => expect(shift(left).x).toBeCloseTo(0, 1));
    await waitFor(() => expect(shift(right).x).toBeCloseTo(0, 1));

    liftCard(middle);
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(shift(left).x).toBeCloseTo(0, 1);

    fireEvent.click(screen.getByRole('button', { name: 'Put back' }));
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(shift(left).x).toBeCloseTo(0, 1);
    expect(shift(right).x).toBeCloseTo(0, 1);
  });

  it('makes room again for the next lift once the overlay has closed', async () => {
    mockMedia({ reduced: false, finePointer: true });
    render(<ProjectGrid projects={grid} pickup />);
    placeCards(inARow);
    const [left, middle, right] = cardWrappers();

    fireEvent.click(screen.getByRole('button', { name: `Pick up ${grid[1].title}` }));
    fireEvent.click(screen.getByRole('button', { name: 'Put back' }));
    liftCard(left);

    await waitFor(() => expect(shift(middle).x).toBeGreaterThan(1));
    await waitFor(() => expect(shift(right).x).toBeGreaterThan(1));
  });

  it('lifts the trigger card after close and keeps the neighbours at rest until the next lift', async () => {
    mockMedia({ reduced: false, finePointer: true });
    render(<ProjectGrid projects={grid} pickup />);
    placeCards(inARow);
    const [left, middle, right] = cardWrappers();

    fireEvent.click(screen.getByRole('button', { name: `Pick up ${grid[1].title}` }));
    fireEvent.click(screen.getByRole('button', { name: 'Put back' }));

    await waitFor(() => expect(middle.style.transform).toMatch(/scale\((?!1\))/));
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(shift(left).x).toBeCloseTo(0, 1);
    expect(shift(right).x).toBeCloseTo(0, 1);
  });

  it('keeps the same DOM nodes when the page hydrates on a fine pointer', async () => {
    mockMedia({ reduced: false, finePointer: true });
    const page = <ProjectGrid projects={grid} pickup />;
    const container = document.createElement('div');
    container.innerHTML = renderToString(page);
    document.body.appendChild(container);
    const before = [...container.querySelectorAll('li, article')];

    let root!: ReturnType<typeof hydrateRoot>;
    try {
      await act(async () => {
        root = hydrateRoot(container, page);
      });
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      const after = [...container.querySelectorAll('li, article')];
      expect(after).toHaveLength(before.length);
      after.forEach((node, index) => expect(node).toBe(before[index]));
    } finally {
      act(() => root?.unmount());
      container.remove();
    }
  });
});
