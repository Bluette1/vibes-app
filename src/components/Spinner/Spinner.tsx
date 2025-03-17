import React from 'react';
import './Spinner.css';

const Spinner: React.FC = () => {
  return (
    <div className="spinner">
      <img src="/android-chrome-192x192.png" alt="Loading..." className="spinner-image w-8 h-8" />
    </div>
  );
};

export default Spinner;
