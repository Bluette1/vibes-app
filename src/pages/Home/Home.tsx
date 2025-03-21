// pages/Home/Home.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import AudioPlayer from '../../components/AudioPlayer/AudioPlayer';
import ImageRingBook from '../../components/ImageRingBook/ImageRingBook';
import RingBookCover from '../../components/RingBookCover/RingBookCover';
import ProfileIcon from '../../components/Icons/ProfileIcon/ProfileIcon';
import focusedAudio from '../../assets/audio/focused.mp3';
import { getAudios, getUserPreferences, saveUserPreferences } from '../../utils/api';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import { AudioProvider } from '../../contexts/AudioContext';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../../components/Spinner/Spinner';

interface Track {
  id: number;
  name: string;
  src: string;
}

const Home: React.FC = () => {
  const { isAuthenticated, token, userPreferences, setUserPreferences } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [initialSelectedTrackId, setInitialSelectedTrackId] = useState<string | number | undefined>(
    undefined
  );

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef<boolean>(false);

  // Initialize from localStorage first
  const [transitionInterval, setTransitionInterval] = useState<number>(() => {
    try {
      const savedInterval = localStorage.getItem('transitionInterval');
      return savedInterval ? parseInt(savedInterval) : 10000; // Default interval
    } catch (e) {
      console.error('Error parsing localStorage interval:', e);
      return 10000;
    }
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  const handleOpen = () => setIsOpen(true);
  const toggleSettingsModal = () => setIsSettingsModalOpen(!isSettingsModalOpen);

  // Memoized function to save changes to server
  const savePreferencesToServer = useCallback(
    async (updatedPrefs: Partial<typeof userPreferences>) => {
      if (!isAuthenticated || !token || !userPreferences) {
        return;
      }

      setIsSaving(true);

      try {
        const newPrefs = {
          ...userPreferences,
          ...updatedPrefs,
        };

        await saveUserPreferences(token, { preferences: newPrefs });
        setUserPreferences(newPrefs);
      } catch (err) {
        console.error('Failed to save user preferences:', err);
      } finally {
        setIsSaving(false);
      }
    },
    [isAuthenticated, token, userPreferences, setUserPreferences]
  );

  // Handle interval change with proper debouncing
  const handleIntervalChange = useCallback(
    (milliseconds: number) => {
      // Update UI immediately
      setTransitionInterval(milliseconds);

      // Clear any pending timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Save to localStorage immediately for local persistence
      localStorage.setItem('transitionInterval', milliseconds.toString());

      // Debounce server save
      saveTimeoutRef.current = setTimeout(() => {
        savePreferencesToServer({ image_transition_interval: milliseconds });
      }, 1000);
    },
    [savePreferencesToServer]
  );

  // Handle track selection (to be passed to AudioProvider)
  const handleTrackSelect = useCallback(
    async (trackId: string | number | undefined) => {
      // Save to server without debouncing (since track changes are less frequent)
      await savePreferencesToServer({ selected_track: trackId });
    },
    [savePreferencesToServer]
  );

  // Fetch tracks
  useEffect(() => {
    const fetchTracks = async () => {
      setIsLoading(true);
      try {
        const data = await getAudios();
        const formattedTracks = data.map((item) => ({
          id: item.id,
          name: item.title,
          src: item.url,
        }));

        setTracks(formattedTracks);
      } catch (err) {
        console.error('Failed to fetch tracks:', err);
        setError('Failed to load music tracks. Using default tracks instead.');
        setTracks([{ id: 0, name: 'Focused', src: focusedAudio }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, []);

  // Fetch user preferences only once when authenticated
  useEffect(() => {
    if (isAuthenticated && token && !isInitializedRef.current) {
      const fetchUserPreferences = async () => {
        try {
          const data = await getUserPreferences(token);
          setUserPreferences(data.preferences);

          // Handle interval from server
          if (data.preferences.image_transition_interval) {
            const serverInterval = data.preferences.image_transition_interval;
            setTransitionInterval(serverInterval);
            localStorage.setItem('transitionInterval', serverInterval.toString());
          } else {
            // If server doesn't have a value, use our current value and save to server
            savePreferencesToServer({ image_transition_interval: transitionInterval });
          }

          // Handle selected track from server
          if (data.preferences.selected_track) {
            const selectedTrack =
              typeof data.preferences.selected_track == 'string'
                ? parseInt(data.preferences.selected_track)
                : data.preferences.selected_track;

            setInitialSelectedTrackId(selectedTrack);
          }

          isInitializedRef.current = true;
        } catch (err) {
          console.error('Failed to fetch user preferences:', err);
        }
      };

      fetchUserPreferences();
    }
  }, [isAuthenticated, token, setUserPreferences, savePreferencesToServer, transitionInterval]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AudioProvider
      initialTracks={tracks}
      onTrackSelect={isAuthenticated ? handleTrackSelect : undefined}
      initialSelectedTrackId={initialSelectedTrackId}
    >
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="absolute top-4 right-4">
          <ProfileIcon />
        </div>

        {isOpen ? (
          <ImageRingBook images={[]} transitionInterval={transitionInterval} />
        ) : (
          <RingBookCover onOpen={handleOpen} />
        )}

        {isOpen && (
          <>
            {isLoading ? (
              <div className="mt-4 text-center">
                <Spinner />
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
                      handleIntervalChange={handleIntervalChange}
                      onClose={toggleSettingsModal}
                      isSaving={isSaving}
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
