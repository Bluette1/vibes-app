import { useState, useEffect } from 'react';

export const useAudioPlayer = (src: string) => {
  const initialVolume = () => {
    const savedVolume = localStorage.getItem('audioPlayerVolume');
    return savedVolume ? parseFloat(savedVolume) : 1;
  };

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoop, setIsLoop] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(initialVolume());
  const [audio] = useState<HTMLAudioElement>(new Audio(src));

  useEffect(() => {
    audio.volume = volume;
  }, [volume, audio]);

  useEffect(() => {
    audio.loop = isLoop;
  }, [isLoop, audio]);

  const play = () => {
    audio.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audio.pause();
    setIsPlaying(false);
  };

  const toggleMute = () => {
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleLoop = () => {
    setIsLoop(!isLoop);
  }

  const setVolumeAndSave = (newVolume: number) => {
    localStorage.setItem('audioPlayerVolume', newVolume.toString());
    setVolume(newVolume);
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
    setVolume: setVolumeAndSave,
  };
};
