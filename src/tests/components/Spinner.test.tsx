// Spinner.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Spinner from '../../components/Spinner/Spinner';

describe('Spinner Component', () => {
  it('renders the spinner image', () => {
    render(<Spinner />);

    const spinnerImage = screen.getByAltText(/loading/i);
    expect(spinnerImage).toBeInTheDocument();
    expect(spinnerImage).toHaveAttribute('src', '/android-chrome-192x192.png');
    expect(spinnerImage).toHaveClass('spinner-image w-8 h-8');
  });

  it('renders the spinner container', () => {
    render(<Spinner />);

    const spinnerContainer = screen.getByRole('img', { name: /loading/i }).parentElement;
    expect(spinnerContainer).toHaveClass('spinner');
  });
});
