import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer/useAudioPlayer';
import './AudioPlayer.css';
import PauseIcon from '../Icons/PauseIcon';
import PlayIcon from '../Icons/PlayIcon';
import UnloopIcon from '../Icons/UnLoopIcon';
import LoopIcon from '../Icons/LoopIcon';
import VolumeOnIcon from '../Icons/VolumeOnIcon';
import MutedIcon from '../Icons/MutedIcon';

interface AudioPlayerProps {
  tracks: { id: string; name: string; src: string }[];
  defaultTrackId?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ tracks, defaultTrackId }) => {
  // Get default track or first track
  const [selectedTrackId, setSelectedTrackId] = useState<string>(
    defaultTrackId || (tracks.length > 0 ? tracks[0].id : '')
  );

  const selectedTrack = tracks.find(track => track.id === selectedTrackId) || tracks[0];
  
  const { isPlaying, isMuted, isLoop, volume, play, pause, toggleMute, toggleLoop, setVolume } =
    useAudioPlayer(selectedTrack.src);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(event.target.value));
  };

  const handleTrackChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTrackId = event.target.value;
    setSelectedTrackId(newTrackId);
    
    // Save to localStorage for future sessions
    localStorage.setItem('selectedMusicTrackId', newTrackId);
    
    // If it was playing, continue playing the new track
    if (isPlaying) {
      setTimeout(() => play(), 0);
    }
  };

  // Load user's last selected track from localStorage
  useEffect(() => {
    const savedTrackId = localStorage.getItem('selectedMusicTrackId');
    if (savedTrackId && tracks.some(track => track.id === savedTrackId)) {
      setSelectedTrackId(savedTrackId);
    }
  }, [tracks]);

  return (
    <div data-testid="audio-player" className="flex flex-wrap items-center space-x-2 gap-y-2">
      {/* Track Selection */}
      <div className="w-full mb-2">
        <label htmlFor="track-select" className="mr-2 text-sm font-medium">
          Music Track:
        </label>
        <select
          id="track-select"
          value={selectedTrackId}
          onChange={handleTrackChange}
          className="bg-white border border-gray-300 rounded px-3 py-1 text-sm"
          aria-label="Select music track"
        >
          {tracks.map(track => (
            <option key={track.id} value={track.id}>
              {track.name}
            </option>
          ))}
        </select>
      </div>

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