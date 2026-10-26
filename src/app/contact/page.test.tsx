import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Contact from './page';

describe('Contact page', () => {
  it('has one level-1 heading "Contact" and a main landmark', () => {
    render(<Contact />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Contact');
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('links to email, LinkedIn and GitHub, with no form', () => {
    render(<Contact />);

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
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
