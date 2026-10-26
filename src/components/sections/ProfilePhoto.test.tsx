import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfilePhoto } from './ProfilePhoto';

describe('ProfilePhoto', () => {
  it('shows a TODO(human) placeholder and no image when there is no photo', () => {
    render(<ProfilePhoto />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('TODO(human): photo')).toBeInTheDocument();
  });

  it('renders the image with its alt text when a photo is given', () => {
    render(<ProfilePhoto photo={{ src: '/images/me.jpg', alt: 'Sean smiling at a desk' }} />);

    const image = screen.getByRole('img', { name: 'Sean smiling at a desk' });
    expect(image).toHaveAttribute('src', '/images/me.jpg');
    expect(screen.queryByText('TODO(human): photo')).not.toBeInTheDocument();
  });
});
