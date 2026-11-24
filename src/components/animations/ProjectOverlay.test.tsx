import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ProjectGrid } from '@/components/sections/ProjectGrid';
import { projects } from '@/data/projects';

const project = projects[1];
const CARD = { left: 20, top: 600, width: 300, height: 200 };
const PANEL = { left: 200, top: 100, width: 600, height: 400 };
const LANDING_TIMEOUT = 15000;

vi.setConfig({ testTimeout: 30000 });

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
  screen.getAllByRole('article', { hidden: true }).forEach((article) => {
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

let closes: { sheetTransform: string | null; shadow: number | null; hiddenCards: number }[] = [];
let closeEventLater = false;

beforeEach(() => {
  closes = [];
  closeEventLater = false;
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    const sheet = sheetOf(this);
    const layer = sheet?.querySelector('[aria-hidden="true"]') as HTMLElement | null;
    const hiddenCards = Array.from(document.querySelectorAll('li')).filter((li) => li.style.visibility === 'hidden').length;
    closes.push({
      sheetTransform: sheet?.style.transform ?? null,
      shadow: layer ? Number(layer.style.opacity) : null,
      hiddenCards,
    });
    this.removeAttribute('open');
    // A browser fires the close event in a later task, not inside close().
    if (closeEventLater) setTimeout(() => this.dispatchEvent(new Event('close')), 0);
    else this.dispatchEvent(new Event('close'));
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

  it('shows the card again before focus returns when the browser closes the dialog mid-flight', async () => {
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
    fireEvent(dialog, new Event('close'));

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
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: LANDING_TIMEOUT });
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

  it('lands without getting stuck: the sheet is gone first, then the details are fully visible', async () => {
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

    expect(landedAfter).toBeLessThan(8000);
    expect(fadedAfter).toBeGreaterThanOrEqual(landedAfter);
    expect(fadedAfter).toBeLessThan(10000);
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

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: LANDING_TIMEOUT });
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

async function pickUpAndLand() {
  const picked = pickUp();
  const dialog = screen.getByRole('dialog');
  await waitFor(() => expect(sheetOf(dialog)).not.toBeNull());
  await waitFor(() => expect(sheetOf(dialog)).toBeNull(), { timeout: LANDING_TIMEOUT });
  return { ...picked, dialog };
}

function expectPutBack(card: HTMLElement, button: HTMLElement) {
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  screen.getAllByRole('article').forEach((article) => {
    expect(article.closest('li')!.style.visibility).toBe('');
  });
  expect(card.style.visibility).toBe('');
  expect(button).toHaveFocus();
}

function putBack() {
  fireEvent.click(screen.getByRole('button', { name: 'Put back' }));
}

describe('Project overlay put back', () => {
  it.each([
    ['Escape', (dialog: HTMLElement) => fireEvent(dialog, new Event('cancel', { cancelable: true }))],
    ['the Put back button', () => putBack()],
    ['a click on the backdrop', (dialog: HTMLElement) => fireEvent.click(dialog)],
  ])('flies the sheet back and closes the dialog only after it lands, when closed by %s', async (_name, close) => {
    stubMotion(false);
    renderGrid();
    const { card, button, dialog } = await pickUpAndLand();

    close(dialog);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(sheetOf(dialog)).not.toBeNull();
    expect(closes).toHaveLength(0);

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: LANDING_TIMEOUT });
    expect(closes).toHaveLength(1);
    expect(closes[0].sheetTransform).not.toBeNull();
    expectPutBack(card, button);
  });

  it('ignores a second press while the note is flying back', async () => {
    stubMotion(false);
    renderGrid();
    const { card, button, dialog } = await pickUpAndLand();

    putBack();
    setBoxes({ ...CARD, width: 0, height: 0 }, PANEL);
    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    fireEvent.click(dialog);
    putBack();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(closes).toHaveLength(0);

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: LANDING_TIMEOUT });
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(closes).toHaveLength(1);
    expectPutBack(card, button);
  });

  it('lands on the card box measured again at close time', async () => {
    stubMotion(false);
    renderGrid();
    await pickUpAndLand();
    const moved = { left: 400, top: 50, width: 250, height: 150 };
    setBoxes(moved, PANEL);

    putBack();
    await waitFor(() => expect(closes).toHaveLength(1), { timeout: LANDING_TIMEOUT });

    const transform = closes[0].sheetTransform!;
    const [, x, y] = /translate3d\((-?[\d.]+)px, (-?[\d.]+)px/.exec(transform)!.map(Number);
    expect(x).toBeCloseTo(moved.left + moved.width / 2 - (PANEL.left + PANEL.width / 2), -1);
    expect(y).toBeCloseTo(moved.top + moved.height / 2 - (PANEL.top + PANEL.height / 2), -1);
    expect(Number(/scale\((-?[\d.]+),/.exec(transform)![1])).toBeCloseTo(moved.width / PANEL.width, 1);
  });

  it('turns the sheet to the resting tilt of the card it returns to', async () => {
    stubMotion(false);
    renderGrid();
    const real = window.getComputedStyle.bind(window);
    const li = screen.getByRole('heading', { level: 2, name: project.title }).closest('li')!;
    const spy = vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudo) =>
      element === li ? ({ rotate: '-1deg' } as CSSStyleDeclaration) : real(element, pseudo),
    );
    try {
      await pickUpAndLand();

      putBack();
      await waitFor(() => expect(closes).toHaveLength(1), { timeout: LANDING_TIMEOUT });

      expect(Number(/rotateZ\((-?[\d.]+)deg/.exec(closes[0].sheetTransform!)![1])).toBeCloseTo(-1, 0);
    } finally {
      spy.mockRestore();
    }
  });

  it('has shrunk the shadow to almost nothing by the landing frame', async () => {
    stubMotion(false);
    renderGrid();
    await pickUpAndLand();

    putBack();
    await waitFor(() => expect(closes).toHaveLength(1), { timeout: LANDING_TIMEOUT });

    expect(closes[0].shadow).toBeLessThan(0.1);
  });

  it('reverses from where the sheet is when closed during the opening flight, with no jump', async () => {
    stubMotion(false);
    renderGrid();
    const { card, button } = pickUp();
    const dialog = screen.getByRole('dialog');
    await waitFor(() => expect(translateOf(sheetOf(dialog) ?? document.body).x).toBeLessThan(-100));
    const sheet = sheetOf(dialog)!;
    const before = translateOf(sheet);
    const scaleBefore = scaleXOf(sheet);

    putBack();

    const after = translateOf(sheet);
    expect(Math.abs(after.x - before.x)).toBeLessThan(5);
    expect(Math.abs(after.y - before.y)).toBeLessThan(5);
    expect(Math.abs(scaleXOf(sheet) - scaleBefore)).toBeLessThan(0.05);
    expect(closes).toHaveLength(0);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });
    expect(translateOf(sheet).x).toBeLessThan(-100);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: LANDING_TIMEOUT });
    expectPutBack(card, button);
  });

  it('resets at once, with no return flight, when the browser closes the dialog by itself', async () => {
    stubMotion(false);
    renderGrid();
    const { card, button, dialog } = await pickUpAndLand();
    putBack();

    fireEvent(dialog, new Event('close'));

    expectPutBack(card, button);
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(closes).toHaveLength(0);
  });

  it('closes at once with no sheet when motion is reduced', () => {
    stubMotion(true);
    renderGrid();
    const { card, button } = pickUp();

    putBack();

    expectPutBack(card, button);
    expect(closes[0].sheetTransform).toBeNull();
  });

  it('closes at once when the card has no size at close time', async () => {
    stubMotion(false);
    renderGrid();
    const { card, button } = await pickUpAndLand();
    setBoxes({ ...CARD, width: 0, height: 0 }, PANEL);

    putBack();

    expectPutBack(card, button);
  });

  it('finishes at once when motion turns reduced during the return', async () => {
    const motion = stubMotion(false);
    renderGrid();
    const { card, button } = await pickUpAndLand();
    putBack();
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    motion.setReduced(true);

    expectPutBack(card, button);
  });

  it('leaves the card visible and raises no warning when the page unmounts during the return', async () => {
    stubMotion(false);
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderGrid();
    const { card } = await pickUpAndLand();
    putBack();

    cleanup();
    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(card.style.visibility).toBe('');
    expect(closes).toHaveLength(0);
    expect(errors).not.toHaveBeenCalled();
    errors.mockRestore();
  });

  it('hides the details as soon as the sheet leaves the panel', async () => {
    stubMotion(false);
    renderGrid();
    const { dialog } = await pickUpAndLand();
    const summary = within(dialog).getByText(project.summary);
    await waitFor(() => expect(visibleOpacity(summary, dialog)).toBe(1));

    putBack();

    await waitFor(() => expect(visibleOpacity(summary, dialog)).toBe(0));
    expect(sheetOf(dialog)).not.toBeNull();
  });

  it.each([
    ['the return lands', async () => putBack()],
    ['motion turns reduced during the return', async (motion: ReturnType<typeof stubMotion>) => {
      putBack();
      motion.setReduced(true);
    }],
    ['the card has no size', async () => {
      setBoxes({ ...CARD, width: 0, height: 0 }, PANEL);
      putBack();
    }],
  ])('shows the card again before the dialog is closed, when %s', async (_name, act1) => {
    closeEventLater = true;
    const motion = stubMotion(false);
    renderGrid();
    const { card, button } = await pickUpAndLand();

    await act1(motion);
    await waitFor(() => expect(closes).toHaveLength(1), { timeout: LANDING_TIMEOUT });

    expect(closes[0].hiddenCards).toBe(0);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(card.style.visibility).toBe('');
    expect(button).toHaveFocus();
  });

  it('keeps the details hidden for the whole return when closed while they are still fading in', async () => {
    stubMotion(false);
    renderGrid();
    const picked = pickUp();
    const dialog = screen.getByRole('dialog');
    const summary = within(dialog).getByText(project.summary);
    await waitFor(() => expect(sheetOf(dialog)).not.toBeNull());
    await waitFor(() => expect(sheetOf(dialog)).toBeNull(), { timeout: LANDING_TIMEOUT });
    await waitFor(() => expect(visibleOpacity(summary, dialog)).toBeGreaterThan(0));
    expect(visibleOpacity(summary, dialog)).toBeLessThan(1);

    putBack();

    const seen: number[] = [];
    while (closes.length === 0) {
      seen.push(visibleOpacity(summary, dialog));
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 16));
      });
    }
    expect(seen.length).toBeGreaterThan(5);
    expect(Math.max(...seen.slice(2))).toBe(0);
    expect(picked.card.style.visibility).toBe('');
  });

  it('is home without getting stuck', async () => {
    stubMotion(false);
    renderGrid();
    await pickUpAndLand();

    const startedAt = performance.now();
    putBack();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: LANDING_TIMEOUT });

    expect(performance.now() - startedAt).toBeLessThan(10000);
  });
});
