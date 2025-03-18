// pages/Auth/Auth.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, getUserPreferences } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Handle login
        const data = await login(email, password);
        authLogin(data.token, data.resource_owner);

        // Fetch user preferences
        try {
          const prefsData = await getUserPreferences(data.token);
          localStorage.setItem(
            'transitionInterval',
            prefsData.preferences.image_transition_interval.toString()
          );
          if (prefsData.preferences.selected_track)
            localStorage.setItem(
              'selectedTrack',
              prefsData.preferences.selected_track?.toString()
            );
          localStorage.setItem('volume', prefsData.preferences.volume.toString());
        } catch (prefError) {
          console.error('Failed to load preferences, using defaults', prefError);
        }

        navigate('/');
      } else {
        // Handle registration
        await register(email, password, name);
        setIsLogin(true);
        setError('Registration successful! Please log in.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="ring-book-auth">
        <div className="ring-holes">
          <div className="ring"></div>
          <div className="ring"></div>
          <div className="ring"></div>
          <div className="ring"></div>
          <div className="ring"></div>
        </div>

        <div className="auth-content">
          <div className="auth-header">
            <h1 className="app-title">Vibes</h1>
            <p className="app-subtitle">
              {isLogin ? 'Log in to your account' : 'Create your account'}
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </form>

          <div className="auth-switch">
            <p>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="switch-button">
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
