import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ScrollRuler } from './ScrollRuler';
import { useReducedMotion } from './useReducedMotion';

vi.mock('./useReducedMotion', () => ({ useReducedMotion: vi.fn() }));

afterEach(() => {
  vi.mocked(useReducedMotion).mockReset();
});

describe('ScrollRuler', () => {
  it('renders a decorative ruler when motion is allowed', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    const { container } = render(<ScrollRuler />);

    const ruler = container.firstElementChild as HTMLElement;
    expect(ruler).toHaveAttribute('aria-hidden', 'true');
    expect(ruler).toHaveClass('pointer-events-none', 'fixed');
    expect(ruler).toHaveTextContent('');
    expect(ruler.querySelector('svg, a, button, [tabindex]')).toBeNull();
  });

  it('renders nothing when motion is reduced', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { container } = render(<ScrollRuler />);

    expect(container).toBeEmptyDOMElement();
  });

  it('starts empty with a finite scale when the page does not scroll', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    const { container } = render(<ScrollRuler />);

    const fill = container.querySelector('[data-ruler-fill]') as HTMLElement;
    expect(fill.style.transform).toMatch(/scaleY\(0\)/);
    expect(fill.style.transform).not.toMatch(/NaN/);
  });
});
