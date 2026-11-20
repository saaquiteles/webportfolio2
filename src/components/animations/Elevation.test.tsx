import { describe, expect, it } from 'vitest';
import { fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import { ElevationShadow, useElevation } from './Elevation';

function Probe() {
  const { shadowOpacity, raise, lower } = useElevation();
  return (
    <div>
      <ElevationShadow opacity={shadowOpacity} />
      <button type="button" onClick={raise}>
        Raise
      </button>
      <button type="button" onClick={lower}>
        Lower
      </button>
    </div>
  );
}

function shadowOpacity(container: HTMLElement) {
  const layer = container.querySelector('[aria-hidden="true"]') as HTMLElement;
  return Number(layer.style.opacity);
}

describe('Elevation', () => {
  it('starts with no shadow', () => {
    const { container } = render(<Probe />);

    expect(shadowOpacity(container)).toBe(0);
  });

  it('grows the shadow through in-between values when raised, and shrinks it when lowered', async () => {
    const { container } = render(<Probe />);

    fireEvent.click(screen.getByRole('button', { name: 'Raise' }));
    await waitFor(() => {
      const value = shadowOpacity(container);
      expect(value).toBeGreaterThan(0);
      expect(value).toBeLessThan(1);
    });
    await waitFor(() => expect(shadowOpacity(container)).toBeGreaterThan(0.95));

    fireEvent.click(screen.getByRole('button', { name: 'Lower' }));
    await waitFor(() => {
      const value = shadowOpacity(container);
      expect(value).toBeGreaterThan(0);
      expect(value).toBeLessThan(0.95);
    });
    await waitFor(() => expect(shadowOpacity(container)).toBeLessThan(0.05));
  });

  it('draws a fixed opacity for a plain number and is hidden from assistive technology', () => {
    const { container } = render(<ElevationShadow opacity={0} />);

    const layer = container.firstElementChild as HTMLElement;
    expect(layer).toHaveAttribute('aria-hidden', 'true');
    expect(layer.style.opacity).toBe('0');
  });

  it('hands out the same raise and lower functions on every render', () => {
    const { result, rerender } = renderHook(() => useElevation());
    const { raise, lower } = result.current;

    rerender();

    expect(result.current.raise).toBe(raise);
    expect(result.current.lower).toBe(lower);
  });
});
