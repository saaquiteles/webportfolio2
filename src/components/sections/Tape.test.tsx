import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Tape } from './Tape';

describe('Tape', () => {
  it('is hidden from assistive technology and has no text or role', () => {
    const { container } = render(<Tape />);

    const strip = container.firstElementChild!;
    expect(strip).toHaveAttribute('aria-hidden', 'true');
    expect(strip).toBeEmptyDOMElement();
    expect(strip).not.toHaveAttribute('role');
  });
});
