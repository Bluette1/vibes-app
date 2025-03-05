import React, { useState, useEffect } from 'react';
import './ImageRingBook.css';
import { getImages } from '../../utils/api';
import LeftChevron from '../Icons/LeftChevron';
import RightChevron from '../Icons/RightChevron';

interface ImageResponse {
  src: string;
  alt: string;
}

interface ImageRingBookProps {
  images: ImageResponse[];
  autoChangeInterval?: number;
}

const ImageRingBook: React.FC<ImageRingBookProps> = ({ images, autoChangeInterval = 10000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadedImages, setLoadedImages] = useState<ImageResponse[]>([]);

  // Get saved interval from localStorage or use prop value as default
  const [transitionInterval, setTransitionInterval] = useState(() => {
    const savedInterval = localStorage.getItem('transitionInterval');
    return savedInterval ? parseInt(savedInterval) : autoChangeInterval;
  });

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await getImages();
        setLoadedImages(images);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (images.length === 0) {
      fetchImages();
    } else {
      setLoadedImages(images);
    }
  }, [images]);

  // Auto change image at interval
  useEffect(() => {
    if (loadedImages.length <= 1) return;

    const intervalId = setInterval(() => {
      nextImage();
    }, transitionInterval);

    return () => clearInterval(intervalId);
  }, [currentIndex, loadedImages, transitionInterval]);

  // Save interval to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('transitionInterval', transitionInterval.toString());
  }, [transitionInterval]);

  const nextImage = () => {
    if (loadedImages.length <= 1) return;

    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % loadedImages.length);
      setTimeout(() => {
        setIsFlipping(false);
      }, 500); // Half of the transition time to reset flipping state
    }, 500); // Half of the transition time to change image
  };

  const prevImage = () => {
    if (loadedImages.length <= 1) return;

    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + loadedImages.length) % loadedImages.length);
      setTimeout(() => {
        setIsFlipping(false);
      }, 500);
    }, 500);
  };

  const handleIntervalChange = (milliseconds: number) => {
    setTransitionInterval(milliseconds);
  };

  if (isLoading || loadedImages.length === 0) {
    return <div className="loading">Loading images...</div>;
  }

  return (
    <div className="ring-book-container">
      <div className="ring-book">
        <div className="ring-holes">
          <div className="ring"></div>
          <div className="ring"></div>
          <div className="ring"></div>
          <div className="ring"></div>
          <div className="ring"></div>
        </div>

        <div className={`book-page ${isFlipping ? 'flipping' : ''}`}>
          <div className="circular-image-container">
            <div
              className="circular-image"
              style={{ backgroundImage: `url(${loadedImages[currentIndex].src})` }}
            ></div>
          </div>
        </div>

        <div className="navigation-buttons">
          <button onClick={prevImage} className="nav-button">
            <LeftChevron />
          </button>
          <button onClick={nextImage} className="nav-button">
            <RightChevron />
          </button>
        </div>

        <div className="interval-settings">
          <p>Transition interval:</p>
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
        </div>
      </div>
    </div>
  );
};

export default ImageRingBook;
