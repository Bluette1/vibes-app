import React from 'react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer/useAudioPlayer';
import './AudioPlayer.css';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const { isPlaying, isMuted, isLoop, volume, play, pause, toggleMute, toggleLoop, setVolume } =
    useAudioPlayer(src);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(event.target.value));
  };

  return (
    <div data-testid="audio-player" className="flex items-center space-x-2">
      {/* Play/Pause Button */}
      <div className="relative">
        <button
          aria-label={isPlaying ? 'pause' : 'play'}
          onClick={isPlaying ? pause : play}
          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-pause"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 4v16M14 4v16" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-play"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 4v16l15 -8z" />
            </svg>
          )}
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
          {isLoop ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-loop"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 3v3m0 -3a9 9 0 0 0 -9 9h3m-3 0a9 9 0 0 0 9 9v-3" />
              <path d="M21 12h-3m3 0a9 9 0 0 0 -9 -9v3" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-loop-off"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 3l18 18" />
              <path d="M12 3v3m0 -3a9 9 0 0 0 -9 9h3" />
              <path d="M21 12h-3m3 0a9 9 0 0 0 -9 -9v3" />
            </svg>
          )}
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
            {isMuted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-volume-off"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 12h-4l-3 3v-12l3 3h4z" />
                <path d="M16 16l4 4m0 -4l-4 4" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-volume"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 12h-4l-3 3v-12l3 3h4z" />
                <path d="M16 16a4 4 0 0 0 0 -8" />
                <path d="M18 12a6 6 0 0 0 -2 -4.472" />
                <path d="M20 12a8 8 0 0 0 -4 -7.464" />
              </svg>
            )}
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
