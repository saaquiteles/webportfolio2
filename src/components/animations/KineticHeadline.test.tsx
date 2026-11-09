import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import { KineticHeadline } from './KineticHeadline';

const sentence = 'I build apps.';

function renderInHeading(text: string) {
  return render(
    <h1>
      <KineticHeadline text={text} />
    </h1>,
  );
}

describe('KineticHeadline', () => {
  it('keeps the whole sentence as the accessible name while the visible letters are split and hidden from assistive technology', () => {
    const { container } = renderInHeading(sentence);

    expect(screen.getByRole('heading', { level: 1, name: sentence })).toBeInTheDocument();
    const hidden = container.querySelectorAll('[aria-hidden="true"]');
    expect(hidden).toHaveLength(1);
    expect(hidden[0].textContent).toBe(sentence);
    expect(hidden[0].querySelectorAll('[data-letter]')).toHaveLength(sentence.replace(/ /g, '').length);
  });

  it('groups letters by word and keeps real spaces between words', () => {
    const { container } = renderInHeading(sentence);

    const words = container.querySelectorAll('[aria-hidden="true"] > [data-word]');
    expect(Array.from(words).map((word) => word.textContent)).toEqual(['I', 'build', 'apps.']);
    words.forEach((word) => expect(word).toHaveClass('inline-block'));
    expect(container.querySelector('[aria-hidden="true"]')?.textContent).toBe(sentence);
  });

  it('sets small offsets on every letter and never starts a letter invisible', () => {
    const { container } = renderInHeading(sentence);

    const letters = container.querySelectorAll<HTMLElement>('[data-letter]');
    expect(letters.length).toBeGreaterThan(0);
    letters.forEach((letter) => {
      expect(letter.style.getPropertyValue('--kinetic-x')).toMatch(/^-?\d+(\.\d+)?px$/);
      expect(letter.style.getPropertyValue('--kinetic-y')).toMatch(/^-?\d+(\.\d+)?px$/);
      expect(letter.style.getPropertyValue('--kinetic-r')).toMatch(/^-?\d+(\.\d+)?deg$/);
      expect(Math.abs(parseFloat(letter.style.getPropertyValue('--kinetic-x')))).toBeLessThanOrEqual(8);
      expect(Math.abs(parseFloat(letter.style.getPropertyValue('--kinetic-r')))).toBeLessThanOrEqual(8);
      expect(Number(letter.style.getPropertyValue('--kinetic-delay').replace('ms', ''))).toBeLessThan(600);
    });
  });

  it('gives the same markup on every render', () => {
    expect(renderToStaticMarkup(<KineticHeadline text={sentence} />)).toBe(
      renderToStaticMarkup(<KineticHeadline text={sentence} />),
    );
  });

  it('renders nothing for empty text', () => {
    expect(renderToStaticMarkup(<KineticHeadline text="" />)).toBe('');
  });
});
