import React, { useState, useEffect } from 'react';
import './ImageRingBook.css';
import { getImages } from '../../utils/api';

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
    }, autoChangeInterval);

    return () => clearInterval(intervalId);
  }, [currentIndex, loadedImages, autoChangeInterval]);

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

        {/* <div className="navigation-buttons">
          <button onClick={prevImage} className="nav-button">
            Previous
          </button>
          <button onClick={nextImage} className="nav-button">
            Next
          </button>
        </div>
      </div> */}
        <div className="navigation-buttons">
          <button onClick={prevImage} className="nav-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-chevron-left"
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
              <path d="M15 6l-6 6l6 6" />
            </svg>
          </button>
          <button onClick={nextImage} className="nav-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-chevron-right"
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
              <path d="M9 6l6 6l-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageRingBook;
