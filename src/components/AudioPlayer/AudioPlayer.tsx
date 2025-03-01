import React from 'react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer/useAudioPlayer';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const {
    isPlaying,
    isMuted,
    isLoop,
    volume,
    play,
    pause,
    toggleMute,
    toggleLoop,
    setVolume,
  } = useAudioPlayer(src);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(event.target.value));
  };

  return (
    <div data-testid="audio-player" className="flex items-center space-x-2">
      <button
        aria-label={isPlaying ? 'pause' : 'play'}
        onClick={isPlaying ? pause : play}
        className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      <button
        aria-label={isMuted ? 'unmute' : 'mute'}
        onClick={toggleMute}
        className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md"
      >
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
      <button
        aria-label={isLoop ? 'unloop' : 'loop'}
        onClick={toggleLoop}
        className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md"
      >
        {isLoop ? 'Unloop' : 'Loop'}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={handleVolumeChange}
        className="w-24"
        aria-label="volume"
        role="slider"
      />
    </div>
  );
};

export default AudioPlayer;
