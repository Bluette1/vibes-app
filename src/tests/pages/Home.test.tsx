import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import Home from '../../pages/Home/Home';
import { getAudios, getUserPreferences, saveUserPreferences } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

// Setup mocks
vi.mock('../../utils/api', () => ({
  getAudios: vi.fn(),
  getUserPreferences: vi.fn(),
  saveUserPreferences: vi.fn(),
}));

vi.mock('../../contexts/AudioContext', () => ({
  AudioProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="audio-provider">{children}</div>
  ),
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock components
vi.mock('../../components/AudioPlayer/AudioPlayer', () => ({
  default: () => <div data-testid="audio-player">Audio Player</div>,
}));

vi.mock('../../components/ImageRingBook/ImageRingBook', () => ({
  default: ({ transitionInterval }: { transitionInterval: number }) => (
    <div data-testid="image-ring-book">Image Ring Book with interval: {transitionInterval}</div>
  ),
}));

vi.mock('../../components/RingBookCover/RingBookCover', () => ({
  default: ({ onOpen }: { onOpen: () => void }) => (
    <button data-testid="ring-book-cover" onClick={onOpen}>
      Ring Book Cover
    </button>
  ),
}));

vi.mock('../../components/Icons/ProfileIcon/ProfileIcon', () => ({
  default: () => <div data-testid="profile-icon">Profile Icon</div>,
}));

vi.mock('../../components/SettingsModal/SettingsModal', () => ({
  default: ({
    transitionInterval,
    handleIntervalChange,
    onClose,
    isSaving,
  }: {
    transitionInterval: number;
    handleIntervalChange: (interval: number) => void;
    onClose: () => void;
    isSaving: boolean;
  }) => (
    <div data-testid="settings-modal">
      <p>Interval: {transitionInterval}</p>
      <p>Saving: {isSaving ? 'true' : 'false'}</p>
      <button data-testid="change-interval-btn" onClick={() => handleIntervalChange(20000)}>
        Change Interval
      </button>
      <button data-testid="close-modal-btn" onClick={onClose}>
        Close
      </button>
    </div>
  ),
}));

vi.mock('../../components/Spinner/Spinner', () => ({
  default: () => <div data-testid="spinner">Loading...</div>,
}));

const localStorageMock = {
  store: {},
  getItem: vi.fn((key: string) => localStorageMock.store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock.store[key] = value;
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  }),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Utility for testing matchers
function expectToBeInDocument(element: HTMLElement | null) {
  expect(element).not.toBeNull();
}

function expectNotToBeInDocument(element: HTMLElement | null) {
  expect(element).toBeNull();
}

// Test cases
describe('Home Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorageMock.clear();

    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      token: null,
      userPreferences: null,
      setUserPreferences: vi.fn(),
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    // Mock responses for API calls
    vi.mocked(getAudios).mockResolvedValue([
      { id: 1, title: 'Test Audio 1', url: 'test1.mp3' },
      { id: 2, title: 'Test Audio 2', url: 'test2.mp3' },
    ]);

    vi.mocked(getUserPreferences).mockResolvedValue({
      preferences: {
        image_transition_interval: 15000,
        selected_track: 1,
        id: 0,
        user_id: 0,
        volume: 0,
        created_at: undefined,
        updated_at: undefined,
      },
    });

    vi.mocked(saveUserPreferences).mockResolvedValue();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  test('renders the RingBookCover initially', () => {
    renderWithRouter(<Home />);
    const ringBookCover = screen.getByTestId('ring-book-cover');
    const imageRingBook = screen.queryByTestId('image-ring-book');

    expectToBeInDocument(ringBookCover);
    expectNotToBeInDocument(imageRingBook);
  });

  test('opens the book when cover is clicked', async () => {
    renderWithRouter(<Home />);
    fireEvent.click(screen.getByTestId('ring-book-cover'));

    expectToBeInDocument(screen.getByTestId('spinner'));
    await waitFor(() => {
      expect(getAudios).toHaveBeenCalled();
    });

    await waitFor(() => {
      expectToBeInDocument(screen.getByTestId('image-ring-book'));
      expectToBeInDocument(screen.getByTestId('audio-player'));
    });
  });

  test('loads transition interval from localStorage', async () => {
    // Set value in mock localStorage
    localStorageMock.setItem('transitionInterval', '12000');

    renderWithRouter(<Home />);

    // Open the book
    fireEvent.click(screen.getByTestId('ring-book-cover'));

    await waitFor(() => {
      expectToBeInDocument(screen.getByTestId('image-ring-book'));
      expectToBeInDocument(screen.getByText('Image Ring Book with interval: 12000'));
    });
  });

  test('fetches and uses user preferences when authenticated', async () => {
    // Mock authenticated user
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      token: 'fake-token',
      userPreferences: {
        id: 1,
        user_id: 1,
        volume: 0.5,
        image_transition_interval: 15000,
        selected_track: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      setUserPreferences: vi.fn(),
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderWithRouter(<Home />);

    // Open the book
    fireEvent.click(screen.getByTestId('ring-book-cover'));

    await waitFor(() => {
      expect(getUserPreferences).toHaveBeenCalledWith('fake-token');
    });

    // Verify it uses the server interval
    await waitFor(() => {
      expectToBeInDocument(screen.getByText('Image Ring Book with interval: 15000'));
    });
  });

  test('shows error message when API fails', async () => {
    // Mock API failure
    vi.mocked(getAudios).mockRejectedValue(new Error('Network error'));

    renderWithRouter(<Home />);

    // Open the book
    fireEvent.click(screen.getByTestId('ring-book-cover'));

    await waitFor(() => {
      expectToBeInDocument(screen.getByText(/Failed to load music tracks/i));
      // Still shows audio player with default track
      expectToBeInDocument(screen.getByTestId('audio-player'));
    });
  });

  test('opens and closes settings modal', async () => {
    renderWithRouter(<Home />);

    // Open the book
    fireEvent.click(screen.getByTestId('ring-book-cover'));

    await waitFor(() => {
      expectToBeInDocument(screen.getByTestId('audio-player'));
    });

    // Open settings modal
    fireEvent.click(screen.getByText('⚙️'));

    expectToBeInDocument(screen.getByTestId('settings-modal'));

    // Close settings modal
    fireEvent.click(screen.getByTestId('close-modal-btn'));

    expectNotToBeInDocument(screen.queryByTestId('settings-modal'));
  });

  test.skip('changes transition interval and saves to localStorage and server', async () => {
    vi.useFakeTimers();

    // Mock authenticated user
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      token: 'fake-token',
      userPreferences: {
        id: 1,
        user_id: 1,
        volume: 0.5,
        image_transition_interval: 15000,
        selected_track: '1',
        created_at: new Date(),
        updated_at: new Date(),
      },
      setUserPreferences: vi.fn(),
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderWithRouter(<Home />);

    // Open the book
    fireEvent.click(screen.getByTestId('ring-book-cover'));

    await waitFor(() => {
      expectToBeInDocument(screen.getByTestId('audio-player'));
    });

    // Open settings modal
    fireEvent.click(screen.getByText('⚙️'));

    // Change interval
    fireEvent.click(screen.getByTestId('change-interval-btn'));

    // Check localStorage was updated immediately
    expect(localStorageMock.setItem).toHaveBeenCalledWith('transitionInterval', '20000');

    // Fast-forward past debounce timeout
    vi.runAllTimers();

    // Verify API call to save preferences
    await waitFor(() => {
      expect(saveUserPreferences).toHaveBeenCalledWith('fake-token', {
        preferences: {
          selected_track: 1,
          image_transition_interval: 20000,
          volume: 0.5,
        },
      });
    });

    vi.useRealTimers();
  });

  test.skip('debounces saving interval changes to server', async () => {
    vi.useFakeTimers();

    // Mock authenticated user
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      token: 'fake-token',
      userPreferences: {
        id: 1,
        user_id: 1,
        volume: 0.5,
        image_transition_interval: 15000,
        selected_track: '1',
        created_at: new Date(),
        updated_at: new Date(),
      },
      setUserPreferences: vi.fn(),
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderWithRouter(<Home />);

    // Open the book
    fireEvent.click(screen.getByTestId('ring-book-cover'));

    await waitFor(() => {
      expectToBeInDocument(screen.getByTestId('audio-player'));
    });

    // Open settings modal
    fireEvent.click(screen.getByText('⚙️'));

    // Change interval
    fireEvent.click(screen.getByTestId('change-interval-btn'));

    // Should not have called server yet
    expect(saveUserPreferences).not.toHaveBeenCalled();

    // Advance timer for the debounce duration
    vi.runAllTimers();

    // Now it should have called the server
    await waitFor(() => {
      expect(saveUserPreferences).toHaveBeenCalledWith(
        'fake-token',
        expect.objectContaining({
          preferences: expect.objectContaining({
            volume: 0.5,
            image_transition_interval: 20000,
          }),
        })
      );
    });

    vi.useRealTimers();
  });
});
