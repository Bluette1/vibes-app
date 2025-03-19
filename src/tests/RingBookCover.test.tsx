// components/RingBookCover/RingBookCover.test.tsx
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import RingBookCover from '../components/RingBookCover/RingBookCover';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('RingBookCover', () => {
  const mockOnOpen = vi.fn();

  beforeEach(() => {
    render(<RingBookCover onOpen={mockOnOpen} />);
  });

  it('renders the component', () => {
    const coverElement = screen.getByRole('button', { name: /open/i });
    expect(coverElement).toBeInTheDocument();
    expect(screen.getByText('V')).toBeInTheDocument();
  });

  it('renders the correct number of rings', () => {
    const rings = screen.getAllByRole('presentation', { name: 'ring' });
    expect(rings.length).toBe(5);
  });

  it('renders the image sections', () => {
    const imageSections = screen.getByRole('presentation', { name: 'image-sections' });
    const withinImageSections = within(imageSections);
    const mountainsSection = withinImageSections.getByRole('presentation', { name: 'mountains' });
    const sunflowersSection = withinImageSections.getByRole('presentation', { name: 'sunflowers' });
    const forestSection = withinImageSections.getByRole('presentation', { name: 'forest' });
    
    expect(mountainsSection).toBeInTheDocument();
    expect(sunflowersSection).toBeInTheDocument();
    expect(forestSection).toBeInTheDocument();
  });

  it('calls onOpen when the OpenButton is clicked', () => {
    const openButton = screen.getByRole('button', { name: /open/i });
    fireEvent.click(openButton);
    expect(mockOnOpen).toHaveBeenCalledTimes(1);
  });
});
