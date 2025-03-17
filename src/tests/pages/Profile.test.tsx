// src/tests/pages/Profile.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Profile from '../../pages/Profile/Profile';
import { useAuth } from '../../contexts/AuthContext';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

// Mock the useAuth hook
vi.mock('../../contexts/AuthContext');

// Mock react-router-dom module
vi.mock('react-router-dom', () => {
  return {
    useNavigate: vi.fn(),
    MemoryRouter: ({ children }) => <div data-testid="memory-router">{children}</div>,
  };
});

const mockUseAuth = useAuth as jest.Mock;

describe('Profile Component', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: { email: 'user@example.com' },
      logout: vi.fn(),
      userPreferences: {
        image_transition_interval: 5000,
        volume: 0.5,
        selected_track: 'track123',
      },
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('renders user email', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText(/Email:/)).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
  });

  test('renders user preferences', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText('Your Preferences')).toBeInTheDocument();
    expect(screen.getByText('Image transition interval:')).toBeInTheDocument();
    expect(screen.getByText('5 seconds')).toBeInTheDocument();
    expect(screen.getByText('Volume level:')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('Selected track ID:')).toBeInTheDocument();
    expect(screen.getByText('track123')).toBeInTheDocument();
  });

  test('renders no preferences message when userPreferences is undefined', () => {
    mockUseAuth.mockReturnValueOnce({
      user: { email: 'user@example.com' },
      logout: vi.fn(),
      userPreferences: null,
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText('No saved preferences found.')).toBeInTheDocument();
  });

  test('handles back to home button click', () => {
    const navigate = vi.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate); // Use the mocked useNavigate

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Back to Home'));
    expect(navigate).toHaveBeenCalledWith('/');
  });

  test('handles logout button click', () => {
    const { logout } = mockUseAuth();
    const navigate = vi.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate); // Use the mocked useNavigate

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Log Out'));
    expect(logout).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/');
  });
});
