import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
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

describe.skip('ImageRingBook Component', () => {
  const mockImages = [
    { src: 'image1.jpg', alt: 'Image 1' },
    { src: 'image2.jpg', alt: 'Image 2' },
    { src: 'image3.jpg', alt: 'Image 3' },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    // Reset mock implementation before each test
    vi.mocked(getImages).mockReset();

    // Set up the mock to resolve immediately with data
    vi.mocked(getImages).mockResolvedValue(mockImages);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders loading state initially', () => {
    vi.mocked(getImages).mockResolvedValue([]);
    render(<ImageRingBook images={[]} transitionInterval={3000} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with provided images without API call', async () => {
    const { rerender } = render(<ImageRingBook images={mockImages} transitionInterval={3000} />);

    // We need to wait for the component to process the images
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // Force a re-render to ensure state updates are reflected
    rerender(<ImageRingBook images={mockImages} transitionInterval={3000} />);

    // Now check that loading is gone
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Should render the navigation buttons
    expect(screen.getByTestId('left-chevron')).toBeInTheDocument();
    expect(screen.getByTestId('right-chevron')).toBeInTheDocument();

    // Should render the first image
    const imageContainer = document.querySelector('.circular-image');
    expect(imageContainer).toHaveStyle({ backgroundImage: `url(${mockImages[0].src})` });
  });

  it('fetches images from API when no images are provided', async () => {
    vi.mocked(getImages).mockResolvedValue(mockImages);

    render(<ImageRingBook images={[]} transitionInterval={3000} />);

    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for the API call to resolve and component to update
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // API should have been called
    expect(getImages).toHaveBeenCalledTimes(1);

    // Wait for loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    vi.mocked(getImages).mockRejectedValue(new Error('API error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<ImageRingBook images={[]} transitionInterval={3000} />);

    // Simulate API error
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // Console error should be logged
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching images:', expect.any(Error));

    // Since there's an error and no images, the loading state might persist
    // or display an empty state - this depends on your implementation
    // Let's just check the error was logged

    consoleSpy.mockRestore();
  });

  it('renders rings correctly', async () => {
    render(<ImageRingBook images={mockImages} transitionInterval={3000} />);

    // Wait for the component to fully render
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // Wait for loading to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const rings = document.querySelectorAll('.ring');
    expect(rings.length).toBe(5);
  });

  it('changes to next image when right chevron is clicked', async () => {
    render(<ImageRingBook images={mockImages} transitionInterval={3000} />);

    // Wait for component to render
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // Wait for loading to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const rightButton = screen.getByTestId('right-chevron').closest('button');
    expect(rightButton).toBeInTheDocument();

    // Initial state
    let imageContainer = document.querySelector('.circular-image');
    expect(imageContainer).toHaveStyle({ backgroundImage: `url(${mockImages[0].src})` });

    // Click next
    if (rightButton) fireEvent.click(rightButton);

    // Should add flipping class
    expect(document.querySelector('.book-page')).toHaveClass('flipping');

    // Fast-forward the first timeout (for changing the index)
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    // Should have changed the image
    imageContainer = document.querySelector('.circular-image');
    expect(imageContainer).toHaveStyle({ backgroundImage: `url(${mockImages[1].src})` });

    // Fast-forward the second timeout (for removing flipping class)
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    // Flipping class should be removed
    expect(document.querySelector('.book-page')).not.toHaveClass('flipping');
  });

  it('changes to previous image when left chevron is clicked', async () => {
    render(<ImageRingBook images={mockImages} transitionInterval={3000} />);

    // Wait for component to render
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // Wait for loading to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const leftButton = screen.getByTestId('left-chevron').closest('button');
    expect(leftButton).toBeInTheDocument();

    // Initial state
    let imageContainer = document.querySelector('.circular-image');
    expect(imageContainer).toHaveStyle({ backgroundImage: `url(${mockImages[0].src})` });

    // Click previous - should go to the last image due to circular rotation
    if (leftButton) fireEvent.click(leftButton);

    // Fast-forward the first timeout
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    // Should have changed to the last image
    imageContainer = document.querySelector('.circular-image');
    expect(imageContainer).toHaveStyle({ backgroundImage: `url(${mockImages[2].src})` });

    // Fast-forward the second timeout
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
  });

  it('automatically transitions between images based on interval', async () => {
    render(<ImageRingBook images={mockImages} transitionInterval={3000} />);

    // Wait for component to render
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // Wait for loading to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Initial state
    let imageContainer = document.querySelector('.circular-image');
    expect(imageContainer).toHaveStyle({ backgroundImage: `url(${mockImages[0].src})` });

    // Fast-forward the transition interval
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    // Should start the flipping process
    expect(document.querySelector('.book-page')).toHaveClass('flipping');

    // Fast-forward the index change timeout
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    // Should show the next image
    imageContainer = document.querySelector('.circular-image');
    expect(imageContainer).toHaveStyle({ backgroundImage: `url(${mockImages[1].src})` });

    // Fast-forward to remove flipping class
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(document.querySelector('.book-page')).not.toHaveClass('flipping');
  });

  it('does not transition when only one image is available', async () => {
    const singleImage = [{ src: 'image1.jpg', alt: 'Image 1' }];
    render(<ImageRingBook images={singleImage} transitionInterval={3000} />);

    // Wait for component to render
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // Wait for loading to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Fast-forward beyond transition interval
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    // Image should remain the same
    const imageContainer = document.querySelector('.circular-image');
    expect(imageContainer).toHaveStyle({ backgroundImage: `url(${singleImage[0].src})` });
  });

  it('cleans up interval on unmount', async () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    const { unmount } = render(<ImageRingBook images={mockImages} transitionInterval={3000} />);

    // Wait for component to initialize
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
