// Home.tsx
import React, { useState, useEffect } from 'react';
import AudioPlayer from '../../components/AudioPlayer/AudioPlayer';
import ImageRingBook from '../../components/ImageRingBook/ImageRingBook';
import RingBookCover from '../../components/RingBookCover/RingBookCover';
import focusedAudio from '../../assets/audio/focused.mp3';
import { getAudios } from '../../utils/api';
import SettingsModal from '../../components/SettingsModal/SettingsModal';
import { AudioProvider } from '../../contexts/AudioContext';

interface Track {
  id: string;
  name: string;
  src: string;
}

const Home: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get saved interval from localStorage or use 10000 as default
  const [transitionInterval, setTransitionInterval] = useState(() => {
    const savedInterval = localStorage.getItem('transitionInterval');
    return savedInterval ? parseInt(savedInterval) : 10000; // Default interval
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false); // State for settings modal

  const handleOpen = () => {
    setIsOpen(true);
  };

  const toggleSettingsModal = () => {
    setIsSettingsModalOpen(!isSettingsModalOpen);
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

  // Save interval to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('transitionInterval', transitionInterval.toString());
  }, [transitionInterval]);

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
                  <>
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
                  </>
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
