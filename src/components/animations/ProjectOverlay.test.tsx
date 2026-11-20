import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ProjectGrid } from '@/components/sections/ProjectGrid';
import { projects } from '@/data/projects';

const project = projects[1];
const CARD = { left: 20, top: 600, width: 300, height: 200 };
const PANEL = { left: 200, top: 100, width: 600, height: 400 };
const LANDING_TIMEOUT = 5000;

function box({ left, top, width, height }: typeof CARD): DOMRect {
  return { left, top, width, height, right: left + width, bottom: top + height, x: left, y: top } as DOMRect;
}

function stubMotion(initiallyReduced: boolean) {
  let reduced = initiallyReduced;
  const listeners = new Set<() => void>();
  vi.stubGlobal('matchMedia', (media: string) => ({
    get matches() {
      return media.includes('reduced') ? reduced : true;
    },
    media,
    addEventListener: (_type: string, callback: () => void) => listeners.add(callback),
    removeEventListener: (_type: string, callback: () => void) => listeners.delete(callback),
  }));
  return {
    setReduced(next: boolean) {
      reduced = next;
      act(() => listeners.forEach((callback) => callback()));
    },
  };
}

function setBoxes(card: typeof CARD, panel: typeof PANEL) {
  HTMLDialogElement.prototype.getBoundingClientRect = () => box(panel);
  screen.getAllByRole('article').forEach((article) => {
    article.closest('li')!.getBoundingClientRect = () => box(card);
  });
}

function pickUp() {
  const article = screen.getByRole('heading', { level: 2, name: project.title }).closest('article')!;
  const card = article.closest('li')!;
  const button = article.querySelector('button') as HTMLButtonElement;
  button.focus();
  fireEvent.click(button);
  return { card, button };
}

function renderGrid(card = CARD, panel = PANEL) {
  render(<ProjectGrid projects={projects} pickup />);
  setBoxes(card, panel);
}

function sheetOf(dialog: HTMLElement) {
  return dialog.querySelector(':scope > [aria-hidden="true"]') as HTMLElement | null;
}

