import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home page', () => {
  it('shows exactly one level-1 heading', () => {
    render(<Home />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('uses the approved headline as the level-1 heading', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'I build full-stack apps with Spring Boot and React.',
    );
  });

  it('shows the approved tagline', () => {
    render(<Home />);
    expect(
      screen.getByText('Programmer/Analyst · Spring Boot, React and React Three Fiber · Metro Manila'),
    ).toBeInTheDocument();
  });

  it('shows the name', () => {
    render(<Home />);
    expect(screen.getByText('Sean Argie A. Quiteles')).toBeInTheDocument();
  });

  it('links to email, LinkedIn and GitHub', () => {
    render(<Home />);
    expect(screen.getByRole('link', { name: 'seanargieq@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:seanargieq@gmail.com',
    );
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/saaquiteles',
    );
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/saaquiteles',
    );
  });

  it('has a main landmark', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
