import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HighlightList } from './HighlightList';

describe('HighlightList', () => {
  it('shows the title, organisation and month, and the summary only when there is one', () => {
    render(
      <HighlightList
        highlights={[
          { title: 'With summary', org: 'Org A', date: '2024-11', summary: 'A short summary.' },
          { title: 'Without summary', org: 'Org B', date: '2026-08' },
        ]}
      />,
    );

    const [withSummary, without] = screen.getAllByRole('listitem');
    expect(withSummary).toHaveTextContent('With summary');
    expect(withSummary).toHaveTextContent('Org A');
    expect(withSummary).toHaveTextContent('Nov 2024');
    expect(withSummary).toHaveTextContent('A short summary.');
    expect(without).toHaveTextContent('Aug 2026');
    expect(without.querySelectorAll('p')).toHaveLength(2);
  });
});
