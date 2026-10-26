import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContactLinks } from './ContactLinks';

const contact = {
  email: 'seanargieq@gmail.com',
  links: {
    linkedin: 'https://linkedin.com/in/saaquiteles',
    github: 'https://github.com/saaquiteles',
  },
};

describe('ContactLinks', () => {
  it('links to email, LinkedIn and GitHub with descriptive names', () => {
    render(<ContactLinks {...contact} />);

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
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });
});
