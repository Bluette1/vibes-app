import React, { useState } from 'react';
import AudioPlayer from '../../components/AudioPlayer/AudioPlayer';
import ImageRingBook from '../../components/ImageRingBook/ImageRingBook';
import RingBookCover from '../../components/RingBookCover/RingBookCover';
import audio from '../../assets/audio/focused.mp3';

const Home: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {isOpen ? <ImageRingBook images={[]} /> : <RingBookCover onOpen={handleOpen} />}
      {isOpen && <AudioPlayer src={audio} />}
    </div>
  );
};

export default Home;
