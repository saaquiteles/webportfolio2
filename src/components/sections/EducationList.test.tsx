import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EducationList } from './EducationList';

describe('EducationList', () => {
  it('shows the degree, school and dates, and Present when there is no end', () => {
    render(
      <EducationList
        entries={[
          { degree: 'BS Test Science', school: 'Test University', start: '2020-03' },
          { degree: 'MS Test Science', school: 'Other University', start: '2018-08', end: '2020-01' },
        ]}
      />,
    );

    const [open, closed] = screen.getAllByRole('listitem');
    expect(open).toHaveTextContent('BS Test Science');
    expect(open).toHaveTextContent('Test University');
    expect(open).toHaveTextContent('Mar 2020 – Present');
    expect(closed).toHaveTextContent('Aug 2018 – Jan 2020');
  });
});
