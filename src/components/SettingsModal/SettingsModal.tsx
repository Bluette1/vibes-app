import React from 'react';

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
      <span onClick={onClose} className="close-icon" role="button" aria-label="Close settings modal">❎</span> {/* Close icon */}
    </div>
  );
};

export default SettingsModal;