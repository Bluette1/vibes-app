// contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';

interface UserPreferences {
  id: number;
  user_id: number;
  volume: number;
  selected_track: string;
  image_transition_interval: number;
  created_at: string;
  updated_at: string;
}

interface User {
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  userPreferences: UserPreferences | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUserPreferences: (prefs: UserPreferences) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

  useEffect(() => {
    // Check if user is logged in on component mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedPreferences = localStorage.getItem('userPreferences');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);

      if (storedPreferences) {
        setUserPreferences(JSON.parse(storedPreferences));
      }
    }
  }, []);

  const login = (token: string, user: User | null) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    // Note: We're keeping user preferences in localStorage even after logout
  };

  const updateUserPreferences = (prefs: UserPreferences) => {
    localStorage.setItem('userPreferences', JSON.stringify(prefs));
    setUserPreferences(prefs);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        userPreferences,
        login,
        logout,
        setUserPreferences: updateUserPreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
