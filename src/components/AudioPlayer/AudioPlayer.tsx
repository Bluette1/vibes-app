// AudioPlayer.tsx
import React, { useEffect } from 'react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer/useAudioPlayer';
import './AudioPlayer.css';
import PauseIcon from '../Icons/PauseIcon';
import PlayIcon from '../Icons/PlayIcon';
import UnloopIcon from '../Icons/UnLoopIcon';
import LoopIcon from '../Icons/LoopIcon';
import VolumeOnIcon from '../Icons/VolumeOnIcon';
import MutedIcon from '../Icons/MutedIcon';
import { useAudio } from '../../contexts/AudioContext';

const AudioPlayer: React.FC = () => {
  const { tracks, selectedTrackId } = useAudio();

  const selectedTrack = tracks.find((track) => track.id === selectedTrackId) || tracks[0];

  const { isPlaying, isMuted, isLoop, volume, play, pause, toggleMute, toggleLoop, setVolume } =
    useAudioPlayer(selectedTrack?.src || '');

  // Debugging log to verify the track changes
  useEffect(() => {
    console.log('Selected track changed to:', selectedTrack?.name);
  }, [selectedTrack]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(event.target.value));
  };

  return (
    <div data-testid="audio-player" className="flex flex-wrap items-center space-x-2 gap-y-2">
      {/* Play/Pause Button */}
      <div className="relative">
        <button
          aria-label={isPlaying ? 'pause' : 'play'}
          onClick={isPlaying ? pause : play}
          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <span className="tooltip">{isPlaying ? 'Pause' : 'Play'}</span>
      </div>

      {/* Loop/Unloop Button */}
      <div className="relative">
        <button
          aria-label={isLoop ? 'unloop' : 'loop'}
          onClick={toggleLoop}
          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
        >
          {isLoop ? <UnloopIcon /> : <LoopIcon />}
        </button>
        <span className="tooltip">{isLoop ? 'Unloop' : 'Loop'}</span>
      </div>

      {/* Volume Control and Mute/Unmute Button */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <button
            aria-label={isMuted ? 'unmute' : 'mute'}
            onClick={toggleMute}
            className="bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
          >
            {isMuted ? <MutedIcon /> : <VolumeOnIcon />}
          </button>
          <span className="tooltip">{isMuted ? 'Unmute' : 'Mute'}</span>
        </div>
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
    </div>
  );
};

export default AudioPlayer;
