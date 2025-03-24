import React, { useState } from 'react';
import './SettingsModal.css';
import CloseIcon from '../Icons/CloseIcon';
import { useAudio } from '../../contexts/AudioContext';

interface SettingsModalProps {
  transitionInterval: number;
  handleIntervalChange: (milliseconds: number) => void;
  onClose: () => void;
  isSaving?: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  transitionInterval,
  handleIntervalChange,
  onClose,
  isSaving = false,
}) => {
  const { tracks, selectedTrackId, selectTrack, isTrackSaving } = useAudio();
  const [isOpen, setIsOpen] = useState(false);

  const handleTrackSelect = (trackId: string | number | undefined) => {
    selectTrack(trackId);
    setIsOpen(false);
  };

  return (
    <div className="settings-modal">
      <h3>Transition Interval</h3>
      <div className="interval-buttons">
        <button
          onClick={() => handleIntervalChange(5000)}
          className={transitionInterval === 5000 ? 'active' : ''}
          disabled={isSaving}
        >
          5s
        </button>
        <button
          onClick={() => handleIntervalChange(10000)}
          className={transitionInterval === 10000 ? 'active' : ''}
          disabled={isSaving}
        >
          10s
        </button>
        <button
          onClick={() => handleIntervalChange(20000)}
          className={transitionInterval === 20000 ? 'active' : ''}
          disabled={isSaving}
        >
          20s
        </button>
      </div>
      <div className="current-interval">
        Current: {transitionInterval / 1000}s
        {isSaving && <span className="ml-2 text-xs text-gray-500">(saving...)</span>}
      </div>

      <h3 className="pt-7">Select Music Track</h3>
      <div className="custom-dropup">
        <div
          className={`dropup-header ${isTrackSaving ? 'saving' : ''}`}
          onClick={() => !isTrackSaving && setIsOpen(!isOpen)}
        >
          {tracks.find((track) => track.id === selectedTrackId)?.name || 'Select a track'}
          {isTrackSaving && <span className="ml-2 text-xs text-gray-500">(saving...)</span>}
        </div>
        {isOpen && (
          <div className="dropup-list">
            {tracks.map((track) => (
              <div
                key={track.id}
                className={`dropup-item ${selectedTrackId === track.id ? 'active' : ''}`}
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
