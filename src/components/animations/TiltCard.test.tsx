import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { TiltCard } from './TiltCard';
import { useReducedMotion } from './useReducedMotion';

vi.mock('./useReducedMotion', () => ({ useReducedMotion: vi.fn() }));

function mockMedia({ reduced, finePointer }: { reduced: boolean; finePointer: boolean }) {
  vi.mocked(useReducedMotion).mockReturnValue(reduced);
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: finePointer,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

function renderCard() {
  const view = render(
    <TiltCard>
      <button type="button">Case study</button>
    </TiltCard>,
  );
  const wrapper = view.container.firstElementChild as HTMLElement;
  wrapper.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100, x: 0, y: 0 }) as DOMRect;
  return wrapper;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('TiltCard', () => {
  it('renders the children with no transform when motion is reduced', () => {
    mockMedia({ reduced: true, finePointer: true });
    const wrapper = renderCard();

    expect(screen.getByRole('button', { name: 'Case study' })).toBeInTheDocument();
    fireEvent.pointerMove(wrapper, { clientX: 190, clientY: 5 });
    expect(wrapper.style.transform).toBe('');
  });

  it('renders the children with no transform when there is no fine pointer', () => {
    mockMedia({ reduced: false, finePointer: false });
    const wrapper = renderCard();

    fireEvent.pointerMove(wrapper, { clientX: 190, clientY: 5 });
    fireEvent.focus(screen.getByRole('button', { name: 'Case study' }));
    expect(wrapper.style.transform).toBe('');
  });

  it('tilts toward the pointer when motion is allowed', async () => {
    mockMedia({ reduced: false, finePointer: true });
    const wrapper = renderCard();

    fireEvent.pointerMove(wrapper, { clientX: 190, clientY: 5 });

    await waitFor(() => expect(wrapper.style.transform).toMatch(/rotateY\((?!0deg)/));
  });

  it('never tilts past the bound', async () => {
    mockMedia({ reduced: false, finePointer: true });
    const wrapper = renderCard();

    fireEvent.pointerMove(wrapper, { clientX: 100000, clientY: -100000 });

    await waitFor(() => expect(wrapper.style.transform).toMatch(/rotateY\((?!0deg)/));
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const angles = [...wrapper.style.transform.matchAll(/rotate[XY]\((-?[\d.]+)deg\)/g)].map((m) =>
      Math.abs(Number(m[1])),
    );
    expect(angles.length).toBeGreaterThan(0);
    for (const angle of angles) expect(angle).toBeLessThanOrEqual(10.5);
  });

  it('settles flat when the pointer leaves', async () => {
    mockMedia({ reduced: false, finePointer: true });
    const wrapper = renderCard();

    fireEvent.pointerMove(wrapper, { clientX: 190, clientY: 5 });
    await waitFor(() => expect(wrapper.style.transform).toMatch(/rotateY\((?!0deg)/));
    fireEvent.pointerLeave(wrapper);

    await waitFor(() => expect(wrapper.style.transform).not.toMatch(/rotateY\((?!0deg)/));
    expect(wrapper.style.transform).not.toMatch(/rotateX\((?!0deg)/);
  });

  it('lifts on keyboard focus and settles on blur', async () => {
    mockMedia({ reduced: false, finePointer: true });
    const wrapper = renderCard();
    const link = screen.getByRole('button', { name: 'Case study' });

    fireEvent.focus(link);
    await waitFor(() => expect(wrapper.style.transform).toMatch(/scale\((?!1\))/));

    expect(wrapper).toHaveClass('shadow-2xl');

    fireEvent.blur(link);
    await waitFor(() => expect(wrapper.style.transform).not.toMatch(/scale\((?!1\))/));
  });

  it('drops the lifted shadow when reduced motion is switched on while the card is lifted', async () => {
    mockMedia({ reduced: false, finePointer: true });
    const card = () => (
      <TiltCard>
        <button type="button">Case study</button>
      </TiltCard>
    );
    const view = render(card());
    const wrapper = view.container.firstElementChild as HTMLElement;

    fireEvent.focus(screen.getByRole('button', { name: 'Case study' }));
    await waitFor(() => expect(wrapper).toHaveClass('shadow-2xl'));
    vi.mocked(useReducedMotion).mockReturnValue(true);
    view.rerender(card());

    expect(wrapper).not.toHaveClass('shadow-2xl');
  });

  it('stays lifted when focus moves to another element inside the card', async () => {
    mockMedia({ reduced: false, finePointer: true });
    const view = render(
      <TiltCard>
        <button type="button">First</button>
        <button type="button">Second</button>
      </TiltCard>,
    );
    const wrapper = view.container.firstElementChild as HTMLElement;
    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });

    fireEvent.focus(first);
    await waitFor(() => expect(wrapper.style.transform).toMatch(/scale\((?!1\))/));
    fireEvent.blur(first, { relatedTarget: second });

    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(wrapper.style.transform).toMatch(/scale\((?!1\))/);
  });

  it('ignores the pointer over a box with no size', async () => {
    mockMedia({ reduced: false, finePointer: true });
    const wrapper = renderCard();
    wrapper.getBoundingClientRect = () => ({ left: 0, top: 0, width: 0, height: 0 }) as DOMRect;

    fireEvent.pointerMove(wrapper, { clientX: 50, clientY: 50 });

    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(wrapper.style.transform).not.toMatch(/rotateY\((?!0deg)/);
  });

  it('keeps the same DOM nodes when the page hydrates on a fine pointer, so the card stays in place', async () => {
    mockMedia({ reduced: false, finePointer: true });
    const card = (
      <TiltCard>
        <button type="button">Case study</button>
      </TiltCard>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(card);
    document.body.appendChild(container);
    const button = screen.getByRole('button', { name: 'Case study' });

    let root!: ReturnType<typeof hydrateRoot>;
    try {
      await act(async () => {
        root = hydrateRoot(container, card);
      });
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(screen.getByRole('button', { name: 'Case study' })).toBe(button);
      expect(document.body.contains(button)).toBe(true);
    } finally {
      act(() => root?.unmount());
      container.remove();
    }
  });
});
