import React, { useState, useEffect } from 'react';
import AudioPlayer from '../../components/AudioPlayer/AudioPlayer';
import ImageRingBook from '../../components/ImageRingBook/ImageRingBook';
import RingBookCover from '../../components/RingBookCover/RingBookCover';
import focusedAudio from '../../assets/audio/focused.mp3';
import { getAudios } from '../../utils/api';
import SettingsModal from '../../components/SettingsModal/SettingsModal';

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

  const [transitionInterval, setTransitionInterval] = useState<number>(10000); // Default interval
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false); // State for settings modal

  const handleOpen = () => {
    setIsOpen(true);
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

  const toggleSettingsModal = () => {
    setIsSettingsModalOpen(!isSettingsModalOpen);
  };

  return (
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
              {tracks.length > 0 && <AudioPlayer tracks={tracks} />}
            </div>
          ) : (
            <>
              <AudioPlayer tracks={tracks} />

              <section className="flex">
                <>
                  {' '}
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
  );
};

export default Home;
