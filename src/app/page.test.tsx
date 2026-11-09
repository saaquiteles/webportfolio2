import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home page', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

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

  it('offers the email as the one contact action and leaves the other links to the Contact page', () => {
    render(<Home />);
    expect(screen.getByRole('link', { name: 'seanargieq@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:seanargieq@gmail.com',
    );
    expect(screen.queryByRole('link', { name: 'LinkedIn' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'GitHub' })).not.toBeInTheDocument();
  });

  it('shows one decorative sketch arrow and no image', () => {
    const { container } = render(<Home />);

    expect(container.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(1);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('draws the hero arrow in with the CSS draw class', () => {
    const { container } = render(<Home />);

    expect(container.querySelector('svg[aria-hidden="true"]')).toHaveClass('sketch-draw');
  });

  it('steps the headline up in size at tablet and desktop widths', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('text-hero', 'md:text-7xl', 'lg:text-display');
  });

  it('keeps the tagline from ending on a single word', () => {
    render(<Home />);

    expect(
      screen.getByText('Programmer/Analyst · Spring Boot, React and React Three Fiber · Metro Manila'),
    ).toHaveClass('text-pretty');
  });

  it('lists the featured projects under a Projects heading', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { level: 2, name: 'Projects' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'A Vision System That Tells Cockatiels Apart' }),
    ).toHaveAttribute('href', '/projects/cockatiel-recognition');
    expect(screen.getByRole('link', { name: 'This portfolio' })).toHaveAttribute(
      'href',
      '/projects/portfolio',
    );
    expect(screen.getByRole('link', { name: '3D Card Game' })).toBeInTheDocument();
  });

  it('has a main landmark', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('shows no scroll ruler when motion is not known to be allowed', () => {
    const { container } = render(<Home />);
    expect(container.querySelector('.fixed[aria-hidden="true"]')).toBeNull();
  });

  it('shows one decorative scroll ruler when motion is allowed', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    const { container } = render(<Home />);
    expect(container.querySelectorAll('div.fixed[aria-hidden="true"]')).toHaveLength(1);
  });

  it('has no scroll ruler in the server HTML even when the browser allows motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    const html = renderToString(<Home />);
    expect(html).not.toContain('pointer-events-none fixed');
  });
});
