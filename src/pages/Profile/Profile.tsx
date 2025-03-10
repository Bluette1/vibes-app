// pages/Profile/Profile.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, logout, userPreferences } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="profile-container">
      <div className="ring-book-profile">
        <div className="ring-holes">
          <div className="ring"></div>
          <div className="ring"></div>
          <div className="ring"></div>
          <div className="ring"></div>
          <div className="ring"></div>
        </div>

        <div className="profile-content">
          <div className="profile-header">
            <h1 className="app-title">User Profile</h1>
          </div>

          <div className="profile-info">
            <div className="user-details">
              <div className="detail">
                <span className="label">Email:</span>
                <span className="value">{user?.email || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="preferences-section">
            <h2>Your Preferences</h2>

            {userPreferences ? (
              <div className="preference-details">
                <div className="preference">
                  <span className="pref-label">Image transition interval:</span>
                  <span className="pref-value">
                    {userPreferences.image_transition_interval / 1000} seconds
                  </span>
                </div>

                <div className="preference">
                  <span className="pref-label">Volume level:</span>
                  <span className="pref-value">{Math.round(userPreferences.volume * 100)}%</span>
                </div>

                <div className="preference">
                  <span className="pref-label">Selected track ID:</span>
                  <span className="pref-value">{userPreferences.selected_track}</span>
                </div>
              </div>
            ) : (
              <p className="no-preferences">No saved preferences found.</p>
            )}
          </div>

          <div className="profile-actions">
            <button className="back-button" onClick={handleBackToHome}>
              Back to Home
            </button>

            <button className="logout-button" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
