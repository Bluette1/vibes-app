import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ImageRingBook from '../../components/ImageRingBook/ImageRingBook';
import { getImages } from '../../utils/api';
import '@testing-library/jest-dom';

// Mock the API module
vi.mock('../../utils/api', () => ({
  getImages: vi.fn() as Mock,
}));

// Mock the icon components
vi.mock('../Icons/LeftChevron', () => ({
  default: () => <div data-testid="left-chevron">Left</div>, 
}));

vi.mock('../Icons/RightChevron', () => ({
  default: () => <div data-testid="right-chevron">Right</div>, 
}));

describe('ImageRingBook Component', () => {
  const mockImages = [
    { src: 'image1.jpg', alt: 'Image 1' },
    { src: 'image2.jpg', alt: 'Image 2' },
    { src: 'image3.jpg', alt: 'Image 3' },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    // Reset mock implementation before each test
    (getImages as Mock).mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders loading state initially', () => {
    (getImages as Mock).mockResolvedValue([]);
    render(<ImageRingBook images={[]} transitionInterval={3000} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with provided images without API call', () => {
    render(<ImageRingBook images={mockImages} transitionInterval={3000} />); 
    
    // Should not show loading state
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    
    // Should render the navigation buttons
    expect(screen.getByTestId('left-chevron')).toBeInTheDocument(); 
    expect(screen.getByTestId('right-chevron')).toBeInTheDocument();
    
    // Should render the first image
    const imageContainer = document.querySelector('.circular-image');
    expect(imageContainer).toHaveStyle(`background-image: url(image1.jpg)`);
  });

  it('fetches images from API when no images are provided', async () => {
    (getImages as Mock).mockResolvedValue(mockImages);
    
    render(<ImageRingBook images={[]} transitionInterval={3000} />);
    
    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Simulate API response
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    
    // API should have been called
    expect(getImages).toHaveBeenCalledTimes(1);
    
    // Loading state should be gone
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument(); 
  });

  it('handles API error gracefully', async () => {
    (getImages as Mock).mockRejectedValue(new Error('API error'));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<ImageRingBook images={[]} transitionInterval={3000} />);
    
    // Simulate API error
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    
    // Console error should be logged
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching images:', expect.any(Object));
    
    // Should still exit loading state
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('renders rings correctly', () => {
    render(<ImageRingBook images={mockImages} transitionInterval={3000} />);
    const rings = document.querySelectorAll('.ring');
    expect(rings).toHaveLength(5);
  });

  it('changes to next image when right chevron is clicked', async () => {
    render(<ImageRingBook images={mockImages} transitionInterval={3000} />);
    
    const rightButton = screen.getByTestId('right-chevron').closest('button');
    expect(rightButton).toBeTruthy();

    // Initial state
    let imageContainer = document.querySelector('.circular-image');
    expect(imageContainer).toHaveStyle(`background-image: url(image1.jpg)`);
    
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
    expect(imageContainer).toHaveStyle(`background-image: url(image2.jpg)`);
    
    // Fast-forward the second timeout (for removing flipping class)
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    // Flipping class should be removed
    expect(document.querySelector('.book-page')).not.toHaveClass('flipping');
  });

  it('changes to previous image when left chevron is clicked', async () => {
    render(<ImageRingBook images={mockImages} transitionInterval={3000} />);
    
    const leftButton = screen.getByTestId('left-chevron').closest('button');
    expect(leftButton).toBeTruthy();
    
    // Initial state
    let imageContainer = document.querySelector('.circular-image');
    expect(imageContainer).toHaveStyle(`background-image: url(image1.jpg)`);
    
    // Click previous - should go to the last image due to circular rotation
    if (leftButton) fireEvent.click(leftButton);
    
    // Fast-forward the first timeout
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    
    // Should have changed to the last image
    imageContainer = document.querySelector('.circular-image');
    expect(imageContainer).toHaveStyle(`background-image: url(image3.jpg)`);
    
    // Fast-forward the second timeout
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
  });

  it('automatically transitions between images based on interval', async () => {
    render(<ImageRingBook images={mockImages} transitionInterval={3000} />);
    
    // Initial state
    let imageContainer = document.querySelector('.circular-image');
    expect(imageContainer).toHaveStyle(`background-image: url(image1.jpg)`);
    
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
    expect(imageContainer).toHaveStyle(`background-image: url(image2.jpg)`);
    
    // Fast-forward to remove flipping class
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    
    expect(document.querySelector('.book-page')).not.toHaveClass('flipping');
  });

  it('does not transition when only one image is available', async () => {
    const singleImage = [{ src: 'image1.jpg', alt: 'Image 1' }];
    render(<ImageRingBook images={singleImage} transitionInterval={3000} />);
    
    // Fast-forward beyond transition interval
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });
    
    // Image should remain the same
    const imageContainer = document.querySelector('.circular-image');
    expect(imageContainer).toHaveStyle(`background-image: url(image1.jpg)`);
  });

  it('cleans up interval on unmount', async () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    
    const { unmount } = render(<ImageRingBook images={mockImages} transitionInterval={3000} />);
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
