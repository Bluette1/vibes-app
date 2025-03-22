import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import ImageRingBook from '../../components/ImageRingBook/ImageRingBook';
import { getImages } from '../../utils/api';
import '@testing-library/jest-dom';

// Mock the API module
vi.mock('../../utils/api', () => ({
  getImages: vi.fn(),
}));

// Mock the icon components
vi.mock('../../components/Icons/LeftChevron', () => ({
  default: () => <div data-testid="left-chevron">Left</div>,
}));

vi.mock('../../components/Icons/RightChevron', () => ({
  default: () => <div data-testid="right-chevron">Right</div>,
}));

describe('ImageRingBook Component', () => {
  const mockImages = [
    { src: 'image1.jpg', alt: 'Image 1' },
    { src: 'image2.jpg', alt: 'Image 2' },
    { src: 'image3.jpg', alt: 'Image 3' },
  ];

  let container;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(getImages).mockReset();
    vi.mocked(getImages).mockResolvedValue(mockImages);

    // Create a container for the component
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
    vi.useRealTimers();

    // Clean up container
    document.body.removeChild(container);
    container = null;
  });

  it('renders loading state initially when no images are provided', () => {
    act(() => {
      render(<ImageRingBook images={[]} transitionInterval={3000} />, { container });
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with provided images without API call', async () => {
    act(() => {
      render(<ImageRingBook images={mockImages} transitionInterval={3000} />, { container });
    });

    // First run all pending promises
    await act(async () => {
      await Promise.resolve();
    });

    // Check that the loading message is not displayed
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

    // Check for navigation buttons
    expect(screen.getByTestId('left-chevron')).toBeInTheDocument();
    expect(screen.getByTestId('right-chevron')).toBeInTheDocument();

    // Check for the first image
    const imageContainer = container.querySelector('.circular-image');
    expect(imageContainer).toHaveStyle(`background-image: url(${mockImages[0].src})`);
  });

  it('fetches images from API when no images are provided', async () => {
    act(() => {
      render(<ImageRingBook images={[]} transitionInterval={3000} />, { container });
    });

    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // API should have been called
    expect(getImages).toHaveBeenCalledTimes(1);

    // Resolve the API promise
    await act(async () => {
      await Promise.resolve();
    });

    // Simulate component updates after API resolves
    act(() => {
      vi.runOnlyPendingTimers();
    });

    // Loading should disappear after a re-render
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    vi.mocked(getImages).mockRejectedValueOnce(new Error('API error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    act(() => {
      render(<ImageRingBook images={[]} transitionInterval={3000} />, { container });
    });

    // Resolve the API promise (which will reject)
    await act(async () => {
      await Promise.resolve();
    });

    // Console error should be logged
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching images:', expect.any(Error));

    // Clean up
    consoleSpy.mockRestore();
  });

  it('renders rings correctly', async () => {
    act(() => {
      render(<ImageRingBook images={mockImages} transitionInterval={3000} />, { container });
    });

    // Wait for the component to fully render
    await act(async () => {
      await Promise.resolve();
    });

    const rings = container.querySelectorAll('.ring');
    expect(rings.length).toBe(5);
  });

  it('changes to next image when right chevron is clicked', async () => {
    act(() => {
      render(<ImageRingBook images={mockImages} transitionInterval={3000} />, { container });
    });

    // Wait for component to render
    await act(async () => {
      await Promise.resolve();
    });

    // Find and click the right button
    const rightButton = screen.getByTestId('right-chevron').closest('button');
    expect(rightButton).toBeInTheDocument();

    // Click the button
    act(() => {
      fireEvent.click(rightButton);
    });

    // Should add flipping class
    expect(container.querySelector('.book-page')).toHaveClass('flipping');

    // Fast-forward the first timeout (for changing the index)
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should have changed the image
    let imageContainer = container.querySelector('.circular-image');
    expect(imageContainer).toHaveStyle(`background-image: url(${mockImages[1].src})`);

    // Fast-forward the second timeout (for removing flipping class)
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Flipping class should be removed
    expect(container.querySelector('.book-page')).not.toHaveClass('flipping');
  });

  it('changes to previous image when left chevron is clicked', async () => {
    act(() => {
      render(<ImageRingBook images={mockImages} transitionInterval={3000} />, { container });
    });

    // Wait for component to render
    await act(async () => {
      await Promise.resolve();
    });

    // Find and click the left button
    const leftButton = screen.getByTestId('left-chevron').closest('button');
    expect(leftButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(leftButton);
    });

    // Fast-forward the first timeout
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should have changed to the last image (circular rotation)
    let imageContainer = container.querySelector('.circular-image');
    expect(imageContainer).toHaveStyle(`background-image: url(${mockImages[2].src})`);

    // Fast-forward the second timeout
    act(() => {
      vi.advanceTimersByTime(500);
    });
  });

  it('automatically transitions between images based on interval', async () => {
    act(() => {
      render(<ImageRingBook images={mockImages} transitionInterval={3000} />, { container });
    });

    // Wait for component to render
    await act(async () => {
      await Promise.resolve();
    });

    // Initial state
    let imageContainer = container.querySelector('.circular-image');
    expect(imageContainer).toHaveStyle(`background-image: url(${mockImages[0].src})`);

    // Fast-forward to trigger the interval
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Should start the flipping process
    expect(container.querySelector('.book-page')).toHaveClass('flipping');

    // Fast-forward the index change timeout
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should show the next image
    imageContainer = container.querySelector('.circular-image');
    expect(imageContainer).toHaveStyle(`background-image: url(${mockImages[1].src})`);

    // Fast-forward to remove flipping class
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(container.querySelector('.book-page')).not.toHaveClass('flipping');
  });

  it('does not transition when only one image is available', async () => {
    const singleImage = [{ src: 'image1.jpg', alt: 'Image 1' }];

    act(() => {
      render(<ImageRingBook images={singleImage} transitionInterval={3000} />, { container });
    });

    // Wait for component to render
    await act(async () => {
      await Promise.resolve();
    });

    // Make sure the component is rendered with the image
    const imageContainer = container.querySelector('.circular-image');
    expect(imageContainer).toHaveStyle(`background-image: url(${singleImage[0].src})`);

    // Fast-forward beyond transition interval
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // No flipping class should be added since there's only one image
    expect(container.querySelector('.book-page')).not.toHaveClass('flipping');
  });

  it('cleans up interval on unmount', async () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    let renderedComponent;
    act(() => {
      renderedComponent = render(<ImageRingBook images={mockImages} transitionInterval={3000} />, {
        container,
      });
    });

    // Wait for component to initialize
    await act(async () => {
      await Promise.resolve();
    });

    // Unmount the component
    act(() => {
      renderedComponent.unmount();
    });

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
