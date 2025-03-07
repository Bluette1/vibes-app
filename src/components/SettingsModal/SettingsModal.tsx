import React, { useState } from 'react';
import './SettingsModal.css';
import CloseIcon from '../Icons/CloseIcon';
import { useAudio } from '../../contexts/AudioContext';

interface SettingsModalProps {
  transitionInterval: number;
  handleIntervalChange: (milliseconds: number) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  transitionInterval,
  handleIntervalChange,
  onClose,
}) => {
  const { tracks, selectedTrackId, selectTrack } = useAudio();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(selectedTrackId);

  const handleTrackSelect = (trackId: string) => {
    selectTrack(trackId);
    setSelectedTrack(trackId);
    setIsOpen(false);
  };

  return (
    <div className="settings-modal">
      <h3>Transition Interval</h3>
      <div className="interval-buttons">
        <button
          onClick={() => handleIntervalChange(5000)}
          className={transitionInterval === 5000 ? 'active' : ''}
        >
          5s
        </button>
        <button
          onClick={() => handleIntervalChange(10000)}
          className={transitionInterval === 10000 ? 'active' : ''}
        >
          10s
        </button>
        <button
          onClick={() => handleIntervalChange(20000)}
          className={transitionInterval === 20000 ? 'active' : ''}
        >
          20s
        </button>
      </div>
      <div className="current-interval">Current: {transitionInterval / 1000}s</div>

      <h3 className="pt-7">Select Music Track</h3>
      <div className="custom-dropup">
        <div className="dropup-header" onClick={() => setIsOpen(!isOpen)}>
          {tracks.find((track) => track.id === selectedTrack)?.name || 'Select a track'}
        </div>
        {isOpen && (
          <div className="dropup-list">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="dropup-item"
                onClick={() => handleTrackSelect(track.id)}
              >
                {track.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <span onClick={onClose} role="button" aria-label="Close settings modal">
        <CloseIcon />
      </span>
    </div>
  );
};

export default SettingsModal;
