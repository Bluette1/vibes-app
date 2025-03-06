// src/contexts/AudioContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';

interface Track {
  id: string;
  name: string;
  src: string;
}

interface AudioContextType {
  tracks: Track[];
  selectedTrackId: string;
  setTracks: (tracks: Track[]) => void;
  selectTrack: (trackId: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode; initialTracks?: Track[] }> = ({
  children,
  initialTracks = [],
}) => {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [selectedTrackId, setSelectedTrackId] = useState<string>('');

  // Initialize with localStorage or first track
  useEffect(() => {
    console.log('TRACKS))))))))))', tracks);
    if (tracks.length > 0) {
      const savedTrackId = localStorage.getItem('selectedMusicTrackId');
      if (savedTrackId && tracks.some((track) => track.id === savedTrackId)) {
        setSelectedTrackId(savedTrackId);
      } else {
        setSelectedTrackId(tracks[0].id);
      }
    }
  }, [tracks]);

  const selectTrack = (trackId: string) => {
    setSelectedTrackId(trackId);
    localStorage.setItem('selectedMusicTrackId', trackId);
  };

  useEffect(() => {
    setTracks(initialTracks);
  }, [initialTracks]);

  return (
    <AudioContext.Provider value={{ tracks, selectedTrackId, setTracks, selectTrack }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
