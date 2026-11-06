import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SketchArrow } from './SketchArrow';

describe('SketchArrow', () => {
  it('is decorative: hidden from assistive technology and not focusable', () => {
    const { container } = render(<SketchArrow />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('draws with the current text colour only', () => {
    const { container } = render(<SketchArrow />);
    const paint = [...container.querySelectorAll('[fill], [stroke]')].flatMap((element) =>
      ['fill', 'stroke'].map((name) => element.getAttribute(name)).filter((value) => value !== null),
    );

    expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
    expect(paint.length).toBeGreaterThan(0);
    expect(paint.every((value) => value === 'currentColor')).toBe(true);
  });

  it('takes a class name, so the page can place and colour it', () => {
    const { container } = render(<SketchArrow className="text-tomato" />);

    expect(container.querySelector('svg')).toHaveClass('text-tomato');
  });
});
