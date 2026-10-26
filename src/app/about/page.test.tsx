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

  it('lists Education with the degree, school, specialization and dates', () => {
    render(<About />);

    expect(screen.getByRole('heading', { level: 2, name: 'Education' })).toBeInTheDocument();
    const degree = screen.getByRole('heading', {
      level: 3,
      name: 'BS Computer Engineering (UNIX Administration specialization)',
    });
    const item = degree.closest('li');
    expect(item).toHaveTextContent('Mapúa University');
    expect(item).toHaveTextContent('Aug 2018 – Jan 2026');
  });

  it('lists the Also section with the certification and the Japan site visits', () => {
    render(<About />);

    expect(screen.getByRole('heading', { level: 2, name: 'Also' })).toBeInTheDocument();
    const cert = screen.getByRole('heading', { level: 3, name: /Associate Data Engineer/ });
    expect(cert.closest('li')).toHaveTextContent('DataCamp');
    expect(cert.closest('li')).toHaveTextContent('Aug 2026');
    const japan = screen.getByRole('heading', { level: 3, name: /Japan/ });
    expect(japan.closest('li')).toHaveTextContent('Nov 2024');
  });
});
