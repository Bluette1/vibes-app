// components/RingBookCover/RingBookCover.tsx
import React from 'react';
import OpenButton from '../OpenButton/OpenButton';
import './RingBookCover.css';
import image from '../../assets/images/background.jpg';

interface RingBookCoverProps {
  onOpen: () => void;
}

const RingBookCover: React.FC<RingBookCoverProps> = ({ onOpen }) => {
  return (
    <div className="ring-book-cover">
      <div className="ring-holes">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
      </div>

      <div className="cover-content">
        <div className="circular-cover-image">
          <div className="image-sections">
            <div className="section mountains"></div>
            <div className="section sunflowers"></div>
            <div className="section forest"></div>
          </div>
          <div className="logo-overlay">V</div>
          <div className="circular-image" style={{ backgroundImage: `url(${image})` }}></div>
        </div>

        <OpenButton onOpen={onOpen} />
      </div>
    </div>
  );
};

export default RingBookCover;
