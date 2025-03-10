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
  transitionInterval: number;
}

const ImageRingBook: React.FC<ImageRingBookProps> = ({ images, transitionInterval }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadedImages, setLoadedImages] = useState<ImageResponse[]>([]);

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

  useEffect(() => {
    if (loadedImages.length <= 1) return;

    const intervalId = setInterval(() => {
      nextImage();
    }, transitionInterval);

    return () => clearInterval(intervalId);
  }, [currentIndex, loadedImages, transitionInterval]);

  const nextImage = () => {
    if (loadedImages.length <= 1) return;

    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % loadedImages.length);
      setTimeout(() => {
        setIsFlipping(false);
      }, 500);
    }, 500);
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

  if (isLoading || loadedImages.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="ring-book-container">
      <div className="ring-book">
        <div className="ring-holes">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="ring"></div>
          ))}
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
      </div>
    </div>
  );
};

export default ImageRingBook;
