// src/contexts/AudioContext.tsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

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
  isTrackSaving: boolean;
}

// Create a context with a default undefined value
const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{
  children: React.ReactNode;
  initialTracks?: Track[];
  onTrackSelect?: (trackId: string) => Promise<void>;
  initialSelectedTrackId?: string;
}> = ({ children, initialTracks = [], onTrackSelect, initialSelectedTrackId }) => {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [selectedTrackId, setSelectedTrackId] = useState<string>('');
  const [isTrackSaving, setIsTrackSaving] = useState<boolean>(false);

  // Initialize with provided ID, localStorage, or first track
  useEffect(() => {
    if (tracks.length > 0) {
      if (initialSelectedTrackId && tracks.some((track) => track.id === initialSelectedTrackId)) {
        // Use the server-provided ID if available
        setSelectedTrackId(initialSelectedTrackId);
      } else {
        // Fall back to localStorage or first track
        const savedTrackId = localStorage.getItem('selectedMusicTrackId');
        if (savedTrackId && tracks.some((track) => track.id === savedTrackId)) {
          setSelectedTrackId(savedTrackId);
        } else {
          setSelectedTrackId(tracks[0].id);
        }
      }
    }
  }, [tracks, initialSelectedTrackId]);

  // Select track function with optional server saving
  const selectTrack = useCallback(
    async (trackId: string) => {
      // Update state immediately for responsive UI
      setSelectedTrackId(trackId);

      // Always update localStorage
      localStorage.setItem('selectedMusicTrackId', trackId);

      // If we have a server save callback, use it
      if (onTrackSelect) {
        setIsTrackSaving(true);
        try {
          await onTrackSelect(trackId);
        } catch (error) {
          console.error('Failed to save track selection to server:', error);
        } finally {
          setIsTrackSaving(false);
        }
      }
    },
    [onTrackSelect]
  );

  useEffect(() => {
    setTracks(initialTracks);
  }, [initialTracks]);

  return (
    <AudioContext.Provider
      value={{
        tracks,
        selectedTrackId,
        setTracks,
        selectTrack,
        isTrackSaving,
      }}
    >
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
