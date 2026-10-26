import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { DateRange } from './DateRange';

describe('DateRange', () => {
  it('shows Present after the start when there is no end', () => {
    const { container } = render(<DateRange start="2026-06" />);

    expect(container).toHaveTextContent('Jun 2026 – Present');
    expect([...container.querySelectorAll('time')].map((t) => t.getAttribute('datetime'))).toEqual([
      '2026-06',
    ]);
  });

  it('shows both months, each in a time element, when there is an end', () => {
    const { container } = render(<DateRange start="2025-05" end="2025-07" />);

    expect(container).toHaveTextContent('May 2025 – Jul 2025');
    expect([...container.querySelectorAll('time')].map((t) => t.getAttribute('datetime'))).toEqual([
      '2025-05',
      '2025-07',
    ]);
  });
});
