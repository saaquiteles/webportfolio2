import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { PointerDepthField, PointerDepthLayer } from './PointerDepth';
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

function Scene() {
  return (
    <PointerDepthField>
      <PointerDepthLayer strength={4}>
        <p>far</p>
      </PointerDepthLayer>
      <PointerDepthLayer strength={8}>
        <p>middle</p>
      </PointerDepthLayer>
      <PointerDepthLayer strength={12}>
        <p>near</p>
      </PointerDepthLayer>
    </PointerDepthField>
  );
}

function layer(name: string) {
  return screen.getByText(name).parentElement as HTMLElement;
}

function shift(name: string) {
  const match = layer(name).style.transform.match(/translateX\((-?[\d.]+)px\)/);
  return match ? Number(match[1]) : 0;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('PointerDepth', () => {
  it('moves each layer by a different amount when the pointer moves and motion is allowed', async () => {
    mockMedia({ reduced: false, finePointer: true });
    render(<Scene />);

    fireEvent.pointerMove(window, { clientX: window.innerWidth * 0.75, clientY: window.innerHeight / 2 });

    await waitFor(() => expect(shift('near')).not.toBe(0));
    await sleep(1500);
    const [far, middle, near] = [shift('far'), shift('middle'), shift('near')];
    expect(Math.abs(far)).toBeLessThan(Math.abs(middle));
    expect(Math.abs(middle)).toBeLessThan(Math.abs(near));
  });

  it('attaches no listener and applies no transform when motion is reduced', () => {
    mockMedia({ reduced: true, finePointer: true });
    const spy = vi.spyOn(window, 'addEventListener');
    render(<Scene />);

    fireEvent.pointerMove(window, { clientX: 1000, clientY: 10 });
    expect(spy.mock.calls.filter(([type]) => type === 'pointermove')).toHaveLength(0);
    expect(layer('near').style.transform).not.toContain('translate');
  });

  it('attaches no listener and applies no transform when there is no fine pointer', () => {
    mockMedia({ reduced: false, finePointer: false });
    const spy = vi.spyOn(window, 'addEventListener');
    render(<Scene />);

    fireEvent.pointerMove(window, { clientX: 1000, clientY: 10 });
    expect(spy.mock.calls.filter(([type]) => type === 'pointermove')).toHaveLength(0);
    expect(layer('near').style.transform).not.toContain('translate');
  });

  it('clamps a pointer far outside the window to the maximum drift', async () => {
    mockMedia({ reduced: false, finePointer: true });
    render(<Scene />);

    fireEvent.pointerMove(window, { clientX: 1000000, clientY: -1000000 });

    await waitFor(() => expect(shift('near')).toBeGreaterThan(0));
    await sleep(1500);
    expect(shift('near')).toBeLessThanOrEqual(12.2);
    expect(shift('near')).toBeGreaterThan(11);
    expect(shift('far')).toBeLessThanOrEqual(4.1);
  });

  it('never drifts a layer past 12 px even when asked for more', async () => {
    mockMedia({ reduced: false, finePointer: true });
    render(
      <PointerDepthField>
        <PointerDepthLayer strength={50}>
          <p>greedy</p>
        </PointerDepthLayer>
      </PointerDepthField>,
    );

    fireEvent.pointerMove(window, { clientX: 1000000, clientY: 0 });

    await waitFor(() => expect(shift('greedy')).toBeGreaterThan(0));
    await sleep(1500);
    expect(shift('greedy')).toBeLessThanOrEqual(12.2);
  });

  it('settles back to rest when the pointer leaves the window', async () => {
    mockMedia({ reduced: false, finePointer: true });
    render(<Scene />);

    fireEvent.pointerMove(window, { clientX: 1000, clientY: 10 });
    await waitFor(() => expect(Math.abs(shift('near'))).toBeGreaterThan(1));
    fireEvent.mouseLeave(document);

    await waitFor(() => expect(Math.abs(shift('near'))).toBeLessThan(0.1), { timeout: 3000 });
  });

  it('renders no transform in the static HTML', () => {
    mockMedia({ reduced: false, finePointer: true });
    const html = renderToString(<Scene />);

    expect(html).toContain('near');
    expect(html).not.toMatch(/translate/);
    expect(html).not.toMatch(/transform:(?!none)/);
  });

  it('keeps the same DOM nodes when the page hydrates on a fine pointer, so CSS animations do not restart', async () => {
    mockMedia({ reduced: false, finePointer: true });
    const html = renderToString(
      <PointerDepthField>
        <PointerDepthLayer strength={4}>
          <h1>
            <span>H</span>
          </h1>
        </PointerDepthLayer>
      </PointerDepthField>,
    );
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    const heading = container.querySelector('h1') as HTMLElement;
    const letter = heading.querySelector('span') as HTMLElement;

    const addListener = vi.spyOn(window, 'addEventListener');
    let root!: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(
        container,
        <PointerDepthField>
          <PointerDepthLayer strength={4}>
            <h1>
              <span>H</span>
            </h1>
          </PointerDepthLayer>
        </PointerDepthField>,
      );
    });
    await act(async () => {
      await sleep(50);
    });

    expect(addListener).toHaveBeenCalledWith('pointermove', expect.any(Function));
    addListener.mockRestore();
    expect(container.querySelector('h1')).toBe(heading);
    expect(heading.querySelector('span')).toBe(letter);
    expect(document.body.contains(letter)).toBe(true);
    act(() => root.unmount());
    container.remove();
  });

  it('renders a plain working element when there is no field around the layer', () => {
    render(
      <PointerDepthLayer strength={8} className="flex w-fit">
        <p>alone</p>
      </PointerDepthLayer>,
    );

    expect(screen.getByText('alone')).toBeInTheDocument();
    expect(layer('alone').style.transform).not.toContain('translate');
    expect(layer('alone')).toHaveClass('flex', 'w-fit');
  });

  it('removes the window and document listeners it added when it unmounts', () => {
    mockMedia({ reduced: false, finePointer: true });
    const addWindow = vi.spyOn(window, 'addEventListener');
    const addDocument = vi.spyOn(document, 'addEventListener');
    const removeWindow = vi.spyOn(window, 'removeEventListener');
    const removeDocument = vi.spyOn(document, 'removeEventListener');
    const { unmount } = render(<Scene />);

    const move = addWindow.mock.calls.find(([type]) => type === 'pointermove')?.[1];
    const leave = addDocument.mock.calls.find(([type]) => type === 'mouseleave')?.[1];
    expect(move).toBeDefined();
    expect(leave).toBeDefined();
    unmount();

    expect(removeWindow).toHaveBeenCalledWith('pointermove', move);
    expect(removeDocument).toHaveBeenCalledWith('mouseleave', leave);
  });
});
