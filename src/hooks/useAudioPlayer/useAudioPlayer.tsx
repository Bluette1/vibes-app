// hooks/useAudioPlayer/useAudioPlayer.ts
import { useState, useEffect, useRef } from 'react';

export const useAudioPlayer = (audioSrc: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    // Clean up function to pause audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Handle changes to the audio source
  useEffect(() => {
    if (audioRef.current && audioSrc) {
      // Store the current playing state
      const wasPlaying = !audioRef.current.paused;

      // Update the audio source
      audioRef.current.src = audioSrc;

      // Apply current settings
      audioRef.current.loop = isLoop;
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;

      // If it was playing before, play the new track
      if (wasPlaying) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
          });
      }
    }
  }, [audioSrc]);

  // Apply audio settings when they change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLoop;
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [isLoop, volume, isMuted]);

  const play = () => {
    if (audioRef.current && audioSrc) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleLoop = () => {
    setIsLoop(!isLoop);
  };

  return {
    isPlaying,
    isMuted,
    isLoop,
    volume,
    play,
    pause,
    toggleMute,
    toggleLoop,
    setVolume,
  };
};
