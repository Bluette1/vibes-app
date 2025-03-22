// components/RingBookCover/RingBookCover.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RingBookCover from '../../components/RingBookCover/RingBookCover';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('RingBookCover', () => {
  const mockOnOpen = vi.fn();

  beforeEach(() => {
    mockOnOpen.mockClear();
    render(<RingBookCover onOpen={mockOnOpen} />);
  });

  it('renders the component with logo overlay', () => {
    const logoElement = screen.getByText('V');
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveClass('logo-overlay');
  });

  it('renders the correct number of rings', () => {
    const ringElements = document.querySelectorAll('.ring');
    expect(ringElements.length).toBe(5);
  });

  it('renders the image sections', () => {
    const mountainsSection = document.querySelector('.section.mountains');
    const sunflowersSection = document.querySelector('.section.sunflowers');
    const forestSection = document.querySelector('.section.forest');

    expect(mountainsSection).toBeInTheDocument();
    expect(sunflowersSection).toBeInTheDocument();
    expect(forestSection).toBeInTheDocument();
  });

  it('calls onOpen when the OpenButton is clicked', () => {
    const openButton = screen.getByRole('button');
    fireEvent.click(openButton);
    expect(mockOnOpen).toHaveBeenCalledTimes(1);
  });

  it('has a circular image with background', () => {
    const circularImage = document.querySelector('.circular-image');
    expect(circularImage).toBeInTheDocument();
    expect(circularImage).toHaveStyle({
      backgroundImage: expect.stringContaining('background.jpg'),
    });
  });
});
