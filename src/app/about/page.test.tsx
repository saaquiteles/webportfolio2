import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './page';
import { profile } from '@/data/profile';

describe('About page', () => {
  it('has one level-1 heading, a main landmark and an Experience section', () => {
    render(<About />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About');
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeInTheDocument();
  });

  it('shows the intro and both roles', () => {
    render(<About />);

    expect(screen.getByText(profile.intro)).toBeInTheDocument();
    expect(screen.getByText('HTD Programmer/Analyst')).toBeInTheDocument();
    expect(screen.getByText('Software Developer Intern')).toBeInTheDocument();
  });
});
