// pages/Home/Home.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioPlayer from '../../components/AudioPlayer/AudioPlayer';
import ImageRingBook from '../../components/ImageRingBook/ImageRingBook';
import RingBookCover from '../../components/RingBookCover/RingBookCover';
import focusedAudio from '../../assets/audio/focused.mp3';
import { getAudios, getUserPreferences, saveUserPreferences } from '../../utils/api';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import { AudioProvider } from '../../contexts/AudioContext';
import { useAuth } from '../../contexts/AuthContext';
import ProfileIcon from '../../components/Icons/ProfileIcon';

interface Track {
  id: string;
  name: string;
  src: string;
}

const Home: React.FC = () => {
  const { isAuthenticated, token, userPreferences, setUserPreferences } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [transitionInterval, setTransitionInterval] = useState(() => {
    const savedInterval = localStorage.getItem('transitionInterval');
    return savedInterval ? parseInt(savedInterval) : 10000; // Default interval
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  const handleOpen = () => setIsOpen(true);

  const toggleSettingsModal = () => setIsSettingsModalOpen(!isSettingsModalOpen);

  // Handle login button click
  const handleLoginClick = () => {
    navigate('/auth');
  };

  useEffect(() => {
    const fetchTracks = async () => {
      setIsLoading(true);
      try {
        const data = await getAudios();
        const formattedTracks = data.map((item) => ({
          id: item.id.toString(),
          name: item.title,
          src: item.url,
        }));

        setTracks(formattedTracks);
      } catch (err) {
        console.error('Failed to fetch tracks:', err);
        setError('Failed to load music tracks. Using default tracks instead.');
        setTracks([{ id: 'focused', name: 'Focused', src: focusedAudio }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, []);

  // Fetch user preferences if authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      const fetchUserPreferences = async () => {
        try {
          const data = await getUserPreferences(token);
          setUserPreferences(data.preferences);

          // Update local state
          setTransitionInterval(data.preferences.image_transition_interval);
          localStorage.setItem(
            'transitionInterval',
            data.preferences.image_transition_interval.toString()
          );
        } catch (err) {
          console.error('Failed to fetch user preferences:', err);
        }
      };

      fetchUserPreferences();
    }
  }, [isAuthenticated, token, setUserPreferences]);

  // Save transition interval to user preferences if authenticated
  useEffect(() => {
    localStorage.setItem('transitionInterval', transitionInterval.toString());

    if (isAuthenticated && token && userPreferences) {
      const savePrefs = async () => {
        try {
          const updatedPrefs = {
            ...userPreferences,
            image_transition_interval: transitionInterval,
          };

          await saveUserPreferences(token, { preferences: updatedPrefs });
          setUserPreferences(updatedPrefs);
        } catch (err) {
          console.error('Failed to save user preferences:', err);
        }
      };

      // Debounce the save operation
      const debounceTimer = setTimeout(() => {
        savePrefs();
      }, 1000);

      return () => clearTimeout(debounceTimer);
    }
  }, [transitionInterval, isAuthenticated, token, userPreferences, setUserPreferences]);

  return (
    <AudioProvider initialTracks={tracks}>
      <div className="flex flex-col items-center justify-center">
        {isOpen ? (
          <ImageRingBook images={[]} transitionInterval={transitionInterval} />
        ) : (
          <RingBookCover onOpen={handleOpen} />
        )}

        {isOpen && (
          <>
            <div className="user-auth-status mt-2 mb-2">
              {isAuthenticated ? (
                <div className="text-green-600">✓ Preferences are being saved to your account</div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="mb-2 px-2 py-2  text-gray-500 rounded  flex items-center"
                >
                  <ProfileIcon />
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="mt-4 text-center">
                <p>Loading audio tracks...</p>
              </div>
            ) : error ? (
              <div className="mt-4 text-center">
                <p className="text-amber-600">{error}</p>
                {tracks.length > 0 && <AudioPlayer />}
              </div>
            ) : (
              <>
                <AudioPlayer />
                <section className="flex py-5">
                  <button onClick={toggleSettingsModal} className="settings-button">
                    ⚙️
                  </button>
                  {isSettingsModalOpen && (
                    <SettingsModal
                      transitionInterval={transitionInterval}
                      handleIntervalChange={setTransitionInterval}
                      onClose={toggleSettingsModal}
                    />
                  )}
                </section>
              </>
            )}
          </>
        )}
      </div>
    </AudioProvider>
  );
};

export default Home;
