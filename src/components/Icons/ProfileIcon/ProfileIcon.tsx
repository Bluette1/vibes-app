// components/ProfileIcon/ProfileIcon.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './ProfileIcon.css';
import Profile from '../ProfileIcon';
import ProfileLogin from '../ProfileLogin';

const ProfileIcon: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogin = () => {
    navigate('/auth');
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const handleViewProfile = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  return (
    <div className="profile-icon-container" ref={dropdownRef}>
      <button
        className="text-gray-400"
        onClick={toggleDropdown}
        aria-label={isAuthenticated ? 'User profile' : 'Login'}
      >
        {isAuthenticated ? <Profile /> : <ProfileLogin />}
      </button>

      {isDropdownOpen && (
        <div className="profile-dropdown">
          {isAuthenticated ? (
            <>
              <div className="user-info">
                <div className="user-details">
                  <div className="user-email">{user?.email || 'No email'}</div>
                </div>
              </div>

              <div className="dropdown-divider"></div>

              <button className="dropdown-item" onClick={handleViewProfile}>
                View Profile
              </button>

              <button className="dropdown-item logout" onClick={handleLogout}>
                Log Out
              </button>
            </>
          ) : (
            <button className="dropdown-item" onClick={handleLogin}>
              Log In / Sign Up
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
