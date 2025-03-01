import React, { useState, useEffect } from 'react';
import { getImages } from '../../utils/api';

interface ImageResponse {
    src: string;
    alt: string;
  }
interface ImageRingBookProps {
    images: ImageResponse[];
}

const ImageRingBook: React.FC<ImageRingBookProps> = ({ images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [imageUrls, setImageUrls] = useState<ImageResponse[]>(images);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const images = await getImages();
                setImageUrls(images);
            } catch (error) {
                console.error('Error fetching images:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if(images.length === 0){
            fetchImages();
        }
    }, [images]);

    const goToPreviousImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
        );
    };

    const goToNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
        );
    };
    if(isLoading){
        return <div>Loading...</div>
    }
    return (
        <div data-testid="image-ring-book">
            <img
                src={imageUrls[currentImageIndex].src}
                alt={`image ${currentImageIndex + 1}`}
            />
            <div>
                <button onClick={goToPreviousImage} aria-label="previous">
                    Previous
                </button>
                <button onClick={goToNextImage} aria-label="next">
                    Next
                </button>
            </div>
        </div>
    );
};

export default ImageRingBook;

