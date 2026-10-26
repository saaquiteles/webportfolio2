import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExperienceList } from './ExperienceList';
import { experience } from '@/data/experience';

describe('ExperienceList', () => {
  it('renders one item per entry with its role, organisation and summary', () => {
    render(<ExperienceList entries={experience} />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('HTD Programmer/Analyst');
    expect(items[0]).toHaveTextContent('Vertere Global Solutions');
    expect(items[1]).toHaveTextContent('Software Developer Intern');
    expect(items[1]).toHaveTextContent('Bridge360');
    for (const entry of experience) {
      expect(screen.getByText(entry.summary)).toBeInTheDocument();
    }
  });

  it('shows each date range with machine-readable months', () => {
    const { container } = render(<ExperienceList entries={experience} />);

    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Jun 2026 – Present');
    expect(items[1]).toHaveTextContent('May 2025 – Jul 2025');
    const stamps = [...container.querySelectorAll('time')].map((t) => t.getAttribute('datetime'));
    expect(stamps).toEqual(['2026-06', '2025-05', '2025-07']);
  });
});
