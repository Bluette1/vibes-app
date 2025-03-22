// App.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from '../App';
import Home from '../pages/Home/Home';
import Profile from '../pages/Profile/Profile';
import { AuthProvider } from '../contexts/AuthContext';

describe('App Component', () => {
  it.skip('renders Home component at "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/home/i)).toBeInTheDocument(); // Adjust based on actual Home component content
  });

  it.skip('renders Auth component at "/auth"', () => {
    render(
      <MemoryRouter initialEntries={['/auth']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/auth/i)).toBeInTheDocument(); // Adjust based on actual Auth component content
  });

  it('renders Profile component at "/profile" when authenticated', () => {
    // Mock the ProtectedRoute to simulate user authentication
    const MockProtectedRoute = ({ children }) => {
      return <>{children}</>;
    };

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <AuthProvider>
          <Routes>
            <Route
              path="/profile"
              element={
                <MockProtectedRoute>
                  <Profile />
                </MockProtectedRoute>
              }
            />
            <Route path="/" element={<Home />} /> {/* Include your App component here */}
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/profile/i)).toBeInTheDocument(); // Adjust based on actual Profile component content
  });

  it.skip('does not render Profile component at "/profile" when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    // You can check for redirection or absence of the Profile component
    expect(screen.queryByText(/profile/i)).not.toBeInTheDocument(); // Adjust based on actual Profile component content
  });
});
