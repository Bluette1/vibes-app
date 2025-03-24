// src/tests/pages/Profile.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Profile from '../../pages/Profile/Profile';
import { useAuth } from '../../contexts/AuthContext';
import { afterEach, beforeEach, describe, expect, test, vi, Mock } from 'vitest';

// Mock the useAuth hook
vi.mock('../../contexts/AuthContext');

// Mock react-router-dom module
vi.mock('react-router-dom', () => {
  return {
    useNavigate: vi.fn(),
    MemoryRouter: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="memory-router">{children}</div>
    ),
  };
});

const mockUseAuth = useAuth as Mock;

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
    expect(screen.getByText(/Email:/)).toBeTruthy();
    expect(screen.getByText('user@example.com')).toBeTruthy();
  });

  test('renders user preferences', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );
    expect(screen.getByText('Your Preferences')).toBeTruthy();
    expect(screen.getByText('Image transition interval:')).toBeTruthy();
    expect(screen.getByText('5 seconds')).toBeTruthy();
    expect(screen.getByText('Volume level:')).toBeTruthy();
    expect(screen.getByText('50%')).toBeTruthy();
    expect(screen.getByText('Selected track ID:')).toBeTruthy();
    expect(screen.getByText('track123')).toBeTruthy();
  });

  test('renders no preferences message when userPreferences is undefined', () => {
    mockUseAuth.mockReturnValueOnce({
      user: { email: 'user@example.com' },
      logout: vi.fn() as unknown,
      userPreferences: null,
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );
    expect(screen.getByText('No saved preferences found.')).toBeTruthy();
  });

  test('handles back to home button click', () => {
    const navigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(navigate); // Use the mocked useNavigate

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
    (useNavigate as Mock).mockReturnValue(navigate); // Use the mocked useNavigate

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