function translateOf(element: HTMLElement) {
  const match = /translate3d\((-?[\d.]+)px, (-?[\d.]+)px/.exec(element.style.transform);
  return { x: Number(match?.[1] ?? 0), y: Number(match?.[2] ?? 0) };
}

function scaleXOf(element: HTMLElement) {
  return Number(/scale\((-?[\d.]+),/.exec(element.style.transform)?.[1] ?? 1);
}

function visibleOpacity(element: HTMLElement, dialog: HTMLElement) {
  let opacity = 1;
  for (let node: HTMLElement | null = element; node && node !== dialog; node = node.parentElement) {
    if (node.style.opacity !== '') opacity *= Number(node.style.opacity);
  }
  return opacity;
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
  delete (HTMLDialogElement.prototype as { getBoundingClientRect?: unknown }).getBoundingClientRect;
});

describe('Project overlay flight', () => {
  it('starts the sheet at the card box, then settles it in the panel with the details fading in after', async () => {
    stubMotion(false);
    renderGrid();
    pickUp();
    const dialog = screen.getByRole('dialog', { name: project.title });
    const summary = within(dialog).getByText(project.summary);

    await waitFor(() => expect(sheetOf(dialog)).not.toBeNull());
    const sheet = sheetOf(dialog)!;
    expect(sheet.style.left).toBe(`${PANEL.left}px`);
    expect(sheet.style.top).toBe(`${PANEL.top}px`);
    expect(sheet.style.width).toBe(`${PANEL.width}px`);
    expect(sheet.style.height).toBe(`${PANEL.height}px`);
    await waitFor(() => expect(translateOf(sheet).x).toBeLessThan(-250));
    expect(translateOf(sheet).y).toBeGreaterThan(300);
    expect(scaleXOf(sheet)).toBeLessThan(0.6);
    expect(visibleOpacity(summary, dialog)).toBe(0);

    await waitFor(() => expect(sheetOf(dialog)).toBeNull(), { timeout: LANDING_TIMEOUT });
    await waitFor(() => expect(visibleOpacity(summary, dialog)).toBe(1), { timeout: LANDING_TIMEOUT });
  });

  it('hides the picked card but keeps it in the grid, and the other cards stay visible', async () => {
    stubMotion(false);
    renderGrid();
    const { card } = pickUp();
    const dialog = screen.getByRole('dialog');

    await waitFor(() => expect(sheetOf(dialog)).not.toBeNull());

    expect(card).toBeInTheDocument();
    expect(card.style.visibility).toBe('hidden');
    const others = screen
      .getAllByRole('article')
      .map((article) => article.closest('li')!)
      .filter((item) => item !== card);
    others.forEach((other) => expect(other.style.visibility).toBe(''));
  });

  it('closes cleanly in the middle of the flight: the card shows again and focus returns to the button', async () => {
    stubMotion(false);
    renderGrid();
    const { card, button } = pickUp();
    const dialog = screen.getByRole('dialog');
    await waitFor(() => expect(sheetOf(dialog)).not.toBeNull());
    expect(card.style.visibility).toBe('hidden');

    let hiddenWhenFocused = 'unset';
    button.addEventListener('focus', () => {
      hiddenWhenFocused = card.style.visibility;
    });
    fireEvent(dialog, new Event('cancel', { cancelable: true }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(card.style.visibility).toBe('');
    expect(button).toHaveFocus();
    expect(hiddenWhenFocused).toBe('');
  });

  it('closes with the Put back button during the flight and can pick the same card up again', async () => {
    stubMotion(false);
    renderGrid();
    const { card } = pickUp();
    await waitFor(() => expect(sheetOf(screen.getByRole('dialog'))).not.toBeNull());

    fireEvent.click(screen.getByRole('button', { name: 'Put back' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(card.style.visibility).toBe('');

    pickUp();
    await waitFor(() => expect(sheetOf(screen.getByRole('dialog'))).not.toBeNull());
  });

  it('opens at once with no sheet and no hidden card when motion is reduced', () => {
    stubMotion(true);
    renderGrid();
    const { card } = pickUp();
    const dialog = screen.getByRole('dialog', { name: project.title });

    expect(sheetOf(dialog)).toBeNull();
    expect(visibleOpacity(within(dialog).getByText(project.summary), dialog)).toBe(1);
    expect(card.style.visibility).toBe('');
    expect(screen.getByRole('button', { name: 'Put back' })).toHaveFocus();
  });

  it('shows the details at once and drops the sheet when motion becomes reduced mid-flight', async () => {
    const motion = stubMotion(false);
    renderGrid();
    pickUp();
    const dialog = screen.getByRole('dialog');
    await waitFor(() => expect(sheetOf(dialog)).not.toBeNull());

    motion.setReduced(true);

    expect(sheetOf(dialog)).toBeNull();
    await waitFor(() => expect(visibleOpacity(within(dialog).getByText(project.summary), dialog)).toBe(1));
  });

  it('opens as before, with no sheet, when the browser reports no size for the card', () => {
    stubMotion(false);
    renderGrid({ ...CARD, width: 0, height: 0 });
    pickUp();
    const dialog = screen.getByRole('dialog', { name: project.title });

    expect(sheetOf(dialog)).toBeNull();
    expect(visibleOpacity(within(dialog).getByText(project.summary), dialog)).toBe(1);
  });

  it('opens as before, with no sheet, when the browser reports no size for the panel', () => {
    stubMotion(false);
    renderGrid(CARD, { ...PANEL, width: 0, height: 0 });
    const { card } = pickUp();
    const dialog = screen.getByRole('dialog', { name: project.title });

    expect(sheetOf(dialog)).toBeNull();
    expect(visibleOpacity(within(dialog).getByText(project.summary), dialog)).toBe(1);
    expect(card.style.visibility).toBe('');
  });

  it('lands within the time budget: sheet gone near 0.9 s, details fully visible soon after', async () => {
    stubMotion(false);
    renderGrid();
    const startedAt = performance.now();
    pickUp();
    const dialog = screen.getByRole('dialog');
    const summary = within(dialog).getByText(project.summary);
    await waitFor(() => expect(sheetOf(dialog)).not.toBeNull());

    await waitFor(() => expect(sheetOf(dialog)).toBeNull(), { timeout: LANDING_TIMEOUT });
    const landedAfter = performance.now() - startedAt;
    await waitFor(() => expect(visibleOpacity(summary, dialog)).toBe(1), { timeout: LANDING_TIMEOUT });
    const fadedAfter = performance.now() - startedAt;

    expect(landedAfter).toBeLessThan(1100);
    expect(fadedAfter).toBeLessThan(1600);
  });

  it('keeps the details at opacity 0 for as long as the sheet exists', async () => {
    stubMotion(false);
    renderGrid();
    pickUp();
    const dialog = screen.getByRole('dialog');
    const summary = within(dialog).getByText(project.summary);
    await waitFor(() => expect(visibleOpacity(summary, dialog)).toBe(0));

    const seen: number[] = [];
    while (sheetOf(dialog)) {
      seen.push(visibleOpacity(summary, dialog));
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 16));
      });
    }

    expect(seen.length).toBeGreaterThan(5);
    expect(Math.max(...seen)).toBe(0);
    await waitFor(() => expect(visibleOpacity(summary, dialog)).toBe(1), { timeout: LANDING_TIMEOUT });
  });

  it('hides the whole card, including its lifted shadow, while picked up', async () => {
    stubMotion(false);
    renderGrid();
    const { card, button } = pickUp();
    const dialog = screen.getByRole('dialog');
    await waitFor(() => expect(sheetOf(dialog)).not.toBeNull());

    const shadow = card.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(shadow).not.toBeNull();
    expect(shadow.closest<HTMLElement>('li')!.style.visibility).toBe('hidden');
    expect(card.contains(button)).toBe(true);
  });

  it.each([
    ['Escape', (dialog: HTMLElement) => fireEvent(dialog, new Event('cancel', { cancelable: true }))],
    ['Put back', () => fireEvent.click(screen.getByRole('button', { name: 'Put back' }))],
    ['backdrop', (dialog: HTMLElement) => fireEvent.click(dialog)],
    ['a bare close event', (dialog: HTMLElement) => fireEvent(dialog, new Event('close'))],
  ])('shows every card again and returns focus after closing by %s mid-flight', async (_name, close) => {
    stubMotion(false);
    renderGrid();
    const { card, button } = pickUp();
    const dialog = screen.getByRole('dialog');
    await waitFor(() => expect(sheetOf(dialog)).not.toBeNull());

    close(dialog);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    screen.getAllByRole('article').forEach((article) => {
      expect(article.closest('li')!.style.visibility).toBe('');
    });
    expect(card.style.visibility).toBe('');
    expect(button).toHaveFocus();
  });

  it('leaves the card visible and raises no warning when the page unmounts mid-flight', async () => {
    stubMotion(false);
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ProjectGrid projects={projects} pickup />);
    setBoxes(CARD, PANEL);
    const { card } = pickUp();
    await waitFor(() => expect(sheetOf(screen.getByRole('dialog'))).not.toBeNull());

    cleanup();
    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(card.style.visibility).toBe('');
    expect(errors).not.toHaveBeenCalled();
    errors.mockRestore();
  });

  it('shows the card again when motion turns reduced mid-flight, and does not restart the flight if it turns back', async () => {
    const motion = stubMotion(false);
    renderGrid();
    const { card } = pickUp();
    const dialog = screen.getByRole('dialog');
    const summary = within(dialog).getByText(project.summary);
    await waitFor(() => expect(sheetOf(dialog)).not.toBeNull());

    motion.setReduced(true);
    expect(card.style.visibility).toBe('');

    motion.setReduced(false);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    expect(sheetOf(dialog)).toBeNull();
    expect(card.style.visibility).toBe('');
    await waitFor(() => expect(visibleOpacity(summary, dialog)).toBe(1));
  });
});

