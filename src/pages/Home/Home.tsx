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
  id: string;
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
  const [debugMessage, setDebugMessage] = useState<string>('');
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef<boolean>(false);

  // Initialize from localStorage first
  const [transitionInterval, setTransitionInterval] = useState<number>(() => {
    try {
      const savedInterval = localStorage.getItem('transitionInterval');
      return savedInterval ? parseInt(savedInterval) : 10000; // Default interval
    } catch (e) {
      console.error("Error parsing localStorage interval:", e);
      return 10000;
    }
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  const handleOpen = () => setIsOpen(true);
  const toggleSettingsModal = () => setIsSettingsModalOpen(!isSettingsModalOpen);

  // Memoized function to save interval to server
  const saveIntervalToServer = useCallback(async (interval: number) => {
    if (!isAuthenticated || !token || !userPreferences) {
      localStorage.setItem('transitionInterval', interval.toString());
      return;
    }
    
    setIsSaving(true);
    setDebugMessage(`Saving ${interval/1000}s to server...`);
    
    try {
      const updatedPrefs = {
        ...userPreferences,
        image_transition_interval: interval,
      };

      console.log('Updated preferences)))', updatedPrefs)
      await saveUserPreferences(token, { preferences: updatedPrefs });
      setUserPreferences(updatedPrefs);
      
      // Update local storage after successful server update
      localStorage.setItem('transitionInterval', interval.toString());
      setDebugMessage(`Successfully saved ${interval/1000}s to server`);
    } catch (err) {
      console.error('Failed to save user preferences:', err);
      setDebugMessage(`Error saving to server: ${err}`);
    } finally {
      setIsSaving(false);
    }
  }, [isAuthenticated, token, userPreferences, setUserPreferences]);

  // Handle interval change with proper debouncing
  const handleIntervalChange = useCallback((milliseconds: number) => {
    // Update UI immediately
    setTransitionInterval(milliseconds);
    setDebugMessage(`Interval changed to ${milliseconds/1000}s, debouncing save...`);
    
    // Clear any pending timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Save to localStorage immediately for local persistence
    localStorage.setItem('transitionInterval', milliseconds.toString());
    
    // Debounce server save
    saveTimeoutRef.current = setTimeout(() => {
      saveIntervalToServer(milliseconds);
    }, 1000);
    
  }, [saveIntervalToServer]);

  // Fetch tracks
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

  // Fetch user preferences only once when authenticated
  useEffect(() => {
    if (isAuthenticated && token && !isInitializedRef.current) {
      const fetchUserPreferences = async () => {
        try {
          const data = await getUserPreferences(token);
          setUserPreferences(data.preferences);

          // If server has a value, use it
          if (data.preferences.image_transition_interval) {
            const serverInterval = data.preferences.image_transition_interval;
            setTransitionInterval(serverInterval);
            localStorage.setItem('transitionInterval', serverInterval.toString());
            setDebugMessage(`Loaded interval ${serverInterval/1000}s from server`);
          } else {
            // If server doesn't have a value, use our current value and save to server
            saveIntervalToServer(transitionInterval);
            setDebugMessage(`Server had no interval, using local: ${transitionInterval/1000}s`);
          }
          
          isInitializedRef.current = true;
        } catch (err) {
          console.error('Failed to fetch user preferences:', err);
          setDebugMessage(`Error fetching preferences: ${err}`);
        }
      };

      fetchUserPreferences();
    }
  }, [isAuthenticated, token, setUserPreferences, saveIntervalToServer, transitionInterval]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AudioProvider initialTracks={tracks}>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="absolute top-4 right-4">
          <ProfileIcon />
        </div>

        {isOpen ? (
          <ImageRingBook 
            images={[]} 
            transitionInterval={transitionInterval} 
          />
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
                <section className="flex flex-col py-5 items-center">
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
                  {debugMessage && (
                    <div className="mt-2 text-xs text-gray-500">{debugMessage}</div>
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